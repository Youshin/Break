let bugsRef = databaseRef.ref('bugs');

function toggleBugSubmit() {
    document.getElementById('submit-bug-wrapper').classList.toggle('hidden');
    document.getElementById('leaderboard-wrapper').classList.add('hidden');
    document.getElementById('volume-wrapper').classList.add('hidden');
    document.getElementById('profile-wrapper').classList.add('hidden');
}

function submitBug() {
    let bugText = document.getElementById('submit-bug-text').value;

    if (bugText == null || bugText.length < 10) {
        alert('Enter at least 10 characters to submit a bug');
    } else {
        bugsRef.push({"text": bugText});
        alert('Bug submitted!');
    }
}