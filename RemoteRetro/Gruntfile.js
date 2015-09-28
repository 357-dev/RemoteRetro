/// <binding ProjectOpened='watch' />
module.exports = function (grunt) {
    grunt.initConfig({
        less: {
            production: {
                options: {
                    compress: true,
                    yuicompress: true,
                    optimization: 2,
                    cleancss: true
                },
                files: {
                    "Content/base.css": "app/less/base.less"
                }
            }
        },
        jshint: {
            all: {
                src: 'app/js/**/**.js',
                options: {
                    "camelcase": false, // true: Identifiers must be in camelCase 
                    "curly": true, // true: Require {} for every new block or scope
                    "eqeqeq": true, // true: Require triple equals (===) for comparison 
                    "forin": true, // true: Require filtering for..in loops with obj.hasOwnProperty() 
                    "freeze": true, // true: prohibits overwriting prototypes of native objects such as Array, Date etc. 
                    "immed": true, // true: Require immediate invocations to be wrapped in parens e.g. `(function () { } ());` 
                    "indent": 4, // {int} Number of spaces to use for indentation 
                    "latedef": false, // true: Require variables/functions to be defined before being used 
                    "newcap": false, // true: Require capitalization of all constructor functions e.g. `new F()` 
                    "noarg": true, // true: Prohibit use of `arguments.caller` and `arguments.callee` 
                    "noempty": true, // true: Prohibit use of empty blocks 
                    "nonbsp": true, // true: Prohibit "non-breaking whitespace" characters. 
                    "nonew": false, // true: Prohibit use of constructors for side-effects (without assignment) 
                    "plusplus": true, // true: Prohibit use of `++` & `--` 
                    "quotmark": 'single', // Quotation mark consistency: 
                    "undef": true, // true: Require all non-global variables to be declared (prevents global leaks) 
                    "strict": false, // true: Requires all functions run in ES5 Strict Mode
                    "validthis": true,
                    "globals": { 'console': true, 'angular': true }        // additional predefined global variables
                }
            }
        },
        uglify: {
            all: {
                files: {
                    'app/app.js': ['app/js/**/**.js']
                },
                options: {
                    beautify: true
                }
            }
        },
        autoprefixer: {
            no_dest: {
                src: 'Content/base.css' // globbing is also possible here
            },
        },
        watch: {
            styles: {
                files: ['app/**/**.less'],
                tasks: ['less', 'autoprefixer'],
                options: {
                    livereload: true
                }
            },
            //jshint: {
            //    files: 'assets/js/**.js',
            //    tasks: 'jshint'
            //},
            javascript: {
                files: 'app/js/**/**.js',
                tasks: ['jshint', 'uglify']
            },
            tasks: ['styles']
        },
    });

    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');


    grunt.registerTask('default', ['jshint', 'uglify']);
};