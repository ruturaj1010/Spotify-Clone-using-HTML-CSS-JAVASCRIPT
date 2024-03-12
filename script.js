console.log( "let's start javascript" );

let currentsong = new Audio();

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

function formatTime ( seconds ) {
    if ( isNaN( seconds ) || seconds < 0 ) {
        return "Invalid input"
    }
    const minutes = Math.floor( seconds / 60 );
    const remainingSeconds = Math.floor( seconds % 60 );
    const formattedMinutes = String( minutes ).padStart( 2, '0' );
    const formattedSeconds = String( remainingSeconds ).padStart( 2, '0' );
    return `${formattedMinutes}:${formattedSeconds}`;
}

const playMusic = ( track, pause = false ) => {
    // let audio = new Audio("/Songs/" + track)
    currentsong.src = "/Songs/" + track

    if ( !pause ) {
        currentsong.play()
        play.src = "Resources/pause.svg";
    } else {
        play.src = "Resources/play.svg"
    }

    document.querySelector( ".songinfo" ).innerHTML = decodeURI( track )
}

async function main () {

    // Get the list of songs
    let songs = await getSongs();
    // console.log( songs );
    playMusic( songs[0], true )

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

    // attach eventlistener to each song
    Array.from( document.querySelector( ".song-list" ).getElementsByTagName( "li" ) ).forEach( e => {
        e.addEventListener( "click", element => {
            console.log( e.querySelector( ".music-info" ).firstElementChild.innerHTML )
            playMusic( e.querySelector( ".music-info" ).firstElementChild.innerHTML.trim() )
        } )
    } )

    // attach event listener to play , next , previous
    play.addEventListener( "click", () => {
        if ( currentsong.paused ) {
            currentsong.play()
            play.src = "Resources/pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "Resources/play.svg"
        }
    } )

    // listen for time event 
    currentsong.addEventListener( "timeupdate", () => {
        document.querySelector( ".songtime" ).innerHTML = `${formatTime( currentsong.currentTime )}/${formatTime( currentsong.duration )}`;
        document.querySelector( ".circle" ).style.left = ( currentsong.currentTime / currentsong.duration ) * 100 + "%";
    } )

    // add event listener to seekbar
    document.querySelector( ".seekbar" ).addEventListener( "click", e => {
        let percent = ( e.offsetX / e.target.getBoundingClientRect().width ) * 100
        document.querySelector( ".circle" ).style.left = percent + "%"
        currentsong.currentTime = ( currentsong.duration ) * percent / 100
    } )

    document.querySelector( ".hamburger" ).addEventListener( "click", () => {
        document.querySelector( ".left" ).style.left = 0
    } )

    document.querySelector( ".close" ).addEventListener( "click", () => {
        document.querySelector( ".left" ).style.left = -100 + "%";
    } )
}

main()