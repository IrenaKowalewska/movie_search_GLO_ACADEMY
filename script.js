const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');

function apiSearch(event) {
    event.preventDefault();

    const searchText = document.querySelector('.form-control').value;
    const server = 'https://api.themoviedb.org/3/search/multi?api_key=7c2ee62875ea6fb1aea5a9512a985137&language=ru&query=' + searchText;
    movie.innerHTML = 'ЗАГРУЗКА...';
    requestApi(server)
    .then(function(result) { //result  это request.response
        const output = JSON.parse(result);
        let inner = '';
        output.results.forEach(function(item) {
            let nameItem = item.name || item.title;
            inner += `<div class="col-5">${nameItem}</div>`;
        });
        movie.innerHTML = inner;
    })
    .catch(function(reason) {
        movie.innerHTML = 'УПС... что-то пошло не так...';
        console.log("error: " + reason.status);
    });
}


searchForm.addEventListener('submit', apiSearch);

function requestApi(url) {
    return new Promise(function(resolve, reject) {
        const request = new XMLHttpRequest();
        request.open('GET', url);
        //ошибка 404 попадет в load, а не error - поэтому !== 200
        request.addEventListener('load', function() {
            if (request.status !== 200) {
                reject({status: request.status});
                return;
            }

            resolve(request.response);
        });
        request.addEventListener('error', function() {
            reject({status: request.status});
        });
        request.send();
    });

}   
    