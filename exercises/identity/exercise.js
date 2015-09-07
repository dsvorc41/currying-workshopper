var exercise      = require('workshopper-exercise')()
  , filecheck     = require('workshopper-exercise/filecheck')
  , execute       = require('workshopper-exercise/execute')
  , comparestdout = require('workshopper-exercise/comparestdout')
  , path          = require('path')
  , fs = require('fs')


// checks that the submission file actually exists
exercise = filecheck(exercise)

// add setup.
exercise.addSetup(function (mode, callback) {
   console.log ("this", this);

   console.log ("this.solutionModule", this.solutionModule);
   console.log ("this.submissionModule", this.submissionModule);
   console.log ("this.submissionArgs", this.submissionArgs);
   console.log ("this.solutionArgs", this.solutionArgs);

    this.solutionModule = require(getSolutionPath() + 'solution.js');
    this.submissionModule = require([process.cwd(), this.args[0]].join('/'));

    process.nextTick(callback);
});

console.log("exercise: ", exercise);


// add a processor.
exercise.addProcessor(function (mode, callback) {
    var pass = true;
    var random = Math.random();
  //  var idx = this.solutionModule(random);
    var idx = this.submissionModule(random);

    if (idx !== random) {
        exercise.emit('fail', 'this.ready was not set to true.');
        pass = false;
    }

    process.nextTick(function () {
        callback(null, pass)
    });
});

// Print out the suggested solution when the student passes. This is copied from
// workshopper-exercise/execute because the rest of execute is not relevant to
// the way this is tested.
// exercise.getSolutionFiles = function (callback) {
//     var solutionDir = getSolutionPath();
//
//     fs.readdir(solutionDir, function (err, list) {
//         if (err) {
//             return callback(err);
//         }
//
//         list = list
//             .filter(function (f) { return (/\.js$/).test(f) })
//             .map(function (f) { return path.join(solutionDir, f)});
//
//         callback(null, list);
//     });
// };

function getSolutionPath() {
    return path.join(exercise.dir, './solution/');
}
// compare stdout of solution and submission
// exercise = comparestdout(exercise)

module.exports = exercise