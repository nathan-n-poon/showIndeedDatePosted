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

    for (let waitItem of waitGroup) {
        x = !!waitItem()
        ready &= x;
    }
    if (!ready) {
        infoBox.querySelector('p').textContent = "loading";
        window.setTimeout(function(){waitTilReady(waitGroup, finallyExecute)}, 500);
        return;
    }
    finallyExecute();
}


const deetsWait = () => {
    let subDir = getSubdirectory();
    if (subDir == Subdirectory.ROOT) {
        return document.getElementById("job-full-details");
    }
    if (subDir == Subdirectory.JOBS) {
        return document.getElementById("jobsearch-ViewjobPaneWrapper");
    }
    if (subDir == Subdirectory.VIEWJOB) {
        return true;
    }
};

// There are alternate forms which some elements can take.
// But these are also tentative probes for elements which may not exist at all, so none can be unwrapped
// with .textCOntent, .innerHTML, etc...
function isElementAvailable(altParams) {
    var a = null;
    for (let alt of altParams) {
        a = document.querySelector(alt)
        if (!!a) {
            return a
        }
    }
    return a;
}

function necessaryWaitItems() {
    return [() => {return isElementAvailable(companyAltParams)}, 
            () => {return isElementAvailable(titleAltParams)},
            () => {return isElementAvailable(locationAltParams)}, 
            deetsWait];
}

const threatLevel = 0
function debugLog(msg, level) {
    if (level < threatLevel) {
        console.log(msg)
    }
}