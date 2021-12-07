var margin = { top: 30, right: 30, bottom: 70, left: 60 },
  width = 1000 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

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

// Initialize the Y axis
var y = d3.scaleLinear()
  .range([height, 0]);
var yAxis = s1.append("g")
  .attr("class", "myYaxis")



function update(selectedVar) {

  d3.csv("./test.csv").then(function (dataset) {
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
        return e.Frequency > 10
      });

      data = data.sort((a, b) => a.Value.localeCompare(b.Value))

      if (a == 'Ages') {
        data.shift();
        data.unshift(data.pop())
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

// var margin = { top: 30, right: 30, bottom: 70, left: 60 },
//   width = 1000 - margin.left - margin.right,
//   height = 500 - margin.top - margin.bottom;

// // append the svg object to the body of the page
// var svg = d3.select("#bar")
//   .append("svg")
//   .attr("width", width + margin.left + margin.right)
//   .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//   .attr("transform",
//     "translate(" + margin.left + "," + margin.top + ")");



// d3.csv("./test.csv").then(function (dataset) {

//   //Fetch data 
//   var frequency = dataset.reduce(function (freq, current) {
//     var currentCompany = current.State;
//     if (!freq.hasOwnProperty(currentCompany)) freq[currentCompany] = 0;
//     freq[currentCompany]++;
//     return freq;
//   }, {});

//   var chartData = Object.keys(frequency).map(function (company) {
//     var value = frequency[company];
//     return {
//       Value: company,
//       Frequency: value
//     }
//   });

//   function makeData(a) {
//     var fre = dataset.reduce(function (freq, current) {
//       var currCompany = current[a];
//       if (!freq.hasOwnProperty(currCompany)) freq[currCompany] = 0;
//       freq[currCompany]++;
//       return freq;
//     }, {});

//     var data = Object.keys(fre).map(function (company) {
//       var val = fre[company];
//       return {
//         Value: company,
//         Frequency: val
//       }
//     });

//     data = data.filter(function (e) {
//       return e.Frequency > 10
//     });

//     data = data.sort((a, b) => a.Value.localeCompare(b.Value))

//     if (a == 'Ages') {
//       data.shift();
//       data.unshift(data.pop())
//     }

//     return data
//   }

//   var raceData = makeData("Race")
//   var agesData = makeData("Ages")
//   var stateData = makeData("State")

//   chartData.splice(-1)

//   chartData.sort((a, b) => a.Value.localeCompare(b.Value))

//   var x = d3.scaleBand()
//     .range([0, width])
//     .domain(chartData.map(function (d) { return d.Value; }))
//     .padding(0.2);
//   svg.append("g")
//     .attr("transform", "translate(0," + height + ")")
//     .call(d3.axisBottom(x))
//     .selectAll("text")
//     .attr("transform", "translate(-10,10)rotate(-90)")
//     .style("text-anchor", "end");

//   // Add Y axis
//   var y = d3.scaleLinear()
//     .domain([0, 5500])
//     .range([height, 0]);
//   svg.append("g")
//     .call(d3.axisLeft(y));

//   var tooltip = d3.select("#bar")
//     .append("div")
//     .style("opacity", 0)
//     .attr("class", "tooltip")
//     .style("background-color", "white")
//     .style("border", "solid")
//     .style("border-width", "1px")
//     .style("border-radius", "5px")
//     .style("padding", "10px")
//     .style('position', 'absolute')


//   var mouseover = function (d) {
//     tooltip
//       .style("opacity", 1)
//     d3.select(this)
//       .style("stroke", "black")
//       .style("opacity", 1)
//   }

//   var mousemove = function (d) {
//     tooltip
//       .style("left", (d3.event.pageX + 10) + "px")
//       .style("top", (d3.event.pageY - 10) + "px")
//       .style("display", "inline-block")
//       .html("State: " + d.Value + "<br> Fatal Encounters: " + d.Frequency)
//   }

//   var mouseleave = function (d) {
//     tooltip
//       .style("display", "none")
//     d3.select(this)
//       .style("stroke", "none")
//   }
//   // Bars
//   svg.selectAll("mybar")
//     .data(chartData)
//     .enter()
//     .append("rect")
//     .attr("x", function (d) { return x(d.Value); })
//     .attr("width", x.bandwidth())
//     .attr("fill", "#69b3a2")
//     .attr("height", function (d) { return height - y(0); })
//     .attr("y", function (d) { return y(0); })
//     .on("mouseover", mouseover)
//     .on("mousemove", mousemove)
//     .on("mouseleave", mouseleave)

//   svg.selectAll("rect")
//     .transition()
//     .duration(800)
//     .attr("y", function (d) { return y(d.Frequency); })
//     .attr("height", function (d) { return height - y(d.Frequency); })
//     .delay(function (d, i) { return (i * 100) })

//   function updateChart(selectedGroup) {
//     var filteredData = makeData(selectedGroup)

//     var bars = svg.selectAll('.bar')
//       .data(filteredData)

//     var barEnter = bars.enter()
//       .append('g')
//       .attr('class', 'bar')

//     barEnter.merge(bars)
//   }
//   // Listen to the slider?
//   d3.select("#barSort").on("change", function (d) {
//     selectedGroup = this.value
//     updateChart(selectedGroup)
//   })
//   // Three function that change the tooltip when user hover / move / leave a cell

// })
