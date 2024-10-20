const express = require('express');
const router = express.Router();
const mqttClient = require('../services/mqttService');
const { UserLog } = require('../models');

// 控制设备移动
router.post('/move', async (req, res) => {
    console.log("发送到后端");
    
    const { direction } = req.body; // 'forward', 'backward', 'left', 'right'
    if (!['forward', 'backward', 'left', 'right'].includes(direction)) {
        return res.status(400).json({ error: 'Invalid direction' });
    }

    // 发布控制信号到 MQTT
    mqttClient.publish('control/movement', direction, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to publish message' });
        }
    });

    // // 记录用户操作日志
    // await UserLog.create({ action: direction });

    res.json({ status: 'Message sent' });
    console.log("后端接收完成");
    
});

module.exports = router;

