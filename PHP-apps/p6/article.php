<?php
    $comments = "Fii primul care lasă un comentariu!<br><br>";
    $msg = "";

    if (isset($_POST['submit'])) {
        $name = $_POST['name'];
        $comment = $_POST['writecomm'];
        if (strlen($name) > 30 || strlen($name) < 3 || !preg_match('/^[a-zA-Z0-9\-]+$/', $name)) {
            $msg .= "<p style='color: red'>Nume prea scurt/lung/invalid.</p>";
        }
        if (strlen($comment) > 200 || strlen($comment) < 3) {
            $msg .= "<p style='color: red'>Comentariu prea scurt/lung.</p>";
        }
        if ($msg == "") {
            $conn = new mysqli('localhost', 'root', '', 'ajax');

            $name = mysqli_real_escape_string($conn, $name);
            $comment = mysqli_real_escape_string($conn, $comment);

            if (mysqli_query($conn, "INSERT INTO comment(name, comment) VALUES('$name', '$comment')")) {
                $msg = "<p style='color: green'>Comentariul tău a fost înregistrat! Acesta va fi verificat și aprobat.</p>";
            }

            mysqli_close($conn);
        } 
    }

    $conn = new mysqli('localhost', 'root', '', 'ajax');

    $result = mysqli_query($conn, "SELECT * FROM comment WHERE verified = 1");

    if (mysqli_num_rows($result) != 0) {
        $comments = "";
    }

    if (mysqli_num_rows($result) != 0) {
        while ($row = mysqli_fetch_assoc($result)) {
            $name = $row['name'];
            $comment = $row['comment'];
            $comments .= "
            <div class='comment'>
                <p class='info'><u>$name spune:</u></p>
                <p class='info'>$comment</p>
            </div>
            <br>";
        }
    }
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>P6 - Article</title>
    <link rel="stylesheet" href="style6.css">
</head>
<body>
    <div id="main">
    <p class='info' style="margin-top: 0; text-align: right;"><a href="http://127.0.0.1/web/lab_php/p6/login.php">Logare administrator...</a></p>
        <span id="title">Spaghete Carbonara</span>
        <p></p>
        
        <img id="carbonaraimg" src="carbonara.jpg">
        <p></p>
        
        <p class="info">Pastele alla Carbonara sunt un fel de mâncare cu o tradiție populară, realizat cu ingrediente simple și ușor accesibile; originile lor sunt incerte și referitor la acestea există mai multe versiuni, dintre care cea mai cunoscută trasează originile acestora în regiunea Lazio și, în special, în orașul Roma.</p>
        
        <ul class="info">
            <li>400 g de Spaghetti n° 5 Barilla</li>
            <li>4 gălbenușuri de ou</li>
            <li>2 cl. de ulei extra virgin de măsline</li>
            <li>150 g de gușă de porc</li>
            <li>100 g de Pecorino romano</li>
            <li>Sare și piper negru după gust</li>
        </ul>

        <ol class="info">
            <li>Într-un castron, bateți gălbenușurile de ou cu un vârf de sare și 1/3 brânză pecorino rasă.  </li>
            <li>Așezați o tigaie cu ulei pe foc de intensitate medie și, când acesta devine fierbinte, adăugați gușa tăiată fâșii și prăjiți timp de câteva minute, până când începe să prindă culoare.</li>
            <li>Între timp, fierbeți pastele în apă clocotită cu sare, iar după expirarea timpului de fierbere indicat pe cutie, scurgeți-le, adăugați-le în tigaia în care se află gușa, amestecați bine și, cu focul stins, adăugați gălbenușurile bătute, împreună cu două linguri din apa în care ați fiert pastele și amestecați timp de aproximativ 30 de secunde.</li>
            <li>Adăugați restul de Pecorino, amestecați din nou și serviți imediat, cu piper negru proaspăt măcinat presărat din belșug.</li>
        </ol>
        <h2 class="info">Lasă un comentariu.</h2>

        <form method="POST" action="">
            <p class="info">Nume: <input id="name" name="name" type="text" placeholder="Maximum 30 de caractere"/></p>
            <textarea id="writecomm" name="writecomm" placeholder="Maximum 200 de caractere" maxlength="200"></textarea>
            <br><br>
            <input type="submit" name="submit" value="Postează"/>
        </form>

        <?php
            echo $msg;
        ?>
        
        <h3 class="info">Comentarii</h3>

        <?php
            echo $comments;
        ?>

    </div>
</body>
</html>