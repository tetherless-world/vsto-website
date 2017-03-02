.PHONY: build

build: node_modules package.json
	npm install
	node --harmony index.js local

help:
	@echo "build - builds locally"
