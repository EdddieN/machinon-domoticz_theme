
// Function to add theme tab
function showThemeSettings() { 
     
    if( !$('#tabsystem').length ){
        setTimeout(showThemeSettings, 1000);
        return;
    }
    
    // Merge email tab into notification
    $('#emailsetup').prepend('<br/>');
    $('#emailsetup').appendTo('#notifications');
    $("#tabs li a[data-target='#tabemail']").parent().remove();
	
    // Adding the settings tab.
	if (!$('#tabtheme').length){
		
		// Modifying settings menu
		$('<li id="themeTabButton"><a data-target="#tabtheme" data-toggle="tab" data-i18n="Theme">Theme</a></li>').appendTo('#tabs')
		// If were on a mobile phone, make the theme tab link work.   
	    	$('#tabs li:not(.pull-right)').click(function() {
			if ($(window).width() < 480) {
			    $(this).siblings().show(); //safety, if user scaled/rotated the screen.
			}
	    	});
		$('#acceptnewhardwaretable > tbody > tr:nth-child(1) > td > button').click(function() {
			notify(language.allow_new_hardware, 2);
		});
		$('#tabs > li.pull-right > a').click(function() {			
			notify(language.domoticz_settings_saved, 2);
		});
		// Translate
		$("#tabs").i18n();

		// Inserting the themesettings.html
		$('#my-tab-content').append('<div class="tab-pane" id="tabtheme"><section id="theme">Loading..</section></div>');
		$('#my-tab-content #theme').load("acttheme/themesettings.html",loadSettingsHTML);
	}
}
function addHtmlTab(){
    var html = '';
    html += '<div class="span6">';
    html +='<div id="aboutTheme">';
    html += '<h2 id="title">Machinon theme V.' + theme.version + '</h2>';
    html += '<p>Theme is in progress with project machinon. Minimalistic design for better view for the user.<br/>';
    html += 'Follow us on <a href="https://github.com/EdddieN/machinon">github</a>. If you have any issues with the theme, report them <a href="https://github.com/EdddieN/machinon-domoticz_theme/issues">here</a>.</p>';
    html += '<h3>General features</h3>';
    html += '<p>The Machinon theme has several features that change the look. Machinon saves the settings as two uservariables. Some of the cool features are:</p>';
    html += '<h4>Machinon settings menu:</h4>';
    html += '<p><i>A custom settings menu instead of the dropdown list. Better overview for the user.</i><br/></p>';
    html += '<h4>Switch Instead of Text:</h4>';
    html += '<p><i>Switch instead of Big text the upper right.</i></p>';
    html += '<h4>Show "Last Seen" as Time Ago:</h4>';
    html += '<p><i>Show last seen as time ago e.g "2 minutes ago", "about 4 hours ago".</i></p>';
    html += '<h4>Notifications:</h4>';
    html += '<p><i>To get visual notification when a device is changing status or value:</br>';
    html += '- Go to the device notifications</br>- In notifications settings select browser</i></p>';
    html += '<h4>Camera Preview on Dashboard:</h4>';
    html += '<p><i>Create a virtual switch, assign this switch to the camera and set this switch as favorite (<a href="https://www.domoticz.com/forum/viewtopic.php?t=7553" target="_blank">detailed steps</a>)</i></p>';
    html += '<h4>Custom Page (Iframe):</h4>';
    html += '<p><i>Custom Page with menu button. Add button name and custom page url. Add url e.g: <code>https://www.domoticz.com</code> or a local file e.g: <code>../templates/custompage.html</code></i></p>';
    html += '<h3>Update theme:</h3>';
    html += '<p>Run terminal, putty or similar<br/>';
    html += '<code>cd /home/${USER}/domoticz/www/styles/' + themeFolder + '</code><br/><code>git pull</code></P>';
    html += '<p>Designed in 2018 by EdddieN.</p>';
    html += '</div></div>';    
    $('#tabtheme .row-fluid').append(html);
}

