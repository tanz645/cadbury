"use strict";

const activeEnv = process.env.NODE_ENV || "local";
const envFile = `./envs/${activeEnv}`;
const env = require(envFile);

const config = {
	env: activeEnv,
	port: 5000,
	databases: {
		mongo: {
			host: env.MONGO_HOST,
			db: env.MONGO_DATABASE
		}
	},
	FILE_UPLOAD: env.FILE_UPLOAD
};

module.exports = Object.assign({}, config);
