// ==========================================================================
// CORE AUDIO AUDIO ENGINE INITIALIZATION
// ==========================================================================
const play = document.getElementById('play');
const progressBar = document.getElementById('progressBar');
const forward = document.getElementById('forward');
const backward = document.getElementById('backward');
const shuffle = document.getElementById('shuffle');
const repeat = document.getElementById('repeat');
const nowBar = document.querySelector('.now-bar');

let audio = new Audio('Audio/1.mp3');
let currentSongIndex = 0; // Modernized to standard 0-indexed tracks pointer
let songOnRepeat = false;
let songOnShuffle = false;

// ==========================================================================
// SONGS DATABASE LOGIC RACK
// ==========================================================================
const songs = [
    { id: 1, songName: 'Massa Massa', songDes: 'Movie:Peddi', songImage: 'images/peddi.webp', songPath: 'songs/Massa Massa (Telugu Version) - SouthMelody.mp3' },
    { id: 2, songName: 'Majboor', songDes: 'Movie:Majboor', songImage: 'images/majboor.jpg', songPath: 'songs/Majboor_Sheheryar_Rehan_x_Zoha_Waseem_Music_Video.mp3' },
    { id: 3, songName: 'Naal Nachna', songDes: 'Movie:Durandhar-Ranveer,Sara Arjun', songImage: 'images/Naal nachna.jpg', songPath: 'songs/Naal Nachna Dhurandhar 320 Kbps.mp3' },
    { id: 4, songName: 'Raag of Revenge', songDes: 'Movie:DC-Lokesh kanagaraj,Wamiqa Gabbi', songImage: 'images/Raaga of Revenge.jpg', songPath: 'songs/Raga of Revenge.mp3' },
    { id: 5, songName: 'Aaya Sher', songDes: 'Movie:Paradise-Nani,Kayadu lohar', songImage: 'images/Aaaya sher.jpg', songPath: 'songs/Aaya Sher.mp3' },
    { id: 6, songName: 'Make Way for the King', songDes: 'This is the description for song 6', songImage: 'images/Raaka.jpg', songPath: 'songs/Make-Way-For-The-King-Sai-Abhyankkar-NaaSongs.mp3' },
    { id: 7, songName: 'Sahiba', songDes: 'Private song', songImage: 'images/sahiba.jpg', songPath: 'songs/Sahiba(KoshalWorld.Com).mp3' },
    { id: 8, songName: 'Singari', songDes: 'Movie:Dude-Pradeep Ranganathan,MamithaBaiju', songImage: 'images/singari.jpg', songPath: 'songs/Singari (Telugu)(KoshalWorld.Com).mp3' },
    { id: 9, songName: 'Sundari', songDes: 'Singer:Sanjay Rathod', songImage: 'images/Sundari.jpg', songPath: 'songs/Sundari(KoshalWorld.Com).mp3' },
    { id: 10, songName: 'Shararat', songDes: 'Movie:Durandhar-Ranveer,Sara Arjun', songImage: 'images/shararat.jpg', songPath: 'songs/Shararat Dhurandhar 128 Kbps.mp3' },
    { id: 11, songName: 'Shaky', songDes: 'Singer:Sanjay Rathod', songImage: 'images/shaky.jpg', songPath: 'songs/Shaky(KoshalWorld.Com).mp3' },
    { id: 12, songName: 'Manohari', songDes: 'Movie:Bahubali(Hindi)', songImage: 'images/manohari.jpg', songPath: 'songs/Manohari (PenduJatt.Com.Se).mp3' },
    { id: 13, songName: 'Hellallallo', songDes: 'Movie:Peddi-RC,janvi', songImage: 'images/Hellallallo.jpg', songPath: 'songs/Hellallallo (Telugu)(KoshalWorld.Com).mp3' },
    { id: 14, songName: 'Adiye', songDes: 'Movie:Bachelor-GV,Divya bharathi', songImage: 'images/Adiye.jpg', songPath: 'songs/Adiye-MassTamilan.fm.mp3' },
    { id: 15, songName: 'Dippam Dappam', songDes: 'Movie:Kanmani-Rambo-Khatija', songImage: 'images/Dippam dappam.jpg', songPath: 'songs/Dippam Dappam(KoshalWorld.Com).mp3' },
    { id: 16, songName: 'Monica', songDes: 'Movie:Coolie,RajiniKanth,Nagarjuna', songImage: 'images/monica.jpg', songPath: 'songs/Monica (Telugu)(KoshalWorld.Com).mp3' },
    { id: 17, songName: 'Golden Sparrow', songDes: 'Movie:Jabillama Neeku Antha Kopama', songImage: 'images/Golden sparrow.jpg', songPath: 'songs/Golden Sparrow(KoshalWorld.Com).mp3' },
    { id: 18, songName: 'Chuttamalle', songDes: 'Movie:Devara-NTR,Janvi', songImage: 'images/chuttamalle.jpg', songPath: 'songs/Chuttamalle(KoshalWorld.Com).mp3' }
];

