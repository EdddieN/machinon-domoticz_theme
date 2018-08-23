/* functions.js */

function enableThemeFeatures()
{
    // load all JS and CSS files
    $.each(theme.features, function(key,feature){
        if(feature.enabled === true){
            if(feature.files.length > 0){
                loadThemeFeatureFiles(key);
            }
        }
    });
      
    console.log(themeName + " - feature files is loaded.");
    loadedThemeCSSandJS = true;
}

function loadThemeFeatureFiles(featureName) {
   
    // get file list from theme settings object
    var files = theme.features[featureName].files;
    var arrayLength = files.length;
    for (var i = 0; i < arrayLength; i++) {
        if(files[i].split('.').pop() == "js"){
            console.log("THEME JS - loading javascript for " + featureName + " feature");
            var getviarequire = "../acttheme/js/" + featureName;
            requirejs([getviarequire], function(util) {
                console.log(themeName + " - Javascript loaded by RequireJS");
            });
        }
        if(files[i].split('.').pop() == "css"){
            var CSSfile = "" + baseURL + "/acttheme/css/" + files[i] + "?" + themeName;
            var fileref = document.createElement("link");
            fileref.setAttribute("rel", "stylesheet");
            fileref.setAttribute("type", "text/css");
            fileref.setAttribute("href", CSSfile);
            document.getElementsByTagName("head")[0].appendChild(fileref);
        }
    }
}

function unloadThemeFeatureFiles(featureName)
{
    $('head link[href*=' + featureName + ']').remove();
    $('head script[src*=' + featureName + ']').remove();
}
