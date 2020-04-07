// @TODO: YOUR CODE HERE!
// -----------------------CHART DIMENSIONS--------------------------
// Define SVG area dimensions
var svgWidth = 1000;
var svgHeight = 600;

// Define the chart's margins as an object
var margin = {
  top: 20,
  right: 30,
  bottom: 120,
  left: 100
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

// --------------------------DATA CHANGE EVENT----------------------
// Initial params defualt chart
var chosenXaxis = "income";
var chosenYaxis = "obesity";

// -------X SCALE & AXIS------------
// data change function per user click input
function xScale(usData, chosenXaxis) {
  var xLinearScale = d3.scaleLinear()
    .domain(d3.extent(usData, d => d[chosenXaxis]))
    .range([0, width]);
  return xLinearScale;
}

// update xAxis
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);
  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);
  return xAxis;
}

// -------Y SCALE & AXIS------------
// data change function per user click input
function yScale(usData, chosenYaxis) {
  var yLinearScale = d3.scaleLinear()
    .domain(d3.extent(usData, d => d[chosenYaxis]))
    .range([height, 0]);
  return yLinearScale;
}

// update yAxis
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);
  yAxis.transition()
    .duration(1000)
    .call(leftAxis);
  return yAxis;
}

// -----------CIRCLES-------------
function renderCircles(circlesGroup, newXScale, newYScale, chosenXaxis, chosenYaxis) {
  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXaxis]))
    .attr("cy", d => newYScale(d[chosenYaxis]));
  return circlesGroup;
}

