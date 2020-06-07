const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = () => {
    MongoClient.connect(
        'mongodb+srv://admin93:Test@1234@cluster0-pgrut.mongodb.net/shop?retryWrites=true&w=majority',
        {useNewUrlParser: true, useUnifiedTopology: true}
    )
        .then(client => {
            console.log('Connected');
            _db = client.db();
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
}

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'No databases found!';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
