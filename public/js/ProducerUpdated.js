// After a bit more research, dragging elements between the same list should be doable, but I'm not going to bother with elements between lists
// Forget the dragging for now, the most important thing is showing that announcements can be added to the list.
// All songs should display the name and length of the song, nothing else is needed. Announcements should therefore be the same
// In addition to making sure that submit form displays properly, I must also make sure that updateForm shows the announcements as well.

// Annoucements and different timeslots have been implemented. Now I only need to implement adding songs. That should be something done on DOMContentLoad
// Have a function that runs through all the songs in a list, makes an unordered list of them, and attaches an Add button to each li
// The add button will append the song to the playlist. That'll be the last thing I do before bed.
// Finished. The code and comments will need to be cleaned up later today if I have time, but everything is looking good for now.


// List of announcements
// [i].name is the name of the announcement, [i].length is the length of time
// Alright, need to update this to have the playlists, as well as functionality to swap between them.
// That should be as simple as an addToPlaylist function that moves from the songlist to the playlist, and then an removeFromPlaylist that moves from the playlist to the song list.
// Reset the songlist for each timeslot (Or rather, reset the displayed songlist for each timeslot)
// Additionally, include a selection list for DJs and for Timeslots
// Just make them strings for now, they don't need any other information.
const announcements = [];

// When a DJ and a timeslot are combined, it's checked to see if that combination exists already
// If not, it'll show a blank screen. If so, it'll show what's been saved so far.
// A DJ can have multiple timeslots, but a timeslot can only have one DJ
// If someone attempts to assign a timeslot that is already taken, do not let them.
// Actually, allow them to do it, it should be fine, just need to alter the dj value for the timeslot in timeslots
const djs = ["DJ 1", "DJ 2", "DJ 3"];
const timeslots = ["Timeslot 1", "Timeslot 2", "Timeslot 3"];

//Playlists will be like a dictionary, containing the DJ doing the playlist, as well as a list of songs and announcements in the playlist
//Timeslot will be the key, current version will start with one timeslot already in.
//Need to figure out display by today, so I can convert to EJS and node by tomorrow
//Display should happen whenever the selections are changed, so need a function to apply to those.
//Should also display the initial one upon window load.
//A playlist should only be added to the one in 
const playlists = new Map();
playlists.set(timeslots[0],{
	dj: djs[0],
	songs: []
});
//First test that I can display the playlist in a log with a method that changes things based on which playlist it is
const songlist = ["Song 1","Song 2","Song 3","Song 4","Song 5","Song 6","Song 7","Song 8","Song 9","Song 10"];

function openForm(e) {
    //Upon opening the form, make sure the labels are clear and showcase the form
	document.getElementById('announcement-name').value = '';
	document.getElementById('announcement-length').value = '';
	document.getElementById('announcement-creator').removeAttribute('style');
}
  
function submitForm(e) {
    //Upon closing the form, save the values and add them to the announcements list
	e.preventDefault();
	const announcement = {
		name: document.getElementById('announcement-name').value,
		length: document.getElementById('announcement-length').value
	};
	//Add the announcement to announcements for later
	//Then add it to the end of the playlist to be saved
	//Then append the announcement to the end of the list
	//Maybe remove the part about the playlist, since the submit should save it in anyway, and I don't want any repeats.
	let timeslotName = document.getElementById('timeslot');
	let name = timeslotName.options[timeslotName.selectedIndex].text;
	announcements.push(announcement);
	playlists.get(name).songs.push(announcement.name);
	let list = document.getElementById('playlist');
	let li = document.createElement('li');
	li.innerHTML = announcement.name;
	li.classList = 'playlist';
	li.draggable = true;
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

// This alters the Playlist side of the screen to have an unordered list of all the songs in the current playlist.
// First check if I can log the current playlist and its songs, then check if I can alter the list
// Then put the songs into the list, with a for-loop or something.
function updateInfo(e){
	//e.preventDefault();
	// Update the info in the playlists everytime the data is changed.
	// This can be done by checking what songs are currently in the playlist at the time the change happens, then updating it in the playlists variable
	// Better yet would be to have a button that handles this for me though, something like save playlist.
	// I'll just add a button
	// I can put it where the left and right buttons are, since I'm just going to remove them most likely
	// Unless I can figure out how to do the dragging thing, we'll see.

	//Use playlists.get(timeslots[0]).songs to get the list of songs, then iterate through the list to populate the list.
	//Will need to set up the select first to make sure this works right, but I can set up the code for now
	let timeslotName = document.getElementById('timeslot');
	let name = timeslotName.options[timeslotName.selectedIndex].text;
	//Like undefined because it is empty, or because it was not set up above.
	//First check to see if it exists, and if not, then create it
	if(!playlists.has(name)){
		playlists.set(name,{
			dj: djs[0],
			songs: []
		})
	}
	const songsList = JSON.parse(JSON.stringify(playlists.get(name).songs));
	//console.log("The songs list is: "+songsList);

	//console.log(timeslotName.options[timeslotName.selectedIndex].text);
	//console.log(e)
	//console.log(e.options)
	//console.log("After editing, the songsList is now: "+songsList);
	let list = document.getElementById('playlist');
	//List is constantly appending children, to fix this, just clear list after retrieving it
	if(list){
		while(list.firstChild){
			list.removeChild(list.firstChild);
		}
	}
	for(i = 0;i<songsList.length;i++){
		let li = document.createElement('li');
		li.innerHTML = songsList[i];
		li.classList = 'playlist';
		li.draggable = true;
		list.appendChild(li)
	}
	//No need for this, just append announcements to the end of the thing and if it gets reset, whatever
	/*for(i = 0;i<announcements.length;i++){
		let li = document.createElement('li');
		li.innerHTML = announcements[i].name;
		li.classList = 'playlist';
		li.draggable = true;
		list.appendChild(li)
	}*/
}

//This saves what is currently in the unordered list of the playlist into the actual playlist, along with the DJ before confirming that it was saved.
//Note to self, handle songs with 0 lists, just in case.
function savePlaylist(e){
	const songs = document.querySelectorAll('li.playlist');
	const songsList = [];
	// Add all the elements into a list, then put that list into the playlists
	//console.log(songs)
	songs.forEach(song => songsList.push(song.innerHTML));
	//console.log(songsList);
	// End by setting the current timeslot as the key, and save the dj and songlist as an object
	// Hardcoded for now, will get the current timeslot later.
	// Not much need for hardcoding with how easy it is to get the current timeslot and DJ.
	let timeslot = document.getElementById('timeslot');
	let name = timeslot.options[timeslot.selectedIndex].text;
	let dj = document.getElementById('dj');
	playlists.set(name,{
		dj: dj.options[dj.selectedIndex].text,
		songs: songsList
	});
	
	console.log(playlists.get(name).dj)
	console.log(playlists.get(name).songs)
	const feedback = 'Playlists saved at '+name+' with '+playlists.get(name).dj;
	showFeedback('success', feedback);
}

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
			li.innerHTML = songlist[i];
			li.setAttribute('songName',songlist[i]);
			
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
						songs: []
					})
				}
				playlists.get(name).songs.push(addButton.parentElement.getAttribute('songName'));
				console.log(addButton.parentElement.getAttribute('songName'));
				updateInfo();
			}
			li.appendChild(addButton);
			list.appendChild(li);
			/*
			let li = document.createElement('li');
			li.innerHTML = songsList[i];
			li.classList = 'playlist';
			li.draggable = true;
			list.appendChild(li)
			*/
		}
	}
	songButtons();
});