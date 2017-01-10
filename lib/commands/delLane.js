var Clapp = require('../modules/clapp-discord');
var lane = require('../arguments/lane.js');
var summoner = require('../arguments/summoner.js');
var jsonfile = require('jsonfile');

module.exports = new Clapp.Command({
	name: "delLane",
	desc: "deletes a lane a user has selected",
	fn: (argv, context) => {
	// This output will be redirected to your app's onReply function

		var file = 'data/lanes.json';
		var data = jsonfile.readFileSync(file);

		if (data[context.msg.author.id] === undefined) {
			return "You haven't added any lanes!"
		}

		if (data[context.msg.author.id].lanes.length == 0) {
			return "You haven't added any lanes!"
		}
		var index = data[context.msg.author.id].lanes.indexOf(argv.args.lane)
		if (index == -1) {
			return argv.args.lane + " is not a selected lane of yours"
		}

		data[context.msg.author.id].lanes.splice(index);

		jsonfile.writeFileSync(file, data, {spaces: 4});

		return "lane deleted"
	},
	args: [
		lane
	],
	flags: []
});
