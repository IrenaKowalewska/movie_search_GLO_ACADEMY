const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');

function apiSearch(event) {
    event.preventDefault();

    const searchText = document.querySelector('.form-control').value;
    const server = 'https://api.themoviedb.org/3/search/multi?api_key=7c2ee62875ea6fb1aea5a9512a985137&language=ru&query=' + searchText;
    requestApi('GET', server);
}


searchForm.addEventListener('submit', apiSearch);

function requestApi(method, url) {
    const request = new XMLHttpRequest();
    request.open(method, url);
    request.send();

    request.addEventListener('readystatechange', () => {
        if (request.readyState !== 4) return;
        if (request.status !== 200) {
            console.log("error: " + request.status);
            return;
        }
        const output = JSON.parse(request.responseText);
        let inner = '';
        output.results.forEach(function(item) {
            let nameItem = item.name || item.title;
            inner += `<div class="col-5">${nameItem}</div>`;
        });
        movie.innerHTML = inner;
        
    });
}

// 7c2ee62875ea6fb1aea5a9512a985137 