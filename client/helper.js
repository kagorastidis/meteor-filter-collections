var DateFormats = {
    mongo: 'YYYY-MM-DDTHH:mm:ssZ',
    short: 'DD MMMM - YYYY',
    long: 'DD/MM/YYYY hh:mm:ss a',
    date: 'DD/MM/YYYY',
    time: 'hh:mm a',
    timeTZ: 'hh:mm a Z',
    longTime: 'HH:mm:ss',
    longTimeTZ: 'HH:mm:ss Z',
    day: 'DD',
    monthShort: 'MMM'
};

UI.registerHelper('formatDate', function (datetime, format) {
    if (datetime) {
        format = DateFormats[format] || format;
        return moment(new Date(datetime)).format(format);
    }
});

