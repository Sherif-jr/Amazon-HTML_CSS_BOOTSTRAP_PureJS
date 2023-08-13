//html elements
const container = document.getElementById("product");
const spinner = document.getElementById("spinnerContainer");
const productImg = document.getElementById("product-image");
const productTitle = document.getElementById("productTitle");
const productDescr = document.getElementById("productDescr");
const productPrices = Array.from(document.getElementsByClassName("price"));
const productOldPrice = Array.from(
  document.getElementsByClassName("old-price")
);
const ratingContainer = document.getElementById("stars");
const prodRating = document.getElementById("rating");
const ratingsNum = document.getElementById("ratings");

const addCartBtn = document.getElementById("addCart");
const item = new URL(window.location.href).searchParams.get("itemId");
spinner.style.display = "flex";
if (item) {
  fetchProduct(item, (item) => {
    console.log(item);
    //Rating Stars
    let rating = Math.floor(Number(item.rating.rate));
    let ratingStars = [];
    for (let i = 0; i < 5; i++) {
      if (i <= rating) {
        ratingStars.push(
          `<i class="fa-solid fa-star" style="color: #ffe414;"></i>`
        );
      } else {
        ratingStars.push(
          `<i class="fa-regular fa-star" style="color: #ffe414;"></i>`
        );
      }
    }
    ratingContainer.innerHTML = `${ratingStars.join("\n")}`;
    //rating number
    prodRating.innerText = item.rating.rate;
    ratingsNum.innerText = item.rating.count;
    productImg.setAttribute("src", item.image);
    productTitle.innerText = item.title;
    productDescr.innerText = item.description;
    console.log(productPrices);
    productPrices.forEach((priceItem) => {
      priceItem.innerText = Number(item.price).toFixed(0) - 1;
    });
    productOldPrice.forEach((priceItem) => {
      priceItem.innerText = `$${
        Number(Number(item.price).toFixed(0)) +
        Math.ceil(Number(item.price) * 0.14)
      }`;
    });
    spinner.style.display = "none";
  });
}

addCartBtn.onclick = function () {
  if (item) {
    fetchProduct(item, (product) => {
      console.log(product);
      addToCart(product.id, (success) => {
        if (success) {
          notify("Add to Cart", "Item was added to cart successfully!", 5000);
        }
      });
      notify("Add to Cart", "Item was added to cart successfully!", 5000);
    });
  }
};
