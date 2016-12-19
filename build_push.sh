#!/usr/bin/bash
#gulp
#rsync -avr build/* .
JEKYLL_ENV=production jekyll build --incremental
#JEKYLL_ENV=production jekyll build 
git add *
git ci -am 'update this repo'
echo "start push .."
expect ~/.account/github.sh
echo " end push ..."
echo "please visit https://robertzhai.github.io/ "
echo "done";
