// Karma configuration

module.exports = function(config) {
    config.set({
        // ... normal karma configuration
        basePath: '',
        frameworks: ['jasmine', "karma-typescript"],

        files: [
            'src/*.ts',
            // all files ending in "_test"
            'tests/*_test.*',
        ],

        preprocessors: {
          "**/*.ts": ['karma-typescript', 'sourcemap'],
        },

        reporters: ['progress', "karma-typescript"],
        port: 8055,
        logLevel: config.LOG_INFO,
        colors: true,
        autoWatch: true,

        browsers: ['Chrome'],
        captureTimeout: 60000,
        singleRun: false,

        mime: {
          'text/x-typescript': ['ts','tsx']
        },
        karmaTypescriptConfig: {
          bundlerOptions: {
              addNodeGlobals: false,
          }
        }
    });
};
