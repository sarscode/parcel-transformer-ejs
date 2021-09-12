const ejs = require('ejs');
const { Transformer } = require('@parcel/plugin');

module.exports = new Transformer({
  async loadConfig({ config }) {
    const { contents, filePath } =
      (await config.getConfig(['.ejsrc', '.ejsrc.js', 'ejs.config.js'])) || {};

    if (contents) {
      if (filePath.endsWith('.js')) {
        config.invalidateOnStartup();
      }
      config.invalidateOnFileChange(filePath);
    } else {
      config.invalidateOnFileCreate({
        fileName: '.ejsrc' || '.ejsrc.js' || 'ejs.config.js',
        aboveFilePath: config.searchPath,
      });
    }

    return contents;
  },
  async transform({ asset, config }) {
    const ejsConfig = config || {};
    const source = await asset.getCode();
    const compiled = ejs.compile(source, {
      compileDebug: false,
      filename: asset.filePath,
      ...ejsConfig,
    });

    const includes = [];

    const { resolveInclude } = ejs;

    ejs.resolveInclude = (...args) => {
      const include = resolveInclude(...args);
      includes.push(include);
      return include;
    };

    asset.type = 'html';
    asset.setCode(compiled(ejsConfig));

    for (let include of includes) {
      await asset.invalidateOnFileChange(include);
    }

    return [asset];
  },
});
