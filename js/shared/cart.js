// Function to add items to the cart in IndexedDB for a specific user
/**
 *
 * @param {string} email
 * @param {{itemId: string, quantity: number}} item
 * @param {Function} [callbackfn]
 * @param {boolean} [newQuantity]
 */
function addToCart(email, item, callbackfn, newQuantity) {
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
      const cartData = event.target.result;

      if (!cartData) {
        // If user's cart doesn't exist, create a new one
        cartStore.add({
          email: email,
          items: [{ itemId: item.itemId, quantity: 1 }],
        });
      } else if (!newQuantity) {
        // If user's cart exists, update it with the new item
        const alreadyExist = cartData.items.filter(
          (prevItem) => prevItem.itemId === item.itemId
        );
        if (alreadyExist.length === 0) {
          cartData.items.push({ itemId: item.itemId, quantity: 1 });
        } else {
          cartData = cartData.items.map((prevItem) => {
            if (prevItem.itemId === item.itemId) {
              return { ...prevItem, quantity: Number(prevItem.quantity) + 1 };
            } else {
              return prevItem;
            }
          });
        }
        cartStore.put(cartData);
      } else if (newQuantity) {
        cartData = cartData.items.map((prevItem) => {
          if (prevItem.itemId === item.itemId) {
            return { ...prevItem, quantity: Number(prevItem.quantity) + 1 };
          } else {
            return prevItem;
          }
        });
        cartStore.put(cartData);
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

// Function to get the cart contents for a specific user from IndexedDB
function getCartContents(email, callback) {
  const request = indexedDB.open("CartDatabase", 1);

  request.onsuccess = function (event) {
    const db = event.target.result;

    const transaction = db.transaction(["cart"], "readonly");
    const cartStore = transaction.objectStore("cart");

    const cartRequest = cartStore.get(email);

    cartRequest.onsuccess = function (event) {
      const cartData = event.target.result;
      const cartItems = cartData ? cartData.items : [];

      callback(cartItems);

      transaction.oncomplete = function () {
        db.close();
      };
    };
  };

  request.onerror = function () {
    console.error("Error opening database.");
  };
}
