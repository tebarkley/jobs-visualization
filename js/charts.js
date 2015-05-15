// create the bar chart of jobs by industry
var container = d3.select('#job-chart-container');

// // 2) Create and append the SVG container.
var margin = {top: 20, right: 30, bottom: 20, left: 30};

var chartHeight = 200;
var svgHeight = chartHeight + margin.top + margin.bottom;

var chartWidth = 200;
var svgWidth = chartWidth + margin.right + margin.left;

var x = d3.scale.ordinal().rangeRoundBands([0, chartWidth]);
var y = d3.scale.linear().range([0, chartHeight]);
var colors = d3.scale.category20();

var svg = container.append('svg:svg')
					.attr('width', svgWidth)
					.attr('height', svgHeight)
					.append('svg:g');

d3.csv("job_titles_by_industry_bar_chart.csv", function(jobs){
	// Transpose te data into layers by industry
	var industries = d3.layout.stack()(["Accounting and Finance","Administrative","Construction, Manufacturing, and Skilled Labor","Education","Engineering, Architecture, and Design","Food, Travel, and Entertainment","Health Care","Information Technology","Law","Management and Consulting","Non-profit","Retail","Sales, Marketing, and Customer Service","Science and Research","Transportation"]
		.map(function(industry){
			return jobs.map(function(d) {
				return {x: d.title, y: +d[industry]};
			});
		}));
	console.log(industries);
	// compute the x-domain (by job title) and y-domain
	x.domain(industries[0].map(function(d) { return d.x; }));
	y.domain([0, d3.max(industries[industries.length -1], 
		function(d) { return d.y0+d.y; })]);

	// add a group for each industry
	var industry = svg.selectAll("g.industry")
						.data(industries)
						.enter().append("svg:g")
						.attr("class", "industry")
						.style("fill", function(d, i) {return colors(i); });

	// add a rectangle for each job
	var rect = industry.selectAll("rect")
						.data(Object)
						.enter().append("svg:rect")
						.attr("x", function(d) { return x(d.x);})
						.attr("y", function(d) { return -y(d.y0)-y(d.y);})
						.attr("height", function(d) { return y(d.y);})
						.attr("width", x.rangeBand());
	console.log(rect);

});

