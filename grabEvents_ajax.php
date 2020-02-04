<?php
header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json
require 'database.php';

//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);


$usernameForSite = $json_obj['username'];
    
    //finds id, username and passwords from the mySQL server
  $stmt = $mysqli->prepare("select username, title, start from events order by start");
  if(!$stmt){
    echo json_encode(array(
      "success" => false,
      "message" => "Couldn't prepare events statement correctly"
      ));
    exit;
  }
  $stmt->execute();
  $stmt->bind_result($username, $title, $timeStamp);


  $events = array();
  $timesFound = 0;
  while($stmt->fetch()){
    if($usernameForSite == $username){
     $timesFound = $timesFound + 1;
     $events[$timeStamp] = $title;  
       
    }
  }
    $stmt->close();
    echo json_encode(array(
        "success" => true,
        "events" => $events
     ));
     exit();
  ?>



</body>

</html>