var $burger = $('#burger-icon');
var $close = $('#close-icon');
var $container = $('#container');
var $menu = $('#left-menu');
var $links = $('#left-menu li');
var $cookieWarning = $('#cookie-warning');

window.addEventListener('scroll', () => {
	if (window.pageYOffset > 300) {
		$cookieWarning.fadeOut();
	}
})

$burger.click(function() {
	$(this).animate({
		opacity: 0
	}, 300);
	$menu.animate({
		left: 330,
		opacity: 1
	}, 300);
	$container.animate({
		left: 330
	}, 300);
});

$close.click(function() {
	$burger.animate({
		opacity: 1
	}, 300);
	$menu.animate({
		left: 0,
		opacity: 0
	}, 300);
	$container.animate({
		left: 0
	}, 300);
});

$links.click(function() {
	$burger.animate({
		opacity: 1
	}, 300);
	$menu.animate({
		left: 0,
		opacity: 0
	}, 300);
	$container.animate({
		left: 0
	}, 300);
});

$('header').eq(0).click(function (e) {
	var name = e.toElement.nodeName;
	if (name !== 'A' && name !== 'I') {
		$(window).scrollTop(0);
	}
});
