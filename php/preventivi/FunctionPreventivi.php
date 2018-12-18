<?php

include "ArticoloAscensore.php";

class FunctionPreventivi{

	private $costiTrasporto = 0;
	private $costiDistribuzioneV = 0;
	private $costiDistribuzioneO = 0;
	private $costiMontaggioM = 0;
	private $costiMontaggioE = 0;
	private $costiMontaggioS = 0;
	public $importoMerceScontata = 0;

	private $mailAdmin = "info@cerratospa.com";
	private $link_login = "http://www.cerratospa.com/areariservata/index.html";
	private $SMTPAuth = true;     // turn on SMTP authentication
	private $SMTPSecure = "ssl";
	private $Host='smtp.gmail.com';
	private $Port = '465';
	private $SMTPKeepAlive = true;
	private $SMTPDebug = 1;
	private $Username = "lorenzo.dev@gmail.com";  // SMTP username
	private $Password = "neonato2000";
	private $ArticoloBasculante;
	private $ArticoloPortaCantina;
	private $ArticoloPortaMultiuso;
	private $ArticoloPortaTagliafuoco;
	public $max_righe_x_pagina = 25;

	public $valori;

	public $cont = 0;

	public function init(){}

	public function inviaPreventivo($post){

		$myPdf = $this->processPreventivo($post);
		$doc = $myPdf->Output('','s');


		$referente = json_decode($post["referente"]);

		//var_dump($referente->{"email_referente"});

		// invio dell'email
		$objJSON =  array();
		$objJSON["success"] = false;
		$objJSON["message"] = "Operazione non riuscita";

		$emails = array(2);

		if (filter_var($referente->{"email"}, FILTER_VALIDATE_EMAIL)) {
    		$emails[0] = $referente->{"email"};
		}


		if (filter_var($referente->{"email_referente"}, FILTER_VALIDATE_EMAIL)) {
    		$emails[1] = $referente->{"email_referente"};
		}

		//	var_dump($emails[0]." ".$emails[1]);

		try{
		for($i = 0;$i < count($emails);$i++){
			//var_dump($emails[$i]);
			$mail = new PHPMailer();
			$mail->IsHTML(true);
			$mail->IsSMTP();
			$mail->SMTPAuth = $this->SMTPAuth;     // turn on SMTP authentication
			$mail->SMTPSecure = $this->SMTPSecure;
			$mail->Host = $this->Host;
			$mail->Port = $this->Port;
			$mail->SMTPKeepAlive = $this->SMTPKeepAlive;
			$mail->SMTPDebug = $this->SMTPDebug;
			$mail->Username = $this->Username;  // SMTP username
			$mail->Password = $this->Password;
			$mail->AddReplyTo($this->mailAdmin);
			$mail->FromName = "Salerno Ponteggi srl";
			$mail->Subject = "Preventivo di spesa";
			$mail->Body = "Le invio copia del preventivo richiesto. Cordiali Saluti";
			$mail->AddAddress($emails[$i]);
			$mail->AddStringAttachment($doc, 'preventivo.pdf', 'base64', 'application/pdf');


				if($mail->Send()){
					$objJSON["success"] = true;
					$objJSON["message"] = "Mail inviata correttamente";
				}else{
					$objJSON["success"] = false;
					$objJSON["message"] = "Operazione non riuscita";
				}



			$mail->SmtpClose();
		}

		}catch (phpmailerException $e)
				{
				  var_dump('error---->PHPMailer error: '.$e->errorMessage() );
				}


		// spedizione

		return json_encode($objJSON);
	}


	public function invioPreventivoPerApprovazione($post){

		//var_dump($post);

		//$dataIns = date($post["data_inserimento"]);

		$objJSON =  array();
		$objJSON["success"] = false;
		$objJSON["message"] = "Operazione non riuscita";

		$emails = array();

		$mail = new PHPMailer();
		$mail->IsHTML(true);
		$mail->IsSMTP();
		$mail->SMTPAuth = $this->SMTPAuth;     // turn on SMTP authentication
		$mail->SMTPSecure = $this->SMTPSecure;
		$mail->Host = $this->Host;
		$mail->Port = $this->Port;
		$mail->SMTPKeepAlive = $this->SMTPKeepAlive;
		$mail->SMTPDebug = $this->SMTPDebug;
		$mail->Username = $this->Username;  // SMTP username
		$mail->Password = $this->Password;
		//destinatario
		$mail->AddAddress($this->mailAdmin);

		//mittente
		$mail->AddReplyTo($post["account"]);
		$mail->FromName = $post["nome"]." ".$post["cognome"];
		$mail->Subject = "Preventivo per approvazione";
		$mail->Body = "Notifica di inserimento preventivo per approvazione da parte dell'utente ".$post["nome"]." ".$post["cognome"]."<br>Codice preventivo: ".$post["codice_preventivo"]."<br>Data inserimento: ".$post["data_inserimento"];


		if($mail->Send()){
			$objJSON["success"] = true;
			$objJSON["message"] = "Mail inviata correttamente";
		}

		$mail->SmtpClose();
		return json_encode($objJSON);
	}


	public function generaPreviewPreventivoPdf($post){



		$mpdf = $this->getPreventivoPDF($post);


		$objJSON = array();
		$objJSON["success"] = true;
		$objJSON["message"] = "Operazione riuscita";

		/*
		$path_file = "preventivi/nr_".$post['preventivo']['numero']."_".$post['preventivo']['anno'].".pdf";
		//$mpdf->Output("../".$path_file,'F');
		*/
		$doc = $mpdf->Output('','S');
		$doc_prev = base64_encode($doc);


		$objJSON["preventivo"] = $doc_prev;
		$objJSON["path_pdf"] = $path_file;

		return json_encode($objJSON);
	}

