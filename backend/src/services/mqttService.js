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
        else{
            console.log(err);
            
        }
    });
});

// client.on('message', async (topic, message) => {
//     const msg = message.toString();
//     //console.log(`Received message: ${msg} on topic ${topic}`);

//     if (topic === topicSensor) {
//         // 解析传感器数据
//         const regex = /Temperature: ([\d.]+) °C, Pressure: ([\d.]+) kPa, Depth: ([\d.]+) m/;
//         const match = msg.match(regex);
//         if (match) {
//             const temperature = parseFloat(match[1]);
//             const pressure = parseFloat(match[2]);
//             const depth = parseFloat(match[3]);

//             // 存储到数据库
//             await DeviceStatus.create({ temperature, pressure, depth });
//         }
//     } else if (topic === topicControl) {
//         // 处理控制信号
//         const action = msg; // 假设消息为 'forward', 'backward', etc.
//         await UserLog.create({ action });
//     }
// });
// mqttClient.on('message', async (topic, message) => {
//     //console.log(`MQTT message received: ${message}`);
//     const messageStr = message.toString();

//     const regex = /Temperature: ([\d.]+) °C, Pressure: ([\d.]+) kPa, Depth: ([\d.]+) m/;
//     const match = messageStr.match(regex);

//     if (match) {
//         const temperature = parseFloat(match[1]);
//         const pressure = parseFloat(match[2]);
//         const depth = parseFloat(match[3]);

//         const data = {
//             temperature,
//             pressure,
//             depth
//         };

//         console.log('Parsed data:', data);
        
//         // 保存设备状态到数据库
//         await DeviceStatus.create({
//             temperature,
//             pressure,
//             depth,
//             timestamp: new Date()
//         });

//         clients.forEach(client => {
//             if (client.readyState === WebSocket.OPEN) {
//                 sendHistory(client); // 重新发送历史记录
//                 sendLatestStatus(client); // 重新发送最新状态
//                 sendLogs(client); // 重新发送日志
//             }
//         });
//     } else {
//         console.error('Failed to parse MQTT message:', messageStr);
//     }
// });
module.exports = client;
