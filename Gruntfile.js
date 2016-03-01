/**
 * Created by Andrew on 2/27/16.
 */
module.exports = function (grunt) {
  var INTERNAL_CODE = 'dev/src/';
  var INTERNAL_CODE_JS = INTERNAL_CODE + 'scripts/';
  var INTERNAL_CODE_CSS = INTERNAL_CODE + 'styles/';

  var OUTPUT_FOLDER = 'dev/bin/';
  var OUTPUT_FOLDER_JS = OUTPUT_FOLDER + 'scripts/';
  var OUTPUT_FOLDER_CSS = OUTPUT_FOLDER + 'styles/';
  var OUTPUT_FOLDER_CSS_COMPILED = OUTPUT_FOLDER_CSS + 'compiled/';

  grunt.initConfig({
    concat: {
      externalScripts: {
        src: [
          'bower_components/jquery/dist/jquery.min.js',
          'bower_components/bootstrap/dist/js/bootstrap.min.js'
        ],
        dest: OUTPUT_FOLDER_JS + 'external.min.js'
      },
      externalStyles: {
        src: [
          'bower_components/bootstrap/dist/css/bootstrap.min.css'
        ],
        dest: OUTPUT_FOLDER_CSS + 'external.min.css'
      },

      internalStyles: {
        src: [
          OUTPUT_FOLDER_CSS_COMPILED + '*.css'
        ],
        dest: OUTPUT_FOLDER_CSS + 'internal.css'
      }
    },

    ts: {
      dev: {
        options: {
          fast: 'never'
        },
        src: [
          INTERNAL_CODE_JS + 'refAll.d.ts'
        ],
        out: OUTPUT_FOLDER_JS + 'internal.js'
      }
    },

    sass: {
      dev: {
        files: [{
          expand: true,
          cwd: INTERNAL_CODE_CSS,
          src: ['*.scss'],
          dest: OUTPUT_FOLDER_CSS_COMPILED,
          ext: '.css'
        }]
      }
    },

    clean: {
      compiledStyles: [OUTPUT_FOLDER_CSS_COMPILED]
    },

    copy: {
      externalFiles: {
        files: [
          {
            src: [
              'bower_components/bootstrap/dist/fonts/glyphicons-*'
            ],
            dest: OUTPUT_FOLDER + 'fonts/',
            expand: true,
            flatten: true
          }
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-ts');

  grunt.registerTask('default', ['dependencies', 'dev']);
  grunt.registerTask('dependencies', ['concat:externalScripts', 'concat:externalStyles', 'copy:externalFiles']);
  grunt.registerTask('dev', ['ts:dev', 'sass:dev', 'concat:internalStyles', 'clean:compiledStyles']);
};