function addIconshtml(){
    var code = JSON.stringify(theme.icons);
    code = code.replace('[','').replace(']','');
    var html = '';
    html += '<div class="row-fluid">'
    html += '<div class="span6">';
    html += '<div id="icons">';
    html += '<h2>Image instead of icons:</h2>';
    html += '<p>Change or add new <code>{"idx":"35","img":"IMG_0138.jpg"}</code> No comma at the end!</br>';
    html += 'Only works with light devices and lightbuld as icon.</br>Upload your images to images folder in machinon theme folder</p>';
    html += '<p><input id="themevar32" name="themevar32" value="icon_image" type="checkbox" class="parentrequired"><label for="themevar32" data-i18n="Images Instead of Icons"> Images Instead of Icons</label></br></br>';
    html += '<textarea rows="6" cols="50" id="textareaIcons" name="icons" class="parentrequiredchild textareaIcons ui-widget-content ui-corner-all">' + code + '</textarea></p>';
    html += '</br></br>'
    html += '<p><button type="button" class="savebtn" onclick="addImgInsteadofIcon()">'+ $.t('Add') +'</button></p>';
    html += '</div></div>';
    html += '<div class="span6">';
    html += '<h2>Logo:</h2>';
    html += '<p>Add your own logo. Leave empty for Machinon logo. Upload your logo to images folder in machinon theme folder (recommended size 200x30px).<br/>';
    html += '<label for="themevar17" data-i18n="logo"> Logo: </label><input id="themevar17" class="themevar17 ui-widget-content ui-corner-all" name="logo" value="logo.png" type="text"></p>';
    html += '</br>';
    html += '<h3>Save/Reset theme:</h3></br>';
    html += '<p><button class="resetbtn" id="themeResetButton" data-i18n="Reset theme">Reset Theme</button> <button class="savebtn" id="saveSettingsButton" data-i18n="Save Theme Settings">Save Theme Settings</button></p>';
    html += '</div></div>';
    $('#tabtheme').append(html);
}
function addImgInsteadofIcon() {
  	$('#tabtheme #textareaIcons').each(function(){    
			var value = $(this).val();
            value = '[' + value + ']';
			theme[this.name] = JSON.parse(value);
            console.log(theme[this.name]);
    });
    localStorage.setObject(themeFolder + ".themeSettings", theme);
}
function loadSettingsHTML(){
	addHtmlTab();
    addIconshtml();
	// Update check
	$("#tabtheme .span6 input:checkbox").each(function() {
		if(typeof theme.features[this.value] !== "undefined"){
			if (theme.features[this.value].enabled === true) {
				$(this).prop("checked", true);
			}else if (theme.features[this.value].enabled === false) {
				$(this).prop( "checked", false );
			}
		}else{
			if ( typeof theme.upgradeAlerted === "undefined"){
				bootbox.alert({
                    message: '<p>Please reset the theme by clicking here:</p><p><a onClick="resetTheme(); return false;" href=""><button class="btn btn-info">Reset theme</button></a></p><p>(or find the theme reset button on the theme settings page)<p>',
                    title: 'Congratulations on the theme upgrade!',
                });
                
				if (isEmptyObject(theme) === false){
					localStorage.setObject(themeFolder + ".themeSettings", theme);
                }			
			}
		}
		if( $(this).not(':checked') && $(this).is('.parentrequired')){
			$(this).siblings().each(function() {
				if( $(this).is('.parentrequiredchild') ){
				$(this).prop('disabled', true);
				}
			});			
		}
		if( $(this).is(':checked') && $(this).is('.parentrequired')) {
				$(this).siblings().each(function() {
					if( $(this).is('.parentrequiredchild') ){
					$(this).prop('disabled', false);
				}
			});	
			
		}
	});
	
	$('#tabtheme input[type="number"]').each(function(){    
        	var value = theme[this.name];
        	$(this).val(value);
	});
	$('#tabtheme input[type="text"]').each(function(){    
        	var value = theme[this.name];
        	$(this).val(value);
	});
	
	// The theme immediately saves the changes.
	$("#tabtheme input:checkbox").click(function() {
		if ($(this).is(':checked')) {
			theme.features[this.value].enabled = true;
			loadThemeFeatureFiles(this.value);
		} else {
			// if a parent checkbox is unchecked, let's also take care of the child checkbox. Otherwise features can still be turned on, but this might not be visible or obvious to the user.
			if( $(this).is('.parentrequired') ){
				$(this).siblings().each(function() {
					if( $(this).is('.parentrequiredchild') ){
						$(this).attr('checked', false);
						var childName = $(this).val();
                        if (typeof theme.features[childName] !== "undefined") {
							unloadThemeFeatureFiles( childName );
							theme.features[childName].enabled = false;
						}
					}
				});
			}
			theme.features[this.value].enabled = false;
			unloadThemeFeatureFiles(this.value);
		}
		if( $(this).not(':checked') && $(this).is('.parentrequired')){
			$(this).siblings().each(function() {
				if( $(this).is('.parentrequiredchild') ){
				$(this).prop('disabled', true);
				}
			});			
		}
		if( $(this).is(':checked') && $(this).is('.parentrequired')) {
				$(this).siblings().each(function() {
					if( $(this).is('.parentrequiredchild') ){
					$(this).prop('disabled', false);
				}
			});			
		}
		// Saves the new settings.
		localStorage.setObject(themeFolder + ".themeSettings", theme);
		console.log(theme.name + ' - theme settings saved');
	});
	$('#saveSettingsButton').click(function() {
		$('#tabtheme input[type="number"]').each(function(){    
			var value = $(this).val();
			theme[this.name] = value; 
		});
		$('#tabtheme input[type="text"]').each(function(){    
			var value = $(this).val();
			theme[this.name] = value; 
		});
		localStorage.setObject(themeFolder + ".themeSettings", theme);
        storeUserVariableThemeSettings('update'); 
		notify(language.theme_settings_saved, 2);
		location.reload();
	});
	
	// Resetbutton theme tab
	$('#themeResetButton').click(function() {
        bootbox.confirm({
            message: '<p>Do you want to reset the theme to default settings?</p>',
            title: '<font color="red">Warning!</font>',
            size: "small",
            buttons: {
                confirm: {
                    label: $.t('Yes'),
                    className: 'btn-info'
                },
                cancel: {
                    label: $.t('No'),
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                if (result == true){
                    notify(language.theme_restored, 2);
                    resetTheme();
                }
            }
        });

	});
}

// Load theme settings
function loadSettings() {

 if (typeof (Storage) !== "undefined") {
	 if (localStorage.getItem(themeFolder + ".themeSettings") === null) { // If theme settings is missing in localstorage(browser) then load settings from local file e.g theme.json 
		$.ajax({url: 'acttheme/theme.json' , cache: false, async: false, dataType: 'json', success: function(localJson) {
			theme = localJson;
			themeName = theme.name;
			if (isEmptyObject(theme) === false) {
				localStorage.setObject(themeFolder + ".themeSettings", theme);
                setTimeout(function(){
                    location.reload();
                }, 3000);
             }
			console.log(themeName + " - local theme settingsfile loaded and saved to localStorage");
			}
		});
		} else { // If setting is saved in localstorge(browser), try to load those.
			theme = localStorage.getObject(themeFolder + ".themeSettings", theme);
			themeName = theme.name;
			console.log(themeName + " - theme settings was already found in the browser.");
		}
	}
}

function checkUserVariableThemeSettings() {
    $.ajax({
        url: "/json.htm?type=command&param=getuservariables",
        async: true,
        dataType: 'json',
        success: function (data) {
            if (data.status == "ERR") {
                $.get('/json.htm?type=command&param=addlogmessage&message=Theme Error - The theme was unable to load your preferences from Domoticz.');
            }
            // If we got good data from Domoticz, load the preferences.
            if (data.status == "OK"){
                var didDomoticzHaveSettings = false;
                var featuresVarName = "theme-" + themeFolder + "-features";
                var customVarName = "theme-" + themeFolder + "-custom";
                $.each(data.result, function(variable, value) {
                    if(value.Name == featuresVarName){
                        console.log(themeName + " - found theme feature settings in Domoticz database (user variable Idx: " + value.idx + ")");
                        didDomoticzHaveSettings = true;
                        theme.userfeaturesvariable = value.idx;
                        getFeatureThemeSettings(value.idx);
                    }
                    if(value.Name == customVarName){
                        console.log(themeName + " - found theme feature settings in Domoticz database (user variable Idx: " + value.idx + ")");
                        didDomoticzHaveSettings = true;
                        theme.usercustomsvariable = value.idx;
                        getCustomThemeSettings(value.idx);
                    }
                });
                                
                if(didDomoticzHaveSettings === false){
                    storeUserVariableThemeSettings("add");
                }                
            }           
        },
        error: function () {
            console.log("The theme was unable to check if Domoticz had theme settings. Permission denied? Still on login page? No connection? Stopping..");
        }
        
    });
    
}
function storeUserVariableThemeSettings(action){ // 'add' or 'update'

    if (themeFolder !== 'undefined'){    
        var settings = [];
        $.each(theme.features, function(key,feature){
            if(feature.enabled === true){
                settings.push(feature.id);
            }
        });
    
        var variableURL = 'json.htm?type=command&param=' + action + 'uservariable&vname=theme-' + themeFolder + '-features&vtype=2&vvalue='+ JSON.stringify(settings);
        $.ajax({
            url: variableURL,
            async: true,
            dataType: 'json',
            success: function (data) {
                if (data.status == "ERR") {
                    bootbox.alert("Unable to create or update theme settings uservariable, Try to reset the theme");
                }
                // If we got good data from Domoticz.
                if (data.status == "OK") {
                    console.log(themeName + " - theme settings uservariable is updated");
                }
            },
            error: function () {
                console.log(themeName + " - Ajax error wile creating or updating user variable in Domotcz.");
            }
        });
        var custom = [];
        if(custom !== 'undefined'){
            custom.push(theme.standby_after);
            custom.push(theme.button_name);
            custom.push(theme.custom_url);
            custom.push(theme.logo);
            custom.push(theme.icons);
        }
        
        var variableURL = 'json.htm?type=command&param=' + action + 'uservariable&vname=theme-' + themeFolder + '-custom&vtype=2&vvalue='+ JSON.stringify(custom);
        $.ajax({
            url: variableURL,
            async: true,
            dataType: 'json',
            success: function (data) {
                if (data.status == "ERR") {
                    bootbox.alert("Unable to create or update theme settings uservariable, Try to reset the theme");
                }
                // If we got good data from Domoticz.
                if (data.status == "OK") {
                    console.log(themeName + " - theme settings uservariable is updated");
                }
            },
            error: function () {
                console.log(themeName + " - Ajax error wile creating or updating user variable in Domotcz.");
            }
        });
    }else{
        return;
    }
}
// here we get the feature settings that are stored in domoticz as a user variable.
function getFeatureThemeSettings(idx){
    
    $.ajax({
        url: "json.htm?type=command&param=getuservariable" +
        "&idx=" + idx,
        async: true,
        dataType: 'json',
        success: function (data) {
            if (data.status == "ERR") {
                console.log(themeName + " - Although they seem to exist, there was an error loading theme preferences from Domoticz");
                $.get('/json.htm?type=command&param=addlogmessage&message=Theme Error - The theme was unable to load your user variable.');
                userVariableThemeLoaded = false;
            }
            if (data.status == "OK") {
                var themeSettingsFromDomoticz = JSON.parse(data.result[0].Value);
                // Update the theme object with the settings from Domoticz.
                $.each(theme.features, function(key,feature){
                    if($.inArray(feature.id, themeSettingsFromDomoticz) > -1){
                        theme.features[key].enabled = true;
                    }else{
                        theme.features[key].enabled = false;
                    }
                });
                localStorage.setObject(themeFolder + ".themeSettings", theme); // save loaded preferences in local object.
                userVariableThemeLoaded = true;
            }            
        },
        error: function () {
            console.log(themeName + " - ERROR reading feature settings from Domoticz for theme" + theme.name + "from user variable #" + idx);
            userVariableThemeLoaded = false;
        }
    });
}
function getCustomThemeSettings(idx){
    
    $.ajax({
        url: "json.htm?type=command&param=getuservariable" +
        "&idx=" + idx,
        async: true,
        dataType: 'json',
        success: function (data) {
            if (data.status == "ERR") {
                console.log(themeName + " - Although they seem to exist, there was an error loading theme preferences from Domoticz");
                $.get('/json.htm?type=command&param=addlogmessage&message=Theme Error - The theme was unable to load your user variable.');
                userVariableThemeLoaded = false;
            }
            if (data.status == "OK") {
                var customThemeSettings = JSON.parse(data.result[0].Value);
                // Update the theme object with the settings from Domoticz.
                theme.standby_after = customThemeSettings[0];
                theme.button_name = customThemeSettings[1];
                theme.custom_url = customThemeSettings[2];
                theme.logo = customThemeSettings[3];
                theme.icons = customThemeSettings[4];
                
                localStorage.setObject(themeFolder + ".themeSettings", theme); // save loaded preferences in local object.
                userVariableThemeLoaded = true;
            }            
        },
        error: function () {
            console.log(themeName + " - ERROR reading feature settings from Domoticz for theme" + theme.name + "from user variable #" + idx);
            userVariableThemeLoaded = false;
        }
    });
}

// reset theme to defaults. Useful after an upgrade.
function resetTheme(){
    if (typeof(Storage) !== "undefined") {
        if(typeof theme.userfeaturesvariable !== 'undefined'){
            var deleteFeaturesURL = '/json.htm?type=command&param=deleteuservariable&idx=' + theme.userfeaturesvariable;
            $.ajax({
                url: deleteFeaturesURL,
                async: true,
                dataType: 'json',
                success: function (data) {
                    if (data.status == "ERR") {
                        console.log(themeName + " - server responded with error while deleting user variable that stored feature settings");
                        bootbox.alert($.t('Domoticz gave an error when trying to remove the theme feature settings data'));
                    }
                    if (data.status == "OK") {
                        localStorage.removeItem(themeFolder + ".themeSettings");
                        $.get('/json.htm?type=command&param=addlogmessage&message=' + themeFolder + ' theme was reset to defaults');
                    }
                },
                error: function () {
                    console.log(themeName + " - The theme was unable to delete the user variable in Domoticz that holds the theme feature settings");
                    bootbox.alert($.t('Error communicating with Domoticz, theme feature settings not reset.'));
                }
            });
            var deleteCustomURL = '/json.htm?type=command&param=deleteuservariable&idx=' + theme.usercustomsvariable;
            $.get(deleteCustomURL);
            setTimeout(function(){
                location.reload();
            }, 1000);
        }
        else{
            localStorage.removeItem(themeFolder + ".themeSettings");
            location.reload();
        }        
    }
}

// Helper functions
Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}

function isEmptyObject(obj) {
  for(var prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      return false;
    }
  }
  return true;
}
