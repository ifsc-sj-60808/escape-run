##Codigo MQTT Esp0 
from machine import Pin, reset
import network
from umqtt.robust import MQTTClient
from time import sleep

led = Pin(2, Pin.OUT)
led2 = Pin(23, Pin.OUT)
game_started = Pin(12, Pin.OUT)
gerador = Pin(14, Pin.OUT)
door = Pin(11, Pin.OUT)
dispencer = Pin(10, Pin.OUT)
danger = Pin(7, Pin OUT)

wifi_ssid = 'escape-run'
wifi_password = 'escape-run'

mqtt_client_id = 'room-12-0'
#mqtt_broker = 'escape-run.sj.ifsc.edu.br'
mqtt_broker = 'test.mosquitto.org'
mqtt_topic_subscribe = 'escape-run/room/12/0'
mqtt_topic_publish = 'escape-run/player/msg'


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

def tocar_som():
    print("🎵 Tocando música ambiente...")
    enviar_comando_DFPlayer(0x03, 0x00, 0x01)  # toca 0001.mp3 no SD
    

# ==== FUNÇÕES ====
def setup():
    led.off()
    led2.on()
    gerador.off()
    door.value(0)  # trancado
    print("Sistema pronto!")




def blink():
    for _ in range(3):
        sleep(0.1)
        led.off()
        sleep(0.1)
        led.on()

# ==== FUNÇÃO PARA LIBERAR O PRÊMIO ====
def dispenser(1):
     print("Prêmio sendo liberado")
     
    #print("🎁 Enviando comando para o dispenser liberar o prêmio...")
    #client.publish(mqtt_topic_dispenser, b'release')
    

def panic():
    print("PANIC! Liberando tudo!")
    door.value(1)
    gerador.off()

def tocar_som():
    pass

def game_start():
    # Iniciar o jogo
    pass

def gerador_on():
    gerador.value(1)

def gerador_off():
    gerador.value(0)
    
def door():
    door.off()
    led.off()
    sleep(5)
    door.on()
    led.on()

# ==== CONEXÕES ====
def connect_wifi():
    wlan = network.WLAN()
    wlan.active(True)
    wlan.connect(wifi_ssid, wifi_password)

    while not wlan.isconnected():
        print('Connecting to Wi-Fi...')
        sleep(1)
        
    print('Connected to Wi-Fi!')


def connect_mqtt():
    client = MQTTClient(mqtt_client_id, mqtt_broker)
    client.connect()
    client.set_callback(callback)
    print('Connected to MQTT broker!')
    led.on()
    return client

##mensagens de confirmação 
def callback(topic, payload):
    msg = payload.decode()
    print('Received message:', msg)
    
    if msg == 'blink':
        blink()
    elif msg == 'panic':
        panic()
    elif msg == 'door_lock':
        door(0)
    elif msg == 'door_open'
        door(1)
    elif msg == 'gerador_on':
        gerador.on()
    elif msg == 'gerador_off':
        gerador.off()
    elif msg == 'start':
        game_start()
   
    elif msg == 'reset':
        reset()
    elif msg =='Liberando prêmio'
        dispencer(1)
        sleep(5)
        dispencer(0) 

def subscribe(client):
    client.subscribe(mqtt_topic_subscribe)
    print('Subscribed to device topic:', mqtt_topic_subscribe)
    
    
if _name_ == '_main_':
    setup()
    connect_wifi()
    mqtt_client = connect_mqtt()
    subscribe(mqtt_client)
        
    while True:
        mqtt_client.publish(mqtt_topic_publish, 'ping')
        mqtt_client.check_msg()
        sleep(1)
