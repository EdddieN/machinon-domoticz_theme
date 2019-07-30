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

function applySwitchersAndSubmenus() {
    isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    switchState = {
        on: $.t("On"),
        off: $.t("Off"),
        open: $.t("Open"),
        closed: $.t("Closed")
    };
    $("#main-view .item").each(function() {
        let bigText = $(this).find("#bigtext");
        let status = bigText.text();
        let onImage = bigText.siblings("#img").find("img");
        if (onImage.length == 0) {
            onImage = bigText.siblings("#img1").find("img");
        }
        if (theme.features.fade_offItems.enabled === true) {
            if (status == switchState.off) {
                $(this).addClass("fadeOff");
            } else {
                $(this).removeClass("fadeOff");
            }
        }
        if (status.length == 0) {
            status = bigText.attr("data-status");
        } else {
            $(this).off("click", ".switch");
            let isScenesTab = $(this).parents("#scenecontent").length > 0;
            if (isScenesTab) {
                $(this).on("click", ".switch", function(e) {
                    e.preventDefault();
                    let offImage = $(this).siblings("#img2").find("img");
                    let subStatus = bigText.siblings("#status").find("span").text();
                    if ($.trim(subStatus).length) {
                        status = subStatus;
                    }
                    if (status == switchState.on && offImage.length) {
                        offImage.click();
                    } else {
                        if (onImage.hasClass("lcursor")) {
                            onImage.click();
                        }
                    }
                });
            } else {
                $(this).one("click", ".switch", function(e) {
                    e.preventDefault();
                    let offImage = $(this).siblings("#img3").find("img");
                    if (offImage.length == 0) {
                        offImage = $(this).siblings("#img2").find("img");
                    }
                    if ((status == switchState.open || status == switchState.on) && offImage.length) {
                        offImage.click();
                    } else {
                        if (onImage.hasClass("lcursor")) {
                            onImage.click();
                        }
                    }
                });
            }
        }
        if (theme.features.time_ago.enabled === true) {
            let lastupdated = $(this).find("#timeago");
            let xyz = $(this).find("#lastupdate");
            if (lastupdated.length == 0) {
                $(this).find("table tbody tr").append('<td id="timeago" class="timeago" title="' + $.t("Last Seen") + '"><i class="ion-ios-pulse"></i> <span id="timeago_duration"></span></td>');
                $(this).find("#lastupdate").hide();
            }
            $(this).find("#timeago_duration").text(moment(xyz.text()).fromNow());
        } else {
            $(this).find("#lastupdate").attr("title", $.t("Last Seen"));
            $(this).find("#lastupdate").text(moment($(this).find("#lastupdate").text(), [ "YYYY-MM-DD HH:mm:ss", "L LT" ]).format("L LT"));
            if ($(this).find("#lastSeen").length == 0) {
                $(this).find("#lastupdate").prepend("<i id='lastSeen' class='ion-ios-pulse'></i> ");
            }
        }
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
            $(this).find("table tr").append('<td class="timers_log"></td>');
            $(this).find(".timers_log").append($(this).find('.options .btnsmall[data-i18n="Log"]').html("<i class='ion-ios-stats' title='" + $.t("Log") + "'></i>"));
            $(this).find(".timers_log").append($(this).find('.options .btnsmall[href*="Log"]:not(.btnsmall[data-i18n="Log"])').html("<i class='ion-ios-stats' title='" + $.t("Log") + "'></i>"));
            $(this).find(".timers_log").append($(this).find('.options .btnsmall[data-i18n="Timers"]').html("<i class='ion-ios-timer disabledText' title='" + $.t("Timers") + "'></i>"));
            $(this).find(".timers_log").append($(this).find('.options .btnsmall-sel[data-i18n="Timers"]').html("<i class='ion-ios-timer' title='" + $.t("Timers") + "'></i>"));
            let item = $(this).closest(".item");
            var itemID = item.attr("id");
            if (typeof itemID === "undefined") {
                itemID = item[0].offsetParent.id;
            }
            if ($(this).find('table tr .options > img[src*="nofavorite"]:not(".ng-hide")').length === 0) {
                icon = '<i class="ion-ios-star lcursor" title="' + $.t("Remove from Dashboard") + '" onclick="MakeFavorite(' + itemID + ',0);"></i></td>';
            } else {
                icon = '<i class="ion-ios-star-outline lcursor" title="' + $.t("Add to Dashboard") + '" onclick="MakeFavorite(' + itemID + ',1);"></i></td>';
            }
            $(this).find("table tr").append('<td class="favorite">' + icon + "</td>");
        }
        if ($("#dashcontent").length == 0) {
            let item = $(this).closest(".item");
            var itemID = item.attr("id");
            if (typeof itemID === "undefined") {
                itemID = item[0].offsetParent.id;
            }
            let type = $(this).find("#idno");
            if (type.length == 0) {
                $(this).find(".options").append('<a class="btnsmall" id="idno"><i>Idx: ' + itemID + "</i></a>");
            }
            removeEmptySectionDashboard();
        }
        let switchOnScenes = false;
        let switchOnScenesDash = false;
        if (theme.features.switch_instead_of_bigtext_scenes.enabled === false) {
            switchOnScenes = $(this).parents("#scenecontent").length > 0;
            switchOnScenesDash = $(this).find("#itemtablesmalldoubleicon").length > 0;
        }
        if (theme.features.switch_instead_of_bigtext.enabled === true) {
            if (!switchOnScenes) {
                if (!switchOnScenesDash) {
                    if (onImage.hasClass("lcursor")) {
                        let switcher = $(this).find(".switch");
                        if ($(this).find(".dimslider").length > 0) {
                            status = (status == switchState.off ? switchState.off : switchState.on);
                        }
                        if (status == switchState.off || status == switchState.on) {
                            let title = status == switchState.off ? $.t("Turn On") : $.t("Turn Off");
                            let checked = status == switchState.on ? "checked" : "";
                            if (switcher.length == 0) {
                                let string = '<td class="switch-cell"><label class="switch" title="' + title + '"><input type="checkbox"' + checked + '><span class="slider round"></span></label></td>';
                                bigText.after(string);
                                bigText.hide();
                            }
                            switcher.attr("title", title);
                            switcher.find("input").attr("checked", checked.length > 0);
                        } else if (status == switchState.open || status == switchState.closed) {
                            let title = status == switchState.closed ? $.t("Open Blinds") : $.t("Close Blinds");
                            let checked = status == switchState.open ? "checked" : "";
                            if (switcher.length == 0) {
                                let string = '<td class="switch-cell"><label class="switch" title="' + title + '"><input type="checkbox"' + checked + '><span class="slider round"></span></label></td>';
                                bigText.after(string);
                                bigText.hide();
                            }
                            switcher.attr("title", title);
                            switcher.find("input").attr("checked", checked.length > 0);
                        } else {
                            bigText.children("span").show();
                            switcher.remove();
                        }
                        bigText.attr("data-status", status);
                    }
                }
            }
        }
        if (theme.features.icon_image.enabled === true) {
            var icons = theme.icons;
            for (var i = 0; i < icons.length; i++) {
                if ($("#dashcontent").length == 0) {
                    var deviceItem = $(this).closest("#" + icons[i].idx);
                    var IDX = icons[i].idx;
                } else {
                    var deviceItem = $(this).closest("#light_" + icons[i].idx);
                    var IDX = "light_" + icons[i].idx;
                }
                if (deviceItem.attr("id") === IDX) {
                    if (status == switchState.on) {
                        $(this).find("table tr #img img").attr("src", $(this).find("table tr #img img").attr("src").replace("images/Light48_On.png", "images/" + icons[i].img));
                        $(this).find("table tr #img img").addClass("userOn");
                    } else {
                        $(this).find("table tr #img img").attr("src", $(this).find("table tr #img img").attr("src").replace("images/Light48_Off.png", "images/" + icons[i].img));
                        $(this).find("table tr #img img").addClass("user");
                    }
                }
            }
        }
    });
    if (location.hash == "#/Dashboard" && theme.features.dashboard_camera.enabled === true) {
        cameraPreview(theme.features.dashboard_camera_section.enabled);
    }
}

