import { Game, Types } from "phaser"
import mqtt from "mqtt"
import config from "./config"

class MultiPlayerGame extends Game {
  mqttClient: mqtt.MqttClient

  counter: number = 0
  minutes: string = "00"
  seconds: string = "00"

  scene8Delay: number = 0
  scene8Minutes: string = "10"
  scene8Seconds: string = "00"

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
          this.scene.stop(this.currentScene)

          if (window.document.querySelector("#camera-video"))
            window.document.querySelector("#camera-video")?.remove()

          this.scene.start(scene)

          if (scene === "Scene8") {
            this.scene8Delay = this.counter - 600
          }

          this.currentScene = scene
        } else {
          console.warn(`Cena ${scene} não existe!`)
        }
      } else if (topic === "escape-run/player/timer") {
        this.counter = JSON.parse(payload.toString())

        if (!isNaN(this.counter)) {
          this.minutes = String(Math.floor(this.counter / 60)).padStart(2, "0")
          this.seconds = String(Math.floor(this.counter % 60)).padStart(2, "0")

          let remaining
          if (this.currentScene === "Scene8") {
            remaining = this.counter - this.scene8Delay
            this.scene8Minutes = String(Math.floor(remaining / 60)).padStart(
              2,
              "0"
            )
            this.scene8Seconds = String(Math.floor(remaining % 60)).padStart(
              2,
              "0"
            )
          }

          if (remaining === 0 && this.currentScene === "Scene8") {
            this.mqttClient.publish("escape-run/player/scene", "Scene15")
          }
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
