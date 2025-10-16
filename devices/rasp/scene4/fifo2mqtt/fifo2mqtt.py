import os
import errno
import select
import time
import paho.mqtt.client as mqtt

FIFO_PATH = "/tmp/p8_out"
MQTT_BROKER = "escape-run.sj.ifsc.edu.br"
MQTT_PORT = 1883
MQTT_TOPIC = "escape-run/player/scene"
MQTT_PAYLOAD = "Scene5"
POLL_TIMEOUT = 1.0 # 1 second
READ_SIZE = 1 # 1 byte

if not os.path.exists(FIFO_PATH):
    os.mkfifo(FIFO_PATH, 0o600)

client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
client.connect(MQTT_BROKER, MQTT_PORT)
client.loop_start()

fd = os.open(FIFO_PATH, os.O_RDONLY | os.O_NONBLOCK)
fifo = os.fdopen(fd, "rb", buffering=0)

try:
    poller = select.poll() if hasattr(select, "poll") else None
    if poller:
        poller.register(fd, select.POLLIN)
    while True:
        if poller:
            events = poller.poll(int(POLL_TIMEOUT * 1000))
            if not events:
                continue
        else:
            rlist, _, _ = select.select([fifo], [], [], POLL_TIMEOUT)
            if not rlist:
                continue

        try:
            byte = fifo.read(READ_SIZE)  # read 1 byte
        except BlockingIOError:
            continue

        if not byte:
            try:
                fifo.close()
            except Exception:
                pass
            os.close(fd)
            fd = os.open(FIFO_PATH, os.O_RDONLY | os.O_NONBLOCK)
            fifo = os.fdopen(fd, "rb", buffering=0)
            continue

        print(f"Read byte: {byte.hex()}")

        if (byte == b'1'):
            client.publish(MQTT_TOPIC, payload=MQTT_PAYLOAD, qos=0)

except KeyboardInterrupt:
    pass
finally:
    try:
        fifo.close()
    except Exception:
        pass
    client.loop_stop()
    client.disconnect()
