<?

// SQL_CALC_FOUND_ROWS restituisce il numero totale dei clienti la cui ragione_sociale include la parola chiave $post["keyword"]
// mentre il resto della query restituisce il sotto insieme di 10 clienti la cui ragione_sociale include la parola chiave $post["keyword"]
$query = "SELECT  	SQL_CALC_FOUND_ROWS
					C1.ragione_sociale				
			FROM 	clienti
			WHERE 	C1.ragione_sociale like '%".$post['keyword']."%' LIMIT 0, 10";
		
		$result = $this->connect->myQuery($query);
		
		$cont = 0;
	
		if($this->connect->errno()){
			$objJSON["success"] = false;
			$objJSON["access"] = true;
			$objJSON["messageError"] = $this->connect->error();
			$objJSON["paramsError"] = $post;
		}else{
			
			// QUESTA SECONDA QUERY MOLTO LEGGERE RESTITUISCE IL TOTALE DELLE RIGHE DELLA QUERY PRECEDENTE $query
			$result_tot = $this->connect->myQuery("SELECT FOUND_ROWS()");
			$tot_clienti = mysqli_fetch_array($result_tot); 
			
			// IN $tot_clienti VIENE ASSEGNATO IL NUMERO DI CLIENTI CORRISPONDENTE ALLA QUERY $query
			$tot_clienti = $tot_clienti["FOUND_ROWS()"];
			
			while($row = mysqli_fetch_array($result)){
				
				// 	QUI INSERISCO NEL PARAMETRO tot IL TOTALE CLIENTI DELLA RICERCA
				$objJSON["results"]['tot'] = (int)$tot_clienti;
				$objJSON["results"]['clienti'][$cont]['ragione_sociale'] = stripslashes($row['ragione_sociale']);
				$cont++;
			}
			
			/********** ESEMPIO DI RISULTATO
			/*	$objJSON["results"]['tot'] = 250;
				$objJSON["results"]['clienti'][0]['ragione_sociale'] = 'A';
				$objJSON["results"]['clienti'][1]['ragione_sociale'] = 'B';
				$objJSON["results"]['clienti'][2]['ragione_sociale'] = 'C';
				$objJSON["results"]['clienti'][3]['ragione_sociale'] = 'D';
				$objJSON["results"]['clienti'][4]['ragione_sociale'] = 'E';
				$objJSON["results"]['clienti'][5]['ragione_sociale'] = 'F';
				$objJSON["results"]['clienti'][6]['ragione_sociale'] = 'G';
				$objJSON["results"]['clienti'][7]['ragione_sociale'] = 'H';
				$objJSON["results"]['clienti'][8]['ragione_sociale'] = 'I';
				$objJSON["results"]['clienti'][9]['ragione_sociale'] = 'L';
			
			*/
		}
        
  ?>