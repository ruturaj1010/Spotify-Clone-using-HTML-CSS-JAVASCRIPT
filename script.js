console.log( "let's start javascript" );


async function getSongs () {
    let a = await fetch( "http://127.0.0.1:3000/Songs/" );
    let response = await a.text();
    console.log( response );

    let div = document.createElement( "div" );
    div.innerHTML = response;
    let as = div.getElementsByTagName( "a" );

    let songs = []

    for ( let index = 0; index < as.length; index++ ) {
        const element = as[index];
        if ( element.href.endsWith( ".mp3" ) ) {
            songs.push( element.href.split( "/Songs/" )[1] )
        }
    }
    return songs;
}

const playMusic = (track)=> {
    let audio = new Audio("/Songs/" + track)
    audio.play()
}

async function main () {
    let currentsong = new Audio();
    // Get the list of songs
    let songs = await getSongs();
    console.log( songs );

    // Show all the songs in playlist
    let songul = document.querySelector( ".song-container" ).getElementsByTagName( "ul" )[0]
    for ( const song of songs ) {
        songul.innerHTML = songul.innerHTML + `<li> <img class="invert" src="Resources/music.svg" alt="">
        <div class="music-info">
            <div>${song.replaceAll( "%20", " " )}</div>
            <div>Ruturaj Nikam</div>
        </div>
        <div class="play-now">
            <span>Play Now</span>
            <img class="invert" src="Resources/play.svg" alt="">
        </div></li>`;
    }

    Array.from(document.querySelector(".song-list").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click" , element=>{
            console.log(e.querySelector(".music-info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".music-info").firstElementChild.innerHTML.trim())
        })
    })
}

main()