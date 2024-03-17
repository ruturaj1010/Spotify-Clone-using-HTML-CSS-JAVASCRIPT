console.log( "let's start javascript" );

let currentsong = new Audio();
let songs;
let currFolder;

async function getSongs ( folder ) {
    // fetching song from the file
    currFolder = folder
    let a = await fetch( `http://127.0.0.1:3000/${currFolder}/` );
    let response = await a.text();
    // console.log( response );

    let div = document.createElement( "div" );
    div.innerHTML = response;
    let as = div.getElementsByTagName( "a" );

    let songs = []

    for ( let index = 0; index < as.length; index++ ) {
        const element = as[index];
        if ( element.href.endsWith( ".mp3" ) ) {
            songs.push( element.href.split( `${currFolder}` )[1] )
        }
    }
    return songs;
}

// function for playing the current song
const playMusic = ( track, pause = false ) => {

    currentsong.src = `${currFolder}` + track

    if ( !pause ) {
        currentsong.play()
        play.src = "Resources/pause.svg";
    } else {
        play.src = "Resources/play.svg"
    }

    document.querySelector( ".songinfo" ).innerHTML = decodeURI( track )
}

// function for time formstting on main playbar
function formatTime ( seconds ) {
    if ( isNaN( seconds ) || seconds < 0 ) {
        return "00:00"
    }
    const minutes = Math.floor( seconds / 60 );
    const remainingSeconds = Math.floor( seconds % 60 );
    const formattedMinutes = String( minutes ).padStart( 2, '0' );
    const formattedSeconds = String( remainingSeconds ).padStart( 2, '0' );
    return `${formattedMinutes}:${formattedSeconds}`;
}

async function main () {

    // Get the list of songs
    songs = await getSongs( "songs/ncs/" );
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
            // console.log( e.querySelector( ".music-info" ).firstElementChild.innerHTML )
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
    previous.addEventListener( "click", () => {
        let index = songs.indexOf( currentsong.src.split( "/" ).slice( -1 )[0] )
        if ( index > 0 ) {
            playMusic( songs[index - 1] )
        }
    } )
    next.addEventListener( "click", () => {
        let index = songs.indexOf( currentsong.src.split( "/" ).slice( -1 )[0] );
        if ( ( index + 1 ) < songs.length ) {
            playMusic( songs[index + 1] )
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

    // for opening and closing the hamberger feature below 1250px
    document.querySelector( ".hamburger" ).addEventListener( "click", () => {
        document.querySelector( ".left" ).style.left = 0
    } )
    document.querySelector( ".close" ).addEventListener( "click", () => {
        document.querySelector( ".left" ).style.left = -100 + "%";
    } )
     
    // for adjusting the volume of song
    document.querySelector( ".range" ).getElementsByTagName( "input" )[0].addEventListener( "change", ( e ) => {
        console.log( e, e.target, e.target.value )
        currentsong.volume = parseInt( e.target.value ) / 100
    } )

}

main()