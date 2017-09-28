let app = require('./index');
const _ = require('lodash');

SiteManagement = {
    scanForPatches: scanForPatches
}
/**
 * Scan for patches, and fills global App.Pantheon.sites object
 * @param refresh {Boolean} If true, forces new Array on App.Pantheon.sites to refresh data.
 */
function scanForPatches(refresh){
    if (refresh === true || App.Pantheon.sites.all.length === 0){
        if (refresh === true) {
            app.log.msg(['Refreshing sites array']);
            app.Pantheon.sites.all = new Array();
        }
        App.utils.log.msg(['Sites empty, filling array'])
        App.Pantheon.sites.fill()
            .then(()=>{
                App.utils.log.msg(['Finished getting Pantheon results, found', App.Pantheon.sites.all.length, 'sites']);
            })
            .then(()=>{
                App.utils.log.msg(['Scanning for missing patches for all', App.Pantheon.sites.all.length, 'sites']);
                App.Pantheon.sites.checkUpstreamStatus();

            })
            .then(()=>{
                let outdated = _.map(App.Pantheon.sites.all,(site)=>{
                    if (!_.isNil(site) && site.upstreamOutdated === 'outdated') {
                        App.Pantheon.sites.all.pop(site);
                        return site;
                    }
                })
                return _.compact(outdated);
            })
            .then((outdated)=>{
                App.utils.log.msg(['Found', outdated.length,'sites with outdated upstreams']);
                App.Pantheon.sites.fillUpstreamUpdates(outdated);
            })
            .then(()=>{
                let count = 0;
                do {
                    App.Pantheon.sites.writeSiteDetails(App.Pantheon.sites.all[count])
                    count++;
                } while (count != App.Pantheon.sites.all.length)
            })
    }

}

/**
 * Generalized methods and functions for management of Pantheon sites.
 * @type {SiteManagement}
 */
module.exports = SiteManagement