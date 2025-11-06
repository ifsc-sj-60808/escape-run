import dis
from machine import Pin, reset  # pyright: ignore[reportMissingImports]
import network  # pyright: ignore[reportMissingImports]
from umqtt.robust import MQTTClient  # pyright: ignore[reportMissingImports]
from time import sleep

led = Pin(2, Pin.OUT)
dispenser = Pin(19, Pin.OUT)
dispenser_released = False

wifi_ssid = "escape-run"
wifi_password = "escape-run"

mqtt_client_id = "scene5-0"
mqtt_broker = "escape-run.sj.ifsc.edu.br"

mqtt_topic_subscribe = "escape-run/devices/scene5-0"
mqtt_topic_publish = "escape-run/player/scene"


def setup():
    led.off()
    dispenser.on()


def blink():
    for _ in range(3):
        led.off()
        sleep(0.1)
        led.on()
        sleep(0.1)
    led.off()


def release():
    global dispenser_released
    dispenser_released = True

    dispenser.off()


def connect_wifi():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(wifi_ssid, wifi_password)

    while not wlan.isconnected():
        print("Conectando ao Wi-Fi...")
        sleep(1)

    print("Conectado ao Wi-Fi! IP:", wlan.ifconfig()[0])


def connect_mqtt():
    client = MQTTClient(mqtt_client_id, mqtt_broker)
    client.set_callback(callback)
    client.connect()
    print("Conectado ao broker MQTT!")

    led.on()

    return client


def callback(topic, payload):
    msg = payload.decode()
    print("Mensagem recebida:", msg)

    if msg == "blink":
        blink()

    elif msg == "reset":
        reset()

    elif msg == "release":
        release()


def subscribe(client):
    client.subscribe(mqtt_topic_subscribe)
    print("Inscrito no tópico:", mqtt_topic_subscribe)


if __name__ == "__main__":
    setup()

    connect_wifi()

    mqtt_client = connect_mqtt()
    subscribe(mqtt_client)

    while True:
        if dispenser_released:
            mqtt_client.publish(mqtt_topic_publish, "Scene6")
            dispenser_released = False

        mqtt_client.check_msg()
        sleep(1)
