# butler

## Local Development

[Gist](https://gist.github.com/JackieLiPera/4533b41c6600b65d3eab1db9c8b6e98b)

```bash
npm run start
```

### Errors and Solutions

```bash
ERROR  [runtime not ready]: Error: Component auth has not been registered yet, js engine: hermes
```

This is considered a [red-herring](https://docs.expo.dev/troubleshooting/application-has-not-been-registered/) and points to an error being thrown in the app before it's able to register itself.

The fixed that worked was adding a `metro.config.js` file from the [Expo docs](https://docs.expo.dev/guides/using-firebase/)
