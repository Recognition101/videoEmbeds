#!/usr/bin/env node

var request = require('request');
var cheerio = require('cheerio');

if (process.argv[2] === '-h' || process.argv[2] === '--help' ||
      process.argv.length < 3) {
    console.log('\n  Usage: videoEmbeds.js URL [URL...]');
    console.log('\n  Options:\n');
    console.log('    -h, --help        Print this help and exit');
    return;
}

var whitelistSites = new Set([
    'cdn.ampproject.org',
    'theverge.com'
]);

var whitelistVideos = new Set([
    'youtube.com',
    'youtu.be',
    'yahoo.com',
    "vimeo.com"
]);

var vidList = [];
var requests = [];

var getDomain = function getDomain(url) {
    return url.replace(/https?:\/\/w?w?w?\.?([^\/]*)(\/.*)?/, '$1');
};

var requestPromise = function requestPromise(url) {
    return new Promise(function(yes, no) {
        request(url, function(e, r, b) {return e ? no(e) : yes(b);});
    });
};

process.argv.splice(2).forEach(function(curUrl) {
    if (whitelistSites.has(getDomain(curUrl))) {
        requests.push(requestPromise(curUrl)
        .then(function processResponse(body) {
            var $ = cheerio.load(body);
            var initVidCount = vidList.length;

            $('amp-youtube').each(function(i, el) {
                vidList.push('https://youtu.be/' + $(el).attr('data-videoid'));
            });

            $('amp-video').each(function(i, el) {
                vidList.push($(el).attr('src'));
            });

            $('iframe').each(function(i, el) {
                var iframeUrl = $(el).attr('src');
                if (iframeUrl && whitelistVideos.has(getDomain(iframeUrl))) {
                    vidList.push(iframeUrl);
                }
            });

            if (vidList.length === initVidCount) {
                vidList.push(curUrl);
            }

        }).catch(function() {
            vidList.push(curUrl);
        }));
    } else {
        vidList.push(curUrl);
    }
});

Promise.all(requests).then(function() {
    console.log(vidList.join(' '));
});
