<?php
$DBlink = mysqli_connect();


$sql= "
SELECT groups.colors, groups.Application, groups.app_group, test_data.class_percent, test_data.class_total,
test_data.class_tested, test_data.method_percent, test_data.method_tested, test_data.method_total, test_data.line_percent, test_data.line_tested, test_data.line_total,
test_data.date, test_data.pass, test_data.percent_pass, test_data.fail
FROM groups
  INNER JOIN test_data
    ON test_data.Application=groups.Application
    WHERE test_data.date <> 0


;

";
$r=mysqli_query($DBlink,$sql) or die(mysqli_error($DBlink)." Q=".$sql);

$data = array();

for ( $x = 0; $x < mysqli_num_rows ($r); $x++){
    $data[] = mysqli_fetch_assoc ($r);
}
echo json_encode($data);




mysqli_close($DBlink);

?>
