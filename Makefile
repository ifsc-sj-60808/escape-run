all: sync clean build restart

sync:
	sudo git pull

clean:
	sudo npm run clean

build:
	sudo npm run build

restart:
	sudo systemctl restart escape-run.service
