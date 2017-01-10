var Clapp = require('../modules/clapp-discord');

module.exports = new Clapp.Argument({
	name: "lane",
		desc: " one of the five lanes in league of legends:\ntop\njg\nmid\nadc\nsupp\n",
		type: "string",
		required: true,
		validations: [
			{
				errorMessage: "This argument must be a valid lane:\ntop\njg\nmid\nadc\nsupp\n",
				validate: value => {
					return !!value.match(/^top|jg|mid|adc|supp$/);
				}
			}
		]
	});
