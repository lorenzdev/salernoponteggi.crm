<?php


class RegistrazioneUtente{

	private $connect;
	private $cookie;

	public function init(){
		$this->connect = new ConnectionDB();
		$this->cookie = json_decode($_COOKIE["utente"]);
	}


	public function salvaLogs($post){

		date_default_timezone_set('Europe/Berlin');

		$objJSON = array();
		$objJSON["success"] = true;

		$file_logs = "logs.txt";
		$logs = file_get_contents($file_logs);
		$logs .= "\n".date("d/m/Y, h:m:s").': Error: '.$post["errorMsg"].', Script: '.$post["url"].'  Line: '. $post["lineNumber"];

		file_put_contents($file_logs,$logs);
		return json_encode($objJSON);

	}


	public function checkSession($post){
		$this->connect->connetti();
		$token = $post['token'];
		$account = $post['account'];

		$result = $this->connect->myQuery("SELECT token FROM sessioni WHERE account='".$account."' AND token='".$token."'");
		$objJSON = array();
		if($this->connect->errno()){
			$objJSON["success"] = false;
			$objJSON["messageError"] = "Sessione scaduta";
		}else{
			$rowNum = mysqli_num_rows($result);
			if($rowNum != 1){
				$objJSON["success"] = false;
				$objJSON["messageError"] = "Sessione scaduta";
			}else{
				$objJSON["success"] = true;
			}

			if(!$objJSON["success"]){
				//var_dump("DELETE FROM sessioni WHERE account='".$account."'");
				$this->connect->myQuery("DELETE FROM sessioni WHERE account='".$account."'");
			}
		}
		$this->connect->disconnetti();
		return json_encode($objJSON);
	}

	public function login($post){

		$this->connect->connetti();

		define("SALT","cerrato");

		$password_criptata = md5(SALT.$post["password"]);

		$query = "SELECT 	account.email AS email,
							account.stato as stato,
							user.nome as nome,
							user.cognome as cognome,
							user.sesso as sesso,
							ruoli.etichetta as ruolo
				FROM 		account,user,ruoli
				WHERE 		account.email='".$post["username"]."' AND
							password='".$password_criptata."' AND
							ruoli.id = account.ruolo AND
							account.email = user.email";



		$result = $this->connect->myQuery($query);

		if($this->connect->errno()){
			$objJSON["success"] = false;
			$objJSON["messageError"] = "Errore generico";
		}else{
			$objJSON["success"] = true;
			$objJSON["results"] = array();
			$rowNum = mysqli_num_rows($result);
			if($rowNum > 0){
				$rowValori = mysqli_fetch_array($result);

				$objJSON["results"]["email"] = $rowValori["email"];
				$objJSON["results"]["tipo"] = $rowValori["tipo"];
				$objJSON["results"]["stato"] = $rowValori["stato"];
				$objJSON["results"]["nome"] = $rowValori["nome"];
				$objJSON["results"]["cognome"] = $rowValori["cognome"];
				$objJSON["results"]["ruolo"] = $rowValori["ruolo"];
				$objJSON["results"]["sesso"] = $rowValori["sesso"];
				$objJSON["results"]["ruolo"] = $rowValori["ruolo"];
			}

			$token = $post['token'];
			$account = $post["username"];

			//var_dump("INSERT INTO sessioni (token,account) VALUES( '".$token."', '".$account."')");

			$query = "INSERT IGNORE INTO sessioni (token,account) VALUES( '".$token."', '".$account."')";

			$this->connect->myQuery($query);

		}
		$this->connect->disconnetti();
		return json_encode($objJSON);
	}

	public function logout($post){

		$this->connect->connetti();

		$this->connect->myQuery("DELETE FROM sessioni WHERE account='".$post["email"]."'");
		$objJSON = array();
		if($this->connect->errno()){
			$objJSON["success"] = false;
			$objJSON["messageError"] = "Errore.";
		}else{
			$objJSON["success"] = true;
			$objJSON["messageError"] = "Sessione scaduta";
		}
		$this->connect->disconnetti();
		return json_encode($objJSON);
	}

	public function getUtenteByAccount($post){

		$this->connect->connetti();

		$query = "SELECT
			user.nome as nome,
			user.cognome as cognome,
			user.sesso as sesso,
			user.codice_fiscale as codice_fiscale,
			user.partita_iva as partita_iva,
			user.telefono as telefono,
			user.cellulare as cellulare,
			user.mansioni as mansioni,
			user.regione as regione,
			user.provincia as provincia,
			account.email AS email,
			account.ruolo AS ruolo,
			account.stato as stato,
			account.codice_preventivazione as codice_preventivazione,
			ruoli.etichetta as etichetta_ruolo,
			REG.nome as nome_regione,
			PROV.nome as nome_provincia
			FROM 	account,
					user

					LEFT JOIN(
					SELECT
						regioni.id as id,
						regioni.nome as nome
					FROM	regioni

					) as REG ON REG.id = user.regione

					LEFT JOIN(
						SELECT
							province.id as id,
							province.nome as nome
						FROM	province

					) as PROV ON PROV.id = user.regione

					,ruoli
			WHERE ruoli.id = account.ruolo
			AND account.email = user.email
			AND account.email='".$post["account"]."'
			GROUP BY user.email
			LIMIT 1";

		//var_dump($query);

		$result = $this->connect->myQuery($query);


		if($this->connect->errno()){
			$objJSON["success"] = false;
			$objJSON["messageError"] = "Errore generico";
		}else{
			$objJSON["success"] = true;
			$objJSON["results"] = array();
			while($rowValori = mysqli_fetch_array($result)){
				$objJSON["results"]["nome"] = $rowValori["nome"];
				$objJSON["results"]["cognome"] = $rowValori["cognome"];
				$objJSON["results"]["mansioni"] = $rowValori["mansioni"];
				$objJSON["results"]["email"] = $rowValori["email"];
				$objJSON["results"]["telefono"] = $rowValori["telefono"];
				$objJSON["results"]["cellulare"] = $rowValori["cellulare"];
				$objJSON["results"]["stato"] = $rowValori["stato"];
				$objJSON["results"]["etichetta_ruolo"] = $rowValori["etichetta_ruolo"];
				$objJSON["results"]["codice_preventivazione"] = $rowValori["codice_preventivazione"];
				$objJSON["results"]["ruolo"] = $rowValori["ruolo"];
				$objJSON["results"]["sesso"] = $rowValori["sesso"];
				$objJSON["results"]["codice_fiscale"] = $rowValori["codice_fiscale"];
				$objJSON["results"]["partita_iva"] = $rowValori["partita_iva"];
				$objJSON["results"]["regione"] = $rowValori["regione"];
				$objJSON["results"]["provincia"] = $rowValori["provincia"];
				$objJSON["results"]["nome_regione"] = $rowValori["nome_regione"];
				$objJSON["results"]["nome_provincia"] = $rowValori["nome_provincia"];
			}

		}
		$this->connect->disconnetti();
		return json_encode($objJSON);
	}

