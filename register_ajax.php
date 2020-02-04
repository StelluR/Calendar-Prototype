<?php
    header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json    

     require 'database.php';

     //Because you are posting the data via fetch(), php has to retrieve it elsewhere.
    $json_str = file_get_contents('php://input');
    //This will store the data into an associative array
    $json_obj = json_decode($json_str, true);

     $username = $json_obj['username'];
     $first_name = $json_obj['firstName'];
     $password = $json_obj['password'];

     //checks to see if the username already exists
     $stmt = $mysqli->prepare("select username from users order by id");
     if(!$stmt){
       exit;
     }
     $stmt->execute();
     $stmt->bind_result($currentUsername);   
     while($stmt->fetch()){
       if($username == $currentUsername){
         $stmt->close();
         echo json_encode(array(
            "success" => false,
            "message" => "Username already taken"
         ));
         exit;
       }
     }
     $stmt->close();

     //insert the username, firstname and password into our mySQL table
     $stmt = $mysqli->prepare("INSERT INTO users (username, first_name, password) VALUES (?, ?, ?)");
     if(!$stmt) {
        echo json_encode(array(
            "success" => false,
            "message" => "incorrect statement"
          ));
          exit;
     }
     //hash and salt the password so that our information is secure
     $stmt->bind_param('sss', $username, $first_name, password_hash($password, PASSWORD_BCRYPT));
     $stmt->execute();
     $stmt->close();

     //validates username and password by refinding information from the database
     $stmt = $mysqli->prepare("select id, username, password from users order by id");
     if(!$stmt){
        echo json_encode(array(
            "success" => false,
            "message" => "incorrect statement when refinding username/password"
        ));
        exit;    
     }
     $stmt->execute();
     $stmt->bind_result($id, $calendarUsername, $calendarPassword);

     while($stmt->fetch()){
        if($username == $calendarUsername && password_verify($password, $calendarPassword)){
            ini_set("session.cookie_httponly", 1);
            session_start();
            $_SESSION['userID'] = $id;
            $_SESSION['token'] = bin2hex(openssl_random_pseudo_bytes(32));
            $stmt->close();
          exit; 
        }
    }