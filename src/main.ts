import { Game, Types } from "phaser"
import mqtt from "mqtt"
import config from "./config"

class MultiPlayerGame extends Game {
  mqttClient: mqtt.MqttClient
  minutes: string = "00"
  seconds: string = "00"

  currentScene: string = "Boot"

  constructor(config: Types.Core.GameConfig) {
    super(config)

    // MQTT
    this.mqttClient = mqtt.connect("wss://escape-run.sj.ifsc.edu.br/mqtt")

    this.mqttClient.on("connect", () => {
      console.log("Connected to MQTT broker")
    })

    this.mqttClient.subscribe("escape-run/player/#", (err) => {
      if (!err) {
        console.log("Subscribed to Escape Run player subtopics")
      }
    })

    this.mqttClient.on("message", (topic, payload) => {
      if (topic === "escape-run/player/scene") {
        const scene = payload.toString()

        if (this.scene.keys[scene]) {
          console.log(`Mudando de ${this.currentScene} para ${scene}`)
          this.scene.stop(this.currentScene)
          this.scene.start(scene)
          this.currentScene = scene
        } else {
          console.warn(`Cena ${scene} não existe!`)
        }
      } else if (topic === "escape-run/player/timer") {
        const counter = JSON.parse(payload.toString())

        if (!isNaN(counter)) {
          this.minutes = String(Math.floor(counter / 60)).padStart(2, "0")
          this.seconds = String(Math.floor(counter % 60)).padStart(2, "0")
          console.log("Tempo atualizado:", this.minutes, ":", this.seconds)
        } else {
          console.warn(`Contador de tempo inválido: ${payload.toString()}`)
        }
      } else if (topic === "escape-run/player/error") {
        try {
          navigator.vibrate(1000)
        } catch {
          console.error("Sem suporte a Vibration API.")
        }

        window.alert(`Erro: ${payload.toString()}`)
      }
    })
  }
}

export default new MultiPlayerGame(config)
