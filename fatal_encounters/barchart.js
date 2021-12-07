var margin = { top: 30, right: 30, bottom: 70, left: 60 },
  width = 1000 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#bar")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");



d3.csv("./test.csv").then(function (dataset) {

  //Fetch data 

  var frequency = dataset.reduce(function (freq, current) {
    var currentCompany = current.State;
    if (!freq.hasOwnProperty(currentCompany)) freq[currentCompany] = 0;
    freq[currentCompany]++;
    return freq;
  }, {});

  var chartData = Object.keys(frequency).map(function (company) {
    var value = frequency[company];
    return {
      Value: company,
      Frequency: value
    }
  });

  chartData.splice(-1)

  chartData.sort((a, b) => a.Value.localeCompare(b.Value))

  var x = d3.scaleBand()
    .range([0, width])
    .domain(chartData.map(function (d) { return d.Value; }))
    .padding(0.2);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,10)rotate(-90)")
    .style("text-anchor", "end");

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 5500])
    .range([height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  var tooltip = d3.select("#bar")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style('position', 'absolute') 
 

    var mouseover = function(d) {
      tooltip
        .style("opacity", 1)
        d3.select(this)
        .style("stroke", "black")
        .style("opacity", 1)
    }

    var mousemove = function(d) {
      tooltip
        .style("left", (d3.event.pageX + 10) + "px")
        .style("top", (d3.event.pageY - 10 ) + "px")
        .style("display", "inline-block")
        .html("State: " + d.Value + "<br> Fatal Encounters: " + d.Frequency)
    }
    
    var mouseleave = function(d) {
      tooltip
        .style("display","none")
      d3.select(this)
        .style("stroke", "none")
    }
  // Bars
  svg.selectAll("mybar")
    .data(chartData)
    .enter()
    .append("rect")
    .attr("x", function (d) { return x(d.Value); })
    .attr("width", x.bandwidth())
    .attr("fill", "#69b3a2")
    .attr("height", function (d) { return height - y(0); })
    .attr("y", function (d) { return y(0); })
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)

  svg.selectAll("rect")
    .transition()
    .duration(800)
    .attr("y", function (d) { return y(d.Frequency); })
    .attr("height", function (d) { return height - y(d.Frequency); })
    .delay(function (d, i) { 
      // console.log(i); 
      return (i * 100) 
    })

    function updateChart(selectedGroup) {
      // recompute density estimation
      if (selectedGroup == "alpha") {
      chartData.sort((a, b) => a.Value.localeCompare(b.Value))
    } else if (selectedGroup == "desc") {
      chartData.sort((a, b) => a.Frequency.localeCompare(b.Frequency))
    } else {
      chartData.sort((a, b) => b.Frequency.localeCompare(a.Frequency))}
    
    svg.datum(chartData)
    .transition()
    .duration(800)
    }
  
      // update the chart
  
    // Listen to the slider?
    d3.select("#barSort").on("change", function(d){
      selectedGroup = this.value
      updateChart(selectedGroup)
    })
  // Three function that change the tooltip when user hover / move / leave a cell

})
