#! /bin/bash

mkdir -p ./tmp
git clone --depth 1 https://github.com/champierre/tmpose2scratch.git tmp/tmpose2scratch
git apply extensions/tmpose2scratch.patch
sh tmp/tmpose2scratch/install.sh
