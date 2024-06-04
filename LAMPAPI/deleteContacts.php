<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$inData = getRequestInfo();
$contactId = $inData["id"];

if (empty($contactId)) {
    returnWithError("Contact ID is required");
    exit();
}

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

if ($conn->connect_error) {
    returnWithError($conn->connect_error);
    exit();
} else {
    $stmt = $conn->prepare("DELETE FROM Contacts WHERE ID = ?");
    $stmt->bind_param("i", $contactId);
    if ($stmt->execute()) {
        returnWithSuccess("Contact deleted successfully");
    } else {
        returnWithError($stmt->error);
    }
    $stmt->close();
    $conn->close();
}

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError($err)
{
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithSuccess($message)
{
    $retValue = json_encode(array("error" => "", "message" => $message));
    sendResultInfoAsJson($retValue);
}

?>
