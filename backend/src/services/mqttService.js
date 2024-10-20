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
module.exports = client;
