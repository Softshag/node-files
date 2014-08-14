


module.exports = function (grunt) {

   require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        clean: {
          build: ['docs'],
          test: ['file_test','data_store.json', '*.tgz']
        },
        jsdoc: {
            doc: {
                src: ['lib/**/*.js'],
                dest: 'docs',
                options: {
                    template: './node_modules/ink-docstrap/template',
                    configure: './conf.json'

                }
            }
        },
        mochaTest: {
            test: {
                src: ['test/**/*.js', 'README.md'],
                options: {
                    require: 'should',
                    reporter: 'dot'
                }
            }
        },
        jshint: {
            options: {
                reporter: require('jshint-stylish')
            },
            all: ['lib/**/*.js']
        }
    });

    grunt.registerTask('default', ['clean','jshint','mochaTest','jsdoc'])
    grunt.registerTask('test', ['mochaTest'])

};