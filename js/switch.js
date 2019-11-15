function setDeviceSwitch(idx, status) {
    switchState = {
        on: $.t("On"),
        off: $.t("Off"),
        open: $.t("Open"),
        closed: $.t("Closed")
    };

    let tr = "tr[data-idx='" + idx + "']";
    let switcher = $(tr).find(".switch");
    if ($(tr).find(".dimslider").length > 0) {
        status = (status == switchState.off ? switchState.off : switchState.on);
        $(tr).find(".input").css("margin-top", "20px");
    }
    var checked = title = "";
    if (status === switchState.off  || status === 'Off' || status === switchState.closed || status === 'Closed')
        checked = "";
    else
        checked = "checked";

    /* Check if switch exists --> create or update */
    if (switcher.length == 0) {
        $(tr).find("#status").hide();
        let string = '<td class="input"><label class="switch" title="' + title + '"><input type="checkbox"' + checked + '><span class="slider round"></span></label></td>';
        $(tr).append(string);
        $(tr).find(".switch").on("click", function(e) {
            e.preventDefault();

            if ($(tr).parents("#dashScenes").length > 0 || $(tr).parents("#scenecontent").length > 0) {
                /* Scenes */
                if ($(this).find("input").prop("checked")) {
                    $(tr).find("#img2 > img").click();
                } else {
                    $(tr).find("#img1 > img").click();
                }
            } else {
                /* Switches */
                $(tr).find("#img > img").click();
            }
        });
    } else {
        switcher.find("input").prop("checked", (checked.length > 0));
    }
}
