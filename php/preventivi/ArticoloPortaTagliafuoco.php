<?

class ArticoloPortaTagliafuoco{
	
	
	private $merceScontata;
	public $main;

	public function init($main){
		$this->main = $main;
	}
	
	public function get($articolo, $doc){
		
		
		$l = substr("ABCDEFGHILMNOPQRSTUVZ", $i, $i);
		$riferimento = $l."/".$articolo["riferimento"];
		$porta = $articolo["porta"];
		$accessori = $articolo["accessori"];
		$sopraluce = $accessori["sopraluce"];
		$heightSopraluce = $sopraluce["height"];
		$descSopraluce  = "";
		$codiceSopraluce = "";
		$prezzoSopraluce = "";
		$quantita = $articolo["prodotto"]["quantita"];
		$mq = ($articolo["porta"]["L"]/1000)*($articolo["porta"]["H"]/1000);
		$accessori = $articolo["accessori"];
		
		
		///////////////////////////////////////////////////////////////////////////////////////
		///////////////////////// DATI DELLA PORTA ////////////////////////////////////////////	
		//////////////////////////////////////////////////////////////////////////////////////
		
		$html = "<tr>";
        
		//RIFERIMENTO
		$html .= "<td style=\"width:43px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
		$html .= $riferimento;
		$html .= "</td>";
		
		// CODICE
        $html .= "<td style=\"width:76px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;\">";
		$html .= $articolo["prodotto"]["codice"];
		$html .= "</td>";
		
		// DESCRIZIONE
        $html .= "<td style=\"width:297px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;\">";
		$html .= $articolo["prodotto"]["descrizione"];
		$html .= "</td>";
        
		// NUMERO
		$html .= "<td style=\"width:35px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
		$html .= $quantita;
		$html .= "</td>";
		
		// LARGHEZZA
        $html .= "<td style=\"width:45px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
		$html .= $articolo["porta"]["L"];
		$html .= "</td>";
		
		// ALTEZZA
        $html .= "<td style=\"width:42px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
		$html .= $articolo["porta"]["H"];
		$html .= "</td>";
		
		// UNITA' DI MISURA
        $html .= "<td style=\"width:34px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
		$html .= "MQ";
		$html .= "</td>";
		
		// TOTALE
        $html .= "<td style=\"width:42px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
		$html .= @number_format($mq,2,',','.');
		$html .= "</td>";
		
		// PREZZO UNITARIO
        $html .= "<td style=\"width:76px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:right;\">";
		$html .= @number_format($articolo["prodotto"]["costo"], 2, ',','.')." €";
		$html .= "</td>";
		
		// SCONTO
		$html .= "<td style=\"width:30px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
		$html .= $articolo["prodotto"]["sconto"]."%";
		$html .= "</td>";
		
		// PREZZO TOTALE
        $html .= "<td style=\"width:71px;background-color:#fff;padding:5px;height:30px;border-bottom:1px solid #666;text-align:right;\">";
		$html .= @number_format($articolo["prodotto"]["costo_totale"], 2, ',','.')." €";
		$html .= "</td>";
		
        $html .= "</tr>";	
			
			
		///////////////////////////////////////////////////////////////////////////////////////
		///////////////////////// FINE DATI DELLA PORTA ///////////////////////////////////////
		//////////////////////////////////////////////////////////////////////////////////////
		
		
		///////////////////////////////////////////////////////////////////////////////////////
		///////////////////////// sistema di chiusura /////////////////////////////////////////	
		//////////////////////////////////////////////////////////////////////////////////////
		
		if($accessori["sistemaChiusura"]){
			
			//$this->main->max_righe_x_pagina--;
			
			$html .= "<tr>";
			
				//RIFERIMENTO
				$html .= "<td style=\"width:43px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				$html .= $riferimento;
				$html .= "</td>";
				
				// CODICE
				$html .= "<td style=\"width:76px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;\">";
				$html .= $accessori["sistemaChiusura"]["codice"];
				$html .= "</td>";
				
				// DESCRIZIONE
				$html .= "<td style=\"width:297px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;\">";
				$html .= $accessori["sistemaChiusura"]["descrizione"];
				$html .= "</td>";
				
				// NUMERO
				$html .= "<td style=\"width:35px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				$html .= $quantita;
				$html .= "</td>";
				
				// LARGHEZZA
				$html .= "<td style=\"width:45px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				//$html .= $sopraluce["L"];
				$html .= "</td>";
				
				// ALTEZZA
				$html .= "<td style=\"width:42px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				//$html .= $sopraluce["H"];
				$html .= "</td>";
				
				// UNITA' DI MISURA
				$html .= "<td style=\"width:34px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				$html .= $accessori["sistemaChiusura"]["um"];
				$html .= "</td>";
				
				// TOTALE
				$html .= "<td style=\"width:42px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				//$html .= @number_format($sopraluce["totale"], 2, ',','.');
				$html .= "</td>";
				
				// PREZZO UNITARIO
				$html .= "<td style=\"width:76px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:right;\">";
				$html .= @number_format($accessori["sistemaChiusura"]["costo"], 2, ',','.')." €";
				$html .= "</td>";
				
				// SCONTO
				$html .= "<td style=\"width:30px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				$html .= $accessori["sistemaChiusura"]["sconto"]."%";
				$html .= "</td>";
				
				// PREZZO TOTALE
				$html .= "<td style=\"width:71px;background-color:#fff;padding:5px;height:30px;border-bottom:1px solid #666;text-align:right;\">";
				$html .= @number_format($accessori["sistemaChiusura"]["costo_totale"], 2, ',','.')." €";
				$html .= "</td>";
				
				$html .= "</tr>";
				
		}
		
		return $html;
		
	}
		
}


?>

