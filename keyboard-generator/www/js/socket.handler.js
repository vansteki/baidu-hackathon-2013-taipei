var per = 0
var hostname = "192.168.1.199:500"

var socket = io.connect("http://" + hostname, {
	"force new connection": true
});

socket.on("connect", function () {
	console.log("Connected to server!")
	//定時請求在線使用者與百分比
	setInterval(function() {
		socket.emit("visitor", {})
		socket.emit("sync_percent", { per: per })
	}, 100)
})

socket.on("visitor", function (data) {
	$("#people").text("目前有"+data.visitor+"個人在愛地球")
})

socket.on("sync_percent", function (data) {
	per = data.per
	syncPercent()
})

socket.on("congraz", function (data) {
	$("#prize").show()
	$("#sound").get(0).play()
})

socket.on("disconnect", function () {
	$("#people").text("伺服器維護中")
	console.log("Lost connection!")
})

var syncPercent = function () {
	$("#per").text(per+"%")
	$("#mask").css("height", 2.98*per+"px")
};