.PHONY: build

build: node_modules package.json
	node --harmony index.js local

install: node_modules package.json
	npm install

help:
	@echo "build - builds locally"
