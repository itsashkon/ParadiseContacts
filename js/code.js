const urlBase = 'http://smallcopproject.com';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("logForm").addEventListener("submit", function(event) {
        event.preventDefault();
        doLogin();
    });

    document.getElementById("signupForm").addEventListener("submit", function(event) {
        event.preventDefault();
        doSignup();
    });

    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
        logoutButton.addEventListener("click", function() {
            doLogout();
        });
    }

    document.getElementById("addContactForm").addEventListener("submit", function(event) {
        event.preventDefault();
        addContact();
    });

    document.getElementById("searchContactForm").addEventListener("submit", function(event) {
        event.preventDefault();
        searchContact();
    });

    document.getElementById("removeContactForm").addEventListener("submit", function(event) {
        event.preventDefault();
        removeContact();
    });
});

function doLogin() {
    userId = 0;
    firstName = "";
    lastName = "";

    let login = document.getElementById("user").value;
    let password = document.getElementById("pass").value;
    var hash = md5(password);

    console.log("Login:", login);
    console.log("Hashed Password:", hash);


    document.getElementById("loginResult").innerHTML = "";

    let tmp = {login: login, password: hash};
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/LAMPAPI/login.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.id;

                if (userId < 1) {
                    document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
                    return;
                }

                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;

                saveCookie();

                window.location.href = "home.html";
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("loginResult").innerHTML = err.message;
    }
}

function doSignup() {
    let firstname = document.getElementById("firstname").value;
    let lastname = document.getElementById("lastname").value;
    let login = document.getElementById("username").value;
    let password = document.getElementById("signup-pass").value;
    var hash = md5(password);

    document.getElementById("signupResult").innerHTML = "";

    let tmp = {firstName: firstname, lastName: lastname, login: login, password: hash};
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/LAMPAPI/register.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.error) {
                    document.getElementById("signupResult").innerHTML = jsonObject.error;
                } else {
                    document.getElementById("signupResult").innerHTML = "User has been registered successfully";
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("signupResult").innerHTML = err.message;
    }
}

function saveCookie() {
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie() {
    userId = -1;
    let data = document.cookie;
    let splits = data.split(",");
    for (var i = 0; i < splits.length; i++) {
        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");
        if (tokens[0] == "firstName") {
            firstName = tokens[1];
        } else if (tokens[0] == "lastName") {
            lastName = tokens[1];
        } else if (tokens[0] == "userId") {
            userId = parseInt(tokens[1].trim());
        }
    }

    if (userId < 0) {
        window.location.href = "index.html";
    }
}

function doLogout() {
    userId = 0;
    firstName = "";
    lastName = "";
    document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "lastName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "userId= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "index.html";
}

function addContact() {
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let phoneNumber = document.getElementById("phoneNumber").value;
    let emailAddress = document.getElementById("emailAddress").value; // Added email field

    let tmp = {firstName: firstName, lastName: lastName, phoneNumber: phoneNumber, emailAddress: emailAddress, userId: userId}; // Include userId
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/LAMPAPI/addContacts.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.error) {
                    document.getElementById("addContactResult").innerHTML = jsonObject.error;
                } else {
                    document.getElementById("addContactResult").innerHTML = "Contact has been added successfully";
                    document.getElementById("addContactForm").reset();
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("addContactResult").innerHTML = err.message;
    }
}

function searchContact() {
    let srch = document.getElementById("searchText").value;
    document.getElementById("contactSearchResult").innerHTML = "";

    let contactList = "";

    let tmp = {search: srch, userId: userId};
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/SearchContacts.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
                let jsonObject = JSON.parse(xhr.responseText);

                for (let i = 0; i < jsonObject.results.length; i++) {
                    contactList += jsonObject.results[i];
                    if (i < jsonObject.results.length - 1) {
                        contactList += "<br />\r\n";
                    }
                }

                document.getElementsByTagName("p")[0].innerHTML = contactList;
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("contactSearchResult").innerHTML = err.message;
    }

    function removeContact() {
        let contactId = document.getElementById("contactId").value;
    
        let tmp = {id: contactId, userId: userId};
        let jsonPayload = JSON.stringify(tmp);
    
        let url = urlBase + '/LAMPAPI/deleteContact.' + extension; 
    
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try {
            xhr.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    let jsonObject = JSON.parse(xhr.responseText);
                    if (jsonObject.error) {
                        document.getElementById("removeContactResult").innerHTML = jsonObject.error;
                    } else {
                        document.getElementById("removeContactResult").innerHTML = "Contact has been deleted successfully";
                        document.getElementById("removeContactForm").reset();
                    }
                }
            };
            xhr.send(jsonPayload);
        } catch (err) {
            document.getElementById("removeContactResult").innerHTML = err.message;
        }
    }
    
}
