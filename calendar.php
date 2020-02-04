<!DOCTYPE html>
<html lang="en">
<head>
    <style>
        #myLogin { display:none }
        #myRegister {display:none}  
        #logbtn {visibility:hidden}
        #createEventButton {visibility:hidden}
        #myCreateEvent {display:none}
        #myModifyEvent {display:none}
        #catergoryBtn {visibility:hidden}
    </style>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <script defer src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"></script>
  <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.4/css/bulma.css">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css" />
    <link href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.7.2/themes/start/jquery-ui.css"
    type="text/css" rel="Stylesheet" /> 
   <script  src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.3/jquery.min.js"></script>
   <script  src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.5/jquery-ui.min.js"></script>
    <title>Calendar</title>
</head>
<body>
    <!--create a brand new session every time the page loads-->
    <?php
        session_start();
        session_unset();
        session_destroy();    
    ?>
    <!-- styling for the top of the page using bootstrap's navbar -->
    <nav class="navbar is-dark"  aria-label="main navigation">
            <div class="navbar-brand">
                <p class="title navbar-item">Hamza and Wenzhen's Calendar</p>    
            </div>
            <div id="helpfulbuttons" class="navbar-menu">
                <div class="navbar-end">
                    <!-- places a button for register -->
                    <input type="button" value="Register" id="regbtn" onclick=showRegister() class="navbar-item-is-dark">
                    <div id="myRegister" title="Please create a new account" >
                        <label for="regusername">Username: </label>
                        <input type="text" name="reguser" id="regusername" class="input" placeholder="Username">
                        <label for="regfirstName">First Name: </label>
                        <input type="text" name="name" id="regfirstName" class="input" placeholder="John">
                        <label for="regpassword">Password: </label>
                        <input type="password" name="regpass" id="regpassword" class="input" placeholder="Password">
                        <input type="button" value="Register" onclick=sendRegister() class="navbar-item-is-dark">
                    </div>

                    <!-- places a button on top right of page for login using JQuery dialog boxes-->
                    <input type="button" value="Login" id="loginbtn"  onclick=showLogin() class="navbar-item-is-dark">
                    <div id="myLogin" title="Please Login" >
                        <label for="username">Username: </label>
                        <input type="text" name="user" id="username" class="input" placeholder="Username">
                        <label for="password">Password: </label>
                        <input type="password" name="pass" id="password" class="input" placeholder="Password">
                        <input type="button" value="Login" onclick="sendLogin(reg=false)" class="navbar-item-is-dark">
                    </div>

                    <!-- places a button for log out -->
                    <input  type ="button" value="Logout" id="logbtn" onclick=sendLogout() class="navbar-item-is-dark">

                    <!-- places a button for create event -->
                    <input  type ="button" value="Create" id="createEventButton"  onclick=showCreateEvent() class="navbar-item-is-dark">
                    <div id="myCreateEvent" title="Enter the event you want to create">
                        <label for="title"> Title </label>
                        <input type="text" name="title" id="title" class="input" placeholder="Brief description of the event">
                        <label for="category"> Category </label>
                        <input type="text" name="category" id="category" class="input" placeholder="study / play ">
                        <label for="year"> Year </label>
                        <input type="text" name="year" id="year" class="input" placeholder="yyyy">
                        <label for="month"> Month </label>
                        <input type="text" name="month" id="month" class="input" placeholder="mm">
                        <label for="day"> Day </label>
                        <input type="text" name="day" id="day" class="input" placeholder="dd">
                        <label for="day"> Hour </label>
                        <input type="text" name="hour" id="hour" class="input" placeholder="hh">
                        <label for="day"> Minute </label>
                        <input type="text" name="minute" id="minute" class="input" placeholder="mm">
                        <input type="button" value="Create this event!" onclick=createOneEvent() class="navbar-item-is-dark">
                    </div>

                    <!-- the dialog to modify events-->
                    <div id="myModifyEvent" title="Enter the modifications for this event">
                        <label for="title"> Title </label>
                        <input type="text" name="title" id="titleM" class="input" placeholder="Brief description of the event">
                        <label for="year"> Year </label>
                        <input type="text" name="year" id="yearM" class="input" placeholder="yyyy">
                        <label for="month"> Month </label>
                        <input type="text" name="month" id="monthM" class="input" placeholder="mm">
                        <label for="day"> Day </label>
                        <input type="text" name="day" id="dayM" class="input" placeholder="dd">
                        <label for="day"> Hour </label>
                        <input type="text" name="hour" id="hourM" class="input" placeholder="hh">
                        <label for="day"> Minute </label>
                        <input type="text" name="minute" id="minuteM" class="input" placeholder="mm">
                        <input type="button" value="Modify this event!" onclick=modifyThisEvent() class="navbar-item-is-dark">
                        <input type = "button" value = "Delete this event" onclick=deleteThisEvent() class="navbar-item-is-dark">
                    </div>
                </div>
            </div>
    </nav>
        
    <!-- set the bootstrap column gridlines-->
    <div class="container mt-5 col-md-12">
            <div class="card">
                <h3 class="card-header" id="month_year">January</h3>
                <table class="table table-hover table-bordered table-responsive-sm" id="calendar">
                    <thead class="thead-dark" >
                    <tr>
                        <th>Sun</th>
                        <th>Mon</th>
                        <th>Tue</th>
                        <th>Wed</th>
                        <th>Thu</th>
                        <th>Fri</th>
                        <th>Sat</th>
                    </tr>
                    </thead>
                    <!-- id for the calendar body so we can reference it in the javascript-->
                    <!--This is where all the rows and columns for dates go-->
                    <tbody id="c_body">
                    </tbody>
                </table>
        
                <div class="form-inline">
                    <!-- make dark buttons that go with the theme and make them a suitable length so that they span the width of the calendar-->
                    <button class="btn btn-dark col-sm-6" id="previous" onclick="previous()">Previous</button>
                    <button class="btn btn-dark col-sm-6" id="next" onclick="next()">Next</button>
                </div>

                <!-- Slide bar for catergorize event -->
                <div id="catergoryBtn" class="form-inline">
                <!-- TO DO: write PHP (action) and JS -->
                <button class="btn btn-success" id="showStudy" onclick="showStudy()">Show Study</button>
                <button class="btn btn-danger" id="showPlay" onclick="showPlay()">Show Play</button>
                <button class="btn" id="showAll" onclick="grabEvents()">Show All</button>
                </div>
                <br/>              
            </div>
    </div>
    <!-- reference our javascript at the end of the html file-->
    <script src="CalendarJS.js"></script>
</body>
</html>