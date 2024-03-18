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

    songs = []

    for ( let index = 0; index < as.length; index++ ) {
        const element = as[index];
        if ( element.href.endsWith( ".mp3" ) ) {
            songs.push( element.href.split( `${currFolder}` )[1] )
        }
    }

    // Show all the songs in playlist
    let songul = document.querySelector( ".song-container" ).getElementsByTagName( "ul" )[0]
    songul.innerHTML = ""
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

    document.querySelector( ".songinfo" ).innerHTML = decodeURI( track );

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

async function DisplayAlbums () {
    let a = await fetch( "http://127.0.0.1:3000/songs/" );
    let response = await a.text();
    
    let div = document.createElement( "div" );
    div.innerHTML = response;
    let anchors = div.getElementsByTagName( "a" )
    let array = Array.from( anchors )
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            
        if ( e.href.includes( "/songs" ) ) {
            let folder = e.href.split( "/" ).slice( -2 )[0]
            // get the metadata of the folder
            let a = await fetch( `http://127.0.0.1:3000/songs/${folder}/info.json` );
            let response = await a.json();
            console.log(response)
            let cardContainer = document.querySelector(".cardContainer")
            cardContainer.innerHTML = cardContainer.innerHTML  + `<div data-folder="${folder}" class="card">
            <div class="playbtn">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"
                    color="#000000" fill="none">
                    <path
                        d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                        stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" fill="#000" />
                </svg>
            </div>
            <img src="/songs/${folder}/cover.jpeg" alt="This is an img">
            <h3>${response.title}</h3>
            <p>${response.description}</p>
        </div>`
        }
    }
    
    // load the playlist whenever the card is clicked
    Array.from( document.getElementsByClassName( "card" ) ).forEach( e => {
        // console.log(e)
        e.addEventListener( "click", async item => {
            songs = await getSongs( `songs${item.currentTarget.dataset.folder}` );
        } )
    } );

}

async function main () {

    // Get the list of songs
    await getSongs( "songs/ncs/" );
    // console.log( songs );

    // Display all the albums on the page
    DisplayAlbums()

    playMusic( songs[0], true )

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
        // console.log( e, e.target, e.target.value )
        currentsong.volume = parseInt( e.target.value ) / 100
    } )

    document.querySelector(".songvolimg>img").addEventListener("click" , e=>{
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg","mute.svg")
            currentsong.volume = 0;
            document.querySelector( ".range" ).getElementsByTagName( "input" )[0].value = 0;
        } else {
            e.target.src = e.target.src.replace("mute.svg" ,"volume.svg")
            currentsong.volume = 0.5;
            document.querySelector( ".range" ).getElementsByTagName( "input" )[0].value = 40;
        }
    })

}

main()