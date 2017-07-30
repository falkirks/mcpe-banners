'use strict';
var Jimp = require("jimp");
var mcpeping = require('mcpe-ping');
var Handlebars = require('handlebars');
var CACHE_TTL = 20;

var cachedResponses = {};
function getCachedResponse(address, port){
  if(cachedResponses[address + ":" + port] !== undefined){
    if(cachedResponses[address + ":" + port].time+20 >= Math.floor(Date.now() / 1000)){
      return cachedResponses[address + ":" + port].data;
    }
  }
  return null;
}
function setCachedResponse(address, port, data){
  cachedResponses[address + ":" + port] = {
    time: Math.floor(Date.now() / 1000),
    data: data
  };
}
module.exports = function (address, port, style, cb) {
  if (typeof style === "function") {
    cb = style;
    style = null;
  }
  if (style === null) {
    style = {
      image: __dirname + "/resources/default.png",
      font: __dirname + "/resources/font.fnt",
      text: [
        {
          size: 13,
          x: 10,
          y: 40,
          color: "#ffffff",
          content: "{{rinfo.address}}"
        },
        {
          size: 13,
          x: 10,
          y: 60,
          color: "#ffffff",
          content: "{{rinfo.port}}"
        },
        {
          size: 13,
          x: 10,
          y: 60,
          color: "#ffffff",
          content: "{{rinfo.port}}"
        },
        {
          size: 13,
          x: 10,
          y: 80,
          color: "#FF0000",
          content: "{{#if offline}}Offline{{/if}}"
        },
        {
          size: 23,
          x: 10,
          y: 20,
          color: "#FFFFFF",
          content: "{{#if name}}{{cleanName}}{{else}}Untitled{{/if}}"
        },
        {
          size: 13,
          x: 10,
          y: 80,
          color: "#7FFF00",
          content: "{{#if online}}{{currentPlayers}}/{{maxPlayers}}{{/if}}"
        }
      ],
      outputFormat: "buffer"
    };
  }
  var res = getCachedResponse(address, port);
  if(res !== null){
    Jimp.read(style.image, function (err, image) {
      if (err){
        throw err;
      }
      Jimp.loadFont( style.font ).then(function (font) { // load font from .fnt file
        for (var i = 0; i < style.text.length; i++) {
          var content = Handlebars.compile(style.text[i].content);
          image.print(font, style.text[i].x, style.text[i].y, content(res));
        }
        if (style.outputFormat === "stream") {
          cb({'message': "Stream is not supported in jimp mode."}, null);
        }
        else {
          image.getBuffer(Jimp.MIME_PNG, function (buf) {
            cb(null, buf);
          });
        }
      });
    });
  }
  else {
    mcpeping(address, port, function (err, res) {
      if (err) {
        res = {
          hostname: address,
          port: port,
          offline: true
        };
      }
      else {
        res.online = true;
        res.cleanName = res.name.replace(/\xA7[0-9A-FK-OR]/ig, '');
        res.hostname = address;
      }
      setCachedResponse(address, port, res);

      Jimp.read(style.image, function (err, image) {
        if (err){
          throw err;
        }

        Jimp.loadFont( style.font ).then(function (font) { // load font from .fnt file
          for (var i = 0; i < style.text.length; i++) {
            var content = Handlebars.compile(style.text[i].content);
            image.print(font, style.text[i].x, style.text[i].y, content(res));
          }
          if (style.outputFormat === "stream") {
            cb({'message': "Stream is not supported in jimp mode."}, null);
          }
          else {
            image.getBuffer(Jimp.MIME_PNG, function (err, buf) {
              cb(null, buf);
            });
          }
        });


      });

    }, 5000);
  }
};
