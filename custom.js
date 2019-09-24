var theme = {}, themeName = "", baseURL = "", switchState = {}, isMobile, newVersionText = "", gitVersion, lang, user, themeFolder, checkUpdate, userVariableThemeLoaded = false;
generate_noty = void 0;
isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
var msgCount = 0;

$.ajax({
    url: "json.htm?type=settings",
    cache: false,
    async: false,
    dataType: "json",
    success: function(b) {
        lang = b.Language;
        themeFolder = b.WebTheme;
        user = b.WebUserName;
        checkUpdate = b.UseAutoUpdate;
    }
});

$.ajax({
    url: "acttheme/js/notify.js",
    async: false,
    dataType: "script"
});

$.ajax({
    url: "acttheme/js/themesettings.js",
    async: false,
    dataType: "script"
});

$.ajax({
    url: "acttheme/js/functions.js",
    async: false,
    dataType: "script"
});

$.ajax({
    url: "acttheme/js/moment.js",
    async: false,
    dataType: "script",
    success: function() {
        moment.locale(lang);
    }
});

0 <= "en fr de sv nl pl".split(" ").indexOf(lang) ? $.ajax({
    url: "acttheme/lang/machinon." + lang + ".js",
    async: false,
    dataType: "script"
}) : $.ajax({
    url: "acttheme/lang/machinon.en.js",
    async: false,
    dataType: "script"
});

if (!isMobile) {
    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            $("#main-view").children("div.container").removeClass("container").addClass("container-fluid");
            removeRowDivider();
            if ($("#iconsmain").length) {
                if ($("#iconsmain #fileupload").length && $("#iconsmain label.fileupload").length === 0) {
                    $("#iconsmain #fileupload").parent().prepend('<label for="fileupload" class="fileupload btn btn-info">' + $.t("Upload") + "</label>");
                    $("#iconsmain > div table:first").find("td:last").append($("#iconsmain > table td:last").children());
                }
                $("#iconsmain .iconlist .iconlistitem").click(function() {
                    $("#iconsmain > div > table").show();
                    $("#iconsmain > div > tbody > tr > td:nth-child(2)").show();
                });
                $("#iconsmain #fileupload").on("change", function() {
                    $(this).next().click();
                    $(this).val("");
                });
            }
        });
    });
}

window.onhashchange = locationHashChanged;

