const _ = require('lodash');
const exec = require('execa');
const Promise = require('bluebird');

/**
 *
 * @type {Pantheon}
 */
Pantheon = {
    machineToken: process.env.PANTHEON_MACHINE_TOKEN,
    /**
     * @memberOf Pantheon
     */
    sites: {
        base: this,
        all: [],
        checkMultidevExists: function(site,multidevName){
            return multidevExists(site,multidevName);
        }
    }
}

/**
 * Simple getter to read all sites found in object
 * @returns {Array}
 */
Pantheon.sites.list = function(){
    if (this.all.length === 0 && App.ArgumentsProcessor.args.loadFileDb) {
        App.Utils.Log.msg(['Loading sites from CWD/DB File storage']);
        App.Pantheon.sites.all = App.Db.get.sites();
    }
    else {
        fillSites()
            .then(()=>{
                App.Utils.Log.msg(['Finished querying all Pantheon sites for details']);
            })
    }
    return this.all;
}

/**
 * Public Fills App.Pantheon.sites.all array with all Sites from Pantheon query.
 */
Pantheon.sites.fill = function(){
    return new Promise((resolve)=>{
        ensureSetup();
        if (_.isNil(App.ArgumentsProcessor.args.loadFileDb)){
            // If possible, Converts --siteName to an array, for any string seperated by a ,
            if ((!_.isNil(App.ArgumentsProcessor.args.siteName) && typeof  App.ArgumentsProcessor.args.siteName == 'string')) {
                let sitesForProcessing = _.each(App.ArgumentsProcessor.args.siteName.split([',']),(site)=>{
                    return site.trim();
                })

                // Keep original behavior, prior to implementation of #8
                if (sitesForProcessing.length === 1){
                    fillSites().then((sites)=>{
                        populateJobFields(sites);
                        resolve(null);
                    })
                }/** This logic branch is for new processing details in support of #8 */
                else if (sitesForProcessing.length > 1) {
                    App.Utils.Log.msg(['Filling details for', sitesForProcessing.length,'requested sites']);
                    newFillSite().then((queryCmds) => {
                        let finalResults = [];
                        let count = 0;
                        do {
                            finalResults.push(JSON.parse(getSingleSiteDetails(queryCmds[count]).stdout));
                            count++
                        } while (count !== queryCmds.length)
                        //Modify needed properties for processing later on each site result, and push into global Array
                        count = 0;
                        do {
                            finalResults[count].upstreamOutdated = '';
                            finalResults[count].upstreamUpdates = new Array;
                            App.Pantheon.sites.all.push(finalResults[count]);
                            count++
                        } while (count != finalResults.length)
                        resolve(null);
                    })
                }
            } else {
                //We must be scanning for all available sites in Pantheon.
                fillSites().then((sites)=>{
                    populateJobFields(sites);
                    resolve(null);
                })
            }
        }
        else {
            App.Pantheon.sites.all = App.Db.get.sites();
            }
        })
}

Pantheon.sites.createMultidev = function(site,multidevName){
    return new Promise((resolve)=>{
        let results = createMultidev(site,multidevName);
        resolve(results);
    })
}

/**
 * Queries upstream status for site, and returns outdated or current, value gets assigned too upstreamOutdated of site object
 * @returns {site} Object
 */
Pantheon.sites.checkUpstreamStatus = function (){
    return new Promise((resolve)=>{
        let count = 0;
        do {
            /** @prop {Boolean} upstreamOutdated Either 'outdated' or 'current' - Value populated by checkUpstream */
            App.Pantheon.sites.all[count].upstreamOutdated = checkUpstream(App.Pantheon.sites.all[count]);
            count++;
        } while (count != App.Pantheon.sites.all.length )
        resolve(null);
    })
}

/**
 * Fills upstreamUpdates array with all missing upstream updates found by terminus upstream:updates:list <site>.dev
 * @param outdated Array filled with all sites matching upstreamOutdated === 'outdated'
 */
Pantheon.sites.fillUpstreamUpdates = function (outdated){
    return new Promise((resolve)=>{
        let count = 0;
        do {
            _.flattenDeep(outdated[count].upstreamUpdates.push((fillUpstreamUpdates(outdated[count]))));
            count++;
        } while (count != outdated.length || 0);
        count = 0;
        // Push each item of outdated into Global App.Pantheon.sites.all array.
        do {
            App.Pantheon.sites.all.push(outdated[count]);
            count++
        } while(count != outdated.length)
        resolve(null);
    })
}

Pantheon.sites.writeSiteDetails = function (site) {
    return new Promise((resolve)=>{
        writeSiteToDb(site);
        resolve(null);
    })
}

/**
 * Ensure that a PANTHEON_MACHINE_TOKEN environment variable available to application
 */
function ensureSetup(){
    if (_.isNil(this.App.Pantheon.machineToken) || this.App.Pantheon.machineToken === 'undefined'){
        console.log('Missing machine token please set PANTHEON_MACHINE_TOKEN to continue');
        throw {
            name: TypeError,
            message: 'Set environment variable PANTHEON_MACHINE_TOKEN to your assigned token and retry'
        }
    }
}

