/**
 * Created by SCookBroen on 1/29/14.
 */


var barView;
barView =  (function (d3, CustomTooltip) {
    "use strict";
    var nodes = [];
    var tooltip = CustomTooltip("custom_tooltip", 240);
    var gKeys;
    var keys;
    //var myArray;
    var groups;
    //var mapIndex;
    var margin = {top: 10, right: 10, bottom: 10, left: 5},
        width = 850- margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;
    var svg;
    var myNodes;


    svg = d3.select("#vis").append("svg:svg");


    svg .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    function barGraph(data){

        dataChange(data);


    }//end barGraph

    function groupNode(){

        var type = this.innerHTML;
        console.log(type);
        d3.selectAll("h3.head")
            .text(type);

        sortByGroups(type);


    }//end groupNodes

    function dataChange(data){

        data.forEach(function(d){d.line_percent =  d.line_percent*100;});
        groups= d3.nest()
            .key(function(d) {return d.app_group;})
            .entries(data);
        console.log(groups);
        //create an array from each app
        var apps = d3.nest()
            .key(function(d) {return d.Application;})
            .entries(data);

        gKeys = d3.keys(groups);
        keys = d3.keys(apps);
        //createChart(keys, groups);
        for(var i = 0; i < gKeys.length; i++){
            nodes[i] = groups[i];
        }
        createNodes(data);
    }//end data change

    function createNodes(data){

        myNodes = data;

        //organize data into array of objects with App_Group as cat. of each array
        var myArray = new Array(gKeys.length);
        for(var i = 0; i < myArray.length; i++){
            myArray[i]= myNodes[gKeys[i]].values;

        }
        makeMenu(myNodes);
        makeDateMenu(myNodes);
        createChart(myNodes);
    }//end create nodes
    function makeDateMenu(myData){
        //make menu for date select
        var lines = d3.selectAll("#date-nav-list").selectAll("ul")
            .data(myData, function(d, i){ return d.date;});



        lines.enter().append("li").append("a")
            .attr("href", "#")
            .text(function (d) {
                return d.date;
            })
            .on("click", setDate);

        lines.exit().remove();

    }
    function setDate(){
        var mDate = [];
        console.log(this);
        var date = this.innerHTML;
        d3.selectAll("h3.head")
            .text(date);

        myNodes.forEach(function(d){ if(d.date === date)mDate.push(d);});

        createChart(mDate);

    }
    function sortByDate(mDate){
        console.log(mDate);
        //sort each app array into groups
        var mGroups;
        var mapIndex;
        for (var i = 0; i < groups.length; i++) {
            if (groups[i].date == mDate) {
                mapIndex = i;
                mGroups = groups[i].values;
            }
        }

        createChart(mGroups);

    }//end sortByGroups

    function sortByGroups(type){
        //sort each app array into groups
        var mGroups;
        var mapIndex;
        for (var i = 0; i < groups.length; i++) {
            if (groups[i].key == type) {
                mapIndex = i;
                mGroups = groups[i].values;
            }
        }
        myNodes = mGroups;
        createChart(mGroups);

    }//end sortByGroups
    function makeMenu(mData){
        //make menu for app_group select
        var lines = d3.selectAll("#main-nav-list").selectAll("ul")
            .data(mData, function(d, i){ return d.app_group;});


        lines.enter().append("li").append("a")
            .attr("href", "#")
            .text(function (d) {
                return d.app_group;})
            .on("click", groupNode);

        var subLines = lines.selectAll("ul")
            .data(mData, function(d, i){return d.date;});

        subLines.enter().append("li").append("a")
            .attr("href", "#")
            .text(function (d) {
                return d.date;
            });



        lines.exit().remove();

    }

    function createChart(mGroups){
        //create data organized by app_group;
        //use index to select data app_group
        //var mIndex = index,
        var mData = mGroups;
        console.log(mData);
        //make a var for the x values and store in array
        var xNames = [];
        for(var i = 0; i < mData.length; i ++)xNames[i] = mData[i].Application;
        //console.log(xNames);


        //TODO set up a function which gets each array's key to use in the tooltips!!
        function layerSet(layers){
            //TODO Take layer of groups and sort into ind. items so that tooltips and colors can be adjusted
            //Each object in layer is always the same i.e. Array[0].y == "line_total" forEach App in Group
            layers[0].forEach(function (d){

                d.name="line line_total";
                d.amount = d.y;

            });
            layers[1].forEach(function (d){

                d.name="actual lines tested";
                d.amount = d.y;
                d.z = LightenDarkenColor(d.z, 20);
            });
            layers[2].forEach(function (d){

                d.name="percent tested";
                d.y = (d.y/100) * d.line_total;
                d.amount = "%"+d.percent;
                d.z = LightenDarkenColor(d.z, 35);

            });
            layers[3].forEach(function (d){

                d.name="percent passed";
                d.y = d.test-(d.y*10);
                d.amount = "%"+d.pass *100;

                d.z = LightenDarkenColor(d.z, 45);

            });

        }
        function LightenDarkenColor(col, amt) {

            var usePound = false;

            if (col[0] == "#") {
                col = col.slice(1);
                usePound = true;
            }

            var num = parseInt(col,16);

            var r = (num >> 16) + amt;

            if (r > 255) r = 255;
            else if  (r < 0) r = 0;

            var b = ((num >> 8) & 0x00FF) + amt;

            if (b > 255) b = 255;
            else if  (b < 0) b = 0;

            var g = (num & 0x0000FF) + amt;

            if (g > 255) g = 255;
            else if (g < 0) g = 0;

            return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);

        }

        // transpose the data into layers by info
        var layers = d3.layout.stack()(["line_total", "line_tested", "line_percent", "percent_pass"].map(function(layers){
                return mData.map(function(d, i){
                    return {x: d.Application ,  y: +d[layers], z:d.colors , line_total:+d.line_total , test:+d.line_tested
                        , percent:+d.line_percent , pass:+d.percent_pass , date: d.date};
                });
            })),



            yGroupMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); }),
            yStackMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); });

