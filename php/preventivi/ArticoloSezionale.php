<?

class ArticoloSezionale{
	
	
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
		$famiglia = $porta["famiglia"];
		$debordatura = $porta["debordatura"];
		$accessori = $articolo["accessori"];
		$sopraluce = $accessori["sopraluce"];
		$heightSopraluce = $sopraluce["H"];
		$descSopraluce  = "";
		$codiceSopraluce = "";
		$prezzoSopraluce = "";
		$quantita = $articolo["prodotto"]["quantita"];
		
		
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
		$html .= $articolo["prodotto"]["um"];
		$html .= "</td>";
		
		// TOTALE
        $html .= "<td style=\"width:42px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
		//$html .= @number_format($articolo["prodotto"]["mq"],2,',','.');
		$html .= "</td>";
		
		// PREZZO UNITARIO
        $html .= "<td style=\"width:76px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:right;\">";
		$html .= @number_format($articolo["prodotto"]["costo"], 2, ',','.')." €";
		$html .= "</td>";
		
		// SCONTO
		$html .= "<td style=\"width:30px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
		$html .= $articolo["prodotto"]["sconto"];
		$html .= "%</td>";
		
		// PREZZO TOTALE
        $html .= "<td style=\"width:71px;background-color:#fff;padding:5px;height:30px;border-bottom:1px solid #666;text-align:right;\">";
		$html .= @number_format($articolo["prodotto"]["costo_totale"], 2, ',','.')." €";
		$html .= "</td>";
		
        $html .= "</tr>";
		
		
		///////////////////////////////////////////////////////////////////////////////////////
		///////////////////////// STRUTTURA //////////////////////////////////////////////////	
		//////////////////////////////////////////////////////////////////////////////////////
		
