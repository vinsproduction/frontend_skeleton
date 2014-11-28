module.exports = function(grunt) {

	grunt.config.init({


		// Компиляция Stylus в CSS
		stylus: {
			compile: {
				options: {
					compress: false,
				},
				files: {
					"css/app.css": "ppc/styl/app.styl",
					"css/video.css": "ppc/styl/video.styl",
					"css/map.css": "ppc/styl/map.styl",
					"css/gallery.css": "ppc/styl/gallery.styl",
					"css/carousel.css": "ppc/styl/carousel.styl",
					"css/jcarousel.css": "ppc/styl/jcarousel.styl",

					// PROD

					"../css/app.css": "../ppc/styl/app.styl",

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

					"index.html": "ppc/jade/index.jade",
					"layout/head.html": "ppc/jade/layout/head.jade",
					"layout/header.html": "ppc/jade/layout/header.jade",
					"layout/footer.html": "ppc/jade/layout/footer.jade",
					"layout/layout.html": "ppc/jade/layout/layout.jade",

					"fonts.html": "ppc/jade/fonts.jade",		
					"guideline.html": "ppc/jade/guideline.jade",	

					"popup.html": "ppc/jade/popup.jade",
					"render.html": "ppc/jade/render.jade",
					"video.html": "ppc/jade/video.jade",
					"map.html": "ppc/jade/map.jade",
					"gallery.html": "ppc/jade/gallery.jade",
					"carousel.html": "ppc/jade/carousel.jade",
					"jcarousel.html": "ppc/jade/jcarousel.jade",
					"form.html": "ppc/jade/form.jade",
					"fileuploader.html": "ppc/jade/fileuploader.jade",
					"helpers-images.html": "ppc/jade/helpers-images.jade",
					"CreativeButtons.html": "ppc/jade/CreativeButtons.jade",
					"CreativeLinkEffects.html": "ppc/jade/CreativeLinkEffects.jade",
					"IconHoverEffects.html": "ppc/jade/IconHoverEffects.jade",
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
	       		"js/app.models.js": "ppc/coffee/app.models.coffee",
		    		"js/app.views.js": "ppc/coffee/app.views.coffee",
	       		"js/app.router.js": "ppc/coffee/app.router.coffee",
	       		"js/app.js": "ppc/coffee/app.coffee",
	       		
	       		"js/map.js": "ppc/coffee/map.coffee",
	       		"js/gallery.js": "ppc/coffee/gallery.coffee",
	       		"js/video.js": "ppc/coffee/video.coffee",
	       		"js/jcarousel.js": "ppc/coffee/jcarousel.coffee",

		    		"js/libs/popup.js": "ppc/coffee/popup.coffee",
	       		"js/libs/form.js": "ppc/coffee/form.coffee",
	       		"js/libs/carousel.js": "ppc/coffee/carousel.coffee",
	
	     		}
	     	}
		},

		// Склеивание js-файлов
		// concat: {
			
		// 	js: {
		// 		src: [
		// 			"js/app.models.js",
		// 			"js/app.views.js",
		// 			"js/app.router.js",
		// 			"js/app.js",
		// 		],
		// 		dest: "js/project.js"
		// 	},
		// 	libs: {
		// 		src: [
		// 			"js/libs/jquery-1.10.2.min.js",
		// 			"js/libs/jquery-ui-1.10.3.custom.js",
		// 			"js/libs/jquery.cookie.js",
		// 			"js/libs/mustache.js",
		// 			"js/libs/underscore-min.js",
		// 			"js/libs/json2.js",
		// 			"js/libs/backbone.router.js",
		// 			"js/libs/popup.js",
		// 			"js/libs/form.js",
		// 			"js/libs/carousel.js",
		// 		],
		// 		dest: "js/libs/lib.js"
		// 	},
		// 	css: {
		// 		src: [
		// 			"css/app.css"
		// 		],
		// 		dest: "css/project.css"
		// 	},
		// },

		// Минификация
		// uglify: {
		// 	js: {
		// 		files: {
		// 			"js/project.min.js": ["<%= concat.js.dest %>"],
		// 			"js/libs/lib.min.js": ["<%= concat.libs.dest %>"]
		// 		}
		// 	}
		// },


		// Наблюдение за изменениями
		watch: {
			options: {
				livereload: 777
			},

			// Перекомпиляция стилей при изменении styl-файлов
			stylus: {

				files: [
					"ppc/styl/*.styl",
				],
				tasks: "stylus"
			},
			// Перекомпиляция html при изменении jade-файлов
			jade: {
				files: [
					"ppc/jade/*.jade",
					"ppc/jade/layout/*.jade",
				],
				tasks: "jade"
			},
			// Перекомпиляция js при изменении coffee-файлов
			coffee: {
				files: [
					"ppc/coffee/*.coffee",
					"ppc/coffee/libs/*.coffee",
				],
				tasks: "coffee"
			},

			// Пересобирание стилей при изменении исходных css-файлов
			// css: {
			// 	files: [
			// 		"css/*.css",
			// 		"!css/project.css"

			// 	],
			// 	tasks: ["concat:css"]
			// },
			// Пересобирание скриптов при изменении исходных js-файлов
			// js: {
			// 	files: [
			// 		"js/*.js",
			// 		"js/libs/*.js",
			// 		"!js/libs/project.js",
			// 		"!js/libs/project.min.js"
			// 	],
			// 	tasks: ["concat:js","concat:libs", "uglify"]
			// }
			
		},
	});

	// Загрузка библиотек
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	//grunt.loadNpmTasks("grunt-contrib-uglify");
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
	grunt.registerTask('server', ['_server','coffee', 'stylus', 'jade', 'watch']);


	// Объявление тасков
	grunt.registerTask("default", ["coffee", "stylus", "jade", "watch"]);


};