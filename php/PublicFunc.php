<?PHP

class PublicFunc{
	
	public function generaCodice($lung_pass){
	
		$data = mktime(date('H'),date('i'),date('s'),date('m'),date('d'),date('Y'))."000";
		$mypass = "";
		// Creo un ciclo for che si ripete per il valore di $lung_pass
		for ($x=1; $x<=$lung_pass; $x++)
		{
		  // Se $x è multiplo di 2...
		  if ($x % 2){
			// Aggiungo una lettera casuale usando chr() in combinazione
			// con rand() che genera un valore numerico compreso tra 97
			// e 122, numeri che corrispondono alle lettere dell'alfabeto
			// nella tabella dei caratteri ASCII
			$mypass = $mypass . chr(rand(97,122));
		
		  // Se $x non è multiplo di 2...
		  }else{
			// Aggiungo alla password un numero compreso tra 0 e 9
			$mypass = $mypass . rand(0,9);
		  }
		}
		
		
		$mypass = substr($mypass, 0,$lung_pass-strlen($data));
		$mypass .= $data;
		
		/*$new_string = "";
		$cont = 0;
		for($i = 0;$i < $lung_pass;$i++){
			if ($i % 2 && $cont <= strlen($data)){
				$new_string .= $data{$cont};
				$cont++;
			}else{
				$new_string .= $lung_pass{$i};
			}
		}
		*/
	
		
		return $mypass;
		
	}
	
}


?>