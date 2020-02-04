//today's date with regard to month and year, used for highlighting later
let today = new Date();
let curMonth = today.getMonth();
let curYear = today.getFullYear();
//create an array to store all of our months
let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let month_year = document.getElementById("month_year");
let events = 0;
//event data initialized at 0, will be useful later on.
let eventTitle = 0;
let yearSplit = 0;
let monthSplit = 0;
let daySplit = 0;
let timeSplit = 0;
let hourSplit = 0;
let minSplit = 0;
let curID = 0;
let curCategory = 0;
//login CSRF Session Token initalized to 0
//later set by logging in
let token = 0;
//show the caledar for the first time
displayCalendar(curMonth, curYear);

// **************************
//         Operations 
// **************************

function showRegister(){
    $("#myRegister").dialog({ 
    }) ;
}

function sendRegister(){
    const regusername = document.getElementById("regusername").value; // Get the username from the form
    const regpassword = document.getElementById("regpassword").value; // Get the password from the form
    const firstName = document.getElementById("regfirstName").value; // Get the first name from the form
    let dataUndefined = true;

    const data = {'username': regusername, 'firstName' : firstName, 'password': regpassword};
    
    fetch("register_ajax.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
       // .then(data => alert(data.success + " " + $data.message));
       //.then(data => alert(data.));
        .then(function(data){
            console.log(data.success ? "You were successfully registered" : `You were not registered or logged in ${data.message}`)
            if(!data.success){
                dataUndefined = false;
                alert(data.message);
            }
        });
        window.setTimeout(function(){
            if(dataUndefined){
            alert("Thank you for registering " + firstName + " please login via the login button.");
            $('#myRegister').dialog('close');
            }
        }, 200);
}

function showLogin(){
    $("#myLogin").dialog({ 
    }) ;
}

function sendLogin(){
        const username = document.getElementById("username").value; // Get the username from the form
        const password = document.getElementById("password").value; // Get the password from the form
        const data = { 'username': username, 'password': password };
        fetch("login_ajax.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        .then(function(data){
            if(!data.success){
                alert("You were not logged in: " + data.message);
            }
            else{
                $('#myLogin').dialog('close');    
                token = data.message;
                console.log(token);
                document.getElementById("loginbtn").style.visibility = "hidden";
                document.getElementById("regbtn").style.visibility="hidden";
                document.getElementById("logbtn").style.visibility="visible";
                document.getElementById("createEventButton").style.visibility="visible";
                document.getElementById("catergoryBtn").style.visibility="visible";
                console.log("trying to grab events");
                //console log the events for debugging purposes
                grabEvents();            
            }
        });
}

function sendLogout(){
    fetch("logout.php");
    document.getElementById("loginbtn").style.visibility = "visible";
    document.getElementById("regbtn").style.visibility="visible";               
    document.getElementById("logbtn").style.visibility="hidden";
    document.getElementById("createEventButton").style.visibility="hidden";
    document.getElementById("catergoryBtn").style.visibility="hidden";
    //CSRF token set back to 0
    token = 0;
    //empty calendar upon logout.
    displayCalendar(curMonth, curYear);
}

function grabEvents(){
    getEventsByCategory();
    console.log("start of grab events");
    if(document.getElementById("loginbtn").style.visibility == "hidden"){
        console.log("we hit the if statement");
        const username = document.getElementById("username").value;
        const data = {'username': username};
        fetch("grabEvents_ajax.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        .then(function(data){
         console.log("made it to the then");
           console.log(data);
            events = data.events;
            console.log(events);
            displayCalendar(curMonth,curYear);
        });
    }
}

