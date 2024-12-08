function error(errMsg) {
    alert(errMsg + " :(")
}

function getValue(dict, key) {
    let keyLocation = dict.search(key);
    let lenKey = key.length;

    // 1 = len("\"")
    let start = dict.slice(keyLocation+lenKey).search("\"");
    let end = dict.slice(keyLocation+lenKey+start+1).search("\"");
    let val = dict.slice(keyLocation+lenKey+start+1, keyLocation+lenKey+start+end+1);
    return val
}

function main() {

    let theChildren = document.body.children;
    var theChild;
    for (var i = 0; i < theChildren.length; i++) {
        if (theChildren[i].tagName == "SCRIPT" && theChildren[i].id == "") {
            theChild = theChildren[i];
            break;
        }
    }
    let source = theChild.innerHTML;

    let postedDate = getValue(source, "\"age\"");
    console.log(postedDate);

    // this data isnt hidden, but its displayed for user sanity check
    let jobTitle = getValue(source, "\"jobTitle\"");
    console.log(jobTitle);

    if (postedDate == "") {
        console.log("empty");
        return
    }

    console.log("creating");

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
    text.textContent = postedDate;
    text.style.marginTop = Math.random()*200;
    infoBox.appendChild(text);

    document.body.appendChild(infoBox);
    console.log("done creating");

}

main()

//todo: for index and jobs, make reload every time url param changes

// get job-full-details. title: jobsearch-JobInfoHeader-title, inlineHeader-companyName <a>, inlineHeader-companyLocation
// normalize and collate data

// for index: look at innerhtml of id: mosaic-data, 
// iteratively slice: "company":, "displayTitle":, "formattedLocation":
// see if normalized and collated matches with job-full-details
// if so, get formattedRelativeTime

// for jobs: same as above

// for viewjob: just look at innerhtml, key: "age"