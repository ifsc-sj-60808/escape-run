from machine import Pin, reset, PWM, SoftI2C  # pyright: ignore[reportMissingImports]
import network  # pyright: ignore[reportMissingImports]
from umqtt.simple import MQTTClient  # pyright: ignore[reportMissingImports]
from time import sleep
from lcd_api import LcdApi
from i2c_lcd import I2cLcd

# filtro lcd:

# Configurações I2C (pinos padrão para ESP32)
I2C_ADDR = 0x27  # Endereço I2C comum para o módulo PCF8574
totalRows = 2
totalColumns = 16

# Inicializa I2C (GPIO 22 para SCL, GPIO 21 para SDA)
i2c = SoftI2C(scl=Pin(22), sda=Pin(21), freq=10000)
lcd = I2cLcd(i2c, I2C_ADDR, totalRows, totalColumns)

# Configurações do PWM para o Backlight
# Escolha um pino GPIO para controlar o backlight (ex: GPIO 13)
BACKLIGHT_PIN = 13
pwm = PWM(Pin(BACKLIGHT_PIN), freq=1000)  # Inicializa PWM com 1KHz


device = "scene4"
device_number = "0"
led = Pin(2, Pin.OUT)
luz_gerador_ligado = Pin(26, Pin.OUT)
luz_gerador_desligado = Pin(25, Pin.OUT)
sensor_metal = Pin(33, Pin.IN, Pin.PULL_DOWN)
wifi_ssid = "escape-run"
wifi_password = "escape-run"
broker = "escape-run.sj.ifsc.edu.br"

device_name = "-".join([device, device_number])
topic_subscribe = "/".join(["escape-run", "devices", device, device_number])
topic_publish = "escape-run/player/scene"
wlan = network.WLAN()
mqtt_client = MQTTClient(device_name, broker, keepalive=60)
last_read = 0
scanning = True


def setup():
    print("Iniciando código...")
    led.off()
    luz_gerador_ligado.off()
    luz_gerador_desligado.on()

    lcd.clear()
    lcd.backlight_off()
    lcd.putstr("Energia         Desligada")

    print("Sensores e atuadores configurados.")


def sensor_pre():
    print("30s para evacuar local...")
    # sleep(30)
    print("Tempo esgotado!")


def blink(num=1):
    for _ in range(num):
        sleep(0.1)
        led.off()
        sleep(0.1)
        led.on()


def wifi_connect():
    print("Conectando ao Wi-Fi...")
    wlan.active(True)
    wlan.connect(wifi_ssid, wifi_password)
    while not wlan.isconnected():
        print("Conectando ao Wi-Fi...")
        sleep(1)
    print("Conectado ao Wi-Fi!")


def callback(topic, payload):
    msg = payload.decode()
    print("Mensagem recebida:", msg)
    blink()
    if msg == "open" or msg == "unlock" or msg == "panic":
        print("Abrindo cofre...")
        # control.on()
        mqtt_client.publish(topic_publish, "Scene5")
    elif msg == "close" or msg == "lock":
        print("Fechando cofre...")
        # control.off()
    elif msg == "reset":
        print("Reiniciando dispositivo...")
        reset()


def mqtt_connect():
    global mqtt_client
    mqtt_client.connect(timeout=5)
    print("Conectado ao broker MQTT!")
    mqtt_client.set_callback(callback)
    mqtt_client.subscribe(topic_subscribe)
    print("Definidos callback e assinatura do tópico", topic_subscribe)
    led.on()


def read_sensor_metal():
    global last_read, scanning
    current_read = sensor_metal.value()
    if current_read > last_read:
        print("gerador ligado!")
        mqtt_client.publish(topic_publish, "Scene5")
        blink()
        luz_gerador_ligado.on()
        luz_gerador_desligado.off()

        lcd.clear()
        lcd.backlight_on()
        lcd.putstr("Energia         Ligada!")

        scanning = False
    last_read = current_read


if __name__ == "__main__":
    setup()
    wifi_connect()
    sensor_pre()

    while True:
        blink()
        try:
            mqtt_connect()
            while True:
                if scanning:
                    read_sensor_metal()
                mqtt_client.check_msg()
                sleep(1)
        except OSError as e:
            print(f"Erro de conexão: {e}")
            sleep(5)
