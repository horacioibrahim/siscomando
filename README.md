Siscomando
=============
The place to connect all communication on high impact problems in the environment ITC organizations. [Pre-release page](https://agile-lake-26676.herokuapp.com/).


Deploy
======
Install all requirements.

# For Polymer:

    1. access DIRECTORY_PROJECT/src/elements
    2. run: `bower install`

# For Cordova (plugins): if needs to check plugins direcotry into scapp and to install it.

For successfully deployment you need kwnow that basically whether the cordova project already was created. The "deployment flow" written in the `deploy.sh` is only to build .html, .js, .css and images to `DIRECTORY_PROJECT/scapp/www` folder (where DIRECTORY_PROJECT is cordova's project). This last `www` folder is a concept from cordova's projects (if you uses it. you knows).

Deploy in the device (in the terminal):
=======================================
    1. Connect the device
    2. Check if it's connected with:
        $ adb devices (you can need run adb without arguments to run adb server)
    3. Run custom script:
        $ cd DIRECTORY_PROJECT/
        $ ./deploy.sh
