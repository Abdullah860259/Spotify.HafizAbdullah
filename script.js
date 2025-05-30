// this function returns an array "songsFolders" consists of all the song folders present in /Songs/ I will use this array to create playlists of song in the main section of spotify A reminder is there whenever use use songsData() function you must use it asyncronesly bcz this takes time to process;
const songsContainer = document.querySelector(".songsContainer");
var songFolders = [];
var songs = [];
var currentAudio = null;
var currentAudiocontainer = null;
// This function will only run to reset the songs and songFolders to remove previous songs and activated through onclick attribut in html
function urgentfunction() {
    songs = [];
    songsContainer.innerHTML = ""
}

async function addingeventlistnerformobile() {
    let playlists = document.getElementsByClassName("playlist")
    let left = document.getElementsByClassName("left")[0]
    let right = document.getElementsByClassName("right")[0]
    for (const playlist of playlists) {
        playlist.addEventListener("click", () => {
            if (window.innerWidth <= 708) {
                left.classList.remove("hide")
                right.classList.add("hide")
                // document.getElementsByClassName
            }
        })
    }
}


const songsData = async () => {
    let songsFolders = [];
    let res = await fetch("http://127.0.0.1:5500/Songs/")
    let songsJ = await res.text();
    let div = document.createElement("div")
    div.innerHTML = songsJ;
    let as = div.getElementsByTagName("a")
    for (const a of as) {
        if (a.hasAttribute("title") && a.getAttribute("title") !== "..") {
            songsFolders.push(a)
        }
    }
    return songsFolders;
};

// The following code is adding playlist to the web page taking input as songsFolder

async function addPlaylists(songFolders) {
    for (const ele of songFolders) {
        document.querySelector(".playlists").innerHTML += `
        <div onclick = "urgentfunction()" class="playlist">
                    <img src="http://127.0.0.1:5500/Songs/${ele.getAttribute("title")}/cover.jpg" alt="LOGO">
                    <p class="playlistName">${ele.getAttribute("title")}</p>
                    <div class="play">
                        <img style="filter: invert(1);" height="18px"  src="Images/resume.svg" alt="LOGO">
                    </div>
                </div>`
    }
    await addingeventlistnerformobile(songFolders)
}




// The following chunk of code is actually adding the hover effect in playlists and also event listners to them
function addhovereffect() {

    const playlist = document.getElementsByClassName("playlist");
    for (const ele of playlist) {
        ele.addEventListener("mouseover", () => {
            ele.lastElementChild.style.opacity = "1";
            ele.lastElementChild.style.bottom = "110px";
        })
        ele.addEventListener('mouseout', () => {
            ele.lastElementChild.style.opacity = "0";
            ele.lastElementChild.style.bottom = "50px";
        });

    }
    for (const ele of playlist) {
        ele.addEventListener("click", () => {
            showsongs(ele)
        })
    }
}







// this function will show the songs when any playlist is clicked this function is called when any playlisk is clicked 
async function showsongs(clickedplaylist) {
    let url = clickedplaylist.querySelector("img").getAttribute("src").slice(0, -9)
    let data = await fetch(url)
    let res = await data.text()
    let div = document.createElement("div")
    div.innerHTML = res;
    let as = div.getElementsByTagName("a")
    for (const a of as) {
        if (a.getAttribute("href").endsWith(".mp3")) {
            songs.push(a)
            songsContainer.innerHTML += `<div class="song">
                    <div href = "${a.getAttribute("href")}" class="songL">
                        <img height="15px" src="Images/music.svg" alt="LOGO">
                        <div class="songInfo">
                            <p class="songName">${a.getAttribute("title").slice(0, -4)}</p>
                        </div>
                    </div>
                    <button class="playSong">Play Now<img height="20px" src="Images/play.svg" alt="LOGO"></button>
                </div>`
        }
    }

    for (const ele of songsContainer.querySelectorAll(".song")) {
        let hint = ele.getElementsByTagName("button")[0].getElementsByTagName("img")[0].getAttribute("src");
        ele.addEventListener("click", () => {
            if (hint.endsWith("pause.svg")) {
                document.getElementById("soundState").setAttribute("src", "/images/resume.svg")
                currentAudiocontainer.querySelector(".playSong").innerHTML = `Play Now<img height="20px" src="Images/play.svg" alt="LOGO">`
                console.log("Paused", currentAudio)
                currentAudio.pause();
                state = "paused";
                console.log(currentAudio.paused)
            }
            if (currentAudio) {
                currentAudio.pause();
                document.getElementById("soundState").setAttribute("src", "/images/resume.svg")
                currentAudiocontainer.querySelector(".playSong").innerHTML = `Play Now<img height="20px" src="Images/play.svg" alt="LOGO">`
            }
            let audiourl = `http://127.0.0.1:5500${ele.firstElementChild.getAttribute("href")}`
            currentAudio = new Audio(audiourl)
            currentAudio.play()
            if (window.innerWidth <= 708) {
                console.log("GOing back")
                let left = document.getElementsByClassName("left")[0]
                let right = document.getElementsByClassName("right")[0]
                left.classList.add("hide")
                right.classList.remove("hide")

            }
            ele.querySelector(".playSong").innerHTML = `Playing Now <img height="20px" src="Images/pause.svg" alt="LOGO">`
            document.getElementById("soundState").setAttribute("src", "/images/pause.svg")
            currentAudiocontainer = ele;
            document.getElementsByClassName("songTitle")[0].innerText = ele.getElementsByClassName("songInfo")[0].innerText
        })

    }

}




