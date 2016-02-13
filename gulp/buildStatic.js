import gulp from 'gulp';

const files = ['package.json', 'README.md', 'LICENSE'];
const outputFolder = './dist-es5-module';

export default function buildStatic () {
  return gulp.src(files)
    .pipe(gulp.dest(outputFolder));
};
