const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');
const urlPoster = 'https://image.tmdb.org/t/p/w500';

function apiSearch(event) {
    event.preventDefault();

    const searchText = document.querySelector('.form-control').value;
    if (searchText.trim().length === 0) {
        movie.innerHTML = `<h2 class="col-12 text-center text-danger">ПОЛЕ ВВОДА ДОЛЖНО БЫТЬ ЗАПОЛНЕНО</h2>`;
        return;
    }
    const server = 'https://api.themoviedb.org/3/search/multi?api_key=7c2ee62875ea6fb1aea5a9512a985137&language=ru&query=' + searchText;
    movie.innerHTML = `<div class="spinner"></div>`;

    fetch(server)
        .then(function(value) {
            if (value.status !== 200) {
                return Promise.reject(value);
            }
            return value.json();
        })
        .then(function(output) {
            // console.log(output);
            let inner = '';
                if (output.results.length === 0) {
                    inner = `<h2 class="col-12 text-center text-info">ПО ВАШЕМУ ЗАПРОСУ НИЧЕГО НЕ НАЙДЕНО</h2>`;
                    
                };
            output.results.forEach(function(item) {
            let nameItem = item.name || item.title;
            const poster = item.poster_path ? urlPoster + item.poster_path : './img/no-poster.jpg';
            let dataInfo = '';
            //чтоб не выводились имена актеров по запросу media_type: person
            if (item.media_type !== 'person') dataInfo = `data-id="${item.id}" data-type="${item.media_type}"`;
            inner += `
                <div class="col-12 col-md-4 col-xl-3 item">
                    <img src='${poster}' alt='${nameItem}' class='poster' ${dataInfo}>
                    <h5>${nameItem}</h5>
                </div>

            `;
        });
        movie.innerHTML = inner;
        addEventMedia()
        })
        .catch(function(reason) {
            movie.innerHTML = 'УПС... что-то пошло не так...';
            console.error("error: " + reason.status);
        });
}

searchForm.addEventListener('submit', apiSearch);

function addEventMedia() {
// полная информация при клике на картинку
    const media = movie.querySelectorAll('img[data-id]');
    media.forEach(function(elem) {
    elem.style.cursor = 'pointer';
    elem.addEventListener('click', showFullInfo);
});
}

function showFullInfo() {
    console.log(this)
}
