/**
 * Livereload and connect variables
 * https://github.com/intesso/connect-livereload
 */
'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')();
var mountFolder = function(connect, dir) {
  return connect.static(require('path').resolve(dir));
};


module.exports = function(grunt) {

	/**
   * Dynamically load npm tasks
   */
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

    /**
     * Set project info
     */
    project: {
      src: 'src',
      app: 'app',
      assets: '<%= project.app %>/assets',
      css: [
        '<%= project.src %>/scss/style.scss'
      ],
      js: [
        '<%= project.src %>/js/*.js'
      ]
    },

    /**
     * Connects express erver
     * https://github.com/ericclemmons/grunt-express-server
     * Starts express server as referenced below and sets livereload
     */
    express: {
    	options: {
    		port: '1234'
    	},
	    dev: {
	      options: {
	        script: 'server.js'
	      }
	    },
	    prod: {
	      options: {
	        script: 'server.js',
	        node_env: 'production'
	      }
	    }
    },


    /**
     * Connect port/livereload
     * https://github.com/gruntjs/grunt-contrib-connect
     * Starts a local webserver and injects
     * livereload snippet
     * Only use when not already using an express server
     *
    connect: {
      options: {
        port: 1234,
        hostname: 'localhost'
      },
      livereload: {
        options: {
        	livereload: true,
        	base:'app'
        }
      }
    }, */

    /**
     * Concatenate JavaScript files
     * https://github.com/gruntjs/grunt-contrib-concat
     * Imports all .js files and appends project banner
     */
    concat: {
      dev: {
        files: {
          '<%= project.assets %>/js/scripts.min.js': '<%= project.js %>'
        }
      }
    },

    /**
     * Uglify (minify) JavaScript files
     * https://github.com/gruntjs/grunt-contrib-uglify
     * Compresses and minifies all JavaScript files into one
     */
    uglify: {
      dist: {
        files: {
          '<%= project.assets %>/js/scripts.min.js': '<%= project.js %>'
        }
      }
    },

	  /**
	   * Compile Sass/SCSS files
	   * https://github.com/gruntjs/grunt-contrib-sass
	   * Compiles all Sass/SCSS files
	   */
		sass: {          
      dev: {
        options: {
          style: 'expanded'
        },
        files: {
          '<%= project.assets %>/css/style.min.css': '<%= project.css %>'
        }
      },
      dist: {
        options: {
          style: 'expanded'
        },
        files: {
          '<%= project.assets %>/css/style.min.css': '<%= project.css %>'
        }
      }
    },

    /**
     * CSSMin
     * CSS minification
     * https://github.com/gruntjs/grunt-contrib-cssmin
     */
    cssmin: {
      dev: {
        files: {
          '<%= project.assets %>/css/style.min.css': '<%= project.assets %>/css/style.min.css'
        }
      },
      dist: {
        files: {
          '<%= project.assets %>/css/style.min.css': '<%= project.assets %>/css/style.min.css'
        }
      }
    },

    /**
     * Opens the web server in the browser
     * https://github.com/jsoverson/grunt-open
     */
    open: {
      server: {
        path: 'http://localhost:<%= express.options.port %>'
      }
    },

    /**
     * Runs tasks against changed watched files
     * https://github.com/gruntjs/grunt-contrib-watch
     * Watching development files and run concat/compile tasks
     * Livereload the browser once complete
     */
    watch: {
      concat: {
        files: '<%= project.src %>/js/{,*/}*.js',
        tasks: ['concat:dev']
      },
      sass: {
        files: '<%= project.src %>/scss/{,*/}*.{scss,sass}',
        tasks: ['sass:dev', 'cssmin:dev']
      },
      express: {
	      files:  [ '**/*.js' ],
	      tasks:  [ 'express:dev' ],
	      options: {
	        spawn: false 
	      }
	    },
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: [
          '<%= project.app %>/{,*/}*.html',
          '<%= project.assets %>/css/*.css',
          '<%= project.assets %>/js/{,*/}*.js',
          '<%= project.assets %>/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    }

	});

  /**
   * Default task
   * Run `grunt` on the command line
   */
  grunt.registerTask('default', [
    'sass:dev',
    'cssmin:dev',
    'concat:dev',
    //'connect:livereload',
    'express:dev',
    'open',
    'watch'
  ]);

  /**
   * Build task
   * Run `grunt build` on the command line
   * Then compress all JS/CSS files
   */
  grunt.registerTask('build', [
    'sass:dist',
    'cssmin:dist',
    'uglify'
  ]);

};