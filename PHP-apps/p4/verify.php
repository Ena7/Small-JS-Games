<?php
    $msg = '';

    if (isset($_GET['vkey'])) {
        $vkey = $_GET['vkey'];

        $conn = new mysqli('localhost', 'root', '', 'ajax');

        $result = mysqli_query($conn, "SELECT verified, vkey FROM account WHERE verified = 0 AND vkey = '$vkey' LIMIT 1");
        if (mysqli_num_rows($result) == 1) {
            if (mysqli_query($conn, "UPDATE account SET verified = 1 WHERE vkey = '$vkey' LIMIT 1")) {
                $msg .= "Your account has been verified. You may now login.";
            } else {
                die("Something went wrong...");
            }
        } else {
            die("Something went wrong..");
        }
    } else {
        die("Something went wrong.");
    }
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>P4 - Verify</title>
    <link rel="stylesheet" href="style4.css">
</head>
<body>
    <table>
        <tr>
            <td>
                <?php
                echo $msg;
                ?>
            </td>
        </tr>
    </table>
</body>
</html>