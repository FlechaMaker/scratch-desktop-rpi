#! /bin/bash

# Check if the patch is applicable
git apply --check extensions/posenet2scratch.patch
if [ $? -eq 0 ]; then
    echo "Applying patch extensions/posenet2scratch.patch"
    git apply extensions/posenet2scratch.patch
fi

sh node_modules/posenet2scratch/install.sh
