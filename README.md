# videoEmbeds

This is a small CLI utility that, given URL(s), will download those page(s) and find all the videos on them, printing the URL of each video to standard out.

Note that this only works with a small selection of white-listed video sites. If the site is not white-listed, or no videos are found on the page, the program will output the same URL you gave it.

## Setup

Simply `cd` to the videoEmbeds directory, and install node and all dependencies:

```
brew install node
npm install
```

## Usage

```
Usage: videoEmbeds.js URL [URL...]

  Options:

    -h, --help        Print this help and exit
```

Simply pass as many videos as you want as arguments, and it will log out the video URLs. For instance:

```
node videoEmbeds.js http://url1.com/page.html http://url2.com/page2.html
```

Output could look like:

```
http://youtube.com/video1 http://youtube.com/video2 http://url2.com/page2.html
```

Note that in this example, the `url2.com` page did not have any videos, so it was printed out just as it was input.
