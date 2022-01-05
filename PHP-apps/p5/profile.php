<?php
    session_start();
    $username = $_SESSION['username'];
    $current_user = "";

    if (isset($_GET['current'])) {
        $current_user = $_GET['current'];
    } else {
        $current_user = $username;
    }
    
    $conn = new mysqli("localhost", "root", "", "ajax");

    $result = mysqli_query($conn, "SELECT * FROM account");

    if (mysqli_num_rows($result) != 0) {
        $users = "";
        while ($row = mysqli_fetch_assoc($result)) {
            $name = $row['username'];
            $users .= "
            <li><a href='http://127.0.0.1/web/lab_php/p5/profile.php?current=$name'>$name</a></li>";
        }
    }

    $img_error = '';
    if (isset($_POST['submit']) && isset($_FILES['image'])) {
        $img_name = $_FILES['image']['name'];
	    $img_size = $_FILES['image']['size'];
	    $tmp_name = $_FILES['image']['tmp_name'];
	    $error = $_FILES['image']['error'];

        if ($error == 0) {
            if ($img_size > 1024 * 1024) {
                $img_error = "Fișier prea mare.";
            } else {
                $img_ex = pathinfo($img_name, PATHINFO_EXTENSION);
                $img_ex_lc = strtolower($img_ex);
    
                $allowed_exs = array("jpg", "jpeg", "png"); 
    
                if (in_array($img_ex_lc, $allowed_exs)) {
                    $new_img_name = uniqid("IMG-", true) . '.' . $img_ex_lc;
                    $img_upload_path = 'images/' . $new_img_name;
                    move_uploaded_file($tmp_name, $img_upload_path);
    
                    $sql = "INSERT INTO image(username, url) VALUES('$username', '$new_img_name')";
                    mysqli_query($conn, $sql);
                } else {
                    $img_error = "Doar imaginile de tip jpg, jpeg și png sunt permise!";
                }
            }
        } else {
            $img_error = "Alegeți o imagine!";
        }
    }

    $rmv_error = "";
    if (isset($_POST['submit_remove'])) {
        if (isset($_POST['remove'])) {
            $removes = $_POST['remove'];
            foreach ($removes as $url) {
                $url = mysqli_real_escape_string($conn, $url);
        
                if (!mysqli_query($conn, "DELETE FROM image WHERE username = '$username' AND url = '$url'")) {
                    die("Something went wrong.");
                }
            }
        } else {
            $rmv_error = "Selectați cel puțin o imagine!";
        }
    } 
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>P5 - Profile</title>
    <link rel="stylesheet" href="style5.css">
</head>
<body>
    <div id='log'>
        <?php
            echo "Logat cu numele: $username. <a href='http://127.0.0.1/web/lab_php/p5/login.php'>Delogare...</a>";
        ?>
    </div>
    <br><br>
    <div id='main' class='main'>
        <div id='profile' class='main'>
            <span style="font-size: xx-large;">
                <?php
                    echo "Profilul lui: $current_user";
                ?>
            </span>
            <p>
                <?php
                    if ($current_user == $username) {
                        echo "
                        <form method='POST' enctype='multipart/form-data'>
                            Încarcă o poză: 
                            <input type='file' name='image'/>
                            <input type='submit' name='submit' value='Încarcă'/>
                            <span style='color: red'>&nbsp;$img_error</span><br>
                        </form>";
                    }
                ?> 
            </p>
            <form method='POST'>
                <?php
                    if ($current_user == $username) {
                        echo "
                        Șterge imaginile selectate: <input type='submit' name='submit_remove' value='Șterge'/>
                        <span style='color: red'>&nbsp;$rmv_error</span><br><br>";            
                    }
                ?>              
                <div class='galery'>
                    <?php
                        $images = "";
                        $result = mysqli_query($conn, "SELECT * FROM image WHERE username = '$current_user'");
                        if (mysqli_num_rows($result) != 0) {
                            $images = "";
                            while ($row = mysqli_fetch_assoc($result)) {
                                $url = $row['url'];
                                $images .= "
                                <div class='img-container'>
                                    <img class='img-size' src='images/$url'/><br>";
                                if ($current_user == $username) {
                                    $images .= "Șterge: <input type='checkbox' name='remove[]' value='$url'/>";
                                }
                                $images .= "</div>";
                            }
                        }
                        echo $images;
                    ?>
                </div>

            </form>
        </div>
        <div id='users' class='main'>
            <span style="font-size: x-large;">Alte profiluri</span>
            <ul>
                <?php
                    echo $users;
                ?>
            </ul>
        </div>
    </div>
</body>
</html>