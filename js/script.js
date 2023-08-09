let login;
createDatabase();
// Check if the user is already logged in when the page loads
document.addEventListener("DOMContentLoaded", function () {
  const loggedInUser = localStorage.getItem("loggedInUser");
  if (loggedInUser) {
    // User is already logged in, show the authenticated content
    login = true;
    // restoreCart(loggedInUser);
  } else {
    // User is not logged in or localStorage is empty
    login = false;
  }
});

// Example authentication:
login("someOne", "pass", function (isAuthenticated) {
  if (isAuthenticated) {
    login = true;
    onSuccessfulLogin("someOne");
    console.log("Login successful.");
  } else {
    login = false;
    console.log("Invalid credentials.");
  }
});

function updateCart(itemID) {
  if (login) {
  } else {
    const itemsStr = localStorage.getItem("cart");
    const itemsArr = JSON.parse(itemsStr);
    console.log(itemsArr);
  }
}
