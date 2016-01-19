#!/bin/bash

# Development time hacks. To comment this when in production
# Access to see more http://debug-software.intel.com/client/#y2xTv4rXcg8e2Bx0Ht1OszIiSqmpJUxdmW_GcyVPcps
# comment/uncomment:
WEINER='<script src=\"http:\/\/debug-software.intel.com\/target\/target-script-min.js#y2xTv4rXcg8e2Bx0Ht1OszIiSqmpJUxdmW_GcyVPcps\"><\/script><\/body>'

if [ ! -z "$WEINER" ]
    then
    sed -i.bak "s/<\/body>/$WEINER/g" src/index.html
fi

# Vulcanize
vulcanize --strip-comments --inline-css src/index.html > scapp/www/index.html

# Copy .js and images
cp -r src/assets/* scapp/www/assets/
cp -r src/assets/img/* scapp/www/img/

# Return original HTML
mv src/index.html.bak src/index.html