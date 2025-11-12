from machine import Pin, reset
import network
from umqtt.robust import MQTTClient
from time import sleep

# === Pinos ===
# Hardware da Cena 10: 4 interruptores físicos
switch1 = Pin(4, Pin.IN) # Interruptor 1
switch2 = Pin(5, Pin.IN) # Interruptor 2
switch3 = Pin(6, Pin.IN) # Interruptor 3
switch4 = Pin(7, Pin.IN) # Interruptor 4

# === Wi-Fi ===
wifi_ssid = "escape-run"
wifi_password = "escape-run"

# === MQTT ===
mqtt_client_id = "scene10-0" # ID único para este hardware
mqtt_broker = "escape-run.sj.ifsc.edu.br"
# Tópico que o ESP escuta (para comandos de reset)
mqtt_topic_subscribe = b"escape-run/room/10/0"
# Tópico que o ESP publica (para avançar para a próxima cena)
mqtt_topic_publish_scene = b"escape-run/player/scene"

# === Configurações ===
# A senha com base na imagem (1=OFF, 2=ON, 3=ON, 4=OFF)
# (Assumindo que 1 = ON/Ligado, 0 = OFF/Desligado)
switch_password = [0, 1, 1, 0]
puzzle_resolvido = False


# === Setup inicial ===
def setup():
    print("Hardware da Cena 10 (Interruptores) pronto.")
    # (Não precisa de 'blink' aqui, vamos seguir o seu exemplo)


# === Conexão Wi-Fi ===
# ATENÇÃO: Esta função AINDA VAI TRAVAR se o Wi-Fi estiver fraco!
def connect_wifi():
    wlan = network.WLAN()
    wlan.active(True)
    wlan.connect(wifi_ssid, wifi_password)

    while not wlan.isconnected():
        print("Connecting to Wi-Fi...")
        sleep(1)

    print("Connected to Wi-Fi!")


# === Conexão MQTT ===
def connect_mqtt():
    client = MQTTClient(mqtt_client_id, mqtt_broker)
    client.connect()
    client.set_callback(callback)
    print("Connected to MQTT broker!")
    return client


# === Callback de mensagens MQTT ===
def callback(topic, payload):
    msg = payload.decode()
    print("Received message:", msg)

    # Este hardware só escuta por um comando de reset
    if msg == "reset":
        reset()


# === Assinatura do tópico ===
def subscribe(client):
    client.subscribe(mqtt_topic_subscribe)
    print("Subscribed to device topic:", mqtt_topic_subscribe)


# === Loop principal ===
if __name__ == "__main__":
    setup()

    connect_wifi()

    mqtt_client = connect_mqtt()
    subscribe(mqtt_client)

    puzzle_resolvido = False
    
    print("Lendo os interruptores da Cena 10...")

    while True:
        # 1. Escuta por comandos (ex: "reset")
        mqtt_client.check_msg()

        # 2. Lógica da Cena 10 (Verifica os interruptores físicos)
        if not puzzle_resolvido:
            # Lê o estado atual dos 4 interruptores
            estado_atual = [
                switch1.value(),
                switch2.value(),
                switch3.value(),
                switch4.value()
            ]
            
            # Compara o estado atual com a senha
            if estado_atual == switch_password:
                print("Sequência de interruptores correta! Avançando para Scene11...")
                
                # Publica a mudança de cena para o jogo
                mqtt_client.publish(mqtt_topic_publish_scene, b"Scene11")
                
                puzzle_resolvido = True  # Garante que vai enviar a mensagem apenas uma vez

        sleep(0.1)  # Pequena pausa
