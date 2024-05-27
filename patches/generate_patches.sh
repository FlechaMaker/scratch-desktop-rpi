#! /bin/sh

echo "Generating patches for scratch3_pibuildhat"
cp -r raspberry-pi/extensions/scratch3_pibuildhat/scripts static/

# Generate patch for scratch-vm extension folder
mkdir -p node_modules/scratch-vm/src/extensions/scratch3_pibuildhat
git diff --no-index node_modules/scratch-vm/src/extension-support/extension-manager.js raspberry-pi/patch/scratch-vm/src/extension-support/extension-manager.js | sed 's/\/raspberry-pi\/patch/\/node_modules/g' > patches/scratch-vm_extension-manager.patch
git diff --no-index node_modules/scratch-vm/src/extensions/scratch3_pibuildhat/ raspberry-pi/extensions/scratch3_pibuildhat/ | sed 's/\/raspberry-pi\/extensions/\/node_modules\/scratch-vm\/src\/extensions/g' > patches/scratch-vm_scratch3_pibuildhat.patch

# Generate patch for scratch-gui extension folder
mkdir -p node_modules/scratch-gui/src/lib/libraries/extensions/pibuildhat
git diff --no-index node_modules/scratch-gui/src/lib/libraries/extensions/index.jsx raspberry-pi/extensions_data/index.jsx | sed 's/\/raspberry-pi\/extensions_data/\/node_modules\/scratch-gui\/src\/lib\/libraries\/extensions/g' > patches/scratch-gui_extensions_data_index.patch
git diff --no-index --binary node_modules/scratch-gui/src/lib/libraries/extensions/pibuildhat/ raspberry-pi/extensions_data/pibuildhat/ | sed 's/\/raspberry-pi\/extensions_data/\/node_modules\/scratch-gui\/src\/lib\/libraries\/extensions/g' > patches/scratch-gui_pibuildhat.patch
