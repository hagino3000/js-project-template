.PHONY: setup start lint clean test build deploy


setup:
	npm install

start:
	npm run start

lint:
	npm run lint

watch:
	npm run watch

test:
	# FIXME

clean:
	rm -rf dist

build: clean
	npm run build

deploy:
	# FIXME
