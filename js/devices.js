function setDevicesNativeSelectorForMobile() {
    if (!isMobile) return;
    $(".selectorlevels span.ui-selectmenu-button").each(function() {
        $(this).hide();
        var selectorId = $(this).attr("id").split("-", 1)[0];
        $("#" + selectorId).addClass("ui-widget ui-corner-all").show();
        $("#" + selectorId).on("change", function(e) {
            var selected = $(this).children("option:selected");
            SwitchSelectorLevel($(this).attr("data-idx"), selected.text(), selected.val());
        });
    });
}

function setAllDevicesFeatures() {
    switchState = {
        on: $.t("On"),
        off: $.t("Off"),
        open: $.t("Open"),
        closed: $.t("Closed")
    };

    /* Browse all items to apply themes features and styles */
    $("#main-view .item").each(function() {
        /* Set idx on tr, for easy retrieval */
        let idx = $(this).parent().attr('id');
        if (typeof idx === "undefined") {
            idx = $(this).attr('id');
        } else {
            idx = idx.replace( /^\D+/g, '');
        }
        $(this).find("tr").attr('data-idx', idx);

        let bigText = $(this).find("#bigtext");
        let status = bigText.text();
        if (status.length == 0) {
            status = bigText.attr("data-status");
        }

        /* Apply style and redefine options */
        setDeviceOptions(idx);

        /* Feature - Fade off items */
        setDeviceOpacity(idx, status);

        /* Feature - Show timeago for last update */
        var lastupd;
        if (theme.features.time_ago.enabled === true) {
            lastupd = $(this).find("#lastupdate").text();
        } else {
            lastupd = moment($(this).find("#lastupdate").text(), [ "YYYY-MM-DD HH:mm:ss", "L LT" ]).format();
        }
        setDeviceLastUpdate(idx , lastupd);

        /* Feature - Switch instead of text */
        if (((location.hash === "#/Dashboard") && $(this).parent().attr("id").startsWith("light")) || (location.hash === "#/LightSwitches")) {
            if (bigText.siblings("#img").find("img").hasClass("lcursor") && ($(this).find(".dimslider").length == 0) && ($(this).find(".selectorlevels").length == 0)) {
                if (theme.features.switch_instead_of_bigtext.enabled && $(this).find("#img2").length == 0) {
                    setDeviceSwitch(idx, status);
                } else {
                    bigText.show();
                }
            }
        }

        /* Feature - Switch instead of text for scenes */
        if (theme.features.switch_instead_of_bigtext_scenes.enabled === true) {
            if (($(this).parents("#scenecontent").length > 0) || ($(this).parents("#dashScenes").length > 0 && $(this).find("#itemtablesmalldoubleicon").length > 0)) {
                setDeviceSwitch(idx, status);
                bigText.hide();
            }
            
        }

        /* Feature - Set custom icons */
        if (theme.features.icon_image.enabled === true) {
            setDeviceCustomIcon(idx, status);
        }

        /* Feature - Show wind direction */
        if (theme.features.wind_direction.enabled === true) {
            setDeviceWindDirectionIcon(idx);
        }
	});
}

function setAllDevicesIconsStatus() {
    $("div.item.statusProtected").each(function() {
        if ($(this).find("#name > i.ion-ios-lock").length === 0) {
            $(this).find("#name").prepend("<i class='ion-ios-lock' title='" + $.t("Protected") + "'></i>&nbsp;");
        }
    });
    $("div.item.statusTimeout").each(function() {
        if ($(this).find("#name > i.ion-ios-wifi").length === 0) {
            $(this).find("#name").prepend("<i class='ion-ios-wifi blink warning-text' title='" + $.t("Sensor Timeout") + "'></i>&nbsp;");
        }
    });
    $("div.item.statusLowBattery").each(function() {
        if ($(this).find("#name > i.ion-ios-battery-dead").length === 0) {
            $(this).find("#name").prepend("<i class='ion-ios-battery-dead blink warning-text' title='" + $.t("Battery Low Level") + "'></i>&nbsp;");
        }
    });
}