		if($accessori["struttura"]){
			
			if($accessori["struttura"]["veletta"]){
			
				//$this->main->max_righe_x_pagina--;
				
				$html .= "<tr>";
			
				//RIFERIMENTO
				$html .= "<td style=\"width:43px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				$html .= $riferimento;
				$html .= "</td>";
				
				// CODICE
				$html .= "<td style=\"width:76px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;\">";
				$html .= $accessori["struttura"]["veletta"]["codice"];
				$html .= "</td>";
				
				// DESCRIZIONE
				$html .= "<td style=\"width:297px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;\">";
				$html .= $accessori["struttura"]["veletta"]["descrizione"];
				$html .= "</td>";
				
				// NUMERO
				$html .= "<td style=\"width:35px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				$html .= $accessori["struttura"]["veletta"]["quantita"];
				$html .= "</td>";
				
				// LARGHEZZA
				$html .= "<td style=\"width:45px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				$html .= $accessori["struttura"]["veletta"]["L"];
				$html .= "</td>";
				
				// ALTEZZA
				$html .= "<td style=\"width:42px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				$html .= $accessori["struttura"]["veletta"]["H"];
				$html .= "</td>";
				
				// UNITA' DI MISURA
				$html .= "<td style=\"width:34px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				$html .= $accessori["struttura"]["veletta"]["um"];
				$html .= "</td>";
				
				// TOTALE
				$html .= "<td style=\"width:42px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				$html .= @number_format($accessori["struttura"]["veletta"]["ml"],2,',','.');
				$html .= "</td>";
				
				// PREZZO UNITARIO
				$html .= "<td style=\"width:76px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:right;\">";
				$html .= @number_format($accessori["struttura"]["veletta"]["costo"], 2, ',','.')." €";
				$html .= "</td>";
				
				// SCONTO
				$html .= "<td style=\"width:30px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				$html .= $accessori["struttura"]["sconto"];
				$html .= "%</td>";
				
				// PREZZO TOTALE
				$html .= "<td style=\"width:71px;background-color:#fff;padding:5px;height:30px;border-bottom:1px solid #666;text-align:right;\">";
				$html .= @number_format($accessori["struttura"]["veletta"]["costo_totale"], 2, ',','.')." €";
				$html .= "</td>";
				
				$html .= "</tr>";
				
				
				
				
				if($accessori["struttura"]["veletta"]["extra"]){
			
					//$this->main->max_righe_x_pagina--;
					
					$html .= "<tr>";
				
					//RIFERIMENTO
					$html .= "<td style=\"width:43px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
					$html .= $riferimento;
					$html .= "</td>";
					
					// CODICE
					$html .= "<td style=\"width:76px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;\">";
					$html .= $accessori["struttura"]["veletta"]["extra"]["codice"];
					$html .= "</td>";
					
					// DESCRIZIONE
					$html .= "<td style=\"width:297px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;\">";
					$html .= $accessori["struttura"]["veletta"]["extra"]["descrizione"]." ".$accessori["struttura"]["veletta"]["extra"]["tipo_foratura"];
					$html .= "</td>";
					
					// NUMERO
					$html .= "<td style=\"width:35px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
					$html .= $accessori["struttura"]["veletta"]["extra"]["quantita"];
					$html .= "</td>";
					
					// LARGHEZZA
					$html .= "<td style=\"width:45px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
					$html .= $accessori["struttura"]["veletta"]["L"];
					$html .= "</td>";
					
					// ALTEZZA
					$html .= "<td style=\"width:42px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
					$html .= $accessori["struttura"]["veletta"]["H"];
					$html .= "</td>";
					
					// UNITA' DI MISURA
					$html .= "<td style=\"width:34px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
					$html .= $accessori["struttura"]["veletta"]["um"];
					$html .= "</td>";
					
					// TOTALE
					$html .= "<td style=\"width:42px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
					$html .= @number_format($accessori["struttura"]["veletta"]["ml"],2,',','.');
					$html .= "</td>";
					
					// PREZZO UNITARIO
					$html .= "<td style=\"width:76px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:right;\">";
					$html .= @number_format($accessori["struttura"]["veletta"]["extra"]["costo"], 2, ',','.')." €";
					$html .= "</td>";
					
					// SCONTO
					$html .= "<td style=\"width:30px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
					$html .= $accessori["struttura"]["sconto"];
					$html .= "%</td>";
					
					// PREZZO TOTALE
					$html .= "<td style=\"width:71px;background-color:#fff;padding:5px;height:30px;border-bottom:1px solid #666;text-align:right;\">";
					$html .= @number_format($accessori["struttura"]["veletta"]["extra"]["costo_totale"], 2, ',','.')." €";
					$html .= "</td>";
					
					$html .= "</tr>";
					
				}
	
			}
			
			
			if($accessori["struttura"]["spallettaSX"]){
			
				//$this->main->max_righe_x_pagina--;
				
				$html .= "<tr>";
			
				//RIFERIMENTO
				$html .= "<td style=\"width:43px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				$html .= $riferimento;
				$html .= "</td>";
				
				// CODICE
				$html .= "<td style=\"width:76px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;\">";
				$html .= $accessori["struttura"]["spallettaSX"]["codice"];
				$html .= "</td>";
				
				// DESCRIZIONE
				$html .= "<td style=\"width:297px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;\">";
				$html .= $accessori["struttura"]["spallettaSX"]["descrizione"];
				$html .= "</td>";
				
				// NUMERO
				$html .= "<td style=\"width:35px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				$html .= $accessori["struttura"]["spallettaSX"]["quantita"];
				$html .= "</td>";
				
				// LARGHEZZA
				$html .= "<td style=\"width:45px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				$html .= $accessori["struttura"]["spallettaSX"]["L"];
				$html .= "</td>";
				
				// ALTEZZA
				$html .= "<td style=\"width:42px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				$html .= $accessori["struttura"]["spallettaSX"]["H"];
				$html .= "</td>";
				
				// UNITA' DI MISURA
				$html .= "<td style=\"width:34px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				$html .= $accessori["struttura"]["spallettaSX"]["um"];
				$html .= "</td>";
				
				// TOTALE
				$html .= "<td style=\"width:42px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				$html .= @number_format($accessori["struttura"]["spallettaSX"]["ml"],2,',','.');
				$html .= "</td>";
				
				// PREZZO UNITARIO
				$html .= "<td style=\"width:76px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:right;\">";
				$html .= @number_format($accessori["struttura"]["spallettaSX"]["costo"], 2, ',','.')." €";
				$html .= "</td>";
				
				// SCONTO
				$html .= "<td style=\"width:30px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				$html .= $accessori["struttura"]["sconto"];
				$html .= "%</td>";
				
				// PREZZO TOTALE
				$html .= "<td style=\"width:71px;background-color:#fff;padding:5px;height:30px;border-bottom:1px solid #666;text-align:right;\">";
				$html .= @number_format($accessori["struttura"]["spallettaSX"]["costo_totale"], 2, ',','.')." €";
				$html .= "</td>";
				
				$html .= "</tr>";
				
			}
			
			
			if($accessori["struttura"]["spallettaDX"]){
			
				//$this->main->max_righe_x_pagina--;
				
				$html .= "<tr>";
			
				//RIFERIMENTO
				$html .= "<td style=\"width:43px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				$html .= $riferimento;
				$html .= "</td>";
				
				// CODICE
				$html .= "<td style=\"width:76px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;\">";
				$html .= $accessori["struttura"]["spallettaDX"]["codice"];
				$html .= "</td>";
				
				// DESCRIZIONE
				$html .= "<td style=\"width:297px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;\">";
				$html .= $accessori["struttura"]["spallettaDX"]["descrizione"];
				$html .= "</td>";
				
				// NUMERO
				$html .= "<td style=\"width:35px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				$html .= $accessori["struttura"]["spallettaDX"]["quantita"];
				$html .= "</td>";
				
				// LARGHEZZA
				$html .= "<td style=\"width:45px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				$html .= $accessori["struttura"]["spallettaDX"]["L"];
				$html .= "</td>";
				
				// ALTEZZA
				$html .= "<td style=\"width:42px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				$html .= $accessori["struttura"]["spallettaDX"]["H"];
				$html .= "</td>";
				
				// UNITA' DI MISURA
				$html .= "<td style=\"width:34px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				$html .= $accessori["struttura"]["spallettaDX"]["um"];
				$html .= "</td>";
				
				// TOTALE
				$html .= "<td style=\"width:42px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				$html .= @number_format($accessori["struttura"]["spallettaDX"]["ml"],2,',','.');
				$html .= "</td>";
				
				// PREZZO UNITARIO
				$html .= "<td style=\"width:76px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:right;\">";
				$html .= @number_format($accessori["struttura"]["spallettaDX"]["costo"], 2, ',','.')." €";
				$html .= "</td>";
				
				// SCONTO
				$html .= "<td style=\"width:30px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				$html .= $accessori["struttura"]["sconto"];
				$html .= "%</td>";
				
				// PREZZO TOTALE
				$html .= "<td style=\"width:71px;background-color:#fff;padding:5px;height:30px;border-bottom:1px solid #666;text-align:right;\">";
				$html .= @number_format($accessori["struttura"]["spallettaDX"]["costo_totale"], 2, ',','.')." €";
				$html .= "</td>";
				
				$html .= "</tr>";
				
			}	
		}
		
		
///////////////////////////////////////////////////////////////////////////////////////
		///////////////////////// sistema di rinifitura //////////////////////////////////////////////////	
		//////////////////////////////////////////////////////////////////////////////////////
		
