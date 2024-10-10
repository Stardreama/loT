const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const deviceRoutes = require('./routes/deviceRoutes');
const controlRoutes = require('./routes/controlRoutes');
const mqttClient = require('./services/mqttService');
const { sequelize, DeviceStatus, UserLog } = require('./models');  // 确保引入相应的模型
const http = require('http');  
const WebSocket = require('ws');  

const app = express();
const server = http.createServer(app);  
const wss = new WebSocket.Server({ server });  
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/device', deviceRoutes);
app.use('/api/control', controlRoutes);

wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');
    
    ws.on('message', (message) => {
        console.log(`Received message from client: ${message}`);
    });

    ws.send(JSON.stringify({ message: 'Welcome to WebSocket server' }));

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// 广播函数
const broadcast = (data) => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
};

// 处理 MQTT 消息并广播
mqttClient.on('message', async (topic, message) => {
    console.log(`MQTT message received: ${message}`);
    const messageStr = message.toString();

    const regex = /Temperature: ([\d.]+) °C, Pressure: ([\d.]+) kPa, Depth: ([\d.]+) m/;
    const match = messageStr.match(regex);

    if (match) {
        const temperature = parseFloat(match[1]);
        const pressure = parseFloat(match[2]);
        const depth = parseFloat(match[3]);

        const data = {
            temperature,
            pressure,
            depth
        };
        console.log('Parsed data:', data);
        
        // 保存设备状态到数据库
        await DeviceStatus.create({
            temperature,
            pressure,
            depth,
            timestamp: new Date()
        });

        // 广播新设备状态
        broadcast({ type: 'newStatus', data });

        // 查询最新的历史记录和用户操作日志并广播
        const history = await DeviceStatus.findAll({
            limit: 100,
            order: [['timestamp', 'DESC']]
        });
        broadcast({ type: 'historyUpdate', data: history });

        const logs = await UserLog.findAll({
            limit: 100,
            order: [['timestamp', 'DESC']]
        });
        broadcast({ type: 'logsUpdate', data: logs });
    } else {
        console.error('Failed to parse MQTT message:', messageStr);
    }
});

// 启动服务器
server.listen(PORT, async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to MySQL');
        console.log(`Server is running on http://localhost:${PORT}`);
    } catch (err) {
        console.error('Unable to connect to the database:', err);
    }
});
