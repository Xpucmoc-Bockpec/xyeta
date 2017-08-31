const Steam = require("steam")
const steamClient = new Steam.SteamClient()
const steamUser = new Steam.SteamUser(steamClient)
const steamFriends = new Steam.SteamFriends(steamClient)

const readline = require("readline").createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: false
})

var account = {
	login: "mx22873",
	password: "голова дай денег",
	loggedIn: false
}

readline.on("line", (line) => {
	if (account.loggedIn) {
		steamUser.gamesPlayed({})
		steamUser.gamesPlayed({
			games_played: [{
				game_id: parseInt(line)
			}]
		})
	}
	else {
		steamUser.logOn({
			account_name:		account.login,
			password:			account.password,
			two_factor_code:	line
		})
	}
})

steamClient.connect()

steamClient.on("connected", () => {
	console.log("вводи код долбоеб дрянь")
})

steamClient.on("logOnResponse", (e) => {
	if (e.eresult == 1) {
		console.log("id игры")
		account.loggedIn = true
		steamFriends.setPersonaState(Steam.EPersonaState.Online)
	}
	else console.log("ты ебанутый неправильно ввел СУКА")
})

steamClient.on("error", (e) => {
	console.log(e)
})
