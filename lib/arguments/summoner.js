var Clapp = require('../modules/clapp-discord');

module.exports = new Clapp.Argument({
	name: "lane",
		desc: "Your summoner name!",
		type: "string",
		required: true,
		validations: [
			{
				errorMessage: "summoner",
				validate: value => {
					return value.length > 1;
				}
			}
		]
	});
