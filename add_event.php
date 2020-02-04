<?php
    header("Content-Type: application/json");
    require 'database.php';
    ini_set("session.cookie_httponly", 1);
    session_start();

    $json_str = file_get_contents('php://input');
    $json_obj = json_decode($json_str, true);

    $user = $json_obj['user'];
    $title = $json_obj['title'];
    $start = $json_obj['start'];
    $category = $json_obj['category'];

    # Insert this event
    $sql = "insert into events (username, title, start, Category) values ('$user', '$title', from_unixtime($start), '$category')";
    $stmt = $mysqli->prepare($sql);
    
    
    if(!$stmt){
        echo json_encode(array(
            "success" => false,
            "message" => "Failed to prepare insert statement."));
    }
    echo json_encode(array(
        "success" => true,
        "username" => $_SESSION['user'],
        "message" => "Event is created successfully."));


    $stmt->execute();
    $stmt->close();
    exit();
?>