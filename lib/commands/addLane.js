var Clapp = require('../modules/clapp-discord');
var lane = require('../arguments/lane.js');
var summoner = require('../arguments/summoner.js');
var jsonfile = require('jsonfile');

module.exports = new Clapp.Command({
	name: "addLane",
	desc: "adds a lane to a user",
	fn: (argv, context) => {
	// This output will be redirected to your app's onReply function

		var file = 'data/lanes.json';
		var data = jsonfile.readFileSync(file);
		var id = context.msg.author.id
		if (data[id] !== undefined) {
			if (data[id].lanes.indexOf(argv.args.lane) == -1)
				data[id].lanes.push(argv.args.lane);
			else
				return 'Already added that lane!'
		} else {
			data[id] = {
				"username":context.msg.author.username,
				"lanes":[argv.args.lane]
			}
		}

		jsonfile.writeFileSync(file, data, {spaces: 4});

		return 'Added \"' + argv.args.lane + '\" to your selected roles!';
	},
	args: [
		lane
	],
	flags: []
});
