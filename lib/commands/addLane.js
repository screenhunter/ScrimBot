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

		var userExists = false;
		for (var i = 0; i < data.list.length; i++) {
			if (data.list[i].user.id == context.msg.author.id) {
				userExists = true;
				var laneExists = false;
				for (var j = 0; j < data.list[i].lanes.length; j++) {
					if (argv.args.lane.valueOf() == data.list[i].lanes[j].valueOf()) {
						laneExists = true;
					}
				}
				if (laneExists == false) {
					data.list[i].lanes.push(argv.args.lane);
				}
			}
		}
		if (userExists == false)  {
			var obj = {
				user: context.msg.author,
				lanes: [argv.args.lane],
			};
			data.list.push(obj);
		}

		jsonfile.writeFileSync(file, data, {spaces: 4});

		return 'Added \"' + argv.args.lane + '\" to your selected roles!';
	},
	args: [
		lane,
	],
	flags: []
});
