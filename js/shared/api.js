function appendSearchParams(key, value) {}
async function getAllCatergories(callbackfn) {
  const res = await fetch("https://fakestoreapi.com/products/categories");
  /**
   * @type {Array<string>}
   */
  const categories = await res.json();
  callbackfn(categories);
  return categories;
}
async function getAllproductsOfaCategory(category, callbackfn) {
  const res = await fetch(
    `https://fakestoreapi.com/products/category/${category}`
  );
  const products = await res.json();
  callbackfn(products);
  return products;
}
async function getAllproducts(callbackfn) {
  const res = await fetch(`https://fakestoreapi.com/products`);
  const products = await res.json();
  callbackfn(products);
  return products;
}
async function fetchProducts(productItemsIds, callbackfn) {
  const promisesArr = productItemsIds.map((productId) => {
    return fetch(`https://fakestoreapi.com/products/${productId}`);
  });

  const products = await Promise.all(promisesArr);
  callbackfn(products);
  return products;
}
// getAllCatergories();
