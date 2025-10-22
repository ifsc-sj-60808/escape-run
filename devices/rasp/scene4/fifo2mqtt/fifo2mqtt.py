import os
import errno
import select
import time
import paho.mqtt.client as mqtt  # type: ignore

FIFO_PATH = "/tmp/p8_out"
MQTT_BROKER = "escape-run.sj.ifsc.edu.br"
MQTT_PORT = 1883
MQTT_TOPIC = "escape-run/player/scene"
MQTT_PAYLOAD = "Scene5"
POLL_TIMEOUT = 1.0  # 1 second
READ_SIZE = 1  # 1 byte


def fifo_create():
    print("Creating FIFO...")
    if not os.path.exists(FIFO_PATH):
        os.mkfifo(FIFO_PATH, 0o600)


def fifo_open():
    print("Opening FIFO...")
    fd = os.open(FIFO_PATH, os.O_RDONLY | os.O_NONBLOCK)
    fifo = os.fdopen(fd, "rb", buffering=0)

    poller = select.poll() if hasattr(select, "poll") else None
    if poller:
        poller.register(fd, select.POLLIN)
    return fifo, poller


def fifo_read(fifo, poller):
    print("Reading from FIFO...")
    if poller:
        events = poller.poll(int(POLL_TIMEOUT * 1000))
        if not events:
            print("No data available to read.")
        try:
            byte = fifo.read(READ_SIZE)  # read 1 byte
        except BlockingIOError:
            print("No data available to read (BlockingIOError).")

        return byte


def fifo_close(fifo):
    print("Closing FIFO...")
    if os.path.exists(FIFO_PATH):
        fifo.close()


def fifo_delete():
    print("Deleting FIFO...")
    if os.path.exists(FIFO_PATH):
        os.remove(FIFO_PATH)


def mqtt_connect():
    print("Connecting to MQTT broker...")
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)  # type: ignore
    client.connect(MQTT_BROKER, MQTT_PORT)
    client.loop_start()
    return client


if __name__ == "__main__":
    try:
        mqtt_client = mqtt_connect()
        fifo_create()
        fifo, poller = fifo_open()

        while True:
            byte = fifo_read(fifo, poller)
            if byte == b"1":
                print("Publishing MQTT message...")
                mqtt_client.publish(MQTT_TOPIC, payload=MQTT_PAYLOAD)
            time.sleep(1)
    except KeyboardInterrupt:
        print("Exiting...")
    finally:
        try:
            fifo_close(fifo)
            fifo_delete()
        except Exception:
            pass
        mqtt_client.loop_stop()
        mqtt_client.disconnect()
