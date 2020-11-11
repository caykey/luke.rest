let audio      = new Audio();
audio.controls = false;
audio.loop     = true;
audio.autoplay = true;
audio.muted    = false;

let audio_context;
let analyser;
let data;

const canvas  = document.getElementById('reactor');
const context = canvas.getContext('2d');

let current_song_time = 0;
let current_song      = {};
let offset            = 0;

const songs = [
    {
        "name": "Song Name",
        "desc": "Album • Artist/s",    
        "file": "songname.mp3",
        "secs": 60 // Song length
    }
];

const combined_time = songs.map(s => s.secs).reduce((a, b) => a + b);

function get_current_song(time) {
    
    let _ = 0;
    for(let song of songs) {
        _ += song.secs;

        // console.log(song.name, _);
        
        if(time <= _) return song; 
    }

    return null;

}

function get_previous_times(input) {
    let _ = 0;

    for(let song of songs) {
        if(song == input) return _;
        _ += song.secs;
    }
}

function update_theme_icon() {
    
    let light_mode = document.body.classList.contains('light');
    localStorage.setItem('light_mode', light_mode ? 'true' : 'false');

    document.getElementById('light_mode').classList.remove('fa-sun', 'fa-moon');
    document.getElementById('light_mode').classList.add(!light_mode ? 'fa-sun' : 'fa-moon');
}

function toggle_light() {
    
    document.getElementById('loader').style.animation = 'fade-in 0.75s ease-in forwards';
    setTimeout(() => {
        document.getElementById('loader').style.animation = 'fade-out ease-out 0.75s forwards';
        document.body.classList.toggle('light');
        document.body.classList.toggle('dark');
        update_theme_icon();
    }, 750);

}

function reactor_draw(data) {

    context

    // data = [...data];

    // context.clearRect(0, 0, canvas.width, canvas.height);
    // let space = canvas.width / data.length;

    // data.forEach((e, i) => {

    //     context.beginPath();
    //     context.moveTo(space * i, canvas.height);
    //     context.moveTo(space * i, canvas.height - e);
    //     context.stroke();

    // });

}

function reactor_loop() {
    requestAnimationFrame(reactor_loop);
    analyser.getByteFrequencyData(data);
    reactor_draw(data);
}

document.body.onload = () => {
    let light_mode = localStorage.getItem('light_mode') || true;
    document.body.classList.add(light_mode == 'true' ? 'light' : 'dark');
    update_theme_icon();
    document.getElementById('light_mode').onclick = () => toggle_light();
    document.getElementById('volume').value = localStorage.getItem('volume') || 50;
    
};

document.getElementById('start').onclick = () => {

    setTimeout(() => { let _ = document.getElementById('start'); _.parentElement.removeChild(_); }, 150);

    document.getElementById('loader').style.animation = 'fade-out 0.15s ease-in-out forwards';

    audio_context    = new AudioContext();
    analyser         = audio_context.createAnalyser();
    data             = new Uint8Array(analyser.frequencyBinCount);
    analyser.fftSize = 2048;

    document.getElementById('mute').onclick = () => {
        audio.muted = !audio.muted;
        document.getElementById('mute').classList.remove('fa-volume-mute', 'fa-volume-up');
    }

    reactor_loop();
    setInterval(() => {

        if(audio.volume != Number(document.getElementById('volume').value) / 100) audio.muted = false;
        if(audio.volume < 0.01) {
            audio.muted = true;
            document.getElementById('mute').classList.remove('fa-volume-mute', 'fa-volume-up');
        }

        if(      audio.muted && !document.getElementById('mute').classList.contains('fa-volume-mute')) document.getElementById('mute').classList.add('fa-volume-mute');
        else if(!audio.muted && !document.getElementById('mute').classList.contains('fa-volume-up'  )) document.getElementById('mute').classList.add('fa-volume-up');
        
        current_song_time  = ((new Date().getHours() * 60 * 60) + (new Date().getMinutes() * 60) + new Date().getSeconds() + offset) % combined_time;
        current_song       = get_current_song(current_song_time);
        current_song_time  = current_song_time - get_previous_times(current_song);
        
        // document.getElementById('time').value = audio.currentTime;
        
        if(audio.src.indexOf(current_song.file) == -1) {
            audio.src = `./media/audio/${current_song.file}`;
            document.getElementById('title').innerText = current_song.name;
            document.getElementById('subtitle').innerText = current_song.desc;
            // document.getElementById('time').max = current_song.secs;
        }
        
        if(Math.abs(Math.trunc(audio.currentTime) - current_song_time) > 2) audio.currentTime = current_song_time;
        audio.volume = Number(document.getElementById('volume').value) / 100;
        localStorage.setItem('volume', Math.trunc(document.getElementById('volume').value * 100) / 100);
                
    }, 10);

}
