import subprocess
import os
import signal
import time
import paho.mqtt.client as mqtt  # type: ignore

VIDEO_FILE = "video.mp4"
MQTT_BROKER = "escape-run.sj.ifsc.edu.br"
MQTT_PORT = 1883
MQTT_SUBSCRIBE_TOPIC = "escape-run/devices/scene2/0"
MQTT_PUBLISH_TOPIC = "escape-run/player/scene"
PASSWORD = "093"

vlc_process = None


def play_video():
    global vlc_process
    vlc_process = subprocess.Popen(
        ["cvlc", "--fullscreen", "--no-video-title-show", VIDEO_FILE],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )


def stop_video():
    global vlc_process
    if vlc_process:
        os.kill(vlc_process.pid, signal.SIGTERM)
        vlc_process = None


def on_message(client, userdata, message):
    payload = message.payload.decode()
    print(payload)

    if payload == PASSWORD:
        play_video()

        time.sleep(20)
        client.publish(MQTT_PUBLISH_TOPIC, "Scene3")
        client.publish("devices/esp/scene3/0", "led1")
        
        #time.sleep(600)
        #stop_video()


def mqtt_setup():
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)  # type: ignore
    client.on_message = on_message
    client.connect(MQTT_BROKER, MQTT_PORT)
    client.subscribe(MQTT_SUBSCRIBE_TOPIC)
    client.loop_start()
    return client


if __name__ == "__main__":
    mqtt_client = mqtt_setup()

    while True:
        time.sleep(1)
