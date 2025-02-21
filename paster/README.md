# Paster (Tested on Ubuntu 24.04)
This script will copy the contents of a file, and "write" it to the current cursor position.  
This is useful for copying contents of a file to another file when you don't have "copy-paste" functionality.  

## Usage
Open and focus the file you want to copy in VS Code, then run the script.  
The script will copy the contents of the file and paste it to the the created img.  
The script will ask to reconnect the USB to "write" the file. (remove and plug back in, since we cannot get the DPad input)  

## Installation
   1. Run `npm install` in the root directory of the project.
   2. Connect the Flipepr & Run `npm start` to build and copy the project to the Flipper.

## Notes
- The script will not work if the file is too large.
- Check the keyboad layout in the script, and change it if needed.
- The GUI api is not used due to a bug in the API with the `usbdisk` module (Out of memory error).
- Tested on an Ubuntu 24.04 machine.