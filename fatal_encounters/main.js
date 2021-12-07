d3.csv("./test.csv").then(function (data) {
  var markers = [];
  data.forEach(function (d) {
    d.Latitude = +d.Latitude;
    d.Longitude = +d.Longitude;
    
    // Starting with the map with fatal encounters of 2000
    if (d.Date.substring(d.Date.length - 2, d.Date.length) === "00") {
      markers.push({ "long": d.Longitude, "lat": d.Latitude })
    }

  });

  // Setting the map view to the center of the U.S
  var map = L
    .map('mapid')
    .setView([37.8, -96], 4);


  // Add a tile to the map = a background. Comes from OpenStreetmap
  L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
    maxZoom: 6,
  }).addTo(map);

  // Add a svg layer to the map
  L.svg().addTo(map);
  
  d3.select("#mapid").select("svg")
  .attr("pointer-events", "auto")
  
 

  // Select the svg area and add circles:
  var circles = d3.select("#mapid")
      .select("svg")
      .selectAll("myCircles")
      .data(markers)
      .enter()
      .append("circle")
      .attr("cx", function (d) { return map.latLngToLayerPoint([d.lat, d.long]).x })
      .attr("cy", function (d) { return map.latLngToLayerPoint([d.lat, d.long]).y })
      .attr("r", 4)
      .style("fill", "red")
      .attr("stroke", "red")
      .attr("stroke-width", .1)
      .attr("fill-opacity", .2)
    
  
  


  // Function that update circle position if something change
  function update() {
    d3.selectAll("circle")
      .attr("cx", function (d) { return map.latLngToLayerPoint([d.lat, d.long]).x })
      .attr("cy", function (d) { return map.latLngToLayerPoint([d.lat, d.long]).y })
  }

  // slider stuff
  var myForm = document.getElementById("myForm");
   myForm.addEventListener("change", sliderYear);


   function sliderYear() {
    var sliderVal = parseFloat(document.getElementById('sliderVal').value)
    var filteredData = data.filter(function(d) {
      return d.Date.substring(d.Date.length - 2, d.Date.length) === sliderVal.toString().substring(2,4)
    })

    d3.select("#mapid")
    .select("svg")

    // Removes all the circles to update for another year
    .remove()

    markers = []
    filteredData.forEach(function (d) {

      d.Latitude = +d.Latitude;
      d.Longitude = +d.Longitude;
      markers.push({ "long": d.Longitude, "lat": d.Latitude })
    })

    L.svg().addTo(map);

    d3.select("#mapid")
      .select("svg")
      .selectAll("myCircles")
      .data(markers)
      .enter()
      .append("circle")
      .attr("cx", function (d) { return map.latLngToLayerPoint([d.lat, d.long]).x })
      .attr("cy", function (d) { return map.latLngToLayerPoint([d.lat, d.long]).y })
      .attr("r", 4)
      .style("fill", "red")
      .attr("stroke", "red")
      .attr("stroke-width", .1)
      .attr("fill-opacity", .2)
      
   }




  // If the user change the map (zoom or drag), I update circle position:
  map.on("moveend", update);
});