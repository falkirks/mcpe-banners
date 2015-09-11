#!/usr/bin/env node
'use strict';
var meow = require('meow');
var mcpeBanners = require('./');

var cli = meow({
  help: [
    'Usage',
    '  mcpe-banners --address=<address> --port=<port>',
    '',
    'Example',
    '  mcpe-banners --address=sg.lbsg.net'
  ].join('\n')
});

mcpeBanners(cli.flags.address, cli.flags.port || 19132, function(err, pipe){
    pipe.pipe(process.stdout);
});
