from machine import Pin, reset  # pyright: ignore[reportMissingImports]
import network  # pyright: ignore[reportMissingImports]
from umqtt.simple import MQTTClient  # pyright: ignore[reportMissingImports]
from time import sleep

device = "scene3"
device_number = "1"
led = Pin(2, Pin.OUT)
chest = Pin(4, Pin.OUT)

wifi_ssid = "escape-run"
wifi_password = "Escape-run2025!"
broker = "escape-run.sj.ifsc.edu.br"

device_name = "-".join([device, device_number])
topic_subscribe = "/".join(["escape-run", "devices", device, device_number])
topic_publish_scene = "escape-run/player/scene"
topic_publish_button = "escape-run/devices/scene3/0"
wlan = network.WLAN()
mqtt_client = MQTTClient(device_name, broker, keepalive=60)


def setup():
    print("Iniciando código...")
    led.off()
    chest.off()
    print("Sensores e atuadores configurados.")


def blink(num=1):
    for _ in range(num):
        sleep(0.1)
        led.off()
        sleep(0.1)
        led.on()


def wifi_connect():
    print("Conectando ao Wi-Fi...")
    wlan.active(True)
    wlan.connect(wifi_ssid, wifi_password)
    while not wlan.isconnected():
        print("Conectando ao Wi-Fi...")
        sleep(1)
    print("Conectado ao Wi-Fi!")


def callback(topic, payload):
    msg = payload.decode()
    print("Mensagem recebida:", msg)
    blink()
    if msg == "gfdce":
        mqtt_client.publish(topic_publish_scene, "Scene3")
        sleep(1)
        chest.on()


def mqtt_connect():
    global mqtt_client
    mqtt_client.connect(timeout=5)
    print("Conectado ao broker MQTT!")
    mqtt_client.set_callback(callback)
    mqtt_client.subscribe(topic_subscribe)
    print("Definidos callback e assinatura do tópico", topic_subscribe)
    led.on()


if __name__ == "__main__":
    setup()
    wifi_connect()

    while True:
        blink()
        try:
            mqtt_connect()
            while True:
                mqtt_client.check_msg()
                sleep(1)
        except OSError as e:
            print(f"Erro de conexão: {e}")
            sleep(5)
