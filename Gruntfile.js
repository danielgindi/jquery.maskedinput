/*jshint node:true */
module.exports = function( grunt ) {

    grunt.loadNpmTasks( 'grunt-mkdir' );
    grunt.loadNpmTasks( 'grunt-remove' );
    grunt.loadNpmTasks( 'grunt-babel' );
    grunt.loadNpmTasks( 'grunt-browserify' );
    grunt.loadNpmTasks( 'grunt-terser' );
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
            },
            dist_concat: {
                fileList: ['dist/jquery.maskedinput.full.concat.js']
            },
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
            dist_full: {
                src: [
                    'src/jquery.maskedinput.core.js',
                    'src/jquery.maskedinput.date.js',
                ],
                dest: 'dist/jquery.maskedinput.full.concat.js',
            },
        },

        replace: {
            dist: {
                options: {
                    patterns: [
                        {
                            match: /import MaskedInput from '\.\/jquery.maskedinput.core';/,
                            replacement: ''
                        },
                        {
                            match: /export default MaskedInput;/, // only the first one
                            replacement: ''
                        },
                        {
                            match: /\/\*\* CORE_BEGIN \*\//,
                            replacement: 'const MaskedInput = (function() { ',
                        },
                        {
                            match: /\/\*\* CORE_END \*\//,
                            replacement: 'return MaskedInput; })();',
                        },
                    ],
                },
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['dist/jquery.maskedinput.full.concat.js'],
                        dest: 'dist/'
                    }
                ]
            },
            dist_default: {
                options: {
                    patterns: [
                        {
                            match: /define\(\["exports"(?:, )?([^\]]*)], factory\)/g,
                            replacement: 'define([$1], factory)',
                        },
                        {
                            match: /factory\(exports(?:, )?(.*)\);/g,
                            replacement: 'module.exports = factory($1);',
                        },
                        {
                            match: /factory\(mod.exports(?:, )?(.*)\)/g,
                            replacement: 'mod.exports = factory($1);',
                        },
                        {
                            match: /}\)\(this, function \(_exports(?:, )?(.*)\) {/g,
                            replacement: '})(this, function ($1) {',
                        },
                        {
                            match: /Object\.defineProperty\(_exports, "__esModule", {(?:[\r\n]|\s)*value: true(?:[\r\n]|\s)*}\);(?:[\r\n]|\s)*_exports\.default = void 0;/g,
                            replacement: '',
                        },
                        {
                            match: /_exports\.default = _default;/g,
                            replacement: 'return _default;',
                        },
                    ],
                },
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['dist/jquery.maskedinput.*.js'],
                        dest: 'dist/'
                    }
                ]
            }
        },

        babel: {
            dist: {
                options: {
                    sourceMap: false,
                    presets: [
                        [
                            '@babel/preset-env',
                            {
                                targets: "> 0.25%, not dead"
                            }
                        ],
                    ],
                    plugins: [
                        [
                            '@babel/plugin-transform-modules-umd',
                            {
                                globals: {
                                    "jquery": "jQuery",
                                    "jquery.maskedinput.core": "MaskedInput",
                                    "jquery.maskedinput.date": "MaskedInput",
                                    "jquery.maskedinput.full.concat": "MaskedInput",
                                },
                                exactGlobals: true,
                            }
                        ],
                    ],
                    compact: false
                },
                files: {
                    'dist/jquery.maskedinput.core.js': 'src/jquery.maskedinput.core.js',
                    'dist/jquery.maskedinput.date.js': 'src/jquery.maskedinput.date.js',
                    'dist/jquery.maskedinput.full.js': 'dist/jquery.maskedinput.full.concat.js',
                }
            }
        },

        terser: {
            options: {
                mangle: {
                    //except: ['jQuery']
                }
            },
            dist: {
                files: {
                    'dist/jquery.maskedinput.core.min.js': ['dist/jquery.maskedinput.core.js'],
                    'dist/jquery.maskedinput.date.min.js': ['dist/jquery.maskedinput.date.js'],
                    'dist/jquery.maskedinput.full.min.js': ['dist/jquery.maskedinput.full.js'],
                }
            }
        },

        header: {
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
        'concat:dist_full', 'replace:dist',
        'babel:dist', 'remove:dist_concat',
        'replace:dist_default',
        'terser:dist',
        'header:dist'
    ] );
    grunt.registerTask( 'default', [ 'build' ] );

};
