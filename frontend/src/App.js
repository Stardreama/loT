// app.js
import React, { useEffect, useState } from "react";
import { Table, Button, Space, Card, Typography, message } from "antd";
import { sendControl } from "./services/api"; // 导入 sendControl 函数
import "./App.css";

const { Title } = Typography;

function App() {
  const [status, setStatus] = useState({
    temperature: 0,
    pressure: 0,
    depth: 0,
  });
  const [history, setHistory] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5000");

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "newStatus") {
        setStatus(message.data);
      } else if (message.type === "historyUpdate") {
        setHistory(message.data);
      } else if (message.type === "logsUpdate") {
        setLogs(message.data);
      }
    };

    ws.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    const handleKeyUp = (e) => {
      if (e.key === 'w' || e.key === 'W') handleControl("forward");
      else if (e.key === 'a' || e.key === 'A') handleControl("left");
      else if (e.key === 's' || e.key === 'S') handleControl("backward");
      else if (e.key === 'd' || e.key === 'D') handleControl("right");
      else message.error("按键错误");
    };
  
    document.addEventListener('keyup', handleKeyUp);
  
    return () => {
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  

  const handleControl = async (direction) => {
    try {
      console.log("进入处理移动逻辑");
      await sendControl(direction); // 调用 API 发送控制指令
      message.success(`控制指令已发送: ${direction}`);
    } catch (error) {
      console.error("控制指令发送失败:", error);
      message.error("发送控制指令时出错");
    }
  };

  const historyColumns = [
    {
      title: "时间",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "温度 (°C)",
      dataIndex: "temperature",
      key: "temperature",
    },
    {
      title: "气压 (kPa)",
      dataIndex: "pressure",
      key: "pressure",
    },
    {
      title: "深度 (m)",
      dataIndex: "depth",
      key: "depth",
    },
  ];

  const logsColumns = [
    {
      title: "时间",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "用户操作",
      dataIndex: "action",
      key: "action",
    },
  ];

  return (
    <div className="App">
      <Title level={2} className="title">
        水下机器人控制平台
      </Title>
      <Space className="controls" direction="vertical">
        <Button onClick={() => handleControl("forward")}>前进</Button>
        <Space direction="horizontal">
          <Button onClick={() => handleControl("left")}>左转</Button>
          <Button onClick={() => handleControl("right")}>右转</Button>
        </Space>
        <Button onClick={() => handleControl("backward")}>后退</Button>
      </Space>
      <Card className="status-card">
        <Title level={3}>设备状态</Title>
        <div className="status">
          <p>温度: {status.temperature} °C</p>
          <p>气压: {status.pressure} kPa</p>
          <p>深度: {status.depth} m</p>
        </div>
      </Card>
      <Card className="history-card">
        <Title level={3}>历史记录</Title>
        <Table
          columns={historyColumns}
          dataSource={history}
          pagination={false}
          scroll={{ y: "300px" }}
        />
      </Card>
      <Card className="logs-card">
        <Title level={3}>用户操作日志</Title>
        <Table
          columns={logsColumns}
          dataSource={logs}
          pagination={false}
          scroll={{ y: "300px" }}
        />
      </Card>
    </div>
  );
}

export default App;
