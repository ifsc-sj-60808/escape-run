from machine import Pin, reset  # pyright: ignore[reportMissingImports]
import network  # pyright: ignore[reportMissingImports]
from umqtt.simple import MQTTClient  # pyright: ignore[reportMissingImports]
from time import sleep

device = "scene4"
device_number = "0"
led = Pin(2, Pin.OUT)
luz_gerador_ligado = Pin(26, Pin.OUT)
luz_gerador_desligado = Pin(25, Pin.OUT)
filtro_lcd = Pin(32, Pin.OUT)
sensor_metal = Pin(33, Pin.IN)
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
    luz_gerador_ligado.off()
    luz_gerador_desligado.off()
    filtro_lcd.off()
    print("Sensores e atuadores configurados.")


def sensor_pre():
    print("30s para evacuar local...")
    sleep(30)
    print("Tempo esgotado!")


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
    if msg == "open" or msg == "unlock" or msg == "panic":
        print("Abrindo cofre...")
        # control.on()
        mqtt_client.publish(topic_publish, "Scene5")
    elif msg == "close" or msg == "lock":
        print("Fechando cofre...")
        # control.off()
    elif msg == "reset":
        print("Reiniciando dispositivo...")
        reset()


def mqtt_connect():
    global mqtt_client
    mqtt_client.connect(timeout=5)
    print("Conectado ao broker MQTT!")
    mqtt_client.set_callback(callback)
    mqtt_client.subscribe(topic_subscribe)
    print("Definidos callback e assinatura do tópico", topic_subscribe)
    led.on()


def read_sensor_metal():
    global last_read, scanning
    current_read = sensor_metal.value()
    if current_read > last_read:
        print("Novo jogador detectado!")
        mqtt_client.publish(topic_publish, "Scene5")
        blink()
        scanning = False
    last_read = current_read


if __name__ == "__main__":
    setup()
    wifi_connect()
    sensor_pre()

    while True:
        blink()
        try:
            mqtt_connect()
            while True:
                if scanning:
                    read_sensor_metal()
                mqtt_client.check_msg()
                sleep(1)
        except OSError as e:
            print(f"Erro de conexão: {e}")
            sleep(5)
