#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]

> This is a cute little Node.js library for generating MCPE server banners. It is part of a new lean backend for http://banner.mcpe.me.

## Install

### CLI
```sh
$ npm i -g mcpe-banners
```

### API
```sh
$ npm install --save mcpe-banners
```



## Usage

### CLI
```sh
$ mcpe-banners --address=sg.lbsg.net --port=19132 > /path/to/my/banner.png
```

### API
```js
var mcpebanners = require('mcpe-banners');

mcpebanners('sg.lbsg.net', 19132, function(err, stream) {
    var writeStream = fs.createWriteStream('/path/to/my/banner.png');
    stream.pipe(writeStream);
});
```


## License
Not yet licensed.


[npm-image]: https://badge.fury.io/js/mcpe-banners.svg
[npm-url]: https://npmjs.org/package/mcpe-banners
[travis-image]: https://travis-ci.org/Falkirks/mcpe-banners.svg?branch=master
[travis-url]: https://travis-ci.org/Falkirks/mcpe-banners
[daviddm-image]: https://david-dm.org/Falkirks/mcpe-banners.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/Falkirks/mcpe-banners


