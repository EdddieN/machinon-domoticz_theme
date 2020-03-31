var theme = {}, themeName = "", baseURL = "", switchState = {}, isMobile, newVersionText = "", gitVersion, lang, user, themeFolder, checkUpdate, userVariableThemeLoaded = false;
generate_noty = void 0;
isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
var msgCount = 0;
var supported_lang = "en fr de sv nl pl";

$.ajax({
    url: "acttheme/js/moment.js",
    async: false,
    dataType: "script",
});

$.ajax({
    url: "acttheme/js/livestamp.js",
    async: false,
    dataType: "script"
});

$.ajax({
    url: "acttheme/js/notify.js",
    async: false,
    dataType: "script"
});

fetch('json.htm?type=settings', {
    method: 'GET',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    credentials: 'include'
}).then(response => {
    return response.json();
}).then(data => {
    lang = (0 <= supported_lang.split(" ").indexOf(data.Language)) ?data.Language : 'en';
    themeFolder = data.WebTheme;
    user = data.WebUserName;
    checkUpdate = data.UseAutoUpdate;

    /* Load required script files and then init the theme */
    $.when(
        $.getScript("acttheme/js/themesettings.js"),
        $.getScript("acttheme/js/functions.js"),
        $.getScript("acttheme/js/devices.js"),
        $.getScript("acttheme/lang/machinon." + lang + ".js"),
        $.Deferred(function(deferred) {
            $(deferred.resolve);
        })
    ).done(function() {
        moment.locale(lang);
        init_theme();
    });
}).catch(error => {
    console.error(error);
});

function init_theme() {
    checkUserVariableThemeSettings();
    loadSettings();

    window.onhashchange = locationHashChanged;

    /* Set $scope variable when angular is available */
    var $scope = null;
    checkAngular = setInterval(function() {
        if (($scope === null) && (typeof angular !== "undefined") && (typeof angular.element(document.body).injector() !== "undefined")) {
            clearInterval(checkAngular);
            $scope = angular.element(document.body).injector().get('$rootScope');

            $scope.$on('device_update', function (event, data) {
                if (theme.features.notification.enabled === true && $("#msg").length == 0) {
                    displayNotifications();
                }
                if (data.ype === "Light/Switch") {

                    setDeviceOpacity(data.idx, data.Status);
                    if (theme.features.icon_image.enabled === true) {
                        /* We have to delay it a few otherwise it's get overwritten by standard icon */
                        setTimeout(setDeviceCustomIcon, 10, data.idx, data.Status);
                    }
                    if (theme.features.switch_instead_of_bigtext.enabled === true && data.SwitchType === "On/Off") {
                        setDeviceSwitch(data.idx, data.Status);
                    }
                }
                if (data.Type.startsWith("Temp") || (data.Type === "Wind")) {
                    /* Temp/Wind widgets are all refreshed, we need to format them again after a delay */
                    setTimeout(function() {
                        $("dzweatherwidget[id='" + data.idx + "']").find("tbody > tr").each(function() {
                            $(this).attr("data-idx", data.idx);
                        });
                        $("dztemperaturewidget[id='" + data.idx + "']").find("tbody > tr").each(function() {
                            $(this).attr("data-idx", data.idx);
                        });
                            setDeviceOptions(data.idx);
                            let lastupd = moment(data.LastUpdate, ["YYYY-MM-DD HH:mm:ss", "L LT"]).format();
                            setDeviceLastUpdate(data.idx, lastupd);
                    }, 10);
                }
                if (data.Type === "Wind") {
                    if (theme.features.wind_direction.enabled === true) {
                        /* We have to delay it a few otherwise it's get overwritten by standard icon */
                        setTimeout(setDeviceWindDirectionIcon, 10, data.idx, data.DirectionStr);
                    }
                }
                setTimeout(function() {
                    let lastupd = moment(data.LastUpdate, ["YYYY-MM-DD HH:mm:ss", "L LT"]).format();
                    setDeviceLastUpdate(data.idx, lastupd);
                    setAllDevicesIconsStatus();
                }, 10);
            }, function errorCallback(response) {
                console.error("Cannot connect to websocket");
            });

            $scope.$on('scene_update', function (event, data) {
                if (theme.features.switch_instead_of_bigtext_scenes.enabled === true) {
                    setDeviceSwitch(data.idx, data.Status);
                }
                let lastupd = moment(data.LastUpdate, ["YYYY-MM-DD HH:mm:ss", "L LT"]).format();
                setDeviceLastUpdate(data.idx, lastupd);
                setDeviceOpacity(data.idx, data.Status);
            }, function errorCallback(response) {
                console.error("Cannot connect to websocket");
            });
        }
    }, 100);

    $(document).ready(function() {
        if (!isMobile) {
            MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    $("#main-view").children("div.container").removeClass("container").addClass("container-fluid");
                    removeRowDivider();
                });
            });
            var targetNode = document.getElementById("holder");
            observer.observe(targetNode, {
                childList: true,
                subtree: true
            });
        }
        enableThemeFeatures();
        setLogo();
        setSearch();
        setDevicesNativeSelectorForMobile();
        $(document).ajaxSuccess(ajaxSuccessCallback);

        if (checkUpdate != 0) checkDomoticzUpdate(true);

        if (theme.background_img && theme.background_img.length) {
            if (theme.background_img.startsWith("http")) {
                bg_url = theme.background_img;
            } else {
                bg_url = "../images/" + theme.background_img;
            }
            $("html").addClass(theme.background_type);
            $("html").css("background-image", "url(" + bg_url + ")");
            $("body").css("cssText", "background: transparent !important");
        }
        $("#cSetup").click(function() {
            showThemeSettings();
        });

        $(".navbar").append('<div class="menu-toggle"><div></div></div>')
        var navBarInner = $(".navbar-inner"), navBarToggle = $(".menu-toggle");
        $(".menu-toggle").prop("title", language.mainmenu);
        navBarToggle.click(function() {
            navBarInner.toggleClass("slide");
        });
        navBarInner.find(".container li").not(".dropdown").not(".dropdown-submenu").click(function() {
            navBarInner.removeClass("slide");
        });
        $("#holder").click(function() {
            navBarInner.removeClass("slide");
        });
        $(window).scroll(function() {
            50 < $(this).scrollTop() ? $("div.menu-toggle").addClass("scrolled") : $("div.menu-toggle").removeClass("scrolled");
        });
        if (theme.features.navbar_icons_text.enabled !== false) {
            $(".navbar").addClass("notext");
        }

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
    });
}
