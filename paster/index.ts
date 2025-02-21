// import modules
// caution: `eventLoop` HAS to be imported before `gui`, and `gui` HAS to be
// imported before any `gui` submodules.
import * as storage from "@next-flip/fz-sdk-mntm/storage";
import * as usbdisk from "@next-flip/fz-sdk-mntm/usbdisk";
import * as badusb from "@next-flip/fz-sdk-mntm/badusb";

let imagePath = "/ext/apps_data/mass_storage/128MB.img";
let imageSize = 128 * 1024 * 1024;

let fileContent;

print("Checking for Image...");
if (storage.fileExists(imagePath)) {
    print("Storage Exists.");
} else {
    print("Creating Storage...");
    usbdisk.createImage(imagePath, imageSize);
}

badusb.setup({
    vid: 0xaaaa,
    pid: 0xbbbb,
    mfrName: "Flipper",
    prodName: "Zero",
    layoutPath: "/ext/badusb/assets/layouts/fr-FR.kl",
});

while (!badusb.isConnected()) {
    delay(1000);
}

print("Copying file...");
badusb.press("CTRL", "P");
delay(1000);
badusb.press("CTRL", "ALT", "c");
delay(1000);
badusb.press("CTRL", "ALT", "t");
delay(2000);
print("Pasting file...");

badusb.print(
    "nautilus & echo 'Pease wait until the command ends to eject the disk!'; sleep 10; cp "
);
badusb.press("CTRL", "V");
badusb.print(
    '   /media/$USER/128MB/topaste; umount /media/$USER/128MB/; udisksctl power-off  -b "/dev/$(lsblk -o NAME,TRAN,LABEL | grep 128 | grep -oE sd[a-z])"; exit'
);
delay(1000);
badusb.press("ENTER");
badusb.quit();

delay(2000);
usbdisk.start(imagePath);

while (!usbdisk.wasEjected()) {
    delay(1000);
}
usbdisk.stop();
if (doesSdkSupport(["storage-virtual"])) {
    storage.virtualInit(imagePath);
    storage.virtualMount();
    print("Virtual storage mounted");
    let file = storage.openFile("/mnt/topaste", "r", "open_existing");
    fileContent = file.read('ascii', file.size());
    file.close();
    storage.virtualQuit();
} else {
    die("Virtual storage not supported");
}

badusb.setup({
    vid: 0xaaaa,
    pid: 0xbbbb,
    mfrName: "Flipper",
    prodName: "Zero",
    layoutPath: "/ext/badusb/assets/layouts/fr-FR.kl",
});

print("Reconnect BadUSB when ready...");
delay(2000);
while (badusb.isConnected()) {
    delay(1000);
}
while (!badusb.isConnected()) {
    delay(1000);
}
print("BadUSB connected, pasting file content...");

delay(2000);
badusb.print(fileContent);
badusb.quit();
print("Done!");