import del from 'del';
import gulp from 'gulp';

import connect from 'gulp-connect';

import buildJS from './gulp/buildJS.js';
import buildStatic from './gulp/buildStatic.js';
import changelog from './gulp/changelog.js';
import lint from './gulp/lint.js';
import {test, reportsTest} from './gulp/test.js';

gulp.task('build:js', buildJS);
gulp.task('build:js:watcher', () => gulp.watch(['index.js', 'src/**'], ['build:js']));
gulp.task('build:js:watch', ['build:js', 'build:js:watcher']);

gulp.task('build:static', buildStatic);

gulp.task('build', ['build:js', 'build:static']);

gulp.task('changelog', changelog);

gulp.task('clean', () => del(['dist/', 'dist-es5-module/', 'coverage/', 'mochawesome-reports/']));

gulp.task('dev', ['build:js:watch', 'test:watch', 'server']);

gulp.task('lint', lint);

gulp.task('server', () => connect.server({root: './', port: process.env.PORT || 3000}));

gulp.task('test:run', test);
gulp.task('test:watcher', () => gulp.watch(['./src/**', './test/**'], ['test:run']));
gulp.task('test:watch', ['test:run', 'test:watcher']);
gulp.task('test:reports', reportsTest);
gulp.task('test', ['lint', 'test:reports']);
