import mqtt from "mqtt"

class MultiPlayerGameServer {
  private mqttClient!: mqtt.MqttClient
  private timer!: NodeJS.Timeout
  private password: string = process.env.PASSWORD || "escape-run"

  constructor() {
    const MQTT_BROKER_URL =
      process.env.MQTT_BROKER_URL || "wss://escape-run.sj.ifsc.edu.br/mqtt"
    this.mqttClient = mqtt.connect(MQTT_BROKER_URL)

    this.mqttClient.on("connect", () => {
      console.log("Connected to MQTT broker")

      this.mqttClient.subscribe("escape-run/server/#", (err) => {
        if (err) {
          console.error("Falha ao inscrever-se:", err)
        } else {
          console.log("Inscrito no tópico: escape-run/server/#")
        }
      })

      this.mqttClient.on("message", (topic, payload) => {
        console.log(payload.toString())
        const password = JSON.parse(payload.toString()).password

        if (password === this.password) {
          if (topic === "escape-run/server/start") {
            let counter: number = 2400
            try {
              counter = parseInt(JSON.parse(payload.toString()).time, 10)
            } catch {
              console.error("Formato de mensagem inválido:", payload.toString())
            }

            this.startGame(counter)
          } else if (topic === "escape-run/server/scene") {
            const scene = JSON.parse(payload.toString()).scene

            this.changeScene(scene)
          } else if (topic === "escape-run/server/stop") {
            this.stopGame()
          }
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

  private startGame(duration: number) {
    console.log("Jogo iniciado:", duration)

    this.setTimer(duration)
    this.mqttClient.publish("escape-run/player/scene", "Scene1")
  }

  private changeScene(scene: string) {
    console.log("Mudando para a cena:", scene)
    this.mqttClient.publish("escape-run/player/scene", scene)
  }

  private stopGame() {
    console.log("Jogo parado!")

    this.setTimer(0)
    this.mqttClient.publish("escape-run/player/scene", "Scene15")
  }
}

const server = new MultiPlayerGameServer()
