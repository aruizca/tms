var gulp = require('gulp');
var mainBowerFiles = require('main-bower-files');
var clean = require('gulp-clean');

/* Config Params*/
var dependenciesDestinationFolder = 'public/vendor';

gulp.task('default', function() {
    // place code for your default task here
});

gulp.task('clean-dependencies', function () {
    return gulp.src(dependenciesDestinationFolder, {read: false})
        .pipe(clean());
});


gulp.task('dependencies', ['clean-dependencies'], function() {
    return gulp.src(mainBowerFiles())
        .pipe(gulp.dest(dependenciesDestinationFolder))
});