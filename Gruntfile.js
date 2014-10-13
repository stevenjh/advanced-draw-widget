module.exports = function (grunt) {

  // middleware for grunt.connect
  var middleware = function (connect, options, middlewares) {
    // inject a custom middleware into the array of default middlewares for proxy page
    var proxypage = require('proxypage');
    var proxyRe = /\/proxy\/proxy.ashx/i;
    var enableCORS = function (req, res, next) {
      res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
      res.setHeader('Access-Control-Allow-Credentials', true);
      res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
      res.setHeader('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
      return next();
    };
    var proxyMiddleware = function (req, res, next) {
      if (!proxyRe.test(req.url)) {
        return next();
      }
      proxypage.proxy(req, res);
    };
    middlewares.unshift(proxyMiddleware);
    middlewares.unshift(enableCORS);
    middlewares.unshift(connect.json()); //body parser, see https://github.com/senchalabs/connect/wiki/Connect-3.0
    middlewares.unshift(connect.urlencoded()); //body parser
    return middlewares;
  };

  // grunt task config
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      build: {
        src: ['src/**/*.js'],
        options: {
          jshintrc: '.jshintrc',
          reporter: require('jshint-stylish')
        }
      }
    },
    intern: {
       dev: {
           options: {
               runType: 'runner',
               config: 'tests/intern'
           }
       }
    },
    esri_slurp: {
       dev: {
           options: {
               version: '3.10',
               packageLocation: 'esri',
               beautify: true
           }
       }
    },
    watch: {
      files: ['src/**'],
      tasks: ['jshint']
    },
    connect: {
      server: {
        options: {
          port: 3000,
          base: './',
          hostname: '*',
          middleware: middleware
        }
      }
    },
    open: {
      server: {
        path: 'http://localhost:3000/index.html'
      }
    }
  });

  // load the tasks
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-open');

  // Loading using a local copy
  grunt.loadNpmTasks('intern');
  grunt.loadNpmTasks('grunt-esri-slurp');

  // download Esri JSAPI
  grunt.registerTask('slurp', ['esri_slurp']);

  // Register a test task
  grunt.registerTask('test', ['intern']);


    // define the tasks
  grunt.registerTask('default', 'Watches the project for changes, automatically builds them and runs a web server and opens default browser to preview.', ['jshint', 'connect:server', 'open:server', 'watch']);
  grunt.registerTask('hint', 'Run simple jshint.', ['jshint']);
};