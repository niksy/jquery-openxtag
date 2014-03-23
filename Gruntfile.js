module.exports = function (grunt) {

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),
		meta: {
			banner: '\n\njQuery OpenX ad tags plugin\n\n' +
					'Tested with OpenX Community Edition 2.8.8-rc6\n\n' +
					'@version <%= pkg.version %>\n' +
					'@date <%= grunt.template.today("dd.mm.yyyy") %>\n' +
					'@author <%= pkg.author %>\n' +
					'@contributors <%= pkg.contributors[0] %>\n' +
					'@license <%= pkg.license %>\n\n',

			defaultBanner: '/* <%= meta.banner %> */\n',
			unstrippedBanner: '/*! <%= pkg.name %> - <%= pkg.version %> */\n'
		},

		concat: {
			options: {
				stripBanners: true,
				banner: '<%= meta.defaultBanner %>'
			},
			dist: {
				src: ['<%= pkg.main %>'],
				dest: '<%= pkg.main %>'
			}
		},

		copy: {
			dist: {
				files: [
					{
						expand: true,
						cwd: 'src',
						src: '**/*.js',
						dest: 'dist',
						filter: 'isFile'
					}
				]
			}
		},

		uglify: {
			options: {
				banner: '<%= meta.unstrippedBanner %>'
			},
			dist: {
				files: [
					{
						expand: true,
						cwd: 'src/',
						src: '**/*.js',
						dest: 'dist/',
						rename: function (dest, src) {
							var folder   = src.substring(0, src.lastIndexOf('/'));
							var filename = src.substring(src.lastIndexOf('/'), src.length);
							filename = filename.substring(0, filename.lastIndexOf('.'));
							return dest + folder + filename + '.min.js';
						}
					}
				]
			}
		},

		jshint: {
			dist: {
				options: {
					jshintrc: true
				},
				files: {
					src: ['src/**/*.js']
				}
			}
		},

		bump: {
			options: {
				files: ['package.json', 'bower.json'],
				updateConfigs: ['pkg'],
				commit: true,
				commitMessage: 'Release %VERSION%',
				commitFiles: ['-a'], // '-a' for all files
				createTag: true,
				tagName: '%VERSION%',
				tagMessage: 'Version %VERSION%',
				push: false,
				pushTo: 'upstream',
				gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d' // options to use with '$ git describe'
			}
		}

	});

	grunt.loadNpmTasks( 'grunt-contrib-concat' );
	grunt.loadNpmTasks( 'grunt-contrib-copy' );
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-bump' );

	grunt.registerTask( 'default', ['jshint:dist', 'concat:dist', 'copy:dist', 'uglify:dist'] );
	grunt.registerTask( 'releaseMajor', ['bump-only:major', 'default', 'bump-commit'] );
	grunt.registerTask( 'releaseMinor', ['bump-only:minor', 'default', 'bump-commit'] );
	grunt.registerTask( 'releasePatch', ['bump-only:patch', 'default', 'bump-commit'] );

};