function showEditDialog(someID){
    console.log("we made it to the edit part");
    curID = someID;
    let splitDate = curID.split('-');
    let splitDayandTime = splitDate[2].split(" ");
    yearSplit = splitDate[0];
    monthSplit = splitDate[1];
    daySplit = splitDayandTime[0];
    let timeSplit = splitDayandTime[1].split(":");
    hourSplit = timeSplit[0];
    minSplit = timeSplit[1];


    document.getElementById("titleM").value = events[someID];
    document.getElementById("yearM").value = yearSplit;
    document.getElementById("monthM").value = monthSplit;
    document.getElementById("dayM").value = daySplit;
    document.getElementById("hourM").value = hourSplit;
    document.getElementById("minuteM").value = minSplit;
    $("#myModifyEvent").dialog({ 
    }) ;
}

function modifyThisEvent(){
    let newTitle = document.getElementById("titleM").value;
    let newYear = document.getElementById("yearM").value;
    let newMonth = document.getElementById("monthM").value;
    let newDay = document.getElementById("dayM").value;
    let newHour = document.getElementById("hourM").value;
    let newMinute = document.getElementById("minuteM").value;
    let newStart = toTimestamp(newYear, newMonth, newDay, newHour, newMinute);
    let splitDate = curID.split('-');
    let splitDayandTime = splitDate[2].split(" ");
    yearSplit = splitDate[0];
    monthSplit = splitDate[1];
    daySplit = splitDayandTime[0];
    let timeSplit = splitDayandTime[1].split(":");
    hourSplit = timeSplit[0];
    minSplit = timeSplit[1];
 
    let oldTimestamp = toTimestamp(yearSplit, monthSplit, daySplit, hourSplit, minSplit);
    let oldTitle = events[curID];
    let curUser = document.getElementById("username").value;

    const data = {'user': curUser,'oldTitle': oldTitle, 'newtitle': newTitle, 'newTimestamp':newStart, 'oldTimestamp': oldTimestamp, 'token' : token};
    fetch("modifyEvent_ajax.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
    .then(response => response.json())
    .then(function(data){
        if(!data.success){
            alert("You're message was not updated': " + data.message);
        }
        else{
            $('#myModifyEvent').dialog('close'); 
            grabEvents();
            displayCalendar(curMonth, curYear);   
             
        }
    });    
}

function deleteThisEvent(){
    let splitDate = curID.split('-');
    let splitDayandTime = splitDate[2].split(" ");
    yearSplit = splitDate[0];
    monthSplit = splitDate[1];
    daySplit = splitDayandTime[0];
    let timeSplit = splitDayandTime[1].split(":");
    hourSplit = timeSplit[0];
    minSplit = timeSplit[1];
 
    let oldTimestamp = toTimestamp(yearSplit, monthSplit, daySplit, hourSplit, minSplit);
    let oldTitle = events[curID];
    let curUser = document.getElementById("username").value;

    const data = {'user': curUser,'title': oldTitle, 'timestamp': oldTimestamp, 'token': token};
    fetch("delete_event.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
    .then(response => response.json())
    .then(function(data){
        if(!data.success){
            alert("You're message was not deleted': " + data.message);
        }
        else{
            $('#myModifyEvent').dialog('close'); 
            grabEvents();
            displayCalendar(curMonth, curYear);   
             
        }
    });
}

function showCreateEvent(){
    $("#myCreateEvent").dialog({
    });
}

function createOneEvent() {
    const username = document.getElementById("username").value;
    const title = document.getElementById("title").value;
    // Date and Time
    const year = document.getElementById("year").value;
    const month = document.getElementById("month").value;
    const day = document.getElementById("day").value;
    const hour = document.getElementById("hour").value;
    const minute = document.getElementById("minute").value;
    let categoryforevent = document.getElementById("category").value;
    console.log("title: " + title);
    console.log("time:" + year + "-" + month + "-" + day + " " + hour + ":" + minute);
    // "yyyy-MM-dd HH:mm"

    if (checkEventValid(title, month, day, hour, minute)) {
        // var xmlHttp = new XMLHttpRequest();
        let startTime = toTimestamp(year, month, day, hour, minute);
        const data = {'user': username, 'title': title, 'start': startTime, 'category': categoryforevent};
        // write the event into event table by ajax
        fetch("add_event.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'content-type': 'application/json'}
        })
        .then(response => response.json())
        .then(function(data){
            if(data.success){
                alert("Your event is successfully created.");
                $('#myCreateEvent').dialog('close');
                document.getElementById("loginbtn").style.visibility="hidden";
                document.getElementById("regbtn").style.visibility="hidden";
                document.getElementById("logbtn").style.visibility="visible";
                document.getElementById("createEventButton").style.visibility="visible";
                document.getElementById("catergoryBtn").style.visibility="visible";
                // Display updated events on calendar
                grabEvents();
                displayCalendar(month - 1, year);
            }
            else{
                console.log(data.message);
                alert("The event is not created. Please make sure yor event is in the right format.");
            }
        });
    }
}

function showStudy(){
    let category = "study";
    let username = document.getElementById("username").value;
    let data = {'username' : username, 'category' : category};
   
    fetch("categorize.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
    .then(response => response.json())
    .then(function(data){
        events = data.events;
        displayCalendar(curMonth,curYear);
    });
}

function showPlay(){
    let category = "play";
    let username = document.getElementById("username").value;
    let data = {'username' : username, 'category' : category};
   
    fetch("categorize.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
    .then(response => response.json())
    .then(function(data){
        events = data.events;
        displayCalendar(curMonth,curYear);
    });
}

function getEventsByCategory(){
    console.log("grabbing categories");
    let username = document.getElementById("username").value;
    console.log(username);
    let data = {'username' : username};
   
    fetch("categorize_color.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
    .then(response => response.json())
    .then(function(data){
        if(!data.success){
            console.log(data.message);
        }
        else{
            curCategory = data.events;
            console.log("current category:");
            console.log(curCategory);
        }
    });
}


// ******************************
//        Calendar Display
// ******************************
function displayCalendar(month, year) {

    //get the day of the week for the first day in the month
    let someDate = new Date(year, month);
    let firstDay = someDate.getDay();
    // figure out how many days there are in the month.
    // formula taken from https://dzone.com/articles/determining-number-days-month
    let daysInMonth = 32 - new Date(year, month, 32).getDate();

    let tableForCalendar = document.getElementById("c_body"); // body of the calendar

    // clearing all previous dates on the calendar
    tableForCalendar.innerHTML = "";

    //sets the top of the page to the current month and year
    month_year.innerHTML = months[month] + " " + year;


    // making all of the cells for the calendar
    let date = 1;
    for (let i = 0; i < 6; i++) {
        // creates a table element
        let currentRow = document.createElement("tr");

        //goes through all the days of the week
        for (let j = 0; j < 7; j++) {

            let currentCell = document.createElement("td");
            //highlights today's date on the calendar!
            if (date == today.getDate() && year == today.getFullYear() && month == today.getMonth()) {
                currentCell.classList.add("bg-primary");
            }
            let dateText = document.createTextNode(date);
            //fills in blank days untill we hit the first
            //day of the week for the month
            if(i == 0 && j < firstDay){
                dateText = document.createTextNode("");
                currentCell.appendChild(dateText);
            }
            else if (date > daysInMonth){
                //fills the calendar with a blank character
                //if this wasn't done, the next and previous buttons would move
                //slightly up and down when a month didn't have any days in row 6.
                //which is annoying if you're clicking very fast
                dateText = document.createTextNode("￰ ￰￰ ￰");
                currentCell.appendChild(dateText);
            }
            else{
                currentCell.appendChild(dateText);
                if(typeof(events) == "object" && document.getElementById("loginbtn").style.visibility == "hidden"){
                    for(var key in events){
                        if(events.hasOwnProperty(key)){
                           // console.log(key + " -> " + events[key]);
                             eventTitle = events[key];
                             let splitDate = key.split('-');
                             let splitDayandTime = splitDate[2].split(" ");
                             let yearSplit = splitDate[0];
                             monthSplit = splitDate[1];
                             daySplit = splitDayandTime[0];
                             let timeSplit = splitDayandTime[1].split(":");
                             hourSplit = timeSplit[0];
                             minSplit = timeSplit[1];
                            if(date == daySplit && (month + 1) == monthSplit && yearSplit == year.toString()){
                                let br = document.createElement("br");
                                let eventName = events[key];
                                let eventNameAndTime = eventName + " - " + timeSplit[0] + ":" + timeSplit[1];
                                //let eventNameElement=document.createTextNode(eventNameAndTime);
                                let button = document.createElement("BUTTON");
                                button.innerHTML = eventNameAndTime.toString();
                                button.id = key;
                                if(typeof(curCategory) == "object" && document.getElementById("loginbtn").style.visibility == "hidden"){
                                    if(curCategory[key] == "play"){
                                        button.classList.add("bg-danger");
                                    }
                                    else if(curCategory[key] == "study"){
                                        button.classList.add("bg-success");
                                    }
                                }
                                button.onclick = function(event){
                                    showEditDialog(this.id = button.id);
                                    event.preventDefault();
                                };
                                currentCell.appendChild(br);
                                currentCell.appendChild(button);
                            }
                        }
                    };
                }
                date++;
            }
            currentRow.appendChild(currentCell);
        }
        tableForCalendar.appendChild(currentRow); // appending each currentRow into calendar body.
    }
}

function next() {
    //if we hit the limit on the array, i.e hit month december, increase the year by one
    if(curMonth == 11){
        curYear++;
    }
    else{
        // do nothing, current year stays the same
    }
    //if it hits 12, it'll just reset via modulus operator
    curMonth = (curMonth + 1) % 12;
    //display the calendar again
    displayCalendar(curMonth, curYear);
}

function previous() {
    if(curMonth == 0){ // if we're on month january currently and asked to go back one month to last year
        //decrement year by one
        curYear--;
        //have to reset months back to december
        curMonth=11;
    }
    else{
        //decrement month by one
        curMonth--;
    }
    //redisplay the calendar
    displayCalendar(curMonth, curYear);
}

// **************************
//      Utility Functions
// **************************
function toTimestamp(year, month, day, hour, minute) {
    let dateObj = new Date(Date.UTC(year, month-1, day, hour, minute));
    return dateObj.getTime() / 1000;
}

function checkEventValid(eventTitle, month, day, hour, minute) {
    if(eventTitle === "" ){
        alert("name the event");
        return false;
    }
    if(month === "4" || month === "6" || month === "9" || month ==="11") {
        if(day <= 0 || day > 30){
            alert("The day you entered is not valid for this month. Should be between 1 - 30");
            return false;
        }
    }
    if(month === "2"){
        if(day<=0 || day>28){
            alert("Please enter a valid day for February");
            return false;
        }
    }
    if ((month < 0 ) || (month > 12)) {
        alert("Enter right month");
        return false;
    }
    if ((day < 0) || (day > 31)) {
        alert("Enter right day");
        return false;
    }
    if ((minute < 0) || (minute > 59)) {
        alert("Enter right minute");
        return false;
    }
    if ((hour < 0) || (hour > 23)) {
        alert("Enter right hour");
        return false;
    }
    return true;
}

function timestampToDateString(timestamp) {
    let newdate = new Date(timestamp * 1000);
    let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    let year = date.getFullYear();
    let month = months[date.getMonth()];
    let newdate2 = newdate.getDate();
    // Hours part from the timestamp
    let hours = newdate.getHours();
    // Minutes part from the timestamp
    let minutes = "0" + newdate.getMinutes();
    // Seconds part from the timestamp
    let seconds = "0" + newdate.getSeconds();
    // Will display time in 10:30:23 format
    let formattedTime = year + '-' + month + '-' + newdate2 + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return formattedTime;
}