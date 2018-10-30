var fire = firebase.initializeApp(config);
let databaseRef = fire.database();
let auth = fire.auth();

let leaderboardName = 'test';
let leaderboardRef = databaseRef.ref(leaderboardName);
let usersRef = databaseRef.ref('users');
let leaderboardShowing = false;
// let currentUserId = auth.currentUser.uid;

let gameModes = [
    'test',
    // 'survival',
    'timed'
]

let filterChoices = [
    ['Last day', 86400],
    ['Last week', 604800],
    ['Last month', 2592000],
    ['Last year', 31557600]
]

let currentGameMode = 0;
let times = [];
let buttons = [];
let refreshable = [];
let leaderboardData = [];
// let started = [];
let currentFilter = -1;
let numRows = 100;

function updateHighScore(userId, score) {
    console.log('update high score');
    console.log('user id = ' + userId);

    usersRef.child(userId).once('value', (snapshot) => {
        let highScore = snapshot.val().highScore;
        if (highScore == null || score > highScore) {
            // Update user high score.
            usersRef.child(userId).update({highScore: score});

            let scoreObject = {
                'score': score,
                'negativeScore': -score,
                'userId': userId,
                'date': new Date() / 1000
            }

            // Update leaderboard score.
            leaderboardRef.child(userId).update(scoreObject);
        }
    });
}

function toggleLeaderboard() {
    document.getElementById('leaderboard-wrapper').classList.toggle('hidden');
    document.getElementById('volume-wrapper').classList.add('hidden');

    if (!leaderboardShowing) {
        // setupFilters();
        trackLeaderboards();
        updateTimers();
        chooseGameMode(0);
    }

    leaderboardShowing = !leaderboardShowing;
}

// function setupFilters() {
//     for (let i = 0; i < filterChoices.length; i++) {
//         let button = document.createElement('button');
//         button.innerHTML = filterChoices[i][0];
//         button.onclick = function() {
//             setFilter(i);
//         }
//         document.body.appendChild(button);
//     }
// }

function clearFilter() {
    currentFilter = -1;
}

function setFilter(filterId) {
    currentFilter = filterChoices[filterId][1];
}

function trackLeaderboards() {
    for (let i = 0; i < gameModes.length; i++) {
        getLeaderboardData(gameModes[i]);
        times.push(2);
        // started.push(true);
        refreshable.push(false);

        // let button = document.createElement('button');
        // button.innerText = gameModes[i];
        // button.onclick = function() {
        //     chooseGameMode(i);
        // }
        // document.body.appendChild(button);
        // buttons.push(button);
    }
}

function disableGameMode(gameModeId) {
    buttons[gameModeId].disabled = true;
}

function enableGameMode(gameModeId) {
    buttons[gameModeId].disabled = false;
}

function updateTimers() {
    for (let i = 0; i < gameModes.length; i++) {
        times[i] = times[i] - 1;
        if (times[i] === 0) {
            times[i] = 60;
            refreshable[i] = true;
            if (currentGameMode === i) {
                showLeaderboard(i);
                refreshable[i] = true;
            }
        }
    }
    setTimeout(function () {
        updateTimers();
    }, 1000);
}

function getLeaderboardData(gameMode) {
    leaderboardData[gameMode] = [];
    let thisRank = 0;
    let prevScore = -1;
    let numScores = 0;
    let lbRef = databaseRef.ref(gameMode);
    lbRef.orderByChild('negativeScore').once('value', (snapshot) => {
        snapshot.forEach(function (childSnapshot) {
            numScores++;
            let thisScore = childSnapshot.val().score;
            let thisUserId = childSnapshot.val().userId;
            let thisUsername = childSnapshot.val().username;
            let thisDate = childSnapshot.val().date;
            let isCurrentUser = (thisUserId === auth.currentUser.uid);
            // If we want users with the same score to show up as the same rank, then uncomment the following if statement.
            // if (thisScore != prevScore) {
            thisRank++;
            // }
            prevScore = thisScore;

            if (numScores <= numRows) {
                if (currentFilter === -1 || thisDate + currentFilter >= (new Date().getTime() / 1000)) {
                    let scoreObject = {
                        'rank': thisRank,
                        'score': thisScore,
                        'userId': thisUserId,
                        'username': thisUsername,
                        'date': thisDate,
                        'isCurrentUser': isCurrentUser
                    }
                    leaderboardData[gameMode].push(scoreObject);
                }
            }

            if (isCurrentUser) {
                if (thisRank > 100) {
                    renderCurrentUserScore(thisRank, thisScore, thisDate);
                }
            }
        });
    });
}

function chooseGameMode(gameModeId) {
    if (currentGameMode == gameModeId) {
        return;
    }

    currentGameMode = gameModeId;

    if (refreshable[gameModeId]) {
        getLeaderboardData(gameModes[gameModeId]);
        refreshable[gameModeId] = false;
    }

    showLeaderboard(gameModeId);
}

