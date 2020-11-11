// NODEJS Application To Create The Array Stuff For You.

const fs = require('fs');
const duration = require('mp3-duration');

let files = fs.readdirSync('./media/audio');
let songs = [];

for(let file of files) {

    duration(`./media/audio/${file}`, (err, length) => {

        if(err) return console.log(`Unable to get length of '${file}'.`);
        
        songs.push({
            name: 'Name',
            desc: 'Album • Artist',
            file: file,
            secs: Math.ceil(length)
        });

        if(songs.length == files.length) console.log(JSON.stringify(songs, null, 4));

    });

}
