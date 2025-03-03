const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const deviceRoutes = require('./routes/deviceRoutes');
const controlRoutes = require('./routes/controlRoutes');
const mqttClient = require('./services/mqttService');
const { sequelize, DeviceStatus, UserLog } = require('./models');  // 确保引入相应的模型
const http = require('http');  
const WebSocket = require('ws');  
const topicSensor = 'sensor/data';
const topicControl = 'control/movement';
const app = express();
const server = http.createServer(app);  
const wss = new WebSocket.Server({ server });  
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/device', deviceRoutes);
app.use('/api/control', controlRoutes);

const clients = []; // 存储连接的 WebSocket 客户端

// 发送历史记录的函数
async function sendHistory(ws) {
    try {
        const history = await DeviceStatus.findAll({
            limit: 100,
            order: [['timestamp', 'DESC']]
        });
        ws.send(JSON.stringify({ type: 'historyUpdate', data: history }));
    } catch (error) {
        console.error('Error loading history:', error);
    }
}

// 发送最新设备状态的函数
async function sendLatestStatus(ws) {
    try {
        const latestStatus = await DeviceStatus.findOne({
            order: [['timestamp', 'DESC']]
        });
        if (latestStatus) {
            ws.send(JSON.stringify({ type: 'newStatus', data: latestStatus }));
        }
    } catch (error) {
        console.error('Error loading latest status:', error);
    }
}

// 发送日志的函数
async function sendLogs(ws) {
    try {
        const logs = await UserLog.findAll({
            limit: 100,
            order: [['timestamp', 'DESC']]
        });
        ws.send(JSON.stringify({ type: 'logsUpdate', data: logs }));
    } catch (error) {
        console.error('Error loading logs:', error);
    }
}

wss.on('connection', async (ws) => {
    console.log('Client connected to WebSocket');

     // 将当前连接的 ws 实例添加到 clients 数组中
    clients.push(ws);

    // 发送初始数据给新连接的客户端
    await sendHistory(ws);
    await sendLatestStatus(ws);
    await sendLogs(ws);

    ws.on('message', (message) => {
        console.log(`Received message from client: ${message}`);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        const index = clients.indexOf(ws);
        if (index !== -1) {
            clients.splice(index, 1);
        }
    });
});

mqttClient.on('message', async (topic, message) => {
    const msg = message.toString();

    if (topic === topicSensor) {
        // 解析传感器数据
        const regex = /Temperature: ([\d.]+) °C, Pressure: ([\d.]+) kPa, Depth: ([\d.]+) m/;
        const match = msg.match(regex);
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
    
            clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    sendHistory(client); // 重新发送历史记录
                    sendLatestStatus(client); // 重新发送最新状态
                }
            });    
        }
        else console.log("数据格式错误");
    } else if (topic === topicControl) {
        // 处理控制信号
        const action = msg; // 假设消息为 'forward', 'backward', etc.
        await UserLog.create({ action });
        clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                sendLogs(client); // 重新发送日志
            }
        });   
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
