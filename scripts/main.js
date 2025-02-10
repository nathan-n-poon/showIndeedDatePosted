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
                    //console.log("IN 4!!!!!!")
                    var wait = isElementAvailable(companyAltParams).textContent;
                    if (wait.search(".css") != -1) {
                        wait = wait.slice(0, wait.search(".css"))
                    }
                    return wait;
            };
            console.log("HERE 2!")
            waitTilReady([wait4], init);
        });
    }
}


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

function updateInfoBox(detailsAndDate){
    //console.log("updating")
    document.getElementById("infoBox").querySelector('p').textContent = detailsAndDate.join();
}