	public function modifyAccount($post){
		$objJSON = array();
		$objJSON["success"] = true;

		$this->connect->connetti();
		$pass = "";


		$regione = "NULL";
		if($post["utente"]["regione"]) $regione = "'".$post["utente"]["regione"]."'";

		$provincia = "NULL";
		if($post["utente"]["provincia"]) $provincia = "'".$post["utente"]["provincia"]."'";

		$query = "UPDATE 	user
					SET 	nome = '".addslashes($post["utente"]["nome"])."',
							cognome = '".addslashes($post["utente"]["cognome"])."',
							sesso = '".addslashes($post["utente"]["sesso"])."',
							mansioni = '".addslashes($post["utente"]["mansioni"])."',
							telefono = '".addslashes($post["utente"]["telefono"])."',
							cellulare = '".addslashes($post["utente"]["cellulare"])."',
							partita_iva = '".addslashes($post["utente"]["partita_iva"])."',
							codice_fiscale = '".addslashes($post["utente"]["codice_fiscale"])."',
							regione = ".$regione.",
							provincia = ".$provincia."
					WHERE 	email='".$post["account"]."'";


		$this->connect->myQuery($query);


		if($this->connect->errno()){
			$objJSON["success"] = false;
			$objJSON["errorMessage"] = "Siamo spiacenti, l'inserimento del cliente non è andato a buon fine.";
$objJSON["mysql_error"] = $this->connect->error();
			$this->connect->disconnetti();
			return json_encode($objJSON);
		}else{
			$objJSON["success"] = true;


			if($post["utente"]["password"]){

				define("SALT","cerrato");
				$query_account = "UPDATE 	account
								SET 		password = '".md5(SALT.$post["utente"]["password"])."'
								WHERE		email = '".$post["account"]."'";

				$this->connect->myQuery($query_account);

				if($this->connect->errno()){
					$objJSON["success"] = false;
					$objJSON["errorMessage"] = "Siamo spiacenti, l'inserimento del cliente non è andato a buon fine.";
$objJSON["mysql_error"] = $this->connect->error();
					$this->connect->disconnetti();
					return json_encode($objJSON);
				}

			}
		}

		$this->connect->disconnetti();
		return json_encode($objJSON);
	}

	public function getAllUtenti($post){

		$this->connect->connetti();

		$ruolo = strtoupper($post["keyword"]);
		if($ruolo == null) {
			$ruolo = "";
		} else {
			if($ruolo == "AMMINISTRATORE" || $ruolo == "ADMIN") {
				$ruolo = "AMMINISTRATORE";
			} else if($ruolo == "AGENTE") {
				$ruolo = "AGENTE";
			}
		}

		$strg = explode(" ", $post["keyword"]);

		$where = $post["keyword"];
		if($where == null) {
			$where = "";
		}else {
			if(is_numeric($where)) {
				$where = " AND (UPPER(account.codice_preventivazione) like UPPER('%".$post["keyword"]."%'))";
			} else {
				//uso upper per rendere la query case insentive
				//La ricerca completa sul nome non prevede la ricerca per il doppio nome
				$where = " AND (UPPER(nome) like UPPER('%".$post["keyword"]."%') OR
						UPPER(cognome) like UPPER('%".$post["keyword"]."%') OR

						(UPPER(nome) like UPPER('%".$strg[0]."%') AND
						UPPER(cognome) like UPPER('%".$strg[1]."%')) OR
						(UPPER(nome) like UPPER('%".$strg[1]."%') AND
						UPPER(cognome) like UPPER('%".$strg[0]."%')) OR

						UPPER(ruoli.descrizione) = UPPER('$ruolo'))";
			}
		}

		if($this->cookie->ruolo != "ROLE_ADMIN"){
			$where = $where ." AND account.email = '".$this->cookie->email."' LIMIT ".$post["fromLimit"].", ".$post["toLimit"]."";
		} else {
			$where = $where." LIMIT ".$post["fromLimit"].", ".$post["toLimit"]."";
		}


		$query = "SELECT 		SQL_CALC_FOUND_ROWS
							account.codice_preventivazione AS codice,
							account.email AS email,
							account.data_creazione AS data_creazione,
							account.stato as stato,
							account.ruolo as ruolo,
							user.nome as nome,
							user.telefono as telefono,
							user.cellulare as cellulare,
							user.cognome as cognome,
							ruoli.etichetta as ruolo,
							ruoli.descrizione as nome_ruolo
					FROM	account,user,ruoli
					WHERE 	ruoli.id = account.ruolo AND
							account.email = user.email AND
							account.email != '".$this->cookie->email."'
							".$where."";


		//var_dump($query);

		$result = $this->connect->myQuery($query);

