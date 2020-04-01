function showThemeSettings() {
    if (!$("#tabsystem").length) {
        setTimeout(showThemeSettings, 1000);
        return;
    }
    $("#emailsetup").prepend("<br/>");
    $("#emailsetup").appendTo("#notifications");
    $("#tabs li a[data-target='#tabemail']").parent().remove();
    if (!$("#tabtheme").length) {
        $('<li id="themeTabButton"><a data-target="#tabtheme" data-toggle="tab" data-i18n="Theme">Theme</a></li>').appendTo("#tabs");
        $("#tabs li:not(.pull-right)").click(function() {
            if ($(window).width() < 480) {
                $(this).siblings().show();
            }
        });
        $("#acceptnewhardwaretable > tbody > tr:nth-child(1) > td > button").click(function() {
            notify(language.allow_new_hardware, 2);
        });
        $("#tabs > li.pull-right > a").click(function() {
            notify(language.domoticz_settings_saved, 2);
        });
        $("#tabs").i18n();
        $("#my-tab-content").append('<div class="tab-pane" id="tabtheme"><section id="theme">Loading..</section></div>');
        $("#my-tab-content #theme").load("acttheme/themesettings.html", loadSettingsHTML);
    }
}

function setupIcons() {
    var code = JSON.stringify(theme.icons);
    if (typeof code === "undefined") {
        bootbox.alert({
            className: "rubberBand animated",
            message: '<p>Please reset the theme by clicking here:</p><p><a onClick="resetTheme(); return false;" href=""><button class="btn btn-info">Reset theme</button></a></p><p>(or find the theme reset button on the theme settings page)<p>',
            title: "Congratulations on the theme upgrade!"
        });
    } else {
        code = code.replace("[", "").replace("]", "");
        $("#textareaIcons").val(code);
    }
}

function addImgInsteadofIcon() {
    try {
        JSON.parse("[" + $("#tabtheme #textareaIcons").val() + "]");
    } catch (e) {
        bootbox.alert({
            className: "rubberBand animated",
            message: "<p>Data not saved!</p><p>Please check the syntax. Be sure you didn't add a comma at the end! <p>",
            title: "Syntax error"
        });
        return false;
    }
    $("#tabtheme #textareaIcons").each(function() {
        var value = $(this).val();
        value = "[" + value + "]";
        theme[this.name] = JSON.parse(value);
    });
    localStorage.setObject(themeFolder + ".themeSettings", theme);
    storeUserVariableThemeSettings("update");
}

