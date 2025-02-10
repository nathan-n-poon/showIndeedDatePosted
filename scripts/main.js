//global state
var alerted = false;
var buttonState = true;

// html elems
const infoBox = document.createElement('div');
infoBox.setAttribute("id", "infoBox");
const minButton = document.createElement('button');
const refreshButton = document.createElement('img');

main()
function main() {
    if (getSubdirectory() != Subdirectory.INCOMPATIBLE) {
        styleInfoBox();
        waitTilReady(necessaryWaitItems(), function () {
            var wait4 =
                function () {
                    var wait = isElementAvailable(companyAltParams).textContent;
                    // prunes the svg sometimes appended to the company name
                    // the svg is a link icon to indicate a comapny profile page
                    if (wait.search(".css") != -1) {
                        wait = wait.slice(0, wait.search(".css"))
                    }
                    return wait;
            };
            waitTilReady([wait4], init);
        });
    }
}


function init() {
    document.body.appendChild(infoBox);
    document.body.appendChild(minButton);
    document.body.appendChild(refreshButton);

    var lastURL = window.location.href;
    window.addEventListener("mousedown", async function(){
        await sleep(1000);
        if (window.location.href != lastURL) {
            waitTilReady(necessaryWaitItems(), displayInfo);
            lastURL = window.location.href
        }
    });

    displayInfo();
}

function displayInfo() {
    var detailsAndDate = [];

    let url = window.location.href;
    let subDir = getSubdirectory()
    if (subDir == Subdirectory.ROOT || subDir == Subdirectory.JOBS) {
        let details = getSpotlightJobDetails();
        //"gotten details: " + details);
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

    updateInfoBox(normalize(detailsAndDate));
}

function styleInfoBox() {
    let text = document.createElement('p');
    text.style.color = "white";
    infoBox.appendChild(text);

    infoBox.style.cssText = infoBoxCss;

    minButton.setAttribute("id", "min_button");
    minButton.style.cssText = minButtonCss;

    const buttonIcon = document.createElement('span');
    buttonIcon.textContent = "-";
    buttonIcon.style.cssText = buttonIconCss

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
    refreshButton.style.cssText = refreshButtonCss;

    const cssHoverEffects = refreshButtonHoverCss
    
    var style = document.createElement('style');

    if (style.styleSheet) {
        style.styleSheet.cssText = cssHoverEffects;
    } else {
        style.appendChild(document.createTextNode(cssHoverEffects));
    }

    document.getElementsByTagName('head')[0].appendChild(style);
}

function updateInfoBox(detailsAndDate){
    document.getElementById("infoBox").querySelector('p').textContent = detailsAndDate.join();
}