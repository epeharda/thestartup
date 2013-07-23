The Startup
===========

Rachel and Bing had a great idea to combine startup names by chaining prefix 
and suffix compounds. Hargobind and Nico developed an urge to write some code.

**Why are we doing this?** I don't really know.

This repository consists of a controller that accepts new chains, and
displays the results of the longest chain to date. Worker scripts allow
contributers to compute new chains, or even write better/different
methods of generating chains.


TODO
====

* Show longest chain contributor
* Sanitize and validate POST /chains
* Remove basic auth to allow contributors
* Detail POST /chains responses
* Clean up worker and endpoints
* Allow for contributor algorithms
* Convert worker to distributed web worker, and allow web collaboration
