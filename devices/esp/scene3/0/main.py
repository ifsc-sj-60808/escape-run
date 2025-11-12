from machine import Pin, reset  # pyright: ignore[reportMissingImports]
import network  # pyright: ignore[reportMissingImports]
from umqtt.robust import MQTTClient  # pyright: ignore[reportMissingImports]
from time import sleep

wifi_ssid = "escape-run"
wifi_password = "escape-run"

mqtt_client_id = "scene3-0"
mqtt_broker = "escape-run.sj.ifsc.edu.br"
mqtt_topic_subscribe = "escape-run/devices/scene3/0"
mqtt_topic_publish = "escape-run/devices/scene3/0"

led = Pin(2, Pin.OUT)

door = Pin(3, Pin.OUT)
chest = Pin(4, Pin.OUT)
button = Pin(5, Pin.IN, Pin.PULL_UP)

led_door_1_green = Pin(6, Pin.OUT)
led_door_1_red = Pin(7, Pin.OUT)

led_door_2_green = Pin(8, Pin.OUT)
led_door_2_red = Pin(9, Pin.OUT)

led_door_2_green = Pin(10, Pin.OUT)
led_door_2_red = Pin(11, Pin.OUT)

led_door_3_green = Pin(12, Pin.OUT)
led_door_3_red = Pin(13, Pin.OUT)


def setup():
    door.on()
    chest.on()
    led_door_1_red.on()
    led_door_1_green.off()
    led_door_2_red.on()
    led_door_2_green.off()
    led_door_3_red.on()
    led_door_3_green.off()

    blink()
    sleep(30)
    blink()


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


def open_chest():
    chest.off()
    mqtt_client.publish("escape-run/player/scene", "Scene3")
    led_door_2_red.off()
    led_door_2_green.on()


def open_door():
    door.off()
    mqtt_client.publish("escape-run/player/scene", "Scene4")
    led_door_3_red.off()
    led_door_3_green.on()


def blink():
    for _ in range(3):
        sleep(0.1)
        led.off()
        sleep(0.1)
        led.on()


def callback(topic, payload):
    msg = payload.decode()
    print("Received message:", msg)

    if msg == "blink":
        blink()

    elif msg == "reset":
        reset()

    elif msg == "fffff":
        open_chest()

    elif msg == "botao":
        open_door()


def subscribe(client):
    client.subscribe(mqtt_topic_subscribe)
    print("Subscribed to device topic:", mqtt_topic_subscribe)


if __name__ == "__main__":
    setup()

    connect_wifi()

    mqtt_client = connect_mqtt()
    subscribe(mqtt_client)

    last = 0
    while True:
        if last == 0 and button.value() == 1:
            # mqtt_client.publish("escape-run/player/scene", "Scene4")
            last = 1

        mqtt_client.check_msg()
        sleep(1)
