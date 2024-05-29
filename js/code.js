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

let contacts = [];
let editIndex = -1;

function renderContacts() {
  const contactList = document.getElementById('contact-list');
  contactList.innerHTML = '';

  contacts.forEach((contact, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="contact-details">
        <div>${contact.firstName}</div>
        <div>${contact.lastName}</div>
        <div>${contact.phone}</div>
        <div>${contact.email}</div>
      </div>
      <div class="actions">
        <button onclick="editContact(${index})">Edit</button>
        <button onclick="confirmDelete(${index})">Delete</button>
      </div>
    `;
    contactList.appendChild(li);
  });
}

function addContact() {
  const firstName = document.getElementById('first-name').value;
  const lastName = document.getElementById('last-name').value;
  const phone = document.getElementById('phone').value;
  const email = document.getElementById('email').value;

  if (firstName && lastName && phone && email) {
    if (editIndex >= 0) {
      contacts[editIndex] = { firstName, lastName, phone, email };
      editIndex = -1;
    } else {
      contacts.push({ firstName, lastName, phone, email });
    }

    document.getElementById('first-name').value = '';
    document.getElementById('last-name').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('email').value = '';
    renderContacts();
  } else {
    alert('Please fill in all fields');
  }
}

function confirmDelete(index) {
  const confirmation = confirm('Are you sure you want to delete this contact?');
  if (confirmation) {
    deleteContact(index);
  }
}

function deleteContact(index) {
  contacts.splice(index, 1);
  renderContacts();
}

function editContact(index) {
  const contact = contacts[index];
  document.getElementById('first-name').value = contact.firstName;
  document.getElementById('last-name').value = contact.lastName;
  document.getElementById('phone').value = contact.phone;
  document.getElementById('email').value = contact.email;
  editIndex = index;
}

document.getElementById('search').addEventListener('input', function() {
  const query = this.value.toLowerCase();
  const filteredContacts = contacts.filter(contact =>
    contact.firstName.toLowerCase().includes(query) ||
    contact.lastName.toLowerCase().includes(query) ||
    contact.phone.includes(query) ||
    contact.email.toLowerCase().includes(query)
  );

  const contactList = document.getElementById('contact-list');
  contactList.innerHTML = '';

  filteredContacts.forEach((contact, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="contact-details">
        <div>${contact.firstName}</div>
        <div>${contact.lastName}</div>
        <div>${contact.phone}</div>
        <div>${contact.email}</div>
      </div>
      <div class="actions">
        <button onclick="editContact(${index})">Edit</button>
        <button onclick="confirmDelete(${index})">Delete</button>
      </div>
    `;
    contactList.appendChild(li);
  });
});
