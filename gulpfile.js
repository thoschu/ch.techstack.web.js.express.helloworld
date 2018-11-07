const gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    jshintXMLReporter = require('gulp-jshint-xml-file-reporter'),
    pkg = require('./package'),
    jshintConfig = pkg.jshintConfig;

gulp.task('jshint', () => {
    jshintConfig.lookup = false;
    return gulp.src(['*.js', 'public/*.js'])
        .pipe(jshint(jshintConfig))
        .pipe(jshint.reporter(jshintXMLReporter))
        .on('end', jshintXMLReporter.writeFile({
            format: 'checkstyle',
            filePath: './out/analysis/jshint.xml',
            alwaysReport: true
        }));
});