	public function generaPreviewmoduloRilievoPdf($post){


		$mod = $this->getModuloRilievoPDF($post);


		$objJSON = array();
		$objJSON["success"] = true;
		$objJSON["message"] = "Operazione riuscita";

		/*
		$path_file = "preventivi/nr_".$post['preventivo']['numero']."_".$post['preventivo']['anno'].".pdf";
		//$mpdf->Output("../".$path_file,'F');
		*/
		$doc2 = $mod->Output('','S');
		$doc_mod = base64_encode($doc2);


		$objJSON["modulo_rilievo"] = $doc_mod;
		$objJSON["path_pdf"] = $path_file;

		return json_encode($objJSON);
	}

	private function getPreventivoPDF($post){



		$preventivo = $post["preventivo"];


 		//Create an instance of the class:
		$mpdf_support=new mPDF('',
		'A4',    // format - A4, for example, default ''
 0,     // font size - default 0
 '',    // default font family
 0,    // margin_left
 0,    // margin right
 0,     // margin top
 0,    // margin bottom
 0,     // margin header
 0,     // margin footer
 'L');





 		//$mpdf = new \Mpdf\Mpdf();

		$mpdf_support->ignore_invalid_utf8 = true;

		$body = file_get_contents("../htmls/templates/preventivi/body.html");
		$doc = phpQuery::newDocument($body);

		$doc->find("#agente")->html($preventivo["cliente"]["nome_agente_cliente"]." ".$preventivo["cliente"]["cognome_agente_cliente"]);
		$doc->find("#resp_area")->html($preventivo["cliente"]["capo_area_cliente"]);

		$doc->find("#data")->html(date("d/m/Y",$preventivo["data"]));
		$doc->find("#numero_documento")->html($preventivo["codice"]);

		$doc->find("#codice_cliente")->html($preventivo["cliente"]["codice_cliente"]);
		$doc->find("#rif_ordine")->html($preventivo["codice"]);

		$doc->find("#ragione_sociale")->html($preventivo["cliente"]["ragione_sociale_cliente"]);
		$doc->find("#indirizzo")->html($preventivo["cliente"]["indirizzo_cliente"]);
		$doc->find("#civico")->html($preventivo["cliente"]["civico_cliente"]);
		$doc->find("#citta")->html($preventivo["cliente"]["comune_cliente"]);
		$doc->find("#cap")->html($preventivo["cliente"]["cap_cliente"]);
		$doc->find("#email")->html($preventivo["cliente"]["email_cliente"]);
		$doc->find("#provincia")->html($preventivo["cliente"]["provincia_sigla_cliente"]);
		if($preventivo["cliente"]["partita_iva_cliente"])
			$doc->find("#partita_iva")->html($preventivo["cliente"]["partita_iva_cliente"]);
			else if($preventivo["cliente"]["codice_fiscale_cliente"])
				$doc->find("#partita_iva")->html($preventivo["cliente"]["codice_fiscale_cliente"]);
		$doc->find("#telefono")->html($preventivo["cliente"]["telefono_cliente"]);
		
		$doc->find("#vettore")->html($preventivo["vettore"]);
		$doc->find("#nota")->html($preventivo["nota"]);

		$luogo_destinazione = "";
		if($preventivo["cantiere"]["indirizzo_cantiere"])
		$luogo_destinazione .= "Indirizzo: ".$preventivo["cantiere"]["indirizzo_cantiere"].", ";
		
		if($preventivo["cantiere"]["comune_cantiere"])
		$luogo_destinazione .= "Comune: ".$preventivo["cantiere"]["comune_cantiere"].", ";
		
		if($preventivo["cantiere"]["provincia_sigla_cantiere"])
		$luogo_destinazione .= "Provincia: ".$preventivo["cantiere"]["provincia_sigla_cantiere"].", ";
		
		if($preventivo["cantiere"]["referente_cantiere"])
		$luogo_destinazione .= "Referente: ".$preventivo["cantiere"]["referente_cantiere"].", ";
		
		if($preventivo["cantiere"]["cellulare_referente_cantiere"])
		$luogo_destinazione .= "Cellulare: ".$preventivo["cantiere"]["cellulare_referente_cantiere"].", ";
		
		if($preventivo["cantiere"]["email_referente_cantiere"])
		$luogo_destinazione .= "Email: ".$preventivo["cantiere"]["email_referente_cantiere"];

		$doc->find("#luogo_destinazione")->html($luogo_destinazione);


		/*
		$doc->find("#indirizzo_cantiere")->html($preventivo["cantiere"]["indirizzo_cantiere"]);
		$doc->find("#citta_cantiere")->html($preventivo["cantiere"]["comune_cantiere"]);
		$doc->find("#provincia_cantiere")->html($preventivo["cantiere"]["provincia_sigla_cantiere"]);
		$doc->find("#referente")->html($preventivo["cantiere"]["referente_cantiere"]);
		$doc->find("#cellulare_referente")->html($preventivo["cantiere"]["cellulare_referente_cantiere"]);
		$doc->find("#email_referente")->html($preventivo["cantiere"]["email_referente_cantiere"]);
		//$doc->find("#footer_ragione_sociale")->html((string)$xml->cliente);
		*/

		// INSERIMENTO ARTICOLI
		$html = "";
		for($i = 0;$i < count($preventivo["carrello"]);$i++){

			$articolo = $preventivo["carrello"][$i]["descrizione"];
			$tipologia = $articolo["articolo"]["tipologia"];

			switch($tipologia){

				case 'Ascensore': 		$this->ArticoloAscensore = new ArticoloAscensore();
										$this->ArticoloAscensore->init($this);
										$html .= $this->ArticoloAscensore->get($articolo, $i, $doc);
										break;
				default: break;
			}

		}


		$doc->find("#articoli")->html($html);
		
		$numero_settimana = "";
		$anno_settimana = "";

		if($preventivo["servizi"]["numero_settimana"]){
			$numero_settimana = $preventivo["servizi"]["numero_settimana"];
			$anno_settimana = $preventivo["servizi"]["anno_settimana"];
		}else if($preventivo["numero_settimana"]){
			$numero_settimana = $preventivo["numero_settimana"];
			$anno_settimana = $preventivo["anno_settimana"];
		}

		if($numero_settimana){

			// CALCOLO L'ULTIMO GIORNO DELLA SETTIMANA N.
			function getStartAndEndDate($week, $year) {
			  $dto = new DateTime();
			  $dto->setISODate($year, $week);
			  $ret['week_start'] = $dto->format('d/m/Y');
			  $dto->modify('+6 days');
			  $ret['week_end'] = $dto->format('d/m/Y');
			  return $ret;
			}

			$week_array = getStartAndEndDate(($numero_settimana?$numero_settimana:0),$anno_settimana);
			$doc->find("#data_consegna")->html($week_array['week_end']);
		}



		//$this->completaGriglia($doc,$this->max_righe_x_pagina);

		$mpdf_support->WriteHTML($doc->htmlOuter());

		//var_dump($mpdf_support->y." ".$mpdf_support->h);
		$changeHeader = false;
		if($mpdf_support->y >= 225){
			$doc->find("#new_page")->html("<pagebreak />");
		}


				//Create an instance of the class:
		$mpdf=new mPDF('',
		'A4',    // format - A4, for example, default ''
 0,     // font size - default 0
 '',    // default font family
 0,    // margin_left
 0,    // margin right
 0,     // margin top
0,    // margin bottom
 0,     // margin header
 0,     // margin footer
 'L');

		$footer = file_get_contents("../htmls/templates/preventivi/footer.html");
		$doc_footer = phpQuery::newDocument($footer);

		$mpdf->ignore_invalid_utf8 = true;


		$modalita_pagamento = "";
		switch($preventivo["cliente"]["modalita_pagamento_cliente"]){
				case '5': $modalita_pagamento =  "NR. 1 R.B. 60 GG. F.M.";break;
				case '11': $modalita_pagamento =  "NR. 1 R.B. A 90 GG. F.M.";break;
				case '13': $modalita_pagamento =  "NR. 2 R. B. 30-60 GG. FM";break;
				case '16': $modalita_pagamento =  "ALLA CONSEGNA CON VS. TITOLO";break;
				case '32': $modalita_pagamento =  "30%+IVA ACC, RESTO TITOLO SCARI";break;
				case '35': $modalita_pagamento =  "CON VS. ASS. AD AVVISO MERCE PRO";break;
				case '64': $modalita_pagamento =  "BONIFICO BANCARIO A 60gg";break;
				case '68': $modalita_pagamento =  "BONIFICO A 30gg";break;
				default: $modalita_pagamento = $preventivo["cliente"]["mod_altro_pagamento_cliente"];
		}



		$doc_footer->find("#modalita_pagamento")->html($modalita_pagamento);
		$doc_footer->find("#banca")->html($preventivo["cliente"]["banca_cliente"]);
		$doc_footer->find("#agenzia")->html($preventivo["cliente"]["agenzia_cliente"]);
		$doc_footer->find("#abi")->html($preventivo["cliente"]["abi_cliente"]);
		$doc_footer->find("#cab")->html($preventivo["cliente"]["cab_cliente"]);
		$doc_footer->find("#iban")->html($preventivo["cliente"]["iban_cliente"]);

		
		$doc_footer->find("#autore")->html($preventivo["nome_compilatore"]." ".$preventivo["cognome_compilatore"]);

		$doc_footer->find("#imponibile")->html("EUR ".@number_format($preventivo["totale"], 2, ',','.'));
		$doc_footer->find("#sconto")->html($preventivo["sconto"]);
		$doc_footer->find("#ulteriore_sconto")->html($preventivo["ulteriore_sconto"]);
		$doc_footer->find("#iva")->html($preventivo["iva"]);
		$doc_footer->find("#totale_scontato")->html("EUR ".@number_format($preventivo["totaleScontato"], 2, ',','.'));
		$doc_footer->find("#costo_trasporto")->html("EUR ".@number_format($preventivo["totaleCostiTrasporto"], 2, ',','.'));
		$doc_footer->find("#costo_montaggio")->html("EUR ".@number_format($preventivo["totaleCostiMontaggio"], 2, ',','.'));

		$doc_footer->find("#importo_iva")->html("EUR ".@number_format($preventivo["totaleIva"], 2, ',','.'));
		$doc_footer->find("#netto_a_pagare")->html("EUR <b>".@number_format($preventivo["nettoAPagare"], 2, ',','.')."</b>");
		$doc_footer->find("#totale_preventivo")->html("EUR <b>".@number_format($preventivo["nettoAPagare"], 2, ',','.')."</b>");

		$mpdf->WriteHTML($doc->htmlOuter());

		$mpdf->SetHTMLFooter($doc_footer->htmlOuter());
		
		/*
		// ALLEGA IL CONTRATTO
		$mpdf->WriteHTML("<pagebreak page-selector=\"contratto\"/>");

		
		$contratto = file_get_contents("../htmls/templates/preventivi/contratto.html");
		$doc_contratto = phpQuery::newDocument($contratto);
		$mpdf->WriteHTML($doc_contratto->htmlOuter());
		*/
		
		return $mpdf;
		//$mpdf->WriteHTML($carta_intestata);

	}


