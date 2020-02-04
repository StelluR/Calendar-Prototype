<?php

require 'database.php';
ini_set("session.cookie_httponly", 1);
session_start();

$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);

if(isset($_SESSION['token'])){
  if(!hash_equals($_SESSION['token'], $json_obj['token'])){
    die("Request forgery detected");
  }
}

$user = $json_obj['user'];
$title = $json_obj['title'];
$start = $json_obj['timestamp'];


# delete this event
$stmt = $mysqli->prepare("DELETE from events WHERE username= ? AND title= ? AND start=from_unixtime(?)");

if(!$stmt){
    echo json_encode(array(
      "success" => false,
      "message" => "Couldn't prepare statement correctly"
      ));
    exit;
}
$stmt->bind_param('sss', $user, $title, $start);

$stmt->execute();
$stmt->close();
echo json_encode(array(
    "success" => true,
    "message" => "Deleted event successfully"
    ));
exit;

?>