		if($this->connect->errno()){
			$objJSON["success"] = false;
			$objJSON["messageError"] = "Errore generico";
		}else{
			$objJSON["success"] = true;
			$objJSON["results"] = array();
			$rowNum = mysqli_num_rows($result);
			$cont = 0;

			$result_tot = $this->connect->myQuery("SELECT FOUND_ROWS()");
			$tot_utenti = mysqli_fetch_array($result_tot);
			$tot_utenti = $tot_utenti["FOUND_ROWS()"];

			if($rowNum > 0){
				while($rowValori = mysqli_fetch_array($result)){
					$temp = array();
					$temp["tot_rows"] = (int)$tot_utenti;
					$temp["codice"] = $rowValori["codice"];
					$temp["email"] = $rowValori["email"];
					$temp["tipo"] = $rowValori["tipo"];
					$temp["data_creazione"] = date("d/m/Y",$rowValori["data_creazione"]);
					$temp["stato"] = $rowValori["stato"];
					$temp["nome_ruolo"] = $rowValori["nome_ruolo"];
					$temp["telefono"] = $rowValori["telefono"];
					$temp["cellulare"] = $rowValori["cellulare"];
					$temp["nome"] = $rowValori["nome"];
					$temp["cognome"] = $rowValori["cognome"];
					$temp["ruolo"] = $rowValori["ruolo"];
					$temp["stato"] = $temp["stato"];

					if($rowValori["stato"] == 0)
						$temp["label_stato"] = "non attivo";
						else
						$temp["label_stato"] = "attivo";

					$objJSON["results"][$cont] = $temp;
					$cont++;
				}
			}

		}
		$this->connect->disconnetti();
		return json_encode($objJSON);
	}


	public function getAllUtentiWithMe(){

		$this->connect->connetti();


		$where = "";
		if($this->cookie->ruolo != "ROLE_ADMIN"){
				$where = " AND account.email = '".$this->cookie->email."'";
		}

		$query = "SELECT 	account.codice_preventivazione AS codice,
							account.email AS email,
							account.data_creazione AS data_creazione,
							account.stato as stato,
							user.nome as nome,
							user.telefono as telefono,
							user.cellulare as cellulare,
							user.cognome as cognome,
							ruoli.etichetta as ruolo,
							ruoli.descrizione as nome_ruolo
					FROM	account,user,ruoli
					WHERE 	ruoli.id = account.ruolo AND
							account.email = user.email
							".$where."
					GROUP BY account.email";

		//var_dump($query);

		$result = $this->connect->myQuery($query);

		if($this->connect->errno()){
			$objJSON["success"] = false;
			$objJSON["messageError"] = "Errore generico";
		}else{
			$objJSON["success"] = true;
			$objJSON["results"] = array();
			$rowNum = mysqli_num_rows($result);
			$cont = 0;
			if($rowNum > 0){
				while($rowValori = mysqli_fetch_array($result)){
					$temp = array();
					$temp["codice"] = $rowValori["codice"];
					$temp["email"] = $rowValori["email"];
					$temp["tipo"] = $rowValori["tipo"];
					$temp["data_creazione"] = date("d/m/Y",$rowValori["data_creazione"]);
					$temp["stato"] = $rowValori["stato"];
					$temp["nome_ruolo"] = $rowValori["nome_ruolo"];
					$temp["telefono"] = $rowValori["telefono"];
					$temp["cellulare"] = $rowValori["cellulare"];
					$temp["nome"] = $rowValori["nome"];
					$temp["cognome"] = $rowValori["cognome"];
					$temp["ruolo"] = $rowValori["ruolo"];
					$temp["stato"] = $temp["stato"];

					if($rowValori["stato"] == 0)
						$temp["label_stato"] = "non attivo";
						else
						$temp["label_stato"] = "attivo";

					$objJSON["results"][$cont] = $temp;
					$cont++;
				}
			}

		}
		$this->connect->disconnetti();
		return json_encode($objJSON);
	}

	public function removeUtente($post){

		$objJSON["success"] = true;
		$objJSON["results"] = array();

		$this->connect->connetti();

		if(count($post["accounts"])){

			$where = "WHERE ";
			for($i = 0;$i < count($post["accounts"]);$i++){
				$where .= " email = '".$post["accounts"][$i]."' ||";
			}
			$where = substr($where,0,strlen($where)-2);

			$query = "DELETE FROM account ".$where;
			$this->connect->myQuery("DELETE FROM account ".$where);

			// $result = $this->connect->myQuery("SELECT * FROM account");

			if($this->connect->errno()){
				$objJSON["success"] = false;
				$objJSON["messageError"] = "Errore generico";
			}else{
				$objJSON["success"] = true;
				$objJSON["results"] = array();
				//$rowNum = mysqli_num_rows($result);
				//$objJSON["results"]["numeroAccount"] = $rowNum;
			}
		}
		$this->connect->disconnetti();
		return json_encode($objJSON);
	}


	public function getAccountAmministratori(){
		$this->connect->connetti();

		$query = "	SELECT 	email
					FROM	account
					WHERE	ruolo = 0";

		$result = $this->connect->myQuery($query);

		if($this->connect->errno()){
			$objJSON["success"] = false;
			$objJSON["messageError"] = "Errore generico";
		}else{
			$objJSON["success"] = true;
			$objJSON["results"] = array();

			$cont = 0;

			while($rows = mysqli_fetch_array($result)){
				$objJSON["results"][$cont]["email"] = $rows["email"];
				$cont++;
			}
		}
		$this->connect->disconnetti();
		return json_encode($objJSON);
	}


	public function registerAccount($post){

		$objJSON = array();
		$objJSON["success"] = true;


		// VERIFICO CHE LA MAIL SIA ATTIVA
		list($user, $domain) = split("@", $post["username"]);
		if (checkdnsrr($domain.'.')) {
				if ($atpos>0 && $dotpos>0) {
					$emailgood=true;
				}else{
					$emailgood=false;
				}
		}else{
			$emailgood=true;
		}

		if(!$emailgood){
			$objJSON["success"] = false;
			$objJSON["messageError"] = "<i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i> Attenzione l'email inserita non è una mail valida";
			return json_encode($objJSON);
		}

		$admins = $this->getAccountAmministratori();
		$admins = json_decode($admins, true);
		$admins = $admins["results"];


		$agente = $post["iscritto"]["agente"];
		$cliente = $post["iscritto"]["cliente"];
		$account = $post["iscritto"]["account"];


		$mail = new PHPMailer();
		$mail->IsSMTP();
		$mail->SMTPDebug  = 1;
		$mail->CharSet = "UTF-8";
		$mail->Host = "smtps.aruba.it";
		$mail->setFrom("notifiche@salernoponteggi.com", "Salerno Ponteggi srl");
		$mail->IsHTML(true);
		$mail->SMTPKeepAlive = true;
		$mail->SMTPAuth = true;
		$mail->Username = "notifiche@cerratospa.com";
		$mail->Password = "cerratospa2017";
		$mail->SMTPSecure = "ssl";
		$mail->Port = 465;



		////////////////////////////////////////////////////////////////////////////////////
		///////////// Salvo l'account dell'utente //////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////////

		define("SALT","cerrato");
		$password_criptata = md5(SALT.$account["password"]);
		$this->connect->connetti();

		$query = "INSERT INTO account (
				email,
				data_creazione,
				password,
				stato,
				ruolo,
				tipo
			) VALUES(
				'".addslashes($account["username"])."',
				'".time()."',
				'".$password_criptata."',
				'0',
				'1',
				'".addslashes($account["tipo"])."'
		)";

		$this->connect->myQuery($query);
		if($this->connect->errno()){
			$objJSON["success"] = false;
			$objJSON["messageError"] = $this->connect->error();
			$this->connect->disconnetti();
			return json_encode($objJSON);
		}


		////////////////////////////////////////////////////////////////////////////////////
		///////////// inserimento agente ////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////////

		$regione = "null";
		if($agente["regione"]){
			$regione = 	$agente["regione"];
		}

		$provincia = NULL;
		if($agente["provincia"]){
			$provincia = $agente["provincia"];
		}


		$query = "INSERT INTO user (
				email,
				nome,
				cognome,
				regione,
				provincia,
				partita_iva,
				codice_fiscale,
				telefono,
				cellulare,
				mansioni,
				sesso
			)VALUES(
				'".addslashes($account["username"])."',
				'".addslashes($agente["nome"])."',
				'".addslashes($agente["cognome"])."',
				".$regione.",
				".$provincia.",
				'".$agente["partita_iva"]."',
				'".$agente["codice_fiscale"]."',
				'".addslashes($agente["telefono"])."',
				'".addslashes($agente["cellulare"])."',
				'".addslashes($agente["mansioni"])."',
				'".$agente["sesso"]."'
		)";


		$this->connect->myQuery($query);

		if($this->connect->errno()){

			$objJSON["success"] = false;
			$objJSON["messageError"] = $this->connect->error();
			$this->connect->disconnetti();
			return json_encode($objJSON);
		}


		////////////////////////////////////////////////////////////////////////////////////
		///////////// inserimento cliente ////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////////

		if($cliente){

			$cliente["username"] = $account["username"];

			$clienti = new Clienti();
			$clienti->init();
			$json = $clienti->salvaCliente($cliente);
			$json = json_decode($json, true);
			if(!$json["success"]){
				$this->connect->disconnetti();
				return json_encode($json);
			}
		}


		///////////////////////////////////////////////////////////////////////////////////////
		/////// EMAIL all'account iscritto ////////////////////////////////////////////////////
		///////////////////////////////////////////////////////////////////////////////////////

		// oggetto
		$oggetto = "Conferma richiesta di iscrizione alla piattaforma di preventivazione online di Salerno Ponteggi srl";

		// messaggio
		$messaggio = "
		<html>
		<head>
		<title>Benvenuto sulla piattaforma di preventivazione online di Salerno Ponteggi srl</title>
		</head>
		<body>
		<div style='font-family:courier;font-size:16px'>
		<p>L'iscrizione alla piattaforma di preventivazione online di Salerno Ponteggi srl è avvenuta con successo.<br>
		Il suo account sarà sottoposto a verifica e la sua attivazione verrà notificata attraverso una nuova email di conferma.<br>
		Le credenziali di accesso scelte sono:<br>
		------------------------------------------------<br>
		USERNAME: ".$account['username']."<br>
		PASSWORD: ".$account['password']."<br>
		------------------------------------------------<br>
		La preghiamo di custodirle in maniera sicura. In caso di smarrimento potrà comunque effettuare la procedura di recupero password.<br>
		Diversamente la preghiamo di scriverci alla mail info@salernoponteggi.com<br>
		La ringraziamo per aver scelto Salerno Ponteggi srl.<br>
		</div>
		</p>
		<br><br><i>Questa email è stata generata automaticamente dai sistemi di Salerno Ponteggi srl. Per tanto ogni risposta a questa casella email sarà ignorata.</i><br><br>
		<img src=\"http://www.salernoponteggi.com/areariservata/images/logo_email.jpg\"><br><br>
		<b>Salerno Ponteggi srl</b><br>
		SEDE LEGALE E OPERATIVA<br>
		via Francesco Petrarca SNC 84098<br>
		Pontecagnano Faiano (SA)<br>
		tel. +39 089 382657<br>
		P.IVA 0571 19 20 651 <br>
		R.E.A. 428797<br>
		<a href='mailto:info@salernoponteggi.com'>info@salernoponteggi.com</a><br>
		<a href='http://www.salernoponteggi.com'>www.salernoponteggi.com</a><br>
		<span style='font-size:9px;'>CLAUSOLA DI RISERVATEZZA: Le informazioni contenute nel presente messaggio sono confidenziali e soggette alla legislazione vigente in materia di privacy e dirette solamente al destinatario.<br>