		if($accessori["sistemaRifinitura"]){
			
			//$this->main->max_righe_x_pagina--;
			
			$html .= "<tr>";
			
				//RIFERIMENTO
				$html .= "<td style=\"width:43px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				$html .= $riferimento;
				$html .= "</td>";
				
				// CODICE
				$html .= "<td style=\"width:76px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;\">";
				$html .= $accessori["sistemaRifinitura"]["codice"];
				$html .= "</td>";
				
				// DESCRIZIONE
				$html .= "<td style=\"width:297px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;\">";
				$html .= $accessori["sistemaRifinitura"]["descrizione"];
				$html .= "</td>";
				
				// NUMERO
				$html .= "<td style=\"width:35px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				$html .= $accessori["sistemaRifinitura"]["quantita_tot"];
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
				$html .= $accessori["sistemaRifinitura"]["um"];
				$html .= "</td>";
				
				// TOTALE
				$html .= "<td style=\"width:42px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				//$html .= @number_format($sopraluce["totale"], 2, ',','.');
				$html .= "</td>";
				
				// PREZZO UNITARIO
				$html .= "<td style=\"width:76px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:right;\">";
				$html .= @number_format($accessori["sistemaRifinitura"]["costo"], 2, ',','.')." €";
				$html .= "</td>";
				
				// SCONTO
				$html .= "<td style=\"width:30px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				$html .= $accessori["sistemaRifinitura"]["sconto"];
				$html .= "%</td>";
				
				// PREZZO TOTALE
				$html .= "<td style=\"width:71px;background-color:#fff;padding:5px;height:30px;border-bottom:1px solid #666;text-align:right;\">";
				$html .= @number_format($accessori["sistemaRifinitura"]["costo_totale"], 2, ',','.')." €";
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
				$html .= $accessori["sistemaChiusura"]["sconto"];
				$html .= "%</td>";
				
				// PREZZO TOTALE
				$html .= "<td style=\"width:71px;background-color:#fff;padding:5px;height:30px;border-bottom:1px solid #666;text-align:right;\">";
				$html .= @number_format($accessori["sistemaChiusura"]["costo_totale"], 2, ',','.')." €";
				$html .= "</td>";
				
				$html .= "</tr>";
				
		}	
		
		
///////////////////////////////////////////////////////////////////////////////////////
		///////////////////////// motorizzazione /////////////////////////////////////////	
		//////////////////////////////////////////////////////////////////////////////////////
		
