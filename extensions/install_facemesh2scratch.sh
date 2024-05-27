#! /usr/bin/bash

mkdir -p ./tmp

# Delete the existing folder if it exists
rm -rf tmp/facemesh2scratch
git clone --depth 1 https://github.com/champierre/facemesh2scratch.git tmp/facemesh2scratch
git apply extensions/facemesh2scratch.patch
sh tmp/facemesh2scratch/install.sh
