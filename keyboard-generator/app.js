var express = require("express"),
	app = express(),
	http = require("http"),
	server = http.createServer(app),
	fs = require("fs"),
	__dirname = "www",
	io = require("socket.io").listen(server, {
		log: false
	}),
	$ = require("jquery")

var per = 0
setInterval(function() {
	per -= 1
	if(per < 1)per = 0
}, 100)

var online_user = []
var auth_token = null
var temp = 0

server.listen(500)

//幻騰智慧燈泡初始化
$.ajax({
	url: "https://huantengsmart.com/users/sign_in.json",
	type: "POST",
	dataType: "json",
	data: {
		user: {
			email: "hackathon2@huantengsmart.com",
			password: "9bah4o"
		}
	},
	success: function (result) {
		auth_token = result.auth_token

		$.ajax({
			url: "https://huantengsmart.com/bulbs/request_update.json",
			type: "PUT",
			dataType: "json",
			data: {
				data: [
					{
						id: 61,
						turned_on: false,
						brightness: 0,
						hue: 0
					}
				],
				auth_token: auth_token
			}
		})
	}
})

app.configure(function () {
	app.use("/sound", express.static(__dirname + "/sound"))
	app.use("/js", express.static(__dirname + "/js"))
	app.use("/css", express.static(__dirname + "/css"))

	app.get("/", function (req, res) {
		fs.readFile(__dirname + "/index.html", function (err, data) {
			if (err) {
				res.writeHead(500)
				return res.end("Error loading $[1]", "index.html")
			}
			res.writeHead(200)
			res.end(data)
		})
	})
})

io.sockets.on("connection", function (socket) {
	online_user.push(socket.id)
	//使用者離線
	socket.on('disconnect', function () {
		for(var i=0;i<online_user.length;i++) {
			if(online_user[i] == socket.id)online_user.splice(i, 1)
		}
	})

	//當前網頁有哪些使用者
	socket.on("visitor", function (data) {
		socket.emit("visitor", { visitor: online_user.length })
	})

	//資料同步
	socket.on("sync_percent", function (data) {
		socket.emit("sync_percent", { per: per })

		if(Math.floor(per/10) > temp || Math.floor(per/10) < temp) {
			temp = Math.floor(per/10)

			if(temp == 0)turned_on = false
			else turned_on = true
			//幻騰智慧燈泡同步
			$.ajax({
				url: "https://huantengsmart.com/bulbs/request_update.json",
				type: "PUT",
				dataType: "json",
				data: {
					data: [
						{
							id: 61,
							turned_on: turned_on,
							brightness: per/100,
							hue: 1
						}
					],
					auth_token: auth_token
				},
				success: function (res) {
					// console.log(res.success)
				}
			})
		}
	})

	//使用者攻取
	socket.on("desc_percent", function (data) {
		per += 3
		if(per > 100) {
			per = 100
			socket.emit("congraz", {})
		}
	})
})