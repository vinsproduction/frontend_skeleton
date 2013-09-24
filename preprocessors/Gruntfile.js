module.exports = function(grunt) {
	grunt.initConfig({

		// Компиляция Stylus в CSS
		stylus: {
			compile: {
				options: {
					compress: true,
					paths: ['styl/']
				},
				files: {
					'../css/popups.css': 'styl/popups.styl',
					'../css/main.css': 'styl/main.styl'
				}
			}
		},

		// Компиляция Jade в HTML
		jade: {
			compile: {
				options: {
					pretty: true,
					data: {
						debug: false
					}
				},
				files: {
					"../index.html": "jade/index.jade"
				}
			}
		},

		// Компиляция coffee-скриптов в js
		coffee: {
			compileBare: {
				options: {
          		bare: true
          	},
				
          	files: {
        			//  '../js/app.models.js': 'coffee/app.models.coffee',
		    		// '../js/app.views.js': 'coffee/app.views.coffee',
		    		// '../js/app.router.js': 'coffee/app.router.coffee',
		    		
		    		'../js/app.js': 'coffee/app.coffee'
		    	}
			}

		},

		// Склеивание js-файлов
		concat: {
			
			js: {
				src: [
					'../js/app.js',
				],
				dest: '../js/project.js'
			},
			libs: {
				src: [
					'../js/libs/jquery-1.10.2.min.js',
					'../js/libs/jquery-ui-1.10.3.custom.js',
					'../js/libs/jquery.tinyscrollbar.min.js',
					'../js/libs/jquery.cookie.js',
					'../js/libs/mustache.js',
					'../js/libs/underscore-min.js',

					// '../js/libs/json2.js',
					// '../js/libs/backbone-min.js',

					'../js/libs/popups.js'
				],
				dest: '../js/libs/lib.js'
			},
			css: {
				src: [
					'../css/main.css',
					'../css/popups.css'
				],
				dest: '../css/project.css'
			},
		},

		// Минификация
		uglify: {
			js: {
				files: {
					'../js/project.min.js': ['<%= concat.js.dest %>'],
					'../js/libs/lib.min.js': ['<%= concat.libs.dest %>']
				}
			}
		},

		// Наблюдение за изменениями
		watch: {
			options: {
				livereload: 35829
			},

			// Перекомпиляция стилей при изменении styl-файлов
			stylus: {
				files: ['styl/*.styl'],
				tasks: 'stylus'
			},
			// Перекомпиляция html при изменении jade-файлов
			jade: {
				files: ['jade/*.jade'],
				tasks: 'jade'
			},
			// Перекомпиляция js при изменении coffee-файлов
			coffee: {
				files: [
					'coffee/*.coffee',
				],
				tasks: 'coffee'
			},

			// Пересобирание стилей при изменении исходных css-файлов
			css: {
				files: [
					'../css/*.css',
					'!../css/project.css'
				],
				tasks: ['concat:css']
			},
			// Пересобирание скриптов при изменении исходных js-файлов
			js: {
				files: [
					'../js/*.js',
					'../js/libs/*.js',
					'!../js/libs/project.js',
					'!../js/libs/project.min.js'
				],
				tasks: ['concat:js','concat:libs', 'uglify']
			}
			
		}
	});
	
	// Загрузка библиотек
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-coffee');

	// Объявление тасков
	grunt.registerTask('default', ['coffee', 'stylus', 'jade', 'concat', 'uglify', 'watch']);
};