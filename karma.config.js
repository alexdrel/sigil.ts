// Karma configuration

module.exports = function(config) {
    config.set({
        // ... normal karma configuration
        basePath: '',
        frameworks: ['jasmine'],

        files: [
            // all files ending in "_test"
            'tests/*_test.*',
            'tests/**/*_test.*'
            // each file acts as entry point for the webpack configuration
        ],

        preprocessors: {
            // add webpack as preprocessor
            'tests/*_test.*': ['webpack', 'sourcemap'],
            'tests/**/*_test.*': ['webpack', 'sourcemap']
        },

        port: 8055,
        logLevel: config.LOG_INFO,
        colors: true,
        autoWatch: true,

        browsers: ['Chrome'],
        reporters: ['progress'],
        captureTimeout: 60000,
        singleRun: false,

        mime: {
          'text/x-typescript': ['ts','tsx']
        },

        webpack: {
          cache: true,
          devtool: 'inline-source-map',

          resolve: {
            extensions: ['.ts' ]
          },

          module: {
            rules: [
              {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                }
              }
            ]
          }
        },

        webpackMiddleware: {
            noInfo: true
        },

        devServer: {
          noInfo: true
        }
    });
};
