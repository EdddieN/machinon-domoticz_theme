/* functions.js */

// main switchers and submenus logic function
function applySwitchersAndSubmenus() {
	
	//translate switchstates
	switchState = {
	on: $.t('On'),
	off: $.t('Off'),
	open: $.t('Open'),
	closed: $.t('Closed')
	};
	
	//switcher for lights and windows
	$('#main-view .item').each(function () {
		let bigText = $(this).find('#bigtext');
		let status = bigText.text();
		// get clickable image element
		let onImage = bigText.siblings('#img').find('img');
		if (onImage.length == 0) {
			onImage = bigText.siblings('#img1').find('img')
		}
		if (status.length == 0) {
			status = bigText.attr('data-status');
		} else {
			$(this).off('click', '.switch');
			// special part for scenes tab
			let isScenesTab = $(this).parents('#scenecontent').length > 0;
			if (isScenesTab) {
				$(this).on('click', '.switch', function (e) {
					e.preventDefault();
					let offImage = $(this).siblings('#img2').find('img');
					let subStatus = bigText.siblings('#status').find('span').text();
					if ($.trim(subStatus).length) {
						status = subStatus;
					}
					if ((status == switchState.on) && offImage.length) {
						offImage.click();
					} else {
						if (onImage.hasClass('lcursor')) {
							onImage.click();
						}
					}
				});
			} else {
				$(this).one('click', '.switch', function (e) {
					e.preventDefault();
					let offImage = $(this).siblings('#img3').find('img');
					if (offImage.length == 0) {
						offImage = $(this).siblings('#img2').find('img');
					}
					if ((status == switchState.open || status == switchState.on) && offImage.length) {
						offImage.click();
					} else {
						if(onImage.hasClass('lcursor')) {
							onImage.click();
						}
					}
					
				});
			}
		}
		if (theme.features.time_ago.enabled === true ) {
			let lastupdated = $(this).find('#timeago');
			let xyz = $(this).find('#lastupdate');
			if (lastupdated.length == 0) {
				$(this).find('table tbody tr').append('<td id="timeago" class="timeago"></td>');
				$(this).find('#lastupdate').hide();
				}
			$(this).find("#timeago").timeago("update", xyz.text());
		}
		// insert submenu buttons to each item table (not on dashboard)
		let subnav = $(this).find('.options');
		let subnavButton = $(this).find('.options__bars');
		if (subnav.length && subnavButton.length == 0) {
			$(this).find('table').append('<div class="options__bars" title="' + $.t('More options') + '"></div>');
			$(this).on('click', '.options__bars', function (e) {
			e.preventDefault();
			$(this).siblings('tbody').find('td.options').slideToggle(400);
			});
			// Move Timers and log to item
			$(this).find('table').append('<div class="timers_log"></div>');
			$(this).find('.timers_log').append($(this).find('.options .btnsmall[data-i18n="Log"]'));
			$(this).find('.timers_log .btnsmall[data-i18n="Log"]').append("<img id='logImg' title='" + $.t('Log') + "' src='images/options/log.png'/>");
			$(this).find('.timers_log').append($(this).find('.options .btnsmall[data-i18n="Timers"]'));
			$(this).find('.timers_log .btnsmall[data-i18n="Timers"]').append("<img id='timerOffImg' title='" + $.t('Timers') + "' src='images/options/timer_off.png' height='18' width='18'/>");
			$(this).find('.timers_log').append($(this).find('.options .btnsmall-sel[data-i18n="Timers"]'));
			$(this).find('.timers_log .btnsmall-sel[data-i18n="Timers"]').append("<img id='timerOnImg' title='" + $.t('Timers') + "' src='images/options/timer_on.png' height='18' width='18'/>");
			$(this).find('.timers_log').append($(this).find('.options .btnsmall[href*="Log"]'));
			$(this).find('.timers_log .btnsmall[href*="Log"]:not(.btnsmall[data-i18n="Log"])').append("<img id='logImg' title='" + $.t('Log') + "' src='images/options/log.png'/>");
		}
		if ($('#dashcontent').length == 0) {
			let item = $(this).closest('.item');
			var itemID = item.attr('id');
			if (typeof(itemID) === 'undefined') {
				itemID = item[0].offsetParent.id;
			}
			let type = $(this).find('#idno');
			if (type.length == 0) {
				$(this).find('.options').append('<a class="btnsmall" id="idno"><i>Idx: ' + itemID + '</i></a>');
				// Notification New
				$(this).find('.options').prepend('<img id="bell" src="images/bell_off.png" title="'+$.t('Notifications') + '" onclick="notityOnOff(' + itemID + ');" class="lcursor">');
				var stateBell = $.grep(devicesToNotify, function (obj) {
						return obj === itemID;
					})[0];
				if (stateBell) {
					$(this).find('.options #bell').attr('src', 'images/bell_on.png')
				}
				$(this).find('.options #bell').on({
					'click': function () {
						var src = ($(this).attr('src') === 'images/bell_off.png')
						 ? 'images/bell_on.png'
						 : 'images/bell_off.png';
						$(this).attr('src', src);
					}
				});
				// End Notification New
			}
		}
		// options to not have switch instaed of bigText on scene devices
		let switchOnScenes = false;
		let switchOnScenesDash = false;
		if (theme.features.switch_instead_of_bigtext_scenes.enabled === false){
			switchOnScenes = $(this).parents('#scenecontent').length > 0
			switchOnScenesDash = $(this).find('#itemtablesmalldoubleicon').length > 0
		}
		if (theme.features.switch_instead_of_bigtext.enabled === true ) {
			if (!switchOnScenes){
				if(!switchOnScenesDash){
					if (onImage.hasClass('lcursor')) {
					let switcher = $(this).find('.switch');
					if (status == switchState.off || status == switchState.on) {
						let title = (status == switchState.off) ? switchState.on : switchState.off;
						let checked = (status == switchState.on) ? 'checked' : '';
						if (switcher.length == 0) {
							let string = '<label class="switch" title="' + title + '"><input type="checkbox"' + checked + '><span class="slider round"></span></label>';
							bigText.after(string);
						}
						switcher.attr('title', title);
						switcher.find('input').attr('checked', checked.length > 0);
						bigText.css('display', 'none');
					} else if (status == switchState.open || status == switchState.closed) {
						let title = (status == switchState.closed) ? switchState.open : switchState.closed;
						let checked = (status == switchState.open) ? 'checked' : '';
						if (switcher.length == 0) {
							let string = '<label class="switch" title="' + title + '"><input type="checkbox"' + checked + '><span class="slider round"></span></label>';
							bigText.after(string);
						}
						switcher.attr('title', title);
						switcher.find('input').attr('checked', checked.length > 0);
						bigText.css('display', 'none');
					} else {
						bigText.css('display', 'block');
						switcher.remove();
					}
					bigText.attr('data-status', status);
					} else {
					bigText.css('display', 'block');
					}
				}
			}
		}
	});
	// console.log('Switchers loaded');
}

