// "formattedLocation":"City, Province","
let entryDelimiter = `","`;

const Subdirectory = Object.freeze({
    ROOT:   Symbol("root"),
    JOBS:  Symbol("job"),
    VIEWJOB: Symbol("viewjob"),
    INCOMPATIBLE: Symbol("incompatible")
});

companyAltParams = ['.jobsearch-JobInfoHeader-companyNameSimple', '.jobsearch-JobInfoHeader-companyNameLink', '[data-testid="inlineHeader-companyName"]']
titleAltParams = ['[data-testid="simpler-jobTitle"]', '[data-testid="jobsearch-JobInfoHeader-title"]']
locationAltParams = [`[data-testid=jobsearch-JobInfoHeader-companyLocation]`, '[data-testid="job-location"]', '[data-testid="inlineHeader-companyLocation"]']
