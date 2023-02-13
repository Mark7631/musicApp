let container = document.querySelector(`.album`);

let search = new URLSearchParams(window.location.search);

let i = search.get(`i`);

function getAlbum() {
    return albums[i]
};

let album = getAlbum();


if(!album) {
    rendorError();
}else{
    rendorAlbumInfo();

    renderTracks();

    setupAudio();
};


function rendorError() {
    container.innerHTML = `ERROR`
    setTimeout(() => {
        window.location.pathname = `index.html`;
    }, 5000);
};

function rendorAlbumInfo() {
    container.innerHTML = `
    <div class="card mb-3">
    <div class="row">
        <div class="col-6 col-md-4">
            <img src="${album.img}" class="img-fluid rounded-start" alt="">
        </div>
        <div class="col-6 col-md-8">
            <div class="card-body">
                <h5 class="card-title">${album.title}</h5>
                <p class="text">${album.description}</p>
                <p><small class="muted">${album.year}</small></p>
            </div>
        </div>
    </div>
    </div>
    `;
};

function renderTracks() {
    let playlist = document.querySelector(`.playlist`);

    let tracks = album.tracks;
    for(j = 0; j < tracks.length; j++) {
        let track = tracks[j];
        playlist.innerHTML += `<li class="track list-group-item d-flex align-items-center row">
        <img class="img-pause me-3 col-auto" src="assets/icons8-пластинка-16.png" alt="" class="me-3" height="30px">
        <img class="img-play me-3 d-none col-auto" src="assets/icons8-аудио-волна-16.png" alt="" class="me-3" height="30px">
        <div col-4>
            <div>${track.title}</div>
            <div class="text-secondory">${track.author}</div>
        </div>
        <div class="progress col-6" role="progressbar" style="width: 0%;"></div>
        <div class="ms-auto time col-2">${track.time}</div>
        <audio class="audio" src="${track.src}"><audio>
    </li>`;
    };
};

function setupAudio() {
    // Найди коллекцию с треками
    let trackNodes = document.querySelectorAll(`.track`); 
    for (let i = 0; i < trackNodes.length; i++) { 
        // Один элемент
        let tracks = album.tracks;
        let track = tracks[i];
        let node = trackNodes[i]; 
        let timeNode = node.querySelector(`.time`);
        let imgPause = node.querySelector(`.img-pause`);
        let imgPlay = node.querySelector(`.img-play`);
        let progressBar = node.querySelector(`.progress`);
        // Тег аудио внутри этого элемента
        let audio = node.querySelector(`.audio`); 
        node.addEventListener(`click`, function () {
            // Если трек сейчас играет...
            if (track.isPlaying) {
                track.isPlaying = false;
                // Поставить на паузу
                audio.pause();
                imgPause.classList.remove(`d-none`);
                imgPlay.classList.add(`d-none`);

            // Если трек сейчас не играет...
            } else {
                track.isPlaying = true;
                // Включить проигрывание
                audio.play();
                imgPlay.classList.remove(`d-none`);
                imgPause.classList.add(`d-none`);

                updateProgress()
            }
        });
        function updateProgress() {
            // Нарисовать актуальное время
            let time = getTime(audio.currentTime);
            if(timeNode.innerHTML != time){
                timeNode.innerHTML = time;
                progressBar.style.width = audio.currentTime*100/audio.duration + `%`;
            };
    
            // Нужно ли вызвать её ещё раз?
            if (track.isPlaying) {
                requestAnimationFrame(updateProgress);
            };
        };
    };
};

function getTime(time){
    let currentSeconds = Math.floor(time);
    let minutes = Math.floor(currentSeconds/60);
    let seconds = Math.floor(currentSeconds%60);

    if(minutes < 10) {
        minutes = `0` + minutes;
    };
    if(seconds < 10) {
        seconds = `0` + seconds;
    };
    return `${minutes}:${seconds}`
};
