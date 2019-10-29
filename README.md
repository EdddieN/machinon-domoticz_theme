# Machinon theme

[![Join the chat at https://gitter.im/machinon-domoticz_theme/community](https://badges.gitter.im/machinon-domoticz_theme/community.svg)](https://gitter.im/machinon-domoticz_theme/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) ![alt tag](https://img.shields.io/badge/dynamic/json.svg?label=Version&url=https%3A%2F%2Fraw.githubusercontent.com%2FEdddieN%2Fmachinon-domoticz_theme%2Fmaster%2Ftheme.json&query=version&colorB=blue) [![DeepScan grade](https://deepscan.io/api/teams/5668/projects/7507/branches/77435/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=5668&pid=7507&bid=77435)

# WORK IN PROGRESS

This is a theme for Domoticz in machinon project. Theme in progress with project machinon:
https://github.com/EdddieN/machinon

ToDo
- [X]   In Progress
- [X] 1.- Selector boxes, need update design
- [X] 2.- Hardware page and devices need updating 
- [X] 3.- Tiles with new text and bigger size values
- [X] 4.- Settings page re-design -> Eddie 
- [X] 5.- When a device is offline the tile should fade off, is this possible? -> Zeplin
- [X] 6.- Timers screen -> Eddie -> Zeplin
- [X] 7.- Charts screens -> Eddie -> Zeplin
- [X] 8.- Remove go back button from design on settings -> Eddie  
  
Ideas (wish list)
- [ ]   In Progress
- [ ] 1.- Custom merge multiple metrics into one tile (ie: energy + trigger switch)
- [X] 2.- Dark theme 


## Installing

On your Raspberry Pi, in Domoticz theme directory :

```
cd /home/${USER}/domoticz/www/styles
git clone https://github.com/EdddieN/machinon-domoticz_theme.git machinon
sudo /etc/init.d/domoticz.sh restart
```

### Domoticz version previous 4.10393

In Domoticz version before 4.10393 the tabs for switches, scenes and utility is width is not correct.
There is modified html files in `../machinon/views` to replace files in `../www/views`


## Updating
```
cd /home/${USER}/domoticz/www/styles/machinon
git pull
```

## Checking beta
```
cd domoticz/www/styles
git clone https://github.com/EdddieN/machinon-domoticz_theme.git machinon-beta
cd machinon-beta
git checkout beta
```

### Finally preview:

![Idea of theme machinon](/images/readme/idea_domoticz_machinon.jpg)

Dark Theme
![Dark Theme](/images/readme/dark_theme.png)

Compact Dashboard with camera
![Compact Dashboatd camera](/images/readme/compact_dash.png)

New setup layout
![Suggested new Setup layout - not implemented yet](/images/unorganised/screen_references/setup.png)

## Cache problems:

A lot of the problems users experience after a domoticz update are gone when the browsercache and appcache are cleared. There are also quite a number of posts on this forum related to these kind of problems. 

To summarize and sorted from little effort to a bit more effort take these steps and check after each step if it address the issues you encounter.

- clear browser cache and appcache 
Chrome: chrome://appcache-internals/#
Firefox: https://support.mozilla.org/en-US/kb/storage 

- in www/js look for domoticz.js.gz, if its there remove it, (KEEP domoticz.js !! )
- use incognito mode using 
Chrome [control] [shift] n
Firefox: [control] [shift] p

- restart domoticz
- rename the location of the original installation and install the new version to an empty target directory. Next copy database and scripts from the old location and fire it up.
