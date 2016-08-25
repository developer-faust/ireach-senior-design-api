// Gruntfile.js
module.exports = function(grunt){
  // Load grunt mocha task
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Mocha Test
    mochaTest: {
		  test: {
		    options: {
		      reporter: 'list',
		      timeout: 2000
		    },
		    src: ['test/groups.js',
		    			'test/doctors.js',
		    			'test/patients.js',
		    			'test/diet.js',
		    			'test/admin.js',
		    			'test/raw_data.js',
		    			'test/data.js']
		  },
		  web_enter: { // fill database for website testing
		    options: {
		      reporter: 'list',
		      timeout: 2000
		    },
		    src: ['test/web_testing_enter.js']
		  },
		  web_remove: { // remove data entered for website testing
		    options: {
		      reporter: 'list',
		      timeout: 2000
		    },
		    src: ['test/web_testing_remove.js']
		  }
		}
  });

  grunt.registerTask('we', ['mochaTest:web_enter']);
  grunt.registerTask('wr', ['mochaTest:web_remove']);
  grunt.registerTask('default', ['mochaTest:test']);
};