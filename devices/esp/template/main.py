from machine import Pin  # pyright: ignore[reportMissingImports]
import network  # pyright: ignore[reportMissingImports]
from umqtt.robust import MQTTClient  # pyright: ignore[reportMissingImports]
from time import sleep


# sensores e atuadores
print("Iniciando código...")
led = Pin(25, Pin.OUT)
control = Pin(26, Pin.OUT)
pir = Pin(4, Pin.IN)
led.off()
control.off()
print("Sensores e atuadores configurados.")


# saída do local
print("30s para evacuar local...")
sleep(30)
print("Tempo esgotado!")


# Wi-Fi
wlan = network.WLAN()
wlan.active(True)
wlan.connect("escape-run", "escape-run")
while not wlan.isconnected():
    print("Conectando ao Wi-Fi...")
    sleep(1)
print("Conectado ao Wi-Fi!")


# MQTT
def callback(topic, payload):
    msg = payload.decode()
    print("Mensagem recebida:", msg)
    if msg == "blink":
        for _ in range(3):
            sleep(0.1)
            led.off()
            sleep(0.1)
            led.on()
    elif msg == "open" or msg == "unlock" or msg == "panic":
        control.on()
    elif msg == "close" or msg == "lock":
        control.off()


mqtt_client = MQTTClient("scene0-0", "escape-run.sj.ifsc.edu.br")
mqtt_client.connect()
print("Conectado ao broker MQTT!")
mqtt_client.set_callback(callback)
mqtt_client.subscribe("escape-run/devices/scene0/0")
print("Definidos callback e assinatura de tópico(s).")
led.on()


# Loop principal
last_read = 0
scanning = True
while True:
    current_read = pir.value()
    if current_read > last_read and scanning:
        print("Novo jogador detectado!")
        mqtt_client.publish("escape-run/player/scene", "Scene1")
        scanning = False
    last_read = current_read
    mqtt_client.check_msg()
    mqtt_client.publish("escape-run/devices/ping", "template")
    sleep(1)
