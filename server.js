require('dotenv').config();

const express = require('express');
const app = express();

const mongoClient = require('./handlers/dataConnector.js').connect();
const ObjectId = require('mongodb').ObjectId;

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(express.json())

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
	let djs;
	mongoClient.db("RadioStation").collection("employees")
	.find({position:"DJ"}).project({_id: 1, name: 1}).toArray()
	.then(data => djs = data)
	.catch(() => {
		// TODO handle case where DJ's can't be pulled from DB
		djs = {};
	})
	.finally(() => {
		res.render('pages/Manager', {sessionName: 'Dave Jones', djList: djs});
	});
});

// Producer page
app.get('/Producer', (req, res) => {
	res.render('pages/Producer');
});

// Preferably, this should be in a separate file.
// Preferably, we also use mongoose instead
app.get('/api/djs', (req, res) => {
	mongoClient.db("RadioStation").collection("employees")
	.find({position:"DJ"}).toArray()
	.then(data => {
		if (data.length == 0) return Promise.reject(new PermissionDenied());
		res.json(JSON.parse(JSON.stringify(data)));
	})
	.catch(() => {
		res.json({type: 'error', message: 'Unable to retrieve DJs'});
	});
});

app.get('/api/djs/:id', (req, res) => {
	mongoClient.db("RadioStation").collection("employees")
	.findOne({position: "DJ", _id: new ObjectId(req.params.id)})
	.then(data => res.json(data));
});

app.get('/api/timeslots', (req, res) => {
	mongoClient.db("RadioStation").collection("Playlists")
	.find().toArray()
	.then(data => {
		if (data.length == 0) return Promise.reject(new PermissionDenied());
		res.json(JSON.parse(JSON.stringify(data)));
	})
	.catch(() => {
		res.json({type: 'error', message: 'Unable to retrieve Timeslots'});
	});
});

app.get('/api/timeslots/djs/:id', (req, res) => {
	mongoClient.db("RadioStation").collection("Playlists")
	.findOne({'DJ._id': new ObjectId(req.params.id)}, {projection: {Timeslot: 1}})
	.then(data => res.json(data));
});

app.get('/api/songs', (req, res) => {
	mongoClient.db("RadioStation").collection("Songs")
	.find().toArray()
	.then(data => {
		if (data.length == 0) return Promise.reject(new PermissionDenied());
		res.json(JSON.parse(JSON.stringify(data)));
	})
	.catch(() => {
		res.json({type: 'error', message: 'Unable to retrieve Songs'});
	});
});

//edit a playlist of songs
app.post('/api/playlistedit', (req, res) => {
	let playlist = req.body.playlist;
	let id = req.body.id;
	let dj = req.body.dj;
	mongoClient.db("RadioStation").collection("Playlists").updateOne({"ID" : id}, {$set: {"Songlist": playlist, "DJ":dj}})
	.then(() => {
		res.json({type: 'success', message: 'Playlist updated'});
	})
	.catch(() => {
		res.json({type: 'error', message: 'Unable to update playlist'});
	});
});


const port = process.env.port;

app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});