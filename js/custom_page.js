//Custom page menu

$('#appnavbar li:not(.clcustommenu)').remove('.dropdown');
var mainMenu = $('#appnavbar');
var customPage = mainMenu.find('#customPage');
if (mainMenu.length && customPage.length == 0 ) {
    mainMenu.append('<li class="divider-vertical"></li><li id="customPage"><a class="lcursor"><img src="images/setup.png"><span data-i18n="' + theme.button_name + '">' + theme.button_name + '</span></a></li>');
}
$('#customPage').click(function() {
var htmlcontent = '';
htmlcontent += '<iframe class="cIFrameLarge" id="IMain" src="' + theme.custom_url + '"></iframe>';
$('#main-view').html(htmlcontent);
});
