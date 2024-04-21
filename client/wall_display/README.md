Add the contents of the autostart file to the raspberry pi here:
/etc/xdg/lxsession/LXDE-pi/autostart



Add these two lines to /boot/config.txt and reboot Raspbmc:

hdmi_force_hotplug=1
hdmi_drive=2

hdmi_force_hotplug=1 sets the Raspbmc to use HDMI mode even if no HDMI monitor is detected. hdmi_drive=2 sets the Raspbmc to normal HDMI mode (Sound will be sent if supported and enabled). Without this line, the Raspbmc would switch to DVI (with no audio) mode by default.
