const {MongoClient} = require('mongodb');
const  url = 'mongodb://localhost:27017';
const dbName = 'e-comm';
const client = new MongoClient(url);


async function ecomm(){
    let result = await client.connect();
    db = result.db(dbName);
    return  db;

}

module.exports = ecomm;