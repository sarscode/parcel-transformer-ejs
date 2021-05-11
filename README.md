# parcel-transformer-ejs

Parcel v2 transformer plugin for EJS.

## Installation

```sh
npm i -D parcel-transformer-ejs
```

## Configuration

```json
{
  "extends": ["@parcel/config-default"],
  "transformers": {
    "*.ejs": ["parcel-transformer-ejs"]
  }
}
```

Reference [Parcel plugin configuration](https://v2.parceljs.org/configuration/plugin-configuration/)

## Customization

You can add custom options for ejs templating engine using a `.ejsrc`, `.ejsrc.js` or `ejs.config.js` file.

### Example

For example, you can set local variables using `.ejsrc`.

```json
{
  "locals": {
    "foo": "bar"
  }
}
```

For more information on customization options, see [EJS Options Documentation](https://ejs.co/#docs)

## License

MIT
