// Add game scripts here
var scripts = [
  'js/config.js',
  'js/game.js'
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

  var stream = fs.createWriteStream('dist.js', { flags: 'a' });
  scripts.forEach(function(script) {
    var scriptText = fs.readFileSync(script);
    stream.write(scriptText);
  });
  stream.end();
}

if(typeof(process) != "undefined" && process.argv[2]) {
  packageGame();
}
