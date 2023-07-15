import * as mm from 'music-metadata-browser';
import { parse } from 'lrc-parser';

const fileInput = document.getElementById('file');
const player = document.getElementById('player');
const cover = document.getElementById('cover');
const lyricsDiv = document.getElementById('lyrics');
let lyrics;

fileInput.addEventListener('change', async function(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Read metadata
    const metadata = await mm.parseBlob(file);
    const { picture, lyrics: lyricsText, artist, title } = metadata.common;

    // Display cover
    if (picture && picture[0]) {
        const { data, format } = picture[0];
        const url = URL.createObjectURL(new Blob([data], { type: `image/${format}` }));
        cover.src = url;
    }

    // Display artist and title
    document.getElementById('artist').textContent = artist;
    document.getElementById('title').textContent = title;

    // Parse and display lyrics
    if (lyricsText && lyricsText[0]) {
        console.log(lyricsText[0].text); // Check if lyrics text is correctly extracted
        lyrics = parse(lyricsText[0].text);
        console.log(lyrics); // Check if lyrics are correctly parsed
        lyricsDiv.innerHTML = lyrics.lines.map(line => `<p id="line-${line.id}">${line.text}</p>`).join('');
    }

    console.log(lyricsDiv.textContent); // Check if lyrics are correctly displayed

    // Play music
    player.src = URL.createObjectURL(file);
    player.play();
});

player.addEventListener('timeupdate', function() {
    if (!lyrics) return;
    const line = lyrics.lines.find(line => line.time > player.currentTime * 1000);
    if (line) {
        const lineElement = document.getElementById(`line-${line.id}`);
        if (lineElement) lineElement.scrollIntoView({ behavior: 'smooth' });
    }
});