// Active runtime deployment queue (cloned from original on boot initialization)
let currentOrderList = [...songs];

// Populate the visual DOM layout tree grid interface properties smoothly
const allMusicCards = Array.from(document.getElementsByClassName('music-card'));
allMusicCards.forEach((element, i) => {
    if(songs[i]) {
        element.getElementsByTagName('img')[0].src = songs[i].songImage;
        element.getElementsByClassName('img-title')[0].innerText = songs[i].songName;
        element.getElementsByClassName('img-description')[0].innerText = songs[i].songDes;
    }
});

// ==========================================================================
// MEDIA PLAYER CONTROLLER UTILITIES
// ==========================================================================
const playMusicButtons = Array.from(document.getElementsByClassName('playMusic'));

const resetAllPlayButtonsVisuals = () => {
    playMusicButtons.forEach((element) => {
        element.classList.remove('fa-circle-pause');
        element.classList.add('fa-circle-play');
    });
};

const updateNowPlayingDisplayPanel = () => {
    const currentActiveSong = currentOrderList[currentSongIndex];
    if (currentActiveSong) {
        nowBar.getElementsByTagName('img')[0].src = currentActiveSong.songImage;
        nowBar.getElementsByClassName('img-title-info')[0].innerText = currentActiveSong.songName;
        nowBar.getElementsByClassName('img-des-info')[0].innerText = currentActiveSong.songDes;
    }
};

// Syncs specific individual play buttons embedded inside grid collection items
const syncTrackRowPlayButtonState = (isPlaying) => {
    resetAllPlayButtonsVisuals();
    const currentActiveSong = currentOrderList[currentSongIndex];
    if (currentActiveSong) {
        // Targets active element row mapping its native tracking reference key index
        const targetButton = document.getElementById(currentActiveSong.id.toString());
        if (targetButton) {
            if (isPlaying) {
                targetButton.classList.remove('fa-circle-play');
                targetButton.classList.add('fa-circle-pause');
            } else {
                targetButton.classList.remove('fa-circle-pause');
                targetButton.classList.add('fa-circle-play');
            }
        }
    }
};

// Tracks state management switch routing engine core
const loadAndPlayTrackEngine = (indexPointer) => {
    currentSongIndex = indexPointer;
    const trackTarget = currentOrderList[currentSongIndex];
    
    if (trackTarget) {
        audio.src = trackTarget.songPath;
        audio.currentTime = 0;
        audio.play();
        
        play.classList.remove('fa-circle-play');
        play.classList.add('fa-circle-pause');
        
        updateNowPlayingDisplayPanel();
        syncTrackRowPlayButtonState(true);
    }
};

// ==========================================================================
// CORE DOM ACTION LISTENERS
// ==========================================================================

// Main Bottom Footer Play Accent Bar Router
play.addEventListener('click', () => {
    if (audio.paused || audio.currentTime === 0) {
        audio.play();
        play.classList.remove('fa-circle-play');
        play.classList.add('fa-circle-pause');
        syncTrackRowPlayButtonState(true);
    } else {
        audio.pause();
        play.classList.remove('fa-circle-pause');
        play.classList.add('fa-circle-play');
        syncTrackRowPlayButtonState(false);
    }
});

// Sync progress bar values dynamically across timelines
audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
        const progressPercentage = (audio.currentTime / audio.duration) * 100;
        progressBar.value = progressPercentage;
        progressBar.style.background = `linear-gradient(to right, #1db954 ${progressPercentage}%, #333 ${progressPercentage}%)`;
    }
});

// Handle custom timeline audio scrub skips
progressBar.addEventListener('input', function () {
    if (audio.duration) {
        const targetValue = parseFloat(this.value);
        this.style.background = `linear-gradient(to right, #1db954 ${targetValue}%, #333 ${targetValue}%)`;
        audio.currentTime = (targetValue * audio.duration) / 100;
    }
});

