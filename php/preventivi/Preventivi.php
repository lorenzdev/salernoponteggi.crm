<?php



class Preventivi{

	private $connect;
	private $cookie;

	public function init(){
		$this->connect = new ConnectionDB();
		$this->cookie = json_decode($_COOKIE["utente"]);
	}

	public function getAllPreventivi($post){
		$this->connect->connetti();

		$strg = explode(" ", $post["keyword"]);

		$where = $post["keyword"];
		if($where == null) {
			$where = "";
		}else {

			if(is_numeric($where)) {
				$where = " AND (UPPER(codice) like UPPER('%".$post["keyword"]."%'))";
			} else {
				//uso upper per rendere la query case insentive
				$where = " AND UPPER(nome) like UPPER('%".$post["keyword"]."%') OR
						UPPER(cognome) like UPPER('%".$post["keyword"]."%') OR

						(UPPER(nome) like UPPER('%".$strg[0]."%') AND
						UPPER(cognome) like UPPER('%".$strg[1]."%')) OR
						(UPPER(nome) like UPPER('%".$strg[1]."%') AND
						UPPER(cognome) like UPPER('%".$strg[0]."%')) OR

						UPPER(CLIENTE.cliente) like UPPER('%".$post["keyword"]."%') OR
						UPPER(carrello.descrizioneCarrello) like UPPER('%".str_replace(' ', '', $post["keyword"])."%')
					)";
			}

			//uso upper per rendere la query case insentive
			$where = " AND (UPPER(codice) like UPPER('%".$post["keyword"]."%') OR
					UPPER(nome) like UPPER('%".$post["keyword"]."%') OR
					UPPER(cognome) like UPPER('%".$post["keyword"]."%') OR

					(UPPER(nome) like UPPER('%".$strg[0]."%') AND
					UPPER(cognome) like UPPER('%".$strg[1]."%')) OR
					(UPPER(nome) like UPPER('%".$strg[1]."%') AND
					UPPER(cognome) like UPPER('%".$strg[0]."%')) OR

					UPPER(CLIENTE.cliente) like UPPER('%".$post["keyword"]."%') OR
					UPPER(carrello.descrizioneCarrello) like UPPER('%".str_replace(' ', '', $post["keyword"])."%')
				)";
		}

		if($this->cookie->ruolo != "ROLE_ADMIN"){
			$where .= " AND preventivi.account = '".$this->cookie->email."' GROUP BY codice ORDER BY preventivi.codice DESC LIMIT ".$post["fromLimit"].", ".$post["toLimit"]."  ";
		} else {
			$where .= "GROUP BY codice ORDER BY preventivi.codice DESC  LIMIT ".$post["fromLimit"].", ".$post["toLimit"]." ";
		}

		$query = "SELECT 		SQL_CALC_FOUND_ROWS
							preventivi.codice as codice,
							preventivi.data as data,
							preventivi.descrizione as descrizione,
							preventivi.totale as totale,
							preventivi.totaleScontato as totaleScontato,
							preventivi.nettoAPagare as nettoAPagare,
							preventivi.approvazione as approvazione,
							preventivi.letto as letto,
							user.nome as nome,
							user.cognome as cognome,
							preventivi.account as email ,
							CLIENTE.cliente as cliente,
							carrello.descrizioneCarrello as descrizioneCarrello

				FROM 				preventivi

				LEFT JOIN(
					SELECT 	carrello.preventivo,
                    			carrello.descrizione as descrizioneCarrello
					FROM	carrello
				) as carrello ON carrello.preventivo = preventivi.data


				LEFT JOIN(
					SELECT 	clienti.ragione_sociale as cliente,
							clienti.id as id
					FROM	clienti
				) as CLIENTE ON CLIENTE.id = preventivi.cliente
				, user

				WHERE 				preventivi.account = user.email
									".$where."";

		$result = $this->connect->myQuery($query);

		if($this->connect->errno()){
			$objJSON["success"] = false;
			$objJSON["messageError"] = "Siamo spiacenti, si è verificato un errore";
			$objJSON["mysql_error"] = $this->connect->error();
		}else{

			$objJSON =  array();
			$objJSON["results"] = array();
			$objJSON["success"] = true;
			$cont = 0;
	
			$result_tot = $this->connect->myQuery("SELECT FOUND_ROWS()");
			$tot_preventivi = mysqli_fetch_array($result_tot);
			$tot_preventivi = $tot_preventivi["FOUND_ROWS()"];
	
			while($row = mysqli_fetch_array($result)){
				$objJSON["results"][$cont]["tot_rows"] = (int)$tot_preventivi;
				$objJSON["results"][$cont]['cliente'] = $row['cliente'];
				$objJSON["results"][$cont]['data'] = $row['data'];
				$objJSON["results"][$cont]["full_data"] = date("d/m/Y",$row["data"]);
				$objJSON["results"][$cont]['codice'] = $row['codice'];
				$objJSON["results"][$cont]['totale'] = $row['totale'];
				$objJSON["results"][$cont]['totaleScontato'] = $row['totaleScontato'];
				$objJSON["results"][$cont]['nettoAPagare'] = $row['nettoAPagare'];
				$objJSON["results"][$cont]['approvazione'] = $row['approvazione'];
	
				//if($row['approvazione'])
					$objJSON["results"][$cont]['stato'] = "Valido";
					//else
					//$objJSON["results"][$cont]['stato'] = "A progetto";
	
				$objJSON["results"][$cont]['letto'] = $row['letto'];
				$objJSON["results"][$cont]['nome'] = $row['nome'];
				$objJSON["results"][$cont]['cognome'] = $row['cognome'];
				$objJSON["results"][$cont]['email'] = $row['email'];
				$objJSON["results"][$cont]['tipo'] = $row['tipo'];
				$objJSON["results"][$cont]['totalePreventivo'] = $row['totalePreventivo'];
				$objJSON["results"][$cont]['totalePreventivoIvato'] = $row['totalePreventivoIvato'];
				$objJSON["results"][$cont]['codice_preventivazione'] = $row['codice_preventivazione'];
				$cont++;
			}
		}

	
		$this->connect->disconnetti();
		return json_encode($objJSON);
	}

	public function getPreventivo($post){


		$this->connect->connetti();

		$query = "
			SELECT 	preventivi.codice as codice,
					preventivi.riferimento_ordine as riferimento_ordine,
					preventivi.data as data,
					preventivi.totaleScontato as totaleScontato,
					preventivi.totale as totale,
					preventivi.totaleSenzaIva as totaleSenzaIva,
					preventivi.totaleIva as totaleIva,
					preventivi.nettoAPagare as nettoAPagare,
					preventivi.approvazione as approvazione,
					preventivi.costo_trasporto as costo_trasporto,
					preventivi.costo_montaggio as costo_montaggio,
					preventivi.cliente as cliente,
					preventivi.sconto as sconto,
					preventivi.iva as iva,
					preventivi.invio_solo_agente_capo_area as invio_solo_agente_capo_area,
					preventivi.totaleCostiTrasporto as totaleCostiTrasporto,
					preventivi.totaleCostiMontaggio as totaleCostiMontaggio,
					preventivi.letto as letto,
					preventivi.referente_cantiere as referente_cantiere,
					preventivi.cellulare_referente_cantiere as cellulare_referente_cantiere,
					preventivi.email_referente_cantiere as email_referente_cantiere,
					preventivi.numero_settimana as numero_settimana,
					preventivi.anno_settimana as anno_settimana,
					preventivi.data_consegna as data_consegna,
					preventivi.vettore as vettore,
					preventivi.nota as nota,
					preventivi.check_hide_articles as check_hide_articles,
					REG.nome as regione_cantiere,
					PROV.nome as provincia_cantiere,
					PROV.sigla as provincia_sigla_cantiere,
					COM.nome as comune_cantiere,
					REG.id as id_regione_cantiere,
					PROV.id as id_provincia_cantiere,
					COM.id as id_comune_cantiere,
					preventivi.indirizzo_cantiere as indirizzo_cantiere,
					preventivi.civico_cantiere as civico_cantiere,
					preventivi.cap_cantiere as cap_cantiere,
					preventivi.citta_cantiere as citta_cantiere,

					user.nome as nome_compilatore,
					user.cognome as cognome_compilatore,
					user.email as email_compilatore,
					carrello.id as idCarrello,
					carrello.descrizione as descrizione,
					carrello.quantita as quantita,
					carrello.tipologia as tipologia,
					carrello.totale as totale_carrello,
					account.codice_preventivazione as codice_preventivazione,

					CLIENTE.ragione_sociale_cliente as ragione_sociale_cliente,
					CLIENTE.id_cliente as id_cliente,
					CLIENTE.codice_cliente as codice_cliente,
					CLIENTE.indirizzo_cliente as indirizzo_cliente,
					CLIENTE.civico_cliente as civico_cliente,
					CLIENTE.cap_cliente as cap_cliente,
					CLIENTE.regione_cliente as regione_cliente,
					CLIENTE.provincia_cliente as provincia_cliente,
					CLIENTE.provincia_sigla_cliente as provincia_sigla_cliente,
					CLIENTE.comune_cliente as comune_cliente,
					CLIENTE.id_regione_cliente as id_regione_cliente,
					CLIENTE.id_provincia_cliente as id_provincia_cliente,
					CLIENTE.id_comune_cliente as id_comune_cliente,
					CLIENTE.citta_cliente as citta_cliente,
					CLIENTE.partita_iva_cliente as partita_iva_cliente,
					CLIENTE.codice_fiscale_cliente as codice_fiscale_cliente,
					CLIENTE.telefono_cliente as telefono_cliente,
					CLIENTE.fax_cliente as fax_cliente,
					CLIENTE.email_cliente as email_cliente,
					CLIENTE.cellulare_cliente as cellulare_cliente,
					CLIENTE.website_cliente as website_cliente,
					CLIENTE.banca_cliente as banca_cliente,
					CLIENTE.agenzia_cliente as agenzia_cliente,
					CLIENTE.iban_cliente as iban_cliente,
					CLIENTE.abi_cliente as abi_cliente,
					CLIENTE.cab_cliente as cab_cliente,
					CLIENTE.capo_area_cliente as capo_area_cliente,
					CLIENTE.email_capo_area_cliente as email_capo_area_cliente,
					CLIENTE.sconto_richiesto_cliente as sconto_richiesta_cliente,
					CLIENTE.aliquota_iva_richiesta_cliente as aliquota_iva_richiesta_cliente,
					CLIENTE.modalita_invio_preventivo_cliente as modalita_invio_preventivo_cliente,
					CLIENTE.modalita_pagamento_cliente as modalita_pagamento_cliente,
					CLIENTE.nome_r_cliente as nome_r_cliente,
					CLIENTE.cognome_r_cliente as cognome_r_cliente,
					CLIENTE.cellulare_r_cliente as cellulare_r_cliente,
					CLIENTE.email_r_cliente as email_r_cliente,
					CLIENTE.nome_agente_cliente as nome_agente,
					CLIENTE.cognome_agente_cliente as cognome_agente,
					CLIENTE.email_agente_cliente as email_agente,
					CLIENTE.cellulare_agente_cliente as cellulare_agente


			FROM 	preventivi

				LEFT JOIN (
					SELECT 	regioni.id as id,
							regioni.nome as nome
					FROM	regioni
				) as REG ON REG.id = preventivi.regione_cantiere

				LEFT JOIN (
					SELECT 	province.id as id,
							province.sigla as sigla,
							province.nome as nome
					FROM	province
				) as PROV ON PROV.id = preventivi.provincia_cantiere

				LEFT JOIN (
					SELECT 	comuni.id as id,
							comuni.nome as nome
					FROM	comuni
				) as COM ON COM.id = preventivi.comune_cantiere


				LEFT JOIN(
					SELECT 	clienti.ragione_sociale as ragione_sociale_cliente,
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
							clienti.telefono as telefono_cliente,
							clienti.fax as fax_cliente,
							clienti.email as email_cliente,
							clienti.cellulare as cellulare_cliente,
							clienti.website as website_cliente,
							clienti.banca as banca_cliente,
							clienti.iban as iban_cliente,
							clienti.abi as abi_cliente,
							clienti.cab as cab_cliente,
							clienti.agenzia as agenzia_cliente,
							clienti.capo_area as capo_area_cliente,
							clienti.email_capo_area as email_capo_area_cliente,
							clienti.sconto_richiesto as sconto_richiesto_cliente,
							clienti.aliquota_iva_richiesta as aliquota_iva_richiesta_cliente,
							clienti.modalita_invio_preventivo as modalita_invio_preventivo_cliente,
							clienti.modalita_pagamento as modalita_pagamento_cliente,
							clienti.nome_r as nome_r_cliente,
							clienti.cognome_r as cognome_r_cliente,
							clienti.cellulare_r as cellulare_r_cliente,
							clienti.email_r as email_r_cliente,
						 	AGENTE.nome_agente as nome_agente_cliente,
							AGENTE.cognome_agente as cognome_agente_cliente,
							AGENTE.email_agente as email_agente_cliente,
							AGENTE.cellulare_agente as cellulare_agente_cliente

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
								user.cellulare as cellulare_agente,
								user.email as email_agente
						FROM	user
					) as AGENTE ON AGENTE.email_agente = clienti.agente

				) as CLIENTE ON CLIENTE.id_cliente = preventivi.cliente

			,carrello,user,account


			WHERE 	carrello.preventivo = preventivi.data
			AND		user.email = preventivi.account
			AND 	user.email = account.email
			AND 	preventivi.data='".$post['data']."' ORDER BY carrello.riferimento";


		$result = $this->connect->myQuery($query);

		$objJSON =  array();

		if($this->connect->errno()){
			$objJSON["success"] = false;
			$objJSON["messageError"] = "Siamo spiacenti, si è verificato un errore";
			$objJSON["mysql_error"] = $this->connect->error();
		}else{
			$objJSON["success"] = true;
			$objJSON["results"] = array();
			$rowValori = mysqli_fetch_array($result);
			if($rowValori){

				$objJSON["results"]["cliente"]['ragione_sociale_cliente'] = $rowValori['ragione_sociale_cliente'];
				$objJSON["results"]["cliente"]['id_cliente'] = $rowValori['id_cliente'];
				$objJSON["results"]["cliente"]['codice_cliente'] = $rowValori['codice_cliente'];
				$objJSON["results"]["cliente"]['indirizzo_cliente'] = $rowValori['indirizzo_cliente'];
				$objJSON["results"]["cliente"]['civico_cliente'] = $rowValori['civico_cliente'];
				$objJSON["results"]["cliente"]['cap_cliente'] = $rowValori['cap_cliente'];
				$objJSON["results"]["cliente"]['regione_cliente'] = $rowValori['regione_cliente'];
				$objJSON["results"]["cliente"]['provincia_cliente'] = $rowValori['provincia_cliente'];
				$objJSON["results"]["cliente"]['provincia_sigla_cliente'] = $rowValori['provincia_sigla_cliente'];
				$objJSON["results"]["cliente"]['comune_cliente'] = $rowValori['comune_cliente'];
				$objJSON["results"]["cliente"]['id_regione_cliente'] = $rowValori['id_regione_cliente'];
				$objJSON["results"]["cliente"]['id_provincia_cliente'] = $rowValori['id_provincia_cliente'];
				$objJSON["results"]["cliente"]['id_comune_cliente'] = $rowValori['id_comune_cliente'];
				$objJSON["results"]["cliente"]['citta_cliente'] = $rowValori['citta_cliente'];
				$objJSON["results"]["cliente"]['partita_iva_cliente'] = $rowValori['partita_iva_cliente'];
				$objJSON["results"]["cliente"]['codice_fiscale_cliente'] = $rowValori['codice_fiscale_cliente'];
				$objJSON["results"]["cliente"]['telefono_cliente'] = $rowValori['telefono_cliente'];
				$objJSON["results"]["cliente"]['fax_cliente'] = $rowValori['fax_cliente'];
				$objJSON["results"]["cliente"]['email_cliente'] = $rowValori['email_cliente'];
				$objJSON["results"]["cliente"]['cellulare_cliente'] = $rowValori['cellulare_cliente'];
				$objJSON["results"]["cliente"]['website_cliente'] = $rowValori['website_cliente'];
				$objJSON["results"]["cliente"]['banca_cliente'] = $rowValori['banca_cliente'];
				$objJSON["results"]["cliente"]['iban_cliente'] = $rowValori['iban_cliente'];
				$objJSON["results"]["cliente"]['capo_area_cliente'] = $rowValori['capo_area_cliente'];
				$objJSON["results"]["cliente"]['email_capo_area_cliente'] = $rowValori['email_capo_area_cliente'];
				$objJSON["results"]["cliente"]['sconto_richiesto_cliente'] = $rowValori['sconto_richiesta_cliente'];
				$objJSON["results"]["cliente"]['aliquota_iva_richiesta_cliente'] = $rowValori['aliquota_iva_richiesta_cliente'];
				$objJSON["results"]["cliente"]['modalita_invio_preventivo_cliente'] = $rowValori['modalita_invio_preventivo_cliente'];
				$objJSON["results"]["cliente"]['modalita_pagamento_cliente'] = $rowValori['modalita_pagamento_cliente'];
				$objJSON["results"]["cliente"]['nome_r_cliente'] = $rowValori['nome_r_cliente'];
				$objJSON["results"]["cliente"]['cognome_r_cliente'] = $rowValori['cognome_r_cliente'];
				$objJSON["results"]["cliente"]['cellulare_r_cliente'] = $rowValori['cellulare_r_cliente'];
				$objJSON["results"]["cliente"]['email_r_cliente'] = $rowValori['email_r_cliente'];
				$objJSON["results"]["cliente"]['nome_agente_cliente'] = $rowValori['nome_agente'];
				$objJSON["results"]["cliente"]['cognome_agente_cliente'] = $rowValori['cognome_agente'];
				$objJSON["results"]["cliente"]['email_agente_cliente'] = $rowValori['email_agente'];
				$objJSON["results"]["cliente"]['cellulare_agente_cliente'] = $rowValori['cellulare_agente'];

				$objJSON["results"]["cliente"]['iban_cliente'] = $rowValori['iban_cliente'];
				$objJSON["results"]["cliente"]['abi_cliente'] = $rowValori['abi_cliente'];
				$objJSON["results"]["cliente"]['cab_cliente'] = $rowValori['cab_cliente'];
				$objJSON["results"]["cliente"]['agenzia_cliente'] = $rowValori['agenzia_cliente'];

				$objJSON["results"]["riferimento_ordine"] = $rowValori["riferimento_ordine"];

				$objJSON["results"]["nome_compilatore"] = $rowValori["nome_compilatore"];
				$objJSON["results"]["cognome_compilatore"] = $rowValori["cognome_compilatore"];


				$objJSON["results"]['nome_file_preventivo_pdf'] = "prev_".$rowValori['codice']."_".date("Y",$rowValori['data'])."_".$rowValori['ragione_sociale_cliente']."_".date("d-m-Y",$rowValori['data']).".pdf";

				$objJSON["results"]['nome_file_modulo_rilievo_pdf'] = "mod_ril_".$rowValori['codice']."_".date("Y",$rowValori['data'])."_".$rowValori['ragione_sociale_cliente']."_".date("d-m-Y",$rowValori['data']).".pdf";

				$objJSON["results"]['codice_preventivazione'] = $rowValori['codice_preventivazione'];
				$objJSON["results"]['tipo'] = $rowValori['tipo'];
				$objJSON["results"]["email"] = $rowValori["email"];
				$objJSON["results"]["data"] = $rowValori["data"];
				$objJSON["results"]["full_data"] = date("d/m/Y",$rowValori["data"]);
				$objJSON["results"]["codice"] = $rowValori["codice"];
				$objJSON["results"]['approvazione'] = $rowValori['approvazione'];
				$objJSON["results"]['invio_solo_agente_capo_area'] = (int)$rowValori['invio_solo_agente_capo_area'];
				$objJSON["results"]['data_invio'] = $rowValori['data_invio'];
				$objJSON["results"]['letto'] = $rowValori['letto'];
				$objJSON["results"]['sconto'] = $rowValori['sconto'];
				$objJSON["results"]['iva'] = $rowValori['iva'];
				$objJSON["results"]['costo_trasporto'] = json_decode($rowValori['costo_trasporto'], true);
				$objJSON["results"]['costo_distribuzione'] = json_decode($rowValori['costo_distribuzione'], true);
				$objJSON["results"]['costo_montaggio'] = json_decode($rowValori['costo_montaggio'], true);

				$objJSON["results"]['numero_settimana'] = $rowValori['numero_settimana'];
				$objJSON["results"]['anno_settimana'] = $rowValori['anno_settimana'];
				$objJSON["results"]['data_consegna'] = $rowValori['data_consegna'];

				$objJSON["results"]['totaleCostiTrasporto'] = $rowValori['totaleCostiTrasporto'];
				$objJSON["results"]['totaleCostiMontaggio'] = $rowValori['totaleCostiMontaggio'];
				$objJSON["results"]['totaleSenzaIva'] = $rowValori['totaleSenzaIva'];
				$objJSON["results"]['totaleIva'] = $rowValori['totaleIva'];
				$objJSON["results"]['totaleScontato'] = $rowValori['totaleScontato'];
				$objJSON["results"]['totale'] = $rowValori['totale'];
				$objJSON["results"]['totale_carrello'] = $rowValori['totale_carrello'];
				$objJSON["results"]['nettoAPagare'] = $rowValori['nettoAPagare'];
				
				$objJSON["results"]['vettore'] = $rowValori['vettore'];
				$objJSON["results"]['nota'] = $rowValori['nota'];
				$objJSON["results"]['check_hide_articles'] = $rowValori['check_hide_articles'];

				$objJSON["results"]["cantiere"]['regione_cantiere'] = $rowValori['regione_cantiere'];
				$objJSON["results"]["cantiere"]['provincia_cantiere'] = $rowValori['provincia_cantiere'];
				$objJSON["results"]["cantiere"]['provincia_sigla_cantiere'] = $rowValori['provincia_sigla_cantiere'];
				$objJSON["results"]["cantiere"]['comune_cantiere'] = $rowValori['comune_cantiere'];
				$objJSON["results"]["cantiere"]['referente_cantiere'] = $rowValori['referente_cantiere'];
				$objJSON["results"]["cantiere"]['id_regione_cantiere'] = $rowValori['id_regione_cantiere'];
				$objJSON["results"]["cantiere"]['id_provincia_cantiere'] = $rowValori['id_provincia_cantiere'];
				$objJSON["results"]["cantiere"]['id_comune_cantiere'] = $rowValori['id_comune_cantiere'];
				$objJSON["results"]["cantiere"]['indirizzo_cantiere'] = $rowValori['indirizzo_cantiere'];
				$objJSON["results"]["cantiere"]['civico_cantiere'] = $rowValori['civico_cantiere'];
				$objJSON["results"]["cantiere"]['cap_cantiere'] = $rowValori['cap_cantiere'];
				$objJSON["results"]["cantiere"]['citta_cantiere'] = $rowValori['citta_cantiere'];
				$objJSON["results"]["cantiere"]['referente_cantiere'] = $rowValori['referente_cantiere'];
				$objJSON["results"]["cantiere"]['email_referente_cantiere'] = $rowValori['email_referente_cantiere'];
				$objJSON["results"]["cantiere"]['cellulare_referente_cantiere'] = $rowValori['cellulare_referente_cantiere'];


				$objJSON["results"]["carrello"] = array();
				$cont = 0;
				do{
					$objJSON["results"]["carrello"][$cont]["descrizione"] = json_decode($rowValori["descrizione"]);
					$objJSON["results"]["carrello"][$cont]["quantita"] = $rowValori["quantita"];
					$objJSON["results"]["carrello"][$cont]["totale"] = $rowValori["totale"];
					$objJSON["results"]["carrello"][$cont]["tipologia"] = $rowValori["tipologia"];

					//var_dump("SELECT * FROM immagini WHERE carrello='".$rowValori["idCarrello"]."'");

					/*$result2 = $this->connect->myQuery("SELECT * FROM immagini WHERE carrello='".$rowValori["idCarrello"]."'");
					$objJSON["results"]["carrello"][$cont]["immagini"] = array();
					$cont2 = 0;
					while($rowValoriImmagine = mysqli_fetch_array($result2)){
						$objJSON["results"]["carrello"][$cont]["immagini"][$cont2] =  $rowValoriImmagine["immagine"];
						$cont2++;
					}*/



					//$immagini = split("[ENDOFFILE]", $rowValori["immagini"]);
					//for($i = 0;$i < count($immagini);$i++){
						//$objJSON["results"]["carrello"][$cont]["immagini"][$i] = $immagini[$i];
					//}
					$cont++;
				}while($rowValori = mysqli_fetch_array($result));
			}
		}
		$this->connect->disconnetti();
		return json_encode($objJSON);
	}

	public function salvaPreventivoDaArticolo($post){

		$objJSON =  array();
		$objJSON['success'] = true;

		$this->connect->connetti();

		$id_preventivo = time();
		$validita = 1;
		$query = "INSERT INTO preventivi
								(	codice,
									data,
									totale,
									totaleScontato,
									nettoAPagare,
									account,
									approvazione
								)VALUES(
									(SELECT COALESCE(MAX(codice)+1,1) as max_codice FROM preventivi as PREV),
									'".$id_preventivo."',
									'".$post["totale"]."',
									'".$post["totale_scontato"]."',
									'".$post["totale_scontato"]."',
									'".$this->cookie->email."',
									'1'
								)";

		//var_dump($query);

		$this->connect->myQuery($query);
		$objJSON =  array();

		if($this->connect->errno()){
			$objJSON["success"] = false;
			$objJSON["messageError"] = "Siamo spiacenti, si è verificato un errore";
			$objJSON["mysql_error"] = $this->connect->error();
		}else{


			$pf = new PublicFunc();
			$id = $pf->generaCodice(32);
			$query = "INSERT INTO carrello
								(	id,
									preventivo,
									descrizione,
									tipologia,
									totale,
									totaleScontato,
									quantita,
									riferimento
								)VALUES (
								'".$id."',
								'".$id_preventivo."',
								'".($post["descrizione"])."',
								1,
								'".$post["totale"]."',
								'".$post["totale_scontato"]."',
								'".$post["quantita"]."',
								'".($post["riferimento"])."'
							)";
			unset($pf);

			$this->connect->myQuery($query);

			if($this->connect->errno()){
				$objJSON["success"] = false;
				$objJSON["messageError"] = "Siamo spiacenti, si è verificato un errore";
			$objJSON["mysql_error"] = $this->connect->error();
			}
			$objJSON['success'] = true;

	}
		$this->connect->disconnetti();
		return json_encode($objJSON);
	}

	public function addPreventivo($post){

		$objJSON =  array();
		$objJSON['success'] = true;

		$this->connect->connetti();

		//var_dump($post);

		//$prodotti = $this->getProdottiFromCarrello($post);
		//var_dump($prodotti);


		/*
		$data = time();
		$descrizione = $post['descrizione'];
		$totale = $post['totale'];
		$totaleScontato = $post['totaleScontato'];
		$approvazione = $post['approvazione'];
		$account = $post['account'];

		$result = $this -> connect->myQuery("SELECT MAX(codice) as max_codice FROM preventivi WHERE account='".$account."'");
		$numPrev = mysqli_fetch_array($result);
		$numPrev = $numPrev["max_codice"]+1;


		$query = "INSERT INTO 	preventivi
								(	codice,
									data,
									descrizione,
									totale,
									totaleScontato,
									totalePreventivo,
									totalePreventivoIvato,
									account,
									approvazione,
									letto
								)VALUES(
									'".$numPrev."',
									'".$data."',
									'".addslashes($post['descrizione'])."',
									'".$totale."',
									'".$totaleScontato."',
									'".$totaleScontato."',
									'".$totaleScontato."',
									'".$account."',
									'".$post['approvazione']."',
									'".$post['letto']."'
								)";


		$this->connect->myQuery($query);
		$objJSON =  array();
		$objJSON['success'] = true;
		$objJSON["results"] = $data;
		if($this->connect->errno()){
			$objJSON['success'] = false;
			$objJSON["errorMessage"] = "Errore nella creazione del preventivo. Contattare l'amministratore del sistema per la risoluzione del problema.\n".mysqli_errno()." ".mysqli_error();

		}
		*/

		$this->connect->disconnetti();
		return json_encode($objJSON);
	}

	public function removePreventivi($post){

		$objJSON["success"] = true;
		$objJSON["results"] = array();

		$this->connect->connetti();

		if(count($post["preventivi"]) > 0){

			$data = $post['data'];
			$gestioneImmagini = new GestioneImmagini();
			//deleteImageCarrello

			$where = "WHERE 1 AND (";
			for($i = 0;$i < count($post["preventivi"]); $i++){
				$where .= " data = '".$post["preventivi"][$i]."' OR";
			}
			$where = substr($where, 0, strlen($where)-2);
			$where .= ")";

			$query = " DELETE FROM preventivi ".$where;

			$result = $this->connect->myQuery($query);

			if($this->connect->errno()){
				$objJSON["success"] = false;
				$objJSON["messageError"] = "Siamo spiacenti, si è verificato un errore";
				$objJSON["mysql_error"] = $this->connect->error();
				return json_encode($objJSON);
			}else{
				$objJSON["success"] = true;
				$objJSON["results"] = array();
			}


		}

		$this->connect->disconnetti();
		return json_encode($objJSON);
	}


	public function addCarrello($post){

		$this->connect->connetti();


		if(count($post["prodotti"]) > 0){

			$values = "";
			$pf = new PublicFunc();
			for($i = 0;$i < count($post["prodotti"]);$i++){


				$id = $pf->generaCodice(32);
				$values .= "(
								'".$id."',
								'".$post["preventivo"]."',
								'".addslashes($post["prodotti"][$i]["descrizione"])."',
								'".$post["tipologia"]."',
								'".$post["prodotti"][$i]["totale"]."',
								'".$post["prodotti"][$i]["totaleScontato"]."',
								".$post["prodotti"][$i]["quantita"].",
								'".addslashes($post["prodotti"][$i]["quantita"])."'
							),";
			}
			unset($pf);
			$values = substr($values,0,strlen($values)-1);

			$query = "INSERT INTO carrello
								(	id,
									preventivo,
									descrizione,
									tipologia,
									totale,
									totaleScontato,
									quantita,
									riferimento
								)VALUES ".$values;



			$this->connect->myQuery($query);
			if($this->connect->errno()){
				$objJSON["success"] = false;
				$objJSON["messageError"] = "Siamo spiacenti, si è verificato un errore";
			$objJSON["mysql_error"] = $this->connect->error();
				$this->connect->disconnetti();
				return json_encode($objJSON);
			}else{
				$objJSON["success"] = true;
				$objJSON["results"] = array();
			}

		}
		/*
		$result = $this->connect->myQuery("SELECT * FROM carrello WHERE id='".$codice."'");

		$objJSON = array();

		if($this->connect->errno()){
			$objJSON["success"] = false;
			$objJSON["messageError"] = "Errore di inserimento del prodotto nel carrello. Contattare l'amministratore del sistema per la risoluzione del problema.\n".mysqli_errno()." ".mysqli_error();
		}else{
			$objJSON["success"] = true;
			$objJSON["results"] = array();
			$rowValori = mysqli_fetch_array($result);
			if($rowValori > 0){

				$objJSON["results"]["codice"] = $rowValori["id"];
				$objJSON["results"]["preventivo"] = $rowValori["preventivo"];
				$objJSON["results"]["descrizione"] = $rowValori["descrizione"];
				$objJSON["results"]["tipologia"] = $rowValori["tipologia"];
				$objJSON["results"]["quantita"] = $rowValori["quantita"];
			}
		}
		*/

		$this->connect->disconnetti();
		return json_encode($objJSON);

	}



	public function addProdottoToCarrello($post){
		$this->connect->connetti();

		$id = $post["id"];
		$descrizione = $post["descrizione"];
		$autore = $post["account"];
		$totale = $post["totale"];
		$totaleScontato = $post["totaleScontato"];
		$sconto = $post["sconto"];
		$um = $post["um"];
		$quantita = $post["quantita"];
		$riferimento = $post["riferimento"];
		$prezzo_definitivo = intval($post["prezzo_definitivo"]);

		$query = "INSERT INTO cookie_carrello (
							id,
							descrizione,
							totale,
							totaleScontato,
							sconto,
							um,
							quantita,
							account,
							riferimento,
							prezzo_definitivo
						)VALUES(
							'".$id."',
							'".stripslashes($descrizione)."',
							'".($totale?$totale:"")."',
							'".($totaleScontato?$totaleScontato:"")."',
							'".$sconto."',
							'".$um."',
							'".$quantita."',
							'".$this->cookie->email."',
							'".$riferimento."',
							'".($prezzo_definitivo?$prezzo_definitivo:0)."'
						)";

		//var_dump($query);

		$this->connect->myQuery($query);

		//$result = $this->connect->myQuery("SELECT * FROM carrello WHERE id='".$codice."'");

		$objJSON = array();

		if($this->connect->errno()){
			$objJSON["success"] = false;
			$objJSON["messageError"] = "Siamo spiacenti, si è verificato un errore";
			$objJSON["mysql_error"] = $this->connect->error();
		}else{
			$objJSON["success"] = true;
		}

		$this->connect->disconnetti();
		return json_encode($objJSON);
	}

	public function modifyProdottoToCarrello($post){

		$this->connect->connetti();
		$descrizione = $post["descrizione"];
		$autore = $post["account"];
		$totale = $post["totale"];
		$totaleScontato = $post["totaleScontato"];
		$quantita = $post["quantita"];
		$riferimento = $post["riferimento"];
		$id_prodotto = $post["id_prodotto"];

		$set = "";


		//var_dump("UPDATE cookie_carrello SET descrizione='".$descrizione."',totale=".$totale.",quantita=".$quantita.",account='".$autore."',riferimento'".$riferimento."' WHERE id='".$id_prodotto."'");

		$query = "UPDATE 	cookie_carrello
					SET 	descrizione='".$descrizione."',
							totale='".(!is_nan($totale)?$totale:'')."',
							totaleScontato='".(!is_nan($totaleScontato)?$totaleScontato:'')."',
							quantita='".$quantita."',
							account='".$autore."',
							riferimento='".$riferimento."',
							prezzo_definitivo='".$post["prezzo_definitivo"]."'
				WHERE 		id='".$id_prodotto."'";


		$this->connect->myQuery($query);

		//$result = $this->connect->myQuery("SELECT * FROM carrello WHERE id='".$codice."'");

		$objJSON = array();

		if($this->connect->errno()){
			$objJSON["success"] = false;
			$objJSON["messageError"] = "Siamo spiacenti, si è verificato un errore";
			$objJSON["mysql_error"] = $this->connect->error();
		}else{
			$objJSON["success"] = true;
		}

		$this->connect->disconnetti();
		return json_encode($objJSON);
	}



	public function ripristinaCarrello($post){

		$this->connect->connetti();
		/*var_dump("
			SELECT 	descrizione,quantita,totale,riferimento
			FROM 	carrello
			WHERE 	preventivo = '".$post['data']."'");*/


		$result = $this->connect->myQuery("
			SELECT 	descrizione,quantita,totale,totaleScontato,riferimento
			FROM 	carrello
			WHERE 	preventivo = '".$post['data']."'");

			/*var_dump("
			SELECT 	descrizione,quantita,totale,riferimento
			FROM 	carrello
			WHERE 	preventivo = '".$post['data']."'");
			*/

			$objJSON = array();

			if($this->connect->errno()){
				$objJSON["success"] = false;
				$objJSON["messageError"] = "Siamo spiacenti, si è verificato un errore";
			$objJSON["mysql_error"] = $this->connect->error();
			}else{
				$objJSON["success"] = true;
				$objJSON["results"] = array();
				$cont = 0;
				while($rowValori = mysqli_fetch_array($result)){

					$data = date("ymdhis") + $cont;


					$descrizione = json_decode($rowValori["descrizione"]);

					$idCopiaImmagine = $descrizione->{"id"};

					$gestioneImmagine = new GestioneImmagini();

					$newId = date("Ymdhis") + $cont;
					$descrizione->{"id"} = $newId;

					$gestioneImmagine->copiaImmagine($idCopiaImmagine,$newId);

					$query = "
						INSERT INTO cookie_carrello
						(id,descrizione,totale,totaleScontato,quantita,account,riferimento)
						VALUES
						('".$data."','".json_encode($descrizione)."',".floatval($rowValori["totale"]).",".floatval($rowValori["totaleScontato"]).",".intval($rowValori["quantita"]).",'".$post["autore"]."','".$rowValori["riferimento"]."')
					";
				//	var_dump($query);
					$this->connect->myQuery($query);

					$cont++;

					//var_dump(mysqli_errno());

					if($this->connect->errno()){
						$objJSON["success"] = false;
						$objJSON["messageError"] = "Siamo spiacenti, si è verificato un errore";
			$objJSON["mysql_error"] = $this->connect->error();
						return json_encode($objJSON);
					}


				}
			}

			//$this->connect->myQuery("
			//DELETE 	FROM 	preventivi
			//WHERE 	codice = '".$post['codice']."'");


			$this->connect->disconnetti();
			return json_encode($objJSON);

	}


	public function getProdottiFromCarrello($post){


		$this->connect->connetti();


		if(count($post["articoli"]) > 0){

			$where = "";
			for($i = 0;$i < count($post["articoli"]);$i++){
				$where .= " id = '".$post["articoli"][$i]."' OR";
			}
			$where = substr($where,0,strlen($where)-2);

			$query = "SELECT *
						FROM 	cookie_carrello
						WHERE 	1 AND (".$where.")
						ORDER 	BY riferimento";


			$result = $this->connect->myQuery($query);
			$objJSON = array();

			if($this->connect->errno()){
				$objJSON["success"] = false;
				$objJSON["messageError"] = "Errore generico";
			}else{
				$objJSON["success"] = true;
				$objJSON["results"] = array();
				$cont = 0;
				while($rowValori = mysqli_fetch_array($result)){
					$objJSON["results"][$cont]["id"] = $rowValori["id"];
					$objJSON["results"][$cont]["descrizione"] = $rowValori["descrizione"];
					$objJSON["results"][$cont]["autore"] = $rowValori["account"];
					$objJSON["results"][$cont]["totale"] = floatval($rowValori["totale"]);
					$objJSON["results"][$cont]["totaleScontato"] = $rowValori["totaleScontato"];
					$objJSON["results"][$cont]["quantita"] = intval($rowValori["quantita"]);
					$objJSON["results"][$cont]["riferimento"] = $rowValori["riferimento"];
					$objJSON["results"][$cont]["prezzo_definitivo"] = $rowValori["prezzo_definitivo"];
					$cont++;
				}
			}
		}

		$this->connect->disconnetti();
		return json_encode($objJSON);
	}


	public function getAllFromCarrello($post){

		$objJSON = array();
		$this->connect->connetti();

		$where = $post["keyword"];
		if($where == null) {
			$where = "LIMIT ".$post["fromLimit"].", ".$post["toLimit"]."";
		} else {
			//uso upper per rendere la query case insentive
			$where = " AND (UPPER(riferimento) like UPPER('%".$post["keyword"]."%') OR
					UPPER(descrizione) like UPPER('%".$post["keyword"]."%') OR
					UPPER(descrizione) like UPPER('%".str_replace(' ', '', $post["keyword"])."%'))
					LIMIT ".$post["fromLimit"].", ".$post["toLimit"]."";
		}

		$query = "SELECT  	SQL_CALC_FOUND_ROWS *
				FROM 	cookie_carrello
				WHERE 	account='".$post["account"]."' ".$where."";

		//var_dump($query);
		$result = $this->connect->myQuery($query);

		if($this->connect->errno()){
			$objJSON["success"] = false;
			$objJSON["messageError"] = "Errore generico";
		}else{
			$objJSON["success"] = true;
			$objJSON["results"] = array();
			$cont = 0;

			$result_tot = $this->connect->myQuery("SELECT FOUND_ROWS()");
			$tot_clienti = mysqli_fetch_array($result_tot);
			$tot_clienti = $tot_clienti["FOUND_ROWS()"];

			while($rowValori = mysqli_fetch_array($result)){
				$objJSON["results"][$cont]["tot_rows"] = (int)$tot_clienti;
				$objJSON["results"][$cont]["id"] = $rowValori["id"];
				$objJSON["results"][$cont]["descrizione"] = json_decode($rowValori["descrizione"], true);
				$objJSON["results"][$cont]["autore"] = $rowValori["account"];
				$objJSON["results"][$cont]["totale"] = $rowValori["totale"];
				$objJSON["results"][$cont]["totaleScontato"] = $rowValori["totaleScontato"];
				$objJSON["results"][$cont]["quantita"] = $rowValori["quantita"];
				$objJSON["results"][$cont]["riferimento"] = $rowValori["riferimento"];
				$objJSON["results"][$cont]["prezzo_definitivo"] = $rowValori["prezzo_definitivo"];
				$cont++;
			}
		}

		$this->connect->disconnetti();
		return json_encode($objJSON);
	}

	public function getNumCarrello($post){


		$this->connect->connetti();

		$result = $this->connect->myQuery("SELECT COUNT(*) as num_carrello FROM cookie_carrello WHERE account='".$post["account"]."'");
		$objJSON = array();



		if($this->connect->errno()){
			$objJSON["success"] = false;
			$objJSON["messageError"] = "Errore generico";
		}else{
			$objJSON["success"] = true;
			$rowValori = mysqli_fetch_array($result);
			$objJSON["results"] = $rowValori["num_carrello"];
		}

		$this->connect->disconnetti();
		return json_encode($objJSON);
	}

	public function getProdottoFromCarrello($post){

		$this->connect->connetti();
		$result = $this->connect->myQuery("SELECT * FROM cookie_carrello WHERE id='".$post["id"]."' AND account = '".$this->cookie->email."'");
		$objJSON = array();

		if($this->connect->errno()){
			$objJSON["success"] = false;
			$objJSON["messageError"] = "Errore generico";
		}else{
			$objJSON["success"] = true;
			$objJSON["results"] = array();
			$rowValori = mysqli_fetch_array($result);
			$objJSON["results"]["id"] = $rowValori["id"];
			$objJSON["results"]["descrizione"] = json_decode($rowValori["descrizione"], true);
			$objJSON["results"]["autore"] = $rowValori["account"];
			$objJSON["results"]["totale"] = floatval($rowValori["totale"]);
			$objJSON["results"]["quantita"] = intval($rowValori["quantita"]);
			$objJSON["results"]["riferimento"] = $rowValori["riferimento"];
			$objJSON["results"]["prezzo_definitivo"] = $rowValori["prezzo_definitivo"];
		}

		$this->connect->disconnetti();
		return json_encode($objJSON);
	}

	public function deleteProdottoFromCarrello($post){

		$this->connect->connetti();
		$objJSON = array();
		if(count($post["prodotti"]) > 0){

			$where = " WHERE 1 AND (";

			for($i = 0;$i < count($post["prodotti"]); $i++){
				$where .= " id='".$post["prodotti"][$i]."' OR";
			}

			$where = substr($where,0,strlen($where)-2);
			$where .= ")";

			$query = "DELETE FROM cookie_carrello ".$where;
			$this->connect->myQuery($query);

			$objJSON = array();
			if($this->connect->errno()){
				$objJSON["success"] = false;
				$objJSON["messageError"] = "Errore generico";
			}else{
				$objJSON["success"] = true;

				$gImage = new GestioneImmagini();
				$gImage->deleteImageCarrello($post);
			}
		}

		$this->connect->disconnetti();
		return json_encode($objJSON);
	}

	public function svuotaCarrello($post){
		$this->connect->connetti();
		$this->connect->myQuery("DELETE FROM cookie_carrello WHERE account='".$post["account"]."'");

		$objJSON = array();
		if($this->connect->errno()){
			$objJSON["success"] = false;
			$objJSON["messageError"] = "Errore generico";
		}else{
			$objJSON["success"] = true;
			$objJSON["results"] = array();
		}
		$this->connect->disconnetti();
		return json_encode($objJSON);

	}

	public function rimuoviArticoli($post){
		$this->connect->connetti();

		$where = "";
		if(count($post["prodotti"]) > 0){


			for($i = 0;$i < count($post["prodotti"]);$i++){
				$where .= " id = '".$post["prodotti"][$i]["id"]."' OR";
			}

			$where = substr($where,0,strlen($where)-2);

			$query = "DELETE FROM cookie_carrello WHERE 1 AND (".$where.")";


			$this->connect->myQuery($query);




			$objJSON = array();
			if($this->connect->errno()){
				$objJSON["success"] = false;
				$objJSON["messageError"] = "Errore generico";
			}else{
				$objJSON["success"] = true;
				$objJSON["results"] = array();
			}

		}
		$this->connect->disconnetti();
		return json_encode($objJSON);

	}

	public function getPreventiviNonLetti($post){
		$this->connect->connetti();
		$this->connect->myQuery("UPDATE preventivi SET letto='1' WHERE letto = '0'");
		$numero = $this->connect->affected_rows();
		$objJSON = array();
		if($this->connect->errno()){
			$objJSON["success"] = false;
			$objJSON["messageError"] = "Errore generico";
		}else{
			$objJSON["success"] = true;
			$objJSON["results"] = $numero;
		}
		$this->connect->disconnetti();
		return json_encode($objJSON);

	}



	public function salvaCostiPreventivo($post){

		$objJSON["success"] = true;
		$this->connect->connetti();


		$set = substr($set,0,strlen($set)-1);
		$query = "	UPDATE preventivi SET
					riferimento_ordine = '".$post["preventivo"]["riferimento_ordine"]."',
					numero_settimana = '".$post["preventivo"]["numero_settimana"]."',
					anno_settimana = '".$post["preventivo"]["anno_settimana"]."',
					data_consegna = '".$post["preventivo"]["data_consegna"]."',
					iva = '".$post["preventivo"]["iva"]."',
					sconto = '".$post["preventivo"]["sconto"]."',
					costo_trasporto = '".$post["costi_trasporto"]."',
					costo_montaggio = '".$post["costi_montaggio"]."',
					totale = '".$post["preventivo"]["totale"]."',
					totaleIva = '".$post["preventivo"]["totaleIva"]."',
					totaleSenzaIva = '".$post["preventivo"]["totaleSenzaIva"]."',
					totaleScontato = '".$post["preventivo"]["totaleScontato"]."',
					totaleCostiTrasporto = '".$post["totaleCostiTrasporto"]."',
					totaleCostiMontaggio = '".$post["totaleCostiMontaggio"]."',
					nettoAPagare = '".$post["preventivo"]["nettoAPagare"]."',
					vettore = '".stripslashes($post["preventivo"]["vettore"])."',
					nota = '".stripslashes($post["preventivo"]["nota"])."',
					check_hide_articles = '".$post["preventivo"]["check_hide_articles"]."'
					WHERE data = '".$post["preventivo"]["data"]."'";


		$this->connect->myQuery($query);

		$objJSON = array();
		if($this->connect->errno()){
			$objJSON["success"] = false;
			$objJSON["messageError"] = $this->connect->error();
		}else{
			$objJSON["success"] = true;
		}

		$this->connect->disconnetti();
		return json_encode($objJSON);
	}


	public function salvaClientePreventivo($post){

		$objJSON["success"] = true;
		$this->connect->connetti();


		$query = "	UPDATE preventivi SET
					cliente = '".$post["cliente"]."',
					invio_solo_agente_capo_area = '".$post["invio_solo_agente_capo_area"]."'
					WHERE data = '".$post["preventivo"]."'";

		$this->connect->myQuery($query);

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


	public function salvaCantierePreventivo($post){

		$objJSON["success"] = true;
		$this->connect->connetti();


		$regione_cantiere = "NULL";
		if($post["regione_cantiere"] != "") $regione_cantiere = "'".addslashes($post["regione_cantiere"])."'";

		$provincia_cantiere = "NULL";
		if($post["provincia_cantiere"] != "") $provincia_cantiere = "'".addslashes($post["provincia_cantiere"])."'";

		$provincia_sigla_cantiere = "''";
		if($post["provincia_sigla_cantiere"] != "") $provincia_sigla_cantiere = "'".$post["provincia_sigla_cantiere"]."'";

		$comune_cantiere = "NULL";
		if($post["id_comune_cantiere"] != "") $comune_cantiere = "'".$post["id_comune_cantiere"]."'";

		$query = "	UPDATE preventivi SET

						referente_cantiere = '".addslashes($post["referente_cantiere"])."',
						email_referente_cantiere = '".addslashes($post["email_referente_cantiere"])."',
						cellulare_referente_cantiere = '".addslashes($post["cellulare_referente_cantiere"])."',
						indirizzo_cantiere = '".addslashes($post["indirizzo_cantiere"])."',
						civico_cantiere = '".addslashes($post["civico_cantiere"])."',
						cap_cantiere = '".addslashes($post["cap_cantiere"])."',
						regione_cantiere = ".$regione_cantiere.",
						provincia_cantiere = ".$provincia_cantiere.",
						comune_cantiere = ".$comune_cantiere.",
						provincia_sigla_cantiere = ".$provincia_sigla_cantiere.",
						citta_cantiere = '".addslashes($post["citta_cantiere"])."'

					WHERE data = '".$post["preventivo"]."'";

		$this->connect->myQuery($query);

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



	public function salvaPreventivoArticoliSelezionati($post){

		$objJSON =  array();
		$objJSON['success'] = true;

		// SELEZIONO GLI ARTICOLI DAL CARRELLO COOKIE
		$articoli = $this->getProdottiFromCarrello($post);
		$articoli = json_decode($articoli, true);
		$articoli = $articoli["results"];

		$this->connect->connetti();

		$id_preventivo = time();

		$query_carrello = "";
		$query_preventivo = "";
		$query_remove_cookie = "";
		$approvazione = 1;
		
		$totale = 0;
		$totaleScontato = 0;
		
		if(count($articoli) > 0){

				///////////////////////////////////////////////////////////////////////////////////
				////////////////// formulo la query dell'inserimento degli articoli nel carrello //
				///////////////////////////////////////////////////////////////////////////////////

				$values = "";
				$pf = new PublicFunc();
				for($i = 0;$i < count($articoli);$i++){

					$query_remove_cookie .= " id = '".$articoli[$i]["id"]."' OR";

					$descrizione = $articoli[$i]["descrizione"];
					$descr_decode = json_decode($descrizione, true);
					$totaleScontato += $descr_decode["prezzo_totale_scontato"];
					$totale += $descr_decode["prezzo_totale"];

					//if(!$validita)
					//	$approvazione = 0;

					if(!$articoli[$i]["riferimento"]){
						$articoli[$i]["riferimento"] = "";	
					}

					$id = $pf->generaCodice(32);
					$values .= "(
									'".$id."',
									'".$id_preventivo."',
									'".addslashes($descrizione)."',
									1,
									'".$articoli[$i]["totale"]."',
									'".$articoli[$i]["totaleScontato"]."',
									'".$descr_decode["quantita"]."',
									'".addslashes($articoli[$i]["riferimento"])."'
								),";

				}
				$values = substr($values,0,strlen($values)-1);
				$query_remove_cookie = substr($query_remove_cookie,0,strlen($query_remove_cookie)-2);

				unset($pf);

				$query_carrello = "INSERT INTO carrello
									(	id,
										preventivo,
										descrizione,
										tipologia,
										totale,
										totaleScontato,
										quantita,
										riferimento
									)VALUES ".$values;

				//var_dump($query_carrello);

				///////////////////////////////////////////////////////////////////////////////////
				////////////////// formulo la query dell'inserimento del preventivo ///////////////
				///////////////////////////////////////////////////////////////////////////////////

				$query_preventivo = "INSERT INTO preventivi
								(	codice,
									data,
									descrizione,
									totale,
									totaleScontato,
									nettoAPagare,
									account,
									approvazione,
									letto
								)VALUES(
									(SELECT COALESCE(MAX(codice)+1,1) as max_codice FROM preventivi as PREV),
									'".$id_preventivo."',
									'',
									'".$totaleScontato."',
									'".$totaleScontato."',
									'".$totaleScontato."',
									'".$this->cookie->email."',
									'1',
									'0'
								)";

			//var_dump($query_preventivo);

			$this->connect->myQuery($query_preventivo);

			if($this->connect->errno()){
				$objJSON["success"] = false;
				$objJSON["messageError"] = "Siamo spiacenti, si è verificato un errore";
			$objJSON["mysql_error"] = $this->connect->error();
			}else{
				$objJSON['success'] = true;



				$this->connect->myQuery($query_carrello);

				if($this->connect->errno()){
					$objJSON["success"] = false;
					$objJSON["messageError"] = "Siamo spiacenti, si è verificato un errore";
			$objJSON["mysql_error"] = $this->connect->error();
				}

				$bool = json_decode($post["rimuovi"]);
				if($bool){

					////////////////////////////////////////////////////////////////////////////////////////////
					////////////////// formulo la query di rimozione degli articoli dal carrello cookie ////////
					////////////////////////////////////////////////////////////////////////////////////////////

					$query_remove_cookie = " DELETE FROM cookie_carrello WHERE account = '".$this->cookie->email."' AND (".$query_remove_cookie.")";

					$this->connect->myQuery($query_remove_cookie);

				}


			}
		}

		$this->connect->disconnetti();
		return json_encode($objJSON);

	}


}


?>
