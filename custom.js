document.addEventListener('DOMContentLoaded', function () {

});

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
		
		/* replace settings dropdown button to normal button.
		This also disables the custom menu. Need find a workaround */		
		$('#appnavbar li').remove('.dropdown');
		let mainMenu = $('#appnavbar');
		let configForms = mainMenu.find('#mSettings');
		if (mainMenu.length && configForms.length == 0) {
			mainMenu.append('<li id="mSettings" style="display: none;" has-permission="Admin"><a href="#Custom/Settings" class="active" data-i18n="Settings">Settings</a></li>');
		}
		/*
		// insert forms menu item into main navigation
		let mainMenu = $('#appnavbar');
		let configForms = mainMenu.find('#config-forms');
		if (mainMenu.length && configForms.length == 0) {
			mainMenu.append('<li class="divider-vertical"></li><li id="config-forms"><a href="#" class="active">Machinon</a></li>');
		}
		*/
		$(document).ajaxSuccess(function (event, xhr, settings) {
			// console.log(settings.url);
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
						if ((status == 'On') && offImage.length) {
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
						if ((status == 'Open' || status == 'On') && offImage.length) {
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
			if (onImage.hasClass('lcursor')) {
				let switcher = $(this).find('.switch');
				if (status == 'Off' || status == 'On') {
					let title = (status == 'Off') ? 'On' : 'Off';
					let checked = (status == 'On') ? 'checked' : '';
					if (switcher.length == 0) {
						let string = '<label class="switch" title="Turn ' + title + '"><input type="checkbox"' + checked + '><span class="slider round"></span></label>';
						bigText.after(string);
					}
					switcher.attr('title', 'Turn ' + title);
					switcher.find('input').attr('checked', checked.length > 0);
					bigText.css('display', 'none');
				} else if (status == 'Open' || status == 'Closed') {
					let title = (status == 'Closed') ? 'Open' : 'Closed';
					let checked = (status == 'Open') ? 'checked' : '';
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
