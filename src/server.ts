import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import mqtt from "mqtt"

class MultiPlayerGameServer {
  private app = express()
  private httpServer = createServer(this.app)
  private io = new Server(this.httpServer)
  private port = process.env.PORT || 3000

  private MQTT_BROKER_URL: string =
    process.env.MQTT_BROKER_URL || "wss://escape-run.sj.ifsc.edu.br/mqtt"
  private mqttClient = mqtt.connect(this.MQTT_BROKER_URL)

  private timer!: NodeJS.Timeout

  constructor() {
    this.io.on("connection", (socket) => {
      console.log(`User ${socket.id} connected to the server`)

      socket.on("join", (room) => {
        socket.join(room)
        console.log(`User ${socket.id} joined room ${room}`)
      })

      socket.on("offer", (room, description) => {
        socket.to(room).emit("offer", description)
      })

      socket.on("candidate", (room, candidate) => {
        socket.to(room).emit("candidate", candidate)
      })

      socket.on("answer", (room, description) => {
        socket.to(room).emit("answer", description)
      })

      socket.on("disconnect", () => {})
    })

    this.httpServer.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`)
    })

    this.mqttClient.on("connect", () => {
      console.log("Connected to MQTT broker")

      setInterval(() => {
        this.mqttClient.publish("escape-run/ping", "server")
      }, 30000)

      setInterval(() => {
        this.mqttClient.publish("escape-run/devices/scene10/0", "audio_1")
      }, 600000)

      this.mqttClient.subscribe("escape-run/server/#", (err) => {
        if (err) {
          console.error("Failed to subscribe:", err)
        } else {
          console.log("Subscribed to topic: escape-run/server/#")
        }
      })

      this.mqttClient.on("message", (topic, payload) => {
        const msg = payload.toString()

        if (topic === "escape-run/server/start") {
          let counter: number = 2400

          counter = parseInt(msg, 10)
          if (isNaN(counter) || counter <= 0)
            console.error("Formato de mensagem inválido:", msg)

          this.setTimer(counter)
          this.mqttClient.publish("escape-run/player/scene", "Scene1")
        } else if (topic === "escape-run/server/scene") {
          this.mqttClient.publish("escape-run/player/scene", msg)
        } else if (topic === "escape-run/server/stop") {
          this.stopGame()
        }
      })
    })
  }

  private setTimer(duration: number) {
    if (this.timer) clearInterval(this.timer)

    this.timer = setInterval(() => {
      this.mqttClient.publish("escape-run/player/timer", duration.toString())
      duration--
      console.log("Timer:", duration)

      if (duration <= 0) {
        this.stopGame()
      }
    }, 1000)
  }

  private stopGame() {
    clearInterval(this.timer)
    this.mqttClient.publish("escape-run/devices/scene10/0", "audio_fim")
    this.mqttClient.publish("escape-run/player/scene", "Scene15")
  }
}

const server = new MultiPlayerGameServer()
