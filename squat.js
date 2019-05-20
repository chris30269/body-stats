function squat(){
	var svg = d3.select("#squat .container svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var div = d3.select("#tooltip")
    .attr("class", "tooltip")
    .attr("class", "hidden");

  var parseTime = d3.timeParse("%Y-%m-%d");
  var showTime = d3.timeFormat("%Y-%m-%d");

  var x = d3.scaleTime().rangeRound([0, width]);

  var y = d3.scaleLinear().rangeRound([height, 0]);

  var line = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.weight); });

  d3.csv("squat.csv", function(data) {
    // if (error) throw error;
    // console.log(data);
    // var groupedData = d3.nest()
    //   .key(function(d){return d.date;})
    //   .rollup(function(d){
    //     return d3.sum(d, function(g){
    //       return g.weight/(1.0278-(.0278*g.reps));});
    //   })
    //   .entries(data);
    // groupedData.forEach(function(d){
    //   d.date = parseTime(d.key);
    //   d.weight = +d.value;
    // });
    // console.log(data);
    // console.log(groupedData);
    // var beginning = 0;
    // for (var i = 0; i <= 29; i++) {
    // 	beginning += data[i].weight;
    // 	// console.log(data[i].weight);
    // };
    // beginning = beginning/30.0;
    // // console.log(beginning);
    // var end = 0;
    // for (var i = (data.length-1); i >= (data.length-30); i--) {
    // 	end += data[i].weight;
    // 	// console.log(data[i].weight);
    // };
    // end = end/30.0;
    // // console.log(end);
    // var result = end-beginning;
    // result = Number.parseFloat(result).toPrecision(3);
    // d3.select("#lbmChange").html(result+"lbs");

    var overview = d3.nest()
      .key(function(d){return d.date;})
      .rollup(function(d){
        return d3.sum(d, function(g){
          return g.weight/(1.0278-(.0278*g.reps));});
      })
      .entries(data);
    for (var i = overview.length - 1; i >= 0; i--) {
      overview[i].key = parseTime(overview[i].key);
    }
    console.log(overview);

    for (var i = data.length - 1; i >= 0; i--) {
      data[i].e1RM = Math.round(data[i].weight/(1.0278-(.0278*data[i].reps)));
      data[i].date = parseTime(data[i].date);
    }

    var groupedData = d3.nest()
      .key(function(d){return d.date;})
      .entries(data);
    groupedData.forEach(function(d){
      d.key = new Date(d.key);
    });
    console.log(groupedData);

    x.domain(d3.extent(overview, function(d) { return d.key; }));
    y.domain([0, d3.max(overview, function(d){ return d.value; })]);

    // var t = new Date("Sat Jan 13 2018 00:00:00 GMT-0500 (EST)");
    // console.log(x(t));

    g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    g.append("g")
      .call(d3.axisLeft(y))
    .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("e1RM Sum");

     var vert = svg.append("g")
      .attr("transform", "translate("+margin.left+", "+margin.top+")")
      .selectAll(".setBar")
      .data(groupedData)
      .enter()
      .append("g");

      for (var i = 0; i < groupedData.length; i++) {
        for (var j = 0; j < groupedData[i].values.length; j++) {
          // console.log(groupedData[i].values[j]);
        }
      }

    vert.append("rect")
      .attr("x", function(d){return x(d.key);})
      .attr("y", function(d){return y(d.values[0].e1RM);})
      .attr("width", 10)
      .attr("height", function(d){return height - y(d.values[0].e1RM);})
      .attr("class", "setBar");
        //h.weight/(1.0278-(.0278*h.reps))

    // g.append("path")
    //   .datum(data)
    //   .attr("fill", "none")
    //   .attr("stroke", "steelblue")
    //   .attr("stroke-linejoin", "round")
    //   .attr("stroke-linecap", "round")
    //   .attr("stroke-width", 1.5)
    //   .attr("d", line);

    /*var circles = g.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", function(d){return x(d.date);})
      .attr("cy", function(d){return y(d.weight);})
      .attr("r", function(d){return 2;})
      .attr("stroke-width", 3)
      .attr("stroke", "steelblue")
      .attr("fill", "steelblue")
      .on("mouseover touchdown", function(d){
        div.attr("class", "shown box");
        div.append("p").html(showTime(d.date));
        div.append("p").html(d.weight);
        div.append("p").html(d.notes);
        div.attr("style", "position:absolute;left:"+d3.event.pageX+"px;top:"+d3.event.pageY+"px;z-index:2;");
      })
      .on("mouseout touchup", function(d){
        div.attr("class", "hidden box");
        div.html("");
      });*/
  });



}