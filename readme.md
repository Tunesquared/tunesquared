#build
React view must be built before starting the app. You will need grunt-cli for all grunt tasks :
`npm install -g grunt-cli`
Then run `grunt react` every time you want to compile react views (be sure to `npm install` before running any grunt task).

To compile from ST2:
Tools -> build System -> New Build system...
copy this JSON :
```JSON
{
  "cmd": ["grunt.cmd", "react"],
  "selector": "source.js"
}
```
To build on save, install SublimeOnSaveBuild (available w/ Package Control).
Then Preferencees -> Package Settings -> SublimeOnSaveBuild, copy the contents of "Settings - Default" to "Settings - User" and add jsx to the list of extentions in "filename_filter".

# Development :
*Follow these guidelines when developping on this project*
## Style
 - tabs = two spaces
 - use jshint if possible, .jshintrc are comitted to share coding style config
## Constants litteral
 - always extract litteral constants from code and declare them at the top of your files (not in global space !!!)
 - constants are capped + underscore as word separator
 - when a constant should be the same value accross multiple points in the program, expose it as Module.MY_CONSTANT.
 - if not possible, then use the same name for every instances, and link them with comments so they can be easily found and updated.
ex :

server - Party.js
```javascript
/* Maximum string length for party title. (see client create dialog) */
var PARTY_TITLE_MAX_LEN = 32;
```

client - CreateDialog.jsx
```javascript
/* Maximum string length for party title. (see Party server model) */
var PARTY_TITLE_MAX_LEN = 32;
```
