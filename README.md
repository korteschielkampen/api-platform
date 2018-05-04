# Integration platform for Korteschiel Kampen

### Install
```sh
npm install
```


## Development
```sh
npm run develop
npm run develop:lambda
```

## Build
You can build the project very easily by running:

```sh
npm run build
```

## Deployment

Deployment is done by webhook and Netlify CI, manual can be done by running:

```sh
gatsby build && sls deploy
```
