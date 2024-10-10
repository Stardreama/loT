# IoT Project

Welcome to the IoT Project! This project demonstrates the integration of Internet of Things (IoT) devices using MQTT communication. It includes features for monitoring device statuses and logging user operations in real-time.

## Table of Contents

- [IoT Project](#iot-project)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Technologies Used](#technologies-used)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)

## Features

- **Real-Time Device Status Monitoring:** Monitor the status of IoT devices in real time.
- **User Operation Logs:** Log user operations for better tracking and management.
- **MQTT Communication:** Utilize MQTT protocol for efficient communication between devices.
- **User-Friendly Interface:** An intuitive interface for easy interaction with devices.

## Technologies Used

- **Frontend:** React
- **Backend:** Node.js
- **MQTT Library:** Paho-MQTT
- **Database:** (Specify your database here, e.g., MongoDB, MySQL)
- **Styling:** (Specify any CSS frameworks or libraries used, e.g., Bootstrap, Tailwind CSS)

## Getting Started

### Prerequisites

To run this project, you'll need to have the following installed:

- Node.js (version X.X.X)
- npm (version X.X.X)
- A local or remote MQTT broker (e.g., Mosquitto)

### Installation

1.Clone the repository:

```bash
   git clone https://github.com/Stardreama/loT.git
   cd loT
```

2.Install the required dependencies:

```bash
cd backend
npm install
cd loT
cd frontend
npm install
```

3.Start the backend server:

```bash
cd backend
npm run dev
```

4.Start the frontend application:

```bash
cd frontend
npm start
```

5.start mqtt

```python
cd mqtt_simulator
python mqtt_simulator.py
```
