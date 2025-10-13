##Codigo MQTT Esp0 


from machine import Pin, reset
import network
from umqtt.robust import MQTTClient
from time import sleep

led = Pin(2, Pin.OUT)
led2 = Pin(23, Pin.OUT)
game_started = Pin(12, Pin.OUT)
gerador = Pin(14, Pin.OUT)

wifi_ssid = 'escape-run'
wifi_password = 'escape-run'

mqtt_client_id = 'room-12-0'
#mqtt_broker = 'escape-run.sj.ifsc.edu.br'
mqtt_broker = 'test.mosquitto.org'
mqtt_topic_subscribe = 'escape-run/room/12/0'
mqtt_topic_publish = 'escape-run/player/msg'


def setup():
    led.off()
    game_start()
    gerador.on()
    gerador.off()
    led2.on()
    

    

def blink():
    for _ in range(3):
        sleep(0.1)
        led.off()
        sleep(0.1)
        led.on()


def panic():
    # Liberar todas as portas e travas
    pass
    

def game_start():
    # Iniciar o jogo
    pass

    def gerador_on():
        gerador.value(1)

    def gerador_off():
        gerador.value(0)

    
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

    
    
    
def callback(topic, payload):
    msg = payload.decode()
    print('Received message:', msg)
    
    if msg == 'blink':
        blink()
    elif msg == 'panic':
        panic()
    elif msg == 'gerador_on':
        gerador.on()
    elif msg == 'gerador_off':
        gerador.off()
    elif msg == 'start':
        game_start()
   
    elif msg == 'reset':
        reset()
  

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