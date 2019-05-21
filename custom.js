/* Custom.js for machinon theme */

var theme = {}, themeName = "", baseURL = "", switchState = {}, isMobile, newVersionText = "", gitVersion, lang, user, themeFolder, checkUpdate, userVariableThemeLoaded = false;
generate_noty = void 0;
isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
var msgCount = 0;

// Load extra JS files
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

// Check if is admin
checkauth();

// Force layout
if (!isMobile){ 
    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {	
            $('#main-view').children('div.container').removeClass('container').addClass('container-fluid');
            removeRowDivider();
        });
    });
}

// Listener when page (hash) change
window.onhashchange = locationHashChanged;

// Document is ready
$(document).ready(function() {
    if (!isMobile){ 
        var targetNode = document.getElementById('holder');
        observer.observe(targetNode, {
            childList: true,
            subtree: true
        });
    }
    requirejs.config({ waitSeconds: 30 });


    // Load theme settings
    showThemeSettings();
    checkUserVariableThemeSettings();
    loadSettings();
    enableThemeFeatures();

    if (checkUpdate != 0)CheckDomoticzUpdate(true);
    getStatus(true);

    // Header logo
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

    if (theme.background_img.length) {
        if (theme.background_img.startsWith('http')) {
            bg_url = theme.background_img;
        } else {
            bg_url = '../images/' + theme.background_img;
        }
        $('html').addClass(theme.background_type);
        $('html').css('background-image', 'url(' + bg_url + ')');
        $('body').css('cssText', 'background: transparent !important');
    }
 
    // Searchbar		
    $('<div id="search"><input type="text" id="searchInput" autocomplete="off" onkeyup="searchFunction()" placeholder="' + language.type_to_search + '" title="' + language.type_to_search + '"><i class="ion-md-search"></i></div>').appendTo('.container-logo');
    $('#search').click(function() {
        $('#searchInput').focus();
    });
    $('#searchInput').keyup(function(event) {
      if (event.keyCode === 13) {
        /* Return key */
        $('#searchInput').blur();
      }
      if (event.keyCode === 27) {
        /* Escape key */
        $('#searchInput').val('');
        $('#searchInput').keyup();
      }
    });
    
    // Feature - Replace settings dropdown button to normal button
    true === theme.features.custom_settings_menu.enabled ? $.ajax({url:"acttheme/js/settings_page.js", async: false, dataType:"script"}) : $("#cSetup").click(function() {
        showThemeSettings();
        loadSettings();
        enableThemeFeatures();
    });
    
    // Feature - Insert config-forms menu item into main navigation
    true === theme.features.custom_page_menu.enabled && $.ajax({url:"acttheme/js/custom_page.js", async: false, dataType:"script"});
    isMobile && adminRights && 992 >= window.innerWidth && $("#appnavbar").append('<li id="mLogout"><a id="cLogout" href="#Logout"><img src="images/logout.png"><span class="hidden-phone hidden-tablet" data-i18n="Logout">Logout</span></a></li>');
    
    // Navbar
    var navBar = $(".navbar").append('<div class="menu-toggle"><div></div></div>'), navBarInner = $(".navbar-inner"), navBarToggle = $(".menu-toggle");
    $(".menu-toggle").prop('title', language.mainmenu);
    navBarToggle.click(function() {
        navBarInner.toggleClass("slide");
    });
    
    // Close navbar if the user clicks outside of it
    (isMobile && 992 >= window.innerWidth || !isMobile && 992 >= window.innerWidth) && $(".container").click(function() {
        navBarInner.removeClass("slide");
    });
    (isMobile && 992 >= window.innerWidth || !isMobile && 992 >= window.innerWidth) && $("#holder").click(function() {
        navBarInner.removeClass("slide");
    });

    // Menu icon follows when scrolling down
    $(window).scroll(function() {
        50 < $(this).scrollTop() ? $("div.menu-toggle").addClass("scrolled") : $("div.menu-toggle").removeClass("scrolled");
    });
    
    // Feature - Notifications
    if (theme.features.notification.enabled === true) {
        $('<div id="notify"></div>').appendTo('.container-logo');
        $('<img id="notyIcon" src="images/notify.png"/>').appendTo('#notify').hide();
        var existingNotes = localStorage.getItem(themeFolder + ".notify");
        existingNotes && $("#notyIcon").show()
        var state = false;

        $('#notify').click(function(){
            if(!state){
                $('#msg').show();
            }else {
                $('#msg').remove();
                msgCount = 0;
            }
            state = !state;
        });
    }
    
    // Feature - Disable footer
    if (theme.features.footer_text_disabled.enabled === true) {
        $('#copyright').remove();
    }

    // Feature - Sidemenu enabled
    if (theme.features.sidemenu.enabled === true && !isMobile || theme.features.sidemenu.enabled === true && !isMobile && 992 >= window.innerWidth) {
        if (adminRights === true){$("#appnavbar").append('<li id="mLogout"><a id="cLogout" href="#Logout"><img src="images/logout.png"><span class="hidden-phone hidden-tablet" data-i18n="Logout">Logout</span></a></li>');}
        $('#holder').click(function() {  
            navBarInner.removeClass("slide");
        });
        $('.container').click(function() {   
            navBarInner.removeClass("slide");
        });
    }

    // Feature - Enable navbar text
    if (theme.features.navbar_icons_text.enabled !== false) {
        $('.navbar').addClass('notext');
    }
});

// Executed whenever an Ajax request completes successfully
$(document).ajaxSuccess(function (event, xhr, settings) {

    // Iconpage
    $('.iconlist .iconlistitem').click(function() {
        $('#iconsmain > div > table').show();
        $('#iconsmain > div > tbody > tr > td:nth-child(2)').show();
    });

    // Notifications
    if (theme.features.notification.enabled === true && $('#msg').length == 0) {
        var msg = localStorage.getItem(themeFolder + ".notify");
        msg = JSON.parse(msg);
        var myObj = msg;
        $('#notify').append('<div id="msg" class="msg"><ul></ul><center><a class="btn btn-info" onclick="clearNotify();">'+(typeof $.t === "undefined" ? "Clear" : $.t('Clear'))+'</a></center></div>');
        for (x in myObj) {
            $('#msg ul').append('<li>' + x + '<span> -- ' + jQuery.timeago(myObj[x]) + '</span></li>');
            msgCount++;
            $("#notyIcon").prop('title', language.you_have +' '+ msgCount +' '+ language.messages);
        }
        $('#msg').hide();
    }

    if (settings.url.startsWith('json.htm?type=devices') ||
        settings.url.startsWith('json.htm?type=scenes')) {
        let counter = 0;
        let intervalId = setInterval(function () {
            if ($('#main-view').find('.item').length > 0) {
                applySwitchersAndSubmenus();
                applyIconsStatus();
                clearInterval(intervalId);
            } else {
                counter++;
                if (counter >= 5) {
                    clearInterval(intervalId);
                }
            }
            nativeSelectors();
        }, 100);
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
