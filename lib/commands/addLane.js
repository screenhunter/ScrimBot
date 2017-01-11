var Clapp = require('../modules/clapp-discord');
var lane = require('../arguments/lane.js');
var summoner = require('../arguments/summoner.js');
var jsonfile = require('jsonfile');

function userExistsCallback(context, lane, exists) {
	var db = context.database
	var id = context.msg.author.id
	if (exists) {
		db.ref('users/'+id).once('value', function(snapshot) {
			if (snapshot.val()["lanes"].indexOf(lane) == -1) {
				db.ref('users/'+id).update()
			}
		});
	} else {
		alert('user ' + userId + ' does not exist!');
	}
}

function writeUserData(argv, context) {

	var db = context.database
	var id = context.msg.author.id

	db.ref('users/' + id).once('value', function(snapshot) {
		var exists = (snapshot.val() !== null);
		userExistsCallback(context, argv.args.lane, exists);
	});

	db.ref('users/' + id).set({
		"username": username,
		"lanes": lanes,
	});
}

module.exports = new Clapp.Command({
	name: "addLane",
	desc: "adds a lane to a user",
	fn: (argv, context) => {
	// This output will be redirected to your app's onReply function

		var file = 'data/lanes.json';
		var data = jsonfile.readFileSync(file);
		context.database()
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
