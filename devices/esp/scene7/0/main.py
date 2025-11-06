from machine import Pin, reset  # pyright: ignore[reportMissingImports]
import network  # pyright: ignore[reportMissingImports]
from umqtt.robust import MQTTClient  # pyright: ignore[reportMissingImports]
from time import sleep

vault = Pin(3, Pin.OUT)
sensor_presenca = Pin(4, Pin.IN)

wifi_ssid = "escape-run"
wifi_password = "escape-run"

mqtt_client_id = "scene7-0"
mqtt_broker = "escape-run.sj.ifsc.edu.br"
mqtt_topic_subscribe = "escape-run/devices/scene7/0"
mqtt_topic_publish = "escape-run/player/scene"

vault_password = "859"


def setup():
    vault.on()


def open_vault():
    global vault
    vault.off()

    mqtt_client.publish(mqtt_topic_publish, "Scene8")


def close_vault():
    global vault
    vault.on()


# === Conexão Wi-Fi ===
def connect_wifi():
    wlan = network.WLAN()
    wlan.active(True)
    wlan.connect(wifi_ssid, wifi_password)

    while not wlan.isconnected():
        print("Conectando ao Wi-Fi...")
        sleep(1)

    print("Conectado ao Wi-Fi!")


# === Conexão MQTT ===
def connect_mqtt():
    client = MQTTClient(mqtt_client_id, mqtt_broker)
    client.set_callback(callback)
    client.connect()
    print("Conectado ao broker MQTT!")
    return client


# === Callback de mensagens MQTT ===
def callback(topic, payload):
    msg = payload.decode().strip()
    print("Mensagem recebida:", msg)

    if msg == "859":
        open_vault()

    elif msg == "close":
        close_vault()

    elif msg == "reset":
        print("Reiniciando ESP32...")
        reset()


# === Assinatura do tópico ===
def subscribe(client):
    client.subscribe(mqtt_topic_subscribe)
    print("Assinado em:", mqtt_topic_subscribe)


# === Loop principal ===
if __name__ == "__main__":
    setup()
    connect_wifi()

    mqtt_client = connect_mqtt()
    subscribe(mqtt_client)

    presenca_detectada = False

    while True:
        if not presenca_detectada and sensor_presenca.value() == 1:
            print("Presença detectada! Indo para Scene7...")
            mqtt_client.publish(mqtt_topic_publish, "Scene7")
            presenca_detectada = True

        mqtt_client.check_msg()
        sleep(1)
