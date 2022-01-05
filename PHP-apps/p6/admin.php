<?php
    $comments = "Niciun comentariu de aprobat!<br><br>";
    $msg = "";
    
    if (isset($_POST['submit'])) {
        if (isset($_POST['approved'])) {
            $msg = "";
            $approves = $_POST['approved'];
            $conn = new mysqli('localhost', 'root', '', 'ajax');
            
            foreach ($approves as $id) {
                if (!filter_var($id, FILTER_VALIDATE_INT)) {
                    die("Something went wrong.");
                }
        
                $id = mysqli_real_escape_string($conn, $id);
        
                if (!mysqli_query($conn, "UPDATE comment SET verified = 1 WHERE id = '$id' AND verified = 0 LIMIT 1")) {
                    die("Something went wrong.");
                }
            }
            mysqli_close($conn);
        } else {
            $msg = "<span style='color: red'>Selectați cel puțin un comentariu!</span>";
        }
    } 

    $conn = new mysqli('localhost', 'root', '', 'ajax');

    $result = mysqli_query($conn, "SELECT * FROM comment WHERE verified = 0");

    if (mysqli_num_rows($result) != 0) {
        $comments = "";
    }

    if (mysqli_num_rows($result) != 0) {
        while ($row = mysqli_fetch_assoc($result)) {
            $id = $row['id'];
            $name = $row['name'];
            $comment = $row['comment'];
            $comments .= "
            <div class='comment'>
                <p class='info'><u>$name spune:</u></p>
                <p class='info'>$comment</p>
                <p class='info'>Aprobă: <input type='checkbox' name='approved[]' value='$id'/></p>
            </div>
            <br>";
        }
    }
?>

<!-- <input class='idver' name='id' value='$id' disabled> -->
<!-- <span name='id' value='$id'></span> -->

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>P6 - Admin</title>
    <link rel="stylesheet" href="style6.css">
</head>
<body>
    <div id="main">
        <p class='info' style="margin-top: 0;"><a href="http://127.0.0.1/web/lab_php/p6/login.php">Delogare...</a></p>
        <span id="title">Verificare comentarii</span>
        <p></p>

        <form method='POST'>
            <?php
                echo "<p class='info'>Selectați comentariile pentru aprobare și apoi apăsați: <input type='submit' name='submit' value='Aprobă'/></p>";
                echo "<p class='info'>$msg</p>";
                echo $comments;
            ?>
        </form>
    </div>
</body>
</html>