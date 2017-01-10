var Clapp = require('../modules/clapp-discord');
var lane = require('../arguments/lane.js');
var summoner = require('../arguments/summoner.js');
var jsonfile = require('jsonfile');
var solver = require('javascript-lp-solver');

function determineRoles(roleCount, cache, cacheLocs, lanes, index) {
	if (index == 5)
		return [true];

	var lane = lanes[index]

	if (roleCount[lane].length < 2)
		return [false, lane];

	var fill = []
	for (var i = 0; i < roleCount[lane].length; i++)
		for (var j = i+1; j < roleCount[lane].length; j++) {

			var p1 = roleCount[lane][i]
			var p2 = roleCount[lane][j]
			cache[cacheLocs[lane]] = p1;
			cache[cacheLocs[lane]+5] = p2;
			var s1 = []
			var s2 = []

			for (var k = index+1; k < 5; k++) {

				var playerIndex = roleCount[lanes[k]].indexOf(p1);
				if (playerIndex != -1) {
					roleCount[lanes[k]].splice(playerIndex)
					s1.push(lanes[k])
				}
				playerIndex = roleCount[lanes[k]].indexOf(p2);
				if (playerIndex != -1) {
					roleCount[lanes[k]].splice(playerIndex)
					s2.push(lanes[k])
				}
			}

			var solution = determineRoles(roleCount, cache, cacheLocs, lanes, index+1);
			if (solution[0] == true)
				return [true]
			else {
				fill.concat(solution[1])
				fill = fill.concat(solution[1].filter(function (item) {
					return fill.indexOf(item) < 0;
				}));
			}

			for (var l in s1)
				roleCount[l].push(p1)
			for (var l in s2)
				roleCount[l].push(p2)

			cache[cacheLocs[lane]] = undefined;
			cache[cacheLocs[lane]+5] = undefined;

		}
	return [false, fill];
}

function solve(data, members) {
	var cache = new Array(10);
	var roleCount = {
		"top":[],
		"jung":[],
		"mid":[],
		"adc":[],
		"supp":[]
	}
	var cacheLocs = {
		"top":0,
		"jung":1,
		"mid":2,
		"adc":3,
		"supp":4
	}
	for (var memberid of members) {
		if (data[memberid] === undefined) {
			return data[memberid].username +" hasn't added any lanes!"
		}
		if (data[memberid].lanes.length == 0) {
			return data[memberid].username +" hasn't added any lanes!"
		}

		for (var lane of data[memberid].lanes)
			roleCount[lane].push(memberid)
	}

	var lanes = Object.keys(roleCount).sort(function(a, b){
		return roleCount[a].length-roleCount[b].length
	})

	var solvable = determineRoles(roleCount, cache, cacheLocs, lanes, 0)

	if (solvable[0] == false)
		return solvable

	return cache

}

module.exports = new Clapp.Command({
	name: "createTeams",
	desc: "creates teams from users in a voice chat!",
	fn: (argv, context) => {
	// This output will be redirected to your app's onReply function

		var file = 'data/lanes.json';
		var data = jsonfile.readFileSync(file);

		var model = {
			"optimize": "profit",
			"opType": "min",
			"constraints": {
				"top": {"min": 1},
				"jg": {"min": 1},
				"mid": {"min": 1},
				"adc": {"min": 1},
				"supp": {"min": 1}
			},
			"variables": {}
		}
		var channel = context.channels.find('name', argv.args.voicechannel);
		if (channel == null)
			return '\"' + argv.args.voicechannel + '\" voice channel not found'

		var members = channel.members.keyArray()
		var problems = []
		for (var memberid of members) {
			if (Object.keys(data).indexOf(memberid) == -1) {
				problems.push(memberid)
				members.splice(members.indexOf(memberid))
			} else if (data[memberid].lanes.length == 0) {
				problems.push(memberid)
				members.splice(members.indexOf(memberid))
			}
		}


		if (problems.length > 0) {
			var s = "The following have not entered any lanes!\n";
			for (var p of problems) {
				s += channel.members.get(p).user.username + '\n'
			}
			return s;
		}

		var solution = solve(data, members)
		if (solution[0] == false)
			return 'not enough: ' + solution[1]

		var team1 = "";
		var team2 = "";
		for (var i = 0; i < 5; i++) {
			team1 += solution[i] + '\n'
			team2 += solution[i+5] + '\n'
		}

		return "Team 1" + team1 + "Team 2\n" + team2;
	},
	args: [
		{
	      name: 'voicechannel',
	      desc: 'the name of the voice channel being used',
	      type: 'string',
	      required: true
	    }
	],
	flags: []
});
