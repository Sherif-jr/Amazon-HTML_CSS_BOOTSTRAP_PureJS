const productsContainer = document.querySelector(".container");

const category = new URL(window.location.href).searchParams.get("category");
if (category) {
  getAllproductsOfaCategory(category, (products) => {
    products.mapToHTMLelements(
      (arrItem) => {
        let rating = Math.floor(Number(arrItem.rating.rate));
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
        return `<div class="col-md-6 col-lg-4">
          <div class="section-1">
            <a href="product.html?itemId=${arrItem.id}"><img
              src="${arrItem.image}"
              class="" alt="${arrItem.title}"></a>
          </div>
          <div class="card-body p-2 bg-light border border border-warning">
            <h5 class="card-title" class="text-uppercase; fw-bold fs-1">${
              arrItem.title.length > 35
                ? `${arrItem.title.substring(0, 35)}...`
                : arrItem.title
            }</h5>
            <p class="card-text" class="fs-3 fw-medium">${arrItem.description.substring(
              0,
              150
            )}...</p>
            <div class="stars">
              ${ratingStars.join("\n")}
              <p class="fs-2 fw-medium"><sup class="fs-5"> $ </sup>${
                Number(arrItem.price).toFixed(0) - 1
              }<sup class="fs-5">99</sup></p>
              <p>list : <span class="text-decoration-line-through">${
                Number(Number(arrItem.price).toFixed(0)) +
                Math.ceil(Number(arrItem.price) * 0.14)
              }</span></p>
              <p>ships to Egypt</p>
              <a href="/product.html?itemId=${
                arrItem.id
              }" class="btn btn-warning">add to cart</a>
            </div>
          </div>
        </div>`;
      },
      productsContainer,
      `<div class="row row-1"></div>`,
      3
    );
  });
} else {
  getAllproducts((products) => {
    products.mapToHTMLelements(
      (arrItem) => {
        let rating = Math.floor(Number(arrItem.rating.rate));
        let ratingStars = [];
        for (let i = 0; i <= 5; i++) {
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
        return `<div class="col-md-6 col-lg-4">
          <div class="section-1">
            <img
              src="${arrItem.image}"
              class="" alt="${arrItem.title}">
          </div>
          <div class="card-body p-2 bg-light border border border-warning">
            <h5 class="card-title" class="text-uppercase; fw-bold fs-1">${
              arrItem.title.length > 35
                ? `${arrItem.title.substring(0, 35)}...`
                : arrItem.title
            }</h5>
            <p class="card-text" class="fs-3 fw-medium">${arrItem.description.substring(
              0,
              150
            )}...</p>
            <div class="stars">
              ${ratingStars.join("\n")}
              <p class="fs-2 fw-medium"><sup class="fs-5"> $ </sup>${
                Number(arrItem.price).toFixed(0) - 1
              }<sup class="fs-5">99</sup></p>
              <p>list : <span class="text-decoration-line-through">$${
                Number(Number(arrItem.price).toFixed(0)) +
                Math.ceil(Number(arrItem.price) * 0.14)
              }</span></p>
              <p>ships to Egypt</p>
              <button type="button" class="btn btn-warning">add to cart</button>
            </div>
          </div>
        </div>`;
      },
      productsContainer,
      `<div class="row row-1"></div>`,
      3
    );
  });
}
