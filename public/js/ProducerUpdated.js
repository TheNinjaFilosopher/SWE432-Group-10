//Next step is to clean up my code by replacing hardcoding with database integration.
//First thing to think of is what needs to be filled in at the start
//For each of these, create a list and pass it to a function that will do the filling
	//DJs - Done
	//Timeslots - Select is Done, the Playlist is done as well
	//Songs - Done
// After that, make it so that people can't just add songs to a timeslot without first selecting one - Done
// Then clear up extra variables - Done
// Go through all the songs and add artist and date released - Done
// Then make it so Submit playlist saves in the database and call it a day - Still need to do this

// List of announcements
// [i].name is the name of the announcement, [i].length is the length of time
//const announcements = [];

const playlists = new Map();
var ListOfDJs = []

function openForm(e) {
    //Upon opening the form, make sure the labels are clear and showcase the form
	if(document.getElementById('timeslot').options[timeslot.selectedIndex].text=="Timeslots"){
		//
		showFeedback("warning", "Please select a timeslot before adding an announcement.")
		return;
	}
	document.getElementById('announcement-name').value = '';
	document.getElementById('announcement-length').value = '';
	document.getElementById('announcement-creator').removeAttribute('style');
}


//Add in up and down button to each added entry, same for the song thing
function submitForm(e) {
    //Upon closing the form, save the values and add them to the announcements list
	e.preventDefault();
	var today = new Date().toLocaleDateString();
	const announcement = {
		songName: document.getElementById('announcement-name').value,
		songLength: parseInt(document.getElementById('announcement-length').value),
		releaseDate: today,
		artist: {
			artistName: "RADIOSTATION"
		}
	};
	
	let timeslotName = document.getElementById('timeslot');
	let name = timeslotName.options[timeslotName.selectedIndex].text;
	let duration = calculateDuration();
	if((duration+announcement.songLength)>playlists.get(name).duration){
		const remainder = playlists.get(name).duration-duration;
		showFeedback('error',"Duration of announcement is too long to add to playlist. Remaining time is "+JSON.stringify(remainder));
		return;
	}
	//announcements.push(announcement);
	playlists.get(name).songs.push(announcement);

	updateInfo();
	document.getElementById('announcement-creator').setAttribute('style', 'display: none');
	showFeedback('success', 'Announcement submitted');
}

function closeForm(e) {
	e.preventDefault();
	document.getElementById('announcement-name').value = '';
	document.getElementById('announcement-length').value = '';
	document.getElementById('announcement-creator').setAttribute('style', 'display: none');
}

function updateInfo(){
	//Use playlists.get(timeslots[0]).songs to get the list of songs, then iterate through the list to populate the list.
	//Will need to set up the select first to make sure this works right, but I can set up the code for now
	let timeslotName = document.getElementById('timeslot');
	let name = timeslotName.options[timeslotName.selectedIndex].text;
	if(name=="Timeslots"){
		showFeedback("warning","Please select a timeslot first");
		return;
	}

	//I'll need to alter this, need to make a for loop that gets all the song names instead
	const playlist = playlists.get(name);
	const songs = playlist.songs;
	const songsList2 = [];
	for(let i = 0;i<songs.length;i++){
		songDisplay = songs[i].songName+" by "+songs[i].artist.artistName+" Released on "+songs[i].releaseDate+" - Duration: "+JSON.stringify(songs[i].songLength);
		//console.log(songs.name)
		songsList2.push(songDisplay);
	}

	let list = document.getElementById('playlist');

	//List is constantly appending children, to fix this, just clear list after retrieving it
	if(list){
		while(list.firstChild){
			list.removeChild(list.firstChild);
		}
	}
	//let dj = document.getElementById('dj');
	//let djName = dj.options[dj.selectedIndex].text;
	//console.log(dj.options)
	//console.log(dj.selectedIndex)
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
//This needs to be completely redone
//Keep the parts where I get the songs from li.playlist
//Can't get just the names, so I also need to get the name and duration attributes
//Duration should be immutable, DJ is based on current DJ, pretty easy
//Songs is the hardest part. I can set the name and duration, but nothing else
//Maybe I should alter things to display more than just name and duration
//Something like "Song Name by Artist Released on ReleaseDate - Duration:Duration"
function savePlaylistToDatabase(){
	//const songs = document.querySelectorAll('li.playlist');
	//const fetchID = '/api/updatePlaylist/'
	let timeslot = document.getElementById('timeslot');
	let name = timeslot.options[timeslot.selectedIndex].text;
	let dj = document.getElementById('dj');
	let djName = dj.options[dj.selectedIndex].text;
	if(name=="Timeslots" || djName=="DJs"){
		showFeedback("warning","Please select a timeslot or a DJ first");
		return;
	}
	//playlists.get(name).songs
	fetch('/api/playlistedit', {
		method: 'POST',
		headers:{
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
                playlist: playlists.get(name).songs,
                id: playlists.get(name).ID,
				dj: ListOfDJs[dj.selectedIndex-1]//playlists.get(name).dj
        })
	})
	.then(res => res.json())
	.then(data => {
		if(data.type ==='success'){
			console.log("Saved Playlist")
		}
		else{
			console.log("Failed to save Playlist")
		}
	})
	//Only save the DJ and the Songs array
}
/*
function savePlaylist(e){
	const songs = document.querySelectorAll('li.playlist');
	const songsList = [];
	// Add all the elements into a list, then put that list into the playlists
	songs.forEach(song => songsList.push(song.innerHTML));

	let timeslot = document.getElementById('timeslot');
	let name = timeslot.options[timeslot.selectedIndex].text;
	if(name=="Timeslots"){
		showFeedback("warning","Please select a timeslot first");
		return;
	}
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
}*/

