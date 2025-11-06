from machine import Pin, reset  # pyright: ignore[reportMissingImports]
import network  # pyright: ignore[reportMissingImports]
from umqtt.robust import MQTTClient  # pyright: ignore[reportMissingImports]
from time import sleep

cofre = Pin(3, Pin.OUT)
sensor_presenca = Pin(4, Pin.IN)

wifi_ssid = "escape-run"
wifi_password = "escape-run"

mqtt_client_id = "scene7-0"
mqtt_broker = "escape-run.sj.ifsc.edu.br"
mqtt_topic_subscribe = "escape-run/scene7/0"
mqtt_topic_publish = "escape-run/player/scene"

vault_password = "859"
presenca_detectada = False


# === Setup inicial ===
def setup():
    cofre.on()  # Cofre trancado
    print("Cofre trancado e pronto")


# === Controle do Cofre ===
def open_cofre():
    global cofre
    cofre.off()
    print("Cofre aberto!")
    mqtt_client.publish(mqtt_topic_publish, "Scene8")
    print("Cena mudada para Scene8")


def close_cofre():
    global cofre
    cofre.on()
    print("Cofre trancado!")


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

    if msg == vault_password:
        open_cofre()  # Abre cofre e muda para Scene8
    elif msg == "close":
        close_cofre()
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
        mqtt_client.check_msg()

        # Detecta entrada e manda Scene7 apenas uma vez
        if not presenca_detectada and sensor_presenca.value() == 1:
            print("Presença detectada! Indo para Scene7...")
            mqtt_client.publish(mqtt_topic_publish, "Scene7")
            presenca_detectada = True  # só dispara uma vez

        sleep(1)
