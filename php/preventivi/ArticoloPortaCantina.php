<?

class ArticoloPortaCantina{
	
	
	private $merceScontata;
	public $main;

	public function init($main){
		$this->main = $main;
	}
	
	public function get($articolo, $i, $doc){
		
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
		$prodotto = $articolo["prodotto"];
		$mq = ($portaW/1000)*($portaH/1000);
			
		
		
		///////////////////////////////////////////////////////////////////////////////////////
		///////////////////////// DATI DELLA PORTA////////////////////////////////////////////	
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
			
		//$this->main->max_righe_x_pagina--;
		
		///////////////////////////////////////////////////////////////////////////////////////
		///////////////////////// SOPRALUCE //////////////////////////////////////////////////	
		//////////////////////////////////////////////////////////////////////////////////////
		
		if($accessori["sopraluce"]){
			
			//$this->main->max_righe_x_pagina--;
			
			$html .= "<tr>";
        
			//RIFERIMENTO
			$html .= "<td style=\"width:43px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
			$html .= $riferimento;
			$html .= "</td>";
			
			// CODICE
			$html .= "<td style=\"width:76px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;\">";
			$html .= $sopraluce["codice"];
			$html .= "</td>";
			
			// DESCRIZIONE
			$html .= "<td style=\"width:297px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;\">";
			$html .= $sopraluce["descrizione"];
			$html .= "</td>";
			
			// NUMERO
			$html .= "<td style=\"width:35px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
			$html .= $quantita;
			$html .= "</td>";
			
			// LARGHEZZA
			$html .= "<td style=\"width:45px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
			$html .= $sopraluce["L"];
			$html .= "</td>";
			
			// ALTEZZA
			$html .= "<td style=\"width:42px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
			$html .= $sopraluce["H"];
			$html .= "</td>";
			
			// UNITA' DI MISURA
			$html .= "<td style=\"width:34px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
			$html .= $sopraluce["um"];
			$html .= "</td>";
			
			// TOTALE
			$html .= "<td style=\"width:42px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
			$html .= @number_format($sopraluce["totale"], 2, ',','.');
			$html .= "</td>";
			
			// PREZZO UNITARIO
			$html .= "<td style=\"width:76px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:right;\">";
			$html .= @number_format($sopraluce["costo"], 2, ',','.')." €";
			$html .= "</td>";
			
			// SCONTO
			$html .= "<td style=\"width:30px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
			$html .= $articolo["prodotto"]["sconto"]."%";
			$html .= "</td>";
			
			// PREZZO TOTALE
			$html .= "<td style=\"width:71px;background-color:#fff;padding:5px;height:30px;border-bottom:1px solid #666;text-align:right;\">";
			$html .= @number_format($sopraluce["costo_totale"], 2, ',','.')." €";
			$html .= "</td>";
			
			$html .= "</tr>";
			
		}
		
		return $html;
		
	}
}


?>

