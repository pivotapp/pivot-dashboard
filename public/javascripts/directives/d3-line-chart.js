/**
 * Module dependencies.
 */

var app = require('..');
var d3 = require('d3');
var css = require('computedStyle');
var viewport = require('viewport');

function d3LineChart() {
  return {
    link: function($scope, elem, attr) {
      var x, y, xAxis, yAxis, line, data;
      var width = 0;
      var height = 400;
      var margin = {top: 20, right: 20, bottom: 30, left: 50};

      var svg = d3.select(elem[0]).append('svg');
      var g = svg.append('g');

      g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")");

      g.append("g")
        .attr("class", "y axis")
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end");

      g.append('path')
        .attr("class", "line");

      var parent = elem.parent();

      function getParentWidth() {
        var left = parseInt(css(parent[0], 'padding-left'), 10) + margin.left;
        var right = parseInt(css(parent[0], 'padding-right'), 10) + margin.right;
        return parent[0].clientWidth - (left + right);
      }

      $scope.$watch(getParentWidth, function(newWidth) {
        width = newWidth;
        init();
      });

      viewport.on('resize', function() {
        width = getParentWidth();
        init();
      });

      var yLabel;
      $scope.$watch(attr.d3YLabel, function(label) {
        yLabel = label;
        render();
      });

      function init() {
        if (!width) return;
        x = d3.time.scale()
          .range([0, width]);

        y = d3.scale.linear()
          .range([height, 0]);

        xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");

        yAxis = d3.svg.axis()
          .scale(y)
          .orient("left");

        line = d3.svg.line()
          .x(function(d) { return x(d.t); })
          .y(function(d) { return y(d.v); });

        svg
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom);

        g
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        render();
      }

      function render() {
        if (!width || !data) return;

        x.domain(d3.extent(data, function(d) { return d.t; }));
        y.domain(d3.extent(data, function(d) { return d.v; }));

        g.select('.x')
          .call(xAxis);

        g.select(".y")
          .call(yAxis)
          .select("text")
          .text(yLabel);

        g.select(".line")
          .datum(data)
          .transition()
          .attr("d", line);
      }

      $scope.$watch(attr.d3LineChart, function(newData) {
        if (!newData) return;
        data = newData.map(function(d) {
          return {
            v: d.v,
            t: new Date(d.t * 1000)
          };
        });
        render();
      }, true);
    }
  };
}

app.directive('d3LineChart', [
  d3LineChart
]);

exports = module.exports = 'd3LineChart';
