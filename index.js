'use strict';
var gm = require('gm').subClass({imageMagick: true});
var mcpeping = require('mcpe-ping');
var merge = require('merge');
var Handlebars = require('handlebars');
module.exports = function (address, port, style, cb) {
  if (typeof style == "function" && cb == null) {
    cb = style;
    style = null;
  }
  if (style == null) {
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
      ]
    }
  }
  mcpeping(address, port, function (err, res) {
    if (err) {
      res.offline = true;
    }
    else {
      res.online = true;
      res.cleanName = res.name.replace(/\xA7[0-9A-FK-OR]/ig, '');
    }
    var render = gm(style.image);
    for(var i = 0; i < style.text.length; i++){
      var content = Handlebars.compile(style.text[i].content);
      render
        .font(style.font, style.text[i].size)
        .fill(style.text[i].color)
        .drawText(style.text[i].x, style.text[i].y, content(res));
    }
    cb(null, render.stream());
  }, 5000);
};
