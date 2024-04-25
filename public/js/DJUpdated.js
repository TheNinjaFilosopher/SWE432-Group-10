document.addEventListener('DOMContentLoaded', function () {
	const dateBox = document.getElementById('date');

	const timeslots = document.getElementById('time-slots').querySelector('.section-wrapper');
	const songslots = document.getElementById('song-slots').querySelector('.section-wrapper');
	const editButton = document.getElementById('editbutton');
	let allplaylists = [];
	let currentplaylistIndex = -1;
	let currentdate = '';

	//Get current DJ
	let currentDJ = '';
	fetch('/api/djs')
		.then(response => response.json())
		.then(data => {
			currentDJ = data[0].name;
			document.getElementById('djgreeting').textContent = "Welcome, " + currentDJ + "!";
			//make it the first DJ for now
		})
		.catch(err => {
			console.log(err);
		});
	

	//Get all playlists
	fetch('/api/timeslots')
		.then(response => response.json())
		.then(data => {
			allplaylists = data;
		})
		.catch(err => {
			console.log(err);
		});
	
	//Display messages from Editor if found
	if(window.sessionStorage.getItem('message') !== null) {
		showFeedback(window.sessionStorage.getItem('messageType'), window.sessionStorage.getItem('message'));
		window.sessionStorage.clear();
	}

	dateBox.addEventListener('change', () => {
		currentdate = dateBox.value;

		// turn into date format: mm/dd/yyyy
		let month = currentdate.split('-')[1];
		let day = currentdate.split('-')[2];
		let year = currentdate.split('-')[0];
		currentdate = month + '/' + day + '/' + year;
		
		//remove leading 0	
		if (currentdate.startsWith('0')) {
			currentdate = currentdate.substring(1);
		}

		//clear slots
		while (timeslots.firstChild) {
			timeslots.removeChild(timeslots.firstChild);
		}

		while (songslots.firstChild) {
			songslots.removeChild(songslots.firstChild);
		}

		//console.log('Selected ' + date);
		for (playlist of allplaylists) {
			if (playlist.Timeslot.day === currentdate && playlist.DJ.name === currentDJ) {
				const btn = document.createElement('button');
				btn.className = 'timeslot';
				btn.textContent = `${playlist.Timeslot.start} - ${playlist.Timeslot.end}`;
				timeslots.appendChild(btn);
			}
		}
	});

	timeslots.addEventListener('click', function (e) {
		if (e.target && e.target.nodeName == "BUTTON") {

			let starttime = e.target.textContent.split(' - ')[0];
			let endtime = e.target.textContent.split(' - ')[1];

			while (songslots.firstChild) {
				songslots.removeChild(songslots.firstChild);
			}

			currentplaylistIndex = -1;

			for (let i = 0; i < allplaylists.length; i++) {
				if (currentdate === allplaylists[i].Timeslot.day && 
					starttime === allplaylists[i].Timeslot.start && 
					endtime === allplaylists[i].Timeslot.end
					&& allplaylists[i].DJ.name === currentDJ) {
					currentplaylistIndex = i;
					for (let j = 0; j < allplaylists[i].Songlist.length; j++) {
						const song = document.createElement('button');
						song.textContent = allplaylists[i].Songlist[j].songName + ' - ' + allplaylists[i].Songlist[j].artist.artistName;
						song.className = 'songslot';
						songslots.appendChild(song);	
					}
				}
			}
		}
	});

	editButton.addEventListener('click', function () {

		if (dateBox.value === "") {
			showFeedback('error', 'Please select a date.');
			return;
		} else if (timeslots.firstChild === null) {
			showFeedback('error', 'No playlists for this date.');
			return;
		} else if (songslots.firstChild === null) {
			showFeedback('error', 'No timeslots selected.');
			return;
		}

		//pass data to DJEditor
		window.sessionStorage.setItem('playlistIndex', currentplaylistIndex);
		window.location.href = 'DJEditor';
	});
});