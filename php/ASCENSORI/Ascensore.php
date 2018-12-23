<?php

class Ascensore{

	private $connect;
	public function init(){
		$this->connect = new ConnectionDB();
		$this->connect->connetti();
	}

	public function getModelli(){

		$descrizione = "Ascensore da cantiere";

		$query = "SELECT codice, prezzo
				FROM articolo
				WHERE (UPPER(articolo.descrizione) like UPPER('%$descrizione%'))";

		//var_dump($query);

		$result = $this->connect->myQuery($query);

		$objJSON =  array();

		if($this->connect->errno()){
			$objJSON["success"] = false;
			$objJSON["messageError"] = "Siamo spiacenti, si è verificato un errore";
			$objJSON["mysql_error"] = $this->connect->error();
		}else{
			$objJSON["success"] = true;
			$objJSON["results"] = array();
			$cont = 0;
			while($rowValori = mysqli_fetch_array($result)){
				$objJSON["results"][$cont]["codice"] = $rowValori["codice"];
				$objJSON["results"][$cont]["prezzo"] = $rowValori["prezzo"];
				$cont++;
			}
		}
		$this->connect->disconnetti();
		return json_encode($objJSON);
	}

	public function getAltezze($post){

		$modello = $post["modello"];

		$query = "SELECT altezza, descrizione, prezzo FROM articolo_ha_componenti WHERE articolo_ha_componenti.articolo = '$modello' ORDER BY ABS(prezzo)";

		//var_dump($query);

		$result = $this->connect->myQuery($query);

		$objJSON =  array();

		if($this->connect->errno()){
			$objJSON["success"] = false;
			$objJSON["messageError"] = "Siamo spiacenti, si è verificato un errore";
			$objJSON["mysql_error"] = $this->connect->error();
		}else{
			$objJSON["success"] = true;
			$objJSON["results"] = array();
			$cont = 0;
			while($rowValori = mysqli_fetch_array($result)){
				$objJSON["results"][$cont]["altezza"] = $rowValori["altezza"];
				$objJSON["results"][$cont]["prezzo"] = $rowValori["prezzo"];
				$objJSON["results"][$cont]["descrizione"] = $rowValori["descrizione"];
				$cont++;
			}
		}
		$this->connect->disconnetti();
		return json_encode($objJSON);
	}

	public function getComponenti($post){

		$modello = $post["modello"];

		$query = "	SELECT 	articolo_ha_componenti.articolo as articolo,
							articolo_ha_componenti.componente as componente,
							articolo.prezzo as prezzo,
							articolo.descrizione as descrizione
					FROM 	articolo_ha_componenti, articolo
					WHERE 	articolo_ha_componenti.componente = articolo.codice AND
							articolo_ha_componenti.articolo = '$modello'";

							/*
							SELECT articolo_ha_componenti.articolo as articolo,
									articolo_ha_componenti.componente as componente,
							        articolo_ha_componenti.prezzo as prezzo,
							        articolo_ha_componenti.altezza as altezza,
							        articolo_ha_componenti.quantita as quantita,
							        articolo.descrizione as descrizione
							       	FROM articolo_ha_componenti, articolo
							        WHERE articolo_ha_componenti.componente = articolo.codice
							        		AND articolo_ha_componenti.articolo = 'PT300M'
							*/
		//var_dump($query);

		$result = $this->connect->myQuery($query);

		$objJSON =  array();

		if($this->connect->errno()){
			$objJSON["success"] = false;
			$objJSON["messageError"] = "Siamo spiacenti, si è verificato un errore";
			$objJSON["mysql_error"] = $this->connect->error();
		}else{
			$objJSON["success"] = true;
			$objJSON["results"] = array();
			$cont = 0;
			while($rowValori = mysqli_fetch_array($result)){
				$objJSON["results"][$cont]["articolo"] = $rowValori["articolo"];
				$objJSON["results"][$cont]["componente"] = $rowValori["componente"];
				$objJSON["results"][$cont]["prezzo"] = $rowValori["prezzo"];
				$objJSON["results"][$cont]["descrizione"] = $rowValori["descrizione"];
				$cont++;
			}
		}
		$this->connect->disconnetti();
		return json_encode($objJSON);
	}

	public function getOptionals($post){

		$modello = $post["modello"];

		$query = "SELECT 	articolo_ha_optionals.articolo as articolo,
					  	articolo_ha_optionals.componente as componente,
        					articolo.prezzo as prezzo,
        					articolo.descrizione as descrizione,
						articolo.um as um
       			FROM 	articolo_ha_optionals, articolo
        			WHERE 	articolo_ha_optionals.componente = articolo.codice
        					AND articolo_ha_optionals.articolo = '$modello'";

		//var_dump($query);

		$result = $this->connect->myQuery($query);

		$objJSON =  array();

		if($this->connect->errno()){
			$objJSON["success"] = false;
			$objJSON["messageError"] = "Siamo spiacenti, si è verificato un errore";
			$objJSON["mysql_error"] = $this->connect->error();
		}else{
			$objJSON["success"] = true;
			$objJSON["results"] = array();
			$cont = 0;
			while($rowValori = mysqli_fetch_array($result)){
				$objJSON["results"][$cont]["articolo"] = $rowValori["articolo"];
				$objJSON["results"][$cont]["componente"] = $rowValori["componente"];
				$objJSON["results"][$cont]["prezzo"] = $rowValori["prezzo"];
				$objJSON["results"][$cont]["descrizione"] = $rowValori["descrizione"];
				$objJSON["results"][$cont]["um"] = $rowValori["um"];
				$cont++;
			}
		}
		$this->connect->disconnetti();
		return json_encode($objJSON);
	}

}

?>
