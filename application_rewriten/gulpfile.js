/**
 * GULP file for Vector Video project
 * @author	Šimon Rozsíval
 * @contact	simon@roszival.com
 * @licence	MIT 
 */
 
var concat = require('gulp-concat');
var del = require("del");
var fs = require("fs");
var gulp = require("gulp");
var less = require("gulp-less");
var sourcemaps = require('gulp-sourcemaps');
var merge = require('merge-stream');
var minifyCSS = require('gulp-minify-css');
var path = require("path");
var rename = require('gulp-rename');
var tsc = require('gulp-tsc');
var uglify = require('gulp-uglify');
var ignore = require('gulp-ignore');

/**
 * Remove all files generated by gulp in all default tasks
 */

gulp.task("clean-release", function() {
	del([ 
		"./release/**/*", // everything in the release directory should be deleted
	]);	
});

gulp.task("clean-demo", function() {
	// the DEMO needs some cherry picking:		
	del([ 
		// themes
		"./demo/public/css/themes",
		// lib
		"./demo/public/js/libs/" + libProject.compilerOptions.out,
		"./demo/public/js/libs/" + libProject.compilerOptions.out + ".map",
		// compile-less		
		"./demo/public/js/workers/**/*",
		// audio-server
		"./demo/" + audioServerProject.compilerOptions.out,
		"./demo/" + audioServerProject.compilerOptions.out + ".map",
		// demo-server
		"./demo/" + serverProject.compilerOptions.out,
		"./demo/" + serverProject.compilerOptions.out + ".map",
	]);	
});

gulp.task("clean", ["clean-release", "clean-demo"]);

/**
 * Gulp task for transpiling .LESS files into .CSS
 * For every subdirectory in ./public/themes, all it's *.less files are merged into one,
 * they are transpiled into a css, this css is minified and then saved into ./public/themes/<foldername>.min.css,
 * where <foldername> is the name of the theme's subdirectory.
 * This task is based on https://github.com/gulpjs/gulp/blob/master/docs/recipes/running-task-steps-per-folder.md
 */

function getFolders(dir) {
    return fs.readdirSync(dir)
		      .filter(function(file) {
		        return fs.statSync(path.join(dir, file)).isDirectory();
		      });
}

var themesPath = "./src/Themes"; 
gulp.task("themes", function() {
   var folders = getFolders(themesPath);
   var tasks = folders.map(function(folder) {
	  return gulp.src(path.join(themesPath, folder, "theme.less"))
  				.pipe(less())
				.pipe(minifyCSS())
        		.pipe(rename(folder + '.min.css'))				
				.pipe(gulp.dest("./release/themes"));				
   });

   return merge(tasks);
});

gulp.task("themes-demo", function() {
   var folders = getFolders(themesPath);
   var tasks = folders.map(function(folder) {
	  return gulp.src(path.join(themesPath, folder, "theme.less"))
  				.pipe(sourcemaps.init())
				.pipe(less())
  				.pipe(sourcemaps.write())
        		.pipe(rename(folder + '.min.css'))
				.pipe(gulp.dest("./demo/public/css/themes"));
   });

   return merge(tasks);	
});

/**
 * Compile the VectorVideo JavaScript library
 * The source of VectorVideo is written in TypeScript and must be transpiled to pure Javascript.
 */


var libProject = require("./src/VectorVideo/tsconfig.json", { sourceMap: false }); // source maps are irrelevant for the release version
var recorderProject = require("./src/VectorVideo/Recorder/tsconfig.json", { sourceMap: false }); 
var playerProject = require("./src/VectorVideo/Player/tsconfig.json", { sourceMap: false });

//
// A) for release
//
 
gulp.task("player-release", function() {
	return gulp.src("./src/VectorVideo/Player/Player.ts")
			.pipe(tsc(playerProject.compilerOptions))
			.pipe(ignore.exclude([ "**/*.map" ])) // do not uglify .map files
			.pipe(uglify())
			.pipe(gulp.dest("./release/vector-video-lib"));
});

gulp.task("recorder-release", function() {
	return gulp.src("./src/VectorVideo/Recorder/Recorder.ts")
			.pipe(tsc(recorderProject.compilerOptions))
			.pipe(ignore.exclude([ "**/*.map" ])) // do not uglify .map files
			.pipe(uglify())
			.pipe(gulp.dest("./release/vector-video-lib"));
});

gulp.task("vector-video-release", function() {
	return gulp.src("./src/VectorVideo/lib.ts")
			.pipe(tsc(libProject.compilerOptions))
			.pipe(ignore.exclude([ "**/*.map" ])) // do not uglify .map files
			.pipe(uglify())
			.pipe(gulp.dest("./release/vector-video-lib"));
});

gulp.task("lib-release", ["vector-video-release", "player-release", "recorder-release"]);

//
// B) for the demo
//

gulp.task("copy-source-for-sourcemaps", function () {
	return gulp.src("./src/VectorVideo/**/*")
				.pipe(gulp.dest("./demo/public/js/src/VectorVideo/"));
});

gulp.task("vector-video-demo", ["copy-source-for-sourcemaps"], function() {
	return gulp.src("./src/VectorVideo/lib.ts")
			.pipe(sourcemaps.init())
			.pipe(tsc(libProject.compilerOptions))
			.pipe(sourcemaps.write("./demo/public/js/libs"))
			.pipe(gulp.dest("./demo/public/js/libs"));
});

gulp.task("lib-demo", ["vector-video-demo"]);


/**
 * Compile the VectorVideo JavaScript library
 * The source of VectorVideo is written in TypeScript and must be transpiled to pure Javascript.
 */
var workersProject = require("./src/AudioRecordingWorkers/tsconfig.json");

gulp.task("workers", function() {	
	return gulp.src("./src/AudioRecordingWorkers/**/*.ts")
						.pipe(tsc(workersProject.compilerOptions))
						.pipe(gulp.dest("./release/workers"));
});

gulp.task("workers-demo", function() {	
	return gulp.src("./src/AudioRecordingWorkers/**/*.ts")
						.pipe(tsc(workersProject.compilerOptions))
						.pipe(gulp.dest("./demo/public/js/workers"));
});

/**
 * Compile the Audio recording server
 * The Audio recording server is written in TypeScript and must be transpiled to pure JavaScript.
 */
var audioServerProject = require("./src/AudioServer/tsconfig.json");
gulp.task("audio-server", function(cb) {	
	return gulp.src("./src/AudioServer/**/*.ts")
					.pipe(tsc(audioServerProject.compilerOptions))
					.pipe(gulp.dest("./release/audio-server"));
});

gulp.task("audio-server-demo", function(cb) {	
	return gulp.src("./src/AudioServer/**/*.ts")
					.pipe(tsc(audioServerProject.compilerOptions))
					.pipe(gulp.dest("./demo/"));
});

/**
 * Compile the DEMO server
 * The DEMO server is written in TypeScript and must be transpiled to pure JavaScript.
 */
var serverProject = require("./src/DemoServer/tsconfig.json");
gulp.task("demo-server", function(cb) {	
	return gulp.src("./src/DemoServer/**/*.ts")
					.pipe(tsc(serverProject.compilerOptions))
					.pipe(gulp.dest("./demo/"));
});


gulp.task("demo", ["clean-demo", "demo-server", "audio-server-demo", "lib-demo", "themes-demo", "workers-demo"]);
gulp.task("release", ["clean-release", "audio-server", "lib-release", "themes"]);

// default: compile both the JS library and the server
gulp.task("default", ["release", "demo"]);