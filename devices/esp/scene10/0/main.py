from machine import Pin
import network
from umqtt.robust import MQTTClient
from time import sleep

# === Pinos ===
led = Pin(2, Pin.OUT)  # LED de Status


switch1 = Pin(23, Pin.IN, Pin.PULL_UP)
switch2 = Pin(22, Pin.IN, Pin.PULL_UP)
switch3 = Pin(18, Pin.IN, Pin.PULL_UP)
switch4 = Pin(19, Pin.IN, Pin.PULL_UP)

pista_luzes = Pin(12, Pin.OUT)
globo_motor = Pin(13, Pin.OUT)
# ----------------------------------------

wifi_ssid = "escape-run"
wifi_password = "escape-run"

mqtt_client_id = "scene10-0"
mqtt_broker = "escape-run.sj.ifsc.edu.br"
mqtt_topic_subscribe = "escape-run/devices/scene10/0"
mqtt_topic_publish_scene = "escape-run/player/scene"

# === Configurações ===
# --- CORRIGIDO 3: Senha ---
# A senha visual é [OFF, ON, ON, OFF]
# Com PULL_UP, a lógica é invertida: OFF=1, ON=0
# A senha correta no código é:
switch_password = [1, 0, 0, 1]
puzzle_resolvido = False


def setup():
    led.off()
    # Garante que a pista e o globo comecem desligados
    pista_luzes.off()
    globo_motor.off()
    # blink()


def blink():
    for _ in range(3):
        sleep(0.1)
        led.off()
        sleep(0.1)
        led.on()


def connect_wifi():
    wlan = network.WLAN()
    wlan.active(True)
    wlan.connect(wifi_ssid, wifi_password)

    while not wlan.isconnected():
        print("Connecting to Wi-Fi...")
        sleep(1)

    print("Connected to Wi-Fi!")


def connect_mqtt():
    client = MQTTClient(mqtt_client_id, mqtt_broker)
    client.connect()
    client.set_callback(callback)
    print("Connected to MQTT broker!")

    led.on()

    return client


def callback(topic, payload):
    msg = payload.decode()
    print("Received message:", msg)

    if msg == "reset":
        reset()
    elif msg == "on":
        led.on()
    elif msg == "off":
        led.off()


def subscribe(client):
    client.subscribe(mqtt_topic_subscribe)
    print("Subscribed to device topic:", mqtt_topic_subscribe)


if __name__ == "__main__":
    setup()
    connect_wifi()
    mqtt_client = connect_mqtt()

    subscribe(mqtt_client)

    puzzle_resolvido = False
    print("Lendo os interruptores da Cena 10...")

    while True:
        mqtt_client.check_msg()

        if not puzzle_resolvido:
            estado_atual = [
                switch1.value(),
                switch2.value(),
                switch3.value(),
                switch4.value(),
            ]

            if estado_atual == switch_password:
                print("Sequência correta! Acionando pista, globo e avançando cena!")

                # 1. LIGA O HARDWARE
                pista_luzes.on()
                globo_motor.on()

                # 2. AVISA O JOGO PARA MUDAR DE CENA
                mqtt_client.publish(mqtt_topic_publish_scene, b"Scene11")

                puzzle_resolvido = True

        sleep(1)
