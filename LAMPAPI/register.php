<?php

	$inData = getRequestInfo();
	$firstName = $inData["firstName"];
	$lastName  = $inData["lastName"];
	$login	   = $inData["login"];
	$password  = $inData["password"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	
	if($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	else
	{
		$sql = 'SELECT COUNT(*) AS count FROM Users WHERE Login=?'; // counts if the username is already in the db, if it is, then cannot use name
		$stmt = $conn->prepare($sql);
		$stmt->bind_param("s", $login);
		$stmt->execute();
		$result = $stmt->get_result();
		$row = $result->fetch_assoc();

		if($row['count'] != 0) {
			returnWithError("Username already taken");	
		}
	
		else
		{
			$sql = "INSERT INTO Users (FirstName, LastName, Login, Password) VALUES (?, ?, ?, ?)";
			$stmt = $conn->prepare($sql);
			$stmt->bind_param("ssss", $firstName, $lastName, $login, $password);
			if($stmt->execute())
			{
				returnWithSuccess();
			}
			else
			{
	            returnWithError($stmt->error);
 
			}		
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
