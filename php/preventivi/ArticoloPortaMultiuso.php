<?

class ArticoloPortaMultiuso{
	
	
	private $merceScontata;
	public $main;

	public function init($main){
		$this->main = $main;
	}
	
	public function get($articolo, $i, $doc){
		
		
		//var_dump("ULLLALALAL");
		$alpha = "ABCDEFGHILMNOPQRSTUVZ";
        $l = $alpha[$i];
		$riferimento = $l."/".$articolo["riferimento"];
		$porta = $articolo["porta"];
		$portaW = $porta["L"];
		$portaH = $porta["H"];
		$accessori = $articolo["accessori"];
		$sopraluce = $accessori["sopraluce"];
		$heightSopraluce = $sopraluce["height"];
		$descSopraluce  = "";
		$codiceSopraluce = "";
		$prezzoSopraluce = "";
		$quantita = $articolo["prodotto"]["quantita"];
		$mq = ($portaW/1000)*($portaH/1000);
			
			
		///////////////////////////////////////////////////////////////////////////////////////
		///////////////////////// DATI DELLA PORTA ////////////////////////////////////////////	
		//////////////////////////////////////////////////////////////////////////////////////
			
		for($i = 0;$i < 16;$i++){	
			
		$html .= "<tr>";
        
		/*
		//RIFERIMENTO
		$html .= "<td style=\"width:43px;padding:5px;height:30px;border-right:1px solid #ccc;border-bottom:1px solid #ccc;text-align:center;\">";
		$html .= $riferimento;
		$html .= "</td>";
		*/
		
		
		// CODICE
        $html .= "<td style=\"padding:5px;height:30px;border-bottom:1px solid #ccc;border-left:1px solid #000;border-right:1px solid #ccc;\">";
		$html .= $articolo["prodotto"]["codice"];
		$html .= "</td>";
		
		// DESCRIZIONE
        $html .= "<td style=\"padding:5px;height:30px;border-bottom:1px solid #ccc;border-right:1px solid #ccc;\">";
		$html .= $articolo["prodotto"]["descrizione"];
		$html .= "</td>";
        
		
		// H
        $html .= "<td style=\"padding:5px;height:30px;border-bottom:1px solid #ccc;border-right:1px solid #ccc;text-align:center;\">";
		$html .= "";
		$html .= "</td>";
		
		// L
        $html .= "<td style=\"padding:5px;height:30px;border-bottom:1px solid #ccc;border-right:1px solid #ccc;text-align:center;\">";
		$html .= "";
		$html .= "</td>";
		
		// UM
        $html .= "<td style=\"padding:5px;height:30px;border-bottom:1px solid #ccc;border-right:1px solid #ccc;text-align:center;\">";
		$html .= "MQ";
		$html .= "</td>";
		
		// Q
		$html .= "<td style=\"padding:5px;height:30px;border-bottom:1px solid #ccc;border-right:1px solid #ccc;text-align:center;\">";
		$html .= $quantita;
		$html .= "</td>";
		
		/*
		// LARGHEZZA
        $html .= "<td style=\"width:45px;padding:5px;height:30px;border-right:1px solid #ccc;border-bottom:1px solid #ccc;text-align:center;\">";
		$html .= $articolo["porta"]["L"];
		$html .= "</td>";
		
		// ALTEZZA
        $html .= "<td style=\"width:42px;padding:5px;height:30px;border-right:1px solid #ccc;border-bottom:1px solid #ccc;text-align:center;\">";
		$html .= $articolo["porta"]["H"];
		$html .= "</td>";
		
		*/

		// PASO
        $html .= "<td style=\"padding:5px;height:30px;border-bottom:1px solid #ccc;border-right:1px solid #ccc;text-align:center;\">";
		$html .= "";
		$html .= "</td>";
		
		
		// PREZZO UNITARIO
        $html .= "<td style=\"padding:5px;height:30px;border-bottom:1px solid #ccc;border-right:1px solid #ccc;text-align:right;\">";
		$html .= "EUR ".@number_format($articolo["prodotto"]["costo"], 2, ',','.');
		$html .= "</td>";
		
		// SCONTO
		$html .= "<td style=\"padding:5px;height:30px;border-bottom:1px solid #ccc;border-right:1px solid #ccc;text-align:center;\">";
		$html .= $articolo["prodotto"]["sconto"]."%";
		$html .= "</td>";
		
		// PREZZO TOTALE
        $html .= "<td style=\"padding:5px;height:30px;border-bottom:1px solid #ccc;border-right:1px solid #000;text-align:right;\">";
		$html .= "EUR ".@number_format($articolo["prodotto"]["costo_totale"], 2, ',','.');
		$html .= "</td>";
		
        $html .= "</tr>";	
		}
			
		///////////////////////////////////////////////////////////////////////////////////////
		///////////////////////// FINE DATI DELLA PORTA ///////////////////////////////////////
		//////////////////////////////////////////////////////////////////////////////////////


		/*
		///////////////////////////////////////////////////////////////////////////////////////
		///////////////////////// FINE DATI DELLA PORTA ///////////////////////////////////////
		//////////////////////////////////////////////////////////////////////////////////////

		if($articolo["riferimento"]["sopraluce"]){
			
			$html .= "<tr>";
        
			//RIFERIMENTO
			$html .= "<td style=\"width:43px;padding:5px;height:30px;border-right:1px solid #ccc;border-bottom:1px solid #ccc;text-align:center;\">";
			$html .= $riferimento;
			$html .= "</td>";
			
			// CODICE
			$html .= "<td style=\"width:76px;padding:5px;height:30px;border-right:1px solid #ccc;border-bottom:1px solid #ccc;\">";
			$html .= $sopraluce["codice"];
			$html .= "</td>";
			
			// DESCRIZIONE
			$html .= "<td style=\"width:297px;padding:5px;height:30px;border-right:1px solid #ccc;border-bottom:1px solid #ccc;\">";
			$html .= $sopraluce["descrizione"];
			$html .= "</td>";
			
			// NUMERO
			$html .= "<td style=\"width:35px;padding:5px;height:30px;border-right:1px solid #ccc;border-bottom:1px solid #ccc;text-align:center;\">";
			$html .= $quantita;
			$html .= "</td>";
			
			// LARGHEZZA
			$html .= "<td style=\"width:45px;padding:5px;height:30px;border-right:1px solid #ccc;border-bottom:1px solid #ccc;text-align:center;\">";
			$html .= $sopraluce["L"];
			$html .= "</td>";
			
			// ALTEZZA
			$html .= "<td style=\"width:42px;padding:5px;height:30px;border-right:1px solid #ccc;border-bottom:1px solid #ccc;text-align:center;\">";
			$html .= $sopraluce["H"];
			$html .= "</td>";
			
			// UNITA' DI MISURA
			$html .= "<td style=\"width:42px;padding:5px;height:30px;border-right:1px solid #ccc;border-bottom:1px solid #ccc;text-align:center;\">";
			$html .= $sopraluce["um"];
			$html .= "</td>";
			
			// TOTALE
			$html .= "<td style=\"width:57px;padding:5px;height:30px;border-right:1px solid #ccc;border-bottom:1px solid #ccc;text-align:center;\">";
			$html .= @number_format($sopraluce["totale"], 2, ',','.');
			$html .= "</td>";
			
			// PREZZO UNITARIO
			$html .= "<td style=\"width:76px;padding:5px;height:30px;border-right:1px solid #ccc;border-bottom:1px solid #ccc;text-align:right;\">";
			$html .= @number_format($sopraluce["costo"], 2, ',','.')." €";
			$html .= "</td>";
			
			// PREZZO TOTALE
			$html .= "<td style=\"width:71px;padding:5px;height:30px;border-bottom:1px solid #ccc;text-align:right;\">";
			$html .= @number_format($sopraluce["costo_totale"], 2, ',','.')." €";
			$html .= "</td>";
			
			$html .= "</tr>";
		}
		
			
		
		///////////////////////////////////////////////////////////////////////////////////////
		///////////////////////// sistema di chiusura /////////////////////////////////////////	
		//////////////////////////////////////////////////////////////////////////////////////
		
		if($accessori["sistemaChiusura"]){
			
			//$this->main->max_righe_x_pagina--;
			
			$html .= "<tr>";
			
				//RIFERIMENTO
				$html .= "<td style=\"width:43px;padding:5px;height:30px;border-right:1px solid #ccc;border-bottom:1px solid #ccc;text-align:center;\">";
				$html .= $riferimento;
				$html .= "</td>";
				
				// CODICE
				$html .= "<td style=\"width:76px;padding:5px;height:30px;border-right:1px solid #ccc;border-bottom:1px solid #ccc;\">";
				$html .= $accessori["sistemaChiusura"]["codice"];
				$html .= "</td>";
				
				// DESCRIZIONE
				$html .= "<td style=\"width:297px;padding:5px;height:30px;border-right:1px solid #ccc;border-bottom:1px solid #ccc;\">";
				$html .= $accessori["sistemaChiusura"]["descrizione"];
				$html .= "</td>";
				
				// NUMERO
				$html .= "<td style=\"width:35px;padding:5px;height:30px;border-right:1px solid #ccc;border-bottom:1px solid #ccc;text-align:center;\">";
				$html .= $quantita;
				$html .= "</td>";
				
				// LARGHEZZA
				$html .= "<td style=\"width:45px;padding:5px;height:30px;border-right:1px solid #ccc;border-bottom:1px solid #ccc;text-align:center;\">";
				//$html .= $sopraluce["L"];
				$html .= "</td>";
				
				// ALTEZZA
				$html .= "<td style=\"width:42px;padding:5px;height:30px;border-right:1px solid #ccc;border-bottom:1px solid #ccc;text-align:center;\">";
				//$html .= $sopraluce["H"];
				$html .= "</td>";
				
				// UNITA' DI MISURA
				$html .= "<td style=\"width:34px;padding:5px;height:30px;border-right:1px solid #ccc;border-bottom:1px solid #ccc;text-align:center;\">";
				$html .= $accessori["sistemaChiusura"]["um"];
				$html .= "</td>";
				
				// TOTALE
				$html .= "<td style=\"width:42px;padding:5px;height:30px;border-right:1px solid #ccc;border-bottom:1px solid #ccc;text-align:center;\">";
				//$html .= @number_format($sopraluce["totale"], 2, ',','.');
				$html .= "</td>";
				
				// PREZZO UNITARIO
				$html .= "<td style=\"width:76px;padding:5px;height:30px;border-right:1px solid #ccc;border-bottom:1px solid #ccc;text-align:right;\">";
				$html .= @number_format($accessori["sistemaChiusura"]["costo"], 2, ',','.')." €";
				$html .= "</td>";
				
				// SCONTO
				$html .= "<td style=\"width:30px;padding:5px;height:30px;border-right:1px solid #ccc;border-bottom:1px solid #ccc;text-align:center;\">";
				$html .= $accessori["sistemaChiusura"]["sconto"]."%";
				$html .= "</td>";
				
				// PREZZO TOTALE
				$html .= "<td style=\"width:71px;padding:5px;height:30px;border-bottom:1px solid #ccc;text-align:right;\">";
				$html .= @number_format($accessori["sistemaChiusura"]["costo_totale"], 2, ',','.')." €";
				$html .= "</td>";
				
				$html .= "</tr>";
				
		}
		
		
		///////////////////////////////////////////////////////////////////////////////////////
		///////////////////////////// vewrniciatura /////////////////////////////////////////	
		//////////////////////////////////////////////////////////////////////////////////////
		if($accessori["verniciatura"] != NULL){
			
			for($i = 0;$i < count($accessori["verniciatura"]["vernici"]);$i++){
				
				//$this->main->max_righe_x_pagina--;
			
				$html .= "<tr>";
			
				//RIFERIMENTO
				$html .= "<td style=\"width:43px;padding:5px;height:30px;border-right:1px solid #ccc;border-bottom:1px solid #ccc;text-align:center;\">";
				$html .= $riferimento;
				$html .= "</td>";
				
				// CODICE
				$html .= "<td style=\"width:76px;padding:5px;height:30px;border-right:1px solid #ccc;border-bottom:1px solid #ccc;\">";
				$html .= $accessori["verniciatura"]["vernici"][$i]["codice"];
				$html .= "</td>";
				
				// DESCRIZIONE
				$html .= "<td style=\"width:297px;padding:5px;height:30px;border-right:1px solid #ccc;border-bottom:1px solid #ccc;\">";
				$html .= $accessori["verniciatura"]["codice"]." ".$accessori["verniciatura"]["vernici"][$i]["descrizione"];
				$html .= "</td>";
				
				// NUMERO
				$html .= "<td style=\"width:35px;padding:5px;height:30px;border-right:1px solid #ccc;border-bottom:1px solid #ccc;text-align:center;\">";
				$html .= $quantita;
				$html .= "</td>";
				
				// LARGHEZZA
				$html .= "<td style=\"width:45px;padding:5px;height:30px;border-right:1px solid #ccc;border-bottom:1px solid #ccc;text-align:center;\">";
				$html .= $accessori["verniciatura"]["vernici"][$i]["L"];
				$html .= "</td>";
				
				// ALTEZZA
				$html .= "<td style=\"width:42px;padding:5px;height:30px;border-right:1px solid #ccc;border-bottom:1px solid #ccc;text-align:center;\">";
				$html .= $accessori["verniciatura"]["vernici"][$i]["H"];
				$html .= "</td>";
				
				// UNITA' DI MISURA
				$html .= "<td style=\"width:34px;padding:5px;height:30px;border-right:1px solid #ccc;border-bottom:1px solid #ccc;text-align:center;\">";
				$html .= $accessori["verniciatura"]["vernici"][$i]["um"];
				$html .= "</td>";
				
				// TOTALE
				$html .= "<td style=\"width:42px;padding:5px;height:30px;border-right:1px solid #ccc;border-bottom:1px solid #ccc;text-align:center;\">";
				$html .= ($accessori["verniciatura"]["vernici"][$i]["totale"]?@number_format($accessori["verniciatura"]["vernici"][$i]["totale"], 2, ',','.'):"");
				$html .= "</td>";
				
				// PREZZO UNITARIO
				$html .= "<td style=\"width:76px;padding:5px;height:30px;border-right:1px solid #ccc;border-bottom:1px solid #ccc;text-align:right;\">";
				$html .= @number_format($accessori["verniciatura"]["vernici"][$i]["costo"], 2, ',','.')." €";
				$html .= "</td>";
				
				// SCONTO
				$html .= "<td style=\"width:30px;padding:5px;height:30px;border-right:1px solid #ccc;border-bottom:1px solid #ccc;text-align:center;\">";
				$html .= $accessori["verniciatura"]["vernici"]["sconto"]."%";
				$html .= "</td>";
				
				// PREZZO TOTALE
				$html .= "<td style=\"width:71px;padding:5px;height:30px;border-bottom:1px solid #ccc;text-align:right;\">";
				$html .= @number_format($accessori["verniciatura"]["vernici"][$i]["costo_totale"], 2, ',','.')." €";
				$html .= "</td>";
				
				$html .= "</tr>";
			}

		}
		*/
		
		return $html;
		
	}
		
	
	
}


?>

