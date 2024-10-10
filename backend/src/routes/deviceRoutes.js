const express = require('express');
const router = express.Router();
const { DeviceStatus, UserLog } = require('../models');

// 获取最新设备状态
router.get('/status', async (req, res) => {
    try {
        const latestStatus = await DeviceStatus.findOne({
            order: [['timestamp', 'DESC']],
        });
        res.json(latestStatus);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 获取历史设备状态
router.get('/status/history', async (req, res) => {
    try {
        const history = await DeviceStatus.findAll({
            order: [['timestamp', 'DESC']],
            limit: 100, // 可根据需求调整
        });
        res.json(history);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 获取用户操作日志
router.get('/logs', async (req, res) => {
    try {
        const logs = await UserLog.findAll({
            order: [['timestamp', 'DESC']],
            limit: 100,
        });
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

