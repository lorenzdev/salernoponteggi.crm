<?php


//$data = base64_encode(addslashes(fread(fopen($_FILES['file']['name'], "r"), filesize($_FILES['file']["size"]))));
	
$codice = $_POST["codice_carrello"];	


/*if($type != "image/jpeg" && $type != "image/png" && $type != "image/jpg"){
echo "L'immagine deve essere in formato jpg/png!";
exit();	
}


$size = $_FILES['file']['size'];
if($size > 2028000){
echo "Immagine troppo grande";
exit();	
}*/


error_reporting(E_ALL);  

//$immagine1 = file_get_contents($_FILES['file1']['tmp_name']);
//$size1 = $_FILES['file1']['size'];
//$type1 = $_FILES['file1']['type'];
//$data1 = base64_encode($immagine1);

//$immagine2 = file_get_contents($_FILES['file2']['tmp_name']);
//$size2 = $_FILES['file2']['size'];
//$type2 = $_FILES['file2']['type'];
//$data2 = base64_encode($immagine2);

//$immagine3 = file_get_contents($_FILES['file3']['tmp_name']);
//$size3 = $_FILES['file3']['size'];
//$type3 = $_FILES['file3']['type'];
//$data3 = base64_encode($immagine3);

$percorso="../../immagini_carrello/".$codice;


if(!is_dir($percorso)){
	mkdir($percorso, 0777);
	chmod($percorso, 0777);
}

//cartella sul server dove verrà spostata la foto
if($_FILES['file1']['tmp_name']){
	
	$file1=$percorso."/".$codice."_1.jpg";
	move_uploaded_file($_FILES['file1']['tmp_name'],$file1);
	chmod($file1,0777);
}

if($_FILES['file2']['tmp_name']){

	
	$file2=$percorso."/".$codice."_2.jpg";
	move_uploaded_file($_FILES['file2']['tmp_name'],$file2);
	chmod($file2,0777);
}

if($_FILES['file3']['tmp_name']){
	
	
	$file3=$percorso."/".$codice."_3.jpg";
	move_uploaded_file($_FILES['file3']['tmp_name'],$file3);
	chmod($file3,0777);
}

if($_FILES['file4']['tmp_name']){
	
	$type = ".jpg";
	
	
	
	$file4=$percorso."/".$codice."_4.jpg";
	move_uploaded_file($_FILES['file4']['tmp_name'],$file4);
	chmod($file4,0777);
}

if($_FILES['file5']['tmp_name']){
	
	
	
	$file5=$percorso."/".$codice."_5.jpg";
	move_uploaded_file($_FILES['file5']['tmp_name'],$file5);
	chmod($file5,0777);
}


return "Immagini caricate con successo!";

/*
if($immagine2){
	$file2=$percorso."/".$codice."_2.jpg";
	$inviato=file_exists($file2);
	if(!$inviato)
		move_uploaded_file($immagine2,$file2);
}

if($immagine3){
	$file3=$percorso."/".$codice."_3.jpg";
	$inviato=file_exists($file3);
	if(!$inviato)
		move_uploaded_file($immagine3,$file3);
}*/

	
/*//var_dump("INSERT INTO immagini (immagine,size,type,carrello)VALUES('".$data1."','".$size1."','".$type1."','".$codice."')");	
	
if($immagine1)	
$connect->myQuery("INSERT INTO immagini (immagine,size,type,carrello)VALUES('".$data1."','".$size1."','".$type1."','".$codice."')");

if($immagine2)	
$connect->myQuery("INSERT INTO immagini (immagine,size,type,carrello)VALUES('".$data2."','".$size2."','".$type2."','".$codice."')");

if($immagine3)	
$connect->myQuery("INSERT INTO immagini (immagine,size,type,carrello)VALUES('".$data3."','".$size3."','".$type3."','".$codice."')");
*/


?>