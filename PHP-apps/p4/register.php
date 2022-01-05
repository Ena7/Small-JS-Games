<?php
    $msg = '';

    if (isset($_POST['submit'])) {
        $username = $_POST['username'];
        $password = $_POST['password'];
        $rpassword = $_POST['rpassword'];
        $email = $_POST['email'];

        if (strlen($username) < 5 || !preg_match('/^[a-zA-Z0-9]+$/', $username)) {
            $msg .= "<p>Username too short or invalid.</p>";
        } else {
            $conn = new mysqli('localhost', 'root', '', 'ajax');

            $username = mysqli_real_escape_string($conn, $username);
            $result = mysqli_query($conn, "SELECT * FROM account WHERE username = '$username' LIMIT 1");
            if (mysqli_num_rows($result) != 0) {
                $msg .= "<p>This username has already been taken.</p>";
            }

            mysqli_close($conn);
        }
        if (strlen($password) < 5 || !preg_match('/^[a-zA-Z0-9]+$/', $password)) {
            $msg .= "<p>Password too short or invalid.</p>";
        } else if ($password != $rpassword) {
            $msg .= "<p>Passwords do not match.</p>";
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $msg .= "<p>Invalid e-mail.</p>";
        } else {
            $conn = new mysqli('localhost', 'root', '', 'ajax');

            $email = mysqli_real_escape_string($conn, $email);
            $result = mysqli_query($conn, "SELECT * FROM account WHERE email = '$email' LIMIT 1");
            if (mysqli_num_rows($result) != 0) {
                $msg .= "<p>This email has already been used.</p>";
            }
            
            mysqli_close($conn);
        }
        if ($msg == '') {
            $conn = new mysqli('localhost', 'root', '', 'ajax');

            $password = mysqli_real_escape_string($conn, $password);
            $rpassword = mysqli_real_escape_string($conn, $rpassword);

            $vkey = md5(time().$username);
            $password = md5($password);

            if (mysqli_query($conn, "INSERT INTO account(username, password, email, vkey) VALUES('$username', '$password', '$email', '$vkey')")) {
                $subject = "Email Verification";
                $message = "<a href='http://localhost/web/lab_php/p4/verify.php?vkey=$vkey'>Activate your account</a>";
                $headers = "From: enachealexandru00@gmail.com \r\n";
                $headers .= "MIME-Version: 1.0" . "\r\n";
                $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

                mail($email, $subject, $message, $headers);

                $msg .= "<p>The registration has been successful! Please check your e-mail and access the activation link.</p>";
            } else {
                $msg .= "Something went wrong.";
            }
        }
    }
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>P4 - Register</title>
    <link rel="stylesheet" href="style4.css">
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
                <td>Repeat Password:</td>
                <td><input type="password" name="rpassword" required/></td>
            </tr>
            <tr>
                <td>E-mail:</td>
                <td><input type="email" name="email" required/></td>
            </tr>
            <tr>
                <td colspan="2" style="text-align: center;">
                    <input type="submit" name="submit" value="Register"/>
                    <button onclick="window.location.href='http://127.0.0.1/web/lab_php/p4/login.php'">Back to login...</button>
                </td>
            </tr>
        </table>
    </form>

    <?php 
        echo "<div id='msg'>$msg</div>";
    ?>

</body>
</html>