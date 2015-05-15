$( document ).ready(function() {

	// get the job title from the query
	queryParam = window.location.href.split('title=')[1];
	jobTitle = decodeURIComponent(queryParam);

	// update the page header with the job title
	$("#job-page-header").text(jobTitle);

	// Define the industry colors
	colors = {};
	colors['Accounting and Finance']= "#9dd088";
	colors['Administrative'] = "#f47e1f",
	colors['Construction and Labor'] = "#adc6e7";
	colors['Education'] = '#f59696';
	colors['Engineering and Architecture'] = "#9167ac";
	colors['Food and Travel'] = "#1bbecf";
	colors['Health Care'] = "#dbdb8c";
	colors['Information Technology'] = "#c49c94";
	colors['Law'] = "#d52828";
	colors['Management and Consulting'] = "#bbbd32";
	colors['Non-profit'] = '#fbba78';
	colors['Retail'] = '#d779b1';
	colors['Sales and Marketing'] = '#2ca048';
	colors['Science and Research'] = '#c4b0d5';
	colors['Transportation'] = '#9fdae5';
	colors_array = _.values(colors);
	// industryMapping = {}
	// industryMapping['accounting']= {name:'Accounting and Finance', index:0};
	// industryMapping['administrative'] = {name:'Administrative', index:1};
	// industryMapping['construction'] = {name:'Construction, Manufacturing, and Skilled Labor',index:2};
	// industryMapping['education'] = {name:'Education', index:3};
	// industryMapping['engineering'] = {name:'Engineering, Architecture, and Design', index:4};
	// industryMapping['food'] = {name:'Food, Travel, and Entertainment', index:5};
	// industryMapping['healthcare'] = {name:'Health Care', index:6};
	// industryMapping['it'] = {name:'Information Technology', index:7};
	// industryMapping['law'] = {name:'Law', index:8};
	// industryMapping['management'] = {name:'Management and Consulting', index:9};
	// industryMapping['nonprofit'] = {name:'Non-profit', index:10};
	// industryMapping['retail'] = {name:'Retail', index:11};
	// industryMapping['sales'] = {name:'Sales, Marketing, and Customer Service', index:12};
	// industryMapping['science'] = {name:'Science and Research', index:13};
	// industryMapping['transportation'] = {name:'Transportation', index:14};

	
	var industryChart = {
	chart: {
			renderTo: 'jobs-industry-plot',
			type: 'bar',
			height: 300,
			width: 600,
			marginRight: 30,
			style: {
				fontFamily: 'sans-serif'
			}
		},
		tooltip: {
			enabled: false
		},
		credits: {
			enabled: false
		},
		
		title: {
			text: 'Top Industries',
			style: {
				fontWeight: 'bold'

			}
		},
		// colors: colors_array,
		
		xAxis: {
			categories: [],
			labels: {
				style: {
					color: 'black',
					fontSize: 12
				}
			}
		},
		yAxis: {
	        gridLineWidth: 0.75,
	        title: {
	            text: 'Number of ' + jobTitle + ' jobs'
	        }
	    },
		series: [],
		legend: {
			enabled: false
		},
		plotOptions: {

			bar: {
				colorByPoint: true,
				dataLabels: {
					enabled: true,
	        		formatter: function () {
                    	return this.y + " jobs";
                	},
                	style: { 
		        		color: "gray", 
		        	// fontSize: 6,
		        		fontWeight: 'normal'
		        	// "textShadow": "0 0 6px contrast, 00 3px contrast" 
	        		}

				}
			}
		}
	}

	var skillChart = {
	chart: {
			renderTo: 'jobs-skills-plot',
			type: 'bar',
			height: 350,
			width: 600,
			marginRight: 30,
			style: {
				fontFamily: 'sans-serif'
			}
		},
		credits: {
			enabled: false
		},
		tooltip: {
			enabled: false
		},
		title: {
			text: 'Top Skills',
			style: {
				fontWeight: 'bold'

			}
		},
		subtitle: {
    		text: 'Click on a skill to learn more'
		},
		// colors: colors_array,
		
		xAxis: {
			categories: [],
			labels: {
				style: {
					color: 'black',
					fontSize: 12
				},
				formatter: function() {
					return '<a href="' + window.location.href.split('jobs')[0] + 'skills?skill=' + this.value + '">' + this.value + '</a>';
				}
			}
		},
		yAxis: {
			gridLineWidth: 0.75,

	        // min: 0,
	        title: {
	            text: 'Percent of ' + jobTitle + ' jobs that use skill'
	        },
	        stackLabels: {
	        	enabled: true,
	        	formatter: function () {
                    return Math.round(this.total) + "%";
                },
                style: { 
		        	color: "gray", 
		        	// fontSize: 6,
		        	fontWeight: 'normal'
		        	// "textShadow": "0 0 6px contrast, 00 3px contrast" 
	        	}
	        }
	    },
		series: [],
		legend: {
			enabled: false
		},
		plotOptions: {
			series: {
				stacking: 'normal',
				borderWidth: 0
			}
		}
	}
	

	makeIndustryChart(jobTitle);
	makeSkillsChart(jobTitle);
	makeRelatedChart(jobTitle);
	

	function makeIndustryChart(jobTitle){
		$.getJSON('data/industries_by_job.json', function(data){
			data = data[jobTitle];
			data = _.pairs(data);
			var sortedData = _.sortBy(data, function(item){return item.slice(1)*-1;});
			sortedData = sortedData.slice(0,5);
			// get rid of industries that have zero
			var nonZero = _.object(_.reject(sortedData, function(item){ return item.slice(1) == 0;}));
			// prepare for plot- the categories are the industry names
			var categories = _.keys(nonZero);
			var series = [{'name': jobTitle, 'data': _.values(nonZero)}];
			var color_list = [];
			_.each(categories, function(cat){
				color_list.push(colors[cat]);
			});
			industryChart.xAxis.categories = categories;
			industryChart.series = series;
			industryChart.colors = color_list;
			var indChart = new Highcharts.Chart(industryChart);
		});
	}

	function makeSkillsChart(jobTitle){
		$.getJSON('data/job_skills.json', function(data){
			// get all the objects from that title
			data = _.where(data, {title:jobTitle});
			// sort the skills
			var skillData = {};
			_.each(data, function(item){
				skillData[item.skill] = _.reduce(_.values(_.omit(item,['title', 'skill'])), function(memo, num){return memo + num;},0);
			});
			skillData = _.pairs(skillData);
			sortedSkills = _.sortBy(skillData, function(item) {return item.slice(1)*-1;});
			sortedSkills = _.object(sortedSkills);
			// // get ready for the plot
			var categories = _.keys(sortedSkills);
			var series = [{'name': jobTitle, 'data': _.values(sortedSkills)}];
			skillChart.xAxis.categories = categories;
			skillChart.series = _.values(series);
			// skillChart.colors = color_list;
			var sChart = new Highcharts.Chart(skillChart);
		});
	}

	function makeSkillsChartStacked(jobTitle){
		$.getJSON('data/job_skills.json', function(data){
			// get all the objects from that title
			data = _.where(data, {title:jobTitle});
			// sort the skills
			var skillData = {};
			_.each(data, function(item){
				skillData[item.skill] = _.omit(item,['title', 'skill']);
			});
			skillData = _.pairs(skillData);
			// sort the skills
			sortedSkills = _.sortBy(skillData, function(item){
				return _.reduce(_.values(item.slice(1)[0]), function(memo, num){return memo + num;},0) * -1;
			});
			sortedSkills = _.object(sortedSkills);
			// // get ready for the plot
			var categories = _.keys(sortedSkills);
			// // create the series data which requires name of the industry and the values
		
			var series = {}
			_.each(_.values(sortedSkills), function(skill, i) {
				_.each(_.keys(skill), function (item) {
					if (i==0) {
						series[item] = {};
						series[item]['name'] = item;
						series[item]['data'] = [skill[item]];
					}
					else {
						series[item]['data'].push(skill[item]);
					}
				});
			});
			var color_list = [];
			_.each(_.keys(series), function(cat){
				color_list.push(colors[cat]);
			});
			skillChart.xAxis.categories = categories;
			skillChart.series = _.values(series);
			skillChart.colors = color_list;
			var sChart = new Highcharts.Chart(skillChart);


		});
	}

	function makeRelatedChart(jobTitle) {
		var w = 700;
		var h = 500;
		var r = 20;

		$.getJSON('data/related_careers_plot.json', function(data){
			data = _.where(data,{title:jobTitle});
			// console.log(data);
			// need to create the nodes and links datastructures
			var nodes = [];
			var links = [];
			nodes.push({"name": data[0]['title']});
			_.each(data[0]['related_careers'], function(item, i){
				nodes.push({"name": item});
				links.push({source: 0, target: i+1});
			});
			console.log(nodes);
			console.log(links);
			//create the links data structure
			var force = d3.layout.force()
		    .gravity(.1)
		    .charge(-300)
		    .linkDistance(w/4)
		    .size([w, h]);

		    var svg = d3.select("#related-jobs-plot")
						.append("svg")
						.attr("width", w)
						.attr("height", h)
						.attr("margin-top", 50);

		
			force.nodes(nodes)
				.links(links)
				.start();
		

			var link = svg.selectAll('.link')
		    .data(links)
		    .enter().append('line')
		    .attr('class', 'link')
		    .attr("x1", function(d) { return d.source.x; })
	      	.attr("y1", function(d) { return d.source.y; })
	      	.attr("x2", function(d) { return d.target.x; })
	      	.attr("y2", function(d) { return d.target.y; });

	      	var gnodes = svg.selectAll('g.gnode')
	      		.data(nodes)
	      		.enter()
	      		.append('g')
	      		.classed('gnode', true);

		    // var node = gnodes.append("circle")
		    // 	.attr("class","node")
			   //  // .attr("cx", function(d) { return d.x; })
		    //  //  	.attr("cy", function(d) { return d.y; })
		    //   	.attr("r", r);

		    var node = gnodes.append("a")
		    	.attr("xlink:href", function(d){return window.location.href.split('?')[0] + '?title=' + d.name;})
		    	.append("circle")
		    	.attr("class","node")
			    // .attr("cx", function(d) { return d.x; })
		     //  	.attr("cy", function(d) { return d.y; })
		      	.attr("r", r);

		    var labels = gnodes.append("text")
		    			.text(function(d) { return d.name;});

		  
		    force.on('tick', function() {

		    	nodes[0].x = w / 2;
	    		nodes[0].y = h / 2;

		    	// node.attr('cx', function(d) { return d.x; })
		     //    	.attr('cy', function(d) { return d.y; });

		    	link.attr('x1', function(d) { return d.source.x; })
		        .attr('y1', function(d) { return d.source.y; })
		        .attr('x2', function(d) { return d.target.x; })
		        .attr('y2', function(d) { return d.target.y; });

		        // nodes.attr("transform", function(d){
		        // 	return 'translate(' + [d.x,d.y] + ')';
		        // })

		        // labels.attr("transform", function(d){
		        // 	return 'translate(' + [d.x-30,d.y] + ')';
		        // })

		       gnodes.attr("transform", function(d){
		       	return 'translate(' + [d.x,d.y] + ')';
		       })
	        	

		    });

		});
	}

});