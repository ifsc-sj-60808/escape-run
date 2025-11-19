from machine import Pin, reset
import network
from umqtt.robust import MQTTClient
from time import sleep

# === Sensores e Atuadores ===
print("Iniciando código da Cena 10...")
led = Pin(2, Pin.OUT)       # LED de Status (geralmente o azul da placa)

# Pinos de INPUT (Leitura dos interruptores)
# Usando pinos seguros e com PULL_UP para evitar leituras instáveis
switch1 = Pin(23, Pin.IN, Pin.PULL_UP)
switch2 = Pin(22, Pin.IN, Pin.PULL_UP)
switch3 = Pin(18, Pin.IN, Pin.PULL_UP) # Pino 18 é seguro
switch4 = Pin(19, Pin.IN, Pin.PULL_UP) # Pino 19 é seguro

# Pinos de OUTPUT (Controle da pista de luzes e motor do globo)
# Estes são os pinos que controlarão os RELÉS
pista_luzes = Pin(12, Pin.OUT)
globo_motor = Pin(13, Pin.OUT)

# Garante que as saídas comecem desligadas
led.off()
pista_luzes.off()
globo_motor.off()
print("Sensores e atuadores da Cena 10 configurados.")

# === Configurações do Puzzle ===
# A senha visual é [OFF, ON, ON, OFF]
# Com PULL_UP, a lógica é invertida: OFF=1, ON=0
# A senha correta no código é:
switch_password = [1, 0, 0, 1]
puzzle_resolvido = False

# === Wi-Fi ===
wifi_ssid = "escape-run"
wifi_password = "escape-run"

print("Conectando ao Wi-Fi...")
wlan = network.WLAN(network.STA_IF) # Especifica que é modo estação
wlan.active(True)
wlan.connect(wifi_ssid, wifi_password)

max_wait = 20 # Adicionado o 'max_wait' para evitar o boot loop
while max_wait > 0:
    if wlan.isconnected():
        print("Conectado ao Wi-Fi com sucesso!")
        print("IP:", wlan.ifconfig()[0])
        break # Sai do loop se conectou
    
    max_wait -= 1
    sleep(1)

if not wlan.isconnected(): # Se saiu do loop e não conectou
    print("FALHA AO CONECTAR AO WI-FI! Verifique a rede.")
    print("Reiniciando em 5 segundos...")
    sleep(5)
    reset() # Reinicia o ESP de forma controlada

# === MQTT ===
mqtt_client_id = "scene10-0"
mqtt_broker = "escape-run.sj.ifsc.edu.br"
mqtt_topic_subscribe = b"escape-run/devices/scene10/0"
mqtt_topic_publish_scene = b"escape-run/player/scene"
mqtt_topic_ping = b"escape-run/devices/ping" # Tópico de ping, como no seu exemplo

def callback(topic, payload):
    msg = payload.decode()
    print("Mensagem MQTT recebida:", msg)
    if msg == "reset":
        print("Recebido comando de reset. Reiniciando ESP...")
        reset()
    elif msg == "blink": # Comando de blink para o LED de status
        for _ in range(3):
            sleep(0.1)
            led.off()
            sleep(0.1)
            led.on()
    elif msg == "led_on": # Comando para ligar o LED de status
        led.on()
    elif msg == "led_off": # Comando para desligar o LED de status
        led.off()
    # Adicione aqui outros comandos MQTT se precisar controlar a pista/globo manualmente
    elif msg == "pista_on":
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


mqtt_client = MQTTClient(mqtt_client_id, mqtt_broker)
mqtt_client.connect()
print("Conectado ao broker MQTT!")
mqtt_client.set_callback(callback)
mqtt_client.subscribe(mqtt_topic_subscribe)
print("Definidos callback e assinatura de tópico(s) para a Cena 10.")
led.on() # LED de status acende para indicar conexão MQTT bem-sucedida

# === Loop principal da Cena 10 ===
print("Iniciando leitura dos interruptores da Cena 10...")
while True:
    mqtt_client.check_msg() # Verifica se há mensagens MQTT
    
    # Publica um "ping" para indicar que o dispositivo está ativo, como no seu exemplo
    mqtt_client.publish(mqtt_topic_ping, b"scene10_online")

    if not puzzle_resolvido:
        estado_atual = [
            switch1.value(),
            switch2.value(),
            switch3.value(),
            switch4.value(),
        ]

        if estado_atual == switch_password:
            print("Sequência correta! Acionando pista, globo e avançando cena!")
            
            # 1. LIGA O HARDWARE (Pista e Globo)
            pista_luzes.on()
            globo_motor.on()
            
            # 2. AVISA O JOGO PARA MUDAR DE CENA
            mqtt_client.publish(mqtt_topic_publish_scene, b"Scene11")
            
            puzzle_resolvido = True
    
    sleep(0.1) # Sleep mais curto para resposta rápida dos interruptores