		if($accessori["motorizzazione"]){
			
			//$this->main->max_righe_x_pagina--;
			
			$html .= "<tr>";
			
				//RIFERIMENTO
				$html .= "<td style=\"width:43px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				$html .= $riferimento;
				$html .= "</td>";
				
				// CODICE
				$html .= "<td style=\"width:76px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;\">";
				$html .= $accessori["motorizzazione"]["codice"];
				$html .= "</td>";
				
				// DESCRIZIONE
				$html .= "<td style=\"width:297px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;\">";
				$html .= $accessori["motorizzazione"]["descrizione"];
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
				$html .= $accessori["motorizzazione"]["um"];
				$html .= "</td>";
				
				// TOTALE
				$html .= "<td style=\"width:42px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				//$html .= @number_format($sopraluce["totale"], 2, ',','.');
				$html .= "</td>";
				
				// PREZZO UNITARIO
				$html .= "<td style=\"width:76px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:right;\">";
				$html .= @number_format($accessori["motorizzazione"]["costo"], 2, ',','.')." €";
				$html .= "</td>";
				
				// SCONTO
				$html .= "<td style=\"width:30px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				$html .= $accessori["motorizzazione"]["sconto"];
				$html .= "%</td>";
				
				// PREZZO TOTALE
				$html .= "<td style=\"width:71px;background-color:#fff;padding:5px;height:30px;border-bottom:1px solid #666;text-align:right;\">";
				$html .= @number_format($accessori["motorizzazione"]["costo_totale"], 2, ',','.')." €";
				$html .= "</td>";
				
				$html .= "</tr>";
				
		}	
		
		
		///////////////////////////////////////////////////////////////////////////////////////
		///////////////////////////// motorizzazione /////////////////////////////////////////	
		//////////////////////////////////////////////////////////////////////////////////////
		
