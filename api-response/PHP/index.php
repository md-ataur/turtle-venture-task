<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fetch API Request</title>
</head>
<body>
<?php
    $url = "https://gorest.co.in/public/v1/users";
    $token = "d7c01847de4c083cb154e9a533294301e9f05f93dbae7d589e42ece63226c0a3";

    $curl = curl_init($url);
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

    $headers = array(
       "Accept: application/json",
       "Authorization: Bearer {$token}",
    );
    curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);

    $resp = curl_exec($curl);
    curl_close($curl);
    // var_dump($resp);

    ?>
        <ul>
            <?php
                $users = json_decode($resp, true);
                foreach($users['data'] as $user){
                    ?>
                    <li><?php echo $user['name']?></li>
                    <?php
                }
            ?>
        </ul>
    <?php
?>
</body>
</html>