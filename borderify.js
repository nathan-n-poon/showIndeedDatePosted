//todo: for index and jobs, make reload every time url param changes

function error(errMsg) {
    alert(errMsg + " :(")
}

// "formattedLocation":"City, Province","
let entryDelimiter = `","`;

const Subdirectory = Object.freeze({
    ROOT:   Symbol("root"),
    JOBS:  Symbol("job"),
    VIEWJOB: Symbol("viewjob"),
    INCOMPATIBLE: Symbol("incompatible")
});


function extractValue(dict, leftBound, rightBound) {
    let leftIndex = dict.search(leftBound) + leftBound.length;
    let rightIndex = dict.slice(leftIndex).search(rightBound);

    return dict.slice(leftIndex, leftIndex+rightIndex);
}

function waitTilReady(firstWaitGroup, finallyExecute) {
    var ready = true;
    for (let waitItem of firstWaitGroup) {
        //console.log(waitItem())
        ready &= !!waitItem();
    }
    if (!ready) {
        //console.log("waiting")
        window.setTimeout(function(){waitTilReady(firstWaitGroup, finallyExecute)}, 500);
        return;
    }
    finallyExecute();
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

const infoBox = document.createElement('div');
function init() {
    infoBox.setAttribute("id", "infoBox");
    infoBox.style.backgroundColor = "blue";
    infoBox.style.height = "200px";
    infoBox.style.width = "200px";
    infoBox.style.position = "fixed";
    infoBox.style.bottom = 0;
    infoBox.style.right = 0;
    infoBox.style.opacity = 0.8;
    let text = document.createElement('p');
    infoBox.appendChild(text);
    document.body.appendChild(infoBox);

    var lastURL = window.location.href;
    window.addEventListener("mousedown", async function(){
        console.log("CLICK!")
        await sleep(400);
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
const companyWait  =  () => {return document.querySelector('[data-testid=inlineHeader-companyName]')};
function necessaryWaitItems() {
    var wait1 = () => {return document.querySelector('[data-testid=jobsearch-JobInfoHeader-title]')};
    var wait2 = companyWait;
    var wait3 = () => {return document.querySelector(`[data-testid=inlineHeader-companyLocation]`)};
    var wait5 = () => {
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

    return [wait1, wait2, wait3, wait5];
}

if (getSubdirectory() != Subdirectory.INCOMPATIBLE) {
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


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function updateInfoBox(detailsAndDate){
    //console.log("updating")
    document.getElementById("infoBox").textContent = detailsAndDate.join();
}


// get the details of current spotlighted job posting
// normalize and collate data
function getSpotlightJobDetails() {
    let titleContainer = document.querySelector('[data-testid=jobsearch-JobInfoHeader-title]').innerHTML;
    // <span>Title<span class="css-1b6omqv esbq1260"> - job post</span></span>
    let title = extractValue(titleContainer, `<span>`, `<span`);

    let companyNameContainer1 = document.querySelector('[data-testid=inlineHeader-companyName]');
    // <a href="privacy_destroying_link" ...>Company Name<svg etc></svg></a>
    var company = companyNameContainer1.textContent;
    //console.log("THE COMPANY IS: " + company)
    // let company = extractValue(companyNameContainer2, "", `<svg`);
    if (company.search(".css") != -1) {
        company = company.slice(0, company.search(".css"))
    }

    let location = document.querySelector('[data-testid=inlineHeader-companyLocation]').innerText;
    
    return [title, company, location];
}

function strikeThrough(text) {
    return text
      .split('')
      .map(char => char + '\u0336')
      .join('')
  }

// requisite: order of fields is company, title, location, date
function rootAndJobsGetDatePosted(matchTarget) {
    var grepThis = document.getElementById("mosaic-data").innerHTML;
    while(true) {
        //console.log(grepThis);
        if (grepThis.search(`"formattedLocation":`) == -1) {
            //console.log("ALERTING")
            alert(`Uh oh!  Loading new content into the same page will not retrieve any new date posted info!\n SOL.  Best you can do now is open these postings in their own page or ` 
            + strikeThrough("submit a PR") +
            ` write your own plugin because this is a steaming mess!`);
            document.body.removeChild(infoBox);
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
        if (checkSameJobRef(matchTarget, collatedDetails)) {
            break;
        }
    }
    return extractValue(grepThis, `"formattedRelativeTime":"`, entryDelimiter)
}

function checkSameJobRef(spotlightDetails, scriptExtractDetails) {
    normalizedSpotlightDetails = normalize(spotlightDetails);
    normalizedScriptExtractDetails = normalize(scriptExtractDetails)
    let matchTitle = normalizedSpotlightDetails[0] == normalizedScriptExtractDetails[0];
    let matchCompany = normalizedSpotlightDetails[1] == normalizedScriptExtractDetails[1];
    let matchLocation = normalizedSpotlightDetails[2].search(normalizedScriptExtractDetails[2]) != -1;

    return matchTitle && matchCompany && matchLocation;
}

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
