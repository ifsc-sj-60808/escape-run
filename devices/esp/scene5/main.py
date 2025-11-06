from machine import Pin, reset  # pyright: ignore[reportMissingImports]
import network  # pyright: ignore[reportMissingImports]
from umqtt.robust import MQTTClient  # pyright: ignore[reportMissingImports]
from time import sleep

# ================================
# PINAGEM (ajustada para ESP32-WROOM-32)
# ================================
led = Pin(2, Pin.OUT)

gerador = Pin(14, Pin.IN, Pin.PULL_DOWN)  # sensor que ativa a tranca
tranca = Pin(11, Pin.OUT)  # saída para trava magnética

fliper = Pin(35, Pin.IN)  # sensor PIR que libera o dispenser
dispenser = Pin(26, Pin.OUT)  # saída que controla o dispenser

sensor_dispenser = Pin(34, Pin.IN)  # PIR interno do dispenser
cena6 = Pin(27, Pin.OUT)  # saída digital para cena 6

# ================================
# CONFIGURAÇÃO DE REDE E MQTT
# ================================
wifi_ssid = "escape-run"
wifi_password = "escape-run"

mqtt_client_id = "room-12-1"
mqtt_broker = "escape-run.sj.ifsc.edu.br"

mqtt_topic_subscribe = b"escape-run/room/12/1"
mqtt_topic_publish = b"escape-run/player/msg"

# ================================
# PARÂMETROS DO SISTEMA
# ================================
DISPENSER_PULSE_S = 1.0
LOCK_HOLD_S = 5.0
CENA6_PULSE_S = 2.0


# ================================
# FUNÇÕES DE CONFIGURAÇÃO
# ================================
def setup():
    led.off()
    tranca.off()
    dispenser.off()
    cena6.off()
    print("Sistema iniciado. Aguardando sensores...")


def blink():
    for _ in range(3):
        led.off()
        sleep(0.1)
        led.on()
        sleep(0.1)
    led.off()


def panic():
    tranca.off()
    dispenser.on()
    cena6.off()
    print("PANIC acionado: todas as travas liberadas!")
    mqtt_client.publish(mqtt_topic_publish, b"panic_acionado")


# ================================
# CONEXÃO WIFI E MQTT
# ================================
def connect_wifi():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(wifi_ssid, wifi_password)

    while not wlan.isconnected():
        print("Conectando ao Wi-Fi...")
        sleep(1)

    print("Conectado ao Wi-Fi! IP:", wlan.ifconfig()[0])


def connect_mqtt():
    client = MQTTClient(mqtt_client_id, mqtt_broker)
    client.set_callback(callback)
    client.connect()
    print("Conectado ao broker MQTT!")
    led.on()
    return client


# ================================
# CALLBACK MQTT
# ================================
def callback(topic, payload):
    msg = payload.decode()
    print("Mensagem recebida:", msg)

    # === COMANDOS DE CONTROLE GERAIS ===
    if msg == "blink":
        blink()

    elif msg == "panic":
        panic()

    elif msg == "reset":
        reset()

    # === CENAS ESPECÍFICAS ===
    elif msg == "trava_on":
        tranca.on()
        mqtt_client.publish(mqtt_topic_publish, b"trava_forcada_on")
        print("Trava acionada manualmente.")

    elif msg == "trava_off":
        tranca.off()
        mqtt_client.publish(mqtt_topic_publish, b"trava_forcada_off")
        print("Trava desligada manualmente.")

    elif msg == "dispenser_on":
        dispenser.on()
        mqtt_client.publish(mqtt_topic_publish, b"dispenser_forcado_on")
        print("Dispenser ativado manualmente.")

    elif msg == "dispenser_off":
        dispenser.off()
        mqtt_client.publish(mqtt_topic_publish, b"dispenser_forcado_off")
        print("Dispenser desligado manualmente.")


def subscribe(client):
    client.subscribe(mqtt_topic_subscribe)
    print("Inscrito no tópico:", mqtt_topic_subscribe.decode())


# ================================
# FUNÇÕES DE SENSOR E ATUADOR
# ================================
def verifica_gerador():
    """Verifica sensor gerador e aciona tranca."""
    if gerador.value() == 1:
        print("Sensor GERADOR acionado → TRAVA ativada!")
        tranca.on()
        mqtt_client.publish(mqtt_topic_publish, b"trava_ativada")
        blink()
        sleep(LOCK_HOLD_S)
        tranca.off()


def verifica_fliper():
    """Verifica sensor PIR (fliper) e libera o dispenser."""
    if fliper.value() == 1:
        print("Sensor FLIPER acionado → DISPENSER liberado!")
        dispenser.on()
        mqtt_client.publish(mqtt_topic_publish, b"dispenser_ativado")
        blink()
        sleep(DISPENSER_PULSE_S)
        dispenser.off()
        mqtt_client.publish(mqtt_topic_publish, b"dispenser_finalizado")
        print("Dispenser desligado.")


def verifica_sensor_dispenser():
    """Verifica o PIR dentro do dispenser e aciona a saída cena6."""
    if sensor_dispenser.value() == 1:
        print("Sensor DISPENSER interno acionado → Sinal para CENA 6!")
        cena6.on()
        mqtt_client.publish(mqtt_topic_publish, b"cena6_ativada")
        blink()
        sleep(CENA6_PULSE_S)
        cena6.off()


# ================================
# LOOP PRINCIPAL
# ================================
if __name__ == "__main__":
    setup()
    connect_wifi()
    mqtt_client = connect_mqtt()
    subscribe(mqtt_client)

    while True:
        mqtt_client.publish(mqtt_topic_publish, b"ping")
        mqtt_client.check_msg()
        sleep(1)

        verifica_gerador()
        verifica_fliper()
        verifica_sensor_dispenser()
