const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize('NBFC_paymentsCheck', 'dbmasteruser', '%hy3])k$<${G:rY0[k:]>QcOZ;JUvK-C', {
//   host: 'ls-9ebc19b44f881f32b698f79e8b61368e3f5686a9.cxw76sd6irpv.ap-south-1.rds.amazonaws.com',
//   dialect: 'mysql', 
// });

const sequelize = new Sequelize('NBFCThree', 'dbmasteruser', '%hy3])k$<${G:rY0[k:]>QcOZ;JUvK-C', {
  host: 'ls-9ebc19b44f881f32b698f79e8b61368e3f5686a9.cxw76sd6irpv.ap-south-1.rds.amazonaws.com',
  dialect: 'mysql', 
});

module.exports = sequelize;