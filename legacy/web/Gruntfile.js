module.exports = function (grunt) {
  'use strict';

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);
  grunt.loadNpmTasks('grunt-bower-task');
  
  // Automatically load required Grunt tasks
  require('jit-grunt')(grunt, {
    useminPrepare: 'grunt-usemin'
  });
  
  // Configurable paths for the application
  var appConfig = {
    app: require('./bower.json').appPath || 'app',
    dist: 'dist'
  };

  grunt.initConfig({

  	yeoman: appConfig,
    // TASKS
    /*  -- CONNECT SERVER  -- */
    connect: {
      options: {
        port: 9000,
        // hostname: 'localhost',
        hostname: '0.0.0.0',
        // hostname: '192.168.2.165',
        livereload: 35729,
	      /* protocol: 'https' */
      },
      livereload: {
        options: {
          open: true,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect().use(
                  '/bower_components',
                  connect.static('./bower_components')
              ),
              connect().use(
                '/app/styles',
                connect.static('./app/styles')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      }
    },
    //
    bower: {
      // Opciones de la tarea 'bower'
      options: {
        // Directorio donde se instalarán los paquetes de Bower
        targetDir: './bower_components'
      },
      // La tarea 'install' instalará los paquetes especificados en bower.json
      install: {}
    },
    /*  --  GENERAL  --  */
    watch: {
      bower: {
        files: [ 'bower.json' ],
        tasks: [ 'wiredep' ]
      },
      css: {
        files: ['<%= yeoman.app %>/assets/scss/*.scss'],
        tasks: [ 'compass:server', 'autoprefixer' ]
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/assets/css/desktop-prueba.css',
          '<%= yeoman.app %>/**/*.html',
          '<%= yeoman.app %>/**/*.js'
        ]
      }
    },

  	copy: {
      main: {
        files: [
          {
            expand: true,
            cwd: '<%= yeoman.bower_components %>',
            src: ['bower_components/angular-sanitize/angular-sanitize.min.js'],
            dest: '<%= yeoman.dist %>',
            filter: 'isFile'
          },
          {
            expand: true,
            cwd: '.',
            src: ['vendor.css'],
            dest: './dist/styles',
            flatten: true,
            filter: 'isFile'
          },
          {
            expand: true,
            cwd: '.',
            src: ['vendor.js'],
            dest: './dist/scripts',
            flatten: true,
            filter: 'isFile'
          },
          {
            cwd: '<%= yeoman.app %>',
            src: [
              '**',
              '!**/*.js',
              '!assets/css/**',
              'assets/css/bootstrap.min.css',
              'assets/css/font-awesome.min.css',
              '!assets/scss/**',
              //'!**/*.html',
              '!images/**',
              '!styles/**',
              '!fonts/**',
              '!_data/**'
               ],
            dest: '<%= yeoman.dist %>',
            expand: true
          },
        ],
      }
    },

    clean: {
      build: {
        src: [ '<%= yeoman.dist %>' ]
      },
      server: './tmp'
    },

    jshint: {
      options: {
        jshintrc: true,
        reporter: require('jshint-stylish')
      },
      build: ['Gruntfile.js', '<%= yeoman.app %>/**/*.js']
    },

    concurrent: {
      build: [
        'stylesheets',
        'scripts',
        'html',
      ]
    },

    filerev: {
      build: {
        src: [
          '<%= yeoman.dist %>/**/*.js',
          '<%= yeoman.dist %>/**/*.css',
        //   '<%= yeoman.dist %>/**/*.{png,jpg,jpeg,gif,webp,svg}',
        //   '<%= yeoman.dist %>/assets/fonts/*'
        '<%= yeoman.dist %>/**/*.html',
        '!<%= yeoman.dist %>/**/index.html',
        '!<%= yeoman.dist %>/**/404NotFound.html'


        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: [ '<%= yeoman.dist %>/index.html' ],
      options: {
        dest: '<%= yeoman.dist %>',
        flow: {
          html: {
            steps: {
              js: [ 'concat', 'uglifyjs' ],
              css: [ 'cssmin' ]
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: [ '<%= yeoman.dist %>/**/*.html', '<%= yeoman.dist %>/*.html' ],
      css: [ '<%= yeoman.dist %>/**/*.css', '<%= yeoman.dist %>/*.css' ],
      js: [ '<%= yeoman.dist %>/**/*.js', '<%= yeoman.dist %>/*.js' ],
      options: {
        dirs: ['<%= yeoman.dist %>'],
        assetsDirs: ['<%= yeoman.dist %>'],
        patterns: {
            js: [
                // [/(\w*\.template\.html)/gm, 'Update the JS to reference our revved htmls']
                [/([A-Za-z0-9_\/]+\.template\.html)/gm, 'Update the JS to reference our revved htmls']
            ]
        }
      }
    },

    wiredep: {
      app: {
        src: [ '<%= yeoman.dist %>/index.html' ],
        fileTypes: {
          js: {
            bloc: /(([\s\t]*)\/{2}\s*?bower:\s*?(\S*))(\n|\r|.)*?(\/{2}\s*endbower)/gi,
            detect: {
              js: /'(.*\.js)'/gi
            },
            replace: {
              js: '\'{{filePath}}\','
            }
          }
        }
      }
    },

    /*  --  STYLES  --  */
    compass: {
      build: {
        options: {
          sassDir: '<%= yeoman.app %>/assets/scss',
          cssDir: '<%= yeoman.dist %>/assets/css',
          raw: 'Sass::Script::Number.precision = 10\n'
        }
      },
      server: {
        options: {
          sassDir: '<%= yeoman.app %>/assets/scss',
          cssDir: '<%= yeoman.app %>/assets/css',
          sourcemap: true,
          raw: 'Sass::Script::Number.precision = 10\n'
        }
      }
    },

    autoprefixer : {
      options: {
        browsers: ['last 1 version']
      },
      build: {
        expand: true,
        cwd: '<%= yeoman.dist %>',
        src: [ '**/*.css' ],
        dest: '<%= yeoman.dist %>'
      }
    },

    cssmin: {
      build: {
        files: {
          // CHANGE THIS TO REAL PATHS AND STUFF
          //'<%= yeoman.dist %>/styles/screen.css' : [ 'dist/styles/screen.css']
          '<%= yeoman.dist %>/styles/main.css' : [ '<%= yeoman.dist %>/assets/css/**/*.css', '<%= yeoman.dist %>/assets/css/*.css' ]
        }
      }
    },

    /*  --  JAVASCRIPT  --  */
    concat: {
      build: {
        src: [
          '<%= yeoman.app %>/**/*.module.js',
          '<%= yeoman.app %>/**/*.controller.js',
          '<%= yeoman.app %>/**/*.directive.js',
          '<%= yeoman.app %>/**/*.js'
        ],
        dest: '<%= yeoman.dist %>/scripts/scripts.js'
      }
    },

    ngAnnotate: {
      options: {
        singleQuotes: true
      },
      build: {
        files: {
          '<%= yeoman.dist %>/scripts/scripts.js' : [ '<%= yeoman.dist %>/scripts/scripts.js']
        }
      }
    },

    babel: {
      options: {
        sourceMap: true,
        presets: [ 'es2015' ]
      },
      build: {
        files: {
          '<%= yeoman.dist %>/scripts/scripts.js' : [ '<%= yeoman.dist %>/scripts/scripts.js']
        }
      }
    },

    uglify: {
      build: {
        files: {
          '<%= yeoman.dist %>/scripts/scripts.js' : [ '<%= yeoman.dist %>/scripts/scripts.js']
        }
      }
    },

    /*  --  HTML  --  */
    htmlmin: {
      build: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: [ 'app/**/*.html', '*.html' ],
          dest: '<%= yeoman.dist %>'
        }]
      }
    }

  });

  grunt.registerTask('stylesheets', [
    'compass:build',
    'autoprefixer',
    'cssmin'
  ]);

  grunt.registerTask('scripts', [
    'concat',
    'ngAnnotate',
    'babel',
    'uglify'
  ]);

  grunt.registerTask('html', [
    //'htmlmin'
  ]);

  grunt.registerTask('build', [
    'clean:build',
    'copy',
    'wiredep',
    'useminPrepare',
    'concurrent',
    'filerev',
    'usemin'
  ]);

  grunt.registerTask('serve', [
    'clean:server',
    'compass:server',
    //'stylesheets',
    'connect:livereload',
    'watch'
  ]);
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.registerTask('default', ['bower:install']);
};
