const mqttBrokerUrl = "wss://escape-run.sj.ifsc.edu.br/mqtt"
const client = mqtt.connect(mqttBrokerUrl)
const logger = document.getElementById("mqtt-logger")
let messages = []

client.on("connect", () => {
  messages.push("Connected to MQTT broker")

  client.subscribe("escape-run/#", (err) => {
    if (!err) {
      messages.push("Subscribed to escape run topics")
    } else {
      messages.push(`Error subscribing: ${err}`)
    }

    client.on("message", (topic, message) => {
      messages.push(`${topic}: ${message.toString()}`)

      messages = messages.slice(-30)
      logger.innerHTML = messages.join("<br />")
    })
  })
})

function start() {
  let time = parseInt(document.getElementById("time").value)
  if (isNaN(time) || time <= 0) time = 2400

  client.publish("escape-run/server/start", time.toString())
}

function changeScene() {
  const scene = document.getElementById("scene").value

  client.publish("escape-run/server/scene", scene)
}

function stop() {
  client.publish("escape-run/server/stop", "0")
}
