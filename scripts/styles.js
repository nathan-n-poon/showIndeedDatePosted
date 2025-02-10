const size = 200;
const buttonSize = 50;

infoBoxCss = `
    background-color: #5acffb;
    height: ${size}px;
    width: ${size}px;
    position: fixed;
    bottom: 0;
    right: ${buttonSize/2}px;
    padding: 10px;
    border-radius: 10px;
    `;

minButtonCss = `
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
    `;

buttonIconCss = `
        color: white;
        font-size: 50px;
        position: relative;
        bottom: 10px;
    `;

refreshButtonCss = `
    width: ${buttonSize/2}px;
    height: ${buttonSize/2}px;
    position: fixed;
    bottom: ${size-buttonSize}px;
    right: ${buttonSize/4}px;
    background-color: #f5abb9;
    border-radius: 50%;
    transition: transform .7s ease-in-out;
    cursor: pointer;
    `;

refreshButtonHoverCss = `
    #refresh_button:hover {
        transform: rotate(360deg);
    }
    #min_button:hover {
        transform: rotate(360deg);
    }
    `;