	public function completaGriglia($doc, $num){

		$html = "";

		for($i = 0;$i < $num;$i++){

				$html .= "<tr>";

				//RIFERIMENTO
				$html .= "<td style=\"width:43px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				$html .= "</td>";

				// CODICE
				$html .= "<td style=\"width:76px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;\">";
				$html .= "</td>";

				// DESCRIZIONE
				$html .= "<td style=\"width:297px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;\">";
				$html .= "</td>";

				// NUMERO
				$html .= "<td style=\"width:35px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				$html .= "</td>";

				// LARGHEZZA
				$html .= "<td style=\"width:45px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				$html .= "</td>";

				// ALTEZZA
				$html .= "<td style=\"width:46px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				$html .= "</td>";

				// UNITA' DI MISURA
				$html .= "<td style=\"width:34px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				$html .= "</td>";

				// TOTALE
				$html .= "<td style=\"width:42px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				$html .= "</td>";

				// PREZZO UNITARIO
				$html .= "<td style=\"width:76px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:right;\">";
				$html .= "</td>";

				// SCONTO
				$html .= "<td style=\"width:27px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:right;\">";
				$html .= "</td>";

				// PREZZO TOTALE
				$html .= "<td style=\"width:71px;background-color:#fff;padding:5px;height:30px;border-bottom:1px solid #666;text-align:right;\">";
				$html .= "</td>";

				$html .= "</tr>";
			}

		$doc->find("#articoli")->append($html);

	}


