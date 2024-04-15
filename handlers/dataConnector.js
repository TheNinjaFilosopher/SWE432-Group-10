require('dotenv').config();

/*

const mongoose = require('mongoose');

const connect = () => {
	console.log('Starting to connect to Mongo...');
	mongoose.connect(process.env.MONGO_URL);
	const db = mongoose.connection;
	db.on('error', console.error.bind(console, 'Connection error:'));
	db.once('open', () => {
		console.log('Connected to Mongo');
	});

};

*/

/* FIXME FIXME FIXME
 * Right now we're using the mongodb package instead of
 * mongoose for our queries. However, mongoose will be
 * less of a headache to use, so we must make the switch
 * whenever possible.
 */

const {MongoClient, ServerApiVersion } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URL, {
		serverApi: {
			version: ServerApiVersion.v1,
			strict: true,
			deprecationErrors: true,
		}
	}
);

async function run() {
	try {
		// Connect the client to the server (optional starting in v4.7)
		await client.connect();
		// Send a ping to confirm a successful connection
		await client.db('admin').command({ ping: 1 });
		console.log('Pinged your deployment. You successfully connected to MongoDB!');
	} catch {
		console.log('Error connecting to MongoDB!');
		await client.close();
	}
}

const connect = () => {
	run();
	return client;
};

module.exports = {
	connect
};