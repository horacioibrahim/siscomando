#!/bin/bash

# Development time hacks. To comment this when in production
# Access to see more http://debug-software.intel.com/client/#y2xTv4rXcg8e2Bx0Ht1OszIiSqmpJUxdmW_GcyVPcps
# comment/uncomment:
#WEINER='<script src=\"http:\/\/debug-software.intel.com\/target\/target-script-min.js#y2xTv4rXcg8e2Bx0Ht1OszIiSqmpJUxdmW_GcyVPcps\"><\/script><\/body>'

CORDOVA='<script src=\"cordova.js\"><\/script><\/body>'
    
if [ ! -z "$WEINER" ]
    then
    sed -i.bak "s/<\/body>/$WEINER/g" src/index.html
fi

realpath() {
  [[ $1 = /* ]] && echo "$1" || echo "$PWD/${1#./}"
}

DIRECTORY_PROJECT=`realpath`

# Vulcanize
vulcanize --strip-comments --inline-css src/index.html > scapp/www/index.html
sed -i.bak "s/<\/body>/$CORDOVA/g" scapp/www/index.html

# Copy .js and images
cp -r src/assets/* scapp/www/assets/
# cp -r src/assets/img/* scapp/www/img/
cp -r src/elements/* scapp/www/elements/

# Return original HTML
if [ ! -z "$WEINER" ]
    then
        mv src/index.html.bak src/index.html
fi

# Deploy cordova
cd $DIRECTORY_PROJECT 
cd scapp

cordova prepare
cordova build android
# if android device connected will work fine!
cordova run android

# End 
date
