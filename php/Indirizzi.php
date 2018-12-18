<?php


class Indirizzi{

	private $connect;
	
	public function init(){
		$this->connect = new ConnectionDB();
	}
	
	
	public function salvaIndirizzo($post){
		$this->connect->connetti();
		
		$query = "INSERT INTO 	indirizzi 
						(	regione,
							nazione,
							provincia,
							comune,
							indirizzo,
							civico,
							cap
							)VALUES(
							'".$post['regione']."',
							'".$post['nazione']."',
							'".$post['provincia']."',
							'".$post['comune']."',
							'".$post['indirizzo']."',
							'".$post['civico']."',
							'".$post['cap']."')";
							
		$result_insert = $this->connect->myQuery($query);
		$id = mysqli_insert_id();
		
		if($this->connect->errno()){
			$objJSON["success"] = false;
			$objJSON["messageError"] = "Siamo spiacenti, si è verificato un errore";
			$objJSON["mysql_error"] = $this->connect->error();
		}else{
			$objJSON["success"] = true;
			$objJSON["results"] = $id;
		}
		
		$this->connect->disconnetti();
		return json_encode($objJSON);
	}
	
	public function modifyIndirizzo($post){	
		$this->connect->connetti();
		$result_insert = $this->connect->myQuery("UPDATE indirizzi SET regione='".$post['regione']."',nazione='".$post['nazione']."',provincia='".$post['provincia']."',comune='".$post['comune']."',indirizzo='".$post['indirizzo']."',civico='".$post['civico']."',cap='".$post['cap']."' WHERE id='".$post["id_indirizzo"]."'");
		
		
		if($this->connect->errno()){
			$objJSON["success"] = false;
			$objJSON["messageError"] = "Siamo spiacenti, si è verificato un errore";
			$objJSON["mysql_error"] = $this->connect->error();
		}else{
			$objJSON["success"] = true;
			$objJSON["results"] = array();
		}
		
		$this->connect->disconnetti();
		return json_encode($objJSON);
	}
	
	public function getRegioni(){
		$this->connect->connetti();
		$result = $this->connect->myQuery("SELECT * FROM regioni ORDER BY nome");
		$objJSON =  array();
		$cont = 0;
		while($row = mysqli_fetch_array($result)){
			$objJSON[$cont]['id'] = $row['id'];
			$objJSON[$cont]['nome'] = $row['nome'];
			$objJSON[$cont]['provincia'] = $row['provincia'];
			$cont++;
		}
		//$out = array_values($objJSON);
		//var_dump(json_encode($objJSON));
		//$this->connect->disconnetti();
		$this->connect->disconnetti();
		return json_encode($objJSON);
		//return $json;
	}
	
	public function getProvince($post){
		$this->connect->connetti();
		//var_dump("SELECT * FROM provincia WHERE id_regione='".$post['regione']."'");
	
		$result = $this->connect->myQuery("SELECT * FROM province WHERE id_regione='".$post['regione']."' ORDER BY nome");
		$objJSON =  array();
		$cont = 0;
		while($row = mysqli_fetch_array($result)){
			$objJSON[$cont]['id'] = $row['id'];
			$objJSON[$cont]['nome'] = $row['nome'];
			$cont++;
		}
		//$out = array_values($objJSON);
		//var_dump(json_encode($objJSON));
		//$this->connect->disconnetti();
		$this->connect->disconnetti();
		return json_encode($objJSON);
		//return $json;
	}
	
	public function getComuni($post){
	
		//var_dump("SELECT * FROM comuni WHERE id_provincia='".$post['provincia']."'");
		$this->connect->connetti();
		$result = $this->connect->myQuery("SELECT * FROM comuni WHERE id_provincia='".$post['provincia']."' ORDER BY nome");
		$objJSON =  array();
		$cont = 0;
		while($row = mysqli_fetch_array($result)){
			$objJSON[$cont]['id'] = $row['id'];
			$objJSON[$cont]['nome'] = $row['nome'];
			$cont++;
		}
		//$out = array_values($objJSON);
		//var_dump(json_encode($objJSON));
		//$this->connect->disconnetti();
		$this->connect->disconnetti();
		return json_encode($objJSON);
		//return $json;
	}
	
