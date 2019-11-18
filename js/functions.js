function removeRowDivider() {
    if ($("#dashcontent").length) {
        $("#dashcontent > section").each(function() {
            $("div.row.divider:not(:first)", this).children().appendTo($(this).find("div.row.divider:first"));
            if ($("div.row.divider:first > div:first", this).hasClass("span3")) {
                $("div.row.divider:first", this).parent().addClass("compact");
            }
            $("div.row.divider:not(:first)", this).hide();
        });
    } else {
        $("div.row.divider:not(:first)").children().appendTo("div.row.divider:first");
        $("div.row.divider:not(:first)").hide();
    }
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

        /* Create options menu */
        let subnav = $(this).find(".options");
        let subnavButton = $(this).find(".options-cell");
        if (subnav.length && subnavButton.length == 0) {
            $(this).find("table > tbody > tr").append('<td class="options-cell" title="' + $.t("More options") + '"><i class="ion-md-more"></i</td>');
            $(this).on("click", "td.options-cell", function(e) {
                e.preventDefault();
                $(this).siblings("td.options").slideToggle(400);
                $(this).siblings("td.options").unbind("mouseleave");
                $(this).siblings("td.options").mouseleave(function() {
                    $(this).slideToggle(400);
                    $(this).unbind("mouseleave");
                });
            });
            if ($(this).find("#idno").length == 0) {
                $(this).find(".options").append('<a class="btnsmall" id="idno"><i>Idx: ' + idx + "</i></a>");
            }
            $(this).find("table tr").append('<td class="timers_log"></td>');
            $(this).find(".timers_log").append($(this).find('.options .btnsmall[data-i18n="Log"]').html("<i class='ion-ios-stats' title='" + $.t("Log") + "'></i>"));
            $(this).find(".timers_log").append($(this).find('.options .btnsmall[href*="Log"]:not(.btnsmall[data-i18n="Log"])').html("<i class='ion-ios-stats' title='" + $.t("Log") + "'></i>"));
            $(this).find(".timers_log").append($(this).find('.options .btnsmall[data-i18n="Timers"]').html("<i class='ion-ios-timer disabledText' title='" + $.t("Timers") + "'></i>"));
            $(this).find(".timers_log").append($(this).find('.options .btnsmall-sel[data-i18n="Timers"]').html("<i class='ion-ios-timer' title='" + $.t("Timers") + "'></i>"));
            if ($(this).find('table tr .options > img[src*="nofavorite"]:not(".ng-hide")').length === 0) {
                icon = '<i class="ion-ios-star lcursor" title="' + $.t("Remove from Dashboard") + '" onclick="MakeFavorite(' + idx + ',0);"></i></td>';
            } else {
                icon = '<i class="ion-ios-star-outline lcursor" title="' + $.t("Add to Dashboard") + '" onclick="MakeFavorite(' + idx + ',1);"></i></td>';
            }
            $(this).find("table tr").append('<td class="favorite">' + icon + "</td>");
        }

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
            if (bigText.siblings("#img").find("img").hasClass("lcursor") && ($(this).find(".dimslider").length == 0) && ($(this).find(".input").length == 0))
                if (theme.features.switch_instead_of_bigtext.enabled && $(this).find("#img2").length == 0)
                    setDeviceSwitch(idx, status);
                else
                    bigText.show();
        }

        /* Feature - Switch instead of text for scenes */
        if (theme.features.switch_instead_of_bigtext_scenes.enabled === true) {
            if (($(this).parents("#scenecontent").length > 0) || ($(this).find("#itemtablesmalldoubleicon").length > 0)) {
                setDeviceSwitch(idx, status);
                bigText.hide();
            }
            
        }

        /* Feature - Set custom icons */
        if (theme.features.icon_image.enabled === true) {
            setDeviceCustomIcon(idx, status);
        }
	});
}

