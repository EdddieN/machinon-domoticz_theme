var branch = "master";

setTimeout(update, 5000);
function update() {
    $.ajax({
        url: "https://raw.githubusercontent.com/EdddieN/machinon-domoticz_theme/" + branch + "/theme.json",
        async: false,
        dataType: "json",
        success: function(data) {
            gitVersion = data.version;
            if (theme.version !== gitVersion) {
                newVersionText = "Machinon version " + data.version + " " + language.is_available + '! <a href="https://github.com/EdddieN/machinon-domoticz_theme/tree/' + branch + '" target="_blank">' + language.click_here + "</a>";
                notify(newVersionText, 0);
            }
        }
    });
}
