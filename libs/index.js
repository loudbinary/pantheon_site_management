const chalk = require('chalk');
const _ = require('lodash');
const path = require('path')
const markdown = require(path.join(__dirname,'./reports/markdown.js'));
const html = require(path.join(__dirname,'./reports/html.js'));

App = {
    Utils: {
        Log: {
            /**
             *
             * @param message {Array} Array to be concatenated into string and display in console
             * @param no_new_line {Boolean} Default false, if true no line ending is applied to message
             * @param error {Boolean} Default false, if true color display will be red otherwise green
             */
            msg: function (message, no_new_line, error) {
                no_new_line = (typeof no_new_line !== 'undefined') ? no_new_line : false;
                error = (typeof error !== 'undefined') ? error : false;
                if (!no_new_line) {
                    console.log(chalk.green(_.join(arguments[0], ' ')));
                } else {
                    if (error) {
                        process.stdout.write(chalk.red(_.join(arguments[0], ' ')));
                    } else {
                        process.stdout.write(chalk.green(_.join(arguments[0], ' ')));
                    }

                }
            },
            error: function (message) {
                console.log(chalk.red(_.join(arguments[0], ' ')));
            }
        },
        /**
         * Given a Site JSON object, returns neatly formatted JSON Object for emitting markdown
         * @param site
         */
        toMarkdown: function (site) {
            let results = markdown.generateMarkdown(site);
            return results;
        },
        toHtml: function (sites) {
            let results = html.generateHtml(sites);
            return results;
        }
    }
};

App.SiteManagement = require('./site_management');
App.Pantheon = require('./pantheon.js');
App.Db = require('./db.js');
App.ArgumentsProcessor = require('./arguments_processor');

module.exports = App;
