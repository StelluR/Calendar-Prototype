<?php
// Content of database.php

// $mysqli = new mysqli('localhost', '', '', 'calendar');
// $mysqli2 = new mysqli('localhost', '', '', 'calendar');
$mysqli = new mysqli('', '', '', '');

if($mysqli->connect_errno) {
	printf("Connection Failed: %s\n", $mysqli->connect_error);
	exit;
}
?>