const chalk = require('chalk');
const _ = require('lodash');

App = {
    utils: {
        log:{
            /**
             *
             * @param message {Array} Array to be concatenated into string and display in console
             * @param no_new_line {Boolean} Default false, if true no line ending is applied to message
             * @param error {Boolean} Default false, if true color display will be red otherwise green
             */
            msg: function(message,no_new_line,error){
                no_new_line = (typeof no_new_line !== 'undefined') ?  no_new_line : false;
                error = (typeof error !== 'undefined') ?  error : false;
                if (!no_new_line){
                    chalk.green(console.log(_.join(arguments[0],' ')));
                } else {
                    if(error) {
                        chalk.red(process.stdout.write(_.join(arguments[0],' ')));
                    } else {
                        chalk.green(process.stdout.write(_.join(arguments[0],' ')));
                    }

                }
            },
            error: function(message){
                chalk.red(console.log(_.join(arguments[0],' ')));
            }
        }
    }
};

App.SiteManagement = require('./site_management');
App.Pantheon = require('./pantheon.js');
App.Db = require('./db.js');
App.ArgumentsProcessor = require('./arguments_processor');

module.exports = App;
