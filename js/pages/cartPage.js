const itemscontainer = document.getElementById("itemscontainer");
//to choose the source of the cart data we need to to check the login state
const authState = new URL(window.location.href).searchParams.get("auth");
if (authState) {
  getCartContents(
    undefined,
    (cartItems) => {
      if (cartItems && cartItems.length > 0) {
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
            <button class="btn btn-success">+</button>
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

fetchMoreProducts([9, 10], (items) => {
  console.log(items);
});