// function renderCirclesLabel(circlesLabel, newXScale, chosenXaxis, newYScale, chosenYaxis) {
//   circlesLabel.transition()
//     .duration(1000)
//     .attr("cx", d => newXScale(d[chosenXaxis]))
//     .attr("cy", d => newYScale(d[chosenYaxis]));
//   return circlesLabel;
// }
// function renderCircles(circlesGroup, newYScale, chosenYaxis) {
//   circlesGroup.transition()
//     .duration(1000)
//     .attr("cx", d => newYScale(d[chosenYaxis]));
//   return circlesGroup;
// }
// ------DATA POINT LABELS TOOLTIP-----
function updateToolTip(chosenXaxis, chosenYaxis, circlesGroup) {
  var xlabel;
  if (chosenXaxis === "income") {
    xlabel = "Household Income (Median): $";
  }
  else if (chosenXaxis === "poverty") {
    xlabel = "In Poverty: ";
  }
  else if (chosenXaxis === "age") {
    xlabel = "Age (Median): ";
  }
  var ylabel;
  if (chosenYaxis === "obesity") {
    ylabel = "Obesity: ";
  }
  else if (chosenYaxis === "smokes") {
    ylabel = "Smokes: ";
  }
  else if (chosenYaxis === "healthcare") {
    ylabel = "Lacks Healthcare: ";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${xlabel} ${d[chosenXaxis]}<br>${ylabel} ${d[chosenYaxis]}`);
    });
  
  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// ---------------------------DATA-------------------------------
// Load data from hours-of-tv-watched.csv
d3.csv("assets/data/data.csv").then(function(usData) {

  // Print the tvData
  console.log(usData);

// Define variables
  usData.forEach(function(data) {
    data.obesity = +data.obesity
    data.income = +data.income
    data.poverty = +data.poverty
    data.healthcare = +data.healthcare
    data.age = +data.age
    data.smokes = +data.smokes;
    // data.state = +data.state;
  })
// --------------------------SCALING-----------------------------
  // x and y scales
  var xLinearScale = xScale(usData, chosenXaxis)
  var yLinearScale = yScale(usData, chosenYaxis)

  // axes
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x and y axes to chart
  var xAxis = chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  var yAxis = chartGroup.append("g")
    // .attr("transform", `translate(0, ${width})`)
    .call(leftAxis);

// ----------------------CIRCLES GROUP-------------------------- 
  // circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(usData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXaxis]))
    .attr("cy", d => yLinearScale(d[chosenYaxis]))
    .attr("r", 15)
    .attr("fill", "#fcba03")
    .attr("opacity", "0.3");

  // state abbr inside circle
  var circlesLabel = chartGroup.selectAll("null")
    .data(usData)
    .enter()
    .append("text")

    circlesLabel
      .attr("x", function(d) {
        return xLinearScale(d[chosenXaxis]);
      })
      .attr("y", function(d) {
        return yLinearScale(d[chosenYaxis]);
      })
      .text(function(d) {
        return d.abbr;
      })
      .attr("font-size", "14px")
      .attr("text-anchor", "middle")
      .attr("fill", "#fc7b03");

// ----------------------AXES LABEL GROUP-------------------------
  var xlabelGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

// X Labels
  var incomeLabel = xlabelGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "income")
    .classed("active", true)
    .text("Median Income ($)");
  
  var povertyLabel = xlabelGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "poverty")
    .classed("inactive", true)
    .text("In Poverty (%)");
  
  var ageLabel = xlabelGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "age")
    .classed("inactive", true)
    .text("Age (Median)");

// Y Labels
  var ylabelGroup = chartGroup.append("g")
    .attr("transform", "rotate(-90)");

  var obesityLabel = ylabelGroup.append("text")
    .attr("x", -200)
    .attr("y", -40)
    .attr("value", "obesity")
    .classed("active", true)
    .text("Obesity (%)");
  
  var smokesLabel = ylabelGroup.append("text")
    .attr("x", -200)
    .attr("y", -60)
    .attr("value", "smokes")
    .classed("inactive", true)
    .text("Smokes (%)");
  
  var healthcareLabel = ylabelGroup.append("text")
    .attr("x", -200)
    .attr("y", -80)
    .attr("value", "healthcare")
    .classed("inactive", true)
    .text("Lacks Healthcare (%)");


// -------------------CHART GROUP APPEND - default---------------
    // chartGroup.append("text")
    // .attr("transform", "rotate(-90)")
    // .attr("y", -50)
    // .attr("x", 0 - (height / 2))
    // .attr("dy", "1em")
    // .style("text-anchor", "middle")
    // .text("Obesity (%)");
    
    // chartGroup.append("text")
    // .attr("transform", `translate(${width / 2}, ${height +  40})`)
    // .style("text-anchor", "middle")
    // .text("Median Income ($)");

    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXaxis, chosenYaxis, circlesGroup);

// --------------------X EVENT LISTENER---------------------------
xlabelGroup.selectAll("text")
  .on("click", function() {
    var value = d3.select(this).attr("value");
      chosenXaxis = value; 
      // console.log(chosenXaxis);
      xLinearScale = xScale(usData, chosenXaxis);
      xAxis = renderXAxes(xLinearScale, xAxis);
      circlesGroup = renderCircles(circlesGroup, circlesLabel, xLinearScale, chosenXaxis);
      circlesGroup = updateToolTip(chosenXaxis, chosenYaxis, circlesGroup);
      // circlesLabel = renderCircleLabels(circlesLabel, newXScale, chosenXaxis);
      // circlesLabel = updateToolTip(chosenXaxis, circlesLabel);

      // change class to change bold text on selection
      // -----------X LABELS--------------
      if (chosenXaxis === "income") {
        incomeLabel
          .classed("active", true)
          .classed("inactive", false);
        povertyLabel
          .classed("active", false)
          .classed("inactive", true);
        ageLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else if (chosenXaxis === "poverty"){
        povertyLabel
          .classed("active", true)
          .classed("inactive", false);
        incomeLabel
          .classed("active", false)
          .classed("inactive", true);
        ageLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else if (chosenXaxis === "age"){
        ageLabel
          .classed("active", true)
          .classed("inactive", false);
        incomeLabel
          .classed("active", false)
          .classed("inactive", true);
        povertyLabel
          .classed("active", false)
          .classed("inactive", true);
      }
    
  })
// --------------------Y EVENT LISTENER---------------------------
ylabelGroup.selectAll("text")
  .on("click", function() {
    var value = d3.select(this).attr("value");
      chosenYaxis = value; 
      // console.log(chosenXaxis);
      yLinearScale = yScale(usData, chosenYaxis);
      yAxis = renderYAxes(yLinearScale, yAxis);
      circlesGroup = renderCircles(circlesGroup, circlesLabel, yLinearScale, chosenYaxis);
      circlesGroup = updateToolTip(chosenXaxis, chosenYaxis, circlesGroup);
      // circlesLabel = renderCircleLabels(circlesLabel, newYScale, chosenYaxis);
      // circlesLabel = updateToolTip(chosenYaxis, circlesLabel);

      // -----------Y LABELS--------------
      if (chosenYaxis === "obesity") {
        obesityLabel
          .classed("active", true)
          .classed("inactive", false);
        smokesLabel
          .classed("active", false)
          .classed("inactive", true);
        healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else if (chosenYaxis === "smokes"){
        smokesLabel
          .classed("active", true)
          .classed("inactive", false);
        obesityLabel
          .classed("active", false)
          .classed("inactive", true);
        healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else if (chosenYaxis === "healthcare"){
        healthcareLabel
          .classed("active", true)
          .classed("inactive", false);
        obesityLabel
          .classed("active", false)
          .classed("inactive", true);
        smokesLabel
          .classed("active", false)
          .classed("inactive", true);
      }
    
  })
});
