//First thing to do is to implement the different JS that I missed out on, as well as alter the HTML to be more similar to DJ
//Instead of dragging elements from one list to another, simply have a button that can transfer them attached to each list item
//An add button for the song list, and a remove button for the playlist
//Also need a list to keep track of different playlists


// List of announcements
// [0] is the name of the announcement, [1] is the length of time

var announcements = [];
var announcementsCounter = 0;

var playlists = [];

function openForm() {
    //Upon opening the form, make sure the labels are clear and showcase the form
    document.getElementById("name").value = "";
    document.getElementById("length").value = "";
    document.getElementById("myForm").style.display = "block";
}
  
function submitForm(){
    //Upon closing the form, save the values and add them to the announcements list
    let announcement = {
        name: "",
        length: 0
    }
    announcement.name = document.getElementById("name").value;
    announcement.length = document.getElementById("length").value;
    announcements[announcementsCounter++] = [announcementName, length];
    document.getElementById("myForm").style.display = "none";
}

function closeForm() {
    document.getElementById("name").value = "";
    document.getElementById("length").value = "";
    document.getElementById("myForm").style.display = "none";
}