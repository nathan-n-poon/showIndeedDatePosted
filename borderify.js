// "formattedLocation":"City, Province","
let entryDelimiter = `","`;

const Subdirectory = Object.freeze({
    ROOT:   Symbol("root"),
    JOBS:  Symbol("job"),
    VIEWJOB: Symbol("viewjob"),
    INCOMPATIBLE: Symbol("incompatible")
});

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

function waitTilReady(firstWaitGroup, finallyExecute) {
    var ready = true;
    for (let waitItem of firstWaitGroup) {
        //console.log(waitItem())
        ready &= !!waitItem();
    }
    if (!ready) {
        //console.log("waiting")
        infoBox.querySelector('p').textContent = "loading";
        window.setTimeout(function(){waitTilReady(firstWaitGroup, finallyExecute)}, 500);
        return;
    }
    finallyExecute();
}



// entry
var alerted = false;
const infoBox = document.createElement('div');
infoBox.setAttribute("id", "infoBox");
const minButton = document.createElement('button');
const refreshButton = document.createElement('img');
function init() {
    console.log("init")
    document.body.appendChild(infoBox);
    document.body.appendChild(minButton);
    document.body.appendChild(refreshButton);

    var lastURL = window.location.href;
    window.addEventListener("mousedown", async function(){
        console.log("CLICK!")
        await sleep(1000);
        console.log(window.location.href)
        console.log(lastURL)
        if (window.location.href != lastURL) {
            console.log("registered update")
            waitTilReady(necessaryWaitItems(), displayInfo);
            lastURL = window.location.href
        }
    });

    displayInfo();
}

console.log("HERE!")
// firstTry: there are alternate forms which some elements can take
// but these are also tentative probes for elements which may not exist at all, so none can be unwrapped
// with .textCOntent, .innerHTML, etc...
const companyWait  =  () => {
    firstTry = document.querySelector('.jobsearch-JobInfoHeader-companyNameSimple')
    if (firstTry) {
        return firstTry
    }
    secondTry = document.querySelector('.jobsearch-JobInfoHeader-companyNameLink')
    if (secondTry) {
        return secondTry
    }
    thirdTry = document.querySelector('[data-testid="inlineHeader-companyName"]')
    return thirdTry
};
const titleWait = () => {
    firstTry = document.querySelector('[data-testid="simpler-jobTitle"]')
    if (firstTry) {
        return firstTry
    }
    return document.querySelector('[data-testid="jobsearch-JobInfoHeader-title"]')
};
const locationWait = () => {
    //wtf
    firstTry = document.querySelector(`[data-testid=jobsearch-JobInfoHeader-companyLocation]`);
    if(firstTry) {
        return firstTry;
    }
    else {
        return document.querySelector('[data-testid="job-location"]')
    }
};
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
function necessaryWaitItems() {
    return [companyWait, titleWait, locationWait, deetsWait];
}

function displayInfo() {
    console.log("displaying info!")
    var detailsAndDate = [];

    let url = window.location.href;
    let subDir = getSubdirectory()
    if (subDir == Subdirectory.ROOT || subDir == Subdirectory.JOBS) {
        let details = getSpotlightJobDetails();
        //console.log("gotten details: " + details);
        let datePosted = rootAndJobsGetDatePosted(details);
        details.push(datePosted);
        detailsAndDate = details
    }
    else if (subDir == Subdirectory.VIEWJOB) {
        detailsAndDate = viewJobGetDatePosted();
    } 
    else {
        error("cant work on this page");
    }
    //console.log(detailsAndDate)

    updateInfoBox(normalize(detailsAndDate));
}

var buttonState = true;
function styleInfoBox() {
    let text = document.createElement('p');
    text.style.color = "white";
    infoBox.appendChild(text);

    const size = 200;
    const buttonSize = 50;

    infoBox.style.cssText = `
    background-color: #5acffb;
    height: ${size}px;
    width: ${size}px;
    position: fixed;
    bottom: 0;
    right: ${buttonSize/2}px;
    padding: 10px;
    border-radius: 10px;
    `;

    minButton.setAttribute("id", "min_button");
    minButton.style.cssText = `
    background-color: #f5abb9;
    height: ${buttonSize}px;
    width: ${buttonSize}px;
    border-radius: 50%;
    border: 0px;
    position: fixed;
    bottom: ${size-buttonSize/4}px;
    right: ${buttonSize/4}px;
    cursor: pointer;
    transition: transform .7s ease-in-out;
    `

    const buttonIcon = document.createElement('span');
    buttonIcon.textContent = "-";
    buttonIcon.style.cssText = `
        color: white;
        font-size: 50px;
        position: relative;
        bottom: 10px;
    `
    minButton.addEventListener("click", () => {
        buttonState = !buttonState;
        if (buttonState) {
            infoBox.style.display = "block";
            refreshButton.style.display = "block";
            buttonIcon.textContent = "-"
        } else {
            infoBox.style.display = "none"
            refreshButton.style.display = "none"
            buttonIcon.textContent = "+"
        }
    })

    minButton.appendChild(buttonIcon)

    refreshButton.setAttribute("id", "refresh_button") 
    refreshButton.src = browser.runtime.getURL("icons/refresh.png")
    refreshButton.style.cssText = `
    width: ${buttonSize/2}px;
    height: ${buttonSize/2}px;
    position: fixed;
    bottom: ${size-buttonSize}px;
    right: ${buttonSize/4}px;
    background-color: #f5abb9;
    border-radius: 50%;
    transition: transform .7s ease-in-out;
    cursor: pointer;
    `

    const cssHoverEffects = `
    #refresh_button:hover {
        transform: rotate(360deg);
    }
    #min_button:hover {
        transform: rotate(360deg);
    }
    `;
    var style = document.createElement('style');

    if (style.styleSheet) {
        style.styleSheet.cssText = cssHoverEffects;
    } else {
        style.appendChild(document.createTextNode(cssHoverEffects));
    }

    document.getElementsByTagName('head')[0].appendChild(style);
}

