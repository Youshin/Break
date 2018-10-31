let bugsRef = databaseRef.ref('bugs');

function toggleBugSubmit() {
    // toggle hidden class on bug wrapper.
    document.getElementById('submit-bug-wrapper').classList.toggle('hidden');
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