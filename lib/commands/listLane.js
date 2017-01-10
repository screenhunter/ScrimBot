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

		if (data[context.msg.author.id] === undefined || data[context.msg.author.id].lanes.length == 0) {
			return "You haven't added any lanes!"
		}
		
		for (var lane in data[context.msg.author.id].lanes)
			returnString += data[context.msg.author.id].lanes[lane] + "\n";

		return returnString
	},
	args: [],
	flags: []
});
