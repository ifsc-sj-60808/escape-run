import { Game, Types } from "phaser";
import mqtt from "mqtt";
import config from "./config";

class MultiPlayerGame extends Game {
  mqttClient: mqtt.MqttClient;
  score: integer = 0;

  constructor(config: Types.Core.GameConfig) {
    super(config);

    this.mqttClient = mqtt.connect("wss://feira-de-jogos.dev.br/mqtt");

    this.mqttClient.on("connect", () => {
      console.log("Connected to MQTT broker");
    });

    this.mqttClient.subscribe("escape-run/#", (err) => {
      if (!err) {
        console.log("Subscribed to Escape Run subtopics");
      }
    });

    this.mqttClient.on("message", (topic, payload) => {
      if (topic === "escape-run/scene") {
        const scene = payload.toString();
        
        if (this.scene.keys[scene]) {
          console.log("Mudando para a cena:", scene);
          this.scene.start(scene);
        } else {
          console.warn(`Cena ${scene} não existe!`);
        }
      } else if (topic === "escape-run/score") {
        const score = parseInt(payload.toString(), 10);

        if (!isNaN(score)) {
          this.score += score;
          console.log("Pontuação atualizada:", this.score);
        } else {
          console.warn(`Pontuação inválida recebida: ${payload.toString()}`);
        }
      }
    });
  }
}

export default new MultiPlayerGame(config);
