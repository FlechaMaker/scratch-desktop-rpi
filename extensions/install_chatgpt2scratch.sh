#! /bin/bash

# Check if the patch is applicable
git apply --check extensions/chatgpt2scratch.patch
if [ $? -eq 0 ]; then
    echo "Applying patch extensions/chatgpt2scratch.patch"
    git apply extensions/chatgpt2scratch.patch
fi

sh node_modules/chatgpt2scratch/install.sh
