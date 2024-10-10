import paho.mqtt.client as mqtt
import random
import time
import threading

# MQTT服务器设置
broker = "172.6.0.240"  # MQTT代理地址
port = 1883  # MQTT代理端口
topic_sensor = "sensor/data"
topic_control = "control/movement"

# 传感器值
temperature = 0.0
pressure = 0.0
depth = 0.0

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected to MQTT Broker")
        client.subscribe(topic_control)
    else:
        print(f"Failed to connect, return code {rc}")

def on_message(client, userdata, msg):
    action = msg.payload.decode()
    print(f"Received action: {action} on topic {msg.topic}")
    # 处理动作，例如打印或控制虚拟设备
    if action in ['forward', 'backward', 'left', 'right']:
        print(f"Executing action: {action}")
    else:
        print("Unknown action")

def publish_sensor_data(client):
    global temperature, pressure, depth
    while True:
        # 模拟传感器数据
        temperature = round(random.uniform(15.0, 30.0), 2)  # 温度范围 15-30℃
        pressure = round(random.uniform(95.0, 105.0), 2)  # 气压范围 95-105 KPa
        depth = round(random.uniform(0.0, 10.0), 2)        # 深度范围 0-10 M

        # 发布传感器数据
        payload = f"Temperature: {temperature} °C, Pressure: {pressure} kPa, Depth: {depth} m"
        client.publish(topic_sensor, payload)
        print(f"Published: {payload}")
        time.sleep(10)  # 每10秒发布一次

if __name__ == "__main__":
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message

    client.connect(broker, port, 60)

    # 启动发布传感器数据的线程
    sensor_thread = threading.Thread(target=publish_sensor_data, args=(client,))
    sensor_thread.start()

    # 启动MQTT客户端的网络循环
    client.loop_forever()