if (getSubdirectory() != Subdirectory.INCOMPATIBLE) {
    styleInfoBox();
    waitTilReady(necessaryWaitItems(), function () {
        var wait4 =
            function () {
                //console.log("IN 4!!!!!!")
                var wait = companyWait().textContent;
                if (wait.search(".css") != -1) {
                    wait = wait.slice(0, wait.search(".css"))
                }
                return wait;
        };
        console.log("HERE 2!")
        waitTilReady([wait4], init);
    });
}

function updateInfoBox(detailsAndDate){
    //console.log("updating")
    document.getElementById("infoBox").querySelector('p').textContent = detailsAndDate.join();
}


// get the details of current spotlighted job posting
// normalize and collate data
function getSpotlightJobDetails() {
    console.log("indeed is a bastard")
    // below comment is deprecated
    // <span>Title<span class="css-1b6omqv esbq1260"> - job post</span></span>
    let title = titleWait().textContent;

    let companyNameContainer1 = companyWait();
    // <a href="privacy_destroying_link" ...>Company Name<svg etc></svg></a>
    var company = companyNameContainer1.textContent;
    //console.log("THE COMPANY IS: " + company)
    // let company = extractValue(companyNameContainer2, "", `<svg`);
    if (company.search(".css") != -1) {
        company = company.slice(0, company.search(".css"))
    }

    let location = locationWait().innerText;
    
    return [title, company, location];
}

// requisite: order of fields is company, title, location, date
function rootAndJobsGetDatePosted(matchTarget) {
    var grepThis = document.getElementById("mosaic-data").innerHTML;
    console.log("match target is: ")
    console.log(matchTarget)

    while(true) {
        //console.log(grepThis);
        if (grepThis.search(`"formattedLocation":`) == -1) {
            //console.log("ALERTING")
            if (!alerted) {
                alert(`Uh oh!  Either you tried to look at a posting which dynamically loaded in, or there is simply a timing glitch.\n`
                    +`Best you can do is open these postings in a new tab to see their posting date, or.... ` 
                    + strikeThrough("submit a PR") +
                    ` write your own plugin because this is a steaming mess!`);
            }
            document.body.removeChild(infoBox);
            document.body.removeChild(minButton);
            document.body.removeChild(refreshButton);
            alerted = true;
            return
        }
        //console.log(grepThis.search(`"company":`), grepThis.search(`"displayTitle":`),  grepThis.search(`"formattedLocation":`))

        var displayTitle = extractValue(grepThis, `"displayTitle":"`, entryDelimiter);
        var company = extractValue(grepThis, `"company":"`, entryDelimiter);
        var location = extractValue(grepThis, `"formattedLocation":"`, entryDelimiter);

        advancedIndex = grepThis.search(`"formattedLocation":`) + `"formattedLocation":`.length + location.length;
        //console.log("ADVANCED INDEX IS " + advancedIndex);
        grepThis = grepThis.slice(advancedIndex);

        let collatedDetails = [displayTitle, company, location];
        //console.log((matchTarget + "\n" +collatedDetails))
        console.log(collatedDetails)
        if (checkSameJobRef(matchTarget, collatedDetails)) {
            break;
        }
    }
    return extractValue(grepThis, `"formattedRelativeTime":"`, entryDelimiter)
}

function checkSameJobRef(spotlightDetails, scriptExtractDetails) {
    let normalizedSpotlightDetails = normalize(spotlightDetails);
    let normalizedScriptExtractDetails = normalize(scriptExtractDetails)
    console.log("holy")
    console.log(normalizedSpotlightDetails)
    console.log(normalizedScriptExtractDetails)

    // why
    let matchTitle = (normalizedSpotlightDetails[0] == normalizedScriptExtractDetails[0]) || 
                        (normalizedSpotlightDetails[0] == (normalizedScriptExtractDetails[0] + " - job post"));
    let matchCompany = normalizedSpotlightDetails[1] == normalizedScriptExtractDetails[1];
    let matchLocation = normalizedSpotlightDetails[2].search(normalizedScriptExtractDetails[2]) != -1;
    console.log(matchTitle, matchCompany, matchLocation)
    console.log("hell")

    return matchTitle && matchCompany && matchLocation;
}

// mabe defines at top
function viewJobGetDatePosted() {
    let source = document.body.innerHTML;
    let postedDate = extractValue(source, `"age":`, entryDelimiter);

    // this data isnt hidden, but its displayed for user sanity check
    let jobTitle = extractValue(source, `"jobTitle":`, entryDelimiter);
    let companyName = extractValue(source, `"companyName":`, entryDelimiter);
    let location = extractValue(source, `"formattedLocation":`, entryDelimiter);

    return [jobTitle, companyName, location, postedDate];
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
