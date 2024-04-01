const express = require('express');
const app = express();

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

/*
// Manager page
app.get('/Manager', (req, res) => {
	res.render('pages/Manager');
});
*/

/*
// Producer page
app.get('/Producer', (req, res) => {
	res.render('pages/Producer');
});
*/

app.listen(8080);
console.log('Server is listening on port 8080');