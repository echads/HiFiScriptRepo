<?php
$allowed = array("file://","https://wolfgangs.github.io");

$index = array_search($_SERVER["HTTP_ORIGIN"],$allowed);

if($index !== false)header("Access-Control-Allow-Origin: {$allowed[$index]}", false);

echo file_get_contents("repo.json");
