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
async function fetchProduct(productId, callbackfn) {
  const res = await fetch(`https://fakestoreapi.com/products/${productId}`);
  const product = await res.json();
  callbackfn(product);
  return product;
}
async function fetchMoreProducts(productItemsId, callbackfn) {
  let itemsFetch = [];
  productItemsId.forEach((id) => {
    itemsFetch.push(fetch(`https://fakestoreapi.com/products/${id}`));
  });
  const res = await Promise.all(itemsFetch);
  const items = await Promise.all(
    res.map((response) => {
      return response.json();
    })
  );

  callbackfn(items);
  return items;
}
