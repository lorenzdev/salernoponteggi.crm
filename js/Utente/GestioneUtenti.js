var GestioneUtenti = function(content){

	var _this = this;

	_this.content = content;
	_this.elem;
	_this.user = {}
	_this.stato_precedente;
	_this.keyword = "";
	_this.resultsForPage = 10;
	_this.fromLimit = 0;
	_this.toLimit = 10;
	_this.pageActive = 1;

	_this.init = function (elem){

		_this.initStyle();

		_this.elem = elem;
		_this.elem.html("");

		jQuery.get(P_UTENTI, function(tabella){

			_this.elem.html(tabella);
			_this.initUtenti();
			_this.initButtons();
		});
	}

	_this.initButtons = function(){

		$(".azioni").off().on("change", function(e){
			e.stopPropagation();
			e.preventDefault();

			var id = jQuery(this).data("account");
			switch($(this).val()){
				case "dettagli":
					var account = jQuery(this).data("account");
					_this.content.loader.init(function(){
						_this.viewDettagliUtente(account);
					});
					break;
				case "elimina":
					var result = confirm("Sei sicuro di voler eliminare l'utente? Procedendo verranno eliminati tutti i dati e le operazioni effettuate dall'utente.");
					if(result){
						var accounts = [];
						accounts.push(jQuery(this).data("account"));
						_this.content.loader.init(function(){
							_this.cancellaUtente(accounts);
						});
					} else {
						_this.content.loader.remove();
					}
					break;
				default: break;
			}

		});

		jQuery(".dettagli").off().on("click",function(){
			var account = jQuery(this).data("account");
			_this.content.loader.init(function(){_this.viewDettagliUtente(account);});
		});

		jQuery(".elimina").off().on("click",function(){
			var result = confirm("Sei sicuro di voler eliminare l'utente? Procedendo verranno eliminati tutti i dati e le operazioni effettuate dall'utente.");
			if(result){
				var accounts = [];
					accounts.push(jQuery(this).data("account"));
				_this.content.loader.init(function(){_this.cancellaUtente(accounts);});
			} else _this.content.loader.remove();
		});

		jQuery(".rigenere_password").off().on("click",function(){

			var result = confirm("Sei sicuro di voler rigenerare la password per l'utente?");

			if(result){
				var account = jQuery(this).data("account");
				_this.content.loader.init(function(){_this.rigeneraPassword(account)});
			} else _this.content.loader.remove();
		});

		jQuery("#seleziona_tutti").off().on("click",function(){
			var stato = jQuery("#seleziona_tutti").attr("stato");
			if(stato == "1"){
				jQuery("#seleziona_tutti").attr("stato",0);
				jQuery("#seleziona_tutti").html("Deseleziona tutti");
				jQuery("#cancella_selezionati").prop("disabled",false);
				jQuery(".checkbox_utenti").each(function(){
					jQuery(this).prop("checked",true);
				});
			}else{
				jQuery("#seleziona_tutti").attr("stato",1);
				jQuery("#seleziona_tutti").html("Seleziona tutti");
				jQuery("#cancella_selezionati").prop("disabled",true);
				jQuery(".checkbox_utenti").each(function(){
					jQuery(this).prop("checked",false);
				});
			}
		});


		jQuery("#cancella_selezionati").off().on("click",function(){
			_this.cancellaUtentiSelezionati();
		});


		jQuery(".checkbox_utenti").off().on("click",function(){
			jQuery("#cancella_selezionati").prop("disabled",_this.isChecked())
		});

		$(".resforpage").off().on("change", function(e){
			e.stopPropagation();
			e.preventDefault();
			_this.resultsForPage = Number($(this).val());
			$('.resforpage .filter-option-inner-inner').text(_this.resultsForPage);
			setTimeout(function(){
				_this.initUtenti();
			}, 50);
		});

		$(".page-link").off().on("click", function() {
			if(!$(this).hasClass("disabled")) {
				_this.fromLimit = Number($(this).attr("fromLimit"));
				_this.toLimit = Number($(this).attr("toLimit"));
				_this.pageActive = Number($(this).text());
				setTimeout(function(){
					_this.initUtenti();
				}, 50);
			}
		});

		$("#btn_search").off().on("click", function() {
			_this.keyword = $("#field_search").val();
			$("#loading_utenti").html("<div class=\"label label-success\"><i class=\"fa fa-spinner fa-spin\"></i> Sto cercando...</div>");

			// disabilito i tasti cancella preventivi e salva preventivo (ad ogni ricerca)
			$("#cancella_selezionati").prop("disabled",true);
			$("#salva_preventivo").prop("disabled",true);

			_this.fromLimit = 0;
			_this.toLimit = Number($(".resforpage option:selected").val());
			_this.pageActive = 1;

			setTimeout(function(){
				_this.initUtenti();
			}, 50);

		});

		// sposto il focus sul campo search e quando clicco sul tasto enter della tastiera "triggero" l'azione di pressione del tasto tbn_search
		$("#field_search").focus();
		$("#field_search").off();
		$("#field_search").on("keypress",function(event){
		  	if(event.keyCode == 13){
				$("#btn_search").trigger("click");
		  	}
		});

		$("#field_search").on("click", function(){
			$(this).select();
		});

	}

	_this.isChecked = function(){
		var boo = true;
		jQuery(".checkbox_utenti").each(function(){
			if(jQuery(this).is(":checked")){
				boo = false;
			}
		});

		return boo;
	}

	_this.rigeneraPassword = function(account){

		var password = jQuery.generaPassword(10);
		//$.Log(password);

		function callBackPassword(dato){


			if(!dato.success){
				alert("Errore password non rigenerata correttamente");
			}

			alert("Password rigenerata correttamente!");
			_this.content.loader.remove();
			return;
		}

		jQuery.postJSON("RegistrazioneUtente","rigeneraPassword","private",{"account":account,"password":password}, false, callBackPassword);
	}

	_this.cancellaUtente = function(accounts){

		function callBackUtenti(dato){
			if(!dato.success){
				alert("Errore. Utente non cancellato.");
			}

			_this.content.loadSezione("GestioneUtenti", $("#GestioneUtenti"));
		}

		jQuery.postJSON("RegistrazioneUtente","removeUtente","private",{"accounts":accounts}, false, callBackUtenti);
		_this.content.loader.remove();

	}


	_this.cancellaUtentiSelezionati = function(){
		var result = confirm("Sei sicuro di voler eliminare tutti gli utenti selezionati?");
		if(result){

			var accounts = [];

			jQuery(".checkbox_utenti").each(function(){
				if($(this).is(":checked")){
					accounts.push(jQuery(this).data("account"));
				}
			});

			_this.content.loader.init(function(){

					$.Log("Vedi qua");
					$.Log(accounts);

					function callBackUtenti(dato){
						if(!dato.success){
							alert("Errore. Utente non cancellato.");
						}
						_this.content.loadSezione("GestioneUtenti", $("#GestioneUtenti"));
					}

					jQuery.postJSON("RegistrazioneUtente","removeUtente","private",{"accounts":accounts}, false, callBackUtenti);
					_this.content.loader.remove();
			});
		}else _this.content.loader.remove();
	}

	_this.initUtenti = function() {

		var param = {
			"fromLimit": _this.fromLimit,
			"toLimit":	_this.toLimit,
			"resultsForPage": _this.resultsForPage,
			"keyword":	_this.keyword
		}

		switch(_this.resultsForPage){
			case 5:
				param.toLimit = _this.resultsForPage;
				break;
			case 10:
				param.toLimit = _this.resultsForPage;
				break;
			case 20:
				param.toLimit = _this.resultsForPage;
				break;
			case 100:
				param.toLimit = _this.resultsForPage;
				break;
			default:
				param.toLimit = _this.resultsForPage;
				break;
		}

		var clienti = [];
		function callBackUtenti(dato){

			$.Log("DATI utenti");
			$.Log(dato);

			if(!dato.success){
				alert("Errore gestione utenti");
				_this.content.loader.remove();
				return;
			}

			$("#Rows_utenti").empty();
			$("#pagul").empty();
			$("#loading_utenti").html("");
			$("#num_results").html("");

			utenti = dato.results;
			_this.content.loader.remove();

			if(utenti.length <= 0 && _this.keyword == ""){
				$("#Body").removeClass("hidden");
				_this.elem.html("<h4 align='center'>Non ci sono utenti salvati</h4>");
				return;
			} else if(utenti.length <= 0){
					$("#Body").removeClass("hidden");
					$("#Rows_utenti").html("<h4 align='center'>La ricerca non ha portato alcun risultato</h4>");
					return;
			} else {
				$("#Body").removeClass("hidden");
				//Qui calcolo il numero delle pagine da generare
				var tmp = Math.trunc(utenti[0].tot_rows / param.toLimit);
				var tmp2 = Math.trunc(utenti[0].tot_rows % param.toLimit);
				if(tmp2 == 0) {
					var numPag = tmp;
				} else {
					var numPag = tmp + 1;
				}
			}


			// inserisco il numero di prevntivi trovati
			$("#num_results").html("Trovati "+utenti[0].tot_rows+" utenti");

			var cont = 0;

			//Azzero il from prima di ridisegnare nuovamente la paginazione
			param.fromLimit = 0;

			//Codice per disegnare la paginazione
			for(var i=0; i<numPag; i++) {
				var npg = i+1;
				var tmpPag = '';
				if(npg == _this.pageActive) {
					//Uso i parametri fromLimit e toLimit per inserirli nell'html e poi passarli come parametri per la query
					tmpPag =	'<li class="page-item active"><a class="page-link disabled" fromLimit="'+param.fromLimit+'"toLimit="'+param.toLimit+'" href="#">'+npg+'</a></li>';
				} else {
					//Uso i parametri fromLimit e toLimit per inserirli nell'html e poi passarli come parametri per la query
					tmpPag =	'<li class="page-item"><a class="page-link" fromLimit="'+param.fromLimit+'"toLimit="'+param.toLimit+'" href="#">'+npg+'</a></li>';
				}
				var objPag = $.parseHTML(tmpPag);
				_this.elem.find("#pagul").append(objPag);
				param.fromLimit = parseInt(param.fromLimit) + parseInt(_this.resultsForPage);
				param.toLimit = parseInt(param.toLimit) + parseInt(_this.resultsForPage);
			}

			var header = "<div class=\"row margin-0 list-header hidden-sm hidden-xs grigio\">\
              					<div class=\"col-md-1\"></div>\
							<div class=\"col-md-1\"><div class=\"header\">Codice</div></div>\
			               	<div class=\"col-md-2\"><div class=\"header\">Nome</div></div>\
			               	<div class=\"col-md-1\"><div class=\"header\">Data ins.</div></div>\
			               	<div class=\"col-md-2\"><div class=\"header\">Email</div></div>\
			               	<div class=\"col-md-1\"><div class=\"header\">Cellulare</div></div>\
			               	<div class=\"col-md-1\"><div class=\"header\">Stato</div></div>\
			               	<div class=\"col-md-2\"><div class=\"header\">Ruolo</div></div>\
			               	<div class=\"col-md-1\"><div class=\"header\">Azioni</div></div>\
        					</div>";

			_this.elem.find("#Rows_utenti").append(header);

			for(var i = 0;i < utenti.length;i++){

				var d = utenti[i];

				if(utenti[i].email == jQuery.getCookie("utente").email) continue;

				var tmpColor = cont%2;
				cont++;

				var tmp = '<div class="row margin-0 odd_'+tmpColor+'">\
							<div class="col-md-1">\
								<div class="cell" style="margin-top: 7px;">\
									<div class="checkbox checkbox-primary form-check-input">\
										<input id="_'+i+'" class="checkbox_utenti azioni" type="checkbox">\
										<label for="_'+i+'"><span class="data-label" style="white-space:pre;" data-name="Seleziona questo utenti"></span></label>\
									</div>\
								</div>\
							</div>\
							<div class="col-md-1">\
								<div class="cell">\
									<div class="propertyname"><span class="data-label" data-name="Codice: "></span>'+d.codice+'</div>\
							  	</div>\
							</div>\
							<div class="col-md-2">\
								<div class="cell">\
									<div class="propertyname"><span class="data-label" data-name="Nome: "></span>'+d.nome+' '+d.cognome+'</div>\
								</div>\
							</div>\
							<div class="col-md-1">\
								<div class="cell">\
									<div class="propertyname"><span class="data-label" data-name="Data ins.: "></span>'+d.telefono+'</div>\
								</div>\
							</div>\
							<div class="col-md-2">\
								<div class="cell">\
									<div class="propertyname"><span class="data-label" data-name="Email: "></span>'+d.email+'</div>\
								</div>\
							</div>\
							<div class="col-md-1">\
								<div class="cell">\
									<div class="propertyname"><span class="data-label" data-name="Cellulare: "></span>'+d.cellulare+'</div>\
								</div>\
							</div>\
							<div class="col-md-1">\
								<div class="cell">\
									'+(d.stato=="1"?'<div class="propertyname"><span class="data-label" data-name="Stato: "></span><span class="label label-success">'+d.label_stato+'</span></div>':'<div class="propertyname"><span class="data-label" data-name="Stato: "></span><span class="label label-warning">'+d.label_stato+'</span></div>')+'</div>\
							</div>\
							<div class="col-md-1">\
								<div class="cell">\
									<div class="propertyname"><span class="data-label" data-name="Ruolo: "></span>'+d.nome_ruolo+'</div>\
								</div>\
							</div>\
							<div class="col-md-2">\
			                            <div class="cell" style=\'margin-top: 5px;\'>\
			                                	<select title="Scegli l\'azione..." class="selectpicker azioni" data-style="btn-info">\
			    							  	<option value="dettagli">Modifica i dettagli dell\'utente</option>\
											<option value="elimina">Elimina l\'utente </option>\
			    							</select>\
			                            </div>\
		                		</div>';

					var obj = $.parseHTML(tmp);
					$(obj).data("account", d.email);
					$(obj).find(".azioni").data("account", d.email);

					$("#Rows_utenti").append(obj);

					$(".grigio").addClass("background-header");
					$(".grigio").removeClass("grigio");
					$('.selectpicker').selectpicker();

					_this.initButtons();
				}

			}

		jQuery.postJSON("RegistrazioneUtente","getAllUtenti","private", param, false, callBackUtenti);

	}

	_this.viewDettagliUtente = function(account){


		_this.elem.html("");
		function callBackUtente(datiUtente){

			  $.Log("UTENTE");
			  $.Log(datiUtente);

			  var tmp = "";

			  _this.content.loader.remove();

			  if(!datiUtente.success){
				  _this.content.loader.remove();
				  alert("Errore gestione utente");
				  return;
			  }

			  var d = datiUtente.results;

			  _this.user["stato"] = datiUtente.results.stato;
			  _this.user["ruolo"] = datiUtente.results.ruolo;
			  _this.user["codice_attivazione"] = datiUtente.results.codice_attivazione;
			  _this.user["email"] = datiUtente.results.email;

			  var tipo = datiUtente.results.tipo;
			  var codice_preventivazione = datiUtente.results.codice_preventivazione;


			  var html = '<div class="container">\
							<div class="row margin-0 spazio">\
								<button type="button" class="btn btn-primary indietro">torna alla rubrica</button>\
								  <h3>Dati utente</h3>\
								  <div class="col-md-6">\
									<label>Nome:</label>\
									'+d.nome+'<br />\
								  </div>\
								  <div class="col-md-6">\
									<label>Cognome:</label>\
									'+d.cognome+'<br />\
								  </div>\
								  <div class="col-md-6">\
									<label>Codice preventivazione:</label>\
									'+d.codice_preventivazione+'<br />\
								  </div>\
								  <div class="col-md-6">\
									<label>Sesso:</label>\
									'+d.sesso+'<br />\
								  </div>\
								  <div class="col-md-6">\
									<label>Telefono:</label>\
									'+(d.telefono?d.telefono:"")+'<br />\
								  </div>\
								  <div class="col-md-6">\
									<label>Cellulare:</label>\
									'+(d.cellulare?d.cellulare:"")+'<br />\
								  </div>\
								  <div class="col-md-6">\
									<label>Mansioni:</label>\
									'+(d.mansioni?d.mansioni:"")+'<br />\
								  </div>\
								  <div class="col-md-6">\
									<label>Codice fiscale:</label>\
									'+(d.codice_fiscale?d.codice_fiscale:"")+'<br />\
								  </div>\
								  <div class="col-md-6">\
									<label>Regione:</label>\
									'+(d.nome_regione?d.nome_regione:"")+'<br />\
								  </div>\
								  <div class="col-md-6">\
									<label>Provincia:</label>\
									'+(d.nome_provincia?d.nome_provincia:"")+'<br />\
								  </div>\
								  <div class="col-md-12">\
									<label>Stato:</label>\
									<select id="stato" class="form-control" style="width:250px;">\
										<option value="1">attivo</option>\
										<option value="0">non attivo</option>\
									</select><br>\
								  </div>\
								  <div class="col-md-12">\
									<label>Ruolo:</label>\
									<select id="ruolo" class="form-control" style="width:250px;">\
										<option value="0">Amministratore</option>\
										<option value="1">Agente</option>\
									</select><br>\
								  </div>\
								  <div class="col-md-12">\
									<label>Sconto massimo:</label>\
									<input type="text" class="form-control" id="sconto_massimo" style="width:70px;" maxlength="2" value="'+d.sconto_massimo+'"/><br>\
								  </div>\
							</div>\
							<center><button id="modifica_utente" class="btn btn-primary">modifica</button></center>\
						</div>';

			  $("#Body").html(html);

			  jQuery("#stato option").each(function(){
				  $.Log(jQuery(this).val() +"-"+ d.stato);
				  if(jQuery(this).val() == d.stato)
					  jQuery(this).prop("selected",true);
			  });

			  jQuery("#ruolo option").each(function(){
				  $.Log(jQuery(this).val() +"-"+ d.ruolo);
				  if(jQuery(this).val() == d.ruolo)
					  jQuery(this).prop("selected",true);
			  });

			  jQuery("#modifica_utente").bind("click",function(){
				 _this.content.loader.init(function(){ _this.modificaUtente(d.email)});
			  });

			  jQuery(".indietro").bind("click", function(){
				 jQuery(".GestioneUtenti").trigger("click");
			  });

		  }

		  jQuery.postJSON("RegistrazioneUtente","getUtenteByAccount","private",{"account":account}, false, callBackUtente);

	}


	_this.modificaUtente = function(account){

		var stato = jQuery("#stato option:selected").attr("value");
		var stato_precedente = _this.user["stato"];
		var ruolo = jQuery("#ruolo option:selected").attr("value");
		var codice_preventivazione = jQuery("#codice_preventivazione").val();
		var sconto_massimo = jQuery("#sconto_massimo").val();
		var account = _this.user["email"];

		/*
		if(!codice_preventivazione){
			_this.content.loader.remove();
			alert("Non hai specificato nessun codice preventivazione");
			return;
		}

		
		var unique = true;
		function callBackCodicePreventivazione(datoCodice){

			if(!datoCodice.success){
				unique = false;
				_this.content.loader.remove();
				return;
			}

			if(datoCodice.results.num > 0)
				unique = false;

		}


		var tmp = {
					"codice_preventivazione":codice_preventivazione,
					"account": account
		}


		jQuery.postJSON("RegistrazioneUtente","checkCodicePreventivazione","private",tmp, false, callBackCodicePreventivazione);


		if(!unique){
			_this.content.loader.remove();
			alert("Il codice di preventivazione scelto per l'utente è già stato utilizzato. Sceglierne uno alternativo o cambiare la tipologia utente.");
			return;
		}
		*/

		var paramAccount = {
			"account":account,
			"stato":stato,
			"stato_precedente":_this.user["stato"],
			"ruolo":ruolo,
			"sconto_massimo": sconto_massimo
		}

		$.Log("AH?");
		$.Log(paramAccount);

		_this.elem.html("");

		function callBackModifica(datoModifica){

			if(!datoModifica.success){
				alert("Errore di modifica");
				_this.content.loader.remove();
				return;
			}

			_this.content.loadSezione("GestioneUtenti", $("#GestioneUtenti"));
		}

		jQuery.postJSON("RegistrazioneUtente","modifyStatoAccount","private",paramAccount, false, callBackModifica);

	}

	_this.initStyle = function() {
		//Nascondo la navbar
		$('.navbar-collapse').collapse('hide');
		//Coloro il li del menu
		$("#menu_prodotti").css("background-color", "#016eb6");
		//Nascondo il Body
		$("#Body").addClass("hidden");
	}

}
