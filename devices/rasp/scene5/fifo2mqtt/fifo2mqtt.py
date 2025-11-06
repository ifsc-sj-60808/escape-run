import os
import errno
import select
import time
import paho.mqtt.client as mqtt  # type: ignore

FIFO_PATH = "/tmp/p8_out"
MQTT_BROKER = "escape-run.sj.ifsc.edu.br"
MQTT_PORT = 1883
MQTT_TOPIC = "escape-run/devices/scene5-0"
MQTT_PAYLOAD = "release"
POLL_TIMEOUT = 1.0  # 1 second
READ_SIZE = 1  # 1 byte
RUNNING = True


def fifo_create():
    """Create the FIFO if it doesn't exist."""

    if not os.path.exists(FIFO_PATH):
        os.mkfifo(FIFO_PATH, 0o600)


def fifo_open():
    """Open the FIFO for reading."""

    fd = os.open(FIFO_PATH, os.O_RDONLY | os.O_NONBLOCK)
    fifo = os.fdopen(fd, "rb", buffering=0)

    poller = select.poll() if hasattr(select, "poll") else None
    if poller:
        poller.register(fd, select.POLLIN)
        return fifo, poller

    return fifo, None


def fifo_read(fifo, poller):
    """Read from the FIFO."""

    if poller:
        events = poller.poll(int(POLL_TIMEOUT * 1000))

        if not events:
            return None

        try:
            byte = fifo.read(READ_SIZE)  # read 1 byte

        except BlockingIOError:
            RUNNING = False

        finally:
            return byte

    return None


def fifo_close(fifo):
    """Close the FIFO."""

    if os.path.exists(FIFO_PATH):
        fifo.close()


def fifo_delete():
    """Delete the FIFO."""

    if os.path.exists(FIFO_PATH):
        os.remove(FIFO_PATH)


def mqtt_connect():
    """Connect to the MQTT broker."""

    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)  # type: ignore
    client.connect(MQTT_BROKER, MQTT_PORT)
    client.loop_start()
    return client


if __name__ == "__main__":
    try:
        mqtt_client = mqtt_connect()

        fifo_create()
        fifo, poller = fifo_open()

        while RUNNING:
            byte = fifo_read(fifo, poller)

            if byte == b"1":
                mqtt_client.publish(MQTT_TOPIC, payload=MQTT_PAYLOAD)

            time.sleep(1)

    except KeyboardInterrupt:
        pass

    finally:
        try:
            fifo_close(fifo)
            fifo_delete()

        except Exception:
            pass

        mqtt_client.loop_stop()
        mqtt_client.disconnect()
