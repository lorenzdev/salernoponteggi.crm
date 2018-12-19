<?php


class ConnectionDB{




	private $db_host = "localhost";
	private $db_user = "root";
	private $db_password = "root";
	private $db_database = "salerno_ponteggi";

/*
	private $db_host = "62.149.150.205";
	private $db_user = "Sql723311";
	private $db_password = "un5vz60256";
	private $db_database = "Sql723311_2";
*/

	private $attiva = false;
	public $connessione;
	public $selezione;



	public function connetti(){
		if(!$this->attiva){
			$this->connessione = mysqli_connect($this->db_host,$this->db_user,$this->db_password, $this->db_database) or die ("Errore1: ".mysqli_error());
			mysqli_set_charset($this->connessione,'utf8');
			if(!mysqli_connect_errno())
     		 {
				$this->attiva = true;

			 }
		 }

		return $this->connessione;
	}

	public function myMultiQuery($query){
		$result = mysqli_multi_query($this->connessione,$query);
		return $result;
	}


	public function myQuery($query){
		$result = mysqli_query($this->connessione,$query);
		return $result;
	}

	public function errno(){
		return mysqli_errno($this->connessione);
	}

	public function error(){
		return mysqli_error($this->connessione);
	}

	public function insert_id(){
		return mysqli_insert_id($this->connessione);
	}

	public function next_result(){
		return mysqli_next_result($this->connessione);
	}

	public function more_results(){
		return mysqli_more_results($this->connessione);
	}

	public function affected_rows(){
		return mysqli_affected_rows($this->connessione);
	}


	public function disconnetti(){

		if(!$this->attiva) return;

		mysqli_close($this->connessione);
		$this->attiva = false;
	}

}

?>
