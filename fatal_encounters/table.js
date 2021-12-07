d3.csv("./test.csv").then(function (data) {
    
    var parseDate = d3.timeParse("%m/%d/%y")

    // Change date values to Date
    data.forEach(function(d) {
        d.Date = parseDate(d.Date);
    })

    //Organize by Year
    var nested = d3.nest().key(function (d) {
        return d.Date.getUTCFullYear();
    }).entries(data);
    
    
    //console.log(nested);

    //Grab current year of selector
    var currentYear = "2000"
    var currentData = nested.find(d => d.key == currentYear)
    currentData = currentData.values;
    console.log(currentData);

    // Create nest for States
    var StateNest = d3.nest().key(function (d) {
        return d.State;
    }).entries(currentData);
    console.log(StateNest)

    var state1 = {"key": "A", "values": []}
    var state2 = {"key": "A", "values": []}
    var state3 = {"key": "A", "values": []}
    for (i = 0; i < StateNest.length; i++) {
        var currentKey = StateNest[i].key;
        var currentNum = StateNest[i].values.length;
        //console.log(currentKey, currentNum);
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

    console.log(state1, state2, state3);
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
        console.log(currentKey, currentNum);
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

    console.log(force1, force2, force3);
    var forceList = [force1, force2, force3];

    //Create and append text 
    d3.select("#textBox").select("#yearDat")
    .append("h3")
    .attr("dy", '0em')
    .text("Current Year: " + currentYear);

    // Append Total Occurences
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









    // Add event listener to Year slider
    var myForm = document.getElementById("myForm");
    myForm.addEventListener("change", changeYear)

    // Function changes year
    function changeYear() {
        var sliderVal = parseFloat(document.getElementById('sliderVal').value)
        currentYear = sliderVal;
        update()
    }

    function update() {
        d3.select("#textBox").selectAll("div").select("h3")
        .remove()

        d3.select("#textBox").selectAll("div").select("h4")
        .remove()

        d3.select("#textBox").selectAll("div").select("ul")
        .remove()


        var currentData = nested.find(d => d.key == currentYear)
        currentData = currentData.values;
        console.log(currentData);

        // Create nest for States
        var StateNest = d3.nest().key(function (d) {
            return d.State;
        }).entries(currentData);
        console.log(StateNest)

        var state1 = {"key": "A", "values": []}
        var state2 = {"key": "A", "values": []}
        var state3 = {"key": "A", "values": []}
        for (i = 0; i < StateNest.length; i++) {
            var currentKey = StateNest[i].key;
            var currentNum = StateNest[i].values.length;
            //console.log(currentKey, currentNum);
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

        console.log(state1, state2, state3);
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
            console.log(currentKey, currentNum);
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

        console.log(force1, force2, force3);
        var forceList = [force1, force2, force3];

        //Create and append text 
        d3.select("#textBox").select("#yearDat")
        .append("h3")
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
 
//Name,Age,Gender,Race, Location of death (city),State, Highest level of force, Intended use of force (Developing)