function setDeviceOptions(idx) {
    let tr = "tr[data-idx='" + idx + "']";
    $(tr).each(function() {
        /* Create options menu */
        let subnav = $(this).find(".options");
        let subnavButton = $(this).find(".options-cell");
        if (subnav.length && subnavButton.length == 0) {
            /* Display idx in the options */
            $(subnav).append('<a class="btnsmall" id="idno"><i>Idx: ' + idx + "</i></a>");
            $(this).append('<td class="options-cell" title="' + $.t("More options") + '"><i class="ion-md-more"></i</td>');
            $(this).on("click", "td.options-cell", function(e) {
                e.preventDefault();
                $(this).siblings("td.options").slideToggle(400);
                $(this).siblings("td.options").unbind("mouseleave");
                $(this).siblings("td.options").mouseleave(function() {
                    $(this).slideToggle(400);
                    $(this).unbind("mouseleave");
                });
            });
            $(this).append('<td class="timers_log"></td>');
            timers = $(this).find(".timers_log");
            $(timers).append($(this).find('.options .btnsmall[data-i18n="Log"]').html("<i class='ion-ios-stats' title='" + $.t("Log") + "'></i>"));
            $(timers).append($(this).find('.options .btnsmall[href*="Log"]:not(.btnsmall[data-i18n="Log"])').html("<i class='ion-ios-stats' title='" + $.t("Log") + "'></i>"));
            $(timers).append($(this).find('.options .btnsmall[data-i18n="Timers"]').html("<i class='ion-ios-timer disabledText' title='" + $.t("Timers") + "'></i>"));
            $(timers).append($(this).find('.options .btnsmall-sel[data-i18n="Timers"]').html("<i class='ion-ios-timer' title='" + $.t("Timers") + "'></i>"));
            if ($(this).find('.options > img[src*="nofavorite"]:not(".ng-hide")').length === 0) {
                icon = '<i class="ion-ios-star lcursor" title="' + $.t("Remove from Dashboard") + '" onclick="MakeFavorite(' + idx + ',0);"></i></td>';
            } else {
                icon = '<i class="ion-ios-star-outline lcursor" title="' + $.t("Add to Dashboard") + '" onclick="MakeFavorite(' + idx + ',1);"></i></td>';
            }
            $(this).append('<td class="favorite">' + icon + "</td>");
        }
    });
}

function setDeviceCustomIcon(idx, status) {
    switchState = {
        on: $.t("On"),
        off: $.t("Off"),
    };

    var icons = theme.icons;
    for (var i = 0; i < icons.length; i++) {
        if (icons[i].idx == idx) {
            let tr = "tr[data-idx='" + idx + "']";
            $(tr).find("#img img").attr("src", "images/" + icons[i].img);
            if (status == switchState.on || status == 'On') {
                $(tr).find("#img img").addClass("userOn");
            } else {
                $(tr).find("#img img").addClass("user");
            }
        }
    }
}

function setDeviceWindDirectionIcon(idx, direction) {
    let tr = "tr[data-idx='" + idx + "']";
    $(tr).find("#img img[src*='Wind']").each(function() {
        if (direction === undefined) {
            let src = $(this).attr("src").split('/Wind');
            direction = src[1];
        } else {
            direction += '.png';
        }
        $(this).attr("src", 'images/wind-direction/Wind' + direction);
    }); 
}

function setDeviceLastUpdate(idx, lastupdate) {
    let tr = "tr[data-idx='" + idx + "']";

    /* If browser is a bit late, avoid future date */
    if (moment(lastupdate).isAfter(moment()))
        lastupdate = moment();

    $(tr).each(function() {
        if (theme.features.time_ago.enabled === true) {
            let lastupdated = $(this).find("#timeago");
            if (lastupdated.length == 0) {
                $(this).append('<td id="timeago" class="timeago" title="' + $.t("Last Seen") + '"><i class="ion-ios-pulse"></i> <span data-livestamp="' + moment(lastupdate).format() + '" title="' + moment(lastupdate).format("L LT") + '"></span></td>');
                $(this).find("#lastupdate").hide();
            } else {
                $(this).find("#timeago > span").attr("title", moment(lastupdate).format("L LT"));
                $(this).find("#timeago > span").livestamp( moment(lastupdate).format());
            }
        } else {
            $(this).find("#lastupdate").attr("title", $.t("Last Seen"));
            $(this).find("#lastupdate").text(moment(lastupdate).format("L LT"));
            if ($(this).find("#lastSeen").length == 0) {
                $(this).find("#lastupdate").prepend("<i id='lastSeen' class='ion-ios-pulse'></i> ");
            }
        }
    });
}

function setDeviceOpacity(idx, status) {
    switchState = {
        on: $.t("On"),
        off: $.t("Off"),
        open: $.t("Open"),
        closed: $.t("Closed")
    };

    if (theme.features.fade_offItems.enabled === true) {
        let tr = "tr[data-idx='" + idx + "']";
        if (status === switchState.off  || status === 'Off' || status === switchState.closed || status === 'Closed') {
            $(tr).parents(".item").addClass("fadeOff");
        } else {
            $(tr).parents(".item").removeClass("fadeOff");
        }
    }
}

var timeOut = [];
function timedOut(idx, value, device) {
    let textmsg = "Sensor " + device.Name + " " + language.is + " " + language.timedout;
    if (typeof timeOut[idx] !== "undefined" && value !== timeOut[idx]) {
        if (device.HaveTimeout) {
            notify(textmsg, 2);
        }
    }
    timeOut[idx] = value;
}

var oldstates = [];
function triggerChange(idx, value, device) {
    let textLowBattery = device.Name + " " + $.t("Battery Level") + " " + $.t("Low") + " " + device.BatteryLevel + "%";
    if (typeof oldstates[idx] !== "undefined" && value !== oldstates[idx]) {
        getNotifications(idx, device.Data);
        if (device.BatteryLevel < 11) {
            notify(textLowBattery, 2);
        }
    }
    oldstates[idx] = value;
}
