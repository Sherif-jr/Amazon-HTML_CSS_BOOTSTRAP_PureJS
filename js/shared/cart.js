// Function to add items to the cart in IndexedDB for a specific user
/**
 *
 * @param {string} email
 * @param {{itemId: string, quantity: number}} item
 * @param {Function} [callbackfn]
 * @param {boolean} [newQuantity]
 */
function addToUserCart(email, itemId, callbackfn, newQuantity) {
  const request = indexedDB.open("CartDatabase", 1);

  request.onupgradeneeded = function (event) {
    const db = event.target.result;

    // Create an object store for the cart
    if (!db.objectStoreNames.contains("cart")) {
      const cartStore = db.createObjectStore("cart", { keyPath: "email" });
      cartStore.createIndex("email", "email", { unique: true });
    }
  };

  request.onsuccess = function (event) {
    const db = event.target.result;

    const transaction = db.transaction(["cart"], "readwrite");
    const cartStore = transaction.objectStore("cart");

    // Get the user's cart or create a new one if not exists
    const cartRequest = cartStore.get(email);

    cartRequest.onsuccess = function (event) {
      let cartData = event.target.result;

      if (!cartData) {
        // If user's cart doesn't exist, create a new one
        cartStore.add({
          email: email,
          items: [{ id: itemId, quantity: 1 }],
        });
      } else if (!newQuantity) {
        // If user's cart exists, update it with the new item
        console.log(cartData.items);
        const alreadyExist = cartData.items.filter(
          (prevItem) => prevItem.id === itemId
        );
        if (alreadyExist.length === 0) {
          cartData.items.push({ id: itemId, quantity: 1 });
        } else {
          cartData = cartData.items.map((prevItem) => {
            if (prevItem.id === itemId) {
              return { ...prevItem, quantity: Number(prevItem.quantity) + 1 };
            } else {
              return prevItem;
            }
          });
        }
        console.log(cartData);
        cartStore.put({ email: email, items: cartData });
      } else if (newQuantity) {
        cartData = cartData.items.map((prevItem) => {
          if (prevItem.id === itemId) {
            return { ...prevItem, quantity: Number(prevItem.quantity) + 1 };
          } else {
            return prevItem;
          }
        });
        console.log(cartData);
        cartStore.put({ email: email, items: cartData });
      }
      callbackfn(true);
      console.log("Item added to cart.");

      transaction.oncomplete = function () {
        db.close();
      };
    };
  };

  request.onerror = function () {
    callbackfn(false);
    console.error("Error opening database.");
  };
}

function addToAnonCart(item) {
  let inCart = sessionStorage.getItem("tempCart");
  let items = [];
  let exists = false;
  if (inCart !== null) {
    let cartItems = JSON.parse(inCart);
    items = cartItems.map((cartItem) => {
      if (cartItem.id === item.id) {
        console.log("it exists!");
        console.log(cartItem);
        cartItem.quantity += 1;
        console.log(cartItem);
        exists = true;
      }
      return cartItem;
    });
    console.log(items);
    if (!exists) {
      items.push({ id: item.id, quantity: 1 });
    }
  } else {
    items.push({ id: item.id, quantity: 1 });
  }
  sessionStorage.setItem("tempCart", JSON.stringify(items));
}

function addToCart(itemId, callbackfn) {
  const email =
    sessionStorage.getItem("loggedInEmail") ||
    localStorage.getItem("loggedInEmail");
  if (email) {
    addToUserCart(email, itemId, callbackfn);
  } else {
    addToAnonCart(itemId);
    callbackfn(true);
  }
}
function updateUserCart(email, itemsArr) {
  const request = indexedDB.open("CartDatabase", 1);
  request.onupgradeneeded = function (event) {
    console.error(
      "You can't remove an item from a database that doesn't exist!"
    );
  };
  request.onsuccess = function (event) {
    const db = event.target.result;

    const transaction = db.transaction(["cart"], "readwrite");
    const cartStore = transaction.objectStore("cart");
    cartStore.put({ email: email, items: itemsArr });
  };
}
// Function to get the cart contents for a specific user from IndexedDB
/**
 *
 * @param {string} email
 * @param {Function} callbackfn
 * @param {boolean} local
 */
function getCartContents(email, callbackfn, temp) {
  if (temp) {
    const data = sessionStorage.getItem("tempCart");
    if (data !== null) {
      let cartItems = JSON.parse(data);
      callbackfn(cartItems);
    } else {
      callbackfn([]);
    }
  } else {
    const request = indexedDB.open("CartDatabase", 1);

    request.onsuccess = function (event) {
      const db = event.target.result;

      const transaction = db.transaction(["cart"], "readonly");
      const cartStore = transaction.objectStore("cart");

      const cartRequest = cartStore.get(email);

      cartRequest.onsuccess = function (event) {
        const cartData = event.target.result;
        const cartItems = cartData ? cartData.items : [];

        callbackfn(cartItems);

        transaction.oncomplete = function () {
          db.close();
        };
      };
    };

    request.onerror = function () {
      console.error("Error opening database.");
    };
  }
}

function removeFromCart(itemId, temp, removeAll, email) {
  if (temp) {
    const data = sessionStorage.getItem("tempCart");
    const items = JSON.parse(data);
    const itemToDelete = items.find((item) => item.id === itemId);
    if (removeAll || itemToDelete.quantity == 1) {
      items.splice(items.indexOf(itemToDelete), 1);
      document.getElementById(`i${itemId}`).remove();
    } else {
      items[items.indexOf(itemToDelete)].quantity -= 1;
      document.querySelector(`#i${itemId} .qty`).textContent -= 1;
    }
    if (!items || items.length == 0) {
      console.log("Length equal zero" + items);
      document.getElementById("empty").style.display = "block";
    } else {
      console.log("Length equal more" + items);
      document.getElementById("empty").style.display = "none";
    }
    sessionStorage.setItem("tempCart", JSON.stringify(items));
  } else {
    getCartContents(
      email,
      (items) => {
        const itemToDelete = items.find((item) => item.id === itemId);
        if (removeAll || itemToDelete.quantity == 1) {
          items.splice(items.indexOf(itemToDelete), 1);
          document.getElementById(`i${itemId}`).remove();
        } else {
          items[items.indexOf(itemToDelete)].quantity -= 1;
          document.querySelector(`#i${itemId} .qty`).textContent -= 1;
        }
        if (!items || items.length == 0) {
          console.log("Length equal zero" + items);
          document.getElementById("empty").style.display = "block";
        } else {
          console.log("Length equal more" + items);
          document.getElementById("empty").style.display = "none";
        }
        updateUserCart(email, items);
      },
      temp
    );
  }
}
