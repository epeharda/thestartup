The Startup
===========

Rachel and Bing had a great idea to combine startup names by chaining prefix 
and suffix compounds. Hargobind [khalsah] and I [nicovalencia] hacked up a
graph compilation that you can write code against to generate "name chains".

**Example:**

_github / hubspot / spotinfluence_


**Why did we make this?** No idea; it was fun!

This project consists of a few things:

1. A barebones server that displays generated chains at [thestartup.quickleft.com](http://thestartup.quickleft.com)
2. A controller portion that accepts and validates newly generated chains
3. A client worker that generates new chains

_We encourage you to use the client worker to build your own chains, or even
write your own generator/algorithm to make chains more efficiently. Either way,
we will post all the record breaking chains to date on the site above!_

Setup
=====

**For contributors:**

Set ENV vars for `CONTRIBUTOR_NAME` [default $USERNAME or __Anonymous__] and `ENDPOINT`
[default __http://thestartup.quickleft.com/chains__].

* Make sure you have [Node.js](http://nodejs.org) and [npm](https://npmjs.org) installed
* `npm install` to install node modules
* `npm install -g grunt-cli` to install grunt tools
* `grunt worker` to spawn a worker

**For maintainers / deployment:**

Set ENV var for `DATABASE_URL`.

* `grunt graph:publish` to publish an updated graph
* `grunt setupDatabase` to build and seed database

Contributing
============

This was a weekend hack project, so [when] you see something broken or lame,
feel free to contribute by forking and submitting a pull request!
