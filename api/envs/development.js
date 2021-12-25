const env = {};
env.ENV = "development";
env.MONGO_HOST = "localhost:27017";
env.MONGO_DATABASE = "cadbury";
env.FILE_UPLOAD = '/var/www/html/cad_files'
env.HUBSPOT_API_KEY = 'eu1-5201-252e-4a0a-b86d-2b813d495bc0'
module.exports = { ...env };
