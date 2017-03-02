/*
* This function contains environment variables needed to build
* the site locally or into the staging/production environments.
*
* @parameter 	environment {String}	build environment
* @return		env 		{Object}	environment variables
*   @property 	root_dir 	{String} 	build destination
*   @property 	hostname 	{String} 	sitemap hostname
*   @parameter 	localhost	{Boolean}	local environment
*/
module.exports = function(environment) {
	var env = {};

	switch (environment) {
		case "local":
			env["root_dir"] = "/~westp/vsto";
			env["hostname"] = "http://localhost";
			env["localhost"] = true;

			break;
	}

	return env;
};
