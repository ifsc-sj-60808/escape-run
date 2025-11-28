from machine import Pin, reset  # pyright: ignore[reportMissingImports]
import network  # pyright: ignore[reportMissingImports]
from umqtt.simple import MQTTClient  # pyright: ignore[reportMissingImports]
from time import sleep

device = "scene3"
device_number = "0"
led = Pin(23, Pin.OUT)
door = Pin(22, Pin.OUT)
ldg1 = Pin(19, Pin.OUT)  # led_door_1_green
ldr1 = Pin(18, Pin.OUT)  # led_door_1_red
ldg2 = Pin(8, Pin.OUT)  # led_door_2_green
ldr2 = Pin(7, Pin.OUT)  # led_door_2_red
ldg3 = Pin(9, Pin.OUT)  # led_door_3_green
ldr3 = Pin(10, Pin.OUT)  # led_door_3_red
wifi_ssid = "escape-run"
wifi_password = "Escape-run2025!"
broker = "escape-run.sj.ifsc.edu.br"

device_name = "-".join([device, device_number])
topic_subscribe = "/".join(["escape-run", "devices", device, device_number])
topic_publish = "escape-run/player/scene"
wlan = network.WLAN()
mqtt_client = MQTTClient(device_name, broker, keepalive=60)


def setup():
    print("Iniciando código...")
    led.off()
    door.on()
    ldr1.on()
    ldg1.off()
    ldr2.on()
    ldg2.off()
    ldr3.on()
    ldg3.off()
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
    if msg == "fffff":
        mqtt_client.publish(topic_publish, "Scene3")
        sleep(1)
        ldr2.off()
        ldg2.on()
        print("Led 2 verde")

    elif msg == "botao":
        mqtt_client.publish(topic_publish, "Scene4")
        sleep(1)
        door.off()
        ldr3.off()
        ldg3.on()
        print("Led 3 verde")


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
