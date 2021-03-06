# OpenAnolis

Source for the OpenAnolis website <OpenAnolis.org>.

## Editing and building

You can use the local environment or docker to build and serve the site. We recommend you to use docker.

### Local

Before you begin, you should install the follow components:


- [node v8.9.4+](https://nodejs.org/en/)
- [npm 6.10.0+](https://www.npmjs.com/get-npm)
- [hugo v0.55.5 extended](https://github.com/gohugoio/hugo/releases).

```bash
./scripts/install-dependency.sh
./scripts/build-site.sh
hugo server
```

Run the site locally with `hugo server`, you will see the site running on <http://localhost:1313>.

### Docker

You need to install docker 18.09.2+ first.

```bash
make install
make build
make serve
```

Edit markdown files, you will see the pages changing in real time.

Read the [wiki](https://github.com/OpenAnolis/OpenAnolis.org/wiki) to see how to contribute to the OpenAnolis website.
