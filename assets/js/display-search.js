var resultTextEl = document.querySelector('#result-text');
var resultContentEl = document.querySelector('#result-content');
var searchFormEl = document.querySelector('#search-form');
var prevPage = document.querySelector("#prev")
var pageNum = document.querySelector("#page-number")
var nextPage = document.querySelector("#next")
var order = document.querySelector("#page-order")
var pageSort = "date"
var pageNumber = 1
var storedInput = JSON.parse(sessionStorage.getItem("userInput"))
var format = storedInput[1]
var query = storedInput[0]

function getParams() {
  searchApi(query, format);
}

function printResults(resultObj) {
  // console.log(resultObj);

  // set up `<div>` to hold result content
  var resultCard = document.createElement('div');
  resultCard.classList.add('card', 'bg-light', 'text-dark', 'mb-3', 'p-3');

  var resultBody = document.createElement('div');
  resultBody.classList.add('card-body');
  resultCard.append(resultBody);

  var titleEl = document.createElement('h3');
  titleEl.textContent = resultObj.title;

  var bodyContentEl = document.createElement('p');
  bodyContentEl.innerHTML =
    '<strong>Date:</strong> ' + resultObj.date + '<br/>';

  if (resultObj.subject) {
    bodyContentEl.innerHTML +=
      '<strong>Subjects:</strong> ' + resultObj.subject.join(', ') + '<br/>';
  } else {
    bodyContentEl.innerHTML +=
      '<strong>Subjects:</strong> No subject for this entry.';
  }

  if (resultObj.description) {
    bodyContentEl.innerHTML +=
      '<strong>Description:</strong> ' + resultObj.description[0];
  } else {
    bodyContentEl.innerHTML +=
      '<strong>Description:</strong>  No description for this entry.';
  }

  var linkButtonEl = document.createElement('a');
  linkButtonEl.textContent = 'Read More';
  linkButtonEl.setAttribute('href', resultObj.url);
  linkButtonEl.classList.add('btn', 'btn-dark');

  resultBody.append(titleEl, bodyContentEl, linkButtonEl);

  resultContentEl.append(resultCard);
}

function searchApi(query, format) {
  var locQueryUrl = 'https://www.loc.gov/search/?fo=json';

  if (format) {
    locQueryUrl = 'https://www.loc.gov/' + format + '/?fo=json';
  }

  locQueryUrl = locQueryUrl + '&q=' + query + "&sb=" + pageSort + "&sp=" + pageNumber;

  pageNum.textContent = "Page " + pageNumber

  fetch(locQueryUrl)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }

      return response.json();
    })
    .then(function (locRes) {
      // write query to page so user knows what they are viewing
      resultTextEl.textContent = locRes.search.query;

      console.log(locRes);

      if (!locRes.results.length) {
        console.log('No results found!');
        resultContentEl.innerHTML = '<h3>No results found, search again!</h3>';
      } else {
        resultContentEl.textContent = '';
        for (var i = 0; i < locRes.results.length; i++) {
          printResults(locRes.results[i]);
        }
      }
    })
    .catch(function (error) {
      console.error(error);
    });
}

function handleSearchFormSubmit(event) {
  event.preventDefault();

  var searchInputVal = document.querySelector('#search-input').value;
  var formatInputVal = document.querySelector('#format-input').value;

  let userInput = [searchInputVal, formatInputVal]
  sessionStorage.setItem("userInput", JSON.stringify(userInput))

  let storedInput = JSON.parse(sessionStorage.getItem("userInput"))
  var queryString = './search-results.html?q=' + storedInput[0] + '&format=' + storedInput[1];

  location.assign(queryString);

  if (!searchInputVal) {
    console.error('You need a search input value!');
    return;
  }

  getParams();
}

function pageFunc(query, format) {
  var locQueryUrl = 'https://www.loc.gov/search/?fo=json';

  if (format) {
    locQueryUrl = 'https://www.loc.gov/' + format + '/?fo=json';
  }

  locQueryUrl = locQueryUrl + '&q=' + query + "&sb=" + pageSort + "&sp=" + pageNumber;
  
  pageNum.textContent = "Page " + pageNumber

  fetch(locQueryUrl)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }

      return response.json();
    })
    .then(function (locRes) {
      // write query to page so user knows what they are viewing
      resultTextEl.textContent = locRes.search.query;
      // var pageTotal = locRes.pagination.page_list.length
      if (!locRes.results.length) {
        console.log('No results found!');
        resultContentEl.innerHTML = '<h3>No results found, search again!</h3>';
      } else {
        resultContentEl.textContent = '';
        for (let i = 0; i < locRes.results.length; i++) {
          printResults(locRes.results[i]);
        }
      }
    })
    .catch(function (error) {
      console.error(error);
      resultContentEl.innerHTML = '<h3>No more pages to be found.</h3>';
    });
}

nextPage.addEventListener("click", function() {
  pageNumber++
  pageFunc(query, format)
})

prevPage.addEventListener("click", function() {
  if (pageNumber > 1) {
    pageNumber--
    pageFunc(query, format)
  }
})

order.addEventListener("click", function() {
  if (pageSort == "date") {
    pageSort = "date_desc"
    pageNumber = 1
    pageFunc(query, format)
    return
  }
  if (pageSort == "date_desc") {
    pageSort = "date"
    pageNumber = 1
    pageFunc(query, format)
    return
  }
})

searchFormEl.addEventListener('submit', handleSearchFormSubmit);

getParams();
