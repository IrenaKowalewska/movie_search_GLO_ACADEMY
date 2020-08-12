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
            let mediaType = item.title ? 'movie' : 'tv';
            const poster = item.poster_path ? urlPoster + item.poster_path : './img/no-poster.jpg';
            let dataInfo = '';
            //чтоб не выводились имена актеров по запросу media_type: person
            if (item.media_type !== 'person') dataInfo = `data-id="${item.id}" data-type="${mediaType}"`;
            inner += `
                <div class="col-12 col-md-4 col-xl-3 item">
                    <img src='${poster}' alt='${nameItem}' class='poster' ${dataInfo}>
                    <h5>${nameItem}</h5>
                    <p "text-center">Рейтинг: ${item.vote_average}</p>
                </div>

            `;
        });
        movie.innerHTML = inner;
        addEventMedia();
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
    // dataset находит  data-атрибуты ( в моем случае[data-type])
    // console.log(this.dataset.type); 
    let url = '';
    let thisType = this.dataset.type;
    let thisId = this.dataset.id;
    if (this.dataset.type === 'movie') {
        url = `https://api.themoviedb.org/3/movie/${this.dataset.id}?api_key=7c2ee62875ea6fb1aea5a9512a985137&language=ru`;
    }else if (this.dataset.type === 'tv') {
        url = `https://api.themoviedb.org/3/tv/${this.dataset.id}?api_key=7c2ee62875ea6fb1aea5a9512a985137&language=ru`;
    } else {
        movie.innerHTML = `<h2 class="col-12 text-center text-info">ПРОИЗОШЛА ОШИБКАБ ПОВТОРИТЕ ПОЗЖЕ</h2>`;
    }

    fetch(url)
        .then(function(value) {
            if (value.status !== 200) {
                return Promise.reject(value);
            }
            return value.json();
        })
        .then(function(output) {
            // console.log(output);
            const poster = output.poster_path ? urlPoster + output.poster_path : './img/no-poster.jpg';
            movie.innerHTML = `
            <h4 class="col-12 text-center text-info">${output.name || output.title}</h4>
            <div class="col-3">
                <img src="${poster}" alt="${output.name || output.title}">
                ${(output.homepage) ? `<p class="text-center"><a href="${output.homepage}" target ="_blank">Официальная страница</a></p>` : ''}
                ${(output.imdb_id) ? `<p class="text-center"><a href="https://imdb.com/title/${output.imdb_id}" target ="_blank">Страница на IMDB.com</a></p>` : ''}
                
            </div>
            <div class="col-8">
            <p "text-center">Рейтинг: ${output.vote_average}</p>
            <p "text-center">Статус: ${output.status}</p>
            <p "text-center">Премьера: ${output.first_air_date || output.release_date}</p>

                ${(output.last_episode_to_air) ? `<p>В ${output.number_of_seasons} сезоне ${output.last_episode_to_air.episode_number} серий вышло</p>` : ''}
            <p text-center>Описание: ${output.overview}</p>
            <br>
            <div class='youtube'></div>
            </div>
            `;
          
            getVideo(thisType, thisId);
        })
        .catch(function(reason) {
            movie.innerHTML = 'УПС... что-то пошло не так...';
            console.error("error: " + reason.status);
        });
    
}

function getVideo(type, id) {
    let youtube = movie.querySelector('.youtube');
    fetch(`https://api.themoviedb.org/3/${type}/${id}/videos?api_key=7c2ee62875ea6fb1aea5a9512a985137&language=ru`)
        .then((value) => {
            if (value.status !== 200) {
                return Promise.reject(value);
            }
            return value.json();
        })
        .then((output) => {
            let videoFrame = `<h5 class="text-info ">ТРЕЙЛЕРЫ</h5>`;

            if (output.results.length === 0) {
                videoFrame = `<h5 class="text-info ">ТРЕЙЛЕРЫ НЕ НАЙДЕНЫ</h5>`;
            }
            output.results.forEach((item) => {
                videoFrame += `<iframe width="560" height="315" src="https://www.youtube.com/embed/${item.key}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
            });
            youtube.innerHTML = videoFrame;
        })
        .catch((reason) => {
            youtube.innerHTML = 'ПО ВАШЕМУ ЗАПРОСУ ВИДЕО НЕ НАЙДЕНО';
            console.error("error: " + reason.status);
        });
}

document.addEventListener('DOMContentLoaded', function(){
    fetch('https://api.themoviedb.org/3/trending/all/week?api_key=7c2ee62875ea6fb1aea5a9512a985137&language=ru')
    .then(function(value) {
        if (value.status !== 200) {
            return Promise.reject(value);
        }
        return value.json();
    })
    .then(function(output) {
        // console.log(output);
        let inner = `<h4 class="col-12 text-center text-info">ПОПУЛЯРНЫЕ ЗА НЕДЕЛЮ!</h4>`;
            if (output.results.length === 0) {
                inner = `<h2 class="col-12 text-center text-info">ПО ВАШЕМУ ЗАПРОСУ НИЧЕГО НЕ НАЙДЕНО</h2>`;
                
            };
        output.results.forEach(function(item) {
        let nameItem = item.name || item.title;
        const poster = item.poster_path ? urlPoster + item.poster_path : './img/no-poster.jpg';
        let dataInfo = `data-id="${item.id}" data-type="${item.media_type}"`;
        
        inner += `
            <div class="col-12 col-md-4 col-xl-3 item">
                <img src='${poster}' alt='${nameItem}' class='poster' ${dataInfo}>
                <h5>${nameItem}</h5>
                <p "text-center">Рейтинг: ${item.vote_average}</p>
            </div>

        `;
    });
    movie.innerHTML = inner;
    addEventMedia();
    })
    .catch(function(reason) {
        movie.innerHTML = 'УПС... что-то пошло не так...';
        console.error("error: " + reason.status);
    });
});

