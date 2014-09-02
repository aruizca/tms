Social Media Monitoring Service (SMMS)
===============================

**Note!**: Project name subject to debate :-)

This project aims to provide the service layer that will deliver a stream of custom filtered data feeds from different social media platforms.

At this stage the following social media providers are supported:
* [Twitter](https://dev.twitter.com/ "Twitter developer documentation")
* Instagram (not yet)

# Architecture
This application is build on top of the [Node.js](http://nodejs.org/ "Node.js website") platform. This platform was chosen for the following reasons:
- Event-driven and non-blocking I/O model fits with the use case we are trying to implement.
- Node.js has a large ecosystem of modules. Among them, clients for the most used social media platforms.
- Good support for websockets through the [Socket.io](http://socket.io/) library
- A good oportunity to learn Node.js and get familiarized with the ["Reactive Programming"](http://www.reactivemanifesto.org/ "The Reactive Manifesto") paradigm.

## Technology Stack
Next are the main components of the application:
- Platform: **Node.js**
- Programming language: **Javascript**
- Build tool: **[Gulp](http://gulpjs.com/ "gulp.js  website")**
- Web Static Dependencies Manager: **[Bower](http://bower.io/ "bower website")**
- Web Framework: **[express](http://expressjs.com/ "express website")**
- Template engine: **[jade](http://jade-lang.com/ "jade website")**
- Real-time engine: **[socket.io](http://socket.io/ "socket.io website")**
- Testing framework: TODO
- Other node modules:
	- Twitter client: **[twit](https://www.npmjs.org/package/twit "twit on npm")**
	- ...   

## Architecture Diagram
TODO

# Installation
1. Clone this repo
2. Install node.js 
3. In your command-line, navigate to the smms project root folder and execute following command to download all node.js module dependencies:

```
npm install
```

**Important!! **If you are using Windows 7/8 make sure you install these first:
- [Python 2.7.x](https://www.python.org/downloads/ "Python downloads")
- Microsoft Visual Studio C++ 2012 (Express version [here](http://go.microsoft.com/?linkid=9816758 "Download Microsoft Visual Studio C++ 2012 Express"))
 
## Run it
Just execute the following command:

```
node ./bin/www
```

You should now be able to browse the URL: `http://localhost:8080`

# Client implementation
TODO
 

## Server listened events
TODO

## Server fired events
TODO






 

