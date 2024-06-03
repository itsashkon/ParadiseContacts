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

    document.getElementById("signup-username").addEventListener("input", function() {
        checkUsernameComplexity(this.value);
    });

    document.getElementById("signup-pass").addEventListener("input", function() {
        checkPasswordComplexity(this.value, "signup-");
        });
    });

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

function checkUsernameComplexity(username) {
    const minLength = 3;
    const maxLength = 11;
    const hasLetter = /[A-Za-z]/;

    let length = document.getElementById("username-length");
    let letter = document.getElementById("username-letter");

    if (username.length >= minLength && username.length <= maxLength) {
        length.classList.remove("invalid");
        length.classList.add("valid");
    } else {
        length.classList.remove("valid");
        length.classList.add("invalid");
    }

    if (hasLetter.test(username)) {
        letter.classList.remove("invalid");
        letter.classList.add("valid");
    } else {
        letter.classList.remove("valid");
        letter.classList.add("invalid");
    }
}

function checkPasswordComplexity(password, prefix) {
    const minLength = 8;
    const maxLength = 24;
    const hasNumber = /\d/;
    const hasLetter = /[A-Za-z]/;
    const hasSpecialChar = /[!@#$%^&*]/;

    let length = document.getElementById(prefix + "length");
    let number = document.getElementById(prefix + "number");
    let letter = document.getElementById(prefix + "letter");
    let special = document.getElementById(prefix + "special");

    if (password.length >= minLength && password.length <= maxLength) {
        length.classList.remove("invalid");
        length.classList.add("valid");
    } else {
        length.classList.remove("valid");
        length.classList.add("invalid");
    }

    if (hasNumber.test(password)) {
        number.classList.remove("invalid");
        number.classList.add("valid");
    } else {
        number.classList.remove("valid");
        number.classList.add("invalid");
    }

    if (hasLetter.test(password)) {
        letter.classList.remove("invalid");
        letter.classList.add("valid");
    } else {
        letter.classList.remove("valid");
        letter.classList.add("invalid");
    }

    if (hasSpecialChar.test(password)) {
        special.classList.remove("invalid");
        special.classList.add("valid");
    } else {
        special.classList.remove("valid");
        special.classList.add("invalid");
    }
}

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
                saveGlobalId(userId);
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
    let login = document.getElementById("signup-username").value;
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
                    document.getElementById("signupResult").innerHTML = "User has been successfully registered!";
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
    let firstName = document.getElementById("first-name").value;
    let lastName = document.getElementById("last-name").value;
    let phoneNumber = document.getElementById("phone").value;
    let emailAddress = document.getElementById("email").value; // Added email field

    let tmp = {firstName: firstName, lastName: lastName, phoneNumber: phoneNumber, emailAddress: emailAddress, userId: getGlobalId()}; // Include userId
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

    let url = urlBase + '/LAMPAPI/searchContacts.' + extension;

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

    function getGlobalId(){
        return localStorage.getItem('globalId');
    }
    
    function saveGlobalId(Id){
        console.log("globalId saved as:" + Id);
        localStorage.setItem('globalId',Id);
    }

function loadContacts() {
    let tmp = {
        search: "",
        userId: getGlobalId()
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/LAMPAPI/searchContacts.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.error) {
                    console.log(jsonObject.error);
                    return;
                }
                let row = "<table border='1'>"
                for (let i = 0; i < jsonObject.results.length; i++) {
                    text += "<tr id='row" + i + "'>";
                    text += "<td id='first_Name" + i + "'><span>" + jsonObject.results[i].FirstName + "</span></td>";
                    text += "<td id='last_Name" + i + "'><span>" + jsonObject.results[i].LastName + "</span></td>";
                    text += "<td id='email" + i + "'><span>" + jsonObject.results[i].EmailAddress + "</span></td>";
                    text += "<td id='phone" + i + "'><span>" + jsonObject.results[i].PhoneNumber + "</span></td>";
                    text += "<tr/>"
                }
                text += "</table>"
                document.getElementById("contacts-table-body").innerHTML = text;
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}
