FIRMWARE = ESP32_GENERIC-20250911-v1.26.1.bin
DEV = /dev/ttyUSB0

all: clean download flash install-libs
app: write-app repl

clean:
	rm -f ${FIRMWARE}

download:
	pip install -r requirements.txt
	curl https://micropython.org/resources/firmware/${FIRMWARE} -o ${FIRMWARE}

flash:
	esptool erase-flash
	esptool write-flash 0x1000 ${FIRMWARE}

install-libs:
	ampy --port ${DEV} mkdir lib
	ampy --port ${DEV} mkdir lib/umqtt
	ampy --port ${DEV} put simple.py lib/umqtt/simple.py
	ampy --port ${DEV} put robust.py lib/umqtt/robust.py

write-app:
	ampy --port ${DEV} put main.py

repl:
	minicom -D ${DEV} -b 115200