function loadSettingsHTML() {
    if (typeof branch !== "undefined" && branch == "beta") {
        $("#themeversion").text(theme.version + " " + branch);
    } else {
        $("#themeversion").text(theme.version);
    }
    $("#themefolder").text(themeFolder);
    $("#themesettings").i18n();
    if (992 >= window.innerWidth) {
        $("#themevar28").prop("disabled", true);
        $('label[for="themevar28"]').addClass("disabledText");
    }
    if (1200 >= window.innerWidth) {
        $("#themevar30").prop("disabled", true);
        $('label[for="themevar30"]').addClass("disabledText");
    }
    setupIcons();
    $("#tabtheme input:checkbox").each(function() {
        if (typeof theme.features[this.value] !== "undefined") {
            if (theme.features[this.value].enabled === true) {
                $(this).prop("checked", true);
            } else if (theme.features[this.value].enabled === false) {
                $(this).prop("checked", false);
            }
        } else {
            if (typeof theme.upgradeAlerted === "undefined") {
                bootbox.alert({
                    className: "rubberBand animated",
                    message: '<p>Please reset the theme by clicking here:</p><p><a onClick="resetTheme(); return false;" href=""><button class="btn btn-info">Reset theme</button></a></p><p>(or find the theme reset button on the theme settings page)<p>',
                    title: "Congratulations on the theme upgrade!"
                });
                if (isEmptyObject(theme) === false) {
                    localStorage.setObject(themeFolder + ".themeSettings", theme);
                }
            }
        }
        if ($(this).not(":checked") && $(this).is(".parentrequired")) {
            $(this).siblings().each(function() {
                if ($(this).is(".parentrequiredchild")) {
                    $(this).prop("disabled", true);
                }
            });
        }
        if ($(this).is(":checked") && $(this).is(".parentrequired")) {
            $(this).siblings().each(function() {
                if ($(this).is(".parentrequiredchild")) {
                    $(this).prop("disabled", false);
                }
            });
        }
    });
    $('#tabtheme input[type="number"]').each(function() {
        var value = theme[this.name];
        $(this).val(value);
    });
    $('#tabtheme input[type="text"]').each(function() {
        var value = theme[this.name];
        $(this).val(value);
    });
    $("#tabtheme select").each(function() {
        var value = theme[this.name];
        $(this).val(value);
    });
    $("#tabtheme input:checkbox").click(function() {
        if ($(this).is(":checked")) {
            theme.features[this.value].enabled = true;
            loadThemeFeatureFiles(this.value);
        } else {
            if ($(this).is(".parentrequired")) {
                $(this).siblings().each(function() {
                    if ($(this).is(".parentrequiredchild")) {
                        $(this).attr("checked", false);
                        var childName = $(this).val();
                        if (typeof theme.features[childName] !== "undefined") {
                            unloadThemeFeatureFiles(childName);
                            theme.features[childName].enabled = false;
                        }
                    }
                });
            }
            theme.features[this.value].enabled = false;
            unloadThemeFeatureFiles(this.value);
        }
        if ($(this).not(":checked") && $(this).is(".parentrequired")) {
            $(this).siblings().each(function() {
                if ($(this).is(".parentrequiredchild")) {
                    $(this).prop("disabled", true);
                }
            });
        }
        if ($(this).is(":checked") && $(this).is(".parentrequired")) {
            $(this).siblings().each(function() {
                if ($(this).is(".parentrequiredchild")) {
                    $(this).prop("disabled", false);
                }
            });
        }
        localStorage.setObject(themeFolder + ".themeSettings", theme);
        console.log(theme.name + " - theme settings saved");
    });
    $("#saveSettingsButton").click(function() {
        $('#tabtheme input[type="number"]').each(function() {
            var value = $(this).val();
            theme[this.name] = value;
        });
        $('#tabtheme input[type="text"]').each(function() {
            var value = $(this).val();
            theme[this.name] = value;
            console.log(value);
        });
        $("#tabtheme select").each(function() {
            var value = $(this).val();
            theme[this.name] = value;
        });
        localStorage.setObject(themeFolder + ".themeSettings", theme);
        storeUserVariableThemeSettings("update");
        notify(language.theme_settings_saved, 2);
        location.reload();
    });
    $("#themeResetButton").click(function() {
        bootbox.dialog({
            title: '<font color="red">' + language.warning + "!</font>",
            size: "small",
            className: "rubberBand animated",
            message: "<p>" + language.resetTheme_message + "?</p>",
            buttons: {
                cancel: {
                    label: $.t("Cancel"),
                    className: "btn-info",
                    callback: function() {
                        console.log("Custom cancel button clicked");
                    }
                },
                clear: {
                    label: language.clear_localstorage,
                    className: "btn-warning",
                    callback: function() {
                        notify(language.storage_removed, 2);
                        if (typeof Storage !== "undefined") {
                            localStorage.removeItem(themeFolder + ".themeSettings");
                        }
                        location.reload();
                    }
                },
                ok: {
                    label: $.t("Reset"),
                    className: "btn-danger",
                    callback: function() {
                        notify(language.theme_restored, 2);
                        resetTheme();
                    }
                }
            }
        });
    });
}

