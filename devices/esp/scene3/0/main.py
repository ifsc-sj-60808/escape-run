from machine import Pin, reset
import network
from umqtt.robust import MQTTClient
from time import sleep

wifi_ssid = 'escape-run'
wifi_password = 'escape-run'

mqtt_client_id = 'scene3-0'
mqtt_broker = 'escape-run.sj.ifsc.edu.br'
mqtt_topic_subscribe = 'escape-run/devices/scene3/0'
mqtt_topic_publish = 'escape-run/devices/scene3/0'

door = Pin(x, Pin.OUT)

chest = Pin(x, Pin.OUT)

button = Pin(x, Pin.IN,Pin.PULL_UP)


led_door_1_green = Pin(x, Pin.OUT)
led_door_1_red = Pin(x, Pin.OUT)

led_door_2_green = Pin(x, Pin.OUT)
led_door_2_red = Pin(x, Pin.OUT)

led_door_2_green = Pin(x, Pin.OUT)
led_door_2_red = Pin(x, Pin.OUT)

led_door_3_green = Pin(x, Pin.OUT)
led_door_3_red = Pin(x, Pin.OUT)


def setup():
    door.on()
    chest.on()
    led_door_1_red.on()
    led_door_1_green.off()
    led_door_2_red.on()
    led_door_2_green.off()
    led_door_3_red.on()
    led_door_3_green.off()

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


def open_chest():
    chest.off()
    mqtt_client.publish('escape-run/scene3', 'Scene3.1')
    print('Senha certa')
    led_door_2_red.off()
    led_door_2_green.on()
    

def open_door():
    door.off()
    mqtt_client.publish('escape-run/player/scene3.1', 'Scene4')
    print('Changed scene: Scene4')
    led_door_3_red.off()
    led_door_3_green.on()


def blink():
    for _ in range(3):
        sleep(0.1)
        led.off()
        sleep(0.1)connected():
        print('Connecting to Wi-Fi...')
        sleep(1)
        
    print('Connected to Wi-Fi!')

    
def callback(topic, payload):
    msg = payload.decode()
    print('Received message:', msg)
    
    if msg == 'blink':
        blink() 
    elif msg == 'panic':
        panic()
    elif msg == 'reset':
        reset()
    elif msg == 'fffff':
        open_chest()
    elif msg == 'botão pressionado':
        open_door()


def subscribe(client):
    client.subscribe(mqtt_topic_subscribe)
    print('Subscribed to device topic:', mqtt_topic_subscribe.decode())
    
    
if name == 'main':
    setup()
    connect_wifi()
    mqtt_client = connect_mqtt()
    subscribe(mqtt_client)
        
    while True:
        if button_1.value(True):
            mqtt_client.publish('escape-run/player/scene2.1', 'Botão 1 pressionado')

        mqtt_client.publish(mqtt_topic_publish, 'ping')
        mqtt_client.check_msg()
        sleep(1)
        led.on()


def panic():
    # Liberar todas as portas e travas
    pass