function cameraPreview(section) {
    if (section === true) {
        if ($("#dashCameras").length == 0) {
            $.ajax({
                url: "json.htm?type=cameras",
                async: false,
                dataType: "json",
                success: function(data) {
                    var compact = false;
                    if ($("section.compact").length > 0) {
                        compact = true;
                    }
                    var html = "<section class='dashCategory" + (compact ? " compact" : "") + "' id='dashCameras'><h2 data-i18n='Cameras'>" + $.t("Cameras") + ":</h2><div class='row divider'>";
                    var activeCam = false;
                    data.result.forEach(function(cam) {
                        if (cam.Enabled === "true") {
                            activeCam = true;
                            var camId = cam.idx;
                            html += "<div class='" + (compact ? "span3" : "span4") + " movable ui-draggable ui-draggable-handle ui-droppable' id='cam_" + camId + "'><div class='item'>";
                            html += "<table id='itemtablecam' class='itemtablesmall'><tbody><tr class='with-cam-preview' data-cam='" + camId + "'>";
                            html += "<td id='name' class='name'>" + cam.Name + "</td>";
                            html += "<td><img class='preview-cam' data-cam='" + camId + "'></td>";
                            html += "</tr></tbody></table>";
                            html += "</div></div>";
                        }
                    });
                    if (activeCam) {
                        html += "</div></section>";
                        $("#dashcontent section:first").before(html);
                        $("tr.with-cam-preview").on("click", function(e) {
                            ShowCameraLiveStream($(this).children("td#name").text(), $(this).attr("data-cam"));
                        });
                    }
                }
            });
        }
    } else {
        $("#bigtext > span > a").each(function() {
            camId = $(this).attr("href").split(/\'/)[3];
            if ($(this).parents("tr.with-cam-preview").length == 0) {
                $(this).parents("tr").attr("data-cam", camId).append('<td><img class="preview-cam" data-cam ="' + camId + '"></td>');
                $(this).parents("tr").attr("data-cam", camId).addClass("with-cam-preview").on("click", function(e) {
                    ShowCameraLiveStream($(this).children("td#name").text(), $(this).attr("data-cam"), $(this).attr("data-cam"));
                });
            }
        });
    }
    if (isDocumentVisible()) {
        $(".preview-cam").attr("src", function() {
            return "camsnapshot.jpg?idx=" + $(this).attr("data-cam") + "&t=" + Date.now();
        }).on("load", function() {
            $(this).parents("tr").css("background-image", "url(" + $(this).attr("src") + ")");
        });
    }
}

function nativeSelectors() {
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

function applyIconsStatus() {
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
            var getviarequire = "../acttheme/js/" + featureName;
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
    $("#searchInput").val("");
    isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (location.hash == "#/Dashboard" && !isMobile || location.hash == "#/LightSwitches" || location.hash == "#/Scenes" || location.hash == "#/Temperature" || location.hash == "#/Weather" || location.hash == "#/Utility") {
        $("#search").removeClass("readonly");
    } else {
        $("#search").addClass("readonly");
    }
    $(".current_page_item:not(:first)").removeClass("current_page_item");
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
    let textmsg = device.Name + " " + language.is + " " + $.t(device.Data);
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
            for (r in data.result) {
                system = message[r].ActiveSystems;
                if (system.includes("browser")) {
                    if (typeof message !== "undefined") {
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

function isDocumentVisible() {
    if (document.visibilityState == "hidden") {
        return false;
    } else {
        return true;
    }
}
