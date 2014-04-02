module.exports = function(grunt) {

	grunt.config.init({


		// Компиляция Stylus в CSS
		stylus: {
			compile: {
				options: {
					compress: false,
				},
				files: {
					"static/css/app.css": "ppc/styl/app.styl",
					"static/css/video.css": "ppc/styl/video.styl",
					"static/css/map.css": "ppc/styl/map.styl",
					"static/css/gallery.css": "ppc/styl/gallery.styl",
					"static/css/carousel.css": "ppc/styl/carousel.styl",

					// PROD

					"../static/css/app.css": "../ppc/styl/app.styl",

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

					"static/index.html": "ppc/jade/index.jade",
					"static/popup.html": "ppc/jade/popup.jade",
					"static/static/render.html": "ppc/jade/render.jade",
					"static/video.html": "ppc/jade/video.jade",
					"static/map.html": "ppc/jade/map.jade",
					"static/gallery.html": "ppc/jade/gallery.jade",
					"static/carousel.html": "ppc/jade/carousel.jade",
					"static/form.html": "ppc/jade/form.jade",
					"static/fileuploader.html": "ppc/jade/fileuploader.jade",
					"static/helpers-images.html": "ppc/jade/helpers-images.jade",
					"static/CreativeButtons.html": "ppc/jade/CreativeButtons.jade",
					"static/CreativeLinkEffects.html": "ppc/jade/CreativeLinkEffects.jade",
					"static/IconHoverEffects.html": "ppc/jade/IconHoverEffects.jade",

					// PROD

					"../static/index.html": "../ppc/jade/index.jade",
					"../static/layout/head.html": "../ppc/jade/layout/head.jade",
					"../static/layout/header.html": "../ppc/jade/layout/header.jade",
					"../static/layout/layout.html": "../ppc/jade/layout/layout.jade",
					"../static/layout/footer.html": "../ppc/jade/layout/footer.jade",

					"../static/fonts.html": "../ppc/jade/fonts.jade",		
					"../static/guideline.html": "../ppc/jade/guideline.jade",		
					
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
	       		"static/js/app.models.js": "ppc/coffee/app.models.coffee",
		    		"static/js/app.views.js": "ppc/coffee/app.views.coffee",
	       		"static/js/app.router.js": "ppc/coffee/app.router.coffee",
	       		
	       		"static/js/map.js": "ppc/coffee/map.coffee",
	       		"static/js/gallery.js": "ppc/coffee/gallery.coffee",
	       		"static/js/video.js": "ppc/coffee/video.coffee",

	       		// PROD

	     			"../static/js/app.models.js": "../ppc/coffee/app.models.coffee",
		    		"../static/js/app.views.js": "../ppc/coffee/app.views.coffee",
		    		"../static/js/app.router.js": "../ppc/coffee/app.router.coffee",
		    		"../static/js/app.js": "../ppc/coffee/app.coffee",

		    		"../static/js/libs/popup.js": "ppc/coffee/popup.coffee",
	       		"../static/js/libs/form.js": "ppc/coffee/form.coffee",
	       		"../static/js/libs/carousel.js": "ppc/coffee/carousel.coffee",
	
	     		}
	     	}
		},

		// Склеивание js-файлов
		concat: {
			
			js: {
				src: [
					"../static/js/app.models.js",
					"../static/js/app.views.js",
					"../static/js/app.router.js",
					"../static/js/app.js",
				],
				dest: "../static/js/project.js"
			},
			libs: {
				src: [
					"../static/js/libs/jquery-1.10.2.min.js",
					"../static/js/libs/jquery-ui-1.10.3.custom.js",
					"../static/js/libs/jquery.cookie.js",
					"../static/js/libs/mustache.js",
					"../static/js/libs/underscore-min.js",
					"../static/js/libs/json2.js",
					"../static/js/libs/backbone.router.js",
					"../static/js/libs/popup.js",
					"../static/js/libs/form.js",
					"../static/js/libs/carousel.js",
				],
				dest: "../static/js/libs/lib.js"
			},
			css: {
				src: [
					"../static/css/app.css"
				],
				dest: "../static/css/project.css"
			},
		},

		// Минификация
		uglify: {
			js: {
				files: {
					"../static/js/project.min.js": ["<%= concat.js.dest %>"],
					"../static/js/libs/lib.min.js": ["<%= concat.libs.dest %>"]
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
					"ppc/styl/*.styl",
					"../ppc/styl/*.styl",
				],
				tasks: "stylus"
			},
			// Перекомпиляция html при изменении jade-файлов
			jade: {
				files: [
					"ppc/jade/*.jade",
					"ppc/jade/layout/*.jade",
					"../ppc/jade/*.jade",
					"../ppc/jade/layout/*.jade",
				],
				tasks: "jade"
			},
			// Перекомпиляция js при изменении coffee-файлов
			coffee: {
				files: [
					"ppc/coffee/*.coffee",
					"../ppc/coffee/*.coffee",
					"../ppc/coffee/libs/*.coffee",
				],
				tasks: "coffee"
			},

			// Пересобирание стилей при изменении исходных css-файлов
			css: {
				files: [
					"../static/css/*.css",
					"!../static/css/project.css"

				],
				tasks: ["concat:css"]
			},
			// Пересобирание скриптов при изменении исходных js-файлов
			js: {
				files: [
					"../static/js/*.js",
					"../static/js/libs/*.js",
					"!../static/js/libs/project.js",
					"!../static/js/libs/project.min.js"
				],
				tasks: ["concat:js","concat:libs", "uglify"]
			}
			
		},
	});

	// Загрузка библиотек
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-stylus");
	grunt.loadNpmTasks("grunt-contrib-jade");
	grunt.loadNpmTasks("grunt-contrib-coffee");

	// Сервер
	grunt.registerTask("_server", "Start web server", function() {
		port = 8888;
		grunt.log.writeln("SERVER started on port " + port);
		require("./server/server.js")(port);
	});

	// Сервер + ppc
	grunt.registerTask('server', ['_server','coffee', 'stylus', 'jade', 'concat', 'uglify', 'watch']);


	// Объявление тасков
	grunt.registerTask("default", ["coffee", "stylus", "jade", "concat", "uglify", "watch"]);


};