
/* Created by SCookBroen on 1/29/14.
*/


var custom_bubble_chart;
custom_bubble_chart = (function (d3, CustomTooltip) {
    "use strict";
   //var mNodes = d3;
    var viewType;
    //a global date variable
    var currDate;
    var currentNodes = [],
//    var width = 900,
//        height = 900,
        tooltip = CustomTooltip("custom_tooltip", 240),
        c_nodes = [],
        l_nodes = [],
        m_nodes = [],
        circles,
        radius_scale;
    var width = 700,
        height = 700,
        padding = 3, // separation between same-color nodes
        clusterPadding = 5; // separation between different-color nodes

//    var nodes = d3.range(200).map(function() { return {radius: Math.random() * 12 + 4}; }),
//        root = nodes[0];
//    root.radius = 0;
//    root.fixed = true;
    var textBox = d3.select("#vis")
        .append("div")
        .attr("id","dateHolder")
        .attr("width",200)
        .attr("height",400);

    var svg = d3.select("#vis").append("svg")
        .attr("width", width)
        .attr("height", height);

    function custom_chart(data) {
        //TODO get maxAmount for line, class, method and pass to radius scale
        function lMaxRange(){

            var max_amount = d3.max(data, function (d, i) {
                return  i, +d.line_total;
            });
            radius_scale = d3.scale.pow().exponent(.5).domain([0, max_amount]).range([0, 175]);
            return radius_scale;

        }
        function cMaxRange(){

            var max_amount = d3.max(data, function (d, i) {
                return  i, +d.class_total;
            });
            radius_scale = d3.scale.pow().exponent(.75).domain([0, max_amount]).range([0, 150]);
            return radius_scale;

        }
        function mMaxRange(){

            var max_amount = d3.max(data, function (d, i) {
                return  i, +d.method_total;
            });
            radius_scale = d3.scale.pow().exponent(.75).domain([0, max_amount]).range([0, 150]);
            return radius_scale;

        }

        //create nodes from original data
        data.forEach(function (d) {
            var c_node = {
                radius: cMaxRange()((+d.class_total)),
                name: d.Application,
                colors: d.colors,
                app_group: d.app_group,
                line_total: +d.class_total,
                percent: +d.class_percent,
                tested: +d.class_tested,
                date: d.date,
                cluster: +d.groupID
//                x: Math.random() * width,
//                y: Math.random() * height

            };
            c_nodes.push(c_node);

            var l_node = {
                radius: lMaxRange()((+d.line_total)),
                name: d.Application,
                colors: d.colors,
                app_group: d.app_group,
                line_total: +d.line_total,
                percent: +d.line_percent,
                tested: +d.line_tested,
                date: d.date,
                cluster: +d.groupID
//                x: Math.random() * width,
//                y: Math.random() * height
            };
            l_nodes.push(l_node);
            var m_node = {
                radius: mMaxRange()((+d.method_total)),
                name: d.Application,
                colors: d.colors,
                app_group: d.app_group,
                line_total: +d.method_total,
                percent: +d.method_percent,
                tested: +d.method_tested,
                date: d.date,
                cluster: +d.groupID
//                x: Math.random() * width,
//                y: Math.random() * height
            };
            m_nodes.push(m_node);

        });

        l_nodes.sort(function (a, b) {
            currDate = b.date;
            return b.line_total - a.line_total;
        });
        c_nodes.sort(function (a, b) {
            return b.line_total - a.line_total;
        });
        m_nodes.sort(function (a, b) {
            return  b.line_total - a.line_total;
        });


    }


    function dataChange(nodes){

        var mCurrentNodes = nodes;
        var mDate = currDate;

        var maxRadius = d3.max(mCurrentNodes, function(d){return d.radius;});

        var m = 9; // number of distinct clusters
        var n = mCurrentNodes.length;

        var clusters = new Array(m);
        var mNodes = [];

        mCurrentNodes.forEach(function(d){
//             _.nest(d,"cluster", _.sum);
            if(d.date == mDate) {
                mNodes.push(d);

            }
//            else{mNodes.push(d);}
        });

        console.log(mNodes);

       mNodes.forEach(function(d) {clusters[d.cluster] = d;});
        //console.log(clusters);
            // var tip = d3.tip()
            // .attr('class', 'd3-tip')
            // .offset([-10, 0])
            // .html(function(d) {
            // return "" + d.role + "";
            // })

            // Use the pack layout to initialize
            d3.layout.pack()
                .sort(null)
                .size([width, height])
                .children(function(d) { return d.values; })
                .value(function(d) { return d.radius * d.radius; })
                .nodes({values: d3.nest()
                    .key(function(d) { return d.cluster; })
                    .entries(mNodes)});

        console.log(mNodes);

            var force = d3.layout.force()
                .nodes(mNodes)
                .size([width, height])
                .gravity(.02)
                .charge(0)
                .on("tick", tick)
                .start();

            // svg.call(tip);

            circles = svg.selectAll("circle")
                .data(mNodes, function (d){
                    return d.name;
                });

            circles
                .enter().append("circle")
                .style("fill",  function(d){
                  return "#"+ d.colors;
                })

//                .call(force.drag);
            .on('mouseover', function(d){
                    show_details(d,this);
            d3.select(this)
            .style("stroke","#000").style("stroke-width",function (d) {
                    return ((d.percent * 100)% d.line_total);});
            })
            .on('mouseout', function(){
                    hide_details(d,this);
            d3.select(this)
            .style("stroke","#000").style("stroke-width",0);
            })


            circles.exit().remove();

            circles.transition()
                .duration(750)
                .delay(function(d, i) { return i * 5; })
                .attrTween("r", function(d) {
                    var i = d3.interpolate(0, d.radius);
                    return function(t) { return d.radius = i(t); };
                });


        function tick(e) {
                circles
                    .each(cluster(10 * e.alpha * e.alpha))
                    .each(collide(.5))
                    .attr("cx", function(d) { return d.x; })
                    .attr("cy", function(d) { return d.y; });
            }

            // Move d to be adjacent to the cluster node.
            function cluster(alpha) {
                return function(d) {
                    var cluster = clusters[d.cluster];
//                    console.log(clusters[d.cluster]);
                    if (cluster === d) return;
                    var x = d.x - cluster.x,
                        y = d.y - cluster.y,
                        l = Math.sqrt(x * x + y * y),
                        r = d.radius + cluster.radius;
                    if (l != r) {
                        l = (l - r) / l * alpha;
                        d.x -= x *= l;
                        d.y -= y *= l;
                        cluster.x += x;
                        cluster.y += y;
                    }

                };

            }

    console.log(clusters);
        // Resolves collisions between d and all other circles.
        function collide(alpha) {
            var quadtree = d3.geom.quadtree(mNodes);
            return function(d) {
                var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
                    nx1 = d.x - r,
                    nx2 = d.x + r,
                    ny1 = d.y - r,
                    ny2 = d.y + r;
                quadtree.visit(function(quad, x1, y1, x2, y2) {
                    if (quad.point && (quad.point !== d)) {
                        var x = d.x - quad.point.x,
                            y = d.y - quad.point.y,
                            l = Math.sqrt(x * x + y * y),
                            r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
                        if (l < r) {
                            l = (l - r) / l * alpha;
                            d.x -= x *= l;
                            d.y -= y *= l;
                            quad.point.x += x;
                            quad.point.y += y;
                        }
                    }
                    return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
                });
            };
        }




        function show_details(data, i, element) {
            d3.select(element).attr("stroke", "black");
            var content = "<span class=\"name\">Title:</span><span class=\"value\">" + data.name + "</span><br/>";
            content += "<span class=\"name\">Date:</span><span class=\"value\">" + (data.date) + "</span><br/>";
            content += "<span class=\"name\">Total:</span><span class=\"value\">" + data.line_total + "</span><br/>";
            content += "<span class=\"name\">Tested:</span><span class=\"value\">" + data.tested + "</span><br/>";
            content += "<span class=\"name\">Percent:</span><span class=\"value\">" + "% " + (d3.format(".2f")(data.percent * 100)) + "</span>";

            tooltip.showTooltip(content, d3.event);
        }

        function hide_details(data, i, element) {
            d3.select(element).attr("stroke", function (d) {
                return d.colors;
            });
            tooltip.hideTooltip();
        }


    }
//end dataSwitcher()
    function showGroups(){
        //var data = currentNodes;
        var c_data = c_nodes;
        var l_data = l_nodes;
        var m_data = m_nodes;
        makeList(c_data);
        makeList(l_data);
        makeList(m_data);
        makeMenu(c_data);

        function makeList(data){
            var data = data;

            var lines = d3.selectAll("ul .options").selectAll("li")
                .data(data, function(d, i){ return d.app_group;});


            lines.enter().append("li").append("a")
                .attr("href", "#")
                .text(function (d) {
                    return d.app_group;
                })
                .on("click", groupNode);



            lines.exit().remove();

        }
        function makeMenu(mData){
            //make menu for date select
            var lines = d3.selectAll("#date-nav-list").selectAll("ul")
                .data(mData, function(d, i){ return d.date;});




            lines.enter().append("li").append("a")
                .attr("href", "#")
                .text(function (d) {
                    return d.date;
                })
                .on("click", dateNode);


            lines.sort(function(a,b){return d3.descending(a.date,b.date);});
            lines.exit().remove();

        }

    }
    function instructions() {
        textBox
            .append("g").append("text").text("This is a cluster bubble-chart showing by size the total lines of code, or class or method for each measured application." +
                " Each application group has a color group. Hover over a bubble to display the data for that application and the percentage of tests shown as a black stroke" +
                " where the width is a representation of the percentage tested compared to total. Select from the date menu to change the " +
                " date and select from the Line, Class or Method menu to view an individual application group's data.").attr("class", "info");
    }
    function setDate(date){
        //TODO create a date function that maintains the nodes date through switching from app_group view to app view
        //until a new date is selected, maybe try a string to store the curr date globally
        currDate = date;
        var lines = d3.selectAll("#vis").selectAll("h3")
            .text(currDate);


        lines.exit;
        return currDate;
    }

    function groupNode(){

        //make sure if user selects a app_group it shows data from the correct cat.
        var type =this.parentNode.parentNode.parentNode;
        type = type.children[0].innerHTML;
        //console.log(type);
        //pass the current cat. to the nodeSwitcher
        my_mod.setView(type);
        //switch nodes if necessary
        nodeSwitcher();
        var mData = currentNodes;
        console.log(mData);
        var groupNodes = [];
        var groupNode = new Node();
        var mGroup = this.innerHTML;
        var mDate = currDate;
        //isolate the nodes by app_group
        //select only the nodes of the chosen app_group and pass to dataChange()
        for(var i = 0; i < mData.length; i++){

            if(mData[i].app_group == mGroup && mData[i].date == mDate){
                groupNode = mData[i];
                groupNodes.push(groupNode);

            }
            //console.log(groupNodes);
        }
        dataChange(groupNodes);

    }
    function dateNode(){
        console.log(currDate);
        //make sure if user selects a app_group it shows data from the correct cat.
        var type =this.parentNode.parentNode.parentNode;
        type = type.children[0].innerHTML;
        //console.log(type);
        //pass the current cat. to the nodeSwitcher
        my_mod.setView(type);
        //switch nodes if necessary
        nodeSwitcher();
        var mData = currentNodes;
        var groupNodes = [];
        var groupNode = new Node();
        var mDate = this.innerHTML;
        setDate(mDate);
        //isolate the nodes by app_group
        //select only the nodes of the chosen app_group and pass to dataChange()
        for(var i = 0; i < mData.length; i++){

            if(mData[i].date == mDate){
                groupNode = mData[i];
                groupNodes.push(groupNode);

            }
            //console.log(groupNodes);
        }
        dataChange(groupNodes);

    }

    //node object superclass
    function Node() {
        this.id= "";
        this.radius= "";
        this.name= "";
        this.colors= "";
        this.app_group= "";
        this.line_total= "";
        this.percent= "";
        this.tested= "";
        this.cluster = "";
        this.date = "";
        this.x= Math.random() * 700;
        this.y= Math.random() * 700;
    }


    var my_mod = {};
    my_mod.init = function (_data) {
        custom_chart(_data);
        nodeSwitcher();
        showGroups();
        instructions();
    };

    my_mod.setView = function setView(parameters) {
        console.log(parameters);
        var view_type = parameters;
        viewType = view_type;
    };
    my_mod.nodeSwitcher = nodeSwitcher;
    my_mod.dataChange = dataChange;
    my_mod.showGroups = showGroups;

    function nodeSwitcher() {
        console.log(viewType);
        switch (viewType)

        {
            case 'class':
                currentNodes = c_nodes;
                dataChange(c_nodes);
                break;
            case 'line':
                currentNodes = l_nodes;
                dataChange(l_nodes);
                break;
            case 'method':
                currentNodes = m_nodes;
                dataChange(m_nodes);
                break;
            default:
                currentNodes = l_nodes;
                dataChange(l_nodes);
                break;

        }


    }


    return my_mod;

})(d3, CustomTooltip);