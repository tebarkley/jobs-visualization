$( document ).ready(function() {
	console.log(window.location.href);

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
	industryMapping = {}
	industryMapping['accounting']= {name:'Accounting and Finance', index:0};
	industryMapping['administrative'] = {name:'Administrative', index:1};
	industryMapping['construction'] = {name:'Construction and Labor',index:2};
	industryMapping['education'] = {name:'Education', index:3};
	industryMapping['engineering'] = {name:'Engineering and Architecture', index:4};
	industryMapping['food'] = {name:'Food and Travel', index:5};
	industryMapping['healthcare'] = {name:'Health Care', index:6};
	industryMapping['it'] = {name:'Information Technology', index:7};
	industryMapping['law'] = {name:'Law', index:8};
	industryMapping['management'] = {name:'Management and Consulting', index:9};
	industryMapping['nonprofit'] = {name:'Non-profit', index:10};
	industryMapping['retail'] = {name:'Retail', index:11};
	industryMapping['sales'] = {name:'Sales and Marketing', index:12};
	industryMapping['science'] = {name:'Science and Research', index:13};
	industryMapping['transportation'] = {name:'Transportation', index:14};

	var jobsChart = {
	chart: {
			renderTo: 'job-chart-container',
			type: 'bar',
			height: 1200,
			width: 700,
			marginRight: 30,
			style: {
				fontFamily: 'sans-serif'
			}
		},
		credits: {
			enabled: false
		},
		
		title: {
			text: 'Top Bay Area Jobs',
			style: {
				fontWeight: 'bold'

			}
		},
		subtitle: {
    		text: 'Click on a job title to learn more'
		},
		colors: colors_array,
		
		xAxis: {
			categories: [],
			labels: {
				style: {
					color: 'black',
					fontSize: 11
				},
			// make the categories hyperlinks to the jobs page
				formatter: function() {
					return '<a href="' + window.location.href + '/jobs?title=' + this.value + '">' + this.value + '</a>';
				}

				}
		},
		yAxis: {
	        // min: 0,
	        gridLineWidth: 0.75,
	        title: {
	            text: 'Total Jobs'
	        },
	        stackLabels: {
	        	enabled: true,
	        	formatter: function () {
                    return this.total + " jobs";
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
	//make the jobs plot
	// getAllJobs();

	var skillsChart = {
	chart: {
			renderTo: 'skill-chart-container',
			type: 'bar',
			height: 1200,
			width: 700,
			marginRight: 30,
			style: {
				fontFamily: 'sans-serif'
			}
		},
		credits: {
			enabled: false
		},
		
		title: {
			text: 'Top Bay Area Skills',
			style: {
				fontWeight: 'bold'
			}
		},
		subtitle: {
    		text: 'Click on a skill to learn more'
		},
		colors: colors_array,
		
		xAxis: {
			categories: [],
			labels: {
				style: {
					color: 'black',
					fontSize: 11
				},
				formatter: function() {
					return '<a href="' + window.location.href + '/skills?skill=' + this.value + '">' + this.value + '</a>';
				}
			}
		},
		yAxis: {
	        // min: 0,
	        gridLineWidth: 0.75,
	        title: {
	            text: 'Total Skills'
	        },
	        stackLabels: {
	        	enabled: true,
	        	formatter: function () {
                    return this.total + " jobs";
                },
                style: { 
	        	color: "gray", 
	        	// fontSize: 6,
	        	fontWeight: 'normal'
	        	// "textShadow": "0 0 6px contrast, 00 3px contrast" 
	        }
	        },
	        
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
	//make the skills plot
	// getAllSkills();

	// try functions to read in the data
	var jobs = (function () {
	    var json = null;
	    $.ajax({
	    	'async': false,
	    	'global': false,
	    	'url':'data/job_titles_by_industry_bar_chart.json', 
	    	'dataType': "json",
	    	'success': function(data){
	    	json = data;
	    	}
	    });
	    return json;
	   })();

	var skills = (function () {
	    var json = null;
	    $.ajax({
	    	'async': false,
	    	'global': false,
	    	'url':'data/skills_by_industry_bar_chart.json', 
	    	'dataType': "json",
	    	'success': function(data){
	    	json = data;
	    	}
	    });
	    return json;
	   })();

	jobs = processJobs(jobs);
	skills = processSkills(skills);

	plotAllJobs(jobs);
	plotAllSkills(skills);

	$(".industry").click(function(){
		var id = this.id;
		updateJobsChart(jobs, id);
		updateSkillsChart(skills, id);
		$("#reset").removeAttr('disabled');
		$("#reset").addClass('clicked');
	});

	$("#reset").click(function(){
		$('#reset').attr('disabled','disabled');
		$("#job-chart-container").highcharts().destroy();
		$("#skill-chart-container").highcharts().destroy();
		plotAllJobs(jobs);
		plotAllSkills(skills);

	});

	function processJobs(data) {
		newData = [];
		_.each(data, function(item) {
			newFormat = {title: item.title, industries: item};
			delete newFormat.industries['title'];
			newData.push(newFormat);
		});
		// now we can try sorting the titles by the sum of the values
		data = _.sortBy(newData, function(item){
			return _.reduce(_.values(item.industries), function(memo, num){return memo + num;},0) * -1;
		});
		return data;
	}

	function processSkills(data) {
		newData = [];
		_.each(data, function(item) {
			newFormat = {skill: item.skill, industries: item};
			delete newFormat.industries['skill'];
			newData.push(newFormat);
		});

		// now we can try sorting the titles by the sum of the values
		// console.log(_.reduce(_.values(item.industries), function(memo, num){return memo + num;},0));
		data = _.sortBy(newData, function(item){
			return _.reduce(_.values(item.industries), function(memo, num){return memo + num;},0) * -1;
		});
		return data
	}



	function plotAllJobs(data) {
		//get the data into highcharts, picking the top 50 jobs to plot
		data = data.slice(0,50);
		jobsChart.xAxis.categories = _.pluck(data, 'title');

		//need to loop through all the industries, create an object with that industry as the name and the 
		var series_data = {}
		_.each(_.pluck(data, 'industries'), function(job, i){
			_.each(job, function(count, industry){
				if (i==0) {
					series_data[industry] = {}
					series_data[industry]['name'] = industry
					series_data[industry]['data'] = [count]
				}
				else {
					series_data[industry]['data'].push(count);
				}

			});
		});
		jobsChart.series = _.values(series_data);
		jobsChart.colors = colors_array;
		jobsChart.title.text = 'Top Bay Area Jobs';

		// console.log(jobsChart.series);
		var jobChart = new Highcharts.Chart(jobsChart);
		// console.log(jobChart);		
	}


	function plotAllSkills(data){
		//get the data into highcharts
		data = data.slice(0,50);
		skillsChart.xAxis.categories = _.pluck(data, 'skill');

		//need to loop through all the industries, create an object with that industry as the name and the 
		var series_data = {}
		_.each(_.pluck(data, 'industries'), function(job, i){
			_.each(job, function(count, industry){
				if (i==0) {
					series_data[industry] = {}
					series_data[industry]['name'] = industry
					series_data[industry]['data'] = [count]
				}
				else {
					series_data[industry]['data'].push(count);
				}

			});
		});
		skillsChart.series = _.values(series_data);
		skillsChart.colors = colors_array;
		skillsChart.title.text = 'Top Bay Area Skills';
		var skillChart = new Highcharts.Chart(skillsChart);
	}

	function updateJobsChart(data, id) {
		var filteredData = [];
		var industry = industryMapping[id]['name'];
		var index = industryMapping[id]['index'];
		filteredData = []
		_.each(data, function(item) {
			var rowData = {};
			rowData['title'] = item.title;
			rowData['data'] = item['industries'][industry]
			filteredData.push(rowData)
		});
		filteredData = _.sortBy(filteredData, function(item){
			return item['data'] * -1;});
		filteredData = filteredData.slice(0,50);
		// console.log(filteredData);
		var newCategories = _.pluck(filteredData, 'title');
		var newSeries = [{'name': industry, 'data': _.pluck(filteredData, 'data')}];

		$("#job-chart-container").highcharts().destroy();
		jobsChart.xAxis.categories = newCategories;
		jobsChart.series = newSeries;
		jobsChart.colors = [colors[industry]];
		jobsChart.title.text = 'Top Bay Area Jobs in ' + industry;
		var jobChart = new Highcharts.Chart(jobsChart);

	}

	function updateSkillsChart(data, id) {
		var filteredData = [];
		var industry = industryMapping[id]['name'];
		var index = industryMapping[id]['index'];
		filteredData = []
		_.each(data, function(item) {
			var rowData = {};
			rowData['skill'] = item.skill;
			rowData['data'] = item['industries'][industry]
			filteredData.push(rowData)
		});
		filteredData = _.sortBy(filteredData, function(item){
			return item['data'] * -1;});
		filteredData = filteredData.slice(0,50);
		// console.log(filteredData);
		var newCategories = _.pluck(filteredData, 'skill');
		var newSeries = [{'name': industry, 'data': _.pluck(filteredData, 'data')}];

		$("#skill-chart-container").highcharts().destroy();
		skillsChart.xAxis.categories = newCategories;
		skillsChart.series = newSeries;
		skillsChart.colors = [colors[industry]];
		skillsChart.title.text = 'Top Bay Area Skills in ' + industry;
		var skillChart = new Highcharts.Chart(skillsChart);

	}

	// function updateJobsChart(data, id) {
	// 	var filteredData = [];
	// 	var industry = industryMapping[id]['name'];
	//     var jobsChart= $("#job-chart-container").highcharts();	
	//     var index = industryMapping[id]['index'];
	//     filteredData = []
	// 	_.each(data, function(item) {
	// 		var rowData = {};
	// 		rowData['title'] = item.title;
	// 		rowData['data'] = item['industries'][industry]
	// 		filteredData.push(rowData)
	// 	});
	// 	filteredData = _.sortBy(filteredData, function(item){
	// 		return item['data'] * -1;});
	// 	filteredData = filteredData.slice(0,50);
	// 	var newCategories = _.pluck(filteredData, 'title');
	// 	console.log(newCategories);
	// 	jobsChart.xAxis[0].setCategories(newCategories);
	// 	// need to remove all series with indices less than the clicked-on one, then remove all series of 1 until there are 14 removals
	// 	remove = _.range(index)
	// 	_.each(remove, function(item){
	// 		jobsChart.series[0].remove(false);
	// 	});
	// 	remove = _.range(index+1,15);
	// 	_.each(remove,function(item){
	// 		jobsChart.series[1].remove(false);
	// 	});
	// 	jobsChart.series[0].setData(_.pluck(filteredData, 'data'), false);
	// 	jobsChart.redraw();
	// }

	// function updateSkillChart(data, id) {
	// 	var filteredData = [];
	// 	var industry = industryMapping[id]['name'];
	//     var skillsChart= $("#skill-chart-container").highcharts();	
	//     var index = industryMapping[id]['index'];

	// 	_.each(data, function(item) {
	// 		var rowData = {};
	// 		rowData['skill'] = item.skill;
	// 		rowData['data'] = item['industries'][industry]
	// 		filteredData.push(rowData)
	// 	});
	// 	filteredData = _.sortBy(filteredData, function(item){
	// 		return item['data'] * -1;});

	// 	filteredData = filteredData.slice(0,50);
	// 	var newCategories = _.pluck(filteredData, 'skill');
	// 	// var newSeries = Array();
	// 	// // console.log(_.values(filteredData));
	// 	// newSeries.push({'name': industry, 'data': _.pluck(filteredData, 'data')});
		
	// 	// newSeries.push({'name': 'Accounting and Finance', 'data': _.values(filteredData)});
	// 	skillsChart.xAxis[0].setCategories(newCategories);
	// 	// need to remove all series with indices less than the clicked-on one, then remove all series of 1 until there are 14 removals
	// 	remove = _.range(index)
	// 	_.each(remove, function(item){
	// 		skillsChart.series[0].remove(false);
	// 	});
	// 	remove = _.range(index+1,15);
	// 	_.each(remove,function(item){
	// 		skillsChart.series[1].remove(false);
	// 	});
	// 	skillsChart.series[0].setData(_.pluck(filteredData, 'data'), false);
	// 	skillsChart.redraw();
	// }
});