		if($accessori["motorizzazione"]){
			
			///////////////////////////////////////////////////////////////////////////////////////
			///////////////////////////// optional motorizzazione /////////////////////////////////	
			//////////////////////////////////////////////////////////////////////////////////////
			
			for($j = 0;$j < count($accessori["motorizzazione"]["optional"]);$j++){
				
				//$this->main->max_righe_x_pagina--;
				
				$html .= "<tr>";
				
					//RIFERIMENTO
					$html .= "<td style=\"width:43px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
					$html .= $riferimento;
					$html .= "</td>";
					
					// CODICE
					$html .= "<td style=\"width:76px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;\">";
					$html .= $accessori["motorizzazione"]["optional"][$j]["codice"];
					$html .= "</td>";
					
					// DESCRIZIONE
					$html .= "<td style=\"width:297px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;\">";
					$html .= $accessori["motorizzazione"]["optional"][$j]["descrizione"];
					$html .= "</td>";
					
					// NUMERO
					$html .= "<td style=\"width:35px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
					$html .= $quantita*$accessori["motorizzazione"]["optional"][$j]["quantita"];
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
					$html .= $accessori["motorizzazione"]["um"];
					$html .= "</td>";
					
					// TOTALE
					$html .= "<td style=\"width:42px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
					//$html .= @number_format($sopraluce["totale"], 2, ',','.');
					$html .= "</td>";
					
					// PREZZO UNITARIO
					$html .= "<td style=\"width:76px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:right;\">";
					$html .= @number_format($accessori["motorizzazione"]["optional"][$j]["costo"], 2, ',','.')." €";
					$html .= "</td>";
					
					// SCONTO
					$html .= "<td style=\"width:30px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
					$html .= $accessori["motorizzazione"]["sconto"];
					$html .= "%</td>";
					
					// PREZZO TOTALE
					$html .= "<td style=\"width:71px;background-color:#fff;padding:5px;height:30px;border-bottom:1px solid #666;text-align:right;\">";
					$html .= @number_format($accessori["motorizzazione"]["optional"][$j]["costo_totale"], 2, ',','.')." €";
					$html .= "</td>";
					
					$html .= "</tr>";
					
			}		
		}
		
		
		
		///////////////////////////////////////////////////////////////////////////////////////
		///////////////////////// oblò /////////////////////////////////////////	
		//////////////////////////////////////////////////////////////////////////////////////
		
		if($accessori["oblo"]){
			
			//$this->main->max_righe_x_pagina--;
			
			$html .= "<tr>";
			
				//RIFERIMENTO
				$html .= "<td style=\"width:43px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				$html .= $riferimento;
				$html .= "</td>";
				
				// CODICE
				$html .= "<td style=\"width:76px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;\">";
				$html .= $accessori["oblo"]["codice"];
				$html .= "</td>";
				
				// DESCRIZIONE
				$html .= "<td style=\"width:297px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;\">";
				$html .= $accessori["oblo"]["descrizione"];
				$html .= "</td>";
				
				// NUMERO
				$html .= "<td style=\"width:35px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				$html .= $accessori["oblo"]["quantita"];
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
				$html .= $accessori["oblo"]["um"];
				$html .= "</td>";
				
				// TOTALE
				$html .= "<td style=\"width:42px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				//$html .= @number_format($sopraluce["totale"], 2, ',','.');
				$html .= "</td>";
				
				// PREZZO UNITARIO
				$html .= "<td style=\"width:76px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:right;\">";
				$html .= @number_format($accessori["oblo"]["costo"], 2, ',','.')." €";
				$html .= "</td>";
				
				// SCONTO
				$html .= "<td style=\"width:30px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				$html .= $accessori["oblo"]["sconto"];
				$html .= "%</td>";
				
				// PREZZO TOTALE
				$html .= "<td style=\"width:71px;background-color:#fff;padding:5px;height:30px;border-bottom:1px solid #666;text-align:right;\">";
				$html .= @number_format($accessori["oblo"]["costo_totale"], 2, ',','.')." €";
				$html .= "</td>";
				
				$html .= "</tr>";
				
		}	
		
		
		
		///////////////////////////////////////////////////////////////////////////////////////
		///////////////////////// Griglie /////////////////////////////////////////	
		//////////////////////////////////////////////////////////////////////////////////////
		
		if($accessori["griglie"]){
			
			//$this->main->max_righe_x_pagina--;
			
				$html .= "<tr>";
			
				//RIFERIMENTO
				$html .= "<td style=\"width:43px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				$html .= $riferimento;
				$html .= "</td>";
				
				// CODICE
				$html .= "<td style=\"width:76px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;\">";
				$html .= $accessori["griglie"]["codice"];
				$html .= "</td>";
				
				// DESCRIZIONE
				$html .= "<td style=\"width:297px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;\">";
				$html .= $accessori["griglie"]["descrizione"];
				$html .= "</td>";
				
				// NUMERO
				$html .= "<td style=\"width:35px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				$html .= $accessori["griglie"]["quantita"];
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
				$html .= $accessori["griglie"]["um"];
				$html .= "</td>";
				
				// TOTALE
				$html .= "<td style=\"width:42px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				//$html .= @number_format($sopraluce["totale"], 2, ',','.');
				$html .= "</td>";
				
				// PREZZO UNITARIO
				$html .= "<td style=\"width:76px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:right;\">";
				$html .= @number_format($accessori["griglie"]["costo"], 2, ',','.')." €";
				$html .= "</td>";
				
				// SCONTO
				$html .= "<td style=\"width:30px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				$html .= $accessori["griglie"]["sconto"];
				$html .= "%</td>";
				
				// PREZZO TOTALE
				$html .= "<td style=\"width:71px;background-color:#fff;padding:5px;height:30px;border-bottom:1px solid #666;text-align:right;\">";
				$html .= @number_format($accessori["griglie"]["costo_totale"], 2, ',','.')." €";
				$html .= "</td>";
				
				$html .= "</tr>";
				
		}	
		
		
		
