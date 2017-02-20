'use strict';
var gm = require('gm').subClass({imageMagick: true});
var mcpeping = require('mcpe-ping');
var Handlebars = require('handlebars');
var CACHE_TTL = 20;

var cachedResponses = {};
function getCachedResponse(address, port){
  if(cachedResponses[address + ":" + port] != null){
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
      font: __dirname + "/resources/font.ttf",
      text: [
        {
          size: 13,
          x: 10,
          y: 50,
          color: "#ffffff",
          content: "{{rinfo.address}}"
        },
        {
          size: 13,
          x: 10,
          y: 70,
          color: "#ffffff",
          content: "{{rinfo.port}}"
        },
        {
          size: 13,
          x: 10,
          y: 70,
          color: "#ffffff",
          content: "{{rinfo.port}}"
        },
        {
          size: 13,
          x: 10,
          y: 90,
          color: "#FF0000",
          content: "{{#if offline}}Offline{{/if}}"
        },
        {
          size: 23,
          x: 10,
          y: 30,
          color: "#FFFFFF",
          content: "{{#if name}}{{cleanName}}{{else}}Untitled{{/if}}"
        },
        {
          size: 13,
          x: 10,
          y: 90,
          color: "#7FFF00",
          content: "{{#if online}}{{currentPlayers}}/{{maxPlayers}}{{/if}}"
        }
      ],
      outputFormat: "buffer"
    };
  }
  var res = getCachedResponse(address, port);
  if(res !== null){
    var render = gm(style.image);
    for(var i = 0; i < style.text.length; i++){
      var content = Handlebars.compile(style.text[i].content);
      render
        .font(style.font, style.text[i].size)
        .fill(style.text[i].color)
        .drawText(style.text[i].x, style.text[i].y, content(res));
    }
    if(style.outputFormat == "stream"){
      cb(null, render.stream());
    }
    else {
      render.toBuffer("PNG", function (err, buffer) {
        cb(err, buffer);
      });
    }
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
      var render = gm(style.image);
      for (var i = 0; i < style.text.length; i++) {
        var content = Handlebars.compile(style.text[i].content);
        render
          .font(style.font, style.text[i].size)
          .fill(style.text[i].color)
          .drawText(style.text[i].x, style.text[i].y, content(res));
      }
      if (style.outputFormat == "stream") {
        cb(null, render.stream());
      }
      else {
        render.toBuffer("PNG", function (err, buffer) {
          cb(err, buffer);
        });
      }
    }, 5000);
  }
};
