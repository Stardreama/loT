let socket;

export const createWebSocketConnection = (onMessage) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
        socket = new WebSocket('ws://localhost:5000');  // 连接到 WebSocket 服务器

        socket.onopen = () => {
            console.log('Connected to WebSocket server');
            socket.send('Hello from the client!');
        };

        socket.onmessage = (event) => {
            console.log(`Message from server: ${event.data}`);
            if (onMessage) onMessage(JSON.parse(event.data));  // 解析消息并传给回调函数
        };
        socket.onclose = () => {
            console.log('WebSocket connection closed');
        };
    }
};

export const closeWebSocketConnection = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
    }
};
