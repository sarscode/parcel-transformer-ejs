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
