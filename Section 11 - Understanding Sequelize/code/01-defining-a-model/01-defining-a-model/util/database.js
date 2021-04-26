const Sequelize = require('sequelize');

// dialect can be set to MySQL to make it clear that we connect to a 
// MySQL database because different SQL engines or databases use slightly different SQL syntax 
//host will be 'localhost' by default. We need not specify explicitly.
const sequelize = new Sequelize('node-complete', 'root', 'nodecomplete', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;
