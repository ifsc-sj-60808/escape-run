from machine import Pin, reset  # pyright: ignore[reportMissingImports]
import network  # pyright: ignore[reportMissingImports]
from umqtt.robust import MQTTClient  # pyright: ignore[reportMissingImports]
from time import sleep

led = Pin(2, Pin.OUT)
switch1 = Pin(4, Pin.IN)
switch2 = Pin(5, Pin.IN)
switch3 = Pin(6, Pin.IN)
switch4 = Pin(7, Pin.IN)

wifi_ssid = "escape-run"
wifi_password = "escape-run"

mqtt_client_id = "scene10-0"
mqtt_broker = "escape-run.sj.ifsc.edu.br"
mqtt_topic_subscribe = "escape-run/room/10/0"
mqtt_topic_publish_scene = "escape-run/player/scene"

switch_password = [0, 1, 1, 0]
puzzle_resolvido = False


def setup():
    led.off()

    blink()
    sleep(30)
    blink()


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
    return client


def callback(topic, payload):
    msg = payload.decode()
    print("Received message:", msg)

    if msg == "reset":
        reset()


def subscribe(client):
    client.subscribe(mqtt_topic_subscribe)
    print("Subscribed to device topic:", mqtt_topic_subscribe)


if __name__ == "__main__":
    setup()

    connect_wifi()

    mqtt_client = connect_mqtt()
    subscribe(mqtt_client)

    puzzle_resolvido = False
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
                mqtt_client.publish(mqtt_topic_publish_scene, "Scene11")
                puzzle_resolvido = True

        sleep(1)
