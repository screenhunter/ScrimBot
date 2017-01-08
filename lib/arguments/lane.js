var Clapp = require('../modules/clapp-discord');

module.exports = new Clapp.Argument({
	name: "lane",
		desc: " one of the five lanes (or fill) in league of legends:\ntop\njg\nmid\nadc\nsupp\nfill",
		type: "string",
		required: true,
		validations: [
			{
				errorMessage: "This argument must be a valid lane:\ntop\njg\nmid\nadc\nsupp\nfill",
				validate: value => {
					return !!value.match(/^top|jg|mid|adc|supp|fill$/);
				}
			}
		]
	});
