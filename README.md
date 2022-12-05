# parcel-transformer-ejs

Parcel v2 transformer plugin for EJS.

## Installation

```sh
npm i -D parcel-transformer-ejs@0.2.1
```
> PS: v1.0.0 is currently broken. Please use v0.2.1 pending to a fix.

## Configuration

```json
{
  "extends": ["@parcel/config-default"],
  "transformers": {
    "*.ejs": ["parcel-transformer-ejs"]
  }
}
```

Reference [Parcel plugin configuration](https://parceljs.org/features/plugins/)

## Customization

You can add custom options for ejs templating engine using a `.ejsrc`, `.ejsrc.json`, `.ejsrc.js` or `ejs.config.js` file.

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
