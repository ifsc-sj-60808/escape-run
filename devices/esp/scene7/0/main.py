from machine import Pin  # pyright: ignore[reportMissingImports]
import network  # pyright: ignore[reportMissingImports]
from umqtt.robust import MQTTClient  # pyright: ignore[reportMissingImports]
from time import sleep

led = Pin(2, Pin.OUT)
vault = Pin(23, Pin.OUT)

wifi_ssid = "escape-run"
wifi_password = "escape-run"

mqtt_client_id = "scene7-0"
mqtt_broker = "escape-run.sj.ifsc.edu.br"
mqtt_topic_subscribe = "escape-run/devices/scene7/0"
mqtt_topic_publish = "escape-run/player/scene"


def setup():
    led.off()
    vault.off()

    blink()
    sleep(30)
    blink()


def blink():
    for _ in range(3):
        sleep(0.1)
        led.off()
        sleep(0.1)
        led.on()


def panic():
    pass


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

    if msg == "blink":
        blink()

    elif msg == "panic":
        panic()

    elif msg == "859":
        vault.on()

        global open
        open = True


def subscribe(client):
    client.subscribe(mqtt_topic_subscribe)
    print("Subscribed to device topic:", mqtt_topic_subscribe)


if __name__ == "__main__":
    open = False
    setup()

    connect_wifi()

    mqtt_client = connect_mqtt()
    subscribe(mqtt_client)

    while True:
        if open:
            mqtt_client.publish("escape-run/player/scene", "Scene8")
            open = False

        mqtt_client.check_msg()
        sleep(1)
