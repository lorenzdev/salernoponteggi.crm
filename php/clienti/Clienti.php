<?php

class Clienti{

	private $connect;
	private $cookie;

	public function init(){
		$this->connect = new ConnectionDB();
		$this->cookie = json_decode($_COOKIE["utente"]);
	}


	public function checkCodiceFiscaleCliente($post){

		//var_dump("SELECT * FROM user WHERE codice_fiscale='".$post['codice_fiscale']."' AND account<>".$post["email"]."'");
		$this->connect->connetti();
		$query = "SELECT * FROM clienti WHERE codice_fiscale='".$post['codice_fiscale']."' AND id !='".$post["cliente"]."'";
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
				$tmp["ragione_sociale"] = $rowValori["ragione_sociale"];
				$objJSON["results"][$cont] = $tmp;
				$cont++;
			}
		}
		$this->connect->disconnetti();
		return json_encode($objJSON);
	}

	public function getClienti($post){

		$this->connect->connetti();


		if($this->cookie->ruolo != "ROLE_ADMIN"){
			$where = "WHERE clienti.inserito_da='".$this->cookie->email."'";
		}


		if($post["data_inserimento"]) {
			if(!$where) {
				$where .= " WHERE data_inserimento='".$post["data_inserimento"]."'";
			} else {
				$where .= " AND data_inserimento='".$post["data_inserimento"]."'";
			}
		}

		$strg = explode(" ", $post["keyword"]);

		$key = $post["keyword"];
		if($key != null) {
			if(is_numeric($key)) {
				if(!$where) {
					$where .= " WHERE UPPER(codice) like UPPER('%".$post["keyword"]."%')
							LIMIT ".$post["fromLimit"].", ".$post["toLimit"]."";
				} else {
					$where .= " AND UPPER(codice) like UPPER('%".$post["keyword"]."%')
							LIMIT ".$post["fromLimit"].", ".$post["toLimit"]."";
				}
			} else {
				if(!$where) {
					$where .= " WHERE (UPPER(ragione_sociale) like UPPER('%".$post["keyword"]."%') OR
							UPPER(USER.nome) like UPPER('%".$post["keyword"]."%') OR
							UPPER(USER.cognome) like UPPER('%".$post["keyword"]."%') OR

							(UPPER(USER.nome) like UPPER('%".$strg[0]."%') AND
							UPPER(USER.cognome) like UPPER('%".$strg[1]."%')) OR
							(UPPER(USER.nome) like UPPER('%".$strg[1]."%') AND
							UPPER(USER.cognome) like UPPER('%".$strg[0]."%')))

							LIMIT ".$post["fromLimit"].", ".$post["toLimit"]."";
				} else {
					$where .= " AND (UPPER(ragione_sociale) like UPPER('%".$post["keyword"]."%') OR
							UPPER(USER.nome) like UPPER('%".$post["keyword"]."%') OR
							UPPER(USER.cognome) like UPPER('%".$post["keyword"]."%') OR

							(UPPER(USER.nome) like UPPER('%".$strg[0]."%') AND
							UPPER(USER.cognome) like UPPER('%".$strg[1]."%')) OR
							(UPPER(USER.nome) like UPPER('%".$strg[1]."%') AND
							UPPER(USER.cognome) like UPPER('%".$strg[0]."%')))

							LIMIT ".$post["fromLimit"].", ".$post["toLimit"]."";
				}
			}
		} else {
			if($post["fromLimit"] && $post["toLimit"])
				$where .= " LIMIT ".$post["fromLimit"].", ".$post["toLimit"]."";
		}

		$query = "SELECT	SQL_CALC_FOUND_ROWS
							clienti.id as id,
							clienti.codice as codice,
							clienti.data_inserimento as data_inserimento,
							clienti.ragione_sociale as ragione_sociale,
							clienti.indirizzo as indirizzo,
							clienti.civico as civico,
							clienti.cap as cap,
							clienti.regione as regione,
							clienti.provincia as provincia,
							clienti.comune as comune,
							clienti.citta as citta,
							clienti.partita_iva as partita_iva,
							clienti.codice_fiscale as codice_fiscale,
							clienti.prefisso_telefono as prefisso_telefono,
							clienti.telefono as telefono,
							clienti.prefisso_fax as prefisso_fax,
							clienti.fax as fax,
							clienti.email as email,
							clienti.prefisso_cellulare as prefisso_cellulare,
							clienti.cellulare as cellulare,
							clienti.website as website,
							clienti.attivita_cliente as attivita_cliente,
							clienti.banca as banca,
							clienti.agenzia as agenzia,
							clienti.abi as abi,
							clienti.cab as cab,
							clienti.iban as iban,
							clienti.capo_area as capo_area,
							clienti.email_capo_area as email_capo_area,
							clienti.sconto_richiesto as sconto_richiesto,
							clienti.aliquota_iva_richiesta as aliquota_iva_richiesta,
							clienti.modalita_invio_preventivo as modalita_invio_preventivo,
							clienti.modalita_pagamento as modalita_pagamento,
							clienti.tipo as tipo,
							clienti.nome_r as nome_r,
							clienti.cognome_r as cognome_r,
							clienti.cellulare_r as cellulare_r,
							clienti.email_r email_r,
							USER.nome as nome_agente,
							USER.cognome as cognome_agente,
							USER.email as email_agente,
							MODIFICATO_DA.nome_modificato_da as nome_modificato_da,
							MODIFICATO_DA.cognome_modificato_da as cognome_modificato_da,
							MODIFICATO_DA.email_modificato_da as email_modificato_da,
							INSERITO_DA.nome_inserito_da as nome_inserito_da,
							INSERITO_DA.cognome_inserito_da as cognome_inserito_da,
							INSERITO_DA.email_inserito_da as email_inserito_da,
							clienti.codice_preventivazione as codice_preventivazione
					FROM 	clienti

					LEFT JOIN(
						SELECT
								user.nome as nome,
								user.cognome as cognome,
								user.email as email
						FROM user
					) as USER ON USER.email = clienti.agente

					LEFT JOIN(
							SELECT	user.nome as nome_modificato_da,
									user.cognome as cognome_modificato_da,
									user.email as email_modificato_da
							FROM	user
						) as MODIFICATO_DA ON MODIFICATO_DA.email_modificato_da = clienti.modificato_da

					LEFT JOIN(
							SELECT	user.nome as nome_inserito_da,
									user.cognome as cognome_inserito_da,
									user.email as email_inserito_da
							FROM	user
						) as INSERITO_DA ON INSERITO_DA.email_inserito_da = clienti.inserito_da

					".$where."";

		//var_dump($query);

		$result = $this->connect->myQuery($query);

		if($this->connect->errno()){
			$objJSON["success"] = false;
			$objJSON["messageError"] = $this->connect->error();
		}else{
			$objJSON["success"] = true;
			$objJSON["results"] = array();
			$cont = 0;

			$result_tot = $this->connect->myQuery("SELECT FOUND_ROWS()");
			$tot_rubrica = mysqli_fetch_array($result_tot);
			$tot_rubrica = $tot_rubrica["FOUND_ROWS()"];

			while($rowValori = mysqli_fetch_array($result)){
				$objJSON["results"][$cont]["tot_rows"] = (int)$tot_rubrica;
				$objJSON["results"][$cont]["id"] = $rowValori["id"];
				$objJSON["results"][$cont]["codice"] = $rowValori["codice"];
				$objJSON["results"][$cont]["data_inserimento"] = $rowValori["data_inserimento"];
				$objJSON["results"][$cont]["ragione_sociale"] = $rowValori["ragione_sociale"];
				$objJSON["results"][$cont]["indirizzo"] = $rowValori["indirizzo"];
				$objJSON["results"][$cont]["civico"] = $rowValori["civico"];
				$objJSON["results"][$cont]["cap"] = $rowValori["cap"];
				$objJSON["results"][$cont]["regione"] = $rowValori["regione"];
				$objJSON["results"][$cont]["provincia"] = $rowValori["provincia"];
				$objJSON["results"][$cont]["comune"] = $rowValori["comune"];
				$objJSON["results"][$cont]["citta"] = $rowValori["citta"];
				$objJSON["results"][$cont]["partita_iva"] = $rowValori["partita_iva"];
				$objJSON["results"][$cont]["codice_fiscale"] = $rowValori["codice_fiscale"];
				$objJSON["results"][$cont]["prefisso_telefono"] = $rowValori["prefisso_telefono"];
				$objJSON["results"][$cont]["telefono"] = $rowValori["telefono"];
				$objJSON["results"][$cont]["prefisso_fax"] = $rowValori["prefisso_fax"];
				$objJSON["results"][$cont]["fax"] = $rowValori["fax"];
				$objJSON["results"][$cont]["email"] = $rowValori["email"];
				$objJSON["results"][$cont]["prefisso_cellulare"] = $rowValori["prefisso_cellulare"];
				$objJSON["results"][$cont]["cellulare"] = $rowValori["cellulare"];
				$objJSON["results"][$cont]["website"] = $rowValori["website"];
				$objJSON["results"][$cont]["attivita_cliente"] = $rowValori["attivita_cliente"];
				$objJSON["results"][$cont]["banca"] = $rowValori["banca"];
				$objJSON["results"][$cont]["iban"] = $rowValori["iban"];
				$objJSON["results"][$cont]["capo_area"] = $rowValori["capo_area"];
				$objJSON["results"][$cont]["email_capo_area"] = $rowValori["email_capo_area"];
				$objJSON["results"][$cont]["sconto_richiesto"] = $rowValori["sconto_richiesto"];
				$objJSON["results"][$cont]["aliquota_iva_richiesta"] = $rowValori["aliquota_iva_richiesta"];
				$objJSON["results"][$cont]["modalita_invio_preventivo"] = $rowValori["modalita_invio_preventivo"];
				$objJSON["results"][$cont]["modalita_pagamento"] = $rowValori["modalita_pagamento"];
				$objJSON["results"][$cont]["tipo"] = $rowValori["tipo"];
				$objJSON["results"][$cont]["nome_r"] = $rowValori["nome_r"];
				$objJSON["results"][$cont]["cognome_r"] = $rowValori["cognome_r"];
				$objJSON["results"][$cont]["cellulare_r"] = $rowValori["cellulare_r"];
				$objJSON["results"][$cont]["email_r"] = $rowValori["email_r"];
				$objJSON["results"][$cont]["nome_agente"] = $rowValori["nome_agente"];
				$objJSON["results"][$cont]["cognome_agente"] = $rowValori["cognome_agente"];
				$objJSON["results"][$cont]["email_agente"] = $rowValori["email_agente"];
				$objJSON["results"][$cont]["codice_preventivazione"] = $rowValori["codice_preventivazione"];
				$objJSON["results"][$cont]["agenzia"] = $rowValori["agenzia"];
				$objJSON["results"][$cont]["abi"] = $rowValori["abi"];
				$objJSON["results"][$cont]["cab"] = $rowValori["cab"];
				$objJSON["results"][$cont]["nome_modificato_da"] = $rowValori["nome_modificato_da"];
				$objJSON["results"][$cont]["cognome_modificato_da"] = $rowValori["cognome_modificato_da"];
				$objJSON["results"][$cont]["email_modificato_da"] = $rowValori["email_modificato_da"];
				$objJSON["results"][$cont]["nome_inserito_da"] = $rowValori["nome_inserito_da"];
				$objJSON["results"][$cont]["cognome_inserito_da"] = $rowValori["cognome_inserito_da"];
				$objJSON["results"][$cont]["email_inserito_da"] = $rowValori["email_inserito_da"];

				$cont++;
			}
		}
		$this->connect->disconnetti();
		return json_encode($objJSON);
	}

	public function getClienteDaRubrica($post){

		$objJSON = array();
		$objJSON["success"] = true;
		$objJSON["results"] = array();

		$this->connect->connetti();

		if($post["cliente"]){

			$query = "SELECT 	clienti.ragione_sociale as ragione_sociale_cliente,
								clienti.id as id_cliente,
								clienti.codice as codice_cliente,
								clienti.indirizzo as indirizzo_cliente,
								clienti.civico as civico_cliente,
								clienti.cap as cap_cliente,
								REG_C.nome as regione_cliente,
								PROV_C.nome as provincia_cliente,
								PROV_C.sigla as provincia_sigla_cliente,
								COM_C.nome as comune_cliente,
								REG_C.id as id_regione_cliente,
								PROV_C.id as id_provincia_cliente,
								COM_C.id as id_comune_cliente,
								clienti.citta as citta_cliente,
								clienti.partita_iva as partita_iva_cliente,
								clienti.codice_fiscale as codice_fiscale_cliente,
								clienti.prefisso_telefono as prefisso_telefono_cliente,
								clienti.telefono as telefono_cliente,
								clienti.prefisso_fax as prefisso_fax_cliente,
								clienti.fax as fax_cliente,
								clienti.email as email_cliente,
								clienti.email_pec as email_pec_cliente,
								clienti.prefisso_cellulare as prefisso_cellulare_cliente,
								clienti.cellulare as cellulare_cliente,
								clienti.website as website_cliente,
								clienti.agenzia as agenzia_cliente,
								clienti.banca as banca_cliente,
								clienti.iban as iban_cliente,
								clienti.abi as abi_cliente,
								clienti.cab as cab_cliente,
								clienti.capo_area as capo_area_cliente,
								clienti.email_capo_area as email_capo_area_cliente,
								clienti.sconto_richiesto as sconto_richiesto_cliente,
								clienti.aliquota_iva_richiesta as aliquota_iva_richiesta_cliente,
								clienti.modalita_invio_preventivo as modalita_invio_preventivo_cliente,
								clienti.modalita_pagamento as modalita_pagamento_cliente,
								clienti.mod_altro_pagamento as mod_altro_pagamento_cliente,
								clienti.nome_r as nome_r_cliente,
								clienti.cognome_r as cognome_r_cliente,
								clienti.prefisso_cellulare_r as prefisso_cellulare_r_cliente,
								clienti.cellulare_r as cellulare_r_cliente,
								clienti.email_r as email_r_cliente,
								clienti.attivita_cliente as attivita_cliente,
								clienti.aliquota_iva_richiesta as aliquota_iva_richiesta_cliente,
								clienti.sconto_richiesto as sconto_richiesto_cliente,
								clienti.modalita_pagamento as modalita_pagamento_cliente,
								AGENTE.email_agente as agente_cliente,
								COALESCE(AGENTE.nome_agente, '') as nome_agente_cliente,
								COALESCE(AGENTE.cognome_agente,'') as cognome_agente_cliente,
								INSERITO_DA.nome_inserito_da as nome_inserito_da,
								INSERITO_DA.cognome_inserito_da as cognome_inserito_da,
								INSERITO_DA.email_inserito_da as email_inserito_da,
								MODIFICATO_DA.nome_modificato_da as nome_modificato_da,
								MODIFICATO_DA.cognome_modificato_da as cognome_modificato_da,
								MODIFICATO_DA.email_modificato_da as email_modificato_da

						FROM 	clienti

						LEFT JOIN (
							SELECT 	regioni.id as id,
									regioni.nome as nome
							FROM	regioni
						) as REG_C ON REG_C.id = clienti.regione

						LEFT JOIN (
							SELECT 	province.id as id,
									province.sigla as sigla,
									province.nome as nome
							FROM	province
						) as PROV_C ON PROV_C.id = clienti.provincia

						LEFT JOIN (
							SELECT 	comuni.id as id,
									comuni.nome as nome
							FROM	comuni
						) as COM_C ON COM_C.id = clienti.comune

						LEFT JOIN(
							SELECT	user.nome as nome_agente,
									user.cognome as cognome_agente,
									user.email as email_agente
							FROM	user
						) as AGENTE ON AGENTE.email_agente = clienti.agente

						LEFT JOIN(
							SELECT	user.nome as nome_inserito_da,
									user.cognome as cognome_inserito_da,
									user.email as email_inserito_da
							FROM	user
						) as INSERITO_DA ON INSERITO_DA.email_inserito_da = clienti.inserito_da

						LEFT JOIN(
							SELECT	user.nome as nome_modificato_da,
									user.cognome as cognome_modificato_da,
									user.email as email_modificato_da
							FROM	user
						) as MODIFICATO_DA ON MODIFICATO_DA.email_modificato_da = clienti.modificato_da

					WHERE clienti.id = '".$post["cliente"]."'
					LIMIT 1";


			$result = $this->connect->myQuery($query);

			if($this->connect->errno()){
				$objJSON["success"] = false;
				$objJSON["messageError"] = "Siamo spiacenti, la visualizzazione del cliente non è andata a buon fine";
				$objJSON["mysql_error"] = $this->connect->error();
				$objJSON["query"] = $query;
			}else{
				$objJSON["success"] = true;
				$objJSON["results"] = array();

				if($rowValori = mysqli_fetch_array($result)){

					$objJSON["results"][0]['ragione_sociale_cliente'] = $rowValori['ragione_sociale_cliente'];
					$objJSON["results"][0]['id_cliente'] = $rowValori['id_cliente'];
					$objJSON["results"][0]['codice_cliente'] = $rowValori['codice_cliente'];
					$objJSON["results"][0]['indirizzo_cliente'] = $rowValori['indirizzo_cliente'];
					$objJSON["results"][0]['civico_cliente'] = $rowValori['civico_cliente'];
					$objJSON["results"][0]['cap_cliente'] = $rowValori['cap_cliente'];
					$objJSON["results"][0]['attivita_cliente'] = $rowValori['attivita_cliente'];
					$objJSON["results"][0]['regione_cliente'] = $rowValori['regione_cliente'];
					$objJSON["results"][0]['provincia_cliente'] = $rowValori['provincia_cliente'];
					$objJSON["results"][0]['provincia_sigla_cliente'] = $rowValori['provincia_sigla_cliente'];
					$objJSON["results"][0]['comune_cliente'] = $rowValori['comune_cliente'];
					$objJSON["results"][0]['id_regione_cliente'] = $rowValori['id_regione_cliente'];
					$objJSON["results"][0]['id_provincia_cliente'] = $rowValori['id_provincia_cliente'];
					$objJSON["results"][0]['id_comune_cliente'] = $rowValori['id_comune_cliente'];
					$objJSON["results"][0]['citta_cliente'] = $rowValori['citta_cliente'];
					$objJSON["results"][0]['partita_iva_cliente'] = $rowValori['partita_iva_cliente'];
					$objJSON["results"][0]['codice_fiscale_cliente'] = $rowValori['codice_fiscale_cliente'];

					$objJSON["results"][0]['prefisso_telefono_cliente'] = $rowValori['prefisso_telefono_cliente'];
					$objJSON["results"][0]['telefono_cliente'] = $rowValori['telefono_cliente'];

					$objJSON["results"][0]['prefisso_fax_cliente'] = $rowValori['prefisso_fax_cliente'];
					$objJSON["results"][0]['fax_cliente'] = $rowValori['fax_cliente'];
					$objJSON["results"][0]['email_pec_cliente'] = $rowValori['email_pec_cliente'];
					$objJSON["results"][0]['email_cliente'] = $rowValori['email_cliente'];

					$objJSON["results"][0]['prefisso_cellulare_cliente'] = $rowValori['prefisso_cellulare_cliente'];
					$objJSON["results"][0]['cellulare_cliente'] = $rowValori['cellulare_cliente'];
					$objJSON["results"][0]['website_cliente'] = $rowValori['website_cliente'];
					$objJSON["results"][0]['banca_cliente'] = $rowValori['banca_cliente'];
					$objJSON["results"][0]['iban_cliente'] = $rowValori['iban_cliente'];
					$objJSON["results"][0]['abi_cliente'] = $rowValori['abi_cliente'];
					$objJSON["results"][0]['cab_cliente'] = $rowValori['cab_cliente'];
					$objJSON["results"][0]['agenzia_cliente'] = $rowValori['agenzia_cliente'];
					$objJSON["results"][0]['attivita_cliente'] = $rowValori['attivita_cliente'];
					$objJSON["results"][0]['capo_area_cliente'] = $rowValori['capo_area_cliente'];
					$objJSON["results"][0]['email_capo_area_cliente'] = $rowValori['email_capo_area_cliente'];
					$objJSON["results"][0]['sconto_richiesto_cliente'] = $rowValori['sconto_richiesto_cliente'];
					$objJSON["results"][0]['aliquota_iva_richiesta_cliente'] = $rowValori['aliquota_iva_richiesta_cliente'];
					$objJSON["results"][0]['modalita_invio_preventivo_cliente'] = $rowValori['modalita_invio_preventivo_cliente'];
					$objJSON["results"][0]['modalita_pagamento_cliente'] = $rowValori['modalita_pagamento_cliente'];

					$objJSON["results"][0]['mod_altro_pagamento_cliente'] = $rowValori['mod_altro_pagamento_cliente'];

					$objJSON["results"][0]['nome_r_cliente'] = $rowValori['nome_r_cliente'];
					$objJSON["results"][0]['cognome_r_cliente'] = $rowValori['cognome_r_cliente'];

					$objJSON["results"][0]['prefisso_cellulare_r_cliente'] = $rowValori['prefisso_cellulare_r_cliente'];
					$objJSON["results"][0]['cellulare_r_cliente'] = $rowValori['cellulare_r_cliente'];
					$objJSON["results"][0]['email_r_cliente'] = $rowValori['email_r_cliente'];
					$objJSON["results"][0]['agente_cliente'] = $rowValori['agente_cliente'];
					$objJSON["results"][0]['nome_agente_cliente'] = $rowValori['nome_agente_cliente'];
					$objJSON["results"][0]['cognome_agente_cliente'] = $rowValori['cognome_agente_cliente'];
					$objJSON["results"][0]['sconto_richiesto_cliente'] = $rowValori['sconto_richiesto_cliente'];
					$objJSON["results"][0]['modalita_pagamento_cliente'] = $rowValori['modalita_pagamento_cliente'];

					$objJSON["results"][0]['nome_inserito_da'] = $rowValori['nome_inserito_da'];
					$objJSON["results"][0]['cognome_inserito_da'] = $rowValori['cognome_inserito_da'];
					$objJSON["results"][0]['email_inserito_da'] = $rowValori['email_inserito_da'];

					$objJSON["results"][0]['nome_modificato_da'] = $rowValori['nome_modificato_da'];
					$objJSON["results"][0]['cognome_modificato_da'] = $rowValori['cognome_modificato_da'];
					$objJSON["results"][0]['email_modificato_da'] = $rowValori['email_modificato_da'];
				}
			}
		}

		$this->connect->disconnetti();
		return json_encode($objJSON);

	}

	public function salvaCliente($post){

		$this->connect->connetti();

		if($post["id"]){
			$id = $post["id"];
		}else{
			// INSERISCO L'INDIRIZZO DELLA SEDE
			$public_func = new PublicFunc();
			$id = $public_func->generaCodice(32);
		}

		if($post["agente"]){
			$agente = "'".addslashes($post["agente"])."'";
		}else
			$agente = "NULL";


		$inserito_da = "NULL";
		if($this->cookie->email)
				$inserito_da = "'".$this->cookie->email."'";
			else if($post["username"]){
				$inserito_da = "'".$post["username"]."'";
			}

		$modificato_da = "NULL";
		if($this->cookie->email)
			$modificato_da = "'".$this->cookie->email."'";

		$query = "INSERT INTO clienti (
					  id,
					  inserito_da,
					  codice,
					  data_inserimento,
  					  ragione_sociale,
					  indirizzo,
					  civico,
					  cap,
					  regione,
					  provincia,
					  comune,
					  citta,
					  partita_iva,
					  codice_fiscale,
					  prefisso_telefono,
					  telefono,
					  prefisso_fax,
					  fax,
					  email,
					  email_pec,
					  prefisso_cellulare,
					  cellulare,
					  website,
					  attivita_cliente,
					  banca,
					  agenzia,
					  abi,
					  cab,
					  iban,
					  capo_area,
					  email_capo_area,
					  sconto_richiesto,
					  aliquota_iva_richiesta,
					  modalita_invio_preventivo,
					  modalita_pagamento,
					  mod_altro_pagamento,
					  tipo,
					  nome_r,
					  cognome_r,
					  prefisso_cellulare_r,
					  cellulare_r,
					  email_r,
					  agente,
					  codice_preventivazione
				)VALUES(
					  '".$id."',
					  ".$inserito_da.",
					  '".addslashes($post["codice"])."',
					  '".time()."',
  					  '".addslashes($post["ragione_sociale"])."',
					  '".addslashes($post["indirizzo"])."',
					  '".addslashes($post["civico"])."',
					  '".addslashes($post["cap"])."',
					  '".addslashes($post["regione"])."',
					  '".addslashes($post["provincia"])."',
					  '".addslashes($post["comune"])."',
					  '".addslashes($post["citta"])."',
					  '".addslashes($post["partita_iva"])."',
					  '".addslashes($post["codice_fiscale"])."',
					  '".addslashes($post["prefisso_telefono"])."',
					  '".addslashes($post["telefono"])."',
					  '".addslashes($post["prefisso_fax"])."',
					  '".addslashes($post["fax"])."',
					  '".addslashes($post["email"])."',
					  '".addslashes($post["email_pec"])."',
					  '".addslashes($post["prefisso_cellulare"])."',
					  '".addslashes($post["cellulare"])."',
					  '".addslashes($post["website"])."',
					  '".addslashes($post["attivita_cliente"])."',
					  '".addslashes($post["banca"])."',
					  '".addslashes($post["agenzia"])."',
					  '".addslashes($post["abi"])."',
					  '".addslashes($post["cab"])."',
					  '".addslashes($post["iban"])."',
					  '".addslashes($post["capo_area"])."',
					  '".addslashes($post["email_capo_area"])."',
					  '".addslashes($post["sconto_richiesto"])."',
					  '".addslashes($post["aliquota_iva_richiesta"])."',
					  '".addslashes($post["modalita_invio_preventivo"])."',
					  '".addslashes($post["modalita_pagamento"])."',
					  '".addslashes($post["mod_altro_pagamento"])."',
					  '".addslashes($post["tipo"])."',
					  '".addslashes($post["nome_r"])."',
					  '".addslashes($post["cognome_r"])."',
					  '".addslashes($post["prefisso_cellulare_r"])."',
					  '".addslashes($post["cellulare_r"])."',
					  '".addslashes($post["email_r"])."',
					  ".$agente.",
					  '".addslashes($post["codice_preventivazione"])."'

			) ON DUPLICATE KEY UPDATE

				codice = VALUES(codice),
				inserito_da = VALUES(inserito_da),
				modificato_da = ".$modificato_da.",
				data_inserimento = VALUES(data_inserimento),
				ragione_sociale = VALUES(ragione_sociale),
				indirizzo = VALUES(indirizzo),
				civico = VALUES(civico),
				cap = VALUES(cap),
				regione = VALUES(regione),
				provincia = VALUES(provincia),
				comune = VALUES(comune),
				citta = VALUES(citta),
				partita_iva = VALUES(partita_iva),
				codice_fiscale = VALUES(codice_fiscale),
				prefisso_telefono = VALUES(prefisso_telefono),
				telefono = VALUES(telefono),
				prefisso_fax = VALUES(prefisso_fax),
				fax = VALUES(fax),
				email = VALUES(email),
				email_pec = VALUES(email_pec),
				prefisso_cellulare = VALUES(prefisso_cellulare),
				cellulare = VALUES(cellulare),
				website = VALUES(website),
				attivita_cliente = VALUES(attivita_cliente),
				banca = VALUES(banca),
				agenzia = VALUES(agenzia),
				abi = VALUES(abi),
				cab = VALUES(cab),
				iban = VALUES(iban),
				capo_area = VALUES(capo_area),
				email_capo_area = VALUES(email_capo_area),
				sconto_richiesto = VALUES(sconto_richiesto),
				aliquota_iva_richiesta = VALUES(aliquota_iva_richiesta),
				modalita_invio_preventivo = VALUES(modalita_invio_preventivo),
				modalita_pagamento = VALUES(modalita_pagamento),
				mod_altro_pagamento = VALUES(mod_altro_pagamento),
				tipo = VALUES(tipo),
				nome_r = VALUES(nome_r),
				cognome_r = VALUES(cognome_r),
				prefisso_cellulare_r = VALUES(prefisso_cellulare_r),
				cellulare_r = VALUES(cellulare_r),
				email_r = VALUES(email_r),
				agente = VALUES(agente),
				codice_preventivazione = VALUES(codice_preventivazione)";

		$this->connect->myQuery($query);

		$objJSON = array();
		if($this->connect->errno()){
			$objJSON["success"] = false;
			$objJSON["messageError"] = "Siamo spiacenti, si è verificato un errore";
			$objJSON["mysql_error"] = $this->connect->error();
			$objJSON["query"] = $query;
		}else{
			$objJSON["success"] = true;
		}

		$this->connect->disconnetti();
		return json_encode($objJSON);
	}

	public function modifyRubrica($post){

		//var_dump("UPDATE indirizzi SET regione='".$post['regione']."',nazione='".$post['nazione']."',provincia='".$post['provincia']."',comune='".$post['comune']."',indirizzo='".$post['indirizzo']."',civico='".$post['civico']."',cap='".$post['cap']."' WHERE id='".$post["id_indirizzo"]."'");



		$this->connect->connetti();
		$this->connect->myQuery("UPDATE rubrica

			SET	data_inserimento='".$post["data_inserimento"]."',
				ragione_sociale='".$post["ragione_sociale"]."',
				attivita='".$post["attivita"]."',
				partita_iva='".$post["partita_iva"]."',
				codice_fiscale='".$post["codice_fiscale"]."',
				telefono='".$post["telefono"]."',
				fax='".$post["fax"]."',
				email='".$post["email"]."',
				email_pec='".$post["email_pec"]."',
				responsabile='".$post["responsabile"]."',
				cellulare='".$post["cellulare"]."',
				banca='".$post["banca"]."',
				iban='".$post["iban"]."',
				agente='".$post["agente"]."',
				provincia='".$post["provincia"]."',
				regione='".$post["regione"]."',
				capo_area='".$post["capo_area"]."',
				denominazione_cantiere='".$post["denominazione_cantiere"]."',
				referente_cantiere='".$post["referente_cantiere"]."',
				email_referente='".$post["email_referente_cantiere"]."',
				cellulare_referente='".$post["cellulare_referente_cantiere"]."',
				aliquota_iva=".$post["aliquota_iva"].",
				modalita_pagamento='".$post["modalita_pagamento"]."',
				account='".$post["account"]."'
			WHERE 	data_inserimento='".$post["data_inserimento"]."'

		");

		$objJSON = array();
		if($this->connect->errno()){
			$objJSON["success"] = false;
			$objJSON["messageError"] = "Errore generico";
		}else{
			$objJSON["success"] = true;
		}

		$this->connect->disconnetti();
		return json_encode($objJSON);
	}

	public function removeFromRubrica($post){

		$objJSON = array();
		$objJSON["success"] = true;

		$this->connect->connetti();

		if(count($post["clienti"]) > 0){

			$values = "";
			for($i = 0;$i < count($post["clienti"]);$i++){
				$values .= " id='".$post["clienti"][$i]."' OR";
			}
			$values = substr($values, 0, strlen($values)-2);

			$query = "DELETE FROM clienti WHERE 1 AND (".$values.")";

			$this->connect->myQuery($query);

			if($this->connect->errno()){
				$objJSON["success"] = false;
				$objJSON["messageError"] = "Siamo spiacenti, si è verificato un errore";
				$objJSON["mysql_error"] = $this->connect->error();
			}else{
				$objJSON["success"] = true;
				$objJSON["results"][0] = $rowValori;
			}
		}
		$this->connect->disconnetti();
		return json_encode($objJSON);
	}

	public function checkRubrica($post){
		$this->connect->connetti();
		$result = $this->connect->myQuery("SELECT data_inserimento FROM rubrica WHERE account='".$post["account"]."'");
		$objJSON = array();
		if($this->connect->errno()){
			$objJSON["success"] = false;
			$objJSON["messageError"] = "Errore generico";
		}else{
			$objJSON["success"] = true;
			$objJSON["results"] = array();
			$rowValori = mysqli_num_rows($result);
			$objJSON["results"][0] = $rowValori;
		}
		$this->connect->disconnetti();
		return json_encode($objJSON);
	}
}

?>
