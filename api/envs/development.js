const env = {};
env.ENV = "development";
env.MONGO_HOST = "localhost:27017";
env.MONGO_DATABASE = "cadbury";
env.FILE_UPLOAD = ''
module.exports = { ...env };
