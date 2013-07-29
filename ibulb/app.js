var express = require("express"),
	app = express(),
	http = require("http"),
	server = http.createServer(app),
	fs = require("fs"),
	__dirname = "www",
	$ = require("jquery")

server.listen(501)

app.configure(function () {
	app.use("/js", express.static(__dirname + "/js"))
	app.use("/css", express.static(__dirname + "/css"))
	app.use(express.bodyParser());
	app.post("/set", function (req, res) {
		var onoff = req.body.turned_on
		var brt = parseFloat(req.body.brightness)
		var hue = parseFloat(req.body.hue)
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
				var auth_token = result.auth_token
				$.ajax({
					url: "https://huantengsmart.com/bulbs/request_update.json",
					type: "PUT",
					dataType: "json",
					data: {
						data: [
							{
								id: 61,
								turned_on: onoff,
								brightness: brt,
								hue: hue
							}
						],
						auth_token: auth_token
					},
					success: function (done) {
						// console.log(done.success)
					}
				})
			}
		})
		res.end()
	})
	app.get(["/", "/index.html"], function (req, res) {
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