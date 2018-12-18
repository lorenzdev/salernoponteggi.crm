<?php


$pdf = new fpdf();
		$pdf->Open();
		$pdf->AddPage();
		$pdf->Text(5, 10, 'Testo con Text()');
		$doc = $pdf->Output('', 'S');
		
		var_dump("Qui: ".$doc);
		
		/*
		$mail = new Email();
		
		$mail->destinatario = "l.vitale@live.it";
		$mail->oggetto = "Iscrizione newsletter prontoinformatico.it";
		$mail->messaggio = "<html><body>Abbiamo ricevuto una richiesta di registrazione alla newsletter di prontoinformatico.it.<br>Ti informeremo con una mail non appena i contenuti a cui sei interessato saranno disponibili.<br><br><p align='left' style='font-size:12px;'>Se non hai mai richiesto l'iscrizione alla newsletter, non sei più interessato oppure ritieni sia stato un errore, clicca su questo <a href='http://prontoinformatico.altervista.org/underconstruction/newsletter.php?delete=".$attivazione."' target='_blank'>link</a> per cancellare la tua mail dagli archivi<br><br></body></html>";
		$mail->invia();
		*/
		// invio dell'email
		$mail = new PHPMailer();
		$mail->From = 'l.vitale@live.it';
		$mail->AddReplyTo('l.vitale@live.it'); 
		$mail->FromName = 'Collaboratore Cerrato Spa';
		$mail->Subject = 'Preventivo';
		$mail->Body = 'Invio preventivo';
		$mail->AddAddress('lorenzo.dev@gmail.com');
		// definizione dell'allegato 
		$mail->AddStringAttachment($doc, 'doc.pdf', 'base64', 'application/pdf');
		// spedizione
		
		
		
		if($mail->Send()){
			var_dump("Mail inviata correttamente");
		}else{
			var_dump("Errore!");
		}

?>