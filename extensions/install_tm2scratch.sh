#! /usr/bin/bash

mkdir -p ./tmp
# Delete the existing folder if it exists
rm -rf tmp/tm2scratch
git clone --depth 1 https://github.com/champierre/tm2scratch.git tmp/tm2scratch
git apply extensions/tm2scratch.patch
sh tmp/tm2scratch/install.sh