console.log(layers);
        layerSet(layers);
        console.log(layers);

        var n = 4, // number of layers
            m = yGroupMax; // number of samples per layer

        //scale the data range and domain
        var x = d3.scale.ordinal()
                .domain([0, d3.max(layers[0], function(d){return d.y0;})])
                .rangeRoundBands([0, width],.03),


            y = d3.scale.pow().domain([0, yStackMax]).rangeRound([height, 20]).exponent(.5);
//            .clamp(true);


        // Compute the x-domain (by date) and y-domain (by top).
        x.domain(layers[0].map(function(d) { return d.x; })),
            console.log(layers);
//
        y.domain([0, yStackMax]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .tickSize(0)
            .tickPadding(6)
            .orient("bottom");
//
//        var yAxis = d3.svg.axis()
//            .scale(y)
//            .ticks(10)
//            .tickSize(3)
//            .orient("left");


        svg.selectAll(".layer")
            .remove();

        svg.selectAll("text")
            .remove();

//        svg.selectAll(".y axis")
//            .remove();

        var layer = svg.selectAll(".layer")
            .data(layers);

        layer
            .enter().append("g")
            .attr("class", "layer");


        var rect = layer.selectAll("rect")
            .data(function(d){return d;});


        rect
            .enter().append("rect")
            .attr("x", function(d) { return x(d.x); })
            .attr("y", function(d) { return y(d.y); })
            .attr("width", x.rangeBand())
            .attr("height", 0)
            //.style("fill",function(d, i) { return "#"+(d.z); })
            .style("fill", function(d){return d3.rgb("#"+d.z);})
            .style("stroke", function(d){return d3.rgb("#"+d.z).darker(1);})
            .on("mouseover", function (d, i) {
                show_details(d, i, this);
            })
            .on("mouseout", function (d, i) {
                hide_details(d, i, this);
            });

        rect.exit().remove();

        rect.transition()
            .delay(function(d, i) { return i * 10; })
            .attr("y", function(d) { return y(d.y0 + d.y); })
            .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); });

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-90)"
            });

//
//        svg.append("g")
//            .attr("class", "y axis")
//            .attr("transform", "translate(10,0 )")
//            .call(yAxis)
//            .selectAll("text")
//            .style("text-anchor", "end")
//            .attr("dx", "-.8em")
//            .attr("dy", ".15em");



        d3.selectAll("input").on("change", change);


        var timeout = setTimeout(function() {
            d3.select("input[value=\"grouped\"]").property("checked", true).each(change);
        }, 2000);

        function change() {
            clearTimeout(timeout);
            if (this.value === "grouped") transitionGrouped();
            else transitionStacked();
        }

        function transitionGrouped() {
            y.domain([0, yGroupMax]);

            rect.transition()
                .duration(500)
                .delay(function(d, i) { return i * 10; })
                .attr("x", function(d, i, j) { return x(d.x) + x.rangeBand() / n * j; })
                .attr("width", x.rangeBand() / n)
                .transition()
                .attr("y", function(d) { return y(d.y); })
                .attr("height", function(d) { return height - y(d.y); });
        }

        function transitionStacked() {
            y.domain([0, yStackMax]);

            rect.transition()
                .duration(500)
                .delay(function(d, i) { return i * 10; })
                .attr("y", function(d) { return y(d.y0 + d.y); })
                .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
                .transition()
                .attr("x", function(d) { return x(d.x); })
                .attr("width", x.rangeBand());
        }

        function show_details(data, i, element) {
            d3.select(element).attr("stroke", "black");
            var content = "<span class=\"name\">App Name:</span><span class=\"value\"> " + data.x + "</span><br/>";
            content +=    "<span class=\"name\">"+ data.name + "</span> <br/>";
            content += "<span class=\"name\">Amount: </span><span class=\"value\"> " + data.amount + "</span><br/>"
            content += "<span class=\"name\">Date: </span><span class=\"value\"> " + data.date + "</span><br/>";;
            tooltip.showTooltip(content, d3.event);
        }

        function hide_details(data, i, element) {
            d3.select(element).attr("stroke", function (d) {
                return d.z;
            });
            tooltip.hideTooltip();
        }






    }
    var my_mod = {};
    my_mod.init = function (_data) {
        barGraph(_data);

    };
    my_mod.barGraph = barGraph;


    return my_mod;

})(d3, CustomTooltip);
