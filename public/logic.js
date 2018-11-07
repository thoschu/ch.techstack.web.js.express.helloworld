/** */

function init() {
    const date = moment().format("MMMM Do YYYY");
    const timeDisplay = document.createTextNode(date);
    const windowLocation = window.location;
    document.getElementById("date").appendChild(timeDisplay);
    ["host", "pathname", "origin"].forEach(function (element) {
        document.getElementById(element).innerHTML = windowLocation[element];
    });
}

function tabText(text) {
    document.title = text;
}

function updateVisit() {
    const visitDisplay = document.createTextNode("");
    document.getElementById("visits").appendChild(visitDisplay);

    let counter = Cookies.get('counter');
    if (counter === null) {
        console.log(counter);
        counter = 1;
    } else {
        counter = Number(counter) + 1;
    }
    Cookies.set('counter', counter);
    document.getElementById("visits").firstChild.nodeValue = counter;
}

function updateClock() {
    const currentTime = new Date();

    let currentHours = currentTime.getHours();
    let currentMinutes = currentTime.getMinutes();
    let currentSeconds = currentTime.getSeconds();

    // Pad the minutes and seconds with leading zeros, if required
    currentMinutes = (currentMinutes < 10 ? "0" : "") + currentMinutes;
    currentSeconds = (currentSeconds < 10 ? "0" : "") + currentSeconds;

    // Choose either "AM" or "PM" as appropriate
    const timeOfDay = (currentHours < 12) ? "AM" : "PM";

    // Convert the hours component to 12-hour format if needed
    currentHours = (currentHours > 12) ? currentHours - 12 : currentHours;

    // Convert an hours component of "0" to "12"
    currentHours = (currentHours === 0) ? 12 : currentHours;

    // Compose the string for display
    const currentTimeString = currentHours + ":" + currentMinutes + ":" + currentSeconds + " " + timeOfDay;

    // Update the time display
    tabText('Hello world... ' + currentTimeString);
}
