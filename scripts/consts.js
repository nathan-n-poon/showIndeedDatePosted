// "formattedLocation":"City, Province","
let entryDelimiter = `","`;

const Subdirectory = Object.freeze({
    ROOT:   Symbol('root'),
    JOBS:  Symbol('job'),
    VIEWJOB: Symbol('viewjob'),
    INCOMPATIBLE: Symbol('incompatible')
});

// order is arbitrary
const companyAltParams = ['.jobsearch-JobInfoHeader-companyNameSimple', '.jobsearch-JobInfoHeader-companyNameLink', '[data-testid="inlineHeader-companyName"]']
const titleAltParams = ['[data-testid="simpler-jobTitle"]', '[data-testid="jobsearch-JobInfoHeader-title"]']
const locationAltParams = [`[data-testid=jobsearch-JobInfoHeader-companyLocation]`, '[data-testid="job-location"]', '[data-testid="inlineHeader-companyLocation"]']

const rootAndJobsMetaDataTag = '[id=mosaic-data]'