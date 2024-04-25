document.addEventListener('DOMContentLoaded', function () {

    let currentplaylist = null;
    let playlistdata = null;
    let songdata = null;
    const playlistIndex = window.localStorage.getItem('playlistIndex');

    let songslots = document.getElementById('song-slots').querySelector('.section-wrapper').querySelector('.slots');
    let searchslots = document.getElementById('search-slots').querySelector('.section-wrapper').querySelector('.slots');

    const cancelbutton = document.getElementById('cancelbutton');
    const savebutton = document.getElementById('savebutton');
    const searchbutton = document.getElementById('searchbutton');
    let songlistcopy = [];

    console.log(playlistIndex);

    //Get the specific playlist
    fetch('/api/timeslots')
        .then(response => response.json())
        .then(data => {
            currentplaylist = data[playlistIndex];
            playlistdata = data;
            for (song in currentplaylist.Songlist) {
                songlistcopy.push(currentplaylist.Songlist[song]);
            }
            displayPlaylist();
        })
        .catch(err => {
            console.log(err);
            showFeedback('error', 'Error loading playlist.');
        });

    //Get all songs
    fetch('/api/songs')
        .then(response => response.json())
        .then(data => {
            songdata = data;
        })
        .catch(err => {
            console.log(err);
            showFeedback('error', 'Error loading songs, search not available.');
        });

    function displaySearchResults(songresults, playlistresults) {
        while (searchslots.firstChild) {
            searchslots.removeChild(searchslots.firstChild);
        }

        for (let i = 0; i < playlistresults.length; i++) {
            const playlist = document.createElement('li');
            const playlistclass = document.createAttribute('class');
            const playlisttext = document.createTextNode("Playlist: " + playlistresults[i].Timeslot.day);
            playlistclass.value = 'slot';
            playlist.appendChild(playlisttext);
            playlist.setAttributeNode(playlistclass);
            searchslots.appendChild(playlist);

            const addButton = document.createElement('button');
            const addButtonclass = document.createAttribute('class');
            const addButtontext = document.createTextNode('View');
            addButtonclass.value = playlistresults[i].ID;
            addButton.appendChild(addButtontext);
            addButton.setAttributeNode(addButtonclass);
            playlist.appendChild(addButton);
        }

        for (let i = 0; i < songresults.length; i++) {
            const song = document.createElement('li');
            const songclass = document.createAttribute('class');
            const songtext = document.createTextNode(songresults[i].name + ' - ' + songresults[i].artist);
            songclass.value = 'slot';
            song.appendChild(songtext);
            song.setAttributeNode(songclass);
            searchslots.appendChild(song);

            const addButton = document.createElement('button');
            const addButtonclass = document.createAttribute('class');
            const addButtontext = document.createTextNode('Add');
            addButtonclass.value = 'add';
            addButton.appendChild(addButtontext);
            addButton.setAttributeNode(addButtonclass);
            song.appendChild(addButton);
        }

    }

    function displayPlaylist() {
        while (songslots.firstChild) {
            songslots.removeChild(songslots.firstChild);
        }

        for (let i = 0; i < songlistcopy.length; i++) {
            const song = document.createElement('li');
            const songclass = document.createAttribute('class');
            const songtext = document.createTextNode(songlistcopy[i].songName + ' - ' + songlistcopy[i].artist.artistName);
            songclass.value = 'slot';
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
            if (songlistcopy[i].songName === songname) {
                songlistcopy.splice(i, 1);
                break;
            }
        }
        displayPlaylist();
    }

    function moveup(songname) {
        for (let i = 0; i < songlistcopy.length; i++) {
            if (songlistcopy[i].songName === songname) {
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
            if (songlistcopy[i].songName === songname) {
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

    searchslots.addEventListener('click', function (e) {
        if (e.target && e.target.nodeName == "BUTTON") {
            if (e.target.textContent === 'Add') {
                
                let songname = e.target.parentNode.firstChild.textContent.split(' - ')[0];

                for (let i = 0; i < songdata.length; i++) {
                    if (songdata[i].name === songname) {
                        let newsong = {
                            songName: songdata[i].name,
                            artist: {
                                artistName: songdata[i].artist
                            },
                            releasedate: songdata[i].releaseDate,
                            songLength: songdata[i].duration
                        };

                        songlistcopy.push(newsong);
                        break;
                    }
                }

                displayPlaylist();
            } else if (e.target.textContent === 'View') {
                
                let playlistID = e.target.className;
                let resultsonglist = [];

                for (let i = 0; i < playlistdata.length; i++) {
                    if (playlistdata[i].ID == playlistID) {
                        for (let j = 0; j < songdata.length; j++) {
                            for (let k = 0; k < playlistdata[i].Songlist.length; k++) {
                                if (songdata[j].name === playlistdata[i].Songlist[k].songName) {
                                    resultsonglist.push(songdata[j]);
                                    break;
                                }
                            }
                        }
                        displaySearchResults(resultsonglist, [])
                        break;
                    }
                }
            }
        }
    });

    cancelbutton.addEventListener('click', function () {
        window.localStorage.setItem('messageType', 'warning');
        window.localStorage.setItem('message', 'Playlist changes discarded.');
        window.location.href = "DJ";
    });

    savebutton.addEventListener('click', function () {

        //save data to database
        //not implemented yet

        window.localStorage.setItem('messageType', 'success');
        window.localStorage.setItem('message', 'Playlist saving not implemented yet.');
        window.location.href = "DJ";
    });

    searchbutton.addEventListener('click', function () {
        let prevplaylistToggle = document.getElementById('prevplaylistbox');
        let trackToggle = document.getElementById('trackbox');
        let search = document.getElementById('search');

        if (!prevplaylistToggle.checked && !trackToggle.checked) {
            showFeedback('error', 'Please select a search type.');
        } else if (search.value === "") {
            showFeedback('error', 'Please enter a search term.');
        } else {
            input = search.value.toLowerCase();
            let songresults = [];
            let playlistresults = [];

            //search for previous playlist
            //if the search term is found in a song in the playlist, add the playlist to the results
            if (prevplaylistToggle.checked) {
                for (let i = 0; i < playlistdata.length; i++) {
                    for (let j = 0; j < playlistdata[i].Songlist.length; j++) {
                        if (playlistdata[i].Songlist[j].songName.toLowerCase().includes(input)) {
                            if (playlistIndex !== i){
                                playlistresults.push(playlistdata[i]);
                            }
                            break;
                        }
                    }
                }
            }
            //search for song
            //if the search term is found in the song name, add the song to the results
            if (trackToggle.checked) {
                for (let i = 0; i < songdata.length; i++) {
                    if (songdata[i].name.toLowerCase().includes(input)) {
                        songresults.push(songdata[i]);
                    }
                }
            }

            displaySearchResults(songresults, playlistresults);
           
        }

    });
});