function showLeaderboard(gameModeId) {
    console.log('showing leaderboard');
    let leaderboard = leaderboardData[gameModes[gameModeId]];
    let tableBody = document.getElementById('leaderboard-body');
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }
    for (let i = 0; i < leaderboard.length; i++) {
        let isCurrentUser = (leaderboard[i].userId === auth.currentUser.uid);

        let rowHTML = addRow(tableBody);
        addData(rowHTML, leaderboard[i].rank + '.', isCurrentUser);
        if (isCurrentUser) {
            addData(rowHTML, 'You', isCurrentUser);
        } else {
            addData(rowHTML, leaderboard[i].username, isCurrentUser);
        }
        addData(rowHTML, leaderboard[i].score, isCurrentUser);
        let dateString = getDateString(leaderboard[i].date);
        addData(rowHTML, dateString, isCurrentUser);
    }
}

function renderTimer(timerHTML, seconds) {
    timerHTML.innerHTML = 'Leaderboard updates in ' + seconds + ' seconds';
}

function getDateString(UTCSeconds) {
    let date = new Date(0);
    date.setUTCSeconds(UTCSeconds);
    return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDay();
}

function addTable(element) {
    let tableHTML = document.createElement('table');
    tableHTML.id = "inner-leaderboard-table";
    element.appendChild(tableHTML);
    return tableHTML;
}

function addRow(table) {
    let rowHTML = document.createElement('tr');
    table.appendChild(rowHTML);
    return rowHTML;
}

function addHeader(row, value) {
    let headerHTML = document.createElement('th');
    headerHTML.innerHTML = value;
    row.appendChild(headerHTML);
    return headerHTML;
}

function addData(row, value, addStyle) {
    let dataHTML = document.createElement('td');
    dataHTML.innerHTML = value;
    if (addStyle) {
        dataHTML.style.color = 'red';
    }
    row.appendChild(dataHTML);
    return dataHTML;
}

function renderLeaderboard(tableBody, leaderboard) {
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }
    for (let i = 0; i < leaderboard.length; i++) {
        let isCurrentUser = (leaderboard[i].userId === auth.currentUser.uid);

        let rowHTML = addRow(tableBody);
        addData(rowHTML, leaderboard[i].rank + '.', isCurrentUser);
        if (isCurrentUser) {
            addData(rowHTML, 'You', isCurrentUser);
        } else {
            addData(rowHTML, leaderboard[i].username, isCurrentUser);
        }
        addData(rowHTML, leaderboard[i].score, isCurrentUser);
        let dateString = getDateString(leaderboard[i].date);
        addData(rowHTML, dateString, isCurrentUser);
    }
}

// Fetches the current leaderboard from firebase and returns it as an array of score objects.
function updateLeaderboard(userId, innerWrapper, numRows) {
    let leaderboard = [];
    let thisRank = 0;
    let prevScore = -1;
    let numScores = 0;

    leaderboardRef.orderByChild('negativeScore').once('value', (snapshot) => {
        snapshot.forEach(function (childSnapshot) {
            numScores++;
            let thisScore = childSnapshot.val().score;
            let thisUserId = childSnapshot.val().userId;
            let thisUsername = childSnapshot.val().username;
            let thisDate = childSnapshot.val().date;
            let isCurrentUser = (thisUserId === userId);

            // If we want users with the same score to show up as the same rank, then uncomment the following if statement.
            // if (thisScore != prevScore) {
            thisRank++;
            // }
            prevScore = thisScore;

            if (numScores <= numRows) {
                appendScore(leaderboard, thisRank, thisScore, thisUserId, thisUsername, thisDate, isCurrentUser);
            }

            if (isCurrentUser) {
                // if (thisRank > 100) {
                    renderCurrentUserScore(thisRank, thisScore, thisDate);
                // }
            }
        });
    }).then(() => {
        renderLeaderboard(innerWrapper, leaderboard);
    });
}

function renderCurrentUserScore(rank, score, date) {
    let tableFoot = document.getElementById('leaderboard-foot');
    while (tableFoot.firstChild) {
        tableFoot.removeChild(tableFoot.firstChild);
    }

    let tableRow = document.createElement('tr');

    let tableData1 = document.createElement('td');
    tableData1.innerHTML = rank;
    let tableData2 = document.createElement('td');
    tableData2.innerHTML = 'You';
    let tableData3 = document.createElement('td');
    tableData3.innerHTML = score;
    let tableData4 = document.createElement('td');
    let dateString = getDateString(date);
    tableData4.innerHTML = dateString;

    tableRow.appendChild(tableData1);
    tableRow.appendChild(tableData2);
    tableRow.appendChild(tableData3);
    tableRow.appendChild(tableData4);
    tableFoot.appendChild(tableRow);
}

function appendScore(leaderboard, rank, score, userId, username, date, isCurrentUser) {
    let scoreObject = {
        'rank': rank,
        'score': score,
        'userId': userId,
        'username': username,
        'date': date,
        'isCurrentUser': isCurrentUser
    }
    leaderboard.push(scoreObject);
}

function addRandomScores(numberUsers) {
    for (let i = 0; i < numberUsers; i++) {
        addRandomScore();
    }
}

function addRandomScore() {
    let addingScore = Math.floor(Math.random() * Math.floor(200)) + 1;
    let addingDate = new Date() / 1000

    let scoreObject = {
        'score': addingScore,
        'negativeScore': -addingScore,
        'userId': Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 16),
        'username': Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 8),
        'date': addingDate
    }

    leaderboardRef.push(scoreObject);
}