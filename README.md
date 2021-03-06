# lol-chime [![Build Status](https://travis-ci.org/max-su/lol-chime.svg?branch=master)](https://travis-ci.org/max-su/lol-chime) [![npm version](https://badge.fury.io/js/lol-chime.svg)](https://badge.fury.io/js/lol-chime) [![dependencies Status](https://david-dm.org/max-su/lol-chime/status.svg)](https://david-dm.org/max-su/lol-chime) ![WTFPL Badge](http://www.wtfpl.net/wp-content/uploads/2012/12/wtfpl-badge-1.png) [![Awesome](https://cdn.rawgit.com/sindresorhus/awesome/d7305f38d29fed78fa85652e3a63e154dd8e8829/media/badge.svg)](https://github.com/sindresorhus/awesome)

Summary
--------
A webapp serving the League of Legends community that runs notifies them when their friends are finished with their game. 

Use
--------
*   ```node server.js```
*   Go to ```http://localhost:5000/```

Dependencies
--------
*   Please install [Node.js & NPM](https://nodejs.org/en/download/package-manager/) if you haven't already!
*   Fill out the config.

Config
--------
*   Sign in on your league of legends account on [the Riot Games developer portal](https://developer.riotgames.com/sign-in) and grab an API key if you haven't already!
*   In this repository's root directory, do
```
vim .env.example
```
*   replace ```<%= FILL IN API KEY HERE %>``` with your api key.
*   replace ```<%= FILL IN REGION CODE HERE %>``` with your region code(see the following section).
*   replace ```<%= FILL IN REFRESH RATE %>``` with how often time interval(seconds) you want to refresh.
*   We recommend a refresh rate of 2 to 10 to keep in line with Riot's allotted limit.
*   10 requests every 10 seconds
*   500 requests every 10 minutes
*   Please keep in mind you do not need to put quotation marks around these strings or numbers!
*   ```cp .env.example .env```

Regions
-------
*   BR
*   EUNE
*   EUW
*   JP
*   KR
*   LAN
*   LAS
*   NA
*   OCE
*   TR
*   RU
*   If we don't have your region please blame rito & their chinese overlords. Sorry CN/SEA!

Licenses
-------
This application is under the [WTFPL License](./LICENSE.md).

Disclaimer
-------
Lol-Chime isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends. League of Legends and Riot Games are trademarks or registered trademarks of Riot Games, Inc. League of Legends © Riot Games, Inc.

Credits
-------
Credits for art assets go to http://serklaz.deviantart.com/ for the bard gif
