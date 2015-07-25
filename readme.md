Tree Frog
=========

Tree frog is Gulp plugin which generates customized versions of populair front end libraries like Bootstrap, Ionic and Material Design. On build time this replaces style elements based on a configuraion file.

````
var treefrog = require("tree-frog");

treefrog.boostrap({"brand-primary" : "#FF6600"})
.pipe(gulp.dest("dest/lib/boostrap"))