/**
 * Populate needed metadata items on to query results from Pantheon for sites.
 * @param queryResults
 */
function populateJobFields(queryResults){
    _.forEach(queryResults,(site)=>{
        site.upstreamOutdated = '';
        site.upstreamUpdates = new Array;
        App.Pantheon.sites.all.push(site);
    })
}
/**
 * Performs site object fulfillment for a single site at Pantheon, called by fillSites - Resolves #8
 * @param siteName
 */
function newFillSite() {
    return new Promise((resolve)=>{
        let baseArgs = ['--format=json'];
        let queryCmds = [];
        let siteNames = _.each(App.ArgumentsProcessor.args.siteName.split(','),(site)=>{
            return site.trim();
        })

        _.each(siteNames,(site)=>{
            let newArgs = new Array();
            _.merge(newArgs,baseArgs);
            newArgs.push(site);
            newArgs.unshift('site:info');
            queryCmds.push(newArgs);
        })
        resolve(queryCmds);
    })
}

/**
 * Private Fills App.Pantheon.sites.all array with all Sites from Pantheon query terminus site:list
 */
function fillSites(){
    return new Promise((resolve)=>{
        let args = ['--format=json'];
        var all = true;
        this.App.Utils.Log.msg(['Filling sites array']);
        if (!_.isNil(App.ArgumentsProcessor.args.siteName) && typeof App.ArgumentsProcessor.args.siteName == 'string') {
            args.push(App.ArgumentsProcessor.args.siteName);
            args.unshift('site:info')
            all = false;
        } else {
            args.unshift('site:list')
        }
        getSiteDetails(args,all,(results)=>{
            App.Utils.Log.msg(['Completed site fill.']);
            resolve(results);
        })
    })
}

function getSingleSiteDetails(args){
    return exec.sync('terminus', args);
}

function getSiteDetails(args,all,callback) {
    exec('terminus',args).then(result => {
        if (result.code === 0){
            let results = [];
            if (all === true) {
                results = _.map(JSON.parse(result.stdout),(item)=>{
                    return item;
                });
            } else {
                results.push(JSON.parse(result.stdout));
            }
            callback(results);
        } else {
            this.App.Utils.Log.error('Error retrieving sites:',result.stderr);
            throw new Error('Error retrieving sites: '+ result.stderr);
        }
    });
}

/**
 * For given site queries Pantheon synchronously and return results of terminus upstream:updates:status
 * @param site {Array} Pantheon site data and details.
 * @returns {String} Results of Pantheon query Either - [outdated, current]
 */
function checkUpstream(site){
    App.Utils.Log.msg(['Checking status of', site.name, 'for outdated upstream'],true);
    var results = exec.sync('terminus',['upstream:updates:status', site.name + '.dev']).stdout;
    if (!_.isNil(results) && results === 'outdated'){
        App.Utils.Log.msg([' - OUT_OF_DATE'],false,true);
    }
    else if (!_.isNil(results) && results === 'current') {
        App.Utils.Log.msg([' - UP_TO_DATE']);
    }
    return results;
}

/**
 * Queries Pantheon Site to see if a multidev exists by same name
 * @param site {Object} Details from Pantheon Query for a site.
 * @param multidevName {String} Multidev environment to check existence for within Pantheon site
 * @returns {boolean} Returns true if multidev exists, otherwise false.
 */
function multidevExists(site,multidevName) {
    App.Utils.Log.msg(['Verifying multidev',multidevName,'does not exist for site', site.name]);
    var results = exec.sync('terminus',['multidev:list',site.name,'--field=Name','--format=json']).stdout.split('\n');
    let exists = _.filter(results,(item)=>{
        return item == multidevName;
    })
    if (exists.length === 1 && exists[0] === multidevName){
        return true;
    } else {
        return false;
    }
}

/** For given site, queries Pantheon site synchronously and results of terminus upstream:updates:list and apply to upstreamUpdates array */
function fillUpstreamUpdates(site){
    App.Utils.Log.msg(['Filling upstream updates of', site.name],true)
    let updates = JSON.parse(exec.sync('terminus',['upstream:updates:list', site.name + '.dev','--format=json']).stdout);
    let results = [];
    _.each(updates,(item)=>{
        results.push(item)
    })
    App.Utils.Log.msg([' -','Total Upstream Updates Available:', results.length]);
    return results;
}

/**
 * Write json object to CWD directory as Files
 * @param site A JSON Object with details to be written, in this case a site.
 */
function writeSiteToDb(site){
    App.Utils.Log.msg(['Writing',site.name,'details to database -'],true);
    let key = App.Db.add.site(site);
    if (key) {
        App.Utils.Log.msg([' SUCCESS'], false);
    } else {
        App.Utils.Log.msg([' FAILURE'], false,error);
    }
}

/**
 * Private method to create multidev
 * @param site
 * @param multidevName
 */
function createMultidev(site,multidevName) {
    App.Utils.Log.msg(['Creating new multidev', multidevName,'for site',site.name]);
    let results = exec.sync('terminus',['multidev:create',site.name,multidevName]);
    return results;
}

/**
 * Generalized methods for private utility use.
 * @type {Pantheon}
 */
module.exports = Pantheon;