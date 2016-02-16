import chalk from 'chalk';
import gulp from 'gulp';

import assign from 'lodash/assign';

import babelify from 'babelify';
import browserify from 'browserify';
import envify from 'envify';

import babel from 'gulp-babel';
import buffer from 'vinyl-buffer';
import gutil from 'gulp-util';
import mergeStream from 'merge-stream';
import rename from 'gulp-rename';
import source from 'vinyl-source-stream';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';

import pjson from '../package.json';

const entryPoint = './index.js';

const exportedFileBasename = 'fargs';
const exportedMethod = 'fargs';

const banner = `/*!
* ${pjson.name}@${pjson.version}
* ${pjson.description}
* ${pjson.homepage}
* Copyright ${(new Date()).getFullYear()} ${pjson.author}; Licensed ${pjson.license}
*/
`;

const actionStr = `'${chalk.cyan('build:js')}'`;

function mapError(err) {
  const error = chalk.red(err.name);
  if (err.fileName) {
    // regular error
    const file = chalk.yellow(err.fileName.replace(`${__dirname}/src/js/`, ''));
    const line = chalk.magenta(err.lineNumber);
    const col = chalk.magenta(err.columnNumber || err.column);
    const desc = chalk.blue(err.description);
    gutil.log(`${error}: ${file}:${line}:${col}: ${desc}`);
  } else {
    const message = chalk.yellow(err.message);
    gutil.log(`${error}: ${message}`);
  }

  this.emit('end');
}

function bundler() {
  return browserify(entryPoint, {standalone: exportedMethod, debug: true})
    .transform(babelify)
    .transform(envify);
}

function bundle(b, prod) {
  let dist = b.bundle().on('error', mapError)
    .pipe(source(`${exportedFileBasename}.js`))
    .pipe(gulp.dest('./dist'));
  if (!prod) return dist;
  dist = dist
    .pipe(gulp.dest('./dist-es5-module/dist'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify({banner}))
    .pipe(rename(`${exportedFileBasename}.min.js`))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist'))
    .pipe(gulp.dest('./dist-es5-module/dist'));
  let distES5 = gulp.src(['./index.js', './src/**/*.js'], {base: '.'})
    .pipe(babel())
    .pipe(gulp.dest('./dist-es5-module'));
  let distES5TypesAndValidators = gulp.src('./src/{types,validators}/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('./dist-es5-module'));
  return mergeStream(dist, distES5, distES5TypesAndValidators);
}

export default function () {
  const prod = process.env.NODE_ENV === 'production';
  const envStr = chalk.yellow(process.env.NODE_ENV);
  gutil.log(`Environment for ${actionStr}: NODE_ENV=${envStr}`);
  let b = bundler();
  let res = bundle(b, prod);
  return res;
}
