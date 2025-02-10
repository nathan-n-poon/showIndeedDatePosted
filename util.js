// util
function error(errMsg) {
    alert(errMsg + " :(")
}

function getSubdirectory() {
    const url = window.location.href
    if (url == `https://ca.indeed.com/` || 
        url.search(`https://ca.indeed.com/\\?`) != -1
    ) {
        return Subdirectory.ROOT;
    }
    if (url.search(`https://ca.indeed.com/jobs`) != -1) {
        return Subdirectory.JOBS;
    }
    if (url.search(`https://ca.indeed.com/viewjob`) != -1) {
        return Subdirectory.VIEWJOB;
    }
    return Subdirectory.INCOMPATIBLE;
}

function extractValue(dict, leftBound, rightBound) {
    let leftIndex = dict.search(leftBound) + leftBound.length;
    let rightIndex = dict.slice(leftIndex).search(rightBound);

    return dict.slice(leftIndex, leftIndex+rightIndex);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function strikeThrough(text) {
    return text
      .split('')
      .map(char => char + '\u0336')
      .join('')
}

function waitTilReady(waitGroup, finallyExecute) {
    var ready = true;
    // console.log(waitGroup)

    for (let waitItem of waitGroup) {
        // console.log("boopis")
        // console.log(waitItem())
        x = !!waitItem()
        console.log(x)
        ready &= x;
    }
    console.log(ready)
    if (!ready) {
        //console.log("waiting")
        infoBox.querySelector('p').textContent = "loading";
        window.setTimeout(function(){waitTilReady(waitGroup, finallyExecute)}, 500);
        return;
    }
    finallyExecute();
}