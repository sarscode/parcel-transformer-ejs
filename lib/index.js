const path = require('path');
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
    let ejs = require('ejs');
    const ejsConfig = config || {};
    const template = await asset.getCode();
    const compiled = ejs.compile(template, {
      compileDebug: false,
      filename: asset.filePath,
      ...ejsConfig,
    });
    let includes = [];
    let origInclud = ejs.resolveInclude;

    // Spy on includes so we know when to invalidate the cache
    ejs.resolveInclude = (...args) =>
    {
      let path = origInclud(...args);
      
      includes.push(path);
      return path;
    };

    asset.type = 'html';
    asset.setCode(compiled(ejsConfig.locals));

    // Includes are not added until after the compile
    for (let filePath of includes) {
      await asset.invalidateOnFileChange(filePath);
    }

    return [asset];
  },
});
