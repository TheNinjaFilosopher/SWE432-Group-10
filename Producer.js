
// List of announcements
// [0] is the name of the announcement, [1] is the length of time
var announcements = [];
var announcementsCounter = 0;

function openForm() {
    //Upon opening the form, make sure the labels are clear and showcase the form
    document.getElementById("myForm").style.display = "block";
}
  
function submitForm(){
    //Upon closing the form, save the values and add them to the announcements list
    var announcementName = document.getElementById("name").value;
    var length = document.getElementById("length").value;
    announcements[announcementsCounter++] = [announcementName, length];
    document.getElementById("myForm").style.display = "none";
}

function closeForm() {
    document.getElementById("name").value = "";
    document.getElementById("length").value = "";
    document.getElementById("myForm").style.display = "none";
}