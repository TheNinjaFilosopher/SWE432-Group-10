document.addEventListener('DOMContentLoaded', function () {
    const allplaylists = playlists;

    let currentplaylist = allplaylists[window.localStorage.getItem('playlistIndex')];
    let songslots = document.getElementById('songslots');
    const cancelbutton = document.getElementById('cancelbutton');
    const savebutton = document.getElementById('savebutton');

    let songlistcopy = [];
    for (let i = 0; i < currentplaylist.songs.length; i++) {
        songlistcopy.push(currentplaylist.songs[i]);
    }

    function displayPlaylist() {
        while (songslots.firstChild) {
            songslots.removeChild(songslots.firstChild);
        }

        for (let i = 0; i < songlistcopy.length; i++) {
            const song = document.createElement('li');
            const songclass = document.createAttribute('class');
            const songtext = document.createTextNode(songlistcopy[i].title + ' - ' + songlistcopy[i].artist);
            songclass.value = 'songtext';
            song.appendChild(songtext);
            song.setAttributeNode(songclass);
            songslots.appendChild(song);

            const arrowupButton = document.createElement('button');
            const arrowupButtonclass = document.createAttribute('class');
            const arrowupButtontext = document.createTextNode('↑');
            arrowupButtonclass.value = 'arrowup';
            arrowupButton.appendChild(arrowupButtontext);
            arrowupButton.setAttributeNode(arrowupButtonclass);
            song.appendChild(arrowupButton);

            const arrowdownButton = document.createElement('button');
            const arrowdownButtonclass = document.createAttribute('class');
            const arrowdownButtontext = document.createTextNode('↓');
            arrowdownButtonclass.value = 'arrowdown';
            arrowdownButton.appendChild(arrowdownButtontext);
            arrowdownButton.setAttributeNode(arrowdownButtonclass);
            song.appendChild(arrowdownButton);

            const deleteButton = document.createElement('button');
            const deleteButtonclass = document.createAttribute('class');
            const deleteButtontext = document.createTextNode('X');
            deleteButtonclass.value = 'delete';
            deleteButton.appendChild(deleteButtontext);
            deleteButton.setAttributeNode(deleteButtonclass);
            song.appendChild(deleteButton);
        }
    }

    function deletesong(songname) {
        for (let i = 0; i < songlistcopy.length; i++) {
            if (songlistcopy[i].title === songname) {
                songlistcopy.splice(i, 1);
                break;
            }
        }
        displayPlaylist();
    }

    function moveup(songname) {
        for (let i = 0; i < songlistcopy.length; i++) {
            if (songlistcopy[i].title === songname) {
                if (i > 0) {
                    let temp = songlistcopy[i];
                    songlistcopy[i] = songlistcopy[i - 1];
                    songlistcopy[i - 1] = temp;
                }
                break;
            }
        }
        displayPlaylist();
    }

    function movedown(songname) {
        for (let i = 0; i < songlistcopy.length; i++) {
            if (songlistcopy[i].title === songname) {
                if (i < songlistcopy.length - 1) {
                    let temp = songlistcopy[i];
                    songlistcopy[i] = songlistcopy[i + 1];
                    songlistcopy[i + 1] = temp;
                }
                break;
            }
        }
        displayPlaylist();
    }

    songslots.addEventListener('click', function (e) {
        if (e.target && e.target.nodeName == "BUTTON") {
            if (e.target.textContent === 'X') {
                deletesong(e.target.parentNode.firstChild.textContent.split(' - ')[0]);
            } else if (e.target.textContent === '↑') {
                moveup(e.target.parentNode.firstChild.textContent.split(' - ')[0]);
            } else if (e.target.textContent === '↓') {
                movedown(e.target.parentNode.firstChild.textContent.split(' - ')[0]);
            }
        }
    });

    cancelbutton.addEventListener('click', function () {
        window.location.href = "DJ.html";
    });

    savebutton.addEventListener('click', function () {

        //save data to database
        //not implemented yet
        alert("Playlist saving not implemented yet.");
        window.location.href = "DJ.html";
    });

    displayPlaylist();
});