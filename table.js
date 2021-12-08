d3.csv("./testTable.csv").then(function (data) {

    var parseDate = d3.timeParse("%m/%d/%y")

    // Change date values to Date
    data.forEach(function(d) {
        d.Date = parseDate(d.Date);
    })

    //Organize by Year
    var nested = d3.nest().key(function (d) {
        return d.Date.getUTCFullYear();
    }).entries(data);

    //Grab current year of selector
    var currentYear = "2000"
    var currentData = nested.find(d => d.key == currentYear)
    currentData = currentData.values;

    // Create nest for States
    var StateNest = d3.nest().key(function (d) {
        return d.State;
    }).entries(currentData);

    // Instantiate top 3 state variables
    var state1 = {"key": "A", "values": []}
    var state2 = {"key": "A", "values": []}
    var state3 = {"key": "A", "values": []}

    // For Each State, go through and determine top three most occured based on currrent year.
    for (i = 0; i < StateNest.length; i++) {
        var currentKey = StateNest[i].key;
        var currentNum = StateNest[i].values.length;
        if (state1.values.length < currentNum) {
            var saved = state1;
            state1 = StateNest[i];
            if (state2.values.length < saved.values.length) {
                var saved2 = state2;
                state2 = saved;
                if (state3.values.length < saved2.values.length) {
                    state3 = saved2;
                }
            }
        } else if (state2.values.length < currentNum) {
            var saved3 = state2
            state2 = StateNest[i];
            if (state3.values.length < saved3.values.length) {
                state3 = saved3;
            }
        } else if (state3.values.length < currentNum) {
            state3 = StateNest[i];
        }
    }


    var stateList = [state1, state2, state3];
    
    // Create Nest for force
    var HighestForceNest = d3.nest().key(function (d) {
        return d["Highest level of force"];
    }).entries(currentData)
    
    // Instantiate top 3 force occurences 
    var force1 = {"key": "A", "values": []}
    var force2 = {"key": "A", "values": []}
    var force3 = {"key": "A", "values": []}

    // Go through each different force and saved the top 3 for that given year.
    for (i = 0; i < HighestForceNest.length; i++) {
        var currentKey = HighestForceNest[i].key;
        var currentNum = HighestForceNest[i].values.length;

        if (force1.values.length < currentNum) {
            var saved = force1;
            force1 = HighestForceNest[i];
            if (force2.values.length < saved.values.length) {
                var saved2 = force2;
                force2 = saved;
                if (force3.values.length < saved2.values.length) {
                    force3 = saved2;
                }
            }
        } else if (force2.values.length < currentNum) {
            var saved3 = force2
            force2 = HighestForceNest[i];
            if (force3.values.length < saved3.values.length) {
                force3 = saved3;
            }
        } else if (force3.values.length < currentNum) {
            force3 = HighestForceNest[i];
        }
    }


    var forceList = [force1, force2, force3];

    //Create and append text 
    d3.select("#textBox").select("#yearDat")
    .append("h2")
    .attr("dy", '0em')
    .text("Current Year: " + currentYear);

    // Append Total Occurences
    d3.select("#textBox").select("#totalDat")
    .append("h4")
    .text("Total Occurences: " + currentData.length);
    
    // Append Most common use of force
    d3.select("#textBox").select("#forceDat")
    .append("h4")
    .attr("dy", '0em')
    .text("Most Common Use of force:");

    d3.select('#textBox').select("#forceDat")
    .append("ul")

    d3.select('#textBox').select("#forceDat").select("ul").selectAll("li")
    .data(forceList)
    .enter()
    .append("li")
    .text(function(d) {
        return d.key + ": " + d.values.length; 
    })

    // Append most common states
    d3.select("#textBox").select("#stateDat")
    .append("h4")
    .attr("dy", '0em')
    .text("States with highest Number of Fatal Encounters:");

    d3.select('#textBox').select("#stateDat")
    .append("ul")

    d3.select('#textBox').select("#stateDat").select("ul").selectAll("li")
    .data(stateList)
    .enter()
    .append("li")
    .text(function(d) {
        return d.key + ": " + d.values.length; 
    })









    // Add event listener to Year slider
    var myForm = document.getElementById("myForm");
    myForm.addEventListener("change", changeYear)

    // Function changes year
    function changeYear() {
        var sliderVal = parseFloat(document.getElementById('sliderVal').value)
        currentYear = sliderVal;
        update()
    }


    // function that updates table based upon current slider year.
    function update() {
        d3.select("#textBox").selectAll("div").select("h2")
        .remove()

        d3.select("#textBox").selectAll("div").select("h4")
        .remove()

        d3.select("#textBox").selectAll("div").select("ul")
        .remove()


        var currentData = nested.find(d => d.key == currentYear)
        currentData = currentData.values;

        // Create nest for States
        var StateNest = d3.nest().key(function (d) {
            return d.State;
        }).entries(currentData);

        var state1 = {"key": "A", "values": []}
        var state2 = {"key": "A", "values": []}
        var state3 = {"key": "A", "values": []}
        for (i = 0; i < StateNest.length; i++) {
            var currentKey = StateNest[i].key;
            var currentNum = StateNest[i].values.length;
            if (state1.values.length < currentNum) {
                var saved = state1;
                state1 = StateNest[i];
                if (state2.values.length < saved.values.length) {
                    var saved2 = state2;
                    state2 = saved;
                    if (state3.values.length < saved2.values.length) {
                        state3 = saved2;
                    }
                }
            } else if (state2.values.length < currentNum) {
                var saved3 = state2
                state2 = StateNest[i];
                if (state3.values.length < saved3.values.length) {
                    state3 = saved3;
                }
            } else if (state3.values.length < currentNum) {
                state3 = StateNest[i];
            }
        }


        var stateList = [state1, state2, state3];
        
        // Create Nest for force
        var HighestForceNest = d3.nest().key(function (d) {
            return d["Highest level of force"];
        }).entries(currentData)
        
        var force1 = {"key": "A", "values": []}
        var force2 = {"key": "A", "values": []}
        var force3 = {"key": "A", "values": []}
        for (i = 0; i < HighestForceNest.length; i++) {
            var currentKey = HighestForceNest[i].key;
            var currentNum = HighestForceNest[i].values.length;
            if (force1.values.length < currentNum) {
                var saved = force1;
                force1 = HighestForceNest[i];
                if (force2.values.length < saved.values.length) {
                    var saved2 = force2;
                    force2 = saved;
                    if (force3.values.length < saved2.values.length) {
                        force3 = saved2;
                    }
                }
            } else if (force2.values.length < currentNum) {
                var saved3 = force2
                force2 = HighestForceNest[i];
                if (force3.values.length < saved3.values.length) {
                    force3 = saved3;
                }
            } else if (force3.values.length < currentNum) {
                force3 = HighestForceNest[i];
            }
        }


        var forceList = [force1, force2, force3];

        //Create and append text 
        d3.select("#textBox").select("#yearDat")
        .append("h2")
        .attr("dy", '0em')
        .text("Current Year: " + currentYear);

        d3.select("#textBox").select("#totalDat")
        .append("h4")
        .text("Total Occurences: " + currentData.length);
        
        d3.select("#textBox").select("#forceDat")
        .append("h4")
        .attr("dy", '0em')
        .text("Most Common Use of force:");

        d3.select('#textBox').select("#forceDat")
        .append("ul")

        d3.select('#textBox').select("#forceDat").select("ul").selectAll("li")
        .data(forceList)
        .enter()
        .append("li")
        .text(function(d) {
            return d.key + ": " + d.values.length; 
        })

        d3.select("#textBox").select("#stateDat")
        .append("h4")
        .attr("dy", '0em')
        .text("States with highest Number of Fatal Encounters:");

        d3.select('#textBox').select("#stateDat")
        .append("ul")

        d3.select('#textBox').select("#stateDat").select("ul").selectAll("li")
        .data(stateList)
        .enter()
        .append("li")
        .text(function(d) {
            return d.key + ": " + d.values.length; 
        })
    }

})
