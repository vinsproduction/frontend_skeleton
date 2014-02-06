module.exports = function(grunt) {

	grunt.initConfig({

		// Компиляция Stylus в CSS
		stylus: {
			tutorials: {
				options: {
					compress: false,
					paths: ['styl/']
				},
				files: {
					'../tutorials/css/app.css': 'tutorials/styl/app.styl'
				}
			},
			default: {
				options: {
					compress: false,
					paths: ['styl/']
				},
				files: {
					'../css/app.css': 'styl/app.styl',
				}
			}
		},

		// Компиляция Jade в HTML
		jade: {
			tutorials: {
				options: {
					pretty: true,
					data: {
						debug: false
					}
				},
				files: {
					"../tutorials/index.html": "tutorials/jade/index.jade",
					"../tutorials/popup.html": "tutorials/jade/popup.jade",
					"../tutorials/render.html": "tutorials/jade/render.jade",
					"../tutorials/helpers-images.html": "tutorials/jade/helpers-images.jade",
				}
			},
			default: {
				options: {
					pretty: true,
					data: {
						debug: false
					}
				},
				files: {
					"../index.html": "jade/index.jade",
					"../layout/head.html": "jade/layout/head.jade",
					"../layout/header.html": "jade/layout/header.jade",
					"../layout/layout.html": "jade/layout/layout.jade",
					"../layout/footer.html": "jade/layout/footer.jade",
				}
			},
		},

		// Компиляция coffee-скриптов в js
		coffee: {
			tutorials: {
				options: {
          		bare: true
          	},	
          	files: {
          		'../tutorials/js/app.models.js': 'tutorials/coffee/app.models.coffee',
		    		'../tutorials/js/app.views.js': 'tutorials/coffee/app.views.coffee',
          		'../tutorials/js/app.router.js': 'tutorials/coffee/app.router.coffee',
        		} 
			},
			default: {
				options: {
          		bare: true
          	},
				
          	files: {
        			'../js/libs/popup.js': 'coffee/libs/popup.coffee',

        			'../js/app.models.js': 'coffee/app.models.coffee',
		    		'../js/app.views.js': 'coffee/app.views.coffee',
		    		'../js/app.router.js': 'coffee/app.router.coffee',
		    		'../js/app.js': 'coffee/app.coffee'
		    	}
			}

		},

		// Склеивание js-файлов
		concat: {
			
			js: {
				src: [
					'../js/app.models.js',
					'../js/app.views.js',
					'../js/app.router.js',
					'../js/app.js',
				],
				dest: '../js/project.js'
			},
			libs: {
				src: [
					'../js/libs/jquery-1.10.2.min.js',
					'../js/libs/jquery-ui-1.10.3.custom.js',
					'../js/libs/jquery.tinyscrollbar.js',
					'../js/libs/jquery.jcarousel.js',
					'../js/libs/jquery.cookie.js',
					'../js/libs/mustache.js',
					'../js/libs/underscore-min.js',
					'../js/libs/json2.js',
					'../js/libs/backbone.router.js',
					'../js/libs/popup.js',
				],
				dest: '../js/libs/lib.js'
			},
			css: {
				src: [
					'../css/app.css'
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
				livereload: 777
			},

			// Перекомпиляция стилей при изменении styl-файлов
			stylus: {

				files: [
					'styl/*.styl',
					'tutorials/styl/*.styl',
				],
				tasks: 'stylus'
			},
			// Перекомпиляция html при изменении jade-файлов
			jade: {
				files: [
					'jade/*.jade',
					'jade/layout/*.jade',
					'tutorials/jade/*.jade',
					'tutorials/jade/layout/*.jade',
				],
				tasks: 'jade'
			},
			// Перекомпиляция js при изменении coffee-файлов
			coffee: {
				files: [
					'coffee/*.coffee',
					'coffee/libs/*.coffee',
					'tutorials/coffee/*.coffee'
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
			
		},
	});
	
	// Загрузка библиотек
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-coffee');

	// Сервер
	grunt.registerTask('_server', 'Start web server', function() {
		port = 8888
		grunt.log.writeln('SERVER started on port ' + port);
		require('./server.js')(port)
	});

	// Сервер + preprocessors
	grunt.registerTask('server', ['_server','coffee:default', 'stylus:default', 'jade:default', 'concat', 'uglify', 'watch']);

	// tutorials + cервер + preprocessors
	grunt.registerTask('tutorials', ['_server','coffee','stylus', 'jade', 'watch']);

	// Объявление тасков
	grunt.registerTask('default', ['coffee:default', 'stylus:default', 'jade:default', 'concat', 'uglify', 'watch']);

};