	public function getNazioni(){
	
		//var_dump("SELECT * FROM comuni WHERE id_provincia='".$post['provincia']."'");
		$this->connect->connetti();
		$result = $this->connect->myQuery("SELECT * FROM nazioni ORDER BY nome");
		$objJSON =  array();
		$cont = 0;
		while($row = mysqli_fetch_array($result)){
			$objJSON[$cont]['id'] = $row['id'];
			$objJSON[$cont]['nome'] = $row['nome'];
			$cont++;
		}
		//$out = array_values($objJSON);
		//var_dump(json_encode($objJSON));
		//$this->connect->disconnetti();
		$this->connect->disconnetti();
		return json_encode($objJSON);
		//return $json;
	}
	
	
	public function checkPartitaIva($post){
		$this->connect->connetti();
		$result = $this->connect->myQuery("SELECT * FROM user WHERE partita_iva='".$post['partita_iva']."' AND account<>'".$post["email"]."'");
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
				$tmp = array();
				$tmp["nome"] = $rowValori["nome"];
				$tmp["cognome"] = $rowValori["cognome"];
				$tmp["partita_iva"] = $rowValori["partita_iva"];
				$objJSON["results"][$cont] = $tmp;
				$cont++;
			}
		}
		$this->connect->disconnetti();
		return json_encode($objJSON);
	}
	
	public function checkEmail($post){
		$this->connect->connetti();
		
		
		$query = "SELECT * FROM account WHERE email='".$post['email']."'";
		
		
		$result = $this->connect->myQuery($query);
		$objJSON =  array();
		
		if($this->connect->errno()){
			$objJSON["success"] = false;
			$objJSON["messageError"] = $this->connect->error();
			$this->connect->disconnetti();
			return json_encode($objJSON);
		}else{
			$objJSON["success"] = true;
			$objJSON["results"] = array();
			$cont = 0;
			while($rowValori = mysqli_fetch_array($result)){
				$objJSON["results"][$cont] = $rowValori["email"];
				$cont++;
			}
		}
		$this->connect->disconnetti();
		return json_encode($objJSON);
	}
	
	public function checkCodicePreventivazione($post){
		$this->connect->connetti();
		//var_dump("SELECT * FROM user WHERE account <> '".$post['account']."' AND codice_preventivazione='".$post["codice_preventivazione"]."' AND tipo='".$post["tipologiaUtente"]."'");
		
		$result = $this->connect->myQuery("SELECT * FROM user WHERE account <> '".$post['account']."' AND codice_preventivazione='".$post["codice_preventivazione"]."' AND tipo='".$post["tipologiaUtente"]."'");
		
		$objJSON =  array();
		if($this->connect->errno()){
			$objJSON["success"] = false;
			$objJSON["messageError"] = "Siamo spiacenti, si è verificato un errore";
			$objJSON["mysql_error"] = $this->connect->error();
		}else{
			$objJSON["success"] = true;
			$cont = mysqli_num_rows($result);
			$objJSON["results"]["num"] = $cont;
		}
		$this->connect->disconnetti();
		return json_encode($objJSON);
	}
	
	public function checkCodiceFiscale($post){
		
		//var_dump("SELECT * FROM user WHERE codice_fiscale='".$post['codice_fiscale']."' AND account<>".$post["email"]."'");
		$this->connect->connetti();
		$result = $this->connect->myQuery("SELECT * FROM user WHERE codice_fiscale='".$post['codice_fiscale']."' AND account<>'".$post["email"]."'");
		$objJSON =  array();
		if($this->connect->errno()){
			$objJSON["success"] = false;
			$objJSON["messageError"] = "Siamo spiacenti, si è verificato un errore";
			$objJSON["mysql_error"] = $this->connect->error();
		}else{
			$objJSON["success"] = true;
			$objJSON["results"] = array();
			$cont = 0;
			while($rowValori = mysqli_fetch_array($result )){
				$tmp = array();
				$tmp["nome"] = $rowValori["nome"];
				$tmp["cognome"] = $rowValori["cognome"];
				$tmp["codice_fiscale"] = $rowValori["codice_fiscale"];
				$objJSON["results"][$cont] = $tmp;
				$cont++;
			}
		}
		$this->connect->disconnetti();
		return json_encode($objJSON);
	}
	
	
	public function generaPasswordCriptata($post){
		
		define("SALT","cerrato");
		
		$password_criptata = md5(SALT.$post["password"]);
		$objJSON =  array();
		$objJSON["password"] = $password_criptata;
		
		return json_encode($objJSON);
	}
	
	private function random_string($length) {
		$string = "";

		// genera una stringa casuale che ha lunghezza
		// uguale al multiplo di 32 successivo a $length
		for ($i = 0; $i <= ($length/32); $i++)
			$string .= md5(time()+rand(0,99));
	
		// indice di partenza limite
		$max_start_index = (32*$i)-$length;
	
		// seleziona la stringa, utilizzando come indice iniziale
		// un valore tra 0 e $max_start_point
		$random_string = substr($string, rand(0, $max_start_index), $length);
	
		return $random_string;
	}
	
	public function recuperaPassword($post){
		
		$password = $this->random_string(10);
		define("SALT","cerrato");
		
		$password_criptata = md5(SALT.$password);
		
		$this->connect->connetti();
		$query1 = "UPDATE account SET password = '".$password_criptata."' WHERE email = '".$post["email"]."'";
		//var_dump($query);
		
		$result1 = $this->connect->myQuery($query1);
		$cont = mysqli_affected_rows();
		
		
		$objJSON =  array();
		if($this->connect->errno()){
			$objJSON["success"] = false;
			$objJSON["messageError"] = "Siamo spiacenti, si è verificato un errore";
			$objJSON["mysql_error"] = $this->connect->error();
		}else{
			$objJSON["success"] = true;
			
			if($cont > 0){
				$objJSON["results"] = true;
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
				$mail->AddReplyTo($post["email"]); 
				$mail->FromName = "Cerrato Spa";
				$mail->Subject = "Richiesta recupero password";
				
				$mailMessage = "<html><body>Abbiamo ricevuto la richiesta di ripristino password.<br>La nuova password &egrave; <b>".$password."</b><br>Per motivi di sicurezza la preghiamo di accedere all'area riservata e modificare, nella sezione profilo, la password appena generata con una sua personale.<br>La ringraziamo per la sua disponibilit&agrave;.</body></html>";
				
				$mail->Body = $mailMessage;
				$mail->AddAddress($post["email"]);
				$mail->Send();
				$mail->SmtpClose();
			
			}else
				$objJSON["results"] = false;
		}
		
		$this->connect->disconnetti();
		return json_encode($objJSON);
	}
}


?>