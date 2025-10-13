all: sync clean build

sync:
	sudo git pull

clean:
	npm run clean

build:
	npm run build
