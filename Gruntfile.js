
module.exports = function(grunt) {
  var bannerContent = '/*! <%= pkg.name %> v<%= pkg.version %> - ' +
                    '<%= grunt.template.today("yyyy-mm-dd") %> \n' +
                    ' *  License: <%= pkg.license %> */\n',
      name = '<%= pkg.name %>-v<%= pkg.version%>',
      latest = '<%= pkg.name %>',
      devRelease = 'distrib/'+name+'.js',
      minRelease = 'distrib/'+name+'.min.js',
      sourceMapMin = 'distrib/'+name+'.min.js',
      sourceMapUrl = name+'.min.js',
      latestDevRelease = 'distrib/'+latest+'.js',
      latestMinRelease = 'distrib/'+latest+'.min.js',
      latestSourceMapMin = 'distrib/'+latest+'.min.js.map';

  grunt.initConfig({
    pkg : grunt.file.readJSON('package.json'),
    // concat configuration
    concat: {
      options: {
        banner: bannerContent
      },
      target : {
        src : ['src/**/*.js'],
        dest : 'distrib/' + name + '.js'
      }
    },

    // JShint config
    jshint: {
      options: {
        eqeqeq: true,
        trailing: true
      },
      target: {
        src : ['src/**/*.js', 'test/**/*.js']
      }
    },

    // Uglify config
    uglify: {
      options: {
        banner: bannerContent,
        sourceMapRoot: '../',
        sourceMap: 'distrib/'+name+'.min.js.map',
        sourceMapUrl: name+'.min.js.map'
      },
      target : {
        src : ['src/**/*.js'],
        dest : 'distrib/' + name + '.min.js'
      }
    },

    // Copy config
    copy: {
       development: { // copy non-minified release file
         src: devRelease,
         dest: latestDevRelease
       },
       minified: { // copy minified release file
         src: minRelease,
         dest: latestMinRelease
       },
       smMinified: { // source map of minified release file
         src: sourceMapMin,
         dest: latestSourceMapMin
       }
     },

     bump: {
      options: {
        files: ['package.json'],
        updateConfigs: [],
        commit: true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['package.json'],
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: true,
        pushTo: 'upstream',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
        globalReplace: false,
        prereleaseName: false,
        metadata: '',
        regExp: false
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-bump');

  grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'copy']);

};
