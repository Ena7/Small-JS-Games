<?php
$msg = '';

if (isset($_POST['submit'])) {
    $conn = new mysqli('localhost', 'root', '', 'ajax');

    $username = mysqli_real_escape_string($conn, $_POST['username']);
    $password = mysqli_real_escape_string($conn, $_POST['password']);
    $password = md5($password);

    $result = mysqli_query($conn, "SELECT * FROM account WHERE username = '$username' AND password = '$password' LIMIT 1");

    if (mysqli_num_rows($result) != 0) {
        header("location: http://127.0.0.1/web/lab_php/p6/admin.php");
    } else {
        $msg = "<span style='color: red'>Autentificarea a eșuat!</span>";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>P6 - Login</title>
    <link rel="stylesheet" href="loginstyle.css">
</head>
<body>

    <form method="POST" action="">
        <table cellpadding = "10">
            <tr>
                <td>Username:</td>
                <td><input type="text" name="username" required/></td>
            </tr>
            <tr>
                <td>Password:</td>
                <td><input type="password" name="password" required/></td>
            </tr>
            <tr>
                <td colspan="2" style="text-align: center;">
                    <input type="submit" name="submit" value="Login"/>
                    <button onclick="window.location.href='http://127.0.0.1/web/lab_php/p6/article.php'">Către articol</button>
                </td>
            </tr>
        </table>
    </form>

    <br></br>

    <?php 
    echo "<div id='msg'>$msg</div>";
    ?>

</body>
</html>