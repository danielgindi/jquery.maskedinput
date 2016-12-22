/*jshint node:true */
module.exports = function( grunt ) {

    grunt.loadNpmTasks( 'grunt-mkdir' );
    grunt.loadNpmTasks( 'grunt-remove' );
    grunt.loadNpmTasks( 'grunt-contrib-copy' );
    grunt.loadNpmTasks( 'grunt-babel' );
    grunt.loadNpmTasks( 'grunt-contrib-uglify' );
    grunt.loadNpmTasks( 'grunt-header' );
    grunt.loadNpmTasks( 'grunt-replace' );
    grunt.loadNpmTasks( 'grunt-contrib-concat' );

    const banner = [
        '/*!',
        ' * <%= pkg.name %> <%= pkg.version %>',
        ' * <%= pkg.repository.url %>',
        ' */\n'
    ].join('\n');

    grunt.initConfig({
        pkg: grunt.file.readJSON( 'package.json' ), // Read package.json

        remove: {
            dist: {
                dirList: ['dist']
            }
        },

        mkdir: {
            dist: {
                options: {
                    create: [
                        'dist'
                    ]
                }
            }
        },

        concat: {
            dist: {
                src: [
                    'src/jquery.maskedinput.core.js'
                    , 'src/jquery.maskedinput.date.js'
                ]
                , dest: 'dist/jquery.maskedinput.full.js'
            }
        },

        babel: {
            dist: {
                options: {
                    sourceMap: false
                    , plugins: [
                        'transform-property-literals'
                        , 'transform-remove-debugger'
                        , 'transform-merge-sibling-variables'
                        , 'transform-es2015-constants'
                        , 'transform-es2015-block-scoping'
                    ]
                    , compact: false
                }
                , files: {
                    'dist/jquery.maskedinput.core.js': 'src/jquery.maskedinput.core.js'
                    , 'dist/jquery.maskedinput.date.js': 'src/jquery.maskedinput.date.js'
                    , 'dist/jquery.maskedinput.full.js': 'dist/jquery.maskedinput.full.js'
                }
            }
        }

        , uglify: {
            options: {
                mangle: {
                    except: ['jQuery']
                }
            },
            dist: {
                files: {
                    'dist/jquery.maskedinput.core.min.js': ['dist/jquery.maskedinput.core.js'],
                    'dist/jquery.maskedinput.date.min.js': ['dist/jquery.maskedinput.date.js'],
                    'dist/jquery.maskedinput.full.min.js': ['dist/jquery.maskedinput.full.js']
                }
            }
        }

        , header: {
            dist: {
                options: {
                    text: banner
                },
                files: {
                    'dist/jquery.maskedinput.core.js': 'dist/jquery.maskedinput.core.js'
                    , 'dist/jquery.maskedinput.date.js': 'dist/jquery.maskedinput.date.js'
                    , 'dist/jquery.maskedinput.full.js': 'dist/jquery.maskedinput.full.js'
                    , 'dist/jquery.maskedinput.core.min.js': 'dist/jquery.maskedinput.core.min.js'
                    , 'dist/jquery.maskedinput.date.min.js': 'dist/jquery.maskedinput.date.min.js'
                    , 'dist/jquery.maskedinput.full.min.js': 'dist/jquery.maskedinput.full.min.js'
                }
            }
        }
    });

    grunt.registerTask( 'build', [
        'remove:dist', 'mkdir:dist',
        'concat:dist',
        'babel:dist', 'uglify:dist',
        'header:dist'
    ] );
    grunt.registerTask( 'default', [ 'build' ] );

};
