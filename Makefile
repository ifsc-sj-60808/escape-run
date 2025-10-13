all: sync clean build

sync:
	sudo git pull

clean:
	sudo npm run clean

build:
	sudo npm run build
