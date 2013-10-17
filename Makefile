JS_FILES=$(shell find public -type f -name '*.js')
CSS_FILES=$(shell find public -type f -name '*.css')
STYL_FILES=$(shell find public -type f -name '*.styl')
PARTIAL_FILES=$(shell find public -type f -name '*.jade')

prod: build build/build.min.js build/build.min.css hash

build: components lint build/build.js build/build.css

# Watch the js files
build/build.js: $(JS_FILES)
	@./node_modules/.bin/component build --copy --use nghtml,stylus --standalone pivot

build/build.min.js: build/build.js
	@./node_modules/.bin/uglifyjs --compress --mangle -o build/build.min.js build/build.js

# Watch the css files
build/build.css: $(CSS_FILES) $(STYL_FILES) $(PARTIAL_FILES)
	@./node_modules/.bin/component build --copy --use nghtml,stylus --standalone pivot

# Minify the css
build/build.min.css: build/build.css
	@./node_modules/.bin/cleancss --remove-empty --s0 --skip-import --output $@ $<

components: component.json
	@./node_modules/.bin/component install

lint: $(JS_FILES)
	@./node_modules/.bin/jshint public/javascripts/*

hash: $(wildcard build/*)
	@./node_modules/.bin/simple-assets --glob 'build/**/!(cache-)*' --copy --prefix cache-

clean:
	rm -fr build components

.PHONY: clean build prod lint build
