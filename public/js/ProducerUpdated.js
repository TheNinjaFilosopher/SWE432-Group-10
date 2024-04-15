// Now to implement duration into the timeslot. Can't play 150 minutes of songs in a 90 minute timeslot after all
// Give each timeslot a duration variable, same for each song

//Duration is partly implemented, could be a bit better but it'll do for now
//Now implement the remove buttons, then the up and down buttons

//Done, can't think of much else I need to implement. I'll call it a day for now

//Time to start implementing mongodb for the database
//var mongo = require('mongodb');
//The below should connect properly, so now all I need to do is test if the different parts are what they should be
//Make a temporary button
//import { MongoClient } from 'mongodb';

//const client = new MongoClient(MONGO_URI);



// List of announcements
// [i].name is the name of the announcement, [i].length is the length of time
const announcements = [];


const djs = ["DJ 1", "DJ 2", "DJ 3"];
const timeslots = ["Timeslot 1", "Timeslot 2", "Timeslot 3"];

const playlists = new Map();
//When the database is set up, create all of these from the start with a for loop that pulls from the database
//One for each timeslot
playlists.set(timeslots[0],{
	dj: djs[0],
	songs: [],
	duration: 90
});

// This will likely come from a database in the final version.
const songlist = ["Song 1","Song 2","Song 3","Song 4","Song 5","Song 6","Song 7","Song 8","Song 9","Song 10"];

//Temporary Song List that contains durations, will come from database in final version
const songList2 = [
	{
		name:"Song 1",
		duration: 1
	},
	{
		name:"Song 2",
		duration: 2
	},
	{
		name:"Song 3",
		duration: 3
	},
	{
		name:"Song 4",
		duration: 4
	},
	{
		name:"Song 5",
		duration: 5
	},
	{
		name:"Song 6",
		duration: 6
	},
	{
		name:"Song 7",
		duration: 7
	},
	{
		name:"Song 8",
		duration: 8
	},
	{
		name:"Song 9",
		duration: 9
	},
	{
		name:"Song 10",
		duration: 10
	},
]

// Test to see how to retrive data
function dbTests() {
	fetch('/api/djs')
	.then(res => res.json())
	.then(data => {
		console.log(data);
	});
}

/*
//Test to see how to retrieve/add data
async function dbTests(){
	const uri = MONGO_URI;
	const client = new MongoClient(uri);
	try {
		await client.connect();
		await listDJs(client);
	}
	catch(e){
		console.error(e);
	}
	finally{
		await client.close();
	}
}

async function listDJs(client){
	const djList = await client.db("RadioStation").collection("employees").find({position:"DJ"});
	const results = await djList.toArray();
	if(results.length>0){
		console.log("Found DJ(s):");
		results.forEach((result)=>{
			console.log();
			console.log(`name: ${result.name}`);
			console.log(`login: ${result.login}`);
			console.log(`start date: ${result.startDate}`);
		});
	}
	else{
		console.log("No DJs found.")
	}
}*/

function openForm(e) {
    //Upon opening the form, make sure the labels are clear and showcase the form
	document.getElementById('announcement-name').value = '';
	document.getElementById('announcement-length').value = '';
	document.getElementById('announcement-creator').removeAttribute('style');
}


//Add in up and down button to each added entry, same for the song thing
function submitForm(e) {
    //Upon closing the form, save the values and add them to the announcements list
	e.preventDefault();
	const announcement = {
		name: document.getElementById('announcement-name').value,
		duration: document.getElementById('announcement-length').value
	};
	//Add the announcement to announcements for later
	//Then add it to the end of the playlist to be saved
	//Then append the announcement to the end of the list
	//Maybe remove the part about the playlist, since the submit should save it in anyway, and I don't want any repeats.
	
	let timeslotName = document.getElementById('timeslot');
	let name = timeslotName.options[timeslotName.selectedIndex].text;
	if(calculateDuration()+announcement.duration>playlists.get(name).duration){
		const remainder = playlists.get(name).duration-calculateDuration();
		showFeedback('error',"Duration of announcement is too long to add to playlist. Remaining time is "+JSON.stringify(remainder));
		return;
	}
	announcements.push(announcement);
	playlists.get(name).songs.push(announcement);
	let list = document.getElementById('playlist');
	let li = document.createElement('li');
	li.innerHTML = announcement.name+" - "+announcement.duration;
	li.classList = 'playlist';
	li.draggable = true;
	let removeButton = document.createElement('button');
	removeButton.innerHTML = 'Remove';

	removeButton.onclick = function () {
		let timeslot = document.getElementById('timeslot');
		let name = timeslot.options[timeslot.selectedIndex].text;
		const playlist = playlists.get(name);
		const listChildren = Array.from(list.childNodes);
		const arrayIndex = listChildren.indexOf(li);
		playlist.songs.splice(arrayIndex,1)
		updateInfo();
	}
	li.appendChild(removeButton);
	list.appendChild(li)
	document.getElementById('announcement-creator').setAttribute('style', 'display: none');
	showFeedback('success', 'Announcement submitted');
}

