const ejs = require('ejs');
const { Transformer } = require('@parcel/plugin');

module.exports = new Transformer({
  async loadConfig({ config }) {
    const configFileNames = [
      '.ejsrc',
      '.ejsrc.json',
      '.ejsrc.js',
      'ejs.config.js',
    ];
    const { contents, filePath } =
      (await config.getConfig(configFileNames)) || {};

    if (contents) {
      if (filePath.endsWith('.js')) {
        config.invalidateOnStartup();
      }
      config.invalidateOnFileChange(filePath);
    } else {
      // no config file found - invalidate whenever any EJS config file is created
      configFileNames.forEach((configFileName) => {
        config.invalidateOnFileCreate({
          fileName: configFileName,
          aboveFilePath: config.searchPath,
        });
      });
    }

    return contents;
  },
  async transform({ asset, config }) {
    const includes = [];

    const ejsConfig = config || {};
    const source = await asset.getCode();
    const compiled = ejs.compile(source, {
      compileDebug: false,
      filename: asset.filePath,
      includes,
      includer: (originalPath, parsedPath) => {
        includes.push(parsedPath);
        return {
          filename: parsedPath,
        };
      },
      ...ejsConfig,
    });

    asset.type = 'html';
    asset.setCode(compiled(ejsConfig));

    for (let include of includes) {
      await asset.invalidateOnFileChange(include);
    }

    return [asset];
  },
});
