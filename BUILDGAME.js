// Add game scripts here
var scripts = [
  'src/states/playing.js',
  'src/config.js',
  'src/game.js'
];

function importGame() {
  console.log("Importing Game");
  var imported = 0;
  scripts.forEach(function(script) {
    var scriptTag = document.createElement('script');
    scriptTag.src = script;
    document.head.appendChild(scriptTag);
    imported++;
  });
  console.log(imported + " Scripts Imported");
}

function packageGame() {
  var fs = require('fs');
  var compressor = require('node-minify');

  // Clean build directory
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
  }

  if (fs.existsSync('dist/dist.js')) {
    fs.unlinkSync('dist/dist.js');
  }

  if (fs.existsSync('dist/dist.min.js')) {
    fs.unlinkSync('dist/dist.min.js');
  }

  // Write all script files defined above to a central dist file
  var stream = fs.createWriteStream('dist/dist.js', { flags: 'as' });
  scripts.forEach(function(script) {
    var scriptText = fs.readFileSync(script);
    stream.write(scriptText);
  });
  stream.end();

  // Minify dist file. Use setTimeout so stream above has time to close
  setTimeout(function() {
    compressor.minify({
      compressor: 'gcc',
      input: 'dist/dist.js',
      output: 'dist/dist.min.js',
      callback: function(err, min) {}
    });
  }, 100);
}

if(typeof(process) != "undefined" && process.argv[2]) {
  packageGame();
} else {
  importGame();
}
