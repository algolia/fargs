import fs from 'fs';
import gulp from 'gulp';

import conventionalChangelog from 'conventional-changelog';

export default () => (
  conventionalChangelog({
    preset: 'angular',
    releaseCount: 0
  })
  .pipe(fs.createWriteStream('./CHANGELOG.md'))
);
