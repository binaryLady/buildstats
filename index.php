<!DOCTYPE html>
<html>

<head>
    <title>Data Testing Ground</title>
    <script>
        window.jQuery || document.write(' <script src="scripts/jquery-1.11.2.min.js">
    </script>
    <script src="libs/modernizr-2.0.6.min.js"></script>
    <script src="scripts/jquery-1.11.2.min.js"></script>
    <script src="scripts/bootstrap.min.js"></script>
    <style src="styles/bootstrap.min.css"></style>
    <link rel="stylesheet" type="text/css" href="styles/styles.css">
    <!--[if IE ]>
    <style type="text/css">
        header { display: none; }
        #date {display: none;}
        #vis {display: none;}
    </style>
    <![endif]-->
    <style type="text/css">

        .detail{
            color: #999999;
            font-family: Arial;
            opacity: 0.7;
            z-index: 1;
            font-size: 16px;
        }
        .group {
            color: #999999;
            font-family: Arial;
            opacity: 0.7;
            z-index: 1;
            font-size: 24px;
        }
        .dates {
            color: #212121;
            font-family: Arial;
            opacity: 0.7;
            z-index: 1;
            font-size: 18px;
            display: block;
            float: left;
            width: auto;
            padding: 0px 8px;

        }
        #dateHolder g{
            display: block;
            float: left;
            width: auto;
        }
        .legend-items text {
            stroke: #7f7f7f;
            fill: #7f7f7f;
            font-size: 14px;
        }
        .legend rect {
           cursor: initial;
        }

        .grid path {
            z-index: 1;
        }

        rect{
            z-index:1000;
            cursor: pointer;
        }

        .pie{
            cursor: pointer;
        }
        a.tooltip {
            position: relative;
            display: inline;
        }
        a.tooltips span {
            position: absolute;
            width:140px;
            color: #FFFFFF;
            background: #080808;
            height: 60px;
            line-height: 60px;
            text-align: center;
            visibility: hidden;
            border-radius: 24px;
        }
        a.tooltips span:after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            margin-left: -8px;
            width: 0; height: 0;
            border-top: 8px solid #080808;
            border-right: 8px solid transparent;
            border-left: 8px solid transparent;
        }
        a:hover.tooltips span {
            visibility: visible;
            opacity: 0.7;
            bottom: 30px;
            left: 50%;
            margin-left: -76px;
            z-index: 999;
        }
        ul.scroll-menu {
            display: inherit !important;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            -moz-overflow-scrolling: touch;
            -ms-overflow-scrolling: touch;
            -o-overflow-scrolling: touch;
            overflow-scrolling: touch;
            height: auto;
            max-height: 500px;
            width: inherit;


        }
        #options ul.scroll-menu {
            display: inherit !important;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            -moz-overflow-scrolling: touch;
            -ms-overflow-scrolling: touch;
            -o-overflow-scrolling: touch;
            overflow-scrolling: touch;
            height: auto;
            max-height: 700px;
            width: inherit;
        }
        @media(max-height: 900px){
           #options ul.scroll-menu {
           display: inherit !important;
           overflow-x: auto;
           -webkit-overflow-scrolling: touch;
           -moz-overflow-scrolling: touch;
           -ms-overflow-scrolling: touch;
           -o-overflow-scrolling: touch;
           overflow-scrolling: touch;
           height: auto;
           max-height: 400px;
           width: inherit;
       }

        }
        .info{
            color: #212121;
            font-family: Arial;
            opacity: 0.7;
            z-index: 1;
            font-size: 16px;
            display: block;
            float: left;
            width: auto;
            padding: 0px 8px;

        }
        #dateHolder{

            position: absolute;
            top: 7%;
            left: 20%;
            width: 600px;
            height: auto;
            display: block;
            border: 4px solid #fff;
            margin: 100px;
            padding: 10px 20px;
            overflow: hidden;
            background-color: #fff;
            background-image:


            background-image: -moz-linear-gradient(top, #f6f2ec, #e2dbce); /* FF3.6 */

            filter:  progid:DXImageTransform.Microsoft.gradient(startColorStr='#f6f2ec', EndColorStr='#e2dbce'); /* IE6,IE7 */
            -ms-filter: "progid:DXImageTransform.Microsoft.gradient(startColorStr='#f6f2ec', EndColorStr='#e2dbce')"; /* IE8 */
            -webkit-box-shadow: 0 1px 4px rgba(0, 0, 0, 0.27), 0 0 40px rgba(0, 0, 0, 0.06) inset;
            -moz-box-shadow: 0 1px 4px rgba(0, 0, 0, 0.27), 0 0 40px rgba(0, 0, 0, 0.06) inset;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.27), 0 0 40px rgba(0, 0, 0, 0.06) inset;

        }
    </style>
</head>
<body>



