import { MongoClient } from 'mongodb';

const client = new MongoClient('mongodb://user:password@mongo:27017/');
let dbPromise = new Promise((resolve, reject) => {
	client
		.connect()
		.then((res) => resolve(res.db('optiiscan')))
		.catch(reject);
});

export default dbPromise;
