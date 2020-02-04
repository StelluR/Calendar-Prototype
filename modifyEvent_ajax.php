<?php
    header("Content-Type: application/json");
    require 'database.php';
    ini_set("session.cookie_httponly", 1);
    session_start();

    $json_str = file_get_contents('php://input');
    $json_obj = json_decode($json_str, true);

    //checks against CSRF attacks
    if(isset($_SESSION['token'])){
      if(!hash_equals($_SESSION['token'], $json_obj['token'])){
        die("Request forgery detected");
      }
    }

    $user = $json_obj['user'];
    $oldTitle = $json_obj['oldTitle'];
    $oldStart = $json_obj['oldTimestamp'];
    $newTitle = $json_obj['newtitle'];
    $newStart = $json_obj['newTimestamp'];
    
    // $vars = array();
    // array_push($vars, $user, $oldTitle, $oldStart, $newTitle, $newStart);
    // echo json_encode(array(
    //   "success" => false,
    //   "message" => $vars
    //   ));
    // exit;

    $stmt = $mysqli->prepare("UPDATE events SET title = ?, start = from_unixtime(?) WHERE username = ? and start = from_unixtime(?) and title = ?");
    if(!$stmt){
        echo json_encode(array(
          "success" => false,
          "message" => "Couldn't prepare statement correctly"
          ));
        exit;
      }
 
    $stmt->bind_param('sssss', $newTitle, $newStart,$user, $oldStart, $oldTitle);

    $stmt->execute();

    $stmt->close();
    echo json_encode(array(
      "success" => true,
      "message" => "Updated event successfully"
      ));
    exit;


?>