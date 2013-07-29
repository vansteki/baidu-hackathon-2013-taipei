$.ajax({
	type: "POST",
	url: "/set",
	dataType: "json",
	data: {
		turned_on: false,
		brightness: 0,
		hue: 0
	},
	success: function (result) {
		console.log(result)
	}
})

var map = {
	sunny: { brt: 0.05, hue: 0.05 },
	rain: { brt: 0.1, hue: 0.4 },
	snow: { brt: 0.8, hue: 1.0 },
	desert: { brt: 0.05, hue: 0 }
}
$(".content").click(function () {
	var data = map[$(this).prop("id")]
	$.ajax({
		type: "POST",
		url: "/set",
		dataType: "json",
		data: {
			turned_on: true,
			brightness: data.brt,
			hue: data.hue
		},
		success: function (result) {
			console.log(result)
		}
	})
})
$("#home").click(function() {
	var $body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body');
	$body.animate({
		scrollTop: 0
	}, 1000);
})
$("#about").click(function() {
	var $body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body');
	$body.animate({
		scrollTop: $("#sec1").offset().top
	}, 1000);
})
$("#scene").click(function() {
	var $body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body');
	$body.animate({
		scrollTop: $("#sec2").offset().top
	}, 1000);
})