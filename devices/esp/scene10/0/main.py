from machine import Pin, reset  # pyright: ignore[reportMissingImports]
import network  # pyright: ignore[reportMissingImports]
from umqtt.simple import MQTTClient  # pyright: ignore[reportMissingImports]
from time import sleep


device = "scene10"
device_number = "0"
led = Pin(2, Pin.OUT)
switch1 = Pin(23, Pin.IN, Pin.PULL_UP)
switch2 = Pin(22, Pin.IN, Pin.PULL_UP)
switch3 = Pin(18, Pin.IN, Pin.PULL_UP)  # Pino 18 é seguro
switch4 = Pin(19, Pin.IN, Pin.PULL_UP)  # Pino 19 é seguro
pista_luzes = Pin(12, Pin.OUT)
globo_motor = Pin(13, Pin.OUT)
wifi_ssid = "escape-run"
wifi_password = "escape-run"
broker = "escape-run.sj.ifsc.edu.br"

device_name = "-".join([device, device_number])
topic_subscribe = "/".join(["escape-run", "devices", device, device_number])
topic_publish = "escape-run/player/scene"
wlan = network.WLAN()
mqtt_client = MQTTClient(device_name, broker, keepalive=60)
switch_password = [1, 0, 0, 1]
puzzle_resolvido = False


def setup():
    print("Iniciando código...")
    led.off()
    pista_luzes.off()
    globo_motor.off()
    print("Sensores e atuadores configurados.")


def switch_pre():
    print("30s para evacuar local...")
    # sleep(30)
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
    if msg == "pista_on":
        pista_luzes.on()
        print("Pista de luzes LIGADA via MQTT.")
    elif msg == "pista_off":
        pista_luzes.off()
        print("Pista de luzes DESLIGADA via MQTT.")
    elif msg == "globo_on":
        globo_motor.on()
        print("Globo motor LIGADO via MQTT.")
    elif msg == "globo_off":
        globo_motor.off()
        print("Globo motor DESLIGADO via MQTT.")


def mqtt_connect():
    global mqtt_client
    mqtt_client.connect(timeout=5)
    print("Conectado ao broker MQTT!")
    mqtt_client.set_callback(callback)
    mqtt_client.subscribe(topic_subscribe)
    print("Definidos callback e assinatura do tópico", topic_subscribe)
    led.on()


def switch_check():
    global puzzle_resolvido, switch_password
    estado_atual = [
        switch1.value(),
        switch2.value(),
        switch3.value(),
        switch4.value(),
    ]
    if estado_atual == switch_password:
        print("Sequência correta! Acionando pista, globo e avançando cena!")
        pista_luzes.on()
        globo_motor.on()
        mqtt_client.publish(topic_publish, "Scene11")
        puzzle_resolvido = True


if __name__ == "__main__":
    setup()
    wifi_connect()
    switch_pre()

    while True:
        blink()
        try:
            mqtt_connect()
            while True:
                if not puzzle_resolvido:
                    switch_check()
                mqtt_client.check_msg()
                sleep(1)
        except OSError as e:
            print(f"Erro de conexão: {e}")
            sleep(5)
