<?php
header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json
require 'database.php';

//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);


$usernameForSite = $json_obj['username'];
$passwordForSite = $json_obj['password'];
    
    //finds id, username and passwords from the mySQL server
  $stmt = $mysqli->prepare("select id, username, password, first_name from users order by id");
  if(!$stmt){
    echo json_encode(array(
      "success" => false,
      "message" => "Couldn't prepare statement correctly"
      ));
    exit;
  }
  $stmt->execute();
  $stmt->bind_result($id, $calendarUsername, $calendarPassword, $firstName);

  
  while($stmt->fetch()){
    //if the credentials are verified, store them in session variables
    if($usernameForSite == $calendarUsername && password_verify($passwordForSite, $calendarPassword)){
      ini_set("session.cookie_httponly", 1);
      session_start(); 
      $_SESSION['userID'] = $id;
      $_SESSION['user'] = $usernameForSite;
      $_SESSION['firstName'] = $firstName;
      $stmt->close();
      $_SESSION['token'] = bin2hex(openssl_random_pseudo_bytes(32));
      $tokenvar = $_SESSION['token'];
      echo json_encode(array(
        "success" => true,
        "message" => $tokenvar
      ));
      exit; 
    }
  }
    $stmt->close();
    echo json_encode(array(
    "success" => false,
    "message" => "Incorrect Username or Password"
    ));
    exit;
  ?>



</body>

</html>