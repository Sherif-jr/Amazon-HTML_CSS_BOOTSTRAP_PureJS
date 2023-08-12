function searchNowBaby (){
	
// // start search

document.addEventListener("DOMContentLoaded", function () {
  var iamText = document.getElementById("iamText");
  var productItems = document.querySelectorAll(".prodoC");
  var slidesImages = document.querySelectorAll(".slides-images");
  var news = document.querySelectorAll(".image");
  var curser = document.querySelector("#carouselExampleFade");

  iamText.addEventListener("input", function () {
    var searchText = iamText.value.toLowerCase();

    news.forEach(function (y) {
      y.style.display = "none";
    });

    slidesImages.forEach(function (eve) {
      eve.style.display = "none";
    });

    curser.style.display = "none";
    productItems.forEach(function (item) {
      var itemName = item.querySelector("h4").textContent.toLowerCase();
      if (itemName.includes(searchText)) {
				item.style.display = "block";
      } else {
				item.style.display = "none";
      }
    });
  });

  iamText.addEventListener("blur", function () {
    if (iamText.value === "") {
      productItems.forEach(function (item) {
				item.style.display = "block";
      });
    }
  });
  iamText.addEventListener("keyup", function (event) {
    if (event.key === "Backspace" || event.key === "Delete") {
      productItems.forEach(function (item) {
				item.style.display = "block";
      });
    }
  });
});

}
searchNowBaby ()
// end search 