var thenifyAll = require('thenify-all');
var exec = require('mz/child_process').exec;
var fs =  thenifyAll(require('fs-extra'), {}, [
  'remove',
  'copy',
  'exists'
]);
var process = require('process');
var expect =  require('chai').expect;

var _ = require('lodash');
var English = require('yadda').localisation.English;

module.exports = English.library()
  .given('a fixture app "$APP"', function(app, next) {
    var testFixture = __dirname + '/../../test/fixtures/' + app;
    var tempFixture = __dirname + '/../../temp/test/' + app;

    fs.remove(tempFixture)
      .then(function(){
        return fs.copy(testFixture, tempFixture);
      })
      .then(function(){
        process.chdir(tempFixture);
        next();
      })
      .catch(next);

  })
  .when('I run "$COMMAND"', function(command, next) {
    exec(command).then((function (stdout, stderr) {
      this.context.stdout = stdout[0];
      next();
    }).bind(this)).catch(next);
  })
  .then('the following files? should exist:\n((.|\n)+)', function(files, na, next) {
    // HACK: use promises
    this.context.files = files.split('\n');
    _.forEach(files.split('\n'), function(file) {
      expect(fs.existsSync(file)).to.be.true;
    });
    next();
  })
  .then('the contents of it should be:\n((.|\n)+)', function(contents, na, next) {
    fs.readFile(this.context.files[0], function(err, realContents) {
      var realContentsTrimmed = realContents.toString()
            .replace(/ +\n/g,'\n')
            .replace(/\n+$/g,'');

      expect(realContentsTrimmed).to.equal(contents);
      next();
    });
  })
  .then('it outputs:\n((.|\n)+)', function(output, na, next) {
    expect(output).to.equal(this.context.stdout);
    next();
  });
