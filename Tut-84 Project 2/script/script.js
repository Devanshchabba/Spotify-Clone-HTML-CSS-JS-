console.log("Writing javascript")
let currentSong = new Audio();
let songs;
let currenFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currenFolder = folder;
    let a = await fetch(`/${folder}/`)
    let response = await a.text();
    
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {

            songs.push(element.href.substring(element.href.lastIndexOf('/') + 1));
            
            // songs.push(element.href.split(`/${folder}/`)[1])

        }


    }
    
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li> <img src="img/music.svg"  width="40px" class="invert" alt="">
        <div class="info">
       <div class="songName">${song.replaceAll("%20", " ")}</div>
       <div class="singer">Devansh</div>
    </div>
    <div class="playNow">
        <span>Play Song</span>
        <img id="playLeft" src="img/playButton.svg" width="40px" class="invert" alt="">
    </div>
    </li>`;
    }

    //Play function click to play

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
           
            MusicPlay(e.querySelector(".info").firstElementChild.innerHTML);
        })
    });


   


}
async function displayAlbums() {
    console.log("Displaying albums");

    let a = await fetch(`/songs/`)
    let response = await a.text();
    
    let div = document.createElement("div");
    
    div.innerHTML = response;
    let rightContainer = document.querySelector(".rightContainer");
    let anchors = div.getElementsByTagName("a");
    
    let array = Array.from(anchors)
    for (let i = 0; i < array.length; i++) {
        const e = array[i];
        if (e.href.includes("songs") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[0];

            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json();
        
            rightContainer.innerHTML = rightContainer.innerHTML + `<div  data-folder="${folder}" class="card">
            <img src="/songs/${folder}/cover.jpeg" width="200px" alt="">
            <img id="greenBtn" src="img/greenPlay.svg" width="45px" alt="">
            <h2>${response.title} </h2>
            <div class="text">${response.discription}
            </div>
        </div>`
        }
    }
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
             let song=await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            
            
        })

    })
    Array.from(greenBtn).forEach(e => {
        e.addEventListener("click",  item => {
            console.log(item.target.src)
            if(item.target.src.includes("img/greenPlay.svg")){
                item.target.src="img/greenPause.svg";
                MusicPlay(songs[0]);
            }
            else{
                item.target.src="img/greenPlay.svg";
                currentSong.pause();
            }
            
        })

    })


}

const MusicPlay = (track, pause = false) => {
    currentSong.src = `/${currenFolder}/` + track;
    if (!pause) {
        play.src = "img/play.svg";
        currentSong.play();
    }
    document.querySelector(".songInfo").innerHTML = decodeURI(track);
    document.querySelector(".time").innerHTML = "--:--/--:--";




}
async function main() {

    await getSongs("songs/Camila Cabello")
    MusicPlay(songs[0], true);


    displayAlbums()



    //Pause function
    play.addEventListener("click", element => {
        if (currentSong.paused) {
            currentSong.play();

            play.src = "img/play.svg";
        }
        else {
            currentSong.pause()
            play.src = "img/pause.svg"
            playLeft.src = "img/pause.svg"
        }
    })



    //Time updating function
    currentSong.addEventListener("timeupdate", element => {
       
        document.querySelector(".time").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })



    //seekBar functioning
    document.querySelector(".seekBar").addEventListener("click", element => {
        
        let percent = (element.offsetX / element.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    })

    document.querySelector(".hamBurger").addEventListener("click", elementt => {
        document.querySelector(".left").style.left = 0;
    })


    document.querySelector(".close").addEventListener("click", element => {
        document.querySelector(".left").style.left = "-120%";
    })

    // Add an event listener to previous
    previous.addEventListener("click", () => {
        currentSong.pause()
      
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            MusicPlay(songs[index - 1])
        }
    })

    // Add an event listener to next
    next.addEventListener("click", () => {
        currentSong.pause()
    
        console.log(songs);
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            MusicPlay(songs[index + 1])
        }
        
    })

    currentSong.addEventListener('ended', () => {
        // Do something when the song ends (e.g., play the next song)
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            MusicPlay(songs[index + 1])
        }
    });





    document.querySelector(".volume").getElementsByTagName("input")[0].addEventListener("change", element => {


       
        currentSong.volume = parseFloat(element.target.value / 100)
        
        if (element.target.value == 0) {
            document.querySelector(".volume").getElementsByTagName("img")[0].src = "img/mute.svg";
        }
        else {
            document.querySelector(".volume").getElementsByTagName("img")[0].src = "img/volume.svg";
        }
    })


}

main()