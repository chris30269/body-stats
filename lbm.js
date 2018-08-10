function lbm(){
	var svg = d3.select("#lbm .container svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var parseTime = d3.timeParse("%Y-%m-%d");

var x = d3.scaleTime()
    .rangeRound([0, width]);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var line = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.weight); });

var prevPrevVal = 0;
var prevVal = 0;
var curVal = 0
var lineAvg = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d,i){
    	if (i == 0) {
	      prevPrevVal  = y(d.weight);
	      prevVal = y(d.weight);
	      curVal =  y(d.weight);
	  } else if (i == 1) {
	      prevPrevVal = prevVal;
	      prevVal = curVal;
	      curVal = (prevVal + y(d.weight)) / 2.0;
	  } else {
	      prevPrevVal = prevVal;
	      prevVal = curVal;
	      curVal = (prevPrevVal + prevVal + y(d.weight)) / 3.0;
	  }
    	return curVal;
    });

d3.csv("weight.csv", function(data) {
// if (error) throw error;
// console.log(data);
data.forEach(function(data, i) {
	data.date = parseTime(data.date);
	data.weight = +(data.weight-(data.weight*(data.fat/100.0)));
});
var beginning = 0;
for (var i = 0; i <= 29; i++) {
	beginning += data[i].weight;
	// console.log(data[i].weight);
};
beginning = beginning/30.0;
// console.log(beginning);
var end = 0;
for (var i = (data.length-1); i >= (data.length-30); i--) {
	end += data[i].weight;
	// console.log(data[i].weight);
};
end = end/30.0;
// console.log(end);
var result = end-beginning;
result = Number.parseFloat(result).toPrecision(3);
d3.select("#lbmChange").html(result+"lbs");

x.domain(d3.extent(data, function(d) { return d.date; }));
y.domain(d3.extent(data, function(d) { return d.weight; }));

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
  .text("Lean Body Mass (lbs)");

g.append("path")
  .datum(data)
  .attr("fill", "none")
  .attr("stroke", "steelblue")
  .attr("stroke-linejoin", "round")
  .attr("stroke-linecap", "round")
  .attr("stroke-width", 1.5)
  .attr("opacity", .2)
  .attr("d", line);

g.append("path")
  .datum(data)
  .attr("fill", "none")
  .attr("stroke", "steelblue")
  .attr("stroke-linejoin", "round")
  .attr("stroke-linecap", "round")
  .attr("stroke-width", 1.5)
  .attr("d", lineAvg);
});



}