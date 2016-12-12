lib/app.js: src/app.js
	npm run browserify $< -- -o $@

build: lib/app.js

.PHONY: build
