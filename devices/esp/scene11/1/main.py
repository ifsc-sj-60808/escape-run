from machine import Pin, reset  # pyright: ignore[reportMissingImports]
import network  # pyright: ignore[reportMissingImports]
from umqtt.robust import MQTTClient  # pyright: ignore[reportMissingImports]
from time import sleep

led = Pin(2, Pin.OUT)
vault = Pin(3, Pin.OUT)
button = Pin(4, Pin.IN)
audio = Pin(5, Pin.OUT)

wifi_ssid = "escape-run"
wifi_password = "escape-run"

mqtt_client_id = "room-cultura-1"
mqtt_broker = "escape-run.sj.ifsc.edu.br"
mqtt_topic_subscribe = "escape-run/room/cultura/1"
mqtt_topic_publish = "escape-run/player/msg"

vault_password = "859"


def setup():
    led.off()
    vault.on()
    audio.off()


def blink():
    for _ in range(3):
        sleep(0.1)
        led.off()
        sleep(0.1)
        led.on()


def open_vault():
    vault.off()
    print("Vault opened!")

    mqtt_client.publish(b"escape-run/player/scene", "Scene12")
    print("Changed scene: Scene12")

    blink()


def play_audio():
    audio.on()
    print("Audio played!")


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

    if msg == vault_password:
        open_vault()
    elif msg == "reset":
        reset()


def subscribe(client):
    client.subscribe(mqtt_topic_subscribe)
    print("Subscribed to device topic:", mqtt_topic_subscribe)


if __name__ == "__main__":
    setup()

    connect_wifi()

    mqtt_client = connect_mqtt()
    subscribe(mqtt_client)

    last_button = button.value()
    while True:
        current_button = button.value()
        if last_button == 1 and current_button == 0:
            play_audio()
            print("Button pressed!")

        last_button = current_button

        mqtt_client.check_msg()

        sleep(0.1)
