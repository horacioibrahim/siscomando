#!/bin/bash

# Vulcanize
vulcanize --strip-comments --inline-css src/index.html > scapp/www/index.html
# Copy .js and images
cp -r src/assets/* scapp/www/assets/
cp -r src/assets/img/* scapp/www/img/