// get the details of current spotlighted job posting
// normalize and collate data
function getSpotlightJobDetails() {
    console.log("indeed is a bastard")
    // below comment is deprecated
    // <span>Title<span class="css-1b6omqv esbq1260"> - job post</span></span>
    let title = isElementAvailable(titleAltParams).textContent;

    let companyNameContainer1 = isElementAvailable(companyAltParams);
    // <a href="privacy_destroying_link" ...>Company Name<svg etc></svg></a>
    var company = companyNameContainer1.textContent;
    //console.log("THE COMPANY IS: " + company)
    // let company = extractValue(companyNameContainer2, "", `<svg`);
    if (company.search(".css") != -1) {
        company = company.slice(0, company.search(".css"))
    }

    let location = isElementAvailable(locationAltParams).innerText;
    
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
    console.log(normalizedSpotlightDetails)
    console.log(normalizedScriptExtractDetails)

    // why
    let matchTitle = (normalizedSpotlightDetails[0] == normalizedScriptExtractDetails[0]) || 
                        (normalizedSpotlightDetails[0] == (normalizedScriptExtractDetails[0] + " - job post"));
    let matchCompany = normalizedSpotlightDetails[1] == normalizedScriptExtractDetails[1];
    let matchLocation = normalizedSpotlightDetails[2].search(normalizedScriptExtractDetails[2]) != -1;
    console.log(matchTitle, matchCompany, matchLocation)

    return matchTitle && matchCompany && matchLocation;
}
