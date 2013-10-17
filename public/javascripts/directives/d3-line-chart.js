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
      var x, y, xAxis, yAxis, line, data, yLabel, group;
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
          .orient("left");

        line = d3.svg.line()
          .interpolate("basis")
          .x(function(d) { return x(d.x); })
          .y(function(d) { return y(d.y); });

        svg
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom);

        g
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        group = g.selectAll('.group')
            .data([])
          .enter().append('g')
            .attr('class', 'group');

        group.append('path')
          .attr('class', 'line')
          .attr('d', function(d) { return line(d.values); })
          .style('stroke', function(d) { return color(d.name); });

        render();
      }

      function render() {
        if (!width || !data) return;

        var groups = color.domain().map(function(name, i) {
          return {
            name: name,
            values: data.map(function(d) {
              return {x: d.x, y: d.y[i]};
            })
          };
        });

        x.domain(d3.extent(data, function(d) { return d.x; }));

        y.domain([
          d3.min(groups, function(g) { return d3.min(g.values, function(v) { return v.y; }); }),
          d3.max(groups, function(g) { return d3.max(g.values, function(v) { return v.y; }); })
        ]);

        g.select('.x')
          .call(xAxis);

        g.select(".y")
          .call(yAxis)
          .select("text")
          .text(yLabel);

        d3.selectAll('.group')
          .data(groups)
          .transition()
            .duration(2500);

        if (groups.length === 1) return;

        group.append('text')
          .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
          .attr('transform', function(d) { return 'translate(' + x(d.value.x) + ',' + y(d.value.y) + ')'; })
          .attr('x', 3)
          .attr('dy', '.35em')
          .text(function(d) { return d.name; });
      }

      $scope.$watch(attr.d3LineChart, function(newData) {
        if (!newData) return;

        yLabel = newData.yLabel;
        color.domain(newData.groups);

        data = newData.data.map(function(d) {
          return {
            x: new Date(d.x * 1000),
            y: typeof d.y === 'number' ? [d.y] : d.y
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
