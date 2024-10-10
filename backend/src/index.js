const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const deviceRoutes = require('./routes/deviceRoutes');
const controlRoutes = require('./routes/controlRoutes');
const mqttClient = require('./services/mqttService');
const { sequelize } = require('./models');

const app = express();
const PORT = 5000;

// 中间件
app.use(cors());
app.use(bodyParser.json());

// 路由
app.use('/api/device', deviceRoutes);
app.use('/api/control', controlRoutes);

// 启动服务器
app.listen(PORT, async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to MySQL');
        console.log(`Server is running on http://localhost:${PORT}`);
    } catch (err) {
        console.error('Unable to connect to the database:', err);
    }
});

