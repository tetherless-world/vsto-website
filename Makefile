.PHONY: build

build: node_modules package.json
	nodejs --harmony index.js local

prod: node_modules package.json
	nodejs --harmony index.js prod

install: node_modules package.json
	npm install

help:
	@echo "build - builds locally"
