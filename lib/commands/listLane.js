var Clapp = require('../modules/clapp-discord');
var lane = require('../arguments/lane.js');
var summoner = require('../arguments/summoner.js');
var jsonfile = require('jsonfile');

module.exports = new Clapp.Command({
	name: "listLane",
	desc: "lists the lanes a user has selected",
	fn: (argv, context) => {
	// This output will be redirected to your app's onReply function

		var file = 'data/lanes.json';
		var data = jsonfile.readFileSync(file);

		var returnString = 'Your selected roles are:\n';

		for (var i = 0; i < data.list.length; i++) {
			if (data.list[i].user.id == context.msg.author.id) {
				for (var j = 0; j < data.list[i].lanes.length; j++) {
					returnString += data.list[i].lanes[j] + '\n';
				}
			}
		}

		return returnString;
	},
	args: [],
	flags: []
});
