const path = require('path');

const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
  // res.sendFile('/views/shop.html'); // this path doesnot work because '/' refers root folder on OS , not the root folder of project
  // res.sendFile('../views/shop.html'); //this also doesn't work since it is relative path. we need absolute path

  //path.join yields a path by concatenating the different segments. Slashes will be automataically added
  // __dirname is a global variable made available by nodejs , which holds the absolute path of the folder in which this file resides.
  res.sendFile(path.join(__dirname, '../', 'views', 'shop.html'));
});

module.exports = router;
