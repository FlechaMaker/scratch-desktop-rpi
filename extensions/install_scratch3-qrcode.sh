#! /usr/bin/bash

mkdir -p ./tmp
# Delete the existing folder if it exists
rm -rf tmp/scratch3-qrcode
git clone --depth 1 https://github.com/sugiura-lab/scratch3-qrcode.git tmp/scratch3-qrcode
git apply extensions/scratch3-qrcode.patch
sh tmp/scratch3-qrcode/install.sh