function setNativeSelectorsForMobile() {
    isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
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

function setDeviceLastUpdate(idx, lastupdate) {
    let tr = "tr[data-idx='" + idx + "']";

    /* If browser is a bit late, avoid future date */
    if (moment(lastupdate).isAfter(moment()))
        lastupdate = moment();

    if (theme.features.time_ago.enabled === true) {
        let lastupdated = $(tr).find("#timeago");
        if (lastupdated.length == 0) {
            $(tr).append('<td id="timeago" class="timeago" title="' + $.t("Last Seen") + '"><i class="ion-ios-pulse"></i> <span id="timeago_duration"></span></td>');
            $(tr).find("#lastupdate").hide();
        }
        $(tr).find("#timeago_duration").text(moment(lastupdate).fromNow());
    } else {
        $(tr).find("#lastupdate").attr("title", $.t("Last Seen"));
        $(tr).find("#lastupdate").text(moment(lastupdate).format("L LT"));
        if ($(tr).find("#lastSeen").length == 0) {
            $(tr).find("#lastupdate").prepend("<i id='lastSeen' class='ion-ios-pulse'></i> ");
        }
    }
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

function enableThemeFeatures() {
    $.each(theme.features, function(key, feature) {
        if (feature.enabled === true) {
            if (feature.files.length > 0) {
                loadThemeFeatureFiles(key);
            }
        }
    });
    console.log(themeName + " - feature files is loaded.");
    loadedThemeCSSandJS = true;
}

function loadThemeFeatureFiles(featureName) {
    var files = theme.features[featureName].files;
    var arrayLength = files.length;
    for (var i = 0; i < arrayLength; i++) {
        if (files[i].split(".").pop() == "js") {
            console.log(themeName + " - Loading javascript for " + featureName + " feature");
            var getviarequire = "../acttheme/js/" +  files[i] + "?" + themeName;
            requirejs([ getviarequire ], function(util) {
                console.log(themeName + " - Javascript loaded by RequireJS");
            });
        }
        if (files[i].split(".").pop() == "css") {
            var CSSfile = "acttheme/css/" + files[i] + "?" + themeName;
            var fileref = document.createElement("link");
            fileref.setAttribute("rel", "stylesheet");
            fileref.setAttribute("type", "text/css");
            fileref.setAttribute("href", CSSfile);
            document.getElementsByTagName("head")[0].appendChild(fileref);
        }
    }
}

function unloadThemeFeatureFiles(featureName) {
    var files = theme.features[featureName].files;
    var arrayLength = files.length;
    for (var i = 0; i < arrayLength; i++) {
        if (files[i].split(".").pop() == "css") {
            $('head link[href*="' + files[i] + '"]').remove();
        }
    }
}

function searchFunction() {
    var value = $("#searchInput").val().toLowerCase();
    $("div .item").filter(function() {
        var element = $(this);
        if ($("#dashcontent").length || $("#weatherwidgets").length || $("#tempwidgets").length) {
            element = $(this).parent();
        }
        element.toggle($(this).find("#name").html().toLowerCase().indexOf(value) > -1);
    });
    $(".mobileitem tr").filter(function() {
        $(this).toggle($(this).html().toLowerCase().indexOf(value) > -1);
    });
    removeEmptySectionDashboard();
}

function locationHashChanged() {
    setPageTitle();
    $(".current_page_item:not(:first)").removeClass("current_page_item");
    $("#searchInput").val("");

    isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (location.hash == "#/Dashboard" && !isMobile || location.hash == "#/LightSwitches" || location.hash == "#/Scenes" || location.hash == "#/Temperature" || location.hash == "#/Weather" || location.hash == "#/Utility") {
        $("#search").removeClass("readonly");
    } else {
        $("#search").addClass("readonly");
    }
    if ((location.hash == "#/Dashboard") && theme.features.dashboard_camera.enabled) {
        theme.features.dashboard_camera_section && cameraPreview(theme.features.dashboard_camera_section.enabled);
    }
    if (location.hash == "#/CustomIcons") {
        setCustomIconsPage();
    }
}

function notify(key, type) {
    if (theme.features.notification.enabled === true) {
        if (type == 0 || type == 2) {
            var existing = localStorage.getItem(themeFolder + ".notify");
            existing = existing ? JSON.parse(existing) : {};
            let d = new Date();
            dd = d.getTime();
            existing[key] = dd;
            localStorage.setItem(themeFolder + ".notify", JSON.stringify(existing));
            $("#notyIcon").show();
        }
        if (type == 1 || type == 2) {
            if (type == 1) $("#notyIcon").show();
            let width = window.innerWidth;
            if (width > 767) {
                $("#notyIcon").notify(key);
            } else {
                $("#notyIcon").notify(key, {
                    position: "right",
                    className: "info"
                });
            }
            if (type == 1) $("#notyIcon").hide();
        }
    }
}

function clearNotify() {
    if (typeof Storage !== "undefined") {
        localStorage.removeItem(themeFolder + ".notify");
        $("#notyIcon").hide();
    }
}

function checkDomoticzUpdate(showdialog) {
    $.ajax({
        url: "json.htm?type=command&param=checkforupdate&forced=" + showdialog,
        dataType: "json",
        success: function(data) {
            if (data.HaveUpdate == true) {
                msgtxt = "Domoticz version #" + data.Revision + " " + language.is_available + "!";
                msgtxt += ' <a onclick="CheckForUpdate(true);">' + language.update_now + "</a>";
                notify(msgtxt, 0);
            }
        }
    });
    return false;
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

function getNotifications(idx, state) {
    var msg;
    $.ajax({
        url: "json.htm?type=notifications&idx=" + idx + "",
        cache: false,
        async: false,
        dataType: "json",
        success: function(data) {
            var message = data.result;
            for (let r in data.result) {
                if (typeof message !== "undefined") {
                    var system = message[r].ActiveSystems;
                    if (system.includes("browser")) {
                        if (state == "On" || state == "Open" || state == "Locked") {
                            if (message[r].Params == "S") {
                                msg = message[r].CustomMessage;
                                notify(msg, 1);
                            }
                        }
                        if (state == "Off" || state == "Closed" || state == "Unlocked") {
                            if (message[r].Params == "O") {
                                msg = message[r].CustomMessage;
                                notify(msg, 1);
                            }
                        }
                    }
                }
            }
        }
    });
}

function displayNotifications() {
    var msg = localStorage.getItem(themeFolder + ".notify");
    msg = JSON.parse(msg);
    var myObj = msg;
    msgCount = 0;
    $("#notify").append('<div id="msg" class="msg"><ul></ul><center><a class="btn btn-info" onclick="clearNotify();">' + (typeof $.t === "undefined" ? "Clear" : $.t("Clear")) + "</a></center></div>");
    for (let x in myObj) {
        $("#msg ul").append("<li>" + x + "<span> -- " + moment(myObj[x]).fromNow() + "</span></li>");
        msgCount++;
        $("#notyIcon").prop("title", language.you_have + " " + msgCount + " " + language.messages);
        $("#notyIcon").attr("data-msg", msgCount);
    }
    $("#msg").hide();
}

function setPageTitle() {
    var pagedetect = window.location.href.split("#/")[1];
    var title = (typeof $.t !== "undefined" ? $.t(pagedetect) : pagedetect );
    document.title = 'Domoticz - ' + title;
}

function isAdmin() {
    if (typeof angular !== "undefined") {
        var injector = angular.element($("html")).injector();
        var permissions = injector.get("permissions");
        return permissions.hasPermission("Admin");
    } else return false;
}

function removeEmptySectionDashboard() {
    $("#dashcontent section").each(function() {
        $(this).show();
        if (!$(this).children("div.row").children(":visible").length) {
            $(this).hide();
        }
    });
}

function setCustomIconsPage() {
     checkIconsmain = setInterval(function() {
        if ($("#iconsmain #fileupload").length && $("#iconsmain label.fileupload").length === 0) {
            clearInterval(checkIconsmain);
   
            $("#iconsmain #fileupload").parent().prepend('<label for="fileupload" class="fileupload btn btn-info">' + $.t("Upload") + "</label>");
            $("#iconsmain > div table:first").find("td:last").append($("#iconsmain > table td:last").children());
            $("#iconsmain .iconlist .iconlistitem").click(function() {
                $("#iconsmain > div > table").show();
                $("#iconsmain > div > tbody > tr > td:nth-child(2)").show();
            });
            $("#iconsmain #fileupload").on("change", function() {
                $(this).next().click();
                $(this).val("");
            });
        }
    }, 100);
}
