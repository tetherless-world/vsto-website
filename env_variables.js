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
			env["hostname"] = "http://localhost:8080";
			env["rstfl_url"] = "http://localhost/~westp/rstfl";
			env["vsto_ws_url"] = "http://localhost:8080";
			env["localhost"] = true;
			env["root_dir"] = "/~westp/vsto";

			break;
		case "prod":
			env["root_dir"] = "";
			env["hostname"] = "https://vsto.org";
			env["rstfl_url"] = "http://cedarweb.vsp.ucar.edu/rstfl";
			env["vsto_ws_url"] = "https://vsto.org/vsto-ws";
			env["localhost"] = false;

			break;
	}

	return env;
};
