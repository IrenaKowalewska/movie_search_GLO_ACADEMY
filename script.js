const searchForm = document.querySelector('#search-form');

function apiSearch(event) {
    event.preventDefault();

    const searchText = document.querySelector('.form-control').value;
    const server = 'https://www.themoviedb.org/';
}


searchForm.addEventListener('submit', apiSearch);

function requestApi(url) {
    return url;
}