function closeForm(e) {
	e.preventDefault();
	document.getElementById('announcement-name').value = '';
	document.getElementById('announcement-length').value = '';
	document.getElementById('announcement-creator').setAttribute('style', 'display: none');
}


function updateInfo(e){
	//e.preventDefault();

	//Use playlists.get(timeslots[0]).songs to get the list of songs, then iterate through the list to populate the list.
	//Will need to set up the select first to make sure this works right, but I can set up the code for now
	let timeslotName = document.getElementById('timeslot');
	let name = timeslotName.options[timeslotName.selectedIndex].text;
	//Like undefined because it is empty, or because it was not set up above.
	//First check to see if it exists, and if not, then create it
	if(!playlists.has(name)){
		playlists.set(name,{
			dj: djs[0],
			songs: [],
			duration: 90
		})
	}
	//I'll need to alter this, need to make a for loop that gets all the song names instead
	const playlist = playlists.get(name);
	//const songsList = JSON.parse(JSON.stringify(playlist.songs));
	const songsList2 = [];
	for(let i = 0;i<playlist.songs.length;i++){
		songsList2.push(playlist.songs[i].name + " - " + playlist.songs[i].duration);
	}
	//console.log("The playlist songs are below");
	//console.log(playlist.songs);
	//console.log("The songsList2 is below");
	//console.log(songsList2);
	let list = document.getElementById('playlist');

	//List is constantly appending children, to fix this, just clear list after retrieving it
	if(list){
		while(list.firstChild){
			list.removeChild(list.firstChild);
		}
	}
	//change this to a foreach instead, base it on songsList2
	//But for now, create a button and apply it to the li
	for(i = 0;i<songsList2.length;i++){
		let li = document.createElement('li');
		li.innerHTML = songsList2[i];
		li.classList = 'playlist';
		li.draggable = true;
		//removeButton is done, need to work on the ups and downs as well
		let removeButton = document.createElement('button');
		removeButton.innerHTML = 'Remove';

		removeButton.onclick = function () {
			let timeslot = document.getElementById('timeslot');
			let name = timeslot.options[timeslot.selectedIndex].text;
			const playlist = playlists.get(name);
			const listChildren = Array.from(list.childNodes);
			const arrayIndex = listChildren.indexOf(li);
			playlist.songs.splice(arrayIndex,1)
			updateInfo();
		}
		li.appendChild(removeButton);

		let upButton = document.createElement('button');
		upButton.innerHTML = 'Move Up';
		upButton.onclick = function(){
			//If not the first index, swap with the one above it
			let timeslot = document.getElementById('timeslot');
			let name = timeslot.options[timeslot.selectedIndex].text;
			const playlist = playlists.get(name);
			const songs = playlist.songs;
			const listChildren = Array.from(list.childNodes);
			//need arrayIndex and index-1
			const arrayIndex = listChildren.indexOf(li);
			//Part where the swap happens
			//If the index is 0, no place to move up.
			if(arrayIndex==0){
				return;
			}
			//Now need a temp to get the variable
			//Get it from playlist.songs
			let temp = songs[arrayIndex];
			songs[arrayIndex] = songs[arrayIndex-1];
			songs[arrayIndex-1] = temp;
			//Swap end
			updateInfo();
		}
		li.appendChild(upButton);

		let downButton = document.createElement('button');
		downButton.innerHTML = 'Move Down';
		downButton.onclick = function(){
			//If not the last index, swap with the one below it.
			let timeslot = document.getElementById('timeslot');
			let name = timeslot.options[timeslot.selectedIndex].text;
			const playlist = playlists.get(name);
			const songs = playlist.songs;
			const listChildren = Array.from(list.childNodes);
			const arrayIndex = listChildren.indexOf(li);
			//Part where the swap happens
			if(arrayIndex==listChildren.length-1){
				return;
			}
			let temp = songs[arrayIndex];
			songs[arrayIndex] = songs[arrayIndex+1];
			songs[arrayIndex+1] = temp;
			//Swap end
			updateInfo();
		}
		li.appendChild(downButton);

		list.appendChild(li);
	}
}

