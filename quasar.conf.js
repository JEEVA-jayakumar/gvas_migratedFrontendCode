const { configure } = require('quasar/wrappers');
const path = require('path');
module.exports = configure(function (ctx) {
  return {
    boot: ['i18n', 'axios', 'GlobalVariables', 'vuelidate', 'moment', 'image-viewer', 'chartjs', 'vue-resource', 'barcode-scanner', 'json-excel', 'stubs'],
    css: ['app.scss'],
    extras: ['roboto-font', 'material-icons', 'fontawesome-v5'],
    build: {
      vueRouterMode: 'hash',
      publicPath: '',
      gzip: true,
      extendWebpack (cfg) {
        cfg.resolve.alias = {
          ...cfg.resolve.alias,
          'vue-barcode-scanner': 'vue3-barcode-scanner',
          'vue-json-excel': 'vue-json-excel3',
          'vue-radial-progress': 'vue3-radial-progress',
          'vue-pdfjs': path.resolve(__dirname, './src/components/wrappers/vue-pdfjs-shim.js'),
          'vue-chartjs': 'vue-chartjs',
          'vuetify': path.resolve(__dirname, './src/stubs/index.js'),
          'babel-types': path.resolve(__dirname, './src/stubs/index.js'),
          'vue-resource': path.resolve(__dirname, './src/stubs/index.js'),
          'http': path.resolve(__dirname, './src/stubs/index.js'),
          'https': path.resolve(__dirname, './src/stubs/index.js'),
          'fs': path.resolve(__dirname, './src/stubs/index.js'),
          'path': path.resolve(__dirname, './src/stubs/index.js'),
          'vuelidate': path.resolve(__dirname, './node_modules/@vuelidate/core')
        };
        cfg.module.rules.forEach(rule => {
          if (rule.oneOf) {
            rule.oneOf.forEach(oneOfRule => {
              if (oneOfRule.use) {
                oneOfRule.use.forEach(loader => {
                  if (loader.loader && loader.loader.includes('sass-loader')) {
                    loader.options = {
                      ...loader.options,
                      api: 'legacy'
                    };
                  }
                });
              }
            });
          }
        });
      }
    },
    devServer: { port: 8081, open: true },
    framework: {
      plugins: ['Notify', 'Dialog', 'Loading', 'LocalStorage', 'SessionStorage']
    }
  };
});
