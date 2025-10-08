from machine import Pin, reset
import network
from umqtt.robust import MQTTClient
from time import sleep

led = Pin(2, Pin.OUT)
vault  = Pin(3, Pin.OUT)

wifi_ssid = 'escape-run'
wifi_password = 'escape-run'

mqtt_client_id = 'room-14-0-oooo'
#mqtt_broker = 'escape-run.sj.ifsc.edu.br'
mqtt_broker = 'test.mosquitto.org'
mqtt_topic_subscribe = 'escape-run/room/10/0'
mqtt_topic_publish = 'escape-run/player/msg'


def setup():
    led.off()
    vault.on()

def blink():
    for _ in range(3):
        sleep(0.1)
        led.off()
        sleep(0.1)
        led.on()


def panic():
    # Liberar todas as portas e travas
    pass
    
    
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

def open_vault():
    vault.off()
    print('Cofre aberto (Cena 5)!')
    mqtt_client.publish('escape-run/player/scene','Scene5')
    print('Mudando para a cena 5...')

def release_cards():
    print("Baralho encontrado (Cena 6)!")
    mqtt_client.publish('escape-run/player/scene','Scene6')
    print('Mudando para a cena 6...')

def summon_death():
    relay_death.on()
    print("A Morte entrou na sala!")
    mqtt_client.publish(mqtt_topic_publish, 'death_arrives')
    sleep(3)
    print("Morte entrega a fita e leva os mortos.")
    mqtt_client.publish(mqtt_topic_publish, 'fita_entregue')
    relay_exit.on()


def callback(topic, payload):
    msg = payload.decode()
    print('Received message:', msg)
    
    if msg == 'blink':
        blink()
    elif msg == 'panic':
        panic()
    elif msg == '666':  # Senha do cofre (Cena 5)
        open_vault()
    elif msg == 'found_cards':  # Cena 6 -> baralho
        release_cards()
    elif msg == 'death':  # Cena 6 -> a morte entra
        summon_death()
    elif msg == 'reset':
        reset()


def subscribe(client):
    client.subscribe(mqtt_topic_subscribe)
    print('Subscribed to device topic:', mqtt_topic_subscribe)
    
    
if __name__ == '__main__':
    setup()
    connect_wifi()
    mqtt_client = connect_mqtt()
    subscribe(mqtt_client)
        
    while True:
        mqtt_client.publish(mqtt_topic_publish, 'ping')
        mqtt_client.check_msg()
        sleep(1)
