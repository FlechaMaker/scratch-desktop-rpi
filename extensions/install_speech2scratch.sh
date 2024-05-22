#! /bin/bash

git apply extensions/speech2scratch_main.patch
git apply extensions/speech2scratch.patch
sh node_modules/speech2scratch/install.sh
