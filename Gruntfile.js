module.exports = function(grunt){
    grunt.initConfig({
        jsdoc : {
            dist : {
                src: ['libs/*.js'],
                dest: 'doc'
            }
        },
        jsdoc2md: {
            oneOutputFile: {
                src: 'libs/*.js',
                dest: 'api/documentation.md'
            }
        }
    });
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-jsdoc-to-markdown')
    grunt.registerTask('default', ['jsdoc','jsdoc2md']);

}