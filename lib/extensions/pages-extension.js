/*global module, require */

'use strict';
var combiner = require('stream-combiner2').obj;
var chainedPreprocessors = require('gulp-chained-preprocessors');
var layouts = require('../shame/layouts');

class PagesExtension {
  constructor(fujisanOptions) {
    this.fujisanOptions = fujisanOptions;
    this.gulp = fujisanOptions.gulp;
    this.config = fujisanOptions.config;
  }

  streams() {
    return {
      build: [
        this.gulp.src(this.config.paths.source.pages),
        chainedPreprocessors(this.config.preprocessors),
        layouts(this.config),
        this.gulp.dest(this.config.paths.build.pages)
      ]
    };
  }

  registerTasks() {
    this.gulp.task(`${this.config.prefix}:build:pages`, () => {
      return combiner(this.streams().build);
    });
  }
}

module.exports = PagesExtension;