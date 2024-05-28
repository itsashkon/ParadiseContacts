<?php
	$inData = getRequestInfo();
	$phoneNumber = $inData["phoneNumber"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	else{
		$stmt = $conn->prepare("DELETE FROM Contacts WHERE PhoneNumber = ?");
		$stmt->bind_param("s", $phoneNumber);
		if($stmt->execute())
		{
			returnWithSuccess();
		}
		else
		{
			returnWithError($stmt->error);
		}
		$result = $stmt->get_result();
		$stmt->close();
		$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithSuccess()
	{
    	$retValue = json_encode(array("error" => ""));
    	sendResultInfoAsJson($retValue);
	}
?>
