let profileLoaded = false;

function toggleProfile() {
    document.getElementById('profile-wrapper').classList.toggle('hidden');
    document.getElementById('leaderboard-wrapper').classList.add('hidden');
    document.getElementById('volume-wrapper').classList.add('hidden');
    document.getElementById('submit-bug-wrapper').classList.add('hidden');

    if (!profileLoaded) {
        loadAvailableBallColors();
        profileLoaded = true;
    }
}

function updateBallColor() {
    let color = document.getElementById('select-ball-color').value;
    currentBallColor = color;
    usersRef.child(auth.currentUser.uid).update({ball_color: color});
    document.getElementById('select-ball-color-success-message').classList.remove('hidden');
    setTimeout(function() {
        document.getElementById('select-ball-color-success-message').classList.add('hidden');
    }, 1000);
}

function loadAvailableBallColors() {
    while(document.getElementById('select-ball-color').firstChild) {
        document.getElementById('select-ball-color').removeChild(document.getElementById('select-ball-color').firstChild);
    }
    let defaultOption = document.createElement('option');
    defaultOption.innerHTML = 'Black';
    defaultOption.value = 'Black';
    document.getElementById('select-ball-color').appendChild(defaultOption);

    usersRef.child(auth.currentUser.uid).child('available-ball-colors').once('value', (snapshot) => {
        snapshot.forEach(function (childSnapshot) {
            let color = childSnapshot.val();
            let colorOption = document.createElement('option');
            colorOption.innerHTML = color;
            colorOption.value = color;
            document.getElementById('select-ball-color').appendChild(colorOption);
        });
        // select the color that the player has set as current color
    });
}

function setUserDefaultBallColor() {
    if (auth.currentUser == null) {
        return;
    }
    usersRef.child(auth.currentUser.uid).child('ball_color').once('value', (snapshot) => {
        if (snapshot.val() != null) {
            currentBallColor = snapshot.val();
            document.getElementById('select-ball-color').value = snapshot.val();
        }
    });
}

function unlockNewColor(color) {
    usersRef.child(auth.currentUser.uid).child('available-ball-colors').push(color);
}

function updatePassword() {
    alert('Password updated successfully.');
}

// function GetUserSelectedColor() {
//     console.log('color!');
//     return 'red';
// }