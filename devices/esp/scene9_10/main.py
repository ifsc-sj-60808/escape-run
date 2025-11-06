from machine import Pin, reset  # pyright: ignore[reportMissingImports]
import network  # pyright: ignore[reportMissingImports]
from umqtt.robust import MQTTClient  # pyright: ignore[reportMissingImports]
from time import sleep


led = Pin(2, Pin.OUT)

# --- Configurações de Rede ---
wifi_ssid = "escape-run"
wifi_password = "escape-run"

# --- Configurações do MQTT ---
# ID ÚNICO para este hardware das cenas 9 e 10
mqtt_client_id = "scene9-10-0"
mqtt_broker = "escape-run.sj.ifsc.edu.br"

# Tópico que este hardware vai ESCUTAR
# O jogo vai publicar aqui para controlar este hardware
mqtt_topic_subscribe = "escape-run/scene9-10/0"
# Tópico que o jogo escuta (este hardware não vai usar, pois a Scene9 já publica)
mqtt_topic_publish = "escape-run/player/scene"


def setup():
    # Garante que o pino comece desligado (ou travado, no caso de um relé)
    led.off()


def blink():
    """ Pisca o LED 3 vezes para sinalizar conexão """
    for _ in range(3):
        sleep(0.1)
        led.off()
        sleep(0.1)
        led.on()


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
    client.set_callback(callback)  # Define a função que escuta por mensagens
    print("Connected to MQTT broker!")

    blink() # Pisca o LED para confirmar que conectou

    return client


def callback(topic, payload):
    """
    Esta função é chamada toda vez que o hardware recebe uma mensagem
    no tópico que ele está inscrito (mqtt_topic_subscribe)
    """
    msg = payload.decode()
    print("Received message:", msg)
    
    # --- AQUI VAI A LÓGICA DE CONTROLE DO HARDWARE ---
    
    # Exemplo: O jogo pode mandar "DESTRAVAR" quando o jogador
    # acertar a senha na Cena 9.
    if msg == "destravar_porta":
        print("Destravando a porta!")
        led.on()  # Ativa o relé/LED
        sleep(5)  # Mantém destravado por 5 segundos
        led.off() # Trava novamente
    
    # Comando para piscar o LED
    elif msg == "blink":
        blink()

    # Comando para reiniciar o hardware
    elif msg == "reset":
        reset()


def subscribe(client):
    client.subscribe(mqtt_topic_subscribe)
    print("Subscribed to device topic:", mqtt_topic_subscribe)


if __name__ == "__main__":
    setup()

    connect_wifi()

    mqtt_client = connect_mqtt()
    subscribe(mqtt_client)

    # O loop principal deste hardware é apenas ESCUTAR por comandos.
    # Ele não tem um sensor (como o PIR) para enviar comandos por conta própria.
    print("Hardware das Cenas 9 e 10 está online e escutando...")
    while True:
        try:
            mqtt_client.check_msg()  # Verifica se alguma mensagem chegou
            sleep(0.1)  # Uma pequena pausa para não sobrecarregar
        except Exception as e:
            print("Error in main loop:", e)
            reset()