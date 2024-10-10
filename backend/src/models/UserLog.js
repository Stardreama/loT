const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('UserLog', {
        action: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        timestamps: true,
        createdAt: 'timestamp',
        updatedAt: false,
    });
};