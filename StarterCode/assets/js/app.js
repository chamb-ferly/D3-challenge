// @TODO: YOUR CODE HERE!

// Define SVG area dimensions
var svgWidth = 800;
var svgHeight = 400;

// Define the chart's margins as an object
var margin = {
  top: 20,
  right: 30,
  bottom: 60,
  left: 60
};

// Define dimensions of the chart area
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3.select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and down to adhere
// to the margins set in the "chartMargin" object.
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Load data from hours-of-tv-watched.csv
d3.csv("assets/data/data.csv").then(function(usData) {

  // Print the tvData
  console.log(usData);

// Define variables
  usData.forEach(function(data) {
    data.obesity = +data.obesity
    data.income = +data.income;
  })

  // x and y scales
  var xScale = d3.scaleLinear()
    .domain(d3.extent(usData, d => d.income))
    .range([0, width]);

  var yScale = d3.scaleLinear()
    .domain(d3.extent(usData, d => d.obesity))
    .range([height, 0]);

  // axes
  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale);

  // append x and y axes to chart
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);

  chartGroup.append("g")
    .call(yAxis);

  // circles
  var circleGroup = chartGroup.selectAll("circle")
    .data(usData)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.income))
    .attr("cy", d => yScale(d.obesity))
    .attr("r", "15")
    .attr("fill", "#fcba03")
    .attr("opacity", "0.3");

  // state abbr inside circle
  var label = chartGroup.selectAll("null")
    .data(usData)
    .enter()
    .append("text");

    label.attr("x", function(d) {
      return xScale(d.income);
    })
      .attr("y", function(d) {
        return yScale(d.obesity);
      })
      .text(function(d) {
        return d.abbr;
      })
      .attr("font-size", "12px")
      .attr("text-anchor", "c")
      .attr("fill", "#fc7b03");

    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -50)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Obesity (%)");
    
    chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height +  40})`)
    .style("text-anchor", "middle")
    .text("Median Income ($)");
    
});
