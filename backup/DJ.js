document.addEventListener('DOMContentLoaded', function() {
    let dateBox = document.getElementById('date');

    const allplaylists = playlists;
    const timeslots = document.getElementById('timeslots');
    const songslots = document.getElementById('songslots');
    const editButton = document.getElementById('editbutton');
    let currentplaylistIndex = -1;

    dateBox.addEventListener('change', function() {
        let date = dateBox.value;
        
        //clear slots
        while (timeslots.firstChild) {
            timeslots.removeChild(timeslots.firstChild);
        }
        while (songslots.firstChild) {
            songslots.removeChild(songslots.firstChild);
        }

        for (let i = 0; i < allplaylists.length; i++) {
            if (date === allplaylists[i].assignedDate) {
                const button = document.createElement('button');
                const buttonclass = document.createAttribute('class');
                const buttontext = document.createTextNode(allplaylists[i].playlistStartTime + ' - ' + allplaylists[i].playlistEndTime);
                buttonclass.value = 'timeslot';
                button.appendChild(buttontext);
                button.setAttributeNode(buttonclass);
                timeslots.appendChild(button);
            }
        }
    });

    timeslots.addEventListener('click', function(e) {
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
                        const song = document.createElement('li');
                        const songclass = document.createAttribute('class');
                        const songtext = document.createTextNode(allplaylists[i].songs[j].title + ' - ' + allplaylists[i].songs[j].artist);
                        songclass.value = 'songtext';
                        song.appendChild(songtext);
                        song.setAttributeNode(songclass);
                        songslots.appendChild(song);
                        currentplaylistIndex = i;
                    }
                }
            }
        }
    });

    editButton.addEventListener('click', function() {

        if (dateBox.value === "") {
            alert("Please select a date.");
            return;
        }else if (timeslots.firstChild === null) {
            alert("No playlists for this date.");
            return;
        }else if (songslots.firstChild === null) {
            alert("No timeslot selected.");
            return;
        }

        //pass data to DJEditor
        window.localStorage.setItem('playlistIndex', currentplaylistIndex);
        window.location.href = 'DJEditor.html';
    });
    
});
