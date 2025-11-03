from machine import Pin, reset # pyright: ignore[reportMissingImports]
import network # pyright: ignore[reportMissingImports]
from umqtt.robust import MQTTClient # pyright: ignore[reportMissingImports]
from time import sleep

led = Pin(2, Pin.OUT)
states = [Pin(i, Pin.OUT) for i in range(3, 7)]
state = 3

wifi_ssid = "escape-run"
wifi_password = "escape-run"

mqtt_client_id = "room-14-0"
mqtt_broker = "escape-run.sj.ifsc.edu.br"
mqtt_topic_subscribe = "escape-run/room/14/0"
mqtt_topic_publish = "escape-run/player/msg"


def setup():
    led.off()
    for i in range(len(states)):
        states[i].off()


def blink():
    for _ in range(3):
        sleep(0.1)
        led.off()
        sleep(0.1)
        led.on()


def open(pin):
    pin.on()
    print("Pin changed state to 1")


def panic():
    for i in range(len(states)):
        states[i].on()


def wifi_connect():
    wlan = network.WLAN()
    wlan.active(True)
    wlan.connect(wifi_ssid, wifi_password)

    while not wlan.isconnected():
        print("Connecting to Wi-Fi...")
        sleep(1)

    print("Connected to Wi-Fi!")


def callback(topic, payload):
    msg = payload.decode()
    print("Received message:", msg)

    if msg == "blink":
        blink()

    elif msg == "next":
        global states, state
        state = (state + 1) % len(states)
        open(states[state])

    elif msg == "panic":
        panic()

    elif msg == "reset":
        reset()


def mqtt_connect():
    client = MQTTClient(mqtt_client_id, mqtt_broker)
    client.connect()
    client.set_callback(callback)
    led.on()
    print("Connected to MQTT broker!")

    return client


def subscribe(client):
    client.subscribe(mqtt_topic_subscribe)
    print("Subscribed to device topic:", mqtt_topic_subscribe)


if __name__ == "__main__":
    setup()

    wifi_connect()

    mqtt_client = mqtt_connect()
    subscribe(mqtt_client)

    while True:
        # mqtt_client.publish(mqtt_topic_publish, "ping")
        mqtt_client.check_msg()

        sleep(1)
