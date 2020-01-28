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

function setLogo() {
    let containerLogo = '<header class="logo"><div class="container-logo">';
    if (theme.logo && theme.logo.length) {
        containerLogo += '<img class="header__icon" src="acttheme/images/' + theme.logo + '"';
        $("<style>#login:before {content: url(../images/" + theme.logo + ") !important;}</style>").appendTo("head");
    } else {
        containerLogo += '<img class="header__icon" src="acttheme/images/logo.png">';
        $("<style>#login:before {content: url(../images/logo.png) !important;}</style>").appendTo("head");
    }
    containerLogo += "</div></header>";
    $(containerLogo).insertBefore(".navbar-inner");
}

function setSearch() {
    $('<div id="search"><input type="text" id="searchInput" autocomplete="off" onkeyup="searchFunction()" placeholder="' + language.type_to_search + '" title="' + language.type_to_search + '"><i class="ion-md-search"></i></div>').appendTo(".container-logo");
    window.addEventListener("keydown",function (e) {
        if (e.keyCode === 114 || (e.ctrlKey && e.keyCode === 70)) {
            $("#searchInput").focus();
            e.preventDefault();
        }
    })
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
            $("#iconsmain #fileupload").on("change", function() {
                $(this).next().click();
                $(this).val("");
            });
        }
    }, 100);
}

function ajaxSuccessCallback(event, xhr, settings) {
    setPageTitle();
    if (theme.features.notification.enabled === true && $("#msg").length == 0) {
        displayNotifications();
    }
    if (settings.url.startsWith("json.htm?type=devices") || settings.url.startsWith("json.htm?type=scenes")) {
        let counter = 0;
        let intervalId = setInterval(function() {
            if ($("#main-view").find(".item").length > 0) {
                setAllDevicesFeatures();
                setAllDevicesIconsStatus();
                clearInterval(intervalId);
            } else {
                counter++;
                if (counter >= 5) {
                    clearInterval(intervalId);
                }
            }
            setDevicesNativeSelectorForMobile();
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
}
