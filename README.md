# esx-inventory
Browser-based thumbnail display of virtual machines on an ESXi host

## What Does It Do?
This project allows you to monitor the status of all virtual machines running on an ESXi host. It is a simple HTML web page that uses AJAX to communicate with the MOB (managed object browser) of the host, retrieving the list of virtual machines, and then displays thumbnail views of each of them which update every 5 seconds.

## Installation
MOB must be enabled on the host to use this project: https://kb.vmware.com/kb/2108405

> 1. In the vSphere Client, select the host in the inventory.
> 2. In the right pane, click the **Configuration** tab.
> 3. Under Software, select **Advanced Settings**.
> 4. From the left pane of the Advanced Settings dialog box, select **Config > HostAgent > plugins > solo**.
> 5. Select **Config.HostAgent.plugins.solo.enableMob** to enable the Managed Object Browser.

That is the only prerequisite for using this project.

* Upload the project to one of your datastores, for example: /vmfs/volumes/datastore1/esx-inventory
* Using SSH or other means, create a symbolic link to the project from ESXi's web root:
```
ln -s /vmfs/volumes/datastore1/esx-inventory /usr/lib/vmware/hostd/docroot
```
* Access the project from the ESXi host's web server:
```
https://your-esxi-host/esx-inventory/
```
* You will be prompted for credentials twice: first to access the MOB, and then to retrieve the thumbnails
  * TODO: What permissions are required to access MOB and show thumbnails?

## Customization
By default, the script will scale the thumbnail and extract a sub region of the VM's display, based on the parameters present in `index.js`. Initially the configuration is set for VMs with a 4:3 aspect ratio, but by modifying `imgWidth` and `imgHeight` you can tailor the script to your needs.

## Credits
Naturally, this project would not have been possible without some help from the web.

Big thanks to William Lam for his excellent article on VM screenshots, which made me realize this project could be accomplished:
https://blogs.vmware.com/vsphere/2013/01/capturing-virtual-machine-screenshots-in-vsphere.html

And of course, using the MOB to obtain the moid of the VMs:
https://kb.vmware.com/kb/1017126
