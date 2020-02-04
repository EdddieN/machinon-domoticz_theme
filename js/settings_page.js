let mSettings = $("#appnavbar").find("li[has-permission='Admin']");
if (mSettings && mSettings.length > 0) {
    mSettings.removeClass("dropdown"); 
    mSettings.children("a").removeClass("dropdown-toggle");
    mSettings.find("a > b").remove();
    mSettings.children("ul").remove();

    mSettings.click(function() {
        $("#machinoSettings").remove();
        $("#appnavbar li").removeClass("current_page_item");
        $("#mSettings").addClass("current_page_item");
        $("#search").addClass("readonly");
        $(".navbar-inner").removeClass("slide");
        $("body").css("overflow", "auto");
        if ($("#holder #main-view #machinoSettings").length === 0) {
            $("#holder #main-view").empty();
            $("#holder #main-view").append('<div id="machinoSettings">');
            $("#machinoSettings").append("</br>").append('<h2 class="mHeader" data-i18n="Settings">Settings</h2>').append('<ul class="mHeaderBtn">').append('<ul class="machinon_ul">');
            $("#machinoSettings ul.mHeaderBtn").append('<li onclick="javascript:SwitchLayout(\'Restart\')"><i class="ion-ios-refresh"></i><div data-i18n="Restart System">Restart System</div></li><li onclick="javascript:SwitchLayout(\'Shutdown\')"><i class="ion-ios-power"></i><div data-i18n="Shutdown System">Shutdown System</div></li><li onclick="location.href=\'#Logout\'"><i class="ion-ios-log-out"></i><div data-i18n="Logout">Logout</div></li>');
            $("#machinoSettings ul.machinon_ul").append('<li class="rectangle-8" onclick="location.href=\'#Hardware\'"><img src="acttheme/images/settings/hardware.png"><div class="machinoText" data-i18n="Hardware">Hardware</div></li><li class="rectangle-8" onclick="location.href=\'#Devices\'"><img src="acttheme/images/settings/devices.png"><div class="machinoText" data-i18n="Devices">Devices</div></li><li class="rectangle-8" onclick="location.href=\'#Setup\';showThemeSettings();"><img src="acttheme/images/settings/setup.png"><div class="machinoText" data-i18n="Settings">Settings</div></li><li class="rectangle-8" onclick="javascript:CheckForUpdate(true)"><img src="acttheme/images/settings/update.png"><div class="machinoText" data-i18n="Check for Update">Check for Update</div></li><li class="rectangle-8" onclick="location.href=\'#Cam\'"><img src="acttheme/images/settings/cam.png"><div class="machinoText" data-i18n="Cameras">Cameras</div></li><li class="rectangle-8" onclick="location.href=\'#Users\'"><img src="acttheme/images/settings/users.png"><div class="machinoText" data-i18n="Edit Users">Edit Users</div></li><li class="rectangle-8" onclick="location.href=\'#Events\'"><img src="acttheme/images/settings/events.png"><div class="machinoText" data-i18n="Events">Events</div></li><li class="rectangle-8" onclick="location.href=\'#CustomIcons\'"><img src="acttheme/images/settings/icons.png"><div class="machinoText" data-i18n="Custom Icons">Custom Icons</div></li><li class="rectangle-8" onclick="location.href=\'#Mobile\'"><img src="acttheme/images/settings/mobile.png"><div class="machinoText" data-i18n="Mobile Devices">Mobile Devices</div></li><li class="rectangle-8-dropdown"><img src="acttheme/images/settings/plan.png"><div class="machinoText" data-i18n="Roomplan">Roomplan</div><li class="rectangle-8" onclick="location.href=\'#UserVariables\'"><img src="acttheme/images/settings/uservariables.png"><div class="machinoText" data-i18n="User variables">Uservariables</div></li><li class="rectangle-8" onclick="location.href=\'secpanel/index.html#{{config.language}}\'"><img src="acttheme/images/settings/lock.png"><div class="machinoText" data-i18n="SecurityPanel">Security Panel</div></li><li class="rectangle-8" onclick="location.href=\'#Notification\'"><img src="acttheme/images/settings/notification.png"><div class="machinoText" data-i18n="Send Notification">Send Notification</div></li><li class="rectangle-8-dropdown"><img src="acttheme/images/settings/datapush.png"><div class="machinoText" data-i18n="Data push">Data push</div><li class="rectangle-8" onclick="location.href=\'#Log\'"><img src="acttheme/images/settings/log.png"><div class="machinoText" data-i18n="Log">Log</div></li><li class="rectangle-8" onclick="location.href=\'#About\'"><img src="acttheme/images/settings/about.png"><div class="machinoText" data-i18n="About">About</div></li>');
            $("#machinoSettings li.rectangle-8-dropdown").append('<div class="dropdown-content">');
            $("#machinoSettings li.rectangle-8-dropdown").has('div.machinoText[data-i18n="Roomplan"]').children("div.dropdown-content").append('<p><a href="#Roomplan"><div class="mDropdown-Text"><span data-i18n="Roomplan">Roomplan</span></div></a></p><p><a href="#Floorplanedit"><div class="mDropdown-Text"><span data-i18n="Floorplan">Floorplan</span></div></a></p><p><a href="#Timerplan"><div class="mDropdown-Text"><span data-i18n="Timerplan">Timerplan</span></div></a></p>');
            $("#machinoSettings li.rectangle-8-dropdown").has('div.machinoText[data-i18n="Data push"]').children("div.dropdown-content").append('<p><a href="#DPFibaro"><div class="mDropdown-Text">FibaroLink</div></a></p><p><a href="#DPHttp"><div class="mDropdown-Text">HTTP</div></a></p><p><a href="#DPGooglePubSub"><div class="mDropdown-Text">Google PubSub</div></a></p><p><a href="#DPInflux"><div class="mDropdown-Text">InfluxDB</div></a></p>');
            $("#machinoSettings").i18n();
            if (!isAdmin()) $("#machinoSettings").remove();
        }
    });
}
