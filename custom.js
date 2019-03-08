/* Custom.js for machinon theme */

var theme = {}, themeName = "", baseURL = "", switchState = {}, isMobile, newVersionText = "", gitVersion, lang, user, themeFolder, checkUpdate;
generate_noty = void 0;
isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// load files
$.ajax({url:"json.htm?type=settings", cache: false, async: false, dataType:"json", success:function(b) {
  lang = b.Language;
  themeFolder = b.WebTheme;
  user = b.WebUserName;
  checkUpdate = b.UseAutoUpdate;
}});
$.ajax({url:"acttheme/js/notify.js", async: false, dataType:"script"});
$.ajax({url:"acttheme/js/themesettings.js", async: false, dataType:"script"});
$.ajax({url:"acttheme/js/functions.js", async: false, dataType:"script"});
$.ajax({url:"acttheme/js/time_ago.js", async: false, dataType:"script"});
0 <= "en fr de sv nl pl".split(" ").indexOf(lang) ? $.ajax({url:"acttheme/lang/machinon." + lang + ".js", async: false, dataType:"script"}) : $.ajax({url:"acttheme/lang/machinon.en.js", async: false, dataType:"script"});
checkauth();
//need more simplycity
if (!isMobile){ 
var targetedNode = document;
MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
var observer = new MutationObserver(function(mutations, observer) {
	mutations.forEach(function(mutation) {	
		if ($('#main-view').contents().hasClass('container') ) {
			$('#main-view').contents().removeClass('container').toggleClass('container-fluid');
			console.log('change container class to container-fluid');
			var changeclass = true
		};
		
		if ($('#main-view div.row').next().length != 0 ){
			DelRow();
		} else {
			//console.log{'1 row found'};
			var delrowok = true
		};
		$('#main-view div.row.divider .span4').toggleClass('span4 tile');
		if (delrowok && changeclass){
			console.log('deconnexion observer');
			//observer.disconnect();
			
		};
	});
});

window.onhashchange = locationHashChanged;
}
document.addEventListener('DOMContentLoaded', function () {

});

(function() {

	$( document ).ready(function() {
		if (!isMobile){ 
		observer.observe(targetedNode, {
			childList: true,
			subtree: true
		});
		}
		requirejs.config({ waitSeconds: 30 });
		// function adds the theme tab
		showThemeSettings();
		// load theme settings
		loadSettings();
		enableThemeFeatures();
		if (checkUpdate != 0)CheckDomoticzUpdate(true);
		getStatus(true);
			
		// Replace settings dropdown button to normal button.
		true === theme.features.custom_settings_menu.enabled ? $.ajax({url:"acttheme/js/settings_page.js", async: false, dataType:"script"}) : $("#cSetup").click(function() {
		  showThemeSettings();
		  loadSettings();
		  enableThemeFeatures();
		});
        
		// insert config-forms menu item into main navigation
		true === theme.features.custom_page_menu.enabled && $.ajax({url:"acttheme/js/custom_page.js", async: false, dataType:"script"});
		isMobile && adminRights && 992 >= window.innerWidth && $("#appnavbar").append('<li id="mLogout"><a id="cLogout" href="#Logout"><img src="images/logout.png"><span class="hidden-phone hidden-tablet" data-i18n="Logout">Logout</span></a></li>');
		
		// Navbar menu and logo header
		var navBar = $(".navbar").append('<button class="menu-toggle"></button>'), navBarInner = $(".navbar-inner"), navBarToggle = $(".menu-toggle");
		navBarToggle.click(function() {
		  navBarInner.toggle("slide", 500);
		});
		(isMobile && 992 >= window.innerWidth || !isMobile && 992 >= window.innerWidth) && $(".navbar-inner a").click(function() {
		  $(".navbar-inner").toggle("slide", 500);
		});
		$(window).scroll(function() {
		  50 < $(this).scrollTop() ? $("button.menu-toggle").css("background-color", "var(--main-blue-color)") : $("button.menu-toggle").css("background-color", "");
		});

		let containerLogo = '<header class="logo"><div class="container-logo">';
		if (theme.logo.length == 0) {
			containerLogo += '<img class="header__icon" src="images/logo.png">';
			$('<style>#login:before {content: url(../images/logo.png) !important;}</style>').appendTo('head');
		}else {
			containerLogo += '<img class="header__icon" src="images/' + theme.logo + '"';
			$('<style>#login:before {content: url(../images/'+ theme.logo + ') !important;}</style>').appendTo('head');
		}
		containerLogo += '</div></header>';
		$(containerLogo).insertBefore('.navbar-inner');
		
		// Searchbar		
		$('<input type="text" id="searchInput" onkeyup="searchFunction()" placeholder="' + language.type_to_search + '" title="' + language.type_to_search + '">').appendTo('.container-logo');
		
		// Notifications
		$('<div id="notify"></div>').appendTo('.container-logo');
		$('<img id="notyIcon" src="images/notify.png"/>').appendTo('#notify').hide();
		var existingNotes = localStorage.getItem('notify');
		existingNotes && $("#notyIcon").show()
		var state = false;
		$('#notify').click(function(){
			if(!state){
				if ($('#msg').length == 0) {
					var msg = localStorage.getItem('notify');
					msg = JSON.parse(msg);
					var myObj = msg;
					$('#notify').append('<div id="msg" class="msg"><ul></ul><center><a class="btn btn-info" onclick="clearNotify();">' + $.t('Clear') + '</a></center></div>');
					for (x in myObj) {
						$('#msg ul').append('<li>' + x + '<span> -- ' + jQuery.timeago(myObj[x]) + '</span></li>');
					}
				}
			} else {
			$('#msg').remove();
			}
			state = !state;		
		});
		
		// Features
		if (theme.features.footer_text_disabled.enabled === true) {
			$('#copyright').remove();
		}
		if (theme.features.dashboard_show_last_update.enabled === true) {
			$('<style>#dashcontent #lastupdate{display: block;}</style>').appendTo('head');
			$('<style>#dashcontent #timeago{display: block;}</style>').appendTo('head');
		}
			
		$(document).ajaxSuccess(function (event, xhr, settings) {
			if (settings.url.startsWith('json.htm?type=devices') ||
				settings.url.startsWith('json.htm?type=scenes')) {
				let counter = 0;
				let intervalId = setInterval(function () {
					// console.log("Check DOM");
					if ($('#main-view').find('.item').length > 0) {
						applySwitchersAndSubmenus();
						clearInterval(intervalId);
					} else {
						counter++;
						if (counter >= 5) {
							clearInterval(intervalId);
						}
					}
				}, 1000);
			} else if (settings.url.startsWith('json.htm?type=command&param=switchscene')) {
				let id = settings.url.split('&')[2];
				id = id.substr(4); // from string 'idx=?'
				let scene = $('.item#' + id);
				let statusElem = scene.find('#status .wrapper');
				statusElem.hide();
				let switcher = statusElem.parent().siblings('.switch').find('input');
				if (switcher.length) {
					let statusText = settings.url.split('&')[3];
					statusText = statusText.substr(10); // from string 'switchcmd=?'
					switcher.attr('checked', (statusText == 'On'));
				}
			}
		});

	});
	window.onresize = function() {
		var nav = $(".navbar-inner");
		null !== nav && (992 < window.innerWidth ? nav.css("display", "block") : nav.css("display", "none"));
	};
})();
