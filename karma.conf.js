// Karma configuration
// Generated on Wed Apr 15 2015 00:38:46 GMT-0700 (PDT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      './public/bower_components/angular/angular.js',
      './public/bower_components/angular-mocks/angular-mocks.js',
      './public/bower_components/angular-animate/angular-animate.js',
      './public/bower_components/angular-moment/angular-moment.js',
      './public/bower_components/angular-resource/angular-resource.js',
      './public/bower_components/angular-route/angular-route.js',
      './public/bower_components/angular-sanitize/angular-sanitize.js',
      './public/bower_components/favico.js/favico.js',
      './public/bower_components/jquery/dist/jquery.js',
      './public/bower_components/moment/moment.js',
      './public/js/main.js',
      './public/js/**/*.js',
      './public/test/**/*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [
      'PhantomJS'
      //'Chrome'
      //'Firefox'
      ],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