function enableThemeFeatures()
{
    // load all JS and CSS files
    $.each(theme.features, function(key,feature){
        if(feature.enabled === true){
            if(feature.files.length > 0){
                loadThemeFeatureFiles(key);
            }
        }
    });
      
    console.log(themeName + " - feature files is loaded.");
    loadedThemeCSSandJS = true;
}

function loadThemeFeatureFiles(featureName) {
   
    // get file list from theme settings object
    var files = theme.features[featureName].files;
    var arrayLength = files.length;
    for (var i = 0; i < arrayLength; i++) {
        if(files[i].split('.').pop() == "js"){
            console.log(themeName + " - Loading javascript for " + featureName + " feature");
            var getviarequire = "../acttheme/js/" + featureName;
            requirejs([getviarequire], function(util) {
                console.log(themeName + " - Javascript loaded by RequireJS");
            });
        }
        if(files[i].split('.').pop() == "css"){
            var CSSfile = "" + baseURL + "/acttheme/css/" + files[i] + "?" + themeName;
            var fileref = document.createElement("link");
            fileref.setAttribute("rel", "stylesheet");
            fileref.setAttribute("type", "text/css");
            fileref.setAttribute("href", CSSfile);
            document.getElementsByTagName("head")[0].appendChild(fileref);
        }
    }
}

function unloadThemeFeatureFiles(featureName)
{
    $('head link[href*=' + featureName + ']').remove();
    $('head script[src*=' + featureName + ']').remove();
}

