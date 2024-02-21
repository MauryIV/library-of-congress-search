var searchFormEl = document.querySelector('#search-form');

function handleSearchFormSubmit(event) {
  event.preventDefault();

  var searchInputVal = document.querySelector('#search-input').value;
  var formatInputVal = document.querySelector('#format-input').value;
  let userInput = [searchInputVal, formatInputVal]
  sessionStorage.setItem("userInput", JSON.stringify(userInput))

  if (!searchInputVal) {
    console.error('You need a search input value!');
    return;
  }

  let storedInput = JSON.parse(sessionStorage.getItem("userInput"))
  var queryString = './search-results.html?q=' + storedInput[0] + '&format=' + storedInput[1];

  location.assign(queryString);
}

searchFormEl.addEventListener('submit', handleSearchFormSubmit);