L'accesso a questo messaggio da parte di chiunque altro non è autorizzato. Se non siete il destinatario corretto qualsiasi rivelazione, copia o distribuzione di questo messaggio o ogni azione e/o
<br>
omissione compiuta in relazione ad esso è proibita ed illegale. È da rilevare inoltre che l'attuale infrastruttura tecnologica non può garantire l'autenticità del mittente, né tanto meno l'integrità dei contenuti.</span>
		</body>
		</html>";

		$mail->AddAddress($account['username']);
		$mail->Subject = $oggetto;
		$mail->Body = $messaggio;
		$mail->Send();
		$mail->ClearAllRecipients();


		/////////////////////////////////////////////////////////////////////////////////////////
		/////////////////////////// EMAIL DI AVVENUTA ISCRIZIONE
		/////////////////////////////////////////////////////////////////////////////////////////

		// oggetto
		$oggetto = "Completata una procedura di iscrizione sulla piattaforma di preventivazione di Salerno Ponteggi srl";

		// messaggio
		$messaggio = "
		<html>
		<head>
		<title>Completata una procedura di iscrizione sulla piattaforma di preventivazione di Salerno Ponteggi srl</title>
		</head>
		<body>
		<div style='font-family:courier;font-size:16px'>
		<p>E' stata effettuata una iscrizione sulla piattaforma di preventivazione di Salerno Ponteggi srl con username ".$account["username"].".<br>
		Le credenziali del nuovo utente sono in attesa di approvazione.
		</p>
		</div>
		<br><br><i>Questa email è stata generata automaticamente dai sistemi di Salerno Ponteggi srl. Per tanto ogni risposta a questa casella email sarà ignorata.</i><br><br>
		<img src=\"http://www.salernoponteggi.com/areariservata/images/logo_email.jpg\"><br><br>
		<b>Salerno Ponteggi srl</b><br>
		SEDE LEGALE E OPERATIVA<br>
		via Francesco Petrarca SNC 84098<br>
		Pontecagnano Faiano (SA)<br>
		tel. +39 089 382657<br>
		P.IVA 0571 19 20 651 <br>
		R.E.A. 428797<br>
		<a href='mailto:info@salernoponteggi.com'>info@salernoponteggi.com</a><br>
		<a href='http://www.salernoponteggi.com'>www.salernoponteggi.com</a><br>
		<span style='font-size:9px;'>CLAUSOLA DI RISERVATEZZA: Le informazioni contenute nel presente messaggio sono confidenziali e soggette alla legislazione vigente in materia di privacy e dirette solamente al destinatario.<br>
