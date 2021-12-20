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
	hubspot_api_key: 'eu1-5201-252e-4a0a-b86d-2b813d495bc0',
	FILE_UPLOAD: env.FILE_UPLOAD
};

module.exports = Object.assign({}, config);
