const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('DeviceStatus', {
        temperature: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        pressure: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        depth: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    }, {
        timestamps: true,
        createdAt: 'timestamp',
        updatedAt: false,
    });
};

