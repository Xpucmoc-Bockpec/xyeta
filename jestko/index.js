const VK = require("vk-call").vk
const request = require("request")

var ts = Date.now() / 1000 | 0

var api = new VK({
	token:		"пошел нахуй фраер ты специально",
	version:	"5.68"
})
// https://oauth.vk.com/authorize?client_id=4531754&display=mobile&redirect_uri=blank.html&scope=messages,offline&response_type=token

const triggers = [
	/пизд((е|e)ц|(a|а))/gi,
	/(е|e)б(a|а)ть/gi,
	/(о|o|а|a)(x|х)(y|у)(е|e)ть/gi,
	/(е|e)б(a|а)нн?ый/gi,
	/наебал|обманул|кинул/gi,
	/за что/gi,
	/бляя/gi,
	/н(а|a)(х|x)(у|y)й/gi,
	/х(y|у)(е|e)(с|c)(о|o)(с|c)/gi,
	/д(о|o|а|a)лб(о|o|а|a)(е|e|ё)б/gi,
	/(y|у)(е|e)б(ищ(е|e)|(а|a)н)/gi,
	/н(е|e)ми(р|p)\s?((у|y)м(е|e)(р|p)|((((о|o)б(о|o))|у)(с|c)((р|p)(а|a)л|(с|c)(а|a)л)(с|c)я))/gi,
	/д(а|a)\s?(э|е|e)т(о|o|a|а)\s?ж(е|e|ё|о|o)(с|c)т?к/gi,
	/п(р|p)ик(о|o)л/gi
]

const ignored = [202905427, 410965726, 2000000056, 2000000042]

const responces = [
	"doc202905427_449936122",
	"doc202905427_449936332",
	"doc202905427_449936338",
	"doc202905427_449936343",
	"doc202905427_449936348",
	"doc202905427_449936355",
	"doc202905427_449936462",
	"doc202905427_449936475",
	"doc202905427_449938098"
]

function getMessages(longpoll) {
	var options = {
		url: `https://${longpoll.server}?act=a_check&key=${longpoll.key}&ts=${ts}&wait=90&mode=8&version=2`,
		timeout: 90000
	}
	return new Promise((resolve, reject) => {
		request(options, (error, response, body) => {
			if (!error) {
				try {
					resolve(JSON.parse(body))
				}
				catch(e) {
					reject(e)
				}
			}
			else reject(error)
		})
	})
}


void function isHard() {
	getLongPoolServer().then(response => {
		return getMessages(response)
	})
	.then(response => {
		ts = response.ts
		for (var i in response.updates) {
			var event = response.updates[i][0],
				flags = response.updates[i][2],
				user_id = response.updates[i][3],
				message = response.updates[i][5]

			if (!isIgnoredUser(user_id)) {
				if (event == 4 && !(flags & 2)) {
					for (var j in triggers) {
						if (!!message.match(triggers[j])) {
							Affirmative(user_id)
							break
						}
					}
				}
			}
		}
		isHard()
	})
	.catch(error => {
		console.error(error)
		isHard()
	})
}()

function isIgnoredUser(user_id) {
	return ignored.indexOf(user_id) == -1 ? false : true
}

function Affirmative(user_id) {
	var options = {
		attachment: responces[Math.floor(Math.random() * responces.length)]
	}
	if (user_id > 2000000000) options.peer_id = user_id
	else options.user_id = user_id
	
	api.call("messages.send", options)
}

function getLongPoolServer() {
	return new Promise(function(resolve, reject) {
		api.call("messages.getLongPollServer", { lp_version: 2 })
		.then(response => {
			ts = response.ts
			resolve(response)
		})
		.catch(error => reject(error))
	})
}
