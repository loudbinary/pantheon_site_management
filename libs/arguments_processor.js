const yargs = require('yargs').argv
const _ = require('lodash');

ArgumentsProcessor = {
    args: yargs,
    process: function(){
        if (!_.isNil(yargs.PANTHEON_MACHINE_TOKEN)){
            App.Pantheon.machineToken = yargs.PANTHEON_MACHINE_TOKEN;
        }
        if (!_.isNil(yargs.refreshSites)){
            //Fills Global Object App.Pantheon.sites.all with results
            App.SiteManagement.scanForPatches();
        }

        if (!_.isNil(yargs.createMultidevs)) {
            if (App.ArgumentsProcessor.args.loadFileDb && App.Pantheon.sites.all.length === 0) {
                App.Pantheon.sites.all = App.Db.get.sites();
            }
            App.SiteManagement.createMultidevs('patching');
        }
    }
}

module.exports = ArgumentsProcessor;