		///////////////////////////////////////////////////////////////////////////////////////
		///////////////////////// Molle /////////////////////////////////////////	
		//////////////////////////////////////////////////////////////////////////////////////
		
		if($accessori["molle"]){
			
			//$this->main->max_righe_x_pagina--;
			
			for($j = 0;$j < count($accessori["molle"]["articoli"]);$j++){
			
				$html .= "<tr>";
			
				//RIFERIMENTO
				$html .= "<td style=\"width:43px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				$html .= $riferimento;
				$html .= "</td>";
				
				// CODICE
				$html .= "<td style=\"width:76px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;\">";
				$html .= $accessori["molle"]["articoli"][$j]["codice"];
				$html .= "</td>";
				
				// DESCRIZIONE
				$html .= "<td style=\"width:297px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;\">";
				$html .= $accessori["molle"]["articoli"][$j]["descrizione"];
				$html .= "</td>";
				
				// NUMERO
				$html .= "<td style=\"width:35px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				$html .= $accessori["molle"]["articoli"][$j]["quantita"];
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
				$html .= $accessori["molle"]["articoli"][$j]["um"];
				$html .= "</td>";
				
				// TOTALE
				$html .= "<td style=\"width:42px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				//$html .= @number_format($sopraluce["totale"], 2, ',','.');
				$html .= "</td>";
				
				// PREZZO UNITARIO
				$html .= "<td style=\"width:76px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:right;\">";
				$html .= @number_format($accessori["molle"]["articoli"][$j]["costo"], 2, ',','.')." €";
				$html .= "</td>";
				
				// SCONTO
				$html .= "<td style=\"width:30px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				$html .= $accessori["molle"]["sconto"];
				$html .= "%</td>";
				
				// PREZZO TOTALE
				$html .= "<td style=\"width:71px;background-color:#fff;padding:5px;height:30px;border-bottom:1px solid #666;text-align:right;\">";
				$html .= @number_format($accessori["molle"]["articoli"][$j]["costo_totale"], 2, ',','.')." €";
				$html .= "</td>";
				
				$html .= "</tr>";
			}
				
		}	
		
		
		///////////////////////////////////////////////////////////////////////////////////////
		///////////////////////// PASSAGGIO PEDONALE //////////////////////////////////////////
		//////////////////////////////////////////////////////////////////////////////////////
		
