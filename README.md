# Machinon theme

# WORK IN PROGRESS

This is a theme for Domoticz in machinon project. Theme in progress with project machinon:
https://github.com/EdddieN/machinon

ToDo
- [X]   In Progress
- [ ] 1.- Selector boxes, need update design -> Eddie
- [ ] 2.- Hardware page and devices need updating -> guidelines in Zeplin
- [X] 3.- Tiles with new text and bigger size values -> Eddie -> Zeplin
- [X] 4.- Settings page re-design -> Eddie 
- [X] 5.- When a device is offline the tile should fade off, is this possible? -> Zeplin
- [X] 6.- Timers screen -> Eddie -> Zeplin
- [X] 7.- Charts screens -> Eddie -> Zeplin
- [X] 8.- Remove go back button from design on settings -> Eddie  
  
Ideas (wish list)
- [ ]   In Progress
- [ ] 1.- Custom merge multiple metrics into one tile (ie: energy + trigger switch)
- [X] 2.- Dark theme -> Work in progress


## Installing

On your Raspberry Pi, in Domoticz theme directory :

```
cd domoticz/www/styles
git clone https://github.com/EdddieN/machinon-domoticz_theme.git machinon
sudo /etc/init.d/domoticz.sh restart
```

### Copy settings.html in templates folder to

```
sudo cp ~/domoticz/www/styles/machinon/templates/Settings.html ~/domoticz/www/templates/
```  
You may need to disable Custom menu if a visible wider space between Utility and Setup [SETUP -> Settings -> Active Menu]


## Updating
```
cd domoticz/www/styles/machinon
git pull
```



### Finally preview:

![Idea of theme machinon](/idea_domoticz_machinon.jpg)

Suggested new setup layout - partly implemented
![Suggested new Setup layout - not implemented yet](/images/unorganised/screen_references/setup.png)

