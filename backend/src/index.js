const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const deviceRoutes = require('./routes/deviceRoutes');
const controlRoutes = require('./routes/controlRoutes');
const mqttClient = require('./services/mqttService');
const { sequelize } = require('./models');
const http = require('http');  // 引入 http 模块
const WebSocket = require('ws');  // 引入 WebSocket 库

const app = express();
const server = http.createServer(app);  // 创建 HTTP 服务器
const wss = new WebSocket.Server({ server });  // 创建 WebSocket 服务器
const PORT = 5000;

// 中间件
app.use(cors());
app.use(bodyParser.json());

// 路由
app.use('/api/device', deviceRoutes);
app.use('/api/control', controlRoutes);

// WebSocket 连接
wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');
    
    ws.on('message', (message) => {
        console.log(`Received message from client: ${message}`);
        // 可以根据需求处理消息并将更新发送给客户端
    });

    // 发送测试消息
    ws.send(JSON.stringify({ message: 'Welcome to WebSocket server' }));

    ws.on('close', () => {
        console.log('Client disconnected');
    });
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

// 可以将 WebSocket 消息广播到所有连接的客户端
const broadcast = (data) => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
};

// 示例：可以在某个事件中调用广播方法，例如 MQTT 消息到达时广播
mqttClient.on('message', (topic, message) => {
    console.log(`MQTT message received: ${message}`);

    // 将 MQTT 消息转换为字符串
    const messageStr = message.toString();

    // 使用正则表达式解析消息
    const regex = /Temperature: ([\d.]+) °C, Pressure: ([\d.]+) kPa, Depth: ([\d.]+) m/;
    const match = messageStr.match(regex);

    if (match) {
        // 提取匹配到的数据
        const temperature = parseFloat(match[1]);
        const pressure = parseFloat(match[2]);
        const depth = parseFloat(match[3]);

        // 创建一个数据对象
        const data = {
            temperature,
            pressure,
            depth
        };

        // 打印解析后的数据
        console.log('Parsed data:', data);

        // 将数据广播给所有 WebSocket 客户端
        broadcast(data);
    } else {
        console.error('Failed to parse MQTT message:', messageStr);
    }
});
