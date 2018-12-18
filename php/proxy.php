<?php

date_default_timezone_set('Europe/Berlin');


include "ConnectionDB.php";
require('MPDF57/mpdf.php');
include "phpQuery.php";
include 'PublicFunc.php';
include 'ASCENSORI/Ascensore.php';
include 'Indirizzi.php';
include 'gestioneImmagini/GestioneImmagini.php';
include 'preventivi/Preventivi.php';
include 'utente/RegistrazioneUtente.php';
include 'clienti/Clienti.php';
include 'preventivi/FunctionPreventivi.php';
require "PHPMailer/class.phpmailer.php";

$class = new $_POST['classe']();
$class->init();
echo $class->$_POST['metodo']($_POST);


?>
