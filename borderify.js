//todo: for index and jobs, make reload every time url param changes

function error(errMsg) {
    alert(errMsg + " :(")
}

// "formattedLocation":"City, Province","
let entryDelimiter = `","`;

const Subdirectory = Object.freeze({
    ROOT:   Symbol("root"),
    JOBS:  Symbol("job"),
    VIEWJOB: Symbol("viewjob")
});


function extractValue(dict, leftBound, rightBound) {
    let leftIndex = dict.search(leftBound) + leftBound.length;
    let rightIndex = dict.slice(leftIndex).search(rightBound);

    return dict.slice(leftIndex, leftIndex+rightIndex);
}

function waitTilReady() {
    var wait1 = document.querySelector('[data-testid=jobsearch-JobInfoHeader-title]');
    var wait2 = document.querySelector('[data-testid=inlineHeader-companyName]');
    var wait3 = document.querySelector(`[data-testid=inlineHeader-companyLocation]`);
    if((wait1 == undefined || wait2 == undefined || wait3 == undefined)) {
        //The node we need does not exist yet.
        //Wait 500ms and try again
        console.log("waiting")
        window.setTimeout(waitTilReady, 500);
        return;
    }
    console.log("DONE WAITING: " + wait1 + wait2.innerHTML + wait3);
    let infoBox = document.createElement('div');
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
    main();
}


function main(infoBox) {
    var detailsAndDate = [];

    let url = window.location.href;
    if (url == `https://ca.indeed.com/` || 
        url.search(`https://ca.indeed.com/\\?`) != -1 ||
        url.search(`https://ca.indeed.com/jobs`) != -1
    ) {
        console.log("DEBUG: not in viewjob");
        let details = getSpotlightJobDetails();
        console.log("gotten details: " + details[0]);
        let datePosted = rootAndJobsGetDatePosted(details);
        details.push(datePosted);
        detailsAndDate = details
    }
    else if (url.search(`https://ca.indeed.com/viewjob`) != -1) {
        console.log("DEBUG: In viewjob");
        detailsAndDate = viewJobGetDatePosted();
    } 
    else {
        error("cant work on this page");
    }
    console.log(detailsAndDate)

    updateInfoBox(infoBox, detailsAndDate);
}
waitTilReady();

var lastURL = window.location.href;
window.addEventListener("click", function(){
    if (window.location.href != lastURL) {
        waitTilReady();
    }
  });



function updateInfoBox(infoBox, detailsAndDate){
    console.log("updating")
    document.getElementById("infoBox").textContent = detailsAndDate.join();
}


// get the details of current spotlighted job posting
// normalize and collate data
function getSpotlightJobDetails() {
    let titleContainer = document.querySelector('[data-testid=jobsearch-JobInfoHeader-title]').innerHTML;
    // <span>Title<span class="css-1b6omqv esbq1260"> - job post</span></span>
    let title = extractValue(titleContainer, `<span>`, `<span`);

    console.log("DEBUG " + document.querySelector('[data-testid=inlineHeader-companyName]'));
    let companyNameContainer1 = document.querySelector('[data-testid=inlineHeader-companyName]');
    // <a href="privacy_destroying_link" ...>Company Name<svg etc></svg></a>
    var company = companyNameContainer1.querySelector("a").text;
    // let company = extractValue(companyNameContainer2, "", `<svg`);
    if (company.search(".css") != -1) {
        company = company.slice(0, company.search(".css"))
    }

    let location = document.querySelector('[data-testid=inlineHeader-companyLocation]').innerText;
    
    return [title, company, location];
}

// requisite: formattedRelativeTime (what we are looking for) must come after all of title, company, and location
function rootAndJobsGetDatePosted(matchTarget) {
    var grepThis = document.getElementById("mosaic-data").innerHTML;
    for (var i = 0; i < 20; i++) {
        var advancedIndex = Math.max(
            grepThis.search(`"displayTitle":`),
            grepThis.search(`"company":`),
            grepThis.search(`"formattedLocation":`),
        );
        if (advancedIndex == -1) {
            error("uh oh");
            return;
        }

        var displayTitle = extractValue(grepThis, `"displayTitle":"`, entryDelimiter);
        var company = extractValue(grepThis, `"company":"`, entryDelimiter);
        var location = extractValue(grepThis, `"formattedLocation":"`, entryDelimiter);

        console.log("ADVANCED INDEX IS " + advancedIndex);
        grepThis = grepThis.slice(advancedIndex);

        let collatedDetails = [displayTitle, company, location];
        console.log((matchTarget + "\n" +collatedDetails))
        if (checkSameJobRef(matchTarget, collatedDetails)) {
            break;
        }
    }
    return extractValue(grepThis, `"formattedRelativeTime":"`, entryDelimiter)
}

function checkSameJobRef(spotlightDetails, scriptExtractDetails) {
    let matchTitle = spotlightDetails[0] == scriptExtractDetails[0];
    let matchCompany = spotlightDetails[1] == spotlightDetails[1];
    let matchLocation = spotlightDetails[2].search(scriptExtractDetails[2]) != -1;

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
function normalizer(input) {
    var stringCollector = "";
    for (var i = 0; i < input.length; i++) {
        stringCollector += input[i]; 
    }
    return stringCollector.replaceAll('\\u002', '\/')
}

