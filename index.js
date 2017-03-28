/*
* Dependencies (specs in package.json)
*/
var envVariables 	= require("./env_variables.js"),
	metalsmith		= require("metalsmith"),
	layouts			= require("metalsmith-layouts"),
	inplace			= require("metalsmith-in-place"),
	minHTML			= require("metalsmith-html-minifier"),
    minCSS			= require("metalsmith-clean-css"),
	minJS			= require("metalsmith-uglify"),
	mimes			= require("metalsmith-custom-mimes"),
	names			= require("metalsmith-rename"),
	links			= require("metalsmith-linkcheck"),
	check 			= require("metalsmith-if"),
	local			= require("metalsmith-custom-rename");

/* 
* Environment (other arguments start at [3])
*/
var environment = process["argv"][2];

/*
* Environment variables (set in env_variables.js)
*/
var env = envVariables(environment);

/*
* Metalsmith generator (__dirname = project root)
*/
metalsmith(__dirname)

	/*
	* Global metadata variables
	*
	* @parameter 		variables 	{Object} 	metadata variables
	*   @property 		oac_env 	{String} 	OAC environment (set in env_variables.js)
	*   @property 		root_dir 	{String} 	server root (set in env_variables.js)
	*   @property 		use_local 	{Boolean} 	use local download pages
	*   @property 		monthly 	{Object} 	monthly costs
	*     @property 	current 	{String} 	current cost (e.g. "$2.99")
	*     @property 	regular 	{String} 	regular cost (e.g. "$5.00")
	*   @property 		annual 		{Object} 	annual costs
	*     @property 	current 	{String} 	current cost (e.g. "$30.00")
	*     @property 	regular 	{String} 	regular cost (e.g. "$50.00")
	*   @property 		lifetime 	{Object} 	lifetime costs
	*     @property 	current 	{String} 	current cost (e.g. "$36.00")
	*     @property 	regular 	{String} 	regular cost (e.g. "$75.00")
	*/
	.metadata({
		root_dir: env["root_dir"],
		rstfl_url: env["rstfl_url"],
		vsto_ws_url: env["vsto_ws_url"],
		hostname: env["hostname"],
		localhost: env["localhost"],
		use_local: false
	})

	/*
	* Source directory
	*
	* @parameter source {String} source directory path
	*/
	.source("./src")

	/*
	* Destination directory
	*
	* @parameter destination {String} destination directory path
	*/
	.destination("./build")

	/*
	* Templating in layouts directory
	*
	* @parameter 	options 	{Object} 	plugin options
	*   @property 	default 	{String} 	default layout (in layouts)
	*   @property 	engine 		{String} 	templating engine
	*   @property 	partials 	{String} 	partials directory
	*   @property 	pattern 	{String} 	source file regexp (used in layouts)
	*/
	.use(layouts({
		default: "template.hbs",
		engine: "handlebars",
		partials: "partials",
		pattern: "*.hbs"
	}))

	/*
	* Templating in source directory
	*
	* @parameter 	options 	{Object} 	plugin options
	*   @property 	pattern 	{String} 	source file regexp
	*/
	.use(inplace({
		pattern: "*.hbs"
	}))

	/*
	* Minify HTML
	*
	* @parameter 	[options] 						{Object} 	plugin options
	*   @property 	[minifyJS] 						{Boolean} 	minify JS (defaults to false)
	*   @property 	[removeScriptTypeAttributes] 	{Boolean} 	remove type="text/javascript" from script tags (defaults to true)
	*   @property 	[minifyCSS] 					{Boolean} 	minify CSS (defaults to false)
	*/
	/*
	.use(minHTML({
		minifyJS: true,
		removeScriptTypeAttributes: false,
		minifyCSS: true
	}))
	*/

	/*
	* Minify CSS
	*
	* @parameter	[options] 	{Object}	plugin options
	*   @property	[cleanCSS] 	{Object}	configuration of clean-css API
	*    @property	[rebase] 	{Boolean}	rebase URLs (defaults to true)
	*/
	/*
	.use(minCSS({
		cleanCSS: {
			rebase: false	// skip URL rebasing
		}
	}))
	*/

	/*
	* Minify JS
	*
	* @parameter 	options 		{Object} 	plugin options
	*   @property 	nameTemplate 	{String} 	new filename ([name] and [ext] are tokens)
	*/
	/*
	.use(minJS({
		nameTemplate: "[name].[ext]"
	}))
	*/

	/*
	* Store MIME types (by extension lookup)
	*/
	.use(mimes())

	/*
	* Rename files
	*
	* @parameter 	options 	{Array} 	plugin options
	*   @value 		match 		{String} 	regexp to match
	*   @value 		replacement {String} 	replacement string
	*/
	.use(names([
		[".html", ""]
	]))

	/* 
	* Check links (internal & external)
	*
	* @parameter 	[options] 		{Object} 	plugin options
	*   @property 	[verbose] 		{Boolean} 	log failed links in the console (default is false)
	*   @property 	[failMissing] 	{Boolean} 	fail if a tag has no href attribute (default is false)
	*/
	.use(links({
		verbose: true,
		failMissing: true
	}))

	/*
	* Re-add extensions (local only)
	*
	* @parameter 	check 		{Function} 	creates an if statement
	*   @parameter 	localhost	{Boolean}	local environment
	*   @parameter 	local		{Function}	re-adds .html extensions
	*/
	.use(check(
		env["localhost"],
		local()
	))

	/*
	* Build site (or throw an error)
	*
	* @parameter 	callback 	{Function} 	catches error
	*   @parameter 	err			{String}	error message
	*   @parameter 	files		{Object}	source files & their data
	*/
	.build(function(err, files) {
		if (err) {
			throw err;
		}
	});
