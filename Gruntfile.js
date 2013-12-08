module.exports = function (grunt) { 

	grunt.registerTask('default', ['watch']);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		watch: {
			options: {
				livereload: true
			},
			css: {
				files: 'public/styles/scss/*.scss',
				tasks: ['sass', 'autoprefixer']
			},
			js: {
				files: 'public/js/**/*.js'
			}
		},
		sass: {                              // Task
			dist: {                            // Target
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
		}
	});

	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');

};