const itemscontainer = document.getElementById("itemscontainer");
//to choose the source of the cart data we need to to check the login state
const authState = new URL(window.location.href).searchParams.get("auth");
if (authState && authState !== "0") {
  const email =
    sessionStorage.getItem("loggedInEmail") ||
    localStorage.getItem("loggedInEmail");
  console.log("auth true");
  getCartContents(
    email,
    (cartItems) => {
      if (cartItems && cartItems.length > 0) {
        document.getElementById("empty").style.display = "none";
        console.log(cartItems);
        const cartIds = cartItems.map((cartItem) => cartItem.id);
        fetchMoreProducts(cartIds, (items) => {
          items.mapToHTMLelements((arrItem, i) => {
            return `<div class="chart-ama" id="i${arrItem.id}">
          <a href="/Product.html?itemId=${arrItem.id}"><img width="200" src="${
              arrItem.image
            }" alt=""></a>
          <div class="text-cart">
            <p id="title">${arrItem.title}</p>
            <span class="price">$<span id="price">${arrItem.price}</span></span>
            <p>Eligible for FREE delivery</p>

            <p> Qty: <span class="qty">${cartItems[i].quantity}</span></p>
            <button class="btn btn-success" onclick="addToCart(${
              arrItem.id
            },(success)=>{uiAddOneMore(${arrItem.id})})">+</button>
            <span style="display: inline-block; margin-left: 10px; font-size: 20px; color: #aaa;">|</span>
            <button class="btn btn-warning" onclick="removeFromCart(${
              arrItem.id
            },${false},${false},'${email}')">-</button>
            <span style="display: inline-block; margin-left: 10px; font-size: 20px; color: #aaa;">|</span>
            <button class="btn btn-danger" onclick="removeFromCart(${
              arrItem.id
            },${false},${true},'${email}')">Delete</button>
          </div>
        </div>`;
          }, itemscontainer);
        });
      } else {
        document.getElementById("empty").style.display = "block";
      }
    },
    false
  );
} else if (authState === "0" || !authState) {
  console.log("auth false");
  getCartContents(
    undefined,
    (cartItems) => {
      if (cartItems && cartItems.length > 0) {
        document.getElementById("empty").style.display = "none";
        const cartIds = cartItems.map((cartItem) => cartItem.id);
        fetchMoreProducts(cartIds, (items) => {
          items.mapToHTMLelements((arrItem, i) => {
            return `<div class="chart-ama" id="i${arrItem.id}">
          <a href="/Product.html?itemId=${arrItem.id}"><img width="200" src="${
              arrItem.image
            }" alt=""></a>
          <div class="text-cart">
            <p id="title">${arrItem.title}</p>
            <span class="price">$<span id="price">${arrItem.price}</span></span>
            <p>Eligible for FREE delivery</p>

            <p> Qty: <span class="qty">${cartItems[i].quantity}</span></p>
            <button class="btn btn-success" onclick="console.log('A');addToAnonCart(${
              arrItem.id
            });uiAddOneMore(${arrItem.id});">+</button>
            <span style="display: inline-block; margin-left: 10px; font-size: 20px; color: #aaa;">|</span>
            <button class="btn btn-warning" onclick="removeFromCart(${
              arrItem.id
            },${true},${false})">-</button>
            <span style="display: inline-block; margin-left: 10px; font-size: 20px; color: #aaa;">|</span>
            <button class="btn btn-danger" onclick="removeFromCart(${
              arrItem.id
            },${true},${true})">Delete</button>
          </div>
        </div>`;
          }, itemscontainer);
        });
      }
    },
    true
  );
}

function uiAddOneMore(itemId) {
  document.querySelector(`#i${itemId} .qty`).textContent =
    parseInt(document.querySelector(`#i${itemId} .qty`).textContent) + 1;
}
