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
        App.utils.log.msg(['Loading sites from CWD/DB File storage']);
        App.Pantheon.sites.all = App.Db.get.sites();
    }
    else {
        fillSites()
            .then(()=>{
                App.utils.log.msg(['Finished querying all Pantheon sites for details']);
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
            fillSites()
                .then((sites)=>{
                    let _sites = JSON.parse(sites);
                    let results = _.forEach(_sites,(site)=>{
                        site.upstreamOutdated = '';
                        site.upstreamUpdates = new Array;
                        App.Pantheon.sites.all.push(site);
                    })
                    resolve(null);
                })
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
        } while (count != outdated.length);
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
 * Private Fills App.Pantheon.sites.all array with all Sites from Pantheon query terminus site:list
 */
function fillSites(){
    return new Promise((resolve)=>{
        var that = this.App.Pantheon;
        this.App.utils.log.msg(['Filling sites array']);
        exec('terminus', ['site:list','--format=json']).then(result => {
            if (result.code === 0){
                resolve(result.stdout);
            } else {
                this.App.utils.log.error('Error retrieving sites:',result.stderr);
                throw new Error('Error retrieving sites: '+ result.stderr);
            }
        });
    })
}

/**
 * For given site queries Pantheon synchronously and return results of terminus upstream:updates:status
 * @param site {Array} Pantheon site data and details.
 * @returns {String} Results of Pantheon query Either - [outdated, current]
 */
function checkUpstream(site){
    App.utils.log.msg(['Checking status of', site.name, 'for outdated upstream'],true);
    var results = exec.sync('terminus',['upstream:updates:status', site.name + '.dev']).stdout;
    if (!_.isNil(results) && results === 'outdated'){
        App.utils.log.msg([' - OUT_OF_DATE'],false,true);
    }
    else if (!_.isNil(results) && results === 'current') {
        App.utils.log.msg([' - UP_TO_DATE']);
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
    App.utils.log.msg(['Verifying multidev',multidevName,'does not exist for site', site.name]);
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
    App.utils.log.msg(['Filling upstream updates of', site.name],true)
    let updates = JSON.parse(exec.sync('terminus',['upstream:updates:list', site.name + '.dev','--format=json']).stdout);
    let results = [];
    _.each(updates,(item)=>{
        results.push(item)
    })
    App.utils.log.msg([' -','Total Upstream Updates Available:', results.length]);
    return results;
}

/**
 * Write json object to CWD directory as Files
 * @param site A JSON Object with details to be written, in this case a site.
 */
function writeSiteToDb(site){
    App.utils.log.msg(['Writing',site.name,'details to database -'],true);
    let key = App.Db.add.site(site);
    if (key) {
        App.utils.log.msg([' SUCCESS'], false);
    } else {
        App.utils.log.msg([' FAILURE'], false,error);
    }
}

function createMultidev(site,multidevName) {
    App.utils.log.msg(['Creating new multidev', multidevName,'for site',site.name]);
    let results = exec.sync('terminus',['multidev:create',site.name,multidevName]);
    return results;
}

/**
 * Generalized methods for private utility use.
 * @type {Pantheon}
 */
module.exports = Pantheon;