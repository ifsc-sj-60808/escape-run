from machine import Pin, reset
import network
from umqtt.robust import MQTTClient
from time import sleep

cofre = Pin (3, Pin.OUT)
senha = Pin(X, Pin.IN)
botao = Pin (4, Pin.IN)
audio = Pin (5, Pin.OUT)
  
wifi_ssid = "escape-run"
wifi_password = "escape-run"

mqtt_client_id = "room-cultura-0"            
mqtt_broker = "escape-run.sj.ifsc.edu.br"
mqtt_topic_subscribe = "escape-run/room/cultura/0"
mqtt_topic_publish = "escape-run/player/msg"
 
def setup():
    cofre.on()
    botao.off()
def cofre():
    mqtt_client.publish(b'escape-run/player/scene', 'Scene11')
    print('Changed scene: Scene11')
    blink()


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
    
  if msg == "open":
        open_cofre()
    elif msg == "close":
        close_cofre()
    elif msg == "reset":
        reset()

def subscribe(client):
    client.subscribe(mqtt_topic_subscribe)
    print('Subscribed to device topic:', mqtt_topic_subscribe.decode())

if __name__ == "__main__":
    setup()
    connect_wifi()
    mqtt_client = connect_mqtt()
    subscribe(mqtt_client)

    last_botao = botao.value()

    while True:
        mqtt_client.check_msg()       # Verifica o botão (acionamento com transição)
        current_botao = botao.value()
        if last_botao == 1 and current_button == 0:
            print("Botão pressionado!")
            play_audio()

        last_button = current_button
        sleep(0.1)
