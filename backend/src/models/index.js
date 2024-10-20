const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('iot_platform', 'root', '20050127a', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,  // 禁用日志输出
});

const DeviceStatus = require('./DeviceStatus')(sequelize);
const UserLog = require('./UserLog')(sequelize);

// 关联模型（如有需要）

sequelize.sync()
    .then(() => {
        console.log('Database & tables created!');
    })
    .catch(err => {
        console.error('Error syncing database:', err);
    });

module.exports = {
    sequelize,
    DeviceStatus,
    UserLog,
};
