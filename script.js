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
        if ( element.href.endsWith( ".mp3" )) {
            songs.push(element.href.split("/Songs/")[1])
        }
    }
    return songs;
}

async function main () {
    // Get the list of songs
    let songs = await getSongs();
    console.log( songs );

    let songul = document.querySelector(".song-container").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li> ${song.replaceAll("%20"," ")}</li>`;
    }
    // Play the first song
    var audio = new Audio(songs[1]);
    audio.play();
}

main()