		if($accessori["passaggioPedonale"]){

			if($accessori["passaggioPedonale"]["porta_pedonale"]){
			
				$html .= "<tr>";
			
				//RIFERIMENTO
				$html .= "<td style=\"width:43px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				$html .= $riferimento;
				$html .= "</td>";
				
				// CODICE
				$html .= "<td style=\"width:76px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;\">";
				$html .= $accessori["passaggioPedonale"]["porta_pedonale"]["codice"];
				$html .= "</td>";
				
				// DESCRIZIONE
				$html .= "<td style=\"width:297px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;\">";
				$html .= $accessori["passaggioPedonale"]["porta_pedonale"]["descrizione"];
				$html .= "</td>";
				
				// NUMERO
				$html .= "<td style=\"width:35px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				$html .= $accessori["passaggioPedonale"]["porta_pedonale"]["quantita"];
				$html .= "</td>";
				
				// LARGHEZZA
				$html .= "<td style=\"width:45px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				$html .= $accessori["passaggioPedonale"]["porta_pedonale"]["L"];
				$html .= "</td>";
				
				// ALTEZZA
				$html .= "<td style=\"width:42px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				$html .= $accessori["passaggioPedonale"]["porta_pedonale"]["H"];
				$html .= "</td>";
				
				// UNITA' DI MISURA
				$html .= "<td style=\"width:34px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				$html .= $accessori["passaggioPedonale"]["porta_pedonale"]["um"];
				$html .= "</td>";
				
				// TOTALE
				$html .= "<td style=\"width:42px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				//$html .= @number_format($accessori["passaggioPedonale"]["porta_pedonale"]["totale"], 2, ',','.');
				$html .= "</td>";
				
				// PREZZO UNITARIO
				$html .= "<td style=\"width:76px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:right;\">";
				$html .= @number_format($accessori["passaggioPedonale"]["porta_pedonale"]["costo"], 2, ',','.')." €";
				$html .= "</td>";
				
				// SCONTO
				$html .= "<td style=\"width:30px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				$html .= $accessori["passaggioPedonale"]["porta_pedonale"]["sconto"];
				$html .= "%</td>";
				
				// PREZZO TOTALE
				$html .= "<td style=\"width:71px;background-color:#fff;padding:5px;height:30px;border-bottom:1px solid #666;text-align:right;\">";
				$html .= @number_format($accessori["passaggioPedonale"]["porta_pedonale"]["costo_totale"], 2, ',','.')." €";
				$html .= "</td>";
				
				$html .= "</tr>";
				
			}
			
			
			if($accessori["passaggioPedonale"]["maniglione"]){
			
				//$this->main->max_righe_x_pagina--;
				
				$html .= "<tr>";
			
				//RIFERIMENTO
				$html .= "<td style=\"width:43px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				$html .= $riferimento;
				$html .= "</td>";
				
				// CODICE
				$html .= "<td style=\"width:76px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;\">";
				$html .= $accessori["passaggioPedonale"]["maniglione"]["codice"];
				$html .= "</td>";
				
				// DESCRIZIONE
				$html .= "<td style=\"width:297px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;\">";
				$html .= $accessori["passaggioPedonale"]["maniglione"]["descrizione"];
				$html .= "</td>";
				
				// NUMERO
				$html .= "<td style=\"width:35px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				$html .= $accessori["passaggioPedonale"]["maniglione"]["quantita"];
				$html .= "</td>";
				
				// LARGHEZZA
				$html .= "<td style=\"width:45px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				$html .= $accessori["passaggioPedonale"]["maniglione"]["L"];
				$html .= "</td>";
				
				// ALTEZZA
				$html .= "<td style=\"width:42px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				$html .= $accessori["passaggioPedonale"]["maniglione"]["H"];
				$html .= "</td>";
				
				// UNITA' DI MISURA
				$html .= "<td style=\"width:34px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				$html .= $accessori["passaggioPedonale"]["maniglione"]["um"];
				$html .= "</td>";
				
				// TOTALE
				$html .= "<td style=\"width:42px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				//$html .= @number_format($accessori["passaggioPedonale"]["porta_pedonale"]["totale"], 2, ',','.');
				$html .= "</td>";
				
				// PREZZO UNITARIO
				$html .= "<td style=\"width:76px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:right;\">";
				$html .= @number_format($accessori["passaggioPedonale"]["maniglione"]["costo"], 2, ',','.')." €";
				$html .= "</td>";
				
				// SCONTO
				$html .= "<td style=\"width:30px;background-color:#fff;padding:5px;height:30px;border-right:1px solid #666;border-bottom:1px solid #666;text-align:center;\">";
				$html .= $accessori["passaggioPedonale"]["maniglione"]["sconto"];
				$html .= "%</td>";
				
				// PREZZO TOTALE
				$html .= "<td style=\"width:71px;background-color:#fff;padding:5px;height:30px;border-bottom:1px solid #666;text-align:right;\">";
				$html .= @number_format($accessori["passaggioPedonale"]["maniglione"]["costo_totale"], 2, ',','.')." €";
				$html .= "</td>";
				
				$html .= "</tr>";
				
			}
		}
		
		return $html;
		
	}

}


?>

