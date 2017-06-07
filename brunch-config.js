// See http://brunch.io for documentation.
module.exports = {
  server: {
    run: true,
    port: 3018,
  },
  paths: {
    public: 'dist',
  },
  conventions: {
    assets: /^app\/views\//,
    ignored: ['docs'],
  },
  sourceMaps: false,
  bower: {
    enabled: false,
  },
  npm: {
    globals: {
      $: 'jquery',
      jQuery: 'jquery',
      _: 'lodash',
      ƒ: 'flavor-js',
      bootstrap: 'bootstrap-sass',
    },
  },
  files: {
    javascripts: {
      joinTo: {
        'scripts/vendor.js': /^(?!app)/, // Files that are not in `app` dir.
        'scripts/app.js': [
          /^app/,
          (path) => {
            return !path.includes('/docs');
          },
        ],
      },
      order: {
        before: [
          'node_modules/jquery/dist/jquery.js'
        ]
      },
    },
    stylesheets: {
      joinTo: {
        'styles/app.css': [
          /^app/,
          (path) => {
            return !path.includes('/docs') && path.includes('app.scss');
          },
        ],
      },
    },
  },
  plugins: {
    spritesheet: {
      files: 'app/assets/images/**/*.png',
      path: 'app/assets/spritesheets/',
      format: 'easel.js',
      name: 'atlas',
      trim: true,
      padding: 10,
      sort: 'maxside',
    },
    sass: {
      // gem_home: '/Library/Ruby/Gems/2.0.0/gems/sass-3.4.23',
      // mode: 'ruby',
      mode: 'native',
      precision: 8,
      allowCache: true,
      options: ['--style', 'compressed'],
      processors: [
        require('autoprefixer')(['last 8 versions']),
        require('csswring')()
      ],
    },
    copycat: {
      'assets': ['app/assets'],
      'assets/fonts': ['node_modules/bootstrap-sass/assets/fonts/bootstrap', 'node_modules/font-awesome/fonts'],
      verbose: false,
      onlyChanged: true,
    },
    eslint: {
      pattern: /^app\/.*\.js?$/,
      warnOnly: true,
      config: {
        rules: {
          'array-callback-return': 'warn'
        }
      }
    },
    babel: {
      presets: ['es2015'],
    },
    uglify: {
      mangle: true,
      minimize: true,
      sourceMap: true,
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
        global_defs: {
          DEBUG: false,
        }
      },
      output: {
        comments: false,
      },
    },
    order: [
      'sass-brunch',
      'eslint-brunch',
      'babel-brunch',
      'uglify-js-brunch',
      'spritesheet-js-brunch',
      'copycat-brunch',
    ],
  },
  modules: {
    autoRequire: {
      'scripts/app.js': ['scripts/app']
    }
  },
  overrides: {
    mac: {
      plugins: {
        sass: {
          gem_home: '/Library/Ruby/Gems/2.0.0/gems/sass-3.4.23',
        },
      },
    },
    beautiful: {
      plugins: {
        sass: {
          gem_home: '/home/astuser/.gem/ruby/gems/sass-3.4.23',
        },
      },
    },
  }
};
