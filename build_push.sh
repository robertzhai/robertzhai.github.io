#!/usr/bin/bash
#gulp
#rsync -avr build/* .
JEKYLL_ENV=production jekyll build --incremental
git add *
git ci -am 'update this repo'
echo "start push .."
expect ~/.account/github.sh
echo " end push ..."
