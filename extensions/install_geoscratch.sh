#! /bin/bash

# Check if the patch is applicable
git apply --check extensions/geoscratch.patch
if [ $? -eq 0 ]; then
    echo "Applying patch extensions/geoscratch.patch"
    git apply extensions/geoscratch.patch
fi

sh node_modules/geoscratch/install.sh
