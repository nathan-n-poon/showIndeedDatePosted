// get the details of current spotlighted job posting
// normalize and collate data
function getSpotlightJobDetails() {
    // below comment is deprecated
    // <span>Title<span class="css-1b6omqv esbq1260"> - job post</span></span>
    let title = isElementAvailable(titleAltParams).textContent;

    let companyNameContainer1 = isElementAvailable(companyAltParams);
    // <a href="privacy_destroying_link" ...>Company Name<svg etc></svg></a>
    var company = companyNameContainer1.textContent;
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


    while(true) {
        if (grepThis.search(`"formattedLocation":`) == -1) {
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

        var displayTitle = extractValue(grepThis, `"displayTitle":"`, entryDelimiter);
        var company = extractValue(grepThis, `"company":"`, entryDelimiter);
        var location = extractValue(grepThis, `"formattedLocation":"`, entryDelimiter);

        advancedIndex = grepThis.search(`"formattedLocation":`) + `"formattedLocation":`.length + location.length;
        grepThis = grepThis.slice(advancedIndex);

        let collatedDetails = [displayTitle, company, location];
        if (checkSameJobRef(matchTarget, collatedDetails)) {
            break;
        }
    }
    return extractValue(grepThis, `"formattedRelativeTime":"`, entryDelimiter)
}

function checkSameJobRef(spotlightDetails, scriptExtractDetails) {
    let normalizedSpotlightDetails = normalize(spotlightDetails);
    let normalizedScriptExtractDetails = normalize(scriptExtractDetails)

    // why
    let matchTitle = (normalizedSpotlightDetails[0] == normalizedScriptExtractDetails[0]) || 
                        (normalizedSpotlightDetails[0] == (normalizedScriptExtractDetails[0] + " - job post"));
    let matchCompany = normalizedSpotlightDetails[1] == normalizedScriptExtractDetails[1];
    let matchLocation = normalizedSpotlightDetails[2].search(normalizedScriptExtractDetails[2]) != -1;

    return matchTitle && matchCompany && matchLocation;
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
