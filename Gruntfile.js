module.exports = function (grunt) { 

	grunt.registerTask('default', ['concurrent']);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		watch: {
			options: {
				livereload: true
			},
			html: {
				files: 'app/views/**/*'
			},
			css: {
				files: 'public/styles/scss/*.scss',
				tasks: ['sass', 'autoprefixer']
			},
			js: {
				files: 'public/js/**/*.js'
			}
		},
		nodemon: {
			dev: {
				options: {
					file: 'server.js',
					args: ['dev'],
					nodeArgs: ['--debug'],
					ignoredFiles: ['node_modules/**', 'bower_components/**', 'public/**', 'Gruntfile.js'],
					watchedExtensions: ['js'],
					env: {
						PORT: '3000'
					}
				}
			}
		},
		sass: {
			dist: {
				files: [{
					expand: true,
					cwd: 'public/styles/scss',
					src: ['*.scss'],
					dest: 'public/styles/css',
					ext: '.css'
				}]
			}
		},
		autoprefixer: {
			no_dest: {
				src: 'public/styles/css/common.css'
			}
		},
		concurrent: {
			dev: {
				tasks: ['nodemon', 'watch'],
				options: {
					logConcurrentOutput: true
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-concurrent');

};