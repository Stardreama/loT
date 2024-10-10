const mqtt = require('mqtt');
const { DeviceStatus, UserLog } = require('../models');

const broker = '172.6.0.240'; // 替换为您的 MQTT Broker 地址
const port = 1883;
const topicSensor = 'sensor/data';
const topicControl = 'control/movement';

const client = mqtt.connect(`mqtt://${broker}:${port}`);

client.on('connect', () => {
    console.log('Connected to MQTT Broker');
    client.subscribe(topicSensor, (err) => {
        if (!err) {
            console.log(`Subscribed to ${topicSensor}`);
        }
    });

    client.subscribe(topicControl, (err) => {
        if (!err) {
            console.log(`Subscribed to ${topicControl}`);
        }
    });
});

client.on('message', async (topic, message) => {
    const msg = message.toString();
    console.log(`Received message: ${msg} on topic ${topic}`);

    if (topic === topicSensor) {
        // 解析传感器数据
        const regex = /Temperature: ([\d.]+) °C, Pressure: ([\d.]+) kPa, Depth: ([\d.]+) m/;
        const match = msg.match(regex);
        if (match) {
            const temperature = parseFloat(match[1]);
            const pressure = parseFloat(match[2]);
            const depth = parseFloat(match[3]);

            // 存储到数据库
            await DeviceStatus.create({ temperature, pressure, depth });
        }
    } else if (topic === topicControl) {
        // 处理控制信号
        const action = msg; // 假设消息为 'forward', 'backward', etc.
        await UserLog.create({ action });
    }
});

module.exports = client;
