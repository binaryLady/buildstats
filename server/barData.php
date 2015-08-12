<?php
$DBlink = mysqli_connect();


$sql= "
SELECT groups.colors, groups.Application, groups.app_group, test_data.class_percent, test_data.class_total,
test_data.class_tested, test_data.method_percent, test_data.method_tested, test_data.method_total, test_data.line_percent, test_data.line_tested, test_data.line_total,
test_data.date, test_data.pass, test_data.percent_pass, test_data.fail, test_data.build, test_data.deployment, test_data.migration
FROM groups
  INNER JOIN test_data
    ON test_data.Application=groups.Application
    WHERE test_data.date <> 0
  /*  AND (test_data.migration <> 0 OR test_data.build <> 0 OR test_data.deployment <> 0) */
    AND groups.app_group <> 'siebel'
    AND groups.app_group <> 'tandem';

";
$r=mysqli_query($DBlink,$sql) or die(mysqli_error($DBlink)." Q=".$sql);

$data = array();

for ( $x = 0; $x < mysqli_num_rows ($r); $x++){
    $data[] = mysqli_fetch_assoc ($r);
}
echo json_encode($data);




mysqli_close($DBlink);

?>
