/**
 *
 *
 * @param {Function} callbackfn - Receives each element of the array and its index as arguments. Should return html elements in a string.
 * @param {HTMLElement} parentElement - The element that all the array elements will be appended to.
 * @param {string} [someElementsWrapper] - A wrapper for every number of elements.
 * @param {HTMLElement} [numberOfElementsToWrap] - Number of elements to be wrapped.
 */
Array.prototype.mapToHTMLelements = function (
  callbackfn,
  parentElement,
  someElementsWrapper,
  numberOfElementsToWrap
) {
  const elementsArr = this.map(callbackfn);
  if (!someElementsWrapper) {
    elementsArr.forEach((element, index) => {
      parentElement.innerHTML += element;
    });
  } else {
    if (!numberOfElementsToWrap || Number(numberOfElementsToWrap) === NaN) {
      parentElement.innerHTML += someElementsWrapper;
      elementsArr.forEach((element, index) => {
        parentElement.lastElementChild.innerHTML += element;
      });
    } else {
      let newElementsArr = [];
      elementsArr.forEach((item) => {
        if (newElementsArr.length > 0) {
          if (
            Array.isArray(newElementsArr[newElementsArr.length - 1]) &&
            newElementsArr[newElementsArr.length - 1].length <
              numberOfElementsToWrap
          ) {
            newElementsArr[newElementsArr.length - 1].push(item);
          } else {
            newElementsArr.push([item]);
          }
        } else {
          newElementsArr.push([item]);
        }
      });
      newElementsArr.forEach((itemsCollection) => {
        parentElement.innerHTML += someElementsWrapper;
        itemsCollection.forEach((item) => {
          parentElement.lastElementChild.innerHTML += item;
        });
      });
    }
  }
};

let notificationVisible = false;
function notify(title, body, timeToLast, type) {
  clearTimeout(leave);
  document.getElementById("notiTitle").innerText = title;
  document.getElementById("notiBody").innerText = body;
  document.getElementById("notify").style.display = "block";
  var leave = setTimeout(() => {
    document.getElementById("notify").style.display = "none";
    notificationVisible = false;
  }, timeToLast);
}