$(document).ready(function() {
    if (!isMobile) {
        var targetNode = document.getElementById("holder");
        observer.observe(targetNode, {
            childList: true,
            subtree: true
        });
    }
    requirejs.config({
        waitSeconds: 30
    });
    showThemeSettings();
    checkUserVariableThemeSettings();
    loadSettings();
    enableThemeFeatures();
    if (checkUpdate != 0) checkDomoticzUpdate(true);
    let containerLogo = '<header class="logo"><div class="container-logo">';
    if (theme.logo.length == 0) {
        containerLogo += '<img class="header__icon" src="acttheme/images/logo.png">';
        $("<style>#login:before {content: url(../images/logo.png) !important;}</style>").appendTo("head");
    } else {
        containerLogo += '<img class="header__icon" src="acttheme/images/' + theme.logo + '"';
        $("<style>#login:before {content: url(../images/" + theme.logo + ") !important;}</style>").appendTo("head");
    }
    containerLogo += "</div></header>";
    $(containerLogo).insertBefore(".navbar-inner");
    if (theme.background_img.length) {
        if (theme.background_img.startsWith("http")) {
            bg_url = theme.background_img;
        } else {
            bg_url = "../images/" + theme.background_img;
        }
        $("html").addClass(theme.background_type);
        $("html").css("background-image", "url(" + bg_url + ")");
        $("body").css("cssText", "background: transparent !important");
    }
    $('<div id="search"><input type="text" id="searchInput" autocomplete="off" onkeyup="searchFunction()" placeholder="' + language.type_to_search + '" title="' + language.type_to_search + '"><i class="ion-md-search"></i></div>').appendTo(".container-logo");
    $("#search").click(function() {
        $("#searchInput").focus();
    });
    $("#searchInput").keyup(function(event) {
        if (event.keyCode === 13) {
            $("#searchInput").blur();
        }
        if (event.keyCode === 27) {
            $("#searchInput").val("");
            $("#searchInput").keyup();
        }
    });
    var adminRights = isAdmin();
    true === theme.features.custom_settings_menu.enabled ? $.ajax({
        url: "acttheme/js/settings_page.js",
        async: false,
        dataType: "script"
    }) : $("#cSetup").click(function() {
        showThemeSettings();
        loadSettings();
        enableThemeFeatures();
    });
    true === theme.features.custom_page_menu.enabled && $.ajax({
        url: "acttheme/js/custom_page.js",
        async: false,
        dataType: "script"
    });
    isMobile && adminRights && 992 >= window.innerWidth && $("#appnavbar").append('<li id="mLogout"><a id="cLogout" href="#Logout"><img src="acttheme/images/logout.png"><span class="hidden-phone hidden-tablet" data-i18n="Logout">Logout</span></a></li>');
    var navBar = $(".navbar").append('<div class="menu-toggle"><div></div></div>'), navBarInner = $(".navbar-inner"), navBarToggle = $(".menu-toggle");
    $(".menu-toggle").prop("title", language.mainmenu);
    navBarToggle.click(function() {
        navBarInner.toggleClass("slide");
    });
    (isMobile && 992 >= window.innerWidth || !isMobile && 992 >= window.innerWidth) && $(".container li").not(".dropdown").not(".dropdown-submenu").click(function() {
        navBarInner.removeClass("slide");
    });
    (isMobile && 992 >= window.innerWidth || !isMobile && 992 >= window.innerWidth) && $("#holder").click(function() {
        navBarInner.removeClass("slide");
    });
    $(window).scroll(function() {
        50 < $(this).scrollTop() ? $("div.menu-toggle").addClass("scrolled") : $("div.menu-toggle").removeClass("scrolled");
    });
    if (theme.features.notification.enabled === true) {
        $('<div id="notify"></div>').appendTo(".container-logo");
        $('<i id="notyIcon" class="ion-ios-notifications-outline lcursor"></i>').appendTo("#notify").hide();
        var existingNotes = localStorage.getItem(themeFolder + ".notify");
        existingNotes && $("#notyIcon").show();
        var state = false;
        $("#notify").click(function() {
            if (!state) {
                $("#msg").show();
            } else {
                $("#msg").remove();
                msgCount = 0;
            }
            state = !state;
        });
    }
    if (theme.features.footer_text_disabled.enabled === true) {
        $("#copyright").remove();
    }
    if (theme.features.sidemenu.enabled === true && !isMobile || theme.features.sidemenu.enabled === true && !isMobile && 992 >= window.innerWidth) {
        if (adminRights === true) {
            $("#appnavbar").append('<li id="mLogout"><a id="cLogout" href="#Logout"><img src="acttheme/images/logout.png"><span class="hidden-phone hidden-tablet" data-i18n="Logout">Logout</span></a></li>');
        }
        $("#holder").click(function() {
            navBarInner.removeClass("slide");
        });
        $(".container li:not(.dropdown)").click(function() {
            navBarInner.removeClass("slide");
        });
    }
    if (theme.features.navbar_icons_text.enabled !== false) {
        $(".navbar").addClass("notext");
    }
});

$(document).ajaxSuccess(function(event, xhr, settings) {
    if (theme.features.notification.enabled === true && $("#msg").length == 0) {
        var msg = localStorage.getItem(themeFolder + ".notify");
        msg = JSON.parse(msg);
        var myObj = msg;
        msgCount = 0;
        $("#notify").append('<div id="msg" class="msg"><ul></ul><center><a class="btn btn-info" onclick="clearNotify();">' + (typeof $.t === "undefined" ? "Clear" : $.t("Clear")) + "</a></center></div>");
        for (x in myObj) {
            $("#msg ul").append("<li>" + x + "<span> -- " + moment(myObj[x]).fromNow() + "</span></li>");
            msgCount++;
            $("#notyIcon").prop("title", language.you_have + " " + msgCount + " " + language.messages);
            $("#notyIcon").attr("data-msg", msgCount);
        }
        $("#msg").hide();
    }
    if (settings.url.startsWith("json.htm?type=devices") || settings.url.startsWith("json.htm?type=scenes")) {
        let counter = 0;
        let intervalId = setInterval(function() {
            if ($("#main-view").find(".item").length > 0) {
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
    } else if (settings.url.startsWith("json.htm?type=command&param=switchscene")) {
        let id = settings.url.split("&")[2];
        id = id.substr(4);
        let scene = $(".item#" + id);
        let statusElem = scene.find("#status .wrapper");
        statusElem.hide();
        let switcher = statusElem.parent().siblings(".switch").find("input");
        if (switcher.length) {
            let statusText = settings.url.split("&")[3];
            statusText = statusText.substr(10);
            switcher.attr("checked", statusText == "On");
        }
    }
});
