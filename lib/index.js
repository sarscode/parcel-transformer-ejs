const path = require('path');

const ejs = require('ejs');
const { Transformer } = require('@parcel/plugin');

module.exports = new Transformer({
  async loadConfig({ config }) {
    const configFile = await config.getConfig([
      '.ejsrc',
      '.ejsrc.js',
      'ejs.config.js',
    ]);

    if (configFile) {
      if (path.extname(configFile.filePath) === '.js') {
        if ('function' === typeof config.shouldInvalidateOnStartup)
        {
          // old way
          config.shouldInvalidateOnStartup();
        }
        else
        {
          // new way
          config.invalidateOnStartup();
        }
      }
      config.setResult(configFile.contents);
    }

    return config;
  },
  async transform({ asset, config }) {
    const ejsConfig = config || {};
    const template = await asset.getCode();
    const compiled = ejs.compile(template, {
      compileDebug: false,
      filename: asset.filePath,
      ...ejsConfig,
    });

    if (compiled.dependencies) {
      for (let filePath of compiled.dependencies) {
        await asset.addIncludedFile(filePath);
      }
    }

    asset.type = 'html';
    asset.setCode(compiled(ejsConfig.locals));
    return [asset];
  },
});
