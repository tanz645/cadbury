const MongoClient = require("mongodb").MongoClient;
const config = require('../config');

const mongoServer = `mongodb://${config.databases.mongo.host}`;

const connections = {};

const connectToMongo = async (uri) => {
    const dbConnection = await MongoClient.connect(mongoServer, { useUnifiedTopology: true });
    return dbConnection;
};

const setDb = (connection, dbName) => {
    if (connections[dbName]) {
        return connections[dbName]
    }
    const db = connection.db(dbName);
    connections[dbName] = db;
    return db
}

const getConnection = (dbName) => connections[dbName];

module.exports = {
    connectToMongo,
    setDb,
    getConnection
}