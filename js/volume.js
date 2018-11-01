let masterVolume = .5;
let effectsVolume = .5;
let musicVolume = .5;

function toggleVolumeOptions() {
    document.getElementById('volume-wrapper').classList.toggle('hidden');
    document.getElementById('leaderboard-wrapper').classList.add('hidden');
    document.getElementById('submit-bug-wrapper').classList.add('hidden');
    document.getElementById('profile-wrapper').classList.add('hidden');
}

function playMusic() {
    document.getElementById('music').play();
}

function playWoosh() {
    document.getElementById('woosh').play();
}

function playPop1() {
    let obj = document.createElement('audio');
    obj.volume = getEffectsVolume();
    let src = document.createElement('source');
    src.src = '328117__greenvwbeetle__pop-8.flac';
    src.type = 'audio/flac';
    obj.appendChild(src);
    obj.play();
    // document.getElementById('pop1').play();
}

function playPop2() {
    let obj = document.createElement('audio');
    obj.volume = getEffectsVolume();
    let src = document.createElement('source');
    src.src = '411642__inspectorj__pop-high-a-h1.wav';
    src.type = 'audio/wav';
    obj.appendChild(src);
    obj.play();
    // document.getElementById('pop2').play();
}

function playUp1() {
    document.getElementById('up1').play();
    document.getElementById('up2').play();
}

function playUp2() {
    document.getElementById('up2').play();
}

function playDing() {
    document.getElementById('ding').play();
}

function playGameOver() {
    console.log('play gameover');
    document.getElementById('gameover').play();
}

function volumeChanged() {
    document.getElementById('music').volume = getMusicVolume();
    document.getElementById('pop1').volume = getEffectsVolume();
    document.getElementById('pop2').volume = getEffectsVolume();
    document.getElementById('up1').volume = getEffectsVolume();
    document.getElementById('up2').volume = getEffectsVolume();
    document.getElementById('gameover').volume = getEffectsVolume();
}

function updateMasterVolume(e) {
    masterVolume = e;
    volumeChanged();
}

function updateEffectsVolume(e) {
    effectsVolume = e;
    volumeChanged();
}

function updateMusicVolume(e) {
    musicVolume = e;
    volumeChanged();
}

function createMasterVolumeSlider() {
    let masterVolumeHTML = document.createElement('div');
    masterVolumeHTML.innerHTML = "Master Volume";
    document.body.appendChild(masterVolumeHTML);
    let masterVolumeControlHTML = document.createElement('input');
    masterVolumeControlHTML.type = 'range';
    masterVolumeControlHTML.min = '0';
    masterVolumeControlHTML.max = '1';
    masterVolumeControlHTML.step = '.01';
    masterVolumeControlHTML.addEventListener('input', function() {
        masterVolume = masterVolumeControlHTML.value;
        volumeChanged();
        console.log('master volume set to ' + masterVolume);
    });
    masterVolumeControlHTML.addEventListener('change', function() {
        masterVolume = masterVolumeControlHTML.value;
        volumeChanged();
        console.log('master volume set to ' + masterVolume);
    });
    masterVolumeHTML.appendChild(masterVolumeControlHTML);
}

function createEffectsVolumeSlider() {
    let effectsVolumeHTML = document.createElement('div');
    effectsVolumeHTML.innerHTML = "Effects Volume";
    document.body.appendChild(effectsVolumeHTML);
    let effectsVolumeControlHTML = document.createElement('input');
    effectsVolumeControlHTML.type = 'range';
    effectsVolumeControlHTML.min = '0';
    effectsVolumeControlHTML.max = '1';
    effectsVolumeControlHTML.step = '.01';
    effectsVolumeControlHTML.addEventListener('input', function() {
        effectsVolume = effectsVolumeControlHTML.value;
        volumeChanged();
        console.log('effects volume set to ' + effectsVolume);
    });
    effectsVolumeControlHTML.addEventListener('change', function() {
        effectsVolume = effectsVolumeControlHTML.value;
        volumeChanged();
        console.log('effects volume set to ' + effectsVolume);
    });
    effectsVolumeHTML.appendChild(effectsVolumeControlHTML);
}

function createMusicVolumeSlider() {
    let musicVolumeHTML = document.createElement('div');
    musicVolumeHTML.innerHTML = "Music Volume";
    document.body.appendChild(musicVolumeHTML);
    let musicVolumeControlHTML = document.createElement('input');
    musicVolumeControlHTML.type = 'range';
    musicVolumeControlHTML.min = '0';
    musicVolumeControlHTML.max = '1';
    musicVolumeControlHTML.step = '.01';
    musicVolumeControlHTML.addEventListener('input', function() {
        musicVolume = musicVolumeControlHTML.value;
        volumeChanged();
        console.log('music volume set to ' + musicVolume);
    });
    musicVolumeControlHTML.addEventListener('change', function() {
        musicVolume = musicVolumeControlHTML.value;
        volumeChanged();
        console.log('music volume set to ' + musicVolume);
    });
    musicVolumeHTML.appendChild(musicVolumeControlHTML);
}

function getMasterVolume() {
    return masterVolume;
}

function getEffectsVolume() {
    return masterVolume * effectsVolume;
}

function getMusicVolume() {
    return masterVolume * musicVolume;
}