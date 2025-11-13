all: sync clean build restart

sync:
	git pull

clean:
	npm run clean

build:
	npm run build

restart:
	sudo systemctl restart escape-run.service
