# the Faux York Times

###Overview

This is an app that scrapes articles from selected sections of the New York Times, compiles relevant data using MongoDB. Users can save interesting articles, comment on these articles, and edit/delete these comments.  The app uses a node express server for the back end and incorporates the express, express-handlebars, mongoose, body-parser, cheerio, morgan, and axios npm's.  Currently the app only scrapes the Food section of the New York Times, but scraping for the Science and Soccer sections are in development-the plan is to allow the user to browse articles from each section individually or browse all articles in a unified collection. New sections/publications will continue to be added as time allows.  The app is currently hosted on Heroku.
