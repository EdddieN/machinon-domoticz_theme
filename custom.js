/* Custom.js for machinon theme */

var theme = {};
var themeName = "";
var baseURL= "";
var switchState = {};

/* Prepare for future translating status
change to your language to make the switch instead of text to work correct e.g " on: 'Auf' ", " off: 'Aus' " etc */
switchState = {
	on: 'On', // on: 'På',
	off: 'Off', // off: 'Av',
	open: 'Open', // open: 'Öppen',
	closed:'Closed' // closed: 'Stängd'
};

// load files
$.ajax({url: 'acttheme/js/themesettings.js', async: false, dataType: 'script'});
$.ajax({url: 'acttheme/js/functions.js', async: false, dataType: 'script'});

document.addEventListener('DOMContentLoaded', function () {

});

// function adds the theme tab
showThemeSettings();
// load theme settings
loadSettings();
enableThemeFeatures();

(function() {

	$( document ).ready(function() {	
			
		// Navbar menu and logo header
		let navBar =  $('.navbar').append('<button class="menu-toggle"></button>');
		let navBarInner = $(".navbar-inner");
		let navBarToggle = $('.menu-toggle');
		navBarToggle.click(function(){
			navBarInner.slideToggle(400);
		});

		let containerLogo = `
			<header class="logo">
				<div class="container-logo">
					<img class="header__icon" src="images/logo.png">
				</div>
			</header>')
		`;
		$(containerLogo).insertBefore('.navbar-inner');
					
		// Features
		if (theme.features.footer_text_disabled.enabled === true) {
			$('#copyright p').remove();
		}
				
		// Replace settings dropdown button to normal button.
		/** This also disables the custom menu. Need find a workaround **/
		if (theme.features.custom_settings_menu.enabled === true) {
			$('#appnavbar li').remove('.dropdown');
			let mainMenu = $('#appnavbar');
			let mSettings = mainMenu.find('#mSettings');
			if (mainMenu.length && mSettings.length == 0) {
				mainMenu.append('<li id="mSettings" style="display: none;" has-permission="Admin"><a href="#Custom/Settings" class="active" data-i18n="Settings">Settings</a></li>');
			}
		} else {
			$('#cSetup').click(function() {
				showThemeSettings();
				loadSettings();
				enableThemeFeatures();
			});
		}

/* 		// insert config-forms menu item into main navigation
		let configForms = mainMenu.find('#config-forms');
		if (mainMenu.length && configForms.length == 0) {
			mainMenu.append('<li class="divider-vertical"></li><li id="config-forms"><a href="#" class="active">Machinon</a></li>');
		} */
			
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
	
	// main switchers and submenus logic function
	function applySwitchersAndSubmenus() {
		
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
				// insert submenu buttons to each item table (not on dashboard)
				let subnav = $(this).find('.options');
				let subnavButton = $(this).find('.options__bars');
				if (subnav.length && subnavButton.length == 0) {
					$(this).find('table').append('<div class="options__bars"></div>');
					$(this).on('click', '.options__bars', function (e) {
						e.preventDefault();
						$(this).siblings('tbody').find('td.options').slideToggle(400);
					});
				}
			}
			if (theme.features.switch_instead_of_bigtext.enabled === true) {
				if (onImage.hasClass('lcursor')) {
				let switcher = $(this).find('.switch');
				if (status == switchState.off || status == switchState.on) {
					let title = (status == switchState.off) ? switchState.on : switchState.off;
					let checked = (status == switchState.on) ? 'checked' : '';
					if (switcher.length == 0) {
						let string = '<label class="switch" title="Turn ' + title + '"><input type="checkbox"' + checked + '><span class="slider round"></span></label>';
						bigText.after(string);
					}
					switcher.attr('title', 'Turn ' + title);
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
		});
		// console.log('Switchers loaded');
	}		

	window.onresize = function () {
		//show-hide navbar on window resize
		var nav = $(".navbar-inner");
		if (nav === null) {
			return;
		}
		let width = window.innerWidth;
		if (width > 992) {
			nav.css("display", "block");
		} else {
			nav.css("display", "none");
		}
	};

})();
