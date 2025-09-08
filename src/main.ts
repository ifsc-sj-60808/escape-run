import { Game, Types } from "phaser";
import mqtt from "mqtt";
import config from "./config";

class MultiPlayerGame extends Game {
  mqttClient: mqtt.MqttClient;
  score: integer = 0;

  timer: integer = 0;
  minutes: integer = 0;
  seconds: integer = 0;
  clock: NodeJS.Timeout;

  currentScene: string = "Boot";

  constructor(config: Types.Core.GameConfig) {
    super(config);

    // MQTT
    this.mqttClient = mqtt.connect("wss://mqtt.feira-de-jogos.dev.br/mqtt");

    this.mqttClient.on("connect", () => {
      console.log("Connected to MQTT broker");
    });

    this.mqttClient.subscribe("escape-run/player/#", (err) => {
      if (!err) {
        console.log("Subscribed to Escape Run player subtopics");
      }
    });

    this.mqttClient.on("message", (topic, payload) => {
      if (topic === "escape-run/player/scene") {
        const scene = payload.toString();

        if (this.scene.keys[scene]) {
          console.log(`Mudando de ${this.currentScene} para ${scene}`);
          this.scene.stop(this.currentScene);
          this.scene.start(scene);
          this.currentScene = scene;
        } else {
          console.warn(`Cena ${scene} não existe!`);
        }
      } else if (topic === "escape-run/player/score") {
        const score = parseInt(payload.toString(), 10);

        if (!isNaN(score)) {
          this.score += score;
          console.log("Pontuação atualizada:", this.score);
        } else {
          console.warn(`Pontuação inválida recebida: ${payload.toString()}`);
        }
      }
    });

    // Timer
    this.timer = 2400;
    
    this.clock = setInterval(() => {
      this.timer--;
      this.minutes = Math.floor(this.timer / 60);
      this.seconds = Math.floor(this.timer % 60);

      if (this.timer <= 0) {
        clearInterval(this.clock);
        this.mqttClient.publish("escape-run/player/scene", "sad-ending");
        this.scene.start("sad-ending");
      }
    }, 1000);
  }
}

export default new MultiPlayerGame(config);
