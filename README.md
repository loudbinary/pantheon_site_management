# pantheon_site_management Utility

*Required:*<p>
**Environment Variables:**
* PANTHEON_MACHINE_TOKEN - [How-to Obtain Machine Token](https://pantheon.io/docs/machine-tokens/)

*Installation:*<p>
```npm install pantheon_site_management -g```

*Arguments:*<p>

*Accepts value via cli argument, otherwise uses environment variables*<p>
--PANTHEON_MACHINE_TOKEN="SomeTokenHere"<p>

*Attempts to first load CWD/DB Database into App.Pantheon.sites.all, other wise queries Pantheon*<p>
*Often used in conjunction with createMultidevs or reportOutdated arguments*<p>
--loadDb

*During multidev creation process Upstream updates will be applied*<p>
--applyUpstreamUpdates

*Resets local CWD/Db, priority option analyzed first*<p>
--resetDb

*Examples:*<p>

*Refreshes CWD/DB File Database from Pantheon, useful to run before --createMultidevs*<p>
```pantheon_site_management --scanSites --resetDb```

*Scans and records details into clean empty CWD/Db File database*<p>
```pantheon_site_management --scanSites --siteName=<sitename> --resetDb```

*Created multidev named "patching" for any site in CWD/DB which is out of date*<p>
```pantheon_site_management --loadDb --createMultidevs```

*Source code documentation:*
[Show Docs](https://github.com/loudbinary/pantheon_site_management/blob/master/api/documentation.md)