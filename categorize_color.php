<?php
header("Content-Type: application/json");
require 'database.php';

$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);

$usernameForSite = '"'.$json_obj['username'].'"';
$category = '"'.$json_obj['category'].'"';

$test = 'SELECT start, Category FROM events WHERE username='.$usernameForSite;
$stmt = $mysqli->prepare($test);

if(!$stmt){
    echo json_encode(array(
        "success" => false,
        "message" => "Couldn't prepare events statement correctly"
        ));
    exit;
}

$stmt->execute();
$stmt->bind_result($timeStamp, $category);

$events = array();
$timesFound = 0;
while($stmt->fetch()){
    $timesFound = $timesFound + 1;
    $events[$timeStamp] = $category;  
}

$stmt->close();

echo json_encode(array(
    "success" => true,
    "events" => $events
    ));
    exit();
?>