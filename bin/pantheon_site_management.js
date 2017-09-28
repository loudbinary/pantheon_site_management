#!/usr/bin/env node
const app = require('../libs/index');

/**
 * Main entry for Pantheon patch scan, fills Global Object App.Pantheon.sites.all with results
 */
app.SiteManagement.scanForPatches();
