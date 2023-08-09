const navContainer = document.querySelector(".second-2 ul");

getAllCatergories((categories) => {
  categories.mapToHTMLelements((arrItem) => {
    const title = `${arrItem[0].toUpperCase()}${arrItem.substring(1)}`;
    return `<li><a href=/products.html?category=${encodeURIComponent(
      arrItem
    )}>${title}</a></li>`;
  }, navContainer);
});
