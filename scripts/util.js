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
    console.log(altParams[0])
    for (let alt of altParams) {
        // console.log(alt)
        a = document.querySelector(alt)
        // console.log(a)
        if (!!a) {
            console.log("returning " + !!a)
            return a
        }
    }
    console.log("returning " + !!a)
    return a;
}

function necessaryWaitItems() {
    return [() => {return isElementAvailable(companyAltParams)}, 
            () => {return isElementAvailable(titleAltParams)},
            () => {return isElementAvailable(locationAltParams)}, 
            deetsWait];
}

// for some reason some characters are alternatingly encoded either directly or as unicode id
// so far all I have found is slash '/'
// cant be bothered to figure out where it occurs so imma equally apply this on everything
function normalize(input) {
    ret = []
    for (var i = 0; i < input.length; i++) {
        ret.push(input[i].replaceAll('\\u002', '\/').replaceAll('&amp;', '&'))
    }
    return ret
}