//Maybe alter specific values instead of doing another set, that way i won't need to mess with the duration
//Now that I'm planning on using the database, this needs to instead save playlists to the database.
function savePlaylist(e){
	const songs = document.querySelectorAll('li.playlist');
	const songsList = [];
	// Add all the elements into a list, then put that list into the playlists
	songs.forEach(song => songsList.push(song.innerHTML));

	let timeslot = document.getElementById('timeslot');
	let name = timeslot.options[timeslot.selectedIndex].text;
	let dj = document.getElementById('dj');
	playlists.set(name,{
		dj: dj.options[dj.selectedIndex].text,
		songs: songsList,
		duration: 90
	});
	
	console.log(playlists.get(name).dj)
	console.log(playlists.get(name).songs)
	const feedback = 'Playlists saved at '+name+' with '+playlists.get(name).dj;
	showFeedback('success', feedback);
}

//This function calculates the duration of all songs in the current timeslot
function calculateDuration(){
	let timeslot = document.getElementById('timeslot');
	let name = timeslot.options[timeslot.selectedIndex].text;
	// Check to see if the timeslot being calculated exists
	// Might not need to do this, depends on when I calculateDuration.
	if(!playlists.has(name)){
		playlists.set(name,{
			dj: djs[0],
			songs: [],
			duration: 90
		})
	}

	let durationTotal = 0;
	//songs.forEach(song => songsList.push(song.innerHTML));
	playlists.get(name).songs.forEach(song => durationTotal+=song.duration);
	console.log(durationTotal);
	return durationTotal;
}

// const djs = ["DJ 1", "DJ 2", "DJ 3"];
// const timeslots = ["Timeslot 1", "Timeslot 2", "Timeslot 3"];
function selectFiller(){
	let djList = document.getElementById('dj');
	let timeslotList = document.getElementById('timeslot');
	for(var i = 0;i<djs.length;i++){
		var option = document.createElement("option");
		option.value = djs[i];
		option.text = djs[i];
		djList.appendChild(option);
	}
	for(var i = 0;i<timeslots.length;i++){
		var option = document.createElement("option");
		option.value = timeslots[i];
		option.text = timeslots[i];
		timeslotList.appendChild(option);
	}
}

//TODO: Populate the DJ and Timeslot selects automatically with the names in the database.
document.addEventListener('DOMContentLoaded', () => {
	document.getElementById('open-add-announcement').addEventListener('click', openForm);
	document.getElementById('announcement-form').addEventListener('submit', submitForm);
	document.querySelector('.window .cancel').addEventListener('click', closeForm);
	

	

	function songButtons(){
		//First get the ul for the songlist
		let list = document.getElementById('songlist');
		//Remove every element currently in there (probably won't need this in the final iteration)
		while(list.firstChild){
			list.removeChild(list.firstChild);
		}
		// Because the only purpose of the song list on the right is to be added to the playlists
		// I probably don't need a class
		for(i = 0;i<songlist.length;i++){
			let li = document.createElement('li');
			let addButton = document.createElement('button');
			addButton.innerHTML = "Add";
			// Change innerhtml to include duration, give the song a duration attribute I can use
			li.innerHTML = songlist[i]+" - "+JSON.stringify(songList2[i].duration);
			li.setAttribute('songName',songlist[i]);
			li.setAttribute('duration',JSON.stringify(songList2[i].duration));
			
			//li.value = songlist[i];
			//console.log(songlist[i]);
			//console.log(li.value);
			console.log(li.getAttribute('songName'));
			addButton.onclick = function() {
				//This function will add the song to the current timeslot's playlist
				let timeslot = document.getElementById('timeslot');
				let name = timeslot.options[timeslot.selectedIndex].text;
				if(!playlists.has(name)){
					playlists.set(name,{
						dj: djs[0],
						songs: [],
						duration: 90
					})
				}
				//This currently pushes a Song name when clicking add, but does not deal with duration
				//Alter it to take a proper song object instead.
				const song = {
					name: addButton.parentElement.getAttribute('songName'),
					duration: parseInt(addButton.parentElement.getAttribute('duration'))
				}
				if(calculateDuration()+song.duration>playlists.get(name).duration){
					const remainder = playlists.get(name).duration-calculateDuration();
					showFeedback('error',"Duration of song is too long to add to playlist. Remaining time is "+JSON.stringify(remainder));
					return;
				}
				playlists.get(name).songs.push(song);
				console.log(song);
				updateInfo();
			}
			li.appendChild(addButton);
			list.appendChild(li);
		}
	}
	selectFiller();
	songButtons();
});