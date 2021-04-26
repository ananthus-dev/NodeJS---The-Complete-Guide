const path = require('path');

//path.dirname() returns directory name of a given file
//process.mainModule refers to the main module which started the application , i.e the module created in app.js
//process.mainModule.filename gives the name of the file in which the main module was spun up, i.e app.js
//i.e in the end we get the absolute path of the directory which contains app.js
module.exports = path.dirname(process.mainModule.filename);