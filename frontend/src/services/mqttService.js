import mqtt from 'mqtt';

const brokerUrl = 'ws://172.6.0.240:8083/mqtt'; // 确保 MQTT Broker 支持 WebSocket

const client = mqtt.connect(brokerUrl);

client.on('connect', () => {
    console.log('Connected to MQTT Broker');
    client.subscribe('sensor/data', (err) => {
        if (!err) {
            console.log('Subscribed to sensor/data');
        }
    });
});

const subscribeSensor = (callback) => {
    client.on('message', (topic, message) => {
        if (topic === 'sensor/data') {
            callback(message.toString());
        }
    });
};

const publishControl = (action) => {
    client.publish('control/movement', action);
};

export { subscribeSensor, publishControl };