	private function getModuloRilievoPDF($post){

		$preventivo = $post["preventivo"];


		//Create an instance of the class:
		$mpdf=new mPDF('',
		'A4-L',    // format - A4, for example, default ''
 0,     // font size - default 0
 '',    // default font family
 0,    // margin_left
 0,    // margin right
 0,     // margin top
0,    // margin bottom
 0,     // margin header
 0,     // margin footer
 'L');


 		//$mpdf = new \Mpdf\Mpdf();

		$mpdf->ignore_invalid_utf8 = true;

		$body = file_get_contents("../htmls/templates/preventivi/mod_ril.html");
		$doc = phpQuery::newDocument($body);


		// INSERIMENTO ARTICOLI
		$html = "";
		for($i = 0;$i < count($preventivo["carrello"]);$i++){

			$articolo = $preventivo["carrello"][$i]["descrizione"];
			$tipologia = $articolo["tipologia"];


			switch($tipologia){

				case 'Basculante': 		$this->ArticoloBasculante = new ArticoloBasculante();
										$this->ArticoloBasculante->init($this);
										$html .= $this->ArticoloBasculante->getModulo($articolo, $i);
										break;
				default: break;
			}

		}

		$doc->find("#articoli")->html($html);



		$doc->find("#ragione_sociale")->html($preventivo["cliente"]["ragione_sociale_cliente"]);
		$doc->find("#indirizzo_cantiere")->html($preventivo["cantiere"]["indirizzo_cantiere"]);
		$doc->find("#citta_cantiere")->html($preventivo["cantiere"]["comune_cantiere"]);
		$doc->find("#provincia_cantiere")->html($preventivo["cantiere"]["provincia_sigla_cantiere"]);
		$doc->find("#referente")->html($preventivo["cantiere"]["referente_cantiere"]);
		$doc->find("#cellulare_referente")->html($preventivo["cantiere"]["cellulare_referente_cantiere"]);
		$doc->find("#email_referente")->html($preventivo["cantiere"]["email_referente_cantiere"]);

		/*
		$doc->find("#agente")->html($preventivo["cliente"]["nome_agente_cliente"]." ".$preventivo["cliente"]["cognome_agente_cliente"]);
		$doc->find("#resp_area")->html($preventivo["cliente"]["capo_area_cliente"]);

		$doc->find("#data")->html(date("d/m/Y",$preventivo["data"]));

		$doc->find("#codice_cliente")->html($preventivo["cliente"]["codice_cliente"]);
		$doc->find("#rif_ordine")->html($preventivo["codice"]);


		$doc->find("#indirizzo")->html($preventivo["cliente"]["indirizzo_cliente"]);
		$doc->find("#civico")->html($preventivo["cliente"]["civico_cliente"]);
		$doc->find("#citta")->html($preventivo["cliente"]["comune_cliente"]);
		$doc->find("#cap")->html($preventivo["cliente"]["cap_cliente"]);
		$doc->find("#email")->html($preventivo["cliente"]["email_cliente"]);
		$doc->find("#provincia")->html($preventivo["cliente"]["provincia_sigla_cliente"]);
		$doc->find("#partita_iva")->html($preventivo["cliente"]["partita_iva_cliente"]);
		$doc->find("#codice_fiscale")->html($preventivo["cliente"]["codice_fiscale_cliente"]);
		$doc->find("#telefono")->html($preventivo["cliente"]["telefono_cliente"]);

		$doc->find("#indirizzo_cantiere")->html($preventivo["cantiere"]["indirizzo_cantiere"]);
		$doc->find("#citta_cantiere")->html($preventivo["cantiere"]["comune_cantiere"]);
		$doc->find("#provincia_cantiere")->html($preventivo["cantiere"]["provincia_sigla_cantiere"]);
		$doc->find("#referente")->html($preventivo["cantiere"]["referente_cantiere"]);
		$doc->find("#cellulare_referente")->html($preventivo["cantiere"]["cellulare_referente_cantiere"]);
		$doc->find("#email_referente")->html($preventivo["cantiere"]["email_referente_cantiere"]);
		//$doc->find("#footer_ragione_sociale")->html((string)$xml->cliente);


		// INSERIMENTO ARTICOLI
		$html = "";
		for($i = 0;$i < count($preventivo["carrello"]);$i++){

			$articolo = $preventivo["carrello"][$i]["descrizione"];
			$tipologia = $articolo["tipologia"];


			switch($tipologia){

				case 'Basculante': 		$this->ArticoloBasculante = new ArticoloBasculante();
										$this->ArticoloBasculante->init($this);
										$html .= $this->ArticoloBasculante->get($articolo, $i, $doc);//
										break;
				case 'PortaCantina':	$this->ArticoloPortaCantina = new ArticoloPortaCantina();
										$this->ArticoloPortaCantina->init($this);
										$html .= $this->ArticoloPortaCantina->get($articolo, $i, $doc);
										break;
				case 'PortaMultiuso':	$this->ArticoloPortaMultiuso = new ArticoloPortaMultiuso();
										$this->ArticoloPortaMultiuso->init($this);
										$html .= $this->ArticoloPortaMultiuso->get($articolo, $i, $doc);
										break;
				case 'PortaTagliafuoco':$this->ArticoloPortaTagliafuoco = new ArticoloPortaTagliafuoco();
										$this->ArticoloPortaTagliafuoco->init($this);
										$html .= $this->ArticoloPortaTagliafuoco->get($articolo, $i, $doc);
										break;
				case 'Sezionale':		$this->ArticoloSezionale = new ArticoloSezionale();
										$this->ArticoloSezionale->init($this);
										$html .= $this->ArticoloSezionale->get($articolo, $i, $doc);
										break;
				default: break;
			}

		}

		$doc->find("#articoli")->html($html);

		//$this->completaGriglia($doc,$this->max_righe_x_pagina);

		*/

		$footer = file_get_contents("../htmls/templates/preventivi/mod_ril_footer.html");
		$doc_footer = phpQuery::newDocument($footer);


		/*
		$modalita_pagamento = "";
		switch($preventivo["cliente"]["modalita_pagamento_cliente"]){
			case '5': $modalita_pagamento =  "NR. 1 R.B. 60 GG. F.M.";break;
			case '11': $modalita_pagamento =  "NR. 1 R.B. A 90 GG. F.M.";break;
			case '13': $modalita_pagamento =  "NR. 2 R. B. 30-60 GG. FM";break;
			case '16': $modalita_pagamento =  "ALLA CONSEGNA CON VS. TITOLO";break;
			case '32': $modalita_pagamento =  "30%+IVA ACC, RESTO TITOLO SCARI";break;
			case '35': $modalita_pagamento =  "CON VS. ASS. AD AVVISO MERCE PRO";break;
			case '64': $modalita_pagamento =  "BONIFICO BANCARIO A 60gg";break;
			case '68': $modalita_pagamento =  "BONIFICO A 30gg";break;
		}


		$doc_footer->find("#modalita_pagamento")->html($modalita_pagamento);
		$doc_footer->find("#banca")->html($preventivo["cliente"]["banca_cliente"]);
		$doc_footer->find("#agenzia")->html($preventivo["cliente"]["agenzia_cliente"]);
		$doc_footer->find("#abi")->html($preventivo["cliente"]["abi_cliente"]);
		$doc_footer->find("#cab")->html($preventivo["cliente"]["cab_cliente"]);
		$doc_footer->find("#iban")->html($preventivo["cliente"]["iban_cliente"]);


		$numero_settimana = "";

		if($preventivo["servizi"]["numero_settimana"]){
			$numero_settimana = $preventivo["servizi"]["numero_settimana"];
		}else if($preventivo["numero_settimana"]){
			$numero_settimana = $preventivo["numero_settimana"];
		}

		if($numero_settimana){

			$doc_footer->find("#numero_settimana")->html($numero_settimana);

			// CALCOLO L'ULTIMO GIORNO DELLA SETTIMANA N.
			function getStartAndEndDate($week, $year) {
			  $dto = new DateTime();
			  $dto->setISODate($year, $week);
			  $ret['week_start'] = $dto->format('d/m/Y');
			  $dto->modify('+6 days');
			  $ret['week_end'] = $dto->format('d/m/Y');
			  return $ret;
			}

			$week_array = getStartAndEndDate(($numero_settimana?$numero_settimana:0),date("Y"));
			$doc_footer->find("#data_consegna")->html($week_array['week_end']);
		}

		$doc_footer->find("#autore")->html($preventivo["nome_compilatore"]." ".$preventivo["cognome_compilatore"]);

		$doc_footer->find("#imponibile")->html(@number_format($preventivo["totale"], 2, ',','.'));
		$doc_footer->find("#sconto")->html($preventivo["sconto"]);
		$doc_footer->find("#iva")->html($preventivo["iva"]);
		$doc_footer->find("#totale_scontato")->html(@number_format($preventivo["totaleFornituraScontata"], 2, ',','.'));
		$doc_footer->find("#costo_trasporto")->html(@number_format($preventivo["totaleCostiTrasporto"], 2, ',','.'));
		$doc_footer->find("#costo_distribuzione_orizzontale")->html(@number_format($preventivo["totaleCostiDistribuzioneOrizzontale"], 2, ',','.'));
		$doc_footer->find("#costo_distribuzione_verticale")->html(@number_format($preventivo["totaleCostiDistribuzioneVerticale"], 2, ',','.'));
		$doc_footer->find("#costo_montaggio_meccanica")->html(@number_format($preventivo["totaleCostiMontaggioMeccanica"], 2, ',','.'));
		$doc_footer->find("#costo_montaggio_elettrica")->html(@number_format($preventivo["totaleCostiMontaggioElettrica"], 2, ',','.'));
		$doc_footer->find("#costo_montaggio_sopraluce")->html(@number_format($preventivo["totaleCostiMontaggioSopraluce"], 2, ',','.'));

		$doc_footer->find("#totale")->html(@number_format($preventivo["totalePreventivo"], 2, ',','.'));
		$doc_footer->find("#totale_iva")->html(@number_format($preventivo["totaleIva"], 2, ',','.'));
		$doc_footer->find("#totale_fornitura")->html("<b>".@number_format($preventivo["totalePreventivoIvato"], 2, ',','.')."</b>");
		*/
		$mpdf->WriteHTML($doc->htmlOuter());
		$mpdf->SetHTMLFooter($doc_footer->htmlOuter());

		return $mpdf;
		//$mpdf->WriteHTML($carta_intestata);

	}


