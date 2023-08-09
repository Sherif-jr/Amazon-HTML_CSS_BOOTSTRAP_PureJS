//TODO uncomment database creation function
//This should ensure database is always there
createDatabase();
checkLogin();
//html elements
const loginForm = document.getElementById("authForm");

//submit event
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(loginForm.elements.rememberMe.value);
  const email = loginForm.elements.email.value;
  const password = loginForm.elements.password.value;
  const rememberMe =
    e.target.name === "login" ? loginForm.elements.rememberMe.checked : false;

  console.log(email);
  console.log(password);
  submitHandler({ email, password }, e.target.name, (success, hashedPass) => {
    console.log(success);
    if (success) {
      storeLoginInfo(email, hashedPass, rememberMe);
      window.location.href = "/";
    }
  });
});

/**
 * This function runs on start to make sure the database exists or create the needed tables if it isn't.
 */
function createDatabase() {
  const request = indexedDB.open("UserAuthDatabase", 1);

  request.onupgradeneeded = function (event) {
    const db = event.target.result;

    if (!db.objectStoreNames.contains("users")) {
      const objectStore = db.createObjectStore("users", { keyPath: "email" });
      objectStore.createIndex("email", "email", { unique: true });
    }
  };

  request.onerror = function () {
    console.error("Error creating or opening database.");
  };
}
/**
 * Creates a new record in the users table. the `callback` receives a boolean argument based on operation status, `true` for success and `false` for failure.
 *
 * @param {string} email
 * @param {string} password
 * @param {Function} callback - Receives two arguments: success status (`true`/`false`) and hashed password(`string`)
 */

async function registerUser(email, password, callback) {
  const db = await openDatabase();

  // Hash the password before storing it
  const hashedPassword = await hashPassword(password);

  const transaction = db.transaction(["users"], "readwrite");
  const objectStore = transaction.objectStore("users");

  const newUser = { email: email, password: hashedPassword };

  objectStore.add(newUser);

  transaction.oncomplete = function () {
    console.log("User registered successfully.");
    callback(true, hashedPassword);
  };

  transaction.onerror = function () {
    console.error("Error registering user.");
    callback(false);
  };

  db.close();
}

/**
 * Checks for user email existance in "users" table then compares the entered password to the stored (hashed) password. the `callback` receives a boolean argument based on operation status, `true` for success and `false` for failure.
 * @param {string} email
 * @param {string} password
 * @param {Function} [callback]
 * @param {boolean} [hashed] - Is the password hashed?
 */
async function login(email, password, callback, hashed) {
  const db = await openDatabase();

  const transaction = db.transaction(["users"], "readonly");
  const objectStore = transaction.objectStore("users");

  const getUserRequest = objectStore.get(email);

  getUserRequest.onsuccess = async function (event) {
    const user = event.target.result;

    if (!user) {
      // User not found
      callback(false);
      return;
    }
    // Compare the provided password with the hashed password using the helper function.
    const isPasswordCorrect = hashed
      ? password === user.password
      : await comparePassword(password, user.password);

    if (isPasswordCorrect) {
      // Password matches, authentication successful.
      callback(true, user.password);
    } else {
      // Password doesn't match, authentication failed.
      callback(false);
    }
  };

  getUserRequest.onerror = function () {
    // Error occurred while retrieving user data
    callback(false);
  };

  db.close();
}

//helper functions
/**
 *
 * @returns a promise that resolves to the "UserAuthDatabase" indexedDB object.
 */
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("UserAuthDatabase", 1);

    request.onsuccess = function (event) {
      const db = event.target.result;
      resolve(db);
    };

    request.onerror = function () {
      reject("Error opening database.");
    };
  });
}

/**
 * Recieves a string password and uses `bcrypt` library to hash it.
 *
 * @param {string} password
 * @returns {Promise<string>} `HashedPassword`
 */
function hashPassword(password) {
  const saltRounds = 10;
  return new Promise((resolve, reject) => {
    dcodeIO.bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) reject(err);
      resolve(hash);
    });
  });
}
/**
 * Recieves a string password and a string hash. uses `bcrypt` library to compare.
 *
 * @param {string} password
 * @returns {Promise<boolean>}
 * @returns  A boolean value that indicates whether the password and the hash match or not.
 */
function comparePassword(password, hashedPassword) {
  return new Promise((resolve, reject) => {
    dcodeIO.bcrypt.compare(password, hashedPassword, function (err, result) {
      if (err) reject(err);
      resolve(result);
    });
  });
}

function storeLoginInfo(email, hashedPass, remember) {
  // Store the logged-in user's email in localStorage/sessionStorage
  if (remember) {
    localStorage.setItem("loggedInEmail", email);
    localStorage.setItem("userPassword", hashedPass);
  } else {
    sessionStorage.setItem("loggedInEmail", email);
    sessionStorage.setItem("userPassword", hashedPass);
  }
}

function logoutUser() {
  // Clear the logged-in user data from localStorage
  localStorage.removeItem("loggedInUser");
  // You can also clear other user data like token, ID, etc., if needed
  // localStorage.removeItem('userToken');
  // localStorage.removeItem('userId');

  // Redirect the user to the login page or any other appropriate page
  window.location.href = "/login";
}

function checkLogin() {
  const location = window.location.pathname;
  const email =
    sessionStorage.getItem("loggedInEmail") ||
    localStorage.getItem("loggedInEmail");
  const hashedPassword =
    sessionStorage.getItem("userPassword") ||
    localStorage.getItem("userPassword");

  login(
    email,
    hashedPassword,
    (success) => {
      if (
        (success && location === "/login.html") ||
        (success && location === "/signup.html")
      ) {
        window.location.href = "/";
      }
    },
    true
  );
}

/**
 * handles Login & signup form submissions.
 *
 * @param {{email: string, password:string}} values - form values to store. `email` & `password`
 * @param {"login"|"signup"} action - True for signUp, false for login.
 * @param {Function} [callback] - Callback function to excute after authentcation. Recieves `true` on success`false` on failure as the first parameter. For signUp it recieves the `hashedPassword` as the second parameter.
 */
function submitHandler(values, action, callback) {
  if (action === "signup") {
    registerUser(values.email, values.password, callback);
  } else if (action === "login") {
    login(values.email, values.password, callback);
  } else {
    console.error("Missing or wrong form action. check forms names.");
  }
}
