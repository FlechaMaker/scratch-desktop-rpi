#! /bin/bash

# Check if the patch is applicable
git apply --check extensions/speech2scratch_main.patch
if [ $? -eq 0 ]; then
    echo "Applying patch extensions/speech2scratch_main.patch"
    git apply extensions/speech2scratch_main.patch
fi

git apply --check extensions/speech2scratch.patch
if [ $? -eq 0 ]; then
    echo "Applying patch extensions/speech2scratch.patch"
    git apply extensions/speech2scratch.patch
fi

sh node_modules/speech2scratch/install.sh
