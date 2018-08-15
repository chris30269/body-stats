function squat(){
	var svg = d3.select("#squat .container svg"),
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

d3.csv("squat.csv", function(data) {
// if (error) throw error;
// console.log(data);
var groupedData = d3.nest()
  .key(function(d){return d.date;})
  .rollup(function(d){
    return d3.sum(d, function(g){
      return g.weight/(1.0278-(.0278*g.reps));});
  })
  .entries(data);
groupedData.forEach(function(d){
  d.date = parseTime(d.key);
  d.weight = +d.value;
});
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

x.domain(d3.extent(groupedData, function(d) { return d.date; }));
y.domain(d3.extent(groupedData, function(d) { return d.weight; }));

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

g.append("path")
  .datum(groupedData)
  .attr("fill", "none")
  .attr("stroke", "steelblue")
  .attr("stroke-linejoin", "round")
  .attr("stroke-linecap", "round")
  .attr("stroke-width", 1.5)
  .attr("d", line);

});



}