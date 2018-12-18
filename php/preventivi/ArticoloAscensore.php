<?

class ArticoloAscensore{
	
	
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
		$heightSopraluce = $sopraluce["H"];
		$descSopraluce  = "";
		$codiceSopraluce = "";
		$prezzoSopraluce = "";
		$quantita = $articolo["quantita"];
		
		
		///////////////////////////////////////////////////////////////////////////////////////
		///////////////////////// DATI DELLA PORTA////////////////////////////////////////////	
		//////////////////////////////////////////////////////////////////////////////////////
		
		$html = "<tr>";
        
		/*
		//RIFERIMENTO
		$html .= "<td style=\"width:43px;padding:5px;border-bottom:1px solid #666;text-align:center;\">";
		$html .= $riferimento;
		$html .= "</td>";
		*/
		
		
		// CODICE
        $html .= "<td style=\"border-left:1px solid #000;padding:5px;border-bottom:1px solid #666;\">";
		$html .= $articolo["articolo"]["modello"];
		$html .= "</td>";
		
		// DESCRIZIONE
        $html .= "<td style=\"padding:5px;border-bottom:1px solid #666;\">";
		$html .= $articolo["articolo"]["componenti"];
		$html .= "</td>";
 
 		// ALTEZZA
        $html .= "<td style=\"padding:5px;border-bottom:1px solid #666;text-align:center;\">";
		$html .= $articolo["articolo"]["altezza"];
		$html .= "</td>";
		
		// LUNGHEZZA
        $html .= "<td style=\"padding:5px;border-bottom:1px solid #666;text-align:center;\">";
		$html .= "</td>";
        
		// UNITA' DI MISURA
        $html .= "<td style=\"padding:5px;border-bottom:1px solid #666;text-align:center;\">";
		$html .= "NR";
		$html .= "</td>";

		// PESO
        $html .= "<td style=\"padding:5px;border-bottom:1px solid #666;text-align:center;\">";
		$html .= "";
		$html .= "</td>";
		
		// QUANTITA'
		$html .= "<td style=\"padding:5px;border-bottom:1px solid #666;text-align:center;\">";
		$html .= $quantita;
		$html .= "</td>";
		
		// PREZZO UNITARIO
        $html .= "<td style=\"padding:5px;border-bottom:1px solid #666;text-align:right;\">";
		$html .= "EUR ".@number_format($articolo["articolo"]["totale"], 2, ',','.');
		$html .= "</td>";
		
		// SCONTO
		$html .= "<td style=\"padding:5px;border-bottom:1px solid #666;text-align:center;\">";
		$html .= $articolo["sconto"]."%";
		$html .= "</td>";
		
		// PREZZO TOTALE
        $html .= "<td style=\"padding:5px;border-bottom:1px solid #666;text-align:right;border-right:1px solid #000;\">";
		$html .= "EUR ".@number_format($articolo["articolo"]["totale_scontato"], 2, ',','.');
		$html .= "</td>";
		
        $html .= "</tr>";
			
		//$this->main->max_righe_x_pagina--;
		
		
		///////////////////////////////////////////////////////////////////////////////////////
		///////////////////////// sistema di chiusura /////////////////////////////////////////	
		//////////////////////////////////////////////////////////////////////////////////////
		
		if($articolo["optionals"]){
			
			for($j = 0;$j < count($articolo["optionals"]);$j++){
			
				$html .= "<tr>";
			
				// CODICE
				$html .= "<td style=\"border-left:1px solid #000;padding:5px;border-bottom:1px solid #666;\">";
				$html .= $articolo["optionals"][$j]["codice"];
				$html .= "</td>";
				
				// DESCRIZIONE
				$html .= "<td style=\"padding:5px;border-bottom:1px solid #666;\">";
				$html .= $articolo["optionals"][$j]["descrizione"];
				$html .= "</td>";
		 
				// ALTEZZA
				$html .= "<td style=\"padding:5px;border-bottom:1px solid #666;text-align:center;\">";
				$html .= "";
				$html .= "</td>";
				
				// LUNGHEZZA
				$html .= "<td style=\"padding:5px;border-bottom:1px solid #666;text-align:center;\">";
				$html .= "</td>";
				
				// UNITA' DI MISURA
				$html .= "<td style=\"padding:5px;border-bottom:1px solid #666;text-align:center;\">";
				$html .= $articolo["optionals"][$j]["um"];
				$html .= "</td>";
		
				// PESO
				$html .= "<td style=\"padding:5px;border-bottom:1px solid #666;text-align:center;\">";
				$html .= "";
				$html .= "</td>";
				
				// QUANTITA'
				$html .= "<td style=\"padding:5px;border-bottom:1px solid #666;text-align:center;\">";
				$html .= $articolo["optionals"][$j]["quantita"];
				$html .= "</td>";
				
				// PREZZO UNITARIO
				$html .= "<td style=\"padding:5px;border-bottom:1px solid #666;text-align:right;\">";
				$html .= "EUR ".@number_format($articolo["optionals"][$j]["prezzo"], 2, ',','.')."";
				$html .= "</td>";
				
				// SCONTO
				$html .= "<td style=\"padding:5px;border-bottom:1px solid #666;text-align:center;\">";
				$html .= $articolo["optionals"][$j]["sconto"]."%";
				$html .= "</td>";
				
				// PREZZO TOTALE
				$html .= "<td style=\"padding:5px;border-bottom:1px solid #666;text-align:right;border-right:1px solid #000;\">";
				$html .= "EUR ".@number_format($articolo["optionals"][$j]["prezzo_scontato"], 2, ',','.');
				$html .= "</td>";
				
				$html .= "</tr>";
			}	
		}
		
