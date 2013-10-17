/**
 * Module dependencies.
 */

var app = require('..');
var d3 = require('d3');
var css = require('computedStyle');
var viewport = require('viewport');

function d3NormalizedStacked() {
  return {
    link: function($scope, elem, attr) {
      var x, y, xAxis, yAxis, line, data, yLabel;
      var width = 0;
      var height = 400;
      var margin = {top: 20, right: 100, bottom: 30, left: 40};

      var svg = d3.select(elem[0]).append('svg');
      var g = svg.append('g');

      g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")");

      g.append("g")
        .attr("class", "y axis");

      var color = d3.scale.category20c();

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
          .orient("left")
          .tickFormat(d3.format(".0%"));

        svg
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom);

        g
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        render();
      }

      function render() {
        if (!width || !data) return;

        x.domain(d3.extent(data, function(d) { return d.x; }));

        g.select('.x')
          .call(xAxis);

        g.select(".y")
          .call(yAxis);

        var group = g.selectAll('.group')
            .data(data)
          .enter().append('g')
            .attr('class', 'group')
            .attr('transform', function(d) { return 'translate(' + x(d.x) + ',0)'; });

        group.selectAll('rect')
            .data(function(d) { return d.points; })
          .enter().append('rect')
            .attr('width', Math.floor(width / data.length))
            .attr('y', function(d) { return y(d.y1); })
            .attr('height', function(d) { return y(d.y0) - y(d.y1); })
            .style('fill', function(d) { return color(d.name); });
      }

      $scope.$watch(attr.d3NormalizedStacked, function(newData) {
        if (!newData) return;

        yLabel = newData.yLabel;
        color.domain(newData.groups);

        data = newData.data.map(function(d) {
          var y0 = 0;
          var newD = {
            x: new Date(d.x * 1000),
            y: d.y,
            points: color.domain().map(function(name, i) { return {name: name, y0: y0, y1: y0 += d.y[i]}; })
          };
          newD.points.forEach(function(d) { d.y0 /= y0; d.y1 /= y0; });
          return newD;
        });

        render();
      }, true);
    }
  };
}

app.directive('d3NormalizedStacked', [
  d3NormalizedStacked
]);

exports = module.exports = 'd3NormalizedStacked';
