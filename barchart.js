var margin = { top: 30, right: 30, bottom: 80, left: 60 },
  width = 1000 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
var s1 = d3.select("#bar")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleBand()
  .range([0, width])
  .padding(0.2);
var xAxis = s1.append("g")
  .attr("transform", "translate(0," + height + ")")
  .attr("class", "xAxis")

// Initialize the Y axis
var y = d3.scaleLinear()
  .range([height, 0]);
var yAxis = s1.append("g")
  .attr("class", "myYaxis")



function update(selectedVar) {

  d3.csv("./test.csv").then(function (data1) {
    var dataset = data1;
    function makeData(a) {
      var fre = dataset.reduce(function (freq, current) {
        var currCompany = current[a];
        if (!freq.hasOwnProperty(currCompany)) freq[currCompany] = 0;
        freq[currCompany]++;
        return freq;
      }, {});

      var data = Object.keys(fre).map(function (company) {
        var val = fre[company];
        return {
          Value: company,
          Frequency: val
        }
      });

      data = data.filter(function (e) {
        return e.Frequency > 30
      });

      data = data.sort((a, b) => a.Value.localeCompare(b.Value))

      if (a == 'Ages') {
        data.shift();
        data.unshift(data.pop())
      } else if (a == 'Gender') {
        data.shift();
      }

      return data
    }

    var data = makeData(selectedVar)

    // Update the X axis
    x.domain(data.map(function (d) { return d.Value; }))
    xAxis.transition().duration(800).call(d3.axisBottom(x))

    // Update the Y axis
    y.domain([0, d3.max(data, function (d) { return d.Frequency })]);
    yAxis.transition().duration(1000).call(d3.axisLeft(y));

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
      .style("height", "auto")
      .style("width", "auto")

    var mouseover = function (d) {
      tooltip
        .style("opacity", 1)
      d3.select(this)
        .style("stroke", "black")
        .style("opacity", 1)
    }

    var mousemove = function (d) {
      tooltip
        .style("left", (d3.event.pageX + 10) + "px")
        .style("top", (d3.event.pageY - 10) + "px")
        .style("display", "inline-block")
        .html(selectedVar + ": " + d.Value + "<br> Fatal Encounters: " + d.Frequency)
    }

    var mouseleave = function (d) {
      tooltip
        .style("display", "none")
      d3.select(this)
        .style("stroke", "none")
    }
    // Create the u variable
    s1.append("text")
      .attr('class', 'xlabel')
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", height + margin.top + 20)

    s1.append("text")
      .attr('class', 'ylabel')
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 20)
      .attr("x", -margin.top - height / 2)
      .text("# of Fatal Encounters")

    var u = s1.selectAll("rect")
      .data(data)

    u
      .enter()
      .append("rect")
      // Add a new rect for each new elements
      .merge(u)

      // get the already existing elements as well
      .attr("x", function (d) { return x(d.Value); })

      .attr("width", x.bandwidth())
      .attr("fill", "#FEB062")
      .attr("height", function (d) { return height - y(0); })
      .attr("y", function (d) { return y(0); })


    d3.selectAll('rect')
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
      .transition()
      .duration(800)
      .attr("y", function (d) { return y(d.Frequency); })
      .attr("height", function (d) { return height - y(d.Frequency); })
      .delay(function (d, i) { return (i * 100) })

    d3.select('.xlabel')
      .text(selectedVar)

    // If less group in the new dataset, I delete the ones not in use anymore
    u
      .exit()
      .remove()


    // Initialize the plot with the first dataset

  })


}

update('Race')
