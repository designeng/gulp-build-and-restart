const gulp = require('gulp');
const { series, parallel } = require('gulp');
const cache = require('gulp-cached');
const babel = require('gulp-babel');
const gutil = require('gulp-util');
const fork = require('child_process').fork;

process.env.HOST = 'localhost';
process.env.PORT = 3000;

var appProcess;

function buildFromSource() {
    return gulp.src('src/**/*.js')
        .pipe(cache('source-build'))
        .pipe(babel())
        .on('error', function(err) {
            const message = err.message || '';
            const errName = err.name || '';
            const codeFrame = err.codeFrame || '';
            gutil.log(gutil.colors.red.bold('[JS babel error]')+' '+ gutil.colors.bgRed(errName));
            gutil.log(gutil.colors.bold('message:') +' '+ message);
            gutil.log(gutil.colors.bold('codeframe:') + '\n' + codeFrame);
        })
        .pipe(gulp.dest('build'));
}

function restartServer() {
    if(appProcess) appProcess.kill();
    appProcess = fork(__dirname + '/build/main.js');

    console.log('Started process with pid ', appProcess.pid);

    appProcess.on('error', (err) => {
        console.log('Failed to start subprocess.', err);
    });

    appProcess.on('close', function (code) {
        if (code === 8) {
            gulp.log('Error detected, waiting for changes...');
        }
    });
}

const runBuild = series(buildFromSource, restartServer);

gulp.task('watch', function() {
    gulp.watch(__dirname + '/src/**/*.js').on('change', function(file) {
        runBuild();
    });
});
