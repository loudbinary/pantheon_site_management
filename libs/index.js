const chalk = require('chalk');
const _ = require('lodash');

App = {
    utils: {
        log:{
            msg: function(message){
                chalk.green(console.log(_.join(arguments,' ')));
            },
            error: function(message){
                chalk.red(console.log(message));
            }
        }
    }
};

App.SiteManagement = require('./site_management');
App.Pantheon = require('./pantheon.js');

module.exports = App;
