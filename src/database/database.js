

const { MongoClient } = require("mongodb");
const { fileLogger } = require("../logger");
const uri = "mongodb://root:adm123@localhost:27017";

const client = new MongoClient(uri, { useUnifiedTopology: true })

async function connect() {
    await client.connect();
}

async function disconnect() {
    await client.close();
}

async function saveIntoDB(page) {
    const database = client.db('cookies');
    const cookiesCollection = database.collection('cookies');
    await cookiesCollection.insertOne(page);
    console.log("Saved page into DB", page.url)
    return page;
}

module.exports = {
    connect,
    disconnect,
    saveIntoDB
}