<header>
    <div id="top-bar"><h2> Wex IT Data Visualization Tools</h2>
    </div>

    <img src="images/wex.gif" alt="wex logo" class="logo"/>
    <!---<h1>ONLINE</h1>---!>


    <?php
    $page = $_GET['page'];

    if($page == 'bubbler') {
        echo('
    <nav class=" scroll-menu">
        <ul id="main-nav-list" class="btn-group">
            <li>
                <a href="#" title="line" id="line" class="active">line</a>
                <ul class="options"></ul>
            </li>
            <li>
                <a href="#" title="class" id="class" class="">class</a>
                <ul class="options"></ul>
            </li>
            <li>
                <a href="#" title="method" id="method">method</a>
                <ul class="options"></ul>
            </li>
        </ul>
    </nav>');
    }
    if($page == 'bars'){
        echo('    <div id="nav2">
        <ul id="main-nav-list" class="btn-group">
            <p>Application Groups</p>
        </ul>
        </nav>
    </div>
    <form>
        <label><input type="radio" name="mode" value="grouped"> Grouped</label>
        <label><input type="radio" name="mode" value="stacked" checked> Stacked</label>
    </form>');

    }
    ?>
</header>
<!--[if IE]>
<h1>This project will not work in Internet Explorer 9 and below as IE does not support SVG graphics.<br />
    Please switch your browser, Google Chrome will give the best user experience</h1>
<![endif]-->
<div id="vis">

    <div id="chart">

    <div id ="options"><h3>Visualization</h3><ul  class="scroll-menu">

            <!---    <li><a href="index.php?page=bars" title="bars">Bars</a> </li>
              <li><a href="index.php?page=tree" title="tree">TreeMap</a> </li>
              <li><a href="index.php?page=treeTest" title="color tree">Color TreeMap</a> </li>
             <li><a href="axisFlow.html" title="axis flow">Axis Flow</a> </li>
            --this one is in progress-->
            <li><a href="#aboutBox" id="about">About</a> </li>
            <li><a href="index.php?page=pie" title="pie">Total Code</a> </li>
            <li><a href="index.php?page=AutomatedTest" title="auto test">Automated Test</a> </li>
            <li><a href="index.php?page=AutomatedPercent" title="auto percent">Automated Testing Percentages</a> </li>
            <li><a href="index.php?page=TestSuccess" title="Test Success">Test Success</a> </li>
            <li><a href="index.php?page=TestPercent" title="Test Success Percentages">Test Success Percentages</a> </li>
            <li><a href="index.php?page=AutomationTotal" title="Test Success">Automation Total</a> </li>
            <li><a href="index.php?page=AutomationPercent" title="Automation Percentages">Automation Percentages</a> </li>
            <li><a href="index.php?page=bubbler" title="The Bubbler">The Bubbler</a> </li>
        </ul>

    </div><!---close-group_panel-->

        </div>
    <!---popup--->
    <a href="#x" class="overlay" id="aboutBox"></a>
    <div class="popup">
        <h2>The Wex Data-Viz App</h2>
        <ul>
            <li>Created using SVG graphics and the d3.js library with the <br/>
                goal of creating a unique and interactive data visualization experience.<br/>
                Understanding data should be interesting as well as meaningful.
            </li>
            <li>Data being represented is bimonthly reporting stats of code coverage for Wex apps</li>
            <li>I am adding new functionality and components to this app on an on-going basis</li>
            <li>Please feel free to <a href="mailto:sonia.cook-broen@wexinc.com">email</a> me with questions or ideas</li>

        </ul>
        <h3>Thank you and enjoy! -Sonia</h3>
        <p>*Best viewed using Google Chrome, SVG is not available to IE9 and below.</p>
        <a class="close" href="#close"></a>

    </div>

    <div id="date">
        <ul id="date-nav-list" class="btn-group scroll-menu">
            <p>Date 1</p>
        </ul>
        <?php
        $page = $_GET['page'];

        if($page == 'AutomatedTest' || $page == 'AutomatedPercent' || $page == 'TestSuccess' || $page == 'TestPercent'
            || $page =='AutomationTotal' || $page == 'AutomationPercent'
        ) {
            echo('

        <ul id="date-nav-list2" class="btn-group scroll-menu">
            <p>Date 2</p>
        </ul>'
            );}
              if($page == 'AutomatedTest' || $page == 'AutomatedPercent' || $page == 'TestSuccess' || $page == 'TestPercent'

        ) {
            echo('

            <ul id="date-nav-list3" class="btn-group scroll-menu">
            <p>Date 3</p>
        </ul>');}
        if($page == 'AutomatedTest' || $page == 'AutomatedPercent' || $page == 'TestSuccess' || $page == 'TestPercent'
            || $page =='AutomationTotal' || $page == 'AutomationPercent'
        ) {
            echo('

                <a href="#" class="btn-group submit">submit</a>'
            );}

        if($page == 'AutomatedTest' || $page == 'AutomatedPercent' || $page == 'TestSuccess' || $page == 'TestPercent'|| $page == 'pie'
            || $page =='AutomationTotal' || $page == 'AutomationPercent') {
            echo('


           <a href="#" class="btn-group reset">reset</a>');
        }
        ?>
    </div>
</div>

<?php
    $page = $_GET['page'];
    $pages = array('bars','AutomatedTest','AutomatedPercent','TestSuccess','TestPercent','pie', 'bubbler',
    'AutomationTotal','AutomationPercent');
    if(!empty($page)) {
        if (in_array($page, $pages)) {
            $page .= '.html';
            include($page);
        }
        else{
            echo'Page Not Found. Return to <a href="index.php">Home</a>';
        }
    }
    else{
        include('pie.html');
    }

?>



<div class="tooltip" id="custom_tooltip" style="width: 240px; display: none;"></div>
</body>
</html>
