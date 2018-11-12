
// Function to add theme tab
function showThemeSettings() { 
     
    if( !$('#tabsystem').length ){
        setTimeout(showThemeSettings, 100);
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

function loadSettingsHTML(){
	// Move active menus to theme tab
	$('#ActiveTabs').appendTo('#theme');
	$('#ActiveTabs').wrapAll('<div class="row-fluid" />');
	
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
				bootbox.alert('<h3>Congratulations on the theme upgrade!</h3><p>Please reset the theme by clicking here:</p><p><a onClick="resetTheme(); return false;" href=""><button class="btn btn-info">Reset theme</button></a></p><p>(or find the theme reset button on the theme settings page)<p>');
				if (isEmptyObject(theme) === false){
					localStorage.setObject("themeSettings", theme);
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
						if (isNaN(childName)){
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
		localStorage.setObject("themeSettings", theme);
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
		localStorage.setObject("themeSettings", theme);
		//console.log(themeName + ' - theme settings saved');
		notify(language.theme_settings_saved, 2);
		location.reload();
	});
	
	// Resetbutton theme tab
	$('#themeResetButton').click(function() {
		notify(language.theme_restored, 2);
		resetTheme();
	});
}

// Load theme settings
function loadSettings() {
 if (typeof (Storage) !== "undefined") {
	 if (localStorage.getItem("themeSettings") === null) { // If theme settings is missing in localstorage(browser) then load settings from local file e.g theme.json 
		$.ajax({url: 'acttheme/theme.json' , cache: false, async: false, dataType: 'json', success: function(localJson) {
			theme = localJson;
			themeName = theme.name;
			if (isEmptyObject(theme) === false) {
				localStorage.setObject("themeSettings", theme);
            }
			console.log(themeName + " - local theme settingsfile loaded and saved to localSto");
			}
		});
		} else { // If setting is saved in localstorge(browser), try to load those.
			theme = localStorage.getObject("themeSettings", theme);
			themeName = theme.name;
			console.log(themeName + " - theme settings was already found in the browser.");
		}
	}
}

// reset theme to defaults. Useful after an upgrade.
function resetTheme(){
    if (typeof(Storage) !== "undefined") {
		localStorage.removeItem('themeSettings');
		location.reload();    
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
