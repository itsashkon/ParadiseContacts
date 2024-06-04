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

// Map request field names to database column names
$fieldMappings = [
    "firstName"      => "FirstName",
    "lastName"       => "LastName",
    "emailAddress"   => "EmailAddress",
    "phoneNumber"    => "PhoneNumber"
];

$updateFields = [];
$updateValues = [];
$paramTypes = "";

foreach ($fieldMappings as $requestField => $dbColumn) {
    if (isset($inData[$requestField])) {
        $updateFields[] = "`$dbColumn` = ?";
        $updateValues[] = $inData[$requestField];
        $paramTypes .= "s";
    }
}

if (empty($updateFields)) {
    returnWithError("No fields to update");
    exit();
}

$sql = "UPDATE Contacts SET " . implode(", ", $updateFields) . " WHERE ID = ?";
$updateValues[] = $contactId; // Add the contactId to the values
$paramTypes .= "i"; // Add 'i' for the integer contactId

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

if ($conn->connect_error) {
    returnWithError($conn->connect_error);
    exit();
} else {
    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        returnWithError($conn->error);
        exit();
    }

    // Bind parameters dynamically
    $stmt->bind_param($paramTypes, ...$updateValues);

    if ($stmt->execute()) {
        returnWithSuccess("Contact updated successfully");
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