		return $html;
		
	}
	
	
	public function getModulo($articolo, $i){
		
        $alpha = "ABCDEFGHILMNOPQRSTUVZ";
        $l = $alpha[$i];
		$riferimento = $l;
		$porta = $articolo["porta"];
		$foro = $articolo["foroMuro"];
		$portaW = $porta["L"];
		$portaH = $porta["H"];
		$foroW = $foro["L"];
		$foroH = $foro["H"];
		$famiglia = $porta["famiglia"];
		$debordatura = $porta["debordatura"];
		$accessori = $articolo["accessori"];
		$sopraluce = $accessori["sopraluce"];
		$heightSopraluce = $sopraluce["H"];
		$descSopraluce  = "";
		$codiceSopraluce = "";
		$prezzoSopraluce = "";
		$quantita = $articolo["articolo"]["quantita"];
		
		
		$mq = ($portaW/1000)*($portaH/1000);
		if($mq<6)
			$mq = 6;	
			
		
		$sx = $articolo["ingombro"]["sx"];
		$dx = $articolo["ingombro"]["dx"];
		$up = $articolo["ingombro"]["up"];
		
		$note = "";
		
		if($accessori["verniciatura"]) $note .= "verniciata, ";
		if($accessori["passaggioPedonale"]) $note .= "passaggio pedonale, ";
		if($accessori["motorizzazione"]) $note = "motorizzata, ";
		
		if(strpos($articolo["sottoversione"]["codice"], 'F/C') !== false){
			$capp_asol = "CAPP";
			$fileInferiori = $articolo["sottoversione"]["fileInferiori"];
			$fileSuperiori = $articolo["sottoversione"]["fileSuperiori"];
		}
		
		if(strpos($articolo["sottoversione"]["codice"], 'F/A') !== false){
			$capp_asol = "ASOL";
			$fileInferiori = $articolo["sottoversione"]["fileInferiori"];
			$fileSuperiori = $articolo["sottoversione"]["fileSuperiori"];
		}
		
		if(strpos($articolo["sottoversione"]["codice"], 'AR/') !== false || $articolo["sottoversione"]["codice"] == "Orsogril"){
			$micr = "X";
		}
		
		if($note) $note = substr($note,0,strlen($note)-2);
		
		if($i%2 == 0)
			$colore = "#eee";
			else
			$colore = "#FFF";
		
		$html = <<<EOD
				<tr bgcolor="$colore">
            	<td class="value_column" style="width:56px;">$riferimento</td>
                <td class="value_column" style="width:57px;">$quantita</td>
                <td class="value_column" style="width:220px;">
                
                	<table style="width:220px;height:100%;border-bottom:0.1mm solid #000;border-spacing: 0px;">
                    	<tr>
                        	<td style="width:50%;border-right:0.1mm solid #000;padding:5px 0px 5px 5px;">L<sub>FM</sub>&nbsp;&nbsp;&nbsp;&nbsp;$foroW</td>
                        	<td style="padding:5px 0px 5px 5px;">H<sub>FM</sub>&nbsp;&nbsp;&nbsp;&nbsp;$foroH</td>
                        </tr>
                    </table>
                    
                    <table style="width:220px;height:100%;border-spacing: 0px;">
                    	<tr>
                        	<td style="width:33%;border-right:0.1mm solid #000;padding:5px 0px 5px 5px;">L<sub>FM</sub></td>
                        	<td style="width:33%;border-right:0.1mm solid #000;padding:5px 0px 5px 5px;">H<sub>FM</sub></td>
                            <td style="padding:5px 0px 5px 5px;">H<sub>FM</sub></td>
                        </tr>
                    </table>
                
                </td>
               
                <td class="value_column" style="width:61px;">$portaW</td>
                <td class="value_column" style="width:62px;">$portaH</td>
                
                <td class="value_column" style="width:61px;">$heightSopraluce</td>
                <td class="value_column" style="width:62px;"></td>
                
                <td class="value_column" style="width:31px;">$sx</td>
                <td class="value_column" style="width:30px;">$dx</td>
                <td class="value_column" style="width:37px;">$up</td>
				
                <td class="value_column" style="width:45px;"></td>
                
                <td class="value_column" style="width:51px;">$capp_asol</td>
                <td class="value_column" style="width:25px;">$fileSuperiori</td>
                <td class="value_column" style="width:25px;">$fileInferiori</td>
                <td class="value_column" style="width:25px;">$micr</td>
                <td class="value_column" style="width:37px;">$alett</td>
                
                <td class="value_column" style="width:31px;"></td>
                <td class="value_column" style="width:32px;"></td>
                <td class="value_column" style="width:31px;"></td>
                <td class="value_column" style="width:32px;"></td>
                <td class="value_column" style="width:111px;">$note</td>
            </tr>
EOD;
		
		
		return $html;
	}
		
	
	
}


?>