L'accesso a questo messaggio da parte di chiunque altro non è autorizzato. Se non siete il destinatario corretto qualsiasi rivelazione, copia o distribuzione di questo messaggio o ogni azione e/o
<br>
omissione compiuta in relazione ad esso è proibita ed illegale. È da rilevare inoltre che l'attuale infrastruttura tecnologica non può garantire l'autenticità del mittente, né tanto meno l'integrità dei contenuti.</span>
		</body>
		</html>";

		$mail->Subject = $oggetto;
		$mail->Body = $messaggio;
		$mail->AddAddress("lorenzo.dev@gmail.com");
		$mail->Send();
		$mail->ClearAllRecipients();

		$mail->SmtpClose();
		unset($mail);

		$this->connect->disconnetti();
		return json_encode($objJSON);

	}

	public function rigeneraPassword($post){


		define("SALT","cerrato");

		$password_criptata = md5(SALT.$post["password"]);

		//var_dump($post["data_creazione"]);

		//var_dump("INSERT INTO account (email,data_creazione,password,tipo,stato,ruolo)VALUES('".$post['email']."','".$post["data_creazione"]."','".$password_criptata."','".$post['tipo']."','".$post['stato']."','".$post['ruolo']."')");

		$this->connect->connetti();
		$this->connect->myQuery("UPDATE account SET password = '".$password_criptata."' WHERE email='".$post['account']."'");
		var_dump("SELECT account.email AS email, account.password AS password, account.stato AS stato, ruoli.etichetta AS ruolo FROM account,ruoli WHERE account.email='".$post['account']."' AND ruoli.id = account.ruolo");


		$result = $this->connect->myQuery("SELECT account.email AS email, account.password AS password, account.stato AS stato, ruoli.etichetta AS ruolo FROM account,ruoli WHERE account.email='".$post['account']."' AND ruoli.id = account.ruolo");


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
		$mail->AddReplyTo($post['account']);
		$mail->FromName = "Carrato Spa";
		$mail->Subject = "Modifica password";
		$mail->Body = "<html><body>Una nuova password &egrave; stata rigenerata per il suo account.<br>Di seguito i nuovi dati di accesso:<br>username: <b>".$post['account']."</b><br>password: <b>".$post['password']."</b><br><br>Si prega, per una questioni di sicurezza, di accedere alla proprio area per modificare la password a proprio piacimento.<br><br>Cordiali saluti</body></html>";
		$mail->AddAddress($post['account']);

		$mail->Send();
		$mail->SmtpClose();

		/*$from = "info@cerratospa.com";
		$fromName = "Carrato Spa";
		$subject = "Creazione nuovo account";
		$body = "<html><body>&Egrave; stato creato un nuovo account per l'utente:<br><br>username: <b>".$post['email']."</b><br>password: <b>".$post['password']."</b><br><br>Verr&agrave; analizzata la richiesta da un nostro operatore che provveder&aacute; all'attivazione. Ricever&aacute; nell'arco delle 48 ore una mail di conferma per l'abilitazione all'accesso dei servizi offerti.<br>Attenzione, conservare con attenzione questa mail per non perdere i dati di accesso.<br><br></body></html>";
		$indirizzoMail = $post['email'];

		mail($indirizzoMail, $subject, $body, "Content-type: text/html; charset=iso-8859-1");
		*/


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
				$tmp["email"] = $rowValori["email"];
				$tmp["password"] = $rowValori["password"];
				$tmp["stato"] = $rowValori["stato"];

				if($rowValori["stato"] == 0)
					$tmp["stato"] = "non attivo";
					else
					$tmp["stato"] = "attivo";

				$tmp["ruolo"] = $rowValori["ruolo"];
				$objJSON["results"][$cont] = $tmp;
				$cont++;
			}
		}


		$this->connect->disconnetti();
		return json_encode($objJSON);
	}

	/*public function modifyAccount($post){


		define("SALT","cerrato");

		$password_criptata = md5(SALT.$post["password"]);

		$this->connect->myQuery("UPDATE account (email,data_creazione,password,stato,ruolo)VALUES('".$post['email']."','".$post["data_creazione"]."','".$password_criptata."','".$post['stato']."','".$post['ruolo']."')");

		$result = $this->connect->myQuery("SELECT account.email AS email, account.password AS password, user.tipo AS tipo, account.stato AS stato, ruoli.etichetta AS ruolo FROM account,ruoli WHERE account.email='".$post['email']."' AND ruoli.id = account.ruolo");



		$mail = new PHPMailer();
		$mail->IsHTML(true);

		// Telling the class to use SMTP
		$mail->IsSMTP();
		$mail->IsHTML(true);
		$mail->SMTPAuth = $this->SMTPAuth;     // turn on SMTP authentication
		$mail->SMTPSecure = $this->SMTPSecure;
		$mail->Host = $this->Host;
		$mail->Port = $this->Port;
		$mail->SMTPKeepAlive = $this->SMTPKeepAlive;
		$mail->SMTPDebug = $this->SMTPDebug;
		$mail->Username = $this->Username;  // SMTP username
		$mail->Password = $this->Password;
		$mail->AddReplyTo($post['email']);
		$mail->FromName = "Carrato Spa";
		$mail->Subject = "Creazione nuovo account";
		$mail->Body = "<html><body>&Egrave; stato creato un nuovo account per l'utente:<br><br>username: <b>".$post['email']."</b><br>password: <b>".$post['password']."</b><br><br>Verr&agrave; analizzata la richiesta da un nostro operatore che provveder&aacute; all'attivazione. Ricever&aacute; nell'arco delle 48 ore una mail di conferma per l'abilitazione all'accesso dei servizi offerti.<br>Attenzione, conservare con attenzione questa mail per non perdere i dati di accesso.<br><br></body></html>";
		$mail->AddAddress($post['email']);

		//var_dump("Ma che cazz? ".$mail->Send());
		$mail->Send();
		$mail->SmtpClose();


		//$from = "info@cerratospa.com";
		//$fromName = "Carrato Spa";
		//$subject = "Creazione nuovo account";
		//$body = "<html><body>&Egrave; stato creato un nuovo account per l'utente:<br><br>username: <b>".$post['email']."</b><br>password: <b>".$post['password']."</b><br><br>Verr&agrave; analizzata la richiesta da un nostro operatore che provveder&aacute; all'attivazione. Ricever&aacute; nell'arco delle 48 ore una mail di conferma per l'abilitazione all'accesso dei servizi offerti.<br>Attenzione, conservare con attenzione questa mail per non perdere i dati di accesso.<br><br></body></html>";
		//$indirizzoMail = $post['email'];

		//mail($indirizzoMail, $subject, $body, "Content-type: text/html; charset=iso-8859-1");



		if($this->connect->errno()){
			$objJSON["success"] = false;
			$objJSON["messageError"] = mysqli_errno() . ": " . mysqli_error();
		}else{
			$objJSON["success"] = true;
			$objJSON["results"] = array();
			$cont = 0;
			while($rowValori = mysqli_fetch_array($result)){
				$tmp = array();
				$tmp["email"] = $rowValori["email"];
				$tmp["password"] = $rowValori["password"];
				$tmp["stato"] = $rowValori["stato"];

				if($rowValori["stato"] == 0)
					$tmp["stato"] = "non attivo";
					else
					$tmp["stato"] = "attivo";

				$tmp["ruolo"] = $rowValori["ruolo"];
				$objJSON["results"][$cont] = $tmp;
				$cont++;
			}
		}



		return json_encode($objJSON);
	}*/

	public function registerUser($post){

		$this->connect->connetti();

		$query = "INSERT INTO user (nome,cognome,sesso,ragione_sociale,mansioni,tipo,partita_iva,codice_fiscale,telefono,cellulare,fax,indirizzo,website,account)VALUES('".$post["nome"]."','".$post["cognome"]."','".$post["sesso"]."','".$post["ragione_sociale"]."','".$post["mansioni"]."','".$post["tipo"]."','".$post["partita_iva"]."','".$post["codice_fiscale"]."','".$post["telefono"]."','".$post["cellulare"]."','".$post["fax"]."','".$post["indirizzo"]."','".$post["website"]."','".$post["account"]."')";

		//var_dump($query);

		$this->connect->myQuery($query);

		$result = $this->connect->myQuery("SELECT * FROM user WHERE account='".$post["account"]."'");

		if($this->connect->errno()){
			$objJSON["success"] = false;
			$objJSON["messageError"] = "Siamo spiacenti, si è verificato un errore";
			$objJSON["mysql_error"] = $this->connect->error();
			return json_encode($objJSON);
		}else{
			$objJSON["success"] = true;
			$objJSON["results"] = array();
			$cont = 0;
			while($rowValori = mysqli_fetch_array($result)){
				$tmp = array();
				$tmp["nome"] = $rowValori["nome"];
				$tmp["cognome"] = $rowValori["cognome"];
				$tmp["sesso"] = $rowValori["sesso"];
				$tmp["ragione_sociale"] = $rowValori["ragione_sociale"];
				$tmp["partita_iva"] = $rowValori["partita_iva"];
				$tmp["codice_fiscale"] = $rowValori["codice_fiscale"];
				$tmp["indirizzo"] = $rowValori["indirizzo"];
				$tmp["account"] = $rowValori["account"];
				$tmp["website"] = $rowValori["website"];
				$tmp["telefono"] = $rowValori["telefono"];

				if($rowValori["stato"] == 0)
					$tmp["stato"] = "non attivo";
					else
					$tmp["stato"] = "attivo";

				$objJSON["results"][$cont] = $tmp;
				$cont++;
			}
		}

		// Telling the class to use SMTP
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
		//$mail->AddReplyTo($this->mailAdmin);
		$mail->FromName = "Carrato Spa";
		$mail->Subject = "Invio richiesta di registrazione";
		$mail->Body = "<html><body>&Egrave; stata effettuata una richiesta di registrazione sui Vostri sistemi da parte di <b>".$tmp["nome"]." ".$tmp["cognome"]."</b> per l'accesso ai servizi di preventivazione online.<br> Puoi consultare i dati inseriti dall'utente per confermare la validit&agrave; dell'account creato direttamente dal pannellino di amministrazione cliccando al seguente link.<br><a href=\"http://www.salernoponteggi.com/areariservata/\">area riservata Salerno Ponteggi srl</a><br><br><br><br></body></html>";
		//$mail->AddAddress($this->mailAdmin);

		$mail->AddAdress("lorenzo.dev@gmail.com");

		//var_dump("Ma che cazz? ".$mail->Send());
		$mail->Send();
		$mail->SmtpClose();

		$this->connect->disconnetti();
		return json_encode($objJSON);
	}

	public function modifyUser($post){

		$this->connect->connetti();

		//var_dump("UPDATE user SET nome='".$post["nome"]."',cognome='".$post["cognome"]."',sesso='".$post["sesso"]."',ragione_sociale='".$post["ragione_sociale"]."',mansioni='".$post["mansioni"]."',tipo='".$post["tipo"]."',partita_iva='".$post["partita_iva"]."',codice_fiscale='".$post["codice_fiscale"]."',telefono='".$post["telefono"]."',cellulare='".$post["cellulare"]."',fax='".$post["fax"]."',website='".$post["website"]."',account='".$post["account"]."' WHERE account='".$post["account"]."'");

		$set = "";
		if($post["nome"])
			$set .= "nome='".$post["nome"]."', ";

		if($post["cognome"])
			$set .= "cognome='".$post["cognome"]."',";

		if($post["sesso"])
			$set .= "sesso='".$post["sesso"]."',";

		$set .= "ragione_sociale='".$post["ragione_sociale"]."',";

		if($post["mansioni"])
			$set .= "mansioni='".$post["mansioni"]."',";

		if(!$post["author"])
		$set .= "partita_iva='".$post["partita_iva"]."',";

		if(!$post["author"])
		$set .= "codice_fiscale='".$post["codice_fiscale"]."',";

		if($post["telefono"])
			$set .= "telefono='".$post["telefono"]."',";

		if($post["cellulare"])
			$set .= "cellulare='".$post["cellulare"]."',";

		if($post["indirizzo"])
			$set .= "indirizzo='".$post["id_indirizzo"]."',";

		if(!$post["author"])
		$set .= "fax='".$post["fax"]."',";

		if(!$post["author"])
		$set .= "website='".$post["website"]."',";

		if($post["account"])
			$set .= "account='".$post["account"]."',";

		if($post["codice_preventivazione"])
			$set .= "codice_preventivazione='".$post["codice_preventivazione"]."',";


		if($post["tipo"])
			$set .= "tipo='".$post["tipo"]."',";


		$set = substr($set,0,$set.length-1);

		//var_dump("UPDATE user SET ".$set." WHERE account='".$post["account"]."'");

		$this->connect->myQuery("UPDATE user SET ".$set." WHERE account='".$post["account"]."'");

		$result = $this->connect->myQuery("SELECT * FROM user WHERE account='".$post["account"]."'");

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
				$tmp["sesso"] = $rowValori["sesso"];
				$tmp["ragione_sociale"] = $rowValori["ragione_sociale"];
				$tmp["mansioni"] = $rowValori["mansioni"];
				$tmp["partita_iva"] = $rowValori["partita_iva"];
				$tmp["codice_fiscale"] = $rowValori["codice_fiscale"];
				$tmp["indirizzo"] = $rowValori["indirizzo"];
				$tmp["account"] = $rowValori["account"];
				$tmp["website"] = $rowValori["website"];
				$tmp["telefono"] = $rowValori["telefono"];
				$tmp["cellulare"] = $rowValori["cellulare"];

				if($rowValori["stato"] == 0)
					$tmp["stato"] = "non attivo";
					else
					$tmp["stato"] = "attivo";

				$objJSON["results"][$cont] = $tmp;
				$cont++;
			}
		}
		$this->connect->disconnetti();
		return json_encode($objJSON);
	}


	public function registerIndirizzo($post){
		$this->connect->connetti();
		$query = "INSERT INTO indirizzi (regione,nazione,provincia,comune,indirizzo,civico,cap)VALUES('".$post['regione']."','".$post['nazione']."','".$post['provincia']."','".$post['comune']."','".$post['indirizzo']."','".$post['civico']."','".$post['cap']."')";
		$result_insert = $this->connect->myQuery($query);



		$id = mysqli_insert_id();

		$result = $this->connect->myQuery("SELECT * FROM indirizzi WHERE id='".$id."'");

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
				$tmp["id"] = $id;
				$tmp["nazione"] = $rowValori["nazione"];
				$tmp["regione"] = $rowValori["regione"];
				$tmp["provincia"] = $rowValori["provincia"];
				$tmp["comune"] = $rowValori["comune"];
				$tmp["civico"] = $rowValori["civico"];
				$tmp["cap"] = $rowValori["cap"];
				$objJSON["results"][$cont] = $tmp;
				$cont++;
			}
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

		$query = "SELECT * FROM regioni ORDER BY nome";

		$result = $this->connect->myQuery($query);



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
			$objJSON[$cont]['sigla'] = $row['sigla'];
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
		$result = $this->connect->myQuery("SELECT * FROM user WHERE partita_iva='".$post['partita_iva']."' AND email<>'".$post["email"]."'");
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

		$query = "SELECT * FROM account WHERE email <> '".$post['account']."' AND codice_preventivazione='".$post["codice_preventivazione"]."'";


		$result = $this->connect->myQuery($query);

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
		$query = "SELECT * FROM user WHERE codice_fiscale='".$post['codice_fiscale']."' AND email<>'".$post["email"]."'";
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

		$objJSON =  array();
		$objJSON["success"] = true;

		$password = $this->random_string(12);
		define("SALT","cerrato");
		$password_criptata = md5(SALT.$password);

		$this->connect->connetti();
		$query1 = "UPDATE account SET password = '".$password_criptata."' WHERE email = '".$post["email"]."'";
		$result1 = $this->connect->myQuery($query1);

		$num = $this->connect->affected_rows();

		if($this->connect->errno()){
			$objJSON["success"] = false;
			$objJSON["messageError"] = "Siamo spiacenti, si è verificato un errore";
			$objJSON["mysql_error"] = $this->connect->error();
		}else{

			$objJSON["results"] = $num;

			if($num > 0){
				$mail = new PHPMailer();
				$mail->IsSMTP();
				$mail->CharSet = "UTF-8";
				$mail->Host = "smtps.aruba.it";
				$mail->setFrom("notifiche@salernoponteggi.com", "Salerno Ponteggi srl");
				$mail->IsHTML(true);
				$mail->SMTPKeepAlive = true;
				$mail->SMTPAuth = true;
				$mail->Username = "notifiche@salernoponteggi.com";
				$mail->Password = "SALPONT2018";
				$mail->SMTPSecure = "ssl";
				$mail->Port = 465;


				$oggetto =  "Richiesta recupero password";;

				$messaggio = "
				<html>
				<head>
				<title>Richiesta recupero password</title>
				</head>
				<body>
				<div style='font-family:courier;font-size:16px'>
				<p>Abbiamo ricevuto la richiesta di ripristino password.<br>La nuova password &egrave; <b>".$password."</b><br>Per motivi di sicurezza la preghiamo di accedere all'area riservata e modificare, nella sezione profilo, la password appena generata con una sua personale.<br>La ringraziamo per la sua disponibilit&agrave;.<br>
				</p>
				</div>
				<br><br><i>Questa email è stata generata automaticamente dai sistemi di Salerno Ponteggi srl. Per tanto ogni risposta a questa casella email sarà ignorata.</i><br><br>
				<img src=\"http://www.salernoponteggi.com/areariservata/images/logo_email.jpg\"><br><br>
				<b>Salerno Ponteggi srl</b><br>
				SEDE LEGALE E OPERATIVA<br>
				via Francesco Petrarca SNC 84098<br>
				Pontecagnano Faiano (SA)<br>
				tel. +39 089 382657<br>
				P.IVA 0571 19 20 651 <br>
				R.E.A. 428797<br>
				<a href='mailto:info@salernoponteggi.com'>info@salernoponteggi.com</a><br>
				<a href='http://www.salernoponteggi.com'>www.salernoponteggi.com</a><br>
				<span style='font-size:9px;'>CLAUSOLA DI RISERVATEZZA: Le informazioni contenute nel presente messaggio sono confidenziali e soggette alla legislazione vigente in materia di privacy e dirette solamente al destinatario.<br>
L'accesso a questo messaggio da parte di chiunque altro non è autorizzato. Se non siete il destinatario corretto qualsiasi rivelazione, copia o distribuzione di questo messaggio o ogni azione e/o
<br>
omissione compiuta in relazione ad esso è proibita ed illegale. È da rilevare inoltre che l'attuale infrastruttura tecnologica non può garantire l'autenticità del mittente, né tanto meno l'integrità dei contenuti.</span>
				</body>
				</html>";

				$mail->Subject = $oggetto;
				$mail->Body = $messaggio;
				$mail->AddAddress($post["email"]);
				$mail->Send();
				$mail->SmtpClose();
				unset($mail);
			}
		}


		$this->connect->disconnetti();
		return json_encode($objJSON);
	}


	public function modifyStatoAccount($post){
		$objJSON = array();
		$objJSON["success"] = true;

		$this->connect->connetti();
		$pass = "";

		$query = "UPDATE 	account
					SET 	stato = '".$post["stato"]."',
							ruolo = '".$post["ruolo"]."',
							codice_preventivazione = '".$post["codice_preventivazione"]."'
					WHERE 	email='".$post["account"]."'";


		$this->connect->myQuery($query);

		if($this->connect->errno()){
			$objJSON["success"] = false;
			$objJSON["errorMessage"] = "Siamo spiacenti, l'inserimento del cliente non è andato a buon fine.";
$objJSON["mysql_error"] = $this->connect->error();
		}else{
			$objJSON["success"] = true;

			/////////////////////// invio della mail di conferma dell'account /////////////


			if($post["stato"] == "1" && $post["stato"]!=$post["stato_precedente"]){

				$mail = new PHPMailer();
				$mail->IsSMTP();
				$mail->CharSet = "UTF-8";
				$mail->Host = "smtps.aruba.it";
				$mail->setFrom("notifiche@cerratospa.com", "Salerno Ponteggi srl");
				$mail->IsHTML(true);
				$mail->SMTPKeepAlive = true;
				$mail->SMTPAuth = true;
				$mail->Username = "notifiche@salernoponteggi.com";
				$mail->Password = "SALPONT2018";
				$mail->SMTPSecure = "ssl";
				$mail->Port = 465;

				// oggetto
				$oggetto = "Attivazione account piattaforma di preventivazione Salerno Ponteggi srl";

				// messaggio
				$messaggio = "
				<html>
				<head>
				<title>Il tuo account sulla piattaforma di preventivazione online di Salerno Ponteggi srl è stato attivato</title>
				</head>
				<body>
				<div style='font-family:courier;font-size:16px'>
				<p>Il tuo account sulla piattaforma di preventivazione online di Salerno Ponteggi srl è stato attivato<br>
				Puoi accedere inserendo le credenziali ricevute nelle precedenti email e iniziare ad utilizzare la piattaforma.
				La ringraziamo per aver scelto di collaborare con Salerno Ponteggi srl.<br>
				</p>
				</div>
				<br><br><i>Questa email è stata generata automaticamente dai sistemi di Salerno Ponteggi srl. Per tanto ogni risposta a questa casella email sarà ignorata.</i><br><br>
				<img src=\"http://www.salernoponteggi.com/areariservata/images/logo_email.jpg\"><br><br>
				<b>Salerno Ponteggi srl</b><br>
				SEDE LEGALE E OPERATIVA<br>
				via Francesco Petrarca SNC 84098<br>
				Pontecagnano Faiano (SA)<br>
				tel. +39 089 382657<br>
				P.IVA 0571 19 20 651 <br>
				R.E.A. 428797<br>
				<a href='mailto:info@salernoponteggi.com'>info@salernoponteggi.com</a><br>
				<a href='http://www.salernoponteggi.com'>www.salernoponteggi.com</a><br>
				<span style='font-size:9px;'>CLAUSOLA DI RISERVATEZZA: Le informazioni contenute nel presente messaggio sono confidenziali e soggette alla legislazione vigente in materia di privacy e dirette solamente al destinatario.<br>
L'accesso a questo messaggio da parte di chiunque altro non è autorizzato. Se non siete il destinatario corretto qualsiasi rivelazione, copia o distribuzione di questo messaggio o ogni azione e/o
<br>
omissione compiuta in relazione ad esso è proibita ed illegale. È da rilevare inoltre che l'attuale infrastruttura tecnologica non può garantire l'autenticità del mittente, né tanto meno l'integrità dei contenuti.</span>
				</body>
				</html>";

				$mail->Subject = $oggetto;
				$mail->Body = $messaggio;
				$mail->AddAddress($post["account"]);
				$mail->Send();
				$mail->SmtpClose();
				unset($mail);

			}


		}

		$this->connect->disconnetti();
		return json_encode($objJSON);
	}

}


?>