//This function calculates the duration of all songs in the current timeslot
function calculateDuration(){
	let timeslot = document.getElementById('timeslot');
	let name = timeslot.options[timeslot.selectedIndex].text;
	let durationTotal = 0;
	playlists.get(name).songs.forEach(song => durationTotal+=song.songLength);
	return durationTotal;
}

function getDJs() {
	fetch('/api/djs')
	.then(res => res.json())
	.then(data => {
		//Change of plans, attempt selectFiller with params and call in dbTests
		data.forEach((d)=>{
			ListOfDJs.push(d);
		});
		djFiller(ListOfDJs);
	});
}

function djFiller(list){
	let djList = document.getElementById('dj');
	for(var i = 0;i<list.length;i++){
		var option = document.createElement("option");
		option.value = list[i].name;
		option.text = list[i].name;
		djList.appendChild(option);
	}
}

function getTimeslots(){
	//Instead of songlistcopy, get
	fetch('/api/timeslots')
	.then(res => res.json())
	.then(data => {
		let ListOfTimeslots = [];
		//Change of plans, attempt selectFiller with params and call in dbTests
		data.forEach((d)=>{
			ListOfTimeslots.push(d.ID);
			//Timeslot name should be based on start and end, change this later
			let name = "Timeslot "+d.ID;
			//This should render all checks useless, as any timeslot in playlists will already be in the list
			//Figured out the undefined issue, the names are off
			//That'll be an issue, though I can probably fix it by setting the songs array to blank, and then making a for loop that fills it
			const songArray = [];
			for(i = 0;i<d.Songlist.length;i++){
				songArray.push({
					songName: d.Songlist[i].songName,
					songLength: d.Songlist[i].songLength,
					releaseDate: d.Songlist[i].releaseDate,
					artist: d.Songlist[i].artist
				})
			}
			playlists.set(name,{
				dj: d.DJ,
				songs: songArray,
				duration: d.Timeslot.length,
				ID: d.ID
			})
			console.log(playlists.get(name).dj)
		});
		timeslotFiller(ListOfTimeslots);
	});
}

function timeslotFiller(list){
	let timeslotList = document.getElementById('timeslot');
	for(var i = 0;i<list.length;i++){
		var option = document.createElement("option");
		option.value = "Timeslot "+list[i];
		option.text = "Timeslot "+list[i];
		timeslotList.appendChild(option);
	}
}

function getSongs(){
	fetch('/api/songs')
	.then(res => res.json())
	.then(data => {
		let ListOfSongs = [];
		//Change of plans, attempt selectFiller with params and call in dbTests
		data.forEach((d)=>{
			let song = {
				name:d.name,
				duration:d.duration,
				artist: d.artist,
				album: d.album,
				releaseDate: d.releaseDate
			}
			ListOfSongs.push(song);
		});
		songFiller(ListOfSongs);
	});
}

function songFiller(songlist){
	let list = document.getElementById('songlist');
	//clears the list if there is anything inside
	while(list.firstChild){
		list.removeChild(list.firstChild);
	}
	for(i = 0;i<songlist.length;i++){
		let li = document.createElement('li');
		let addButton = document.createElement('button');

		addButton.innerHTML = "Add";
		//Something like "Song Name by Artist Released on ReleaseDate - Duration:Duration"
		li.innerHTML = songlist[i].name+" by "+songlist[i].artist+" Released on "+songlist[i].releaseDate+" - Duration: "+JSON.stringify(songlist[i].duration);
		li.setAttribute('songName',songlist[i].name);
		li.setAttribute('duration',JSON.stringify(songlist[i].duration));
		li.setAttribute('artist',songlist[i].artist);
		li.setAttribute('album',songlist[i].album);
		li.setAttribute('releaseDate',songlist[i].releaseDate);
		addButton.onclick = function() {
			let timeslot = document.getElementById('timeslot');
			let name = timeslot.options[timeslot.selectedIndex].text;
			if(name=="Timeslots"){
				showFeedback("warning","Please select a timeslot first");
				return;
			}
			
			const song = {
				songName: addButton.parentElement.getAttribute('songName'),
				songLength: parseInt(addButton.parentElement.getAttribute('duration')),
				releaseDate: addButton.parentElement.getAttribute('releaseDate'),
				artist: {
					artistName: addButton.parentElement.getAttribute('artist')
				}
			}
			if(calculateDuration()+song.songLength>playlists.get(name).duration){
				const remainder = playlists.get(name).duration-calculateDuration();
				showFeedback('error',"Duration of song is too long to add to playlist. Remaining time is "+JSON.stringify(remainder));
				return;
			}
			playlists.get(name).songs.push(song);
			updateInfo();
		}
		li.appendChild(addButton);
		list.appendChild(li);
	}
}

//TODO: Populate the DJ and Timeslot selects automatically with the names in the database.
document.addEventListener('DOMContentLoaded', () => {
	document.getElementById('open-add-announcement').addEventListener('click', openForm);
	document.getElementById('announcement-form').addEventListener('submit', submitForm);
	document.querySelector('.window .cancel').addEventListener('click', closeForm);

	getDJs();
	getTimeslots();
	getSongs();
});