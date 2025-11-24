from machine import Pin, reset  # pyright: ignore[reportMissingImports]
import network  # pyright: ignore[reportMissingImports]
from umqtt.simple import MQTTClient  # pyright: ignore[reportMissingImports]
from time import sleep

device = "scene3"
device_number = "0"
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
wifi_ssid = "escape-run"
wifi_password = "escape-run"
broker = "escape-run.sj.ifsc.edu.br"

device_name = "-".join([device, device_number])
topic_subscribe = "/".join(["escape-run", "devices", device, device_number])
topic_publish = "escape-run/player/scene"
wlan = network.WLAN()
mqtt_client = MQTTClient(device_name, broker, keepalive=60)
last_read = 0
scanning = True


def setup():
    print("Iniciando código...")
    led.off()
    door.on()
    chest.on()
    led_door_1_red.on()
    led_door_1_green.off()
    led_door_2_red.on()
    led_door_2_green.off()
    led_door_3_red.on()
    led_door_3_green.off()
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
        chest.off()
        led_door_2_red.off()
        led_door_2_green.on()

    elif msg == "botao":
        mqtt_client.publish(topic_publish, "Scene4")
        sleep(1)
        door.off()
        led_door_3_red.off()
        led_door_3_green.on()


def mqtt_connect():
    global mqtt_client
    mqtt_client.connect(timeout=5)
    print("Conectado ao broker MQTT!")
    mqtt_client.set_callback(callback)
    mqtt_client.subscribe(topic_subscribe)
    print("Definidos callback e assinatura do tópico", topic_subscribe)
    led.on()


def read_button():
    global last_read, scanning
    current_read = button.value()
    if current_read > last_read:
        print("Botão pressionado!")
        mqtt_client.publish(topic_subscribe, "botao")
        scanning = False
    last_read = current_read


if __name__ == "__main__":
    setup()
    wifi_connect()

    while True:
        blink()
        try:
            mqtt_connect()
            while True:
                if scanning:
                    read_button()
                mqtt_client.check_msg()
                sleep(1)
        except OSError as e:
            print(f"Erro de conexão: {e}")
            sleep(5)
