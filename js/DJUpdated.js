document.addEventListener('DOMContentLoaded', function() {
	const dateBox = document.getElementById('date');

	const timeslots = document.getElementById('time-slots').querySelector('.section-wrapper');
	// const songslots = document.getElementById('songslots');
	// const editButton = document.getElementById('editbutton');
	let currentplaylistIndex = -1;

	dateBox.addEventListener('change', () => {
		const date = dateBox.value;
		
		//clear slots
		while (timeslots.firstChild) {
			timeslots.removeChild(timeslots.firstChild);
		}
		
		/*while (songslots.firstChild) {
			songslots.removeChild(songslots.firstChild);
		} */
		
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
});