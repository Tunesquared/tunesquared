
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
		// server - Party.js

		/* Maximum string length for party title. (see client create dialog) */
		var PARTY_TITLE_MAX_LEN = 32;

		// client - CreateDialog.jsx

		/* Maximum string length for party title. (see Party server model) */
		var PARTY_TITLE_MAX_LEN = 32;
