from machine import Pin, reset  # pyright: ignore[reportMissingImports]
import network  # pyright: ignore[reportMissingImports]
from umqtt.robust import MQTTClient  # pyright: ignore[reportMissingImports]
from time import sleep


# ==== CONFIGURAÇÕES ====

sensor_gerador = Pin(18, Pin.IN)

led = Pin(2, Pin.OUT)
led2 = Pin(23, Pin.OUT)
esp_scene5 = Pin(12, Pin.OUT)
gerador = Pin(14, Pin.OUT)
door = Pin(11, Pin.OUT,)
dispenser = Pin(10, Pin.OUT)

wifi_ssid = "escape-run"
wifi_password = "escape-run"

mqtt_client_id = "scene4-0"
mqtt_broker = "escape-run.sj.ifsc.edu.br"
mqtt_topic_subscribe = "escape-run/scene4/0"
mqtt_topic_publish = "escape-run/player/scene"


# ==== DFPLAYER MINI ====
uart = UART(2, baudrate=9600, tx=17, rx=16)  # ajuste conforme sua ligação


def enviar_comando_DFPlayer(cmd, param1=0, param2=0):
    """Envia comando padrão para o DFPlayer"""
    buf = bytearray(10)
    buf[0] = 0x7E
    buf[1] = 0xFF
    buf[2] = 0x06
    buf[3] = cmd
    buf[4] = 0x00
    buf[5] = param1
    buf[6] = param2
    checksum = 0 - (0xFF + 0x06 + cmd + 0x00 + param1 + param2)
    buf[7] = (checksum >> 8) & 0xFF
    buf[8] = checksum & 0xFF
    buf[9] = 0xEF
    uart.write(buf)


# ==== FUNÇÕES ====
def setup():
    led.off()
    led2.on()
    gerador.off()
    door.off()
    dispenser.on()
    print("Sistema pronto!")


def blink():
    for _ in range(3):
        sleep(0.1)
        led.off()
        sleep(0.1)
        led.on()


# ==== FUNÇÃO PARA LIBERAR O PRÊMIO ====
def dispenser_liberar():
    dispenser.off()
    print("Prêmio sendo liberado")


def dispenser_trancar():
    dispenser.on()
    print("Prêmio trancado")



def panic():
    print("PANIC! Liberando tudo!")
    door.off()
    gerador.off()


def tocar_som():
    pass

def gerador_on():
    gerador.on()


def gerador_off():
    gerador.off()


def open_door():
    door.off()

def close_door():
    door.on()



# ==== CONEXÕES ====
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


##mensagens de confirmação
def callback(topic, payload):
    msg = payload.decode()
    print("Received message:", msg)

    if msg == "blink":
        blink()

    elif msg == "panic":
        panic()

    elif msg == "door_lock":
        door.on()
        print("Porta fechada")

    elif msg ==" door_unlock":
        door.off()
        print("Porta aberta")

   
    elif msg == "gerador_on":
        gerador.on()
   
    elif msg == "gerador_off":
        gerador.off()
   
    elif msg == "reset":
        reset()
    
    elif msg == "Liberando prêmio":
        dispenser.off()
        sleep(10)
        dispenser.on()


def subscribe(client):
    client.subscribe(mqtt_topic_subscribe)
    print("Subscribed to device topic:", mqtt_topic_subscribe)


if __name__ == "_main_":
    setup()
    connect_wifi()
    mqtt_client = connect_mqtt()
    subscribe(mqtt_topic_subscribe)

    while True:
        # mqtt_client.publish(mqtt_topic_publish, "ping")
        mqtt_client.check_msg()
        sleep(1)