async function main() {
    songFolders = await songsData();//this fetches the dirctory and return an array of all the playlists (folders) in side the songs
    await addPlaylists(songFolders)// this simply add the playlists to the web page
    addhovereffect();    //this also adds the event listner to the playlist and also calls the show songs function when playlist is clicked
}
main()


document.getElementById("soundState").addEventListener("click", () => {
    let hint = document.getElementById("soundState")
    if (hint.getAttribute("src").endsWith("resume.svg")) {
        if (currentAudio) {
            hint.setAttribute("src", "/Images/pause.svg")
            currentAudio.play()
        }
    } else if (hint.getAttribute("src").endsWith("pause.svg")) {
        if (currentAudio) {
            currentAudio.pause()
            hint.setAttribute("src", "/Images/resume.svg")
        }
    }
})

document.getElementsByTagName("input")[0].addEventListener("input", (e) => {
    currentAudio.volume = document.getElementsByTagName("input")[0].value

})



// function moreButtons() {
//     let traker = 0;
//     let alligner = currentAudiocontainer.getElementsByClassName("songName")[0].innerText
//     songs.forEach((a, i) => {
//         if (a.getAttribute("title").slice(0, -4) == alligner) {
//             traker = i;
//             document.getElementById("previoussong").addEventListener("click", () => {
//                 currentAudio.pause()
//                 currentAudio.src = "";
//                 currentAudio.load();
//                 currentAudio = null;
//                 if (songs[traker - 1] !== "undefined") {
//                     console.log(songs[traker - 1].getAttribute("href"), traker - 1)
//                     let url = `http://127.0.0.1:5500${songs[traker - 1].getAttribute("href")}`
//                     console.log(url)
//                     currentAudio = new Audio(url)
//                     currentAudio.play();
//                     document.getElementsByClassName("songTitle")[0].innerText = songs[traker - 1].getAttribute("title").slice(0, -4);
//                 } else {
//                     console.log("error")
//                 }
//             })
//                         document.getElementById("nextsong").addEventListener("click", () => {
//                 currentAudio.pause()
//                 currentAudio.src = "";
//                 currentAudio.load();
//                 currentAudio = null;
//                 if (songs[traker - 1] !== "undefined") {
//                     console.log(songs[traker + 1].getAttribute("href"), traker - 1)
//                     let url = `http://127.0.0.1:5500${songs[traker + 1].getAttribute("href")}`
//                     console.log(url)
//                     currentAudio = new Audio(url)
//                     currentAudio.play();
//                     document.getElementsByClassName("songTitle")[0].innerText = songs[traker + 1].getAttribute("title").slice(0, -4);
//                 } else {
//                     console.log("error")
//                 }
//             })
//         }
//     })
// }


if (window.innerWidth <= 708) {
    document.getElementById("hamburger").classList.remove("hide")
    let npBtn = document.getElementsByClassName("npBtn")
    for (const ele of npBtn) {
        ele.classList.add("hide")
    }
    let left = document.getElementsByClassName("left")[0]
    let right = document.getElementsByClassName("right")[0]
    let cross = document.getElementsByClassName("CrossCont")[0].lastElementChild
    left.classList.add("hide")
    document.getElementById("hamburger").addEventListener("click", () => {
        left.classList.remove("hide")
        right.classList.add("hide")
    })
    cross.addEventListener("click", () => {
        right.classList.remove("hide")
        left.classList.add("hide")
    })
    left.style.width = "100%";
} else {
    document.getElementsByClassName("CrossCont")[0].lastElementChild.classList.add("hide")
}

if (window.innerWidth <= 708) {
    document.getElementsByClassName("home")[0].addEventListener("click", () => {
        let left = document.getElementsByClassName("left")[0]
        let right = document.getElementsByClassName("right")[0]
        right.classList.remove("hide")
        left.classList.add("hide")
    })


}

if (window.innerWidth > 708) {
     document.getElementsByClassName("home")[0].addEventListener("click", () => {
        alert("This feature is for mobile users")
     })
    }

document.getElementsByClassName("search")[0].addEventListener("click", () => {
    alert("This function is under Development by developer")
})

let npbtn = document.getElementsByClassName("npBtn")
for (const ele of npbtn) {
    ele.addEventListener("click",()=>{
        alert("Sorry! This feature is under development")
    })
}