// Inline Dashboard Playlist Track Play Button Toggles
playMusicButtons.forEach((element) => {
    element.addEventListener('click', (e) => {
        const targetId = parseInt(e.target.id);
        
        // Find inside working active runtime list to track dynamic position correctly
        const activeQueueIndex = currentOrderList.findIndex(track => track.id === targetId);
        
        if (activeQueueIndex !== -1) {
            if (currentSongIndex === activeQueueIndex && !audio.paused) {
                // If clicking current playing audio row, trigger stop pause sequence action
                audio.pause();
                play.classList.remove('fa-circle-pause');
                play.classList.add('fa-circle-play');
                syncTrackRowPlayButtonState(false);
            } else if (currentSongIndex === activeQueueIndex && audio.paused) {
                // Resume play state directly
                audio.play();
                play.classList.remove('fa-circle-play');
                play.classList.add('fa-circle-pause');
                syncTrackRowPlayButtonState(true);
            } else {
                // Fire complete tracking launch engine sequence
                loadAndPlayTrackEngine(activeQueueIndex);
            }
        }
    });
});

// ==========================================================================
// PRESET RUNTIME QUEUE SHUFFLE & REPEAT LOGIC ENGINE
// ==========================================================================

// Clean Fisher-Yates array shuffling calculation mechanics
function getScrambledShuffleList(sourceArray) {
    let outputQueue = [...sourceArray];
    for (let i = outputQueue.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); // Fixed syntax logic: added parenthetical invocation
        [outputQueue[i], outputQueue[j]] = [outputQueue[j], outputQueue[i]];
    }
    return outputQueue;
}

shuffle.addEventListener('click', () => {
    if (!songOnShuffle) {
        songOnShuffle = true;
        songOnRepeat = false;
        shuffle.classList.add('active');
        repeat.classList.remove('active');

        // Capture whatever song is playing right now
        const currentActiveSong = currentOrderList[currentSongIndex];
        
        // Shuffle the whole library index
        currentOrderList = getScrambledShuffleList(songs);
        
        // Re-align our index pointer so the current track doesn't jump cut out
        if (currentActiveSong) {
            currentSongIndex = currentOrderList.findIndex(track => track.id === currentActiveSong.id);
        }
    } else {
        songOnShuffle = false;
        shuffle.classList.remove('active');

        const currentActiveSong = currentOrderList[currentSongIndex];
        currentOrderList = [...songs]; // Revert back safely to standard array values
        
        if (currentActiveSong) {
            currentSongIndex = currentOrderList.findIndex(track => track.id === currentActiveSong.id);
        }
    }
});

repeat.addEventListener('click', () => {
    if (!songOnRepeat) {
        songOnRepeat = true;
        songOnShuffle = false;
        repeat.classList.add('active');
        shuffle.classList.remove('active');
        
        // Synchronize active tracking structure defaults back cleanly
        const currentActiveSong = currentOrderList[currentSongIndex];
        currentOrderList = [...songs];
        if (currentActiveSong) {
            currentSongIndex = currentOrderList.findIndex(track => track.id === currentActiveSong.id);
        }
    } else {
        songOnRepeat = false;
        repeat.classList.remove('active');
    }
});

// ==========================================================================
// SKIP & TERMINATION EDGE CONTROL ROUTERS
// ==========================================================================
const playNextSong = () => {
    if (songOnRepeat) {
        // Restart current audio loop track pointer directly
        loadAndPlayTrackEngine(currentSongIndex);
    } else {
        // Advance row smoothly or wrap cycle back cleanly to entry index standard bounds
        let nextIndexIndex = (currentSongIndex + 1) % currentOrderList.length;
        loadAndPlayTrackEngine(nextIndexIndex);
    }
};

const playPrevSong = () => {
    // Wrap cycle perfectly around left-hand bounds array track limits
    let prevIndexIndex = (currentSongIndex - 1 + currentOrderList.length) % currentOrderList.length;
    loadAndPlayTrackEngine(prevIndexIndex);
};

forward.addEventListener('click', playNextSong);
backward.addEventListener('click', playPrevSong);
audio.addEventListener('ended', playNextSong);

// ==========================================================================
// LIVE SEARCH FILTER ENGINE
// ==========================================================================
const searchBarInput = document.querySelector('.input-box');

if (searchBarInput) {
    searchBarInput.addEventListener('input', (e) => {
        const searchVelocityValue = e.target.value.toLowerCase().trim();
        
        // Grab the music cards currently rendered on your page layout grid
        const visualMusicCards = document.querySelectorAll('.music-card');

        songs.forEach((song, index) => {
            // Check if the card element actually exists at this iteration step
            if (visualMusicCards[index]) {
                const matchesTitle = song.songName.toLowerCase().includes(searchVelocityValue);
                const matchesDescription = song.songDes.toLowerCase().includes(searchVelocityValue);

                // If it matches either title or description, keep it visible; otherwise, hide it
                if (matchesTitle || matchesDescription) {
                    visualMusicCards[index].style.display = 'block';
                } else {
                    visualMusicCards[index].style.display = 'none';
                }
            }
        });
    });
}