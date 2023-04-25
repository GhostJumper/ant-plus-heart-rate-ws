const { HeartRateSensor } = require('incyclist-ant-plus')
const { AntDevice } = require('incyclist-ant-plus/lib/bindings')
const WebSocket = require('ws')

const ant = new AntDevice({ startupTimeout: 2000 })

const sleep = async ms => new Promise(resolve => setTimeout(resolve, ms))

let opened = false
let previousHeartRate = null

const wss = new WebSocket.Server({ port: 8080 })

wss.on('connection', ws => {
    console.log('Client connected')

    ws.on('message', message => {
        console.log('Received:', message)
    })

    ws.on('close', () => {
        console.log('Client disconnected')
    })
})

function sendDataToClients(data) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data))
        }
    })
}

async function main(deviceID = -1) {
    while (!opened) {
        opened = await ant.open()

        if (!opened) {
            console.log('Could not open Ant Stick')
            await sleep(5000)
        } else {
            console.log('Device opened')
        }
    }

    const channel = await ant.getChannel()
    if (!channel) {
        console.log('Could not open channel')
        return
    }

    const sensor = new HeartRateSensor(deviceID === -1 ? undefined : deviceID)
    channel.on('data', onData)

    if (deviceID === -1) {
        console.log('Scanning for sensor(s)')
        channel.startScanner()
    } else {
        console.log(`Connecting with id=${deviceID}`)
        const started = await channel.startSensor(sensor)

        if (!started) {
            console.log('Could not start sensor')
            ant.close()
        }
    }

    channel.attach(sensor)
}

function onData(profile, deviceID, data) {
    const heartRate = data.ComputedHeartRate

    if (heartRate !== previousHeartRate) {
        console.log(`id: ANT+${profile} ${deviceID}, heart rate: ${heartRate}`)
        sendDataToClients({ profile, deviceID, heartRate })
        previousHeartRate = heartRate
    }
}

async function onAppExit() {
    if (opened) {
        await ant.close()
    }

    process.exit()
}

process.on('SIGINT', onAppExit)  // CTRL+C
process.on('SIGQUIT', onAppExit) // Keyboard quit
process.on('SIGTERM', onAppExit) // `kill` command

const args = process.argv.slice(2)
const deviceID = args.length > 0 ? args[0] : undefined

main(deviceID)
