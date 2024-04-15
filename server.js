require('dotenv').config();

const express = require('express');
const app = express();

const mongoClient = require('./handlers/dataConnector.js').connect();

// set the view engine to ejs
app.set('view engine', 'ejs');

// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/public'));

// use res.render to load up an ejs view file

// index page
app.get('/', (req, res) => {
	
});

// DJ page
app.get('/DJ', (req, res) => {
	res.render('pages/DJ');
});

// DJEditor page
app.get('/DJEditor', (req, res) => {
	res.render('pages/DJEditor');
});

// Manager page
app.get('/Manager', (req, res) => {
	// A proper implementation would instead pull from the database then populate the
	// object, but this will do for now to check the basics of EJS
	const radioStationUsers = {
		djList: [
			{lastName: 'Turner', firstName: 'Alex', popularArtist: 'Taylor Swift', popularGenre: 'Country', songsPlayed: 1},
			{lastName: 'Turner', firstName: 'John', popularArtist: 'Jack Harlow', popularGenre: 'Pop', songsPlayed: 5}
		]
	};
	res.render('pages/Manager', {sessionName: 'Dave Jones', userLists: radioStationUsers});
});

// Producer page
app.get('/Producer', (req, res) => {
	res.render('pages/Producer');
});

// Preferably, this should be in a separate file.
// Preferably, we also use mongoose instead
app.get('/api/djs', (req, res) => {
	mongoClient.db("RadioStation").collection("employees").find({position:"DJ"}).toArray()
	.then(data => {
		if (data.length == 0) return Promise.reject(new PermissionDenied());
		res.json(JSON.parse(JSON.stringify(data)));
	})
	.catch(() => {
		res.json({type: 'error', message: 'Unable to retrieve DJs'});
	});
});

const port = process.env.port;

app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});