	public function generaPreviewPdf1($post){


		$myPdf = $this->processPreventivo($post);
		$doc = $myPdf->Output('','s');
		$myDoc = base64_encode($doc);

		$objJSON = array();
		$objJSON["success"] = true;
		$objJSON["message"] = "Operazione riuscita";
		$objJSON["documento"] = $myDoc;

		return json_encode($objJSON);
	}


	private function getArticoli($preventivo, $referente){

		$this->importoMerceScontata = 0;
		$carrello = $preventivo->{"carrello"};
		$this->valori = $objJSON["carrello"];

		for($i = 0;$i < count($carrello);$i++){

			$articolo = json_decode($carrello[$i]->{"descrizione"});

			$tipologia = $articolo->{"tipologia"};

			//var_dump($tipologia);

			switch($tipologia){

				case 'Basculante': 		$this->ArticoloBasculante = new ArticoloBasculante();
										$this->ArticoloBasculante->init($this);
										$this->ArticoloBasculante->get($articolo, $referente);
										break;
				case 'PortaCantina':	$this->ArticoloPortaCantina = new ArticoloPortaCantina();
										$this->ArticoloPortaCantina->init($this);
										$this->ArticoloPortaCantina->get($articolo, $referente);
										break;
				case 'PortaMultiuso':	$this->ArticoloPortaMultiuso = new ArticoloPortaMultiuso();
										$this->ArticoloPortaMultiuso->init($this);
										$this->ArticoloPortaMultiuso->get($articolo, $referente);
										break;
				case 'PortaTagliafuoco':$this->ArticoloPortaTagliafuoco = new ArticoloPortaTagliafuoco();
										$this->ArticoloPortaTagliafuoco->init($this);
										$this->ArticoloPortaTagliafuoco->get($articolo, $referente);
										break;
				case 'Sezionale':		$this->ArticoloSezionale = new ArticoloSezionale();
										$this->ArticoloSezionale->init($this);
										$this->ArticoloSezionale->get($articolo, $referente);
										break;
				default: break;
			}



		}


	//var_dump($preventivo->{"servizi"}->{"trasporto"});



	//Costi trasporto
	if(count($preventivo->{"servizi"}->{"trasporto"}) > 0){
		$this->valori["carrello"][$this->cont]["codice"] = "\n";
		$this->valori["carrello"][$this->cont]["descrizione"] = "\nCOSTI DI TRASPORTO";
		$this->valori["carrello"][$this->cont]["riferimento"] = "\n";
		$this->valori["carrello"][$this->cont]["um"] = "\n";
		$this->valori["carrello"][$this->cont]["quantita"] = "\n";
		$this->valori["carrello"][$this->cont]["L"] = "\n";
		$this->valori["carrello"][$this->cont]["H"] = "\n";
		$this->valori["carrello"][$this->cont]["sconto"] = "\n";
		$this->valori["carrello"][$this->cont]["num"] = "\n";
		$this->valori["carrello"][$this->cont]["importo_netto"] = "\n";
		$this->valori["carrello"][$this->cont]["prezzo_unitario"] = "\n";
		$this->valori["carrello"][$this->cont]["iva"] = "\n";
		$this->valori["carrello"][$this->cont]["sconto2"] = "\n";
		$this->cont++;
	}

	for($i = 0;$i < count($preventivo->{"servizi"}->{"trasporto"});$i++){
		//var_dump(number_format(round($preventivo->{"servizi"}->{"trasporto"}[$i]->{"prezzo"},2), 2, ',', '.'));
		$this->valori["carrello"][$this->cont]["codice"] =$preventivo->{"servizi"}->{"trasporto"}[$i]->{"codice"};
		$this->valori["carrello"][$this->cont]["descrizione"] = $preventivo->{"servizi"}->{"trasporto"}[$i]->{"nome"};
		$this->valori["carrello"][$this->cont]["um"] = "";
		$this->valori["carrello"][$this->cont]["quantita"] = $preventivo->{"servizi"}->{"trasporto"}[$i]->{"quantita"};
		$this->valori["carrello"][$this->cont]["L"] = "";
		$this->valori["carrello"][$this->cont]["H"] = "";
		$this->valori["carrello"][$this->cont]["num"] = "";
		$this->valori["carrello"][$this->cont]["sconto"] = "";

		$this->costiTrasporto += $preventivo->{"servizi"}->{"trasporto"}[$i]->{"prezzo"}*$preventivo->{"servizi"}->{"trasporto"}[$i]->{"quantita"};

		$this->valori["carrello"][$this->cont]["prezzo_unitario"] = "E. ".number_format(round($preventivo->{"servizi"}->{"trasporto"}[$i]->{"prezzo"},2), 2, ',', '.');
		$this->valori["carrello"][$this->cont]["importo_netto"] = "E. ".number_format(round($preventivo->{"servizi"}->{"trasporto"}[$i]->{"prezzo"}*$preventivo->{"servizi"}->{"trasporto"}[$i]->{"quantita"},2), 2, ',', '.');
		$this->cont++;
	}

	//Costi distribuzione
	if(count($preventivo->{"servizi"}->{"distribuzioneOrizzontale"}) > 0 || count($preventivo->{"servizi"}->{"distribuzioneVerticale"}) > 0){
		$this->valori["carrello"][$this->cont]["codice"] = "\n";
		$this->valori["carrello"][$this->cont]["descrizione"] = "\nCOSTI DI DISTRIBUZIONE";
		$this->valori["carrello"][$this->cont]["riferimento"] = "\n";
		$this->valori["carrello"][$this->cont]["um"] = "\n";
		$this->valori["carrello"][$this->cont]["quantita"] = "\n";
		$this->valori["carrello"][$this->cont]["L"] = "\n";
		$this->valori["carrello"][$this->cont]["H"] = "\n";
		$this->valori["carrello"][$this->cont]["sconto"] = "\n";
		$this->valori["carrello"][$this->cont]["num"] = "\n";
		$this->valori["carrello"][$this->cont]["prezzo_unitario"] = "\n";
		$this->valori["carrello"][$this->cont]["importo_netto"] = "\n";
		$this->valori["carrello"][$this->cont]["sconto2"] = "\n";
		$this->valori["carrello"][$this->cont]["iva"] = "\n";
		$this->cont++;
	}

	for($i = 0;$i < count($preventivo->{"servizi"}->{"distribuzioneOrizzontale"});$i++){
		$this->valori["carrello"][$this->cont]["codice"] =$preventivo->{"servizi"}->{"distribuzioneOrizzontale"}[$i]->{"codice"};
		$this->valori["carrello"][$this->cont]["descrizione"] = $preventivo->{"servizi"}->{"distribuzioneOrizzontale"}[$i]->{"nome"};
		$this->valori["carrello"][$this->cont]["um"] = "";
		$this->valori["carrello"][$this->cont]["quantita"] = $preventivo->{"servizi"}->{"distribuzioneOrizzontale"}[$i]->{"quantita"};
		$this->valori["carrello"][$this->cont]["L"] = "";
		$this->valori["carrello"][$this->cont]["H"] = "";
		$this->valori["carrello"][$this->cont]["sconto"] = "";
		$this->valori["carrello"][$this->cont]["num"] = "";
		$this->costiDistribuzioneO += $preventivo->{"servizi"}->{"distribuzioneOrizzontale"}[$i]->{"prezzo"}*$preventivo->{"servizi"}->{"distribuzioneOrizzontale"}[$i]->{"quantita"};
		$this->valori["carrello"][$this->cont]["prezzo_unitario"] = "E. ".number_format(round($preventivo->{"servizi"}->{"distribuzioneOrizzontale"}[$i]->{"prezzo"},2), 2, ',', '.');
		$this->valori["carrello"][$this->cont]["importo_netto"] = "E. ".number_format(round($preventivo->{"servizi"}->{"distribuzioneOrizzontale"}[$i]->{"prezzo"}*$preventivo->{"servizi"}->{"distribuzioneOrizzontale"}[$i]->{"quantita"},2), 2, ',', '.');
		$this->cont++;
	}
	for($i = 0;$i < count($preventivo->{"servizi"}->{"distribuzioneVerticale"});$i++){
		$this->valori["carrello"][$this->cont]["codice"] =$preventivo->{"servizi"}->{"distribuzioneVerticale"}[$i]->{"codice"};
		$this->valori["carrello"][$this->cont]["descrizione"] = $preventivo->{"servizi"}->{"distribuzioneVerticale"}[$i]->{"nome"};
		$this->valori["carrello"][$this->cont]["um"] = "";
		$this->valori["carrello"][$this->cont]["quantita"] = $preventivo->{"servizi"}->{"distribuzioneVerticale"}[$i]->{"quantita"};
		$this->valori["carrello"][$this->cont]["L"] = "";
		$this->valori["carrello"][$this->cont]["H"] = "";
		$this->valori["carrello"][$this->cont]["sconto"] = "";
		$this->valori["carrello"][$this->cont]["num"] = "";
		$this->costiDistribuzioneV += $preventivo->{"servizi"}->{"distribuzioneVerticale"}[$i]->{"prezzo"}*$preventivo->{"servizi"}->{"distribuzioneVerticale"}[$i]->{"quantita"};
		$this->valori["carrello"][$this->cont]["prezzo_unitario"] = "E. ".number_format(round($preventivo->{"servizi"}->{"distribuzioneVerticale"}[$i]->{"prezzo"},2), 2, ',', '.');
		$this->valori["carrello"][$this->cont]["importo_netto"] = "E. ".number_format(round($preventivo->{"servizi"}->{"distribuzioneVerticale"}[$i]->{"prezzo"}*$preventivo->{"servizi"}->{"distribuzioneVerticale"}[$i]->{"quantita"},2), 2, ',', '.');
		$this->cont++;
	}


	//Costi di montaggio
	if(count($preventivo->{"servizi"}->{"montaggioElettrico"}) > 0 || count($preventivo->{"servizi"}->{"montaggioMeccanica"}) > 0){
		$this->valori["carrello"][$this->cont]["codice"] = "\n";
		$this->valori["carrello"][$this->cont]["descrizione"] = "\nCOSTI DI MONTAGGIO";
		$this->valori["carrello"][$this->cont]["riferimento"] = "\n";
		$this->valori["carrello"][$this->cont]["um"] = "\n";
		$this->valori["carrello"][$this->cont]["quantita"] = "\n";
		$this->valori["carrello"][$this->cont]["L"] = "\n";
		$this->valori["carrello"][$this->cont]["H"] = "\n";
		$this->valori["carrello"][$this->cont]["sconto"] = "\n";
		$this->valori["carrello"][$this->cont]["num"] = "\n";
		$this->valori["carrello"][$this->cont]["prezzo_unitario"] = "\n";
		$this->valori["carrello"][$this->cont]["importo_netto"] = "\n";
		$this->valori["carrello"][$this->cont]["sconto2"] = "\n";
		$this->valori["carrello"][$this->cont]["iva"] = "\n";
		$this->cont++;
	}


	for($i = 0;$i < count($preventivo->{"servizi"}->{"montaggioMeccanica"});$i++){
		$this->valori["carrello"][$this->cont]["codice"] =$preventivo->{"servizi"}->{"montaggioMeccanica"}[$i]->{"codice"};
		$this->valori["carrello"][$this->cont]["descrizione"] = $preventivo->{"servizi"}->{"montaggioMeccanica"}[$i]->{"nome"};
		$this->valori["carrello"][$this->cont]["um"] = "";
		$this->valori["carrello"][$this->cont]["quantita"] = $preventivo->{"servizi"}->{"montaggioMeccanica"}[$i]->{"quantita"};
		$this->valori["carrello"][$this->cont]["L"] = "";
		$this->valori["carrello"][$this->cont]["H"] = "";
		$this->valori["carrello"][$this->cont]["sconto"] = "";
		$this->valori["carrello"][$this->cont]["num"] = "";
		$this->costiMontaggioM += $preventivo->{"servizi"}->{"montaggioMeccanica"}[$i]->{"prezzo"}*$preventivo->{"servizi"}->{"montaggioMeccanica"}[$i]->{"quantita"};
		$this->valori["carrello"][$this->cont]["prezzo_unitario"] = "E. ".number_format(round($preventivo->{"servizi"}->{"montaggioMeccanica"}[$i]->{"prezzo"},2), 2, ',', '.');
		$this->valori["carrello"][$this->cont]["importo_netto"] = "E. ".number_format(round($preventivo->{"servizi"}->{"montaggioMeccanica"}[$i]->{"prezzo"}*$preventivo->{"servizi"}->{"montaggioMeccanica"}[$i]->{"quantita"},2), 2, ',', '.');
		$this->cont++;
	}

	for($i = 0;$i < count($preventivo->{"servizi"}->{"montaggioSopraluce"});$i++){
		$this->valori["carrello"][$this->cont]["codice"] =$preventivo->{"servizi"}->{"montaggioSopraluce"}[$i]->{"codice"};
		$this->valori["carrello"][$this->cont]["descrizione"] = $preventivo->{"servizi"}->{"montaggioSopraluce"}[$i]->{"nome"};
		$this->valori["carrello"][$this->cont]["um"] = "";
		$this->valori["carrello"][$this->cont]["quantita"] = $preventivo->{"servizi"}->{"montaggioSopraluce"}[$i]->{"quantita"};
		$this->valori["carrello"][$this->cont]["L"] = "";
		$this->valori["carrello"][$this->cont]["H"] = "";
		$this->valori["carrello"][$this->cont]["sconto"] = "";
		$this->valori["carrello"][$this->cont]["num"] = "";
		$this->costiMontaggioS += $preventivo->{"servizi"}->{"montaggioSopraluce"}[$i]->{"prezzo"}*$preventivo->{"servizi"}->{"montaggioSopraluce"}[$i]->{"quantita"};
		$this->valori["carrello"][$this->cont]["prezzo_unitario"] = "E. ".number_format(round($preventivo->{"servizi"}->{"montaggioSopraluce"}[$i]->{"prezzo"},2), 2, ',', '.');
		$this->valori["carrello"][$this->cont]["importo_netto"] = "E. ".number_format(round($preventivo->{"servizi"}->{"montaggioSopraluce"}[$i]->{"prezzo"}*$preventivo->{"servizi"}->{"montaggioSopraluce"}[$i]->{"quantita"},2), 2, ',', '.');
		$this->cont++;
	}

	for($i = 0;$i < count($preventivo->{"servizi"}->{"montaggioElettrico"});$i++){
		$this->valori["carrello"][$this->cont]["codice"] =$preventivo->{"servizi"}->{"montaggioElettrico"}[$i]->{"codice"};
		$this->valori["carrello"][$this->cont]["descrizione"] = $preventivo->{"servizi"}->{"montaggioElettrico"}[$i]->{"nome"};
		$this->valori["carrello"][$this->cont]["um"] = "";
		$this->valori["carrello"][$this->cont]["quantita"] = $preventivo->{"servizi"}->{"montaggioElettrico"}[$i]->{"quantita"};
		$this->valori["carrello"][$this->cont]["L"] = "";
		$this->valori["carrello"][$this->cont]["H"] = "";
		$this->valori["carrello"][$this->cont]["sconto"] = "";
		$this->valori["carrello"][$this->cont]["num"] = "";
		$this->costiMontaggioE += $preventivo->{"servizi"}->{"montaggioElettrico"}[$i]->{"prezzo"}*$preventivo->{"servizi"}->{"montaggioElettrico"}[$i]->{"quantita"};
		$this->valori["carrello"][$this->cont]["prezzo_unitario"] = "E. ".number_format(round($preventivo->{"servizi"}->{"montaggioElettrico"}[$i]->{"prezzo"},2), 2, ',', '.');
		$this->valori["carrello"][$this->cont]["importo_netto"] = "E. ".number_format(round($preventivo->{"servizi"}->{"montaggioElettrico"}[$i]->{"prezzo"}*$preventivo->{"servizi"}->{"montaggioElettrico"}[$i]->{"quantita"},2), 2, ',', '.');
		$this->cont++;
	}



	//var_dump($this->valori);
	$articolo = $this->valori;
	return $articolo;
	}

}

?>
