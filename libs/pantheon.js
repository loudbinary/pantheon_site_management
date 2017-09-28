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
        all: []
    }
}

/**
 * Simple getter to read all sites found in object
 * @returns {Array}
 */
Pantheon.sites.list = function(){
    return this.all;
}

/**
 * Public Fills App.Pantheon.sites.all array with all Sites from Pantheon query.
 */
Pantheon.sites.fill = function(){
    return new Promise((resolve)=>{
        ensureSetup();
        fillSites()
            .then((sites)=>{
                _.forEach(JSON.parse(sites),(site)=>{
                    site.upstreamOutdated = false;
                    site.upstreamUpdates = new Array;
                    this.all.push(site);
                })
            })
            .then(()=>{
                resolve(null)
            })
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
            App.Pantheon.sites.all[count].upstreamOutdated = (checkUpstream(App.Pantheon.sites.all[count]));
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
        } while(count != outdated.length)
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
        this.App.utils.log.msg('Filling sites array');
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
        App.utils.log.msg('Checking status of', site.name, 'for outdated upstream');
        return exec.sync('terminus',['upstream:updates:status', site.name + '.dev']).stdout
}

/** For given site, queries Pantheon site syncronously and results of terminus upstream:updates:list and apply to upstreamUpdates array */
function fillUpstreamUpdates(site){
    App.utils.log.msg('Filling upstream updates of', site.name)
    let updates = JSON.parse(exec.sync('terminus',['upstream:updates:list', site.name + '.dev','--format=json']).stdout);
    let results = [];
    _.each(updates[0],(item)=>{
        results.push(item)
    })
    return results;
}

/**
 * Generalized methods for private utility use.
 * @type {Pantheon}
 */
module.exports = Pantheon;