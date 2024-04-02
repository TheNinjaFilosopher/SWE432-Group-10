document.addEventListener('DOMContentLoaded', function () {
	const dateBox = document.getElementById('date');

	const timeslots = document.getElementById('time-slots').querySelector('.section-wrapper');
	const songslots = document.getElementById('song-slots').querySelector('.section-wrapper');
	const editButton = document.getElementById('editbutton');
	let currentplaylistIndex = -1;

	//Display messages from Editor if found
	if(window.localStorage.getItem('message') !== null) {
		showFeedback(window.localStorage.getItem('messageType'), window.localStorage.getItem('message'));
		window.localStorage.removeItem('message');
		window.localStorage.removeItem('messageType');
	}

	dateBox.addEventListener('change', () => {
		const date = dateBox.value;

		//clear slots
		while (timeslots.firstChild) {
			timeslots.removeChild(timeslots.firstChild);
		}

		while (songslots.firstChild) {
			songslots.removeChild(songslots.firstChild);
		}

		//console.log('Selected ' + date);
		for (playlist of allplaylists) {
			if (playlist.assignedDate === date) {
				const btn = document.createElement('button');
				btn.className = 'timeslot';
				btn.textContent = `${playlist.playlistStartTime} - ${playlist.playlistEndTime}`;
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
				if (dateBox.value === allplaylists[i].assignedDate && starttime === allplaylists[i].playlistStartTime && endtime === allplaylists[i].playlistEndTime) {
					for (let j = 0; j < allplaylists[i].songs.length; j++) {
						const song = document.createElement('button');
						song.textContent = allplaylists[i].songs[j].title + ' - ' + allplaylists[i].songs[j].artist;
						song.className = 'songslot';
						songslots.appendChild(song);
						currentplaylistIndex = i;
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
		window.localStorage.setItem('playlistIndex', currentplaylistIndex);
		window.location.href = 'DJEditor';
	});
});