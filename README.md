# ANT+ Heart Rate Monitor to WebSocket ❤️

This application listens to ANT+ heart rate devices like Garmin smartwatches and sends the heart rate data via WebSockets. It can be used to monitor your heart rate on your PC or for other applications, such as syncing your heart rate with your avatar in VRChat using OSC.

This project is based on the [incyclist/ant-plus](https://github.com/incyclist/ant-plus) repository.
## Features 🌟

- Listen to ANT+ heart rate devices
- Send heart rate data via WebSockets
- Monitor heart rate on your PC or in other applications

## Prerequisites 📋

- Node.js 18.16.0 or higher
- [ANT+ Stick](https://www.garmin.com/en-US/p/10997) (I'm using the official Garmin stick)
- Docker (optional, for containerized deployment)

## Installation 💻

1. Clone the repository:

```bash
git clone https://github.com/yourusername/ant-plus-heart-rate-ws.git
cd ant-plus-heart-rate-ws
```

2. Install the dependencies:

```bash
npm install
```

## Running the application 🏃

3. Start the application:

```bash
node heart-rate.js

# if that doesn't work try running with sudo or as root
sudo node heart-rate.js
```

4. Connect your ANT+ heart rate device (e.g., Garmin smartwatch) and ensure it's within range. (On Garmin devices select `HF send` in the HF display)

5. The application will listen for heart rate data and send it via WebSockets on port 8080.

## Official Docker Image 🐳

An official Docker image is available at [unrea1/ant-plus-heart-rate-ws](https://hub.docker.com/r/unrea1/ant-plus-heart-rate-ws). You can pull the image using the following command:

```bash
docker pull unrea1/ant-plus-heart-rate-ws:1
```

## Building the Docker container 🛠️

6. Build the Docker image:

```bash
docker build -t ant-plus-heart-rate-ws:1 .
```

## Running the Docker container 🚀

7. Run the Docker container, passing through the Garmin USB device and mapping the WebSocket port:

```bash
docker run -p 8080:8080 --name ant-plus-heart-rate-ws --device /dev/bus/usb/001/002 unrea1/ant-plus-heart-rate-ws:1
```

Replace `/dev/bus/usb/001/002` with the path to your Garmin USB device. This can be found out with `lsusb`.

8. The container will start, and the application will listen for heart rate data and send it via WebSockets on port 8080.

## Configuration 🔧

The WebSocket server listens on port 8080 by default. You can change this by updating the `port` value in the `WebSocket.Server` configuration within the `heart-rate`.js script.