function checkSettingsHTML(){
	$.ajax({type: "GET", url: "templates/Settings.html", data: { },success: function(){
		console.log(theme.name + " - Found 'Settings.html' in '../www/templates' directory");
		},error: function(){
		console.log("Can't find Settings.html in templates directory. Please copy Setting.html to ../www/templates folder");
		bootbox.alert("<h3>Error!</h3><br/><p>Can't find Settings.html in templates directory.</p><br/><p>If you recently installed this theme. Just copy and paste 'Settings.html' from '../styles/machinon/templates' to '../www/templates' ");
		}
	});
}

function searchFunction() {
	if ($('#dashcontent') || $('lightcontent') || $('scenecontent')|| $('utilitycontent') || $('weatherwidgets') || $('tempwidgets')){
		var value = $('#searchInput').val().toLowerCase();
		$("div .item").filter(function() {
		  $(this).toggle($(this).find('#name').html().toLowerCase().indexOf(value) > -1)
		});
    };
};

function DelRow() {
	$('#main-view div.row').each(function(){
		x=$(this).nextAll().children().detach();
		$(this).append(x).nextAll().remove();
		console.log('suppression de multiple row');
	});
}

function locationHashChanged() {
    if ( location.hash === "#/LightSwitches" || "#/DashBoard" ) {
		var changeclass = false;
		observer.disconnect();
		observer.observe(targetedNode, {
			childList: true,
			subtree: true
		});
		
    } else {
			console.log('Page change for: ' + location.hash);
		
    }
}

function showTime(){
    var date = new Date();
    var h = date.getHours(); // 0 - 23
    var m = date.getMinutes(); // 0 - 59
    var s = date.getSeconds(); // 0 - 59
	var day = date.getDate();
	var mo = date.getMonth();
	var y = date.getFullYear();
	
	mo = mo + 1;
	mo = (mo < 10) ? "0" + mo : mo;
    day = (day < 10) ? "0" + day : day;
	
	textDate = y +"-"+ mo +"-" + day

    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;
    
    var time = h + ":" + m + ":" + s;
    document.getElementById("MyClockDisplay").innerText = time;
    document.getElementById("MyClockDisplay").textContent = time;
	document.getElementById("MyDateDisplay").innerText = textDate;
    
    setTimeout(showTime, 1000);
    
}
// Notifications
function notify(key) {
	var existing = localStorage.getItem('notify');
	existing = existing ? JSON.parse(existing) : {};
	let d = new Date();
	dd = d.getTime();
	existing[key] = dd;
	localStorage.setItem('notify', JSON.stringify(existing));
	
	$('#notyIcon').show();
}
function clearNotify(){
    if (typeof(Storage) !== "undefined") {
		localStorage.removeItem('notify');
		$('#notyIcon').hide();
    }
}
function CheckDomoticzUpdate(showdialog) {
	$.ajax({
		 url: "json.htm?type=command&param=checkforupdate&forced=" + showdialog,
		 async: false,
		 dataType: 'json',
		 success: function(data) {
			if (data.HaveUpdate == true) {
				msgtxt = 'Domoticz version #' + data.Revision + ' '+ language.is_available +'!';
				msgtxt+=' <a onclick="CheckForUpdate(true);">' + language.update_now + '</a>';
				notify(msgtxt);
			}
		 }
	});
	return false;
}
var secStatusMsg='DISARMED';
function notifySecurityStatus(){
	$.ajax({url: '/json.htm?type=command&param=getsecstatus' , cache: false, async: false, dataType: 'json', success: function(data) {
		if (data.status != "OK") {
			ShowError('NoOkData');
			return;
		}else {		
			if (data.secstatus==0 && secStatusMsg !='DISARMED') {
				secStatusMsg='DISARMED';
				notify('Security is ' + secStatusMsg);
				}
			else if (data.secstatus==1 && secStatusMsg !='ARMED HOME') {
				secStatusMsg='ARMED HOME';
				notify('Security is ' + secStatusMsg);
				}
			else if (data.secstatus==2 && secStatusMsg !='ARMED AWAY') {
				secStatusMsg='ARMED AWAY';
				notify('Security is ' + secStatusMsg);
				}		
			}
		}
	});
}
