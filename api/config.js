"use strict";

const activeEnv = process.env.NODE_ENV || "local";
const envFile = `./envs/${activeEnv}`;
const env = require(envFile);
console.log(activeEnv)
const config = {
	env: activeEnv,
	port: 5000,
	databases: {
		mongo: {
			host: env.MONGO_HOST,
			db: env.MONGO_DATABASE
		}
	},
	hubspot_api_key: '2066b35f-a5d7-4f7e-95ae-f7a46067d990',
	FILE_UPLOAD: env.FILE_UPLOAD
};

module.exports = Object.assign({}, config);