function loadSettings() {
    if (typeof Storage !== "undefined") {
        if (localStorage.getItem(themeFolder + ".themeSettings") === null) {
            $.ajax({
                url: "acttheme/theme.json",
                cache: false,
                async: false,
                dataType: "json",
                success: function(localJson) {
                    theme = localJson;
                    themeName = theme.name;
                    if (isEmptyObject(theme) === false) {
                        localStorage.setObject(themeFolder + ".themeSettings", theme);
                        setTimeout(function() {
                            location.reload();
                        }, 3000);
                    }
                    console.log(themeName + " - local theme settingsfile loaded and saved to localStorage");
                }
            });
        } else {
            theme = localStorage.getObject(themeFolder + ".themeSettings", theme);
            themeName = theme.name;
            console.log(themeName + " - theme settings was already found in the browser.");
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
    loadedThemeCSSandJS = true;
}

function loadThemeFeatureFiles(featureName) {
    var files = theme.features[featureName].files;
    var arrayLength = files.length;
    for (var i = 0; i < arrayLength; i++) {
        if (files[i].split(".").pop() == "js") {
            var getviarequire = "./acttheme/js/" +  files[i] + "?" + themeName;
            requirejs([ getviarequire ]);
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


var unableCreateUserVariable = false;

function checkUserVariableThemeSettings() {
    $.ajax({
        url: "json.htm?type=command&param=getuservariables",
        async: true,
        dataType: "json",
        success: function(data) {
            if (data.status == "ERR") {
                $.get("json.htm?type=command&param=addlogmessage&message=Theme Error - The theme was unable to load your preferences from Domoticz.");
            }
            if (data.status == "OK") {
                var didDomoticzHaveSettings = false;
                var featuresVarName = "theme-" + themeFolder + "-features";
                var customVarName = "theme-" + themeFolder + "-custom";
                $.each(data.result, function(variable, value) {
                    if (value.Name == featuresVarName) {
                        console.log(themeName + " - found theme feature settings in Domoticz database (user variable Idx: " + value.idx + ")");
                        didDomoticzHaveSettings = true;
                        theme.userfeaturesvariable = value.idx;
                        getFeatureThemeSettings(value.idx);
                    }
                    if (value.Name == customVarName) {
                        console.log(themeName + " - found theme feature settings in Domoticz database (user variable Idx: " + value.idx + ")");
                        didDomoticzHaveSettings = true;
                        theme.usercustomsvariable = value.idx;
                        getCustomThemeSettings(value.idx);
                    }
                });
                if (didDomoticzHaveSettings === false) {
                    if (unableCreateUserVariable == false) {
                        storeUserVariableThemeSettings("add");
                    } else {
                        storeUserVariableThemeSettings("update");
                    }
                }
            }
        },
        error: function() {
            console.log("The theme was unable to check if Domoticz had theme settings. Permission denied? Still on login page? No connection? Stopping..");
        }
    });
}

function storeUserVariableThemeSettings(action) {
    if (themeFolder !== "undefined") {
        var settings = [];
        $.each(theme.features, function(key, feature) {
            if (feature.enabled === true) {
                settings.push(feature.id);
            }
        });
        var variableURL = "json.htm?type=command&param=" + action + "uservariable&vname=theme-" + themeFolder + "-features&vtype=2&vvalue=" + JSON.stringify(settings);
        $.ajax({
            url: variableURL,
            async: false,
            dataType: "json",
            success: function(data) {
                if (data.status == "ERR") {
                    bootbox.alert("Unable to create or update theme settings uservariable, Try to reset the theme");
                    unableCreateUserVariable = true;
                }
                if (data.status == "OK") {
                    console.log(themeName + " - theme settings uservariable is updated");
                }
            },
            error: function() {
                console.log(themeName + " - Ajax error wile creating or updating user variable in Domotcz.");
            }
        });
        var custom = [];
        custom.push(theme.standby_after);
        custom.push(theme.button_name);
        custom.push(theme.custom_url);
        custom.push(theme.logo);
        custom.push(theme.icons);
        custom.push(theme.background_img);
        custom.push(theme.background_type);
        variableURL = "json.htm?type=command&param=" + action + "uservariable&vname=theme-" + themeFolder + "-custom&vtype=2&vvalue=" + JSON.stringify(custom);
        $.ajax({
            url: variableURL,
            async: false,
            dataType: "json",
            success: function(data) {
                if (data.status == "ERR") {
                    bootbox.alert("Unable to create or update theme settings uservariable, Try to reset the theme");
                }
                if (data.status == "OK") {
                    console.log(themeName + " - theme settings uservariable is updated");
                }
            },
            error: function() {
                console.log(themeName + " - Ajax error wile creating or updating user variable in Domotcz.");
            }
        });
    } else {
        return;
    }
}

function getFeatureThemeSettings(idx) {
    $.ajax({
        url: "json.htm?type=command&param=getuservariable" + "&idx=" + idx,
        async: true,
        dataType: "json",
        success: function(data) {
            if (data.status == "ERR") {
                console.log(themeName + " - Although they seem to exist, there was an error loading theme preferences from Domoticz");
                $.get("json.htm?type=command&param=addlogmessage&message=Theme Error - The theme was unable to load your user variable.");
                userVariableThemeLoaded = false;
            }
            if (data.status == "OK") {
                var themeSettingsFromDomoticz = JSON.parse(data.result[0].Value);
                $.each(theme.features, function(key, feature) {
                    if ($.inArray(feature.id, themeSettingsFromDomoticz) > -1) {
                        theme.features[key].enabled = true;
                    } else {
                        theme.features[key].enabled = false;
                    }
                });
                localStorage.setObject(themeFolder + ".themeSettings", theme);
                userVariableThemeLoaded = true;
            }
        },
        error: function() {
            console.log(themeName + " - ERROR reading feature settings from Domoticz for theme" + theme.name + "from user variable #" + idx);
            userVariableThemeLoaded = false;
        }
    });
}

function getCustomThemeSettings(idx) {
    $.ajax({
        url: "json.htm?type=command&param=getuservariable" + "&idx=" + idx,
        async: true,
        dataType: "json",
        success: function(data) {
            if (data.status == "ERR") {
                console.log(themeName + " - Although they seem to exist, there was an error loading theme preferences from Domoticz");
                $.get("json.htm?type=command&param=addlogmessage&message=Theme Error - The theme was unable to load your user variable.");
                userVariableThemeLoaded = false;
            }
            if (data.status == "OK") {
                var customThemeSettings = JSON.parse(data.result[0].Value);
                theme.standby_after = customThemeSettings[0];
                theme.button_name = customThemeSettings[1];
                theme.custom_url = customThemeSettings[2];
                theme.logo = customThemeSettings[3];
                theme.icons = customThemeSettings[4];
                theme.background_img = customThemeSettings[5];
                theme.background_type = customThemeSettings[6];
                localStorage.setObject(themeFolder + ".themeSettings", theme);
                userVariableThemeLoaded = true;
            }
        },
        error: function() {
            console.log(themeName + " - ERROR reading feature settings from Domoticz for theme" + theme.name + "from user variable #" + idx);
            userVariableThemeLoaded = false;
        }
    });
}

function resetTheme() {
    if (typeof theme.userfeaturesvariable !== "undefined") {
        var deleteFeaturesURL = "json.htm?type=command&param=deleteuservariable&idx=" + theme.userfeaturesvariable;
        $.ajax({
            url: deleteFeaturesURL,
            async: false,
            dataType: "json",
            success: function(data) {
                console.log(themeName + " - server responded " + data.status + " while deleting user variable that stored feature settings");
            },
            error: function() {
                console.log(themeName + " - The theme was unable to delete the user variable in Domoticz that holds the theme feature settings");
            }
        });
    }
    if (typeof theme.usercustomsvariable !== "undefined") {
        var deleteCustomURL = "json.htm?type=command&param=deleteuservariable&idx=" + theme.usercustomsvariable;
        $.ajax({
            url: deleteCustomURL,
            async: false,
            dataType: "json",
            success: function(data) {
                console.log(themeName + " - server responded " + data.status + " while deleting user variable that stored custom settings");
            },
            error: function() {
                console.log(themeName + " - The theme was unable to delete the user variable in Domoticz that holds the theme feature settings");
            }
        });
    }
    if (typeof Storage !== "undefined") {
        localStorage.removeItem(themeFolder + ".themeSettings");
    }
    $.get("json.htm?type=command&param=addlogmessage&message=" + themeFolder + " theme reset to defaults");
    location.reload();
}

Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
};

Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
};

function isEmptyObject(obj) {
    for (var prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
            return false;
        }
    }
    return true;
}
