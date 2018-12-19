function Clienti(content){

	var _this = this;

	_this.content = content;
	_this.elem;
	_this.user = {};
	_this.agenti;
	_this.numElementRubrica = 0;

	_this.keyword = "";
	_this.resultsForPage = 10;
	_this.fromLimit = 0;
	_this.toLimit = 10;
	_this.pageActive = 1;

	_this.init = function (elem){

		_this.initStyle();

		_this.elem = elem;
		_this.elem.html("");

		jQuery.get(P_RUBRICA, function(tabella){
			_this.elem.html(tabella);
			_this.initRubrica();

			_this.initButtons();
		});
	}

	_this.initButtons = function(){

			$(".azioni").off().on("change", function(e){
				e.stopPropagation();
				e.preventDefault();

				var id = jQuery(this).data("data");
				switch($(this).val()){
					case "modifica":
						var data = jQuery(this).data("data");
						_this.content.loader.init(function(){
							_this.modificaVoceRubrica(data);
						});
						break;
					case "dettagli":
						var data = jQuery(this).data("data");
						_this.content.loader.init(function(){
							_this.visualizzaVoceRubrica(data);
						});
						break;
					case "elimina":
						var bool = confirm("Sei sicuro di voler eliminare il Cliente dalla rubrica?");

						if(bool) {
							var clienti = [];
							clienti.push($(this).data("data"));
							_this.content.loader.init(
								function(){
									_this.eliminaRubrica(clienti);
								});
						}
						break;
					default: break;
				}

			});

			$(".resforpage").off().on("change", function(e){
				e.stopPropagation();
				e.preventDefault();
				_this.resultsForPage = Number($(this).val());
				$('.resforpage .filter-option-inner-inner').text(_this.resultsForPage);
				setTimeout(function(){
					_this.initRubrica();
				}, 50);
			});

			$(".page-link").off().on("click", function() {
				if(!$(this).hasClass("disabled")) {
					_this.fromLimit = Number($(this).attr("fromLimit"));
					_this.toLimit = Number($(this).attr("toLimit"));
					_this.pageActive = Number($(this).text());
					setTimeout(function(){
						_this.initRubrica();
					}, 50);
				}
			});

			$("#btn_search").off().on("click", function() {
				_this.keyword = $("#field_search").val();
				$("#loading_rubrica").html("<div class=\"label label-success\"><i class=\"fa fa-spinner fa-spin\"></i> Sto cercando...</div>");

				// disabilito i tasti cancella preventivi e salva preventivo (ad ogni ricerca)
				$("#cancella_selezionati").prop("disabled",true);
				$("#salva_preventivo").prop("disabled",true);

				_this.fromLimit = 0;
				_this.toLimit = Number($(".resforpage option:selected").val());
				_this.pageActive = 1;

				setTimeout(function(){
					_this.initRubrica();
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

			$("#nuova_voce").off().on("click",function(){
				_this.content.loader.init(function(){
					_this.inserisciRubrica();
				});
			});

			jQuery("#seleziona_tutti").off().on("click",function(){

				var stato = jQuery("#seleziona_tutti").attr("stato");
				if(stato == "1"){
					jQuery("#seleziona_tutti").attr("stato",0);
					jQuery("#seleziona_tutti").html("Deseleziona tutti");
					jQuery("#cancella_selezionati").prop("disabled",false);
					jQuery(".checkbox_rubrica").each(function(){
						jQuery(this).prop("checked",true);
					});
				}else{
					jQuery("#seleziona_tutti").attr("stato",1);
					jQuery("#seleziona_tutti").html("Seleziona tutti");
					jQuery("#cancella_selezionati").prop("disabled",true);
					jQuery(".checkbox_rubrica").each(function(){
						jQuery(this).prop("checked",false);
					});
				}
			});


			jQuery("#cancella_selezionati").off().on("click",function(){
				_this.content.loader.init(function(){_this.cancellaSelezionati();});
			});


			jQuery(".checkbox_rubrica").off().on("click",function(){
				jQuery("#cancella_selezionati").prop("disabled",_this.isChecked())
			});


		jQuery(".dettagli").off().on("click",function(){
			var data = jQuery(this).data("data");
			_this.content.loader.init(function(){_this.visualizzaVoceRubrica(data);});
		});

		jQuery(".modifica").off().on("click",function(){
			var data = jQuery(this).data("data");
			_this.content.loader.init(function(){_this.modificaVoceRubrica(data);});
		});

		jQuery(".elimina").off().on("click",function(){

			var bool = confirm("Sei sicuro di voler eliminare il Cliente dalla rubrica?");

			if(bool){

				var clienti = [];
					clienti.push($(this).data("data"));

				_this.content.loader.init(
					function(){
						_this.eliminaRubrica(clienti);
					});

			}
		});


	}

	_this.isChecked = function(){
		var boo = true;
				jQuery(".checkbox_rubrica").each(function(){
					if(jQuery(this).is(":checked")){
						boo = false;
					}
				});

		return boo;
	}

	_this.visualizzaVoceRubrica = function(data){

		function callBackVoceRubrica(datoRubrica){
			$.Log(datoRubrica);

			if(!datoRubrica.success){
				alert("Errore di caricamento cliente in rubrica!");
				return;
			}

			var d = datoRubrica.results[0];

			var modalita_pagamento = "";
			if(d.modalita_pagamento_cliente){
				switch(d.modalita_pagamento_cliente){
					case '5': modalita_pagamento = "NR. 1 R.B. 60 GG. F.M.";break;
					case '11': modalita_pagamento = "NR. 1 R.B. A 90 GG. F.M.";break;
					case '13': modalita_pagamento = "NR. 2 R. B. 30-60 GG. FM";break;
					case '16': modalita_pagamento = "ALLA CONSEGNA CON VS. TITOLO";break;
					case '32': modalita_pagamento = "30%+IVA ACC, RESTO TITOLO SCARI";break;
					case '35': modalita_pagamento = "CON VS. ASS. AD AVVISO MERCE PRO";break;
					case '64': modalita_pagamento = "BONIFICO BANCARIO A 60gg";break;
					case '68': modalita_pagamento = "BONIFICO A 30gg";break;
				}
			}else{

				modalita_pagamento = d.mod_altro_pagamento;

			}

			var html = '<div class="container">\
							<div class="row margin-0 spazio">\
								<button type="button" class="btn btn-primary indietro">torna alla rubrica</button>\
								  <h3>Dati cliente</h3>\
								  <div class="col-md-6">\
									<label>Ragione sociale:</label>\
									'+d.ragione_sociale_cliente+'<br />\
								  </div>\
								 <div class="col-md-6">\
									<label for="ragione_sociale">Codice:</label>\
									'+d.codice_cliente+'<br />\
								  </div>\
								  <div class="col-md-6">\
									<label>Indirizzo:</label>\
									'+d.indirizzo_cliente+" "+d.civico_cliente+" "+d.cap_cliente+'<br />\
								  </div>\
								  <div class="col-md-6">\
									<label>Regione:</label>\
									'+d.regione_cliente+'<br />\
								  </div>\
								 <div class="col-md-6">\
									<label>Provincia:</label>\
									'+d.provincia_cliente+'<br />\
								  </div>\
								  <div class="col-md-6">\
									<label>Comune:</label>\
									'+d.comune_cliente+'<br />\
								  </div>\
								 <div class="col-md-6">\
									<label>Partita iva:</label>\
									'+d.partita_iva_cliente+'<br />\
								  </div>\
								 <div class="col-md-6">\
									<label>Codice fiscale:</label>\
									'+d.codice_fiscale_cliente+'<br />\
								  </div>\
								 <div class="col-md-6">\
									<label>Telefono:</label>\
									'+d.prefisso_telefono_cliente+' '+d.telefono_cliente+'<br />\
								  </div>\
								 <div class="col-md-6">\
									<label>Fax:</label>\
									'+d.prefisso_fax_cliente+' '+d.fax_cliente+'<br />\
								  </div>\
								  <div class="col-md-6">\
									<label>Cellulare:</label>\
									'+d.prefisso_cellulare_cliente+' '+d.cellulare_cliente+'<br />\
								  </div>\
								 <div class="col-md-6">\
									<label>Email:</label>\
									'+d.email_cliente+'<br />\
								  </div>\
								  <div class="col-md-6">\
									<label>Email PEC:</label>\
									'+d.email_pec_cliente+'<br />\
								  </div>\
								 <div class="col-md-6">\
									<label>Sito web:</label>\
									'+d.website_cliente+'<br />\
								  </div>\
								 <div class="col-md-6">\
									<label>Attività cliente:</label>\
									'+d.attivita_cliente+'<br />\
								  </div>\
								  <div class="col-md-6">\
									<label>Banca:</label>\
									'+d.banca_cliente+'<br />\
								  </div>\
								  <div class="col-md-6">\
									<label>Agenzia:</label>\
									'+d.agenzia_cliente+'<br />\
								  </div>\
								 <div class="col-md-6">\
									<label>ABI:</label>\
									'+d.abi_cliente+'<br />\
								  </div>\
								 <div class="col-md-6">\
									<label>CAB:</label>\
									'+d.cab_cliente+'<br />\
								  </div>\
								 <div class="col-md-6">\
									<label>IBAN:</label>\
									'+d.iban_cliente+'<br />\
								  </div>\
								  <div class="col-md-6">\
									<label>Capo area:</label>\
									'+d.capo_area_cliente+'<br />\
								  </div>\
								  <div class="col-md-6">\
									<label>Sconto richiesto (%):</label>\
									'+d.sconto_richiesto_cliente+'<br />\
								  </div>\
								  <div class="col-md-6">\
									<label>Aliquota iva richiesta (%):</label>\
									'+d.aliquota_iva_richiesta_cliente+'<br />\
								  </div>\
								 <div class="col-md-6">\
									<label>Modalità di pagamento:</label>\
									'+modalita_pagamento+'<br />\
								  </div>\
								  <div class="col-md-6"></div>\
							</div>\
							<div class="row margin-0 spazio">\
								 <h3>Responsabile ufficio acquisti</h3>\
								 <div class="col-md-6">\
									<label>Nome:</label>\
									'+d.nome_r_cliente+' '+d.cognome_r_cliente+'<br />\
								  </div>\
								 <div class="col-md-6">\
									<label>Cellulare:</label>\
									'+d.cellulare_r_cliente+'<br />\
								  </div>\
								 <div class="col-md-6">\
									<label>Email:</label>\
									'+d.email_r_cliente+'<br />\
								  </div>\
							</div>\
						</div>';


			$("#Body").html(html);

			 jQuery(".indietro").off().on("click", function(){
				jQuery(".Clienti").trigger("click");
			 });

			 _this.content.loader.remove();

		}

		jQuery.postJSON("Clienti", "getClienteDaRubrica","private", {"cliente":data}, false, callBackVoceRubrica);
	}




	_this.modificaVoceRubrica = function(data){

		jQuery.get(P_FORM_RUBRICA, function(datoForm){
			_this.elem.html(datoForm);

			function callBackVoceRubrica(datoRubrica){

				$.Log("GUARDA QUA");
				$.Log(datoRubrica);

				jQuery("#id").val(datoRubrica.results[0].id_cliente);
				jQuery("#ragione_sociale").val(datoRubrica.results[0].ragione_sociale_cliente);
				jQuery("#codice").val(datoRubrica.results[0].codice_cliente);
			  	jQuery("#indirizzo").val(datoRubrica.results[0].indirizzo_cliente);
			  	jQuery("#civico").val(datoRubrica.results[0].civico_cliente);
			  	jQuery("#cap").val(datoRubrica.results[0].cap_cliente);
			  	jQuery("#regione").val();
			  	jQuery("#provincia").val();
			  	jQuery("#comune").val();
			  	jQuery("#citta").val(datoRubrica.results[0].citta_cliente);
			  	jQuery("#partita_iva").val(datoRubrica.results[0].partita_iva_cliente);
			  	jQuery("#codice_fiscale").val(datoRubrica.results[0].codice_fiscale_cliente);
			  	jQuery("#telefono").val(datoRubrica.results[0].telefono_cliente);
			  	jQuery("#fax").val(datoRubrica.results[0].fax_cliente);
			  	jQuery("#email").val(datoRubrica.results[0].email_cliente);
			 	jQuery("#cellulare").val(datoRubrica.results[0].cellulare_cliente);
			  	jQuery("#website").val(datoRubrica.results[0].website_cliente);
			  	jQuery("#attivita_cliente").val(datoRubrica.results[0].attivita_cliente);

			 	jQuery("#capo_area").val(datoRubrica.results[0].indirizzo_cliente);
			  	jQuery("#email_capo_area").val(datoRubrica.results[0].email_capo_area_cliente);
			  	jQuery("#sconto_richiesto").val(datoRubrica.results[0].sconto_richiesto_cliente);
			  	jQuery("#aliquota_iva_richiesta").val(datoRubrica.results[0].aliquota_iva_richiesta_cliente);
			  	jQuery("#modalita_invio_preventivo").val(datoRubrica.results[0].modalita_invio_preventivo_cliente);
			  	jQuery("#modalita_pagamento option[value='"+datoRubrica.results[0].modalita_pagamento_cliente+"']").prop("selected", true);
				jQuery("#mod_altro_pagamento").val(datoRubrica.results[0].mod_altro_pagamento_cliente);

				jQuery("#prefisso_cellulare option").each(function(){
					if($(this).val() == datoRubrica.results[0].prefisso_cellulare_cliente)
						$(this).prop("selected", true);
				});

				jQuery("#prefisso_cellulare_r option").each(function(){
					if($(this).val() == datoRubrica.results[0].prefisso_cellulare_r_cliente)
						$(this).prop("selected", true);
				});


				jQuery("#prefisso_telefono option").each(function(){
					if($(this).val() == datoRubrica.results[0].prefisso_telefono_cliente)
						$(this).prop("selected", true);
				});

				jQuery("#prefisso_fax option").each(function(){
					if($(this).val() == datoRubrica.results[0].prefisso_fax_cliente)
						$(this).prop("selected", true);
				});

			  	jQuery("#tipo").val();
			  	jQuery("#codice_preventivazione").val(datoRubrica.results[0].codice_preventivazione);

			  	jQuery("#nome_r").val(datoRubrica.results[0].nome_r_cliente);
			  	jQuery("#cognome_r").val(datoRubrica.results[0].cognome_r_cliente);
			  	jQuery("#cellulare_r").val(datoRubrica.results[0].cellulare_r_cliente);


			  	jQuery("#email_r").val(datoRubrica.results[0].email_r_cliente);

			 	jQuery("#agenti").val();
				jQuery("#responsabile").val(datoRubrica.results[0].responsabile_cliente);

		 		jQuery("#banca").val(datoRubrica.results[0].banca_cliente);
		 		jQuery("#agenzia").val(datoRubrica.results[0].agenzia_cliente);
				jQuery("#abi").val(datoRubrica.results[0].abi_cliente);
				jQuery("#cab").val(datoRubrica.results[0].cab_cliente);
				jQuery("#iban").val(datoRubrica.results[0].iban_cliente);
				jQuery("#fax").val(datoRubrica.results[0].fax_cliente);

		 		jQuery("#capo_area").val(datoRubrica.results[0].capo_area_cliente);
		 		jQuery("#denominazione_cantiere").val(datoRubrica.results[0].denominazione_cantiere_cliente);
		 		jQuery("#referente_cantiere").val(datoRubrica.results[0].referente_cantiere_cliente);
		 		jQuery("#cellulare_referente_cantiere").val(datoRubrica.results[0].cellulare_responsabile_cliente);
				jQuery("#id_indirizzo").val(datoRubrica.results[0].id_indirizzo_cliente);
				jQuery("#id_indirizzo_cantiere").val(datoRubrica.results[0].id_indirizzo_cantiere);
				jQuery("#indirizzo_cantiere").val(datoRubrica.results[0].indirizzo_cantiere);

				jQuery("#civico_cantiere").val(datoRubrica.results[0].civico_cantiere);
				jQuery("#cap_cantiere").val(datoRubrica.results[0].cap_cantiere);
		 		jQuery("#email_referente_cantiere").val(datoRubrica.results[0].email_referente);
				jQuery("#aliquota_iva").val(datoRubrica.results[0].aliquota_iva);
				jQuery("#regione_cantiere").val(datoRubrica.results[0].regione_cantiere);
				jQuery("#provincia_cantiere").val(datoRubrica.results[0].provincia_cantiere);

				jQuery("#tipologia_pagamento option").each(function(){
					if(jQuery(this).val() == datoRubrica.results[0].modalita_pagamento_cliente)
						jQuery(this).prop("selected",true);
				});

				_this.popolaNazioni(jQuery("#nazione"));
				_this.popolaRegioni(jQuery("#regione"));

				jQuery("#regione option").each(function(){
					if(jQuery(this).text() == datoRubrica.results[0].regione_cliente){
						jQuery(this).prop("selected",true);
						return;
					}
				});

				_this.popolaProvince(jQuery("#regione option:selected").val(),jQuery("#provincia"));
				jQuery("#provincia").removeAttr("disabled");
				jQuery("#provincia option").each(function(){
					if(jQuery(this).text() == datoRubrica.results[0].provincia_cliente){
						jQuery(this).prop("selected",true);
						return;
					}
				});

				_this.popolaComuni(jQuery("#provincia option:selected").val(),jQuery("#comune"));
				jQuery("#comune option").each(function(){
					if(jQuery(this).text() == datoRubrica.results[0].comune_cliente){
						jQuery(this).prop("selected",true);
						return;
					}
				});
				jQuery("#comune").removeAttr("disabled");


				_this.popolaNazioni(jQuery("#nazione_cantiere"));
				_this.popolaRegioni(jQuery("#regione_cantiere"));

				jQuery("#regione_cantiere option").each(function(){
					if(jQuery(this).text() == datoRubrica.results[0].regione_cantiere_cliente){
						jQuery(this).prop("selected",true);
						return;
					}
				});

				_this.popolaProvince(jQuery("#regione_cantiere option:selected").val(),jQuery("#provincia_cantiere"));
				jQuery("#provincia_cantiere").removeAttr("disabled");
				jQuery("#provincia_cantiere option").each(function(){
					if(jQuery(this).text() == datoRubrica.results[0].provincia_cantiere_cliente){
						jQuery(this).prop("selected",true);
						return;
					}
				});

				_this.popolaComuni(jQuery("#provincia_cantiere option:selected").val(),jQuery("#comune_cantiere"));
				jQuery("#comune_cantiere option").each(function(){
					if(jQuery(this).text() == datoRubrica.results[0].comune_cantiere_cliente){
						jQuery(this).prop("selected",true);
						return;
					}
				});
				jQuery("#comune_cantiere").removeAttr("disabled");


				function callBackUtenti(dato){

					$.Log("UTENTI");
					$.Log(dato);

					var agenti = "";

					for(var i = 0;i < dato.results.length;i++){
						$.Log(dato.results[i].email+" "+datoRubrica.results[0].agente_cliente);

						var selected = "";

						if(dato.results[i].email == datoRubrica.results[0].agente_cliente){
							selected = "selected";
						}
						agenti += "<option value='"+dato.results[i].email+"' "+selected+">"+dato.results[i].nome+" "+dato.results[i].cognome+"</option>";
					}

					$("#agenti").append(agenti);
				}

				jQuery.postJSON("RegistrazioneUtente", "getAllUtentiWithMe","private", {}, true, callBackUtenti);


				if($.getCookie("utente").ruolo == "ROLE_ADMIN"){
					 jQuery(".assegnamento_agente_cliente").css({display:"block"});
				  }


				jQuery("#regione").off().on("change",function(){
					var regione = jQuery(this).val();
					jQuery("#provincia").html("<option value=\"null\">Seleziona la provincia</option>");
					jQuery("#provincia").removeAttr("disabled");
					jQuery("#comune").html("<option value=\"null\">Seleziona il comune</option>");
					jQuery("#comune").addClass("selectDisabled");
					jQuery("#comune").attr("disabled","disabled");
					_this.popolaProvince(regione,jQuery("#provincia"));
				});

				jQuery("#provincia").off().on("change",function(){
					var provincia = jQuery(this).val();
					jQuery("#comune").removeClass("selectDisabled");
					jQuery("#comune").removeAttr("disabled");
					jQuery("#comune").html("<option value=\"null\">Seleziona il comune</option>");
					_this.popolaComuni(provincia,jQuery("#comune"));
				});


				jQuery("#regione_cantiere").off().on("change",function(){
					var regione = jQuery(this).val();
					jQuery("#provincia_cantiere").html("<option value=\"null\">Seleziona la provincia</option>");
					jQuery("#provincia_cantiere").removeAttr("disabled");
					jQuery("#comune_cantiere").html("<option value=\"null\">Seleziona il comune</option>");
					jQuery("#comune_cantiere").addClass("selectDisabled");
					jQuery("#comune_cantiere").attr("disabled","disabled");
					_this.popolaProvince(regione,jQuery("#provincia_cantiere"));
				});

				jQuery("#provincia_cantiere").off().on("change",function(){
					var provincia = jQuery(this).val();
					jQuery("#comune_cantiere").removeClass("selectDisabled");
					jQuery("#comune_cantiere").removeAttr("disabled");
					jQuery("#comune_cantiere").html("<option value=\"null\">Seleziona il comune</option>");
					_this.popolaComuni(provincia,jQuery("#comune_cantiere"));
				});

				jQuery("#aliquota_iva").on("keypress",function(e){
					return jQuery.onlynumbers(e);
				});

				jQuery("#sconto_richiesto").on("keypress",function(e){
					return jQuery.onlynumbers(e);
				});

				jQuery("#aliquota_iva_richiesta").on("keypress",function(e){
					return jQuery.onlynumbers(e);
				});

				jQuery("#cap").on("keypress",function(e){
					return jQuery.onlynumbers(e);
				});

				jQuery("#cap_cantiere").on("keypress",function(e){
					return jQuery.onlynumbers(e);
				});

				jQuery("#telefono").on("keypress",function(e){
					return jQuery.onlynumbers(e);
				});

				jQuery("#fax").on("keypress",function(e){
					return jQuery.onlynumbers(e);
				});

				jQuery("#cellulare").on("keypress",function(e){
					return jQuery.onlynumbers(e);
				});

				jQuery("#cellulare_r").on("keypress",function(e){
					return jQuery.onlynumbers(e);
				});

				 jQuery("#salva_cliente").off().on("click", function(){
					  _this.content.loader.init(function(){_this.salvaClienti();});
				  });

				jQuery(".indietro").off().on("click", function(){
					jQuery("#Clienti").trigger("click");
			 	});


				$("input, select").on("click", function(){
					$(this).css({borderColor: "#ccc"});
					$("#errori_compilazione_cliente").html("");
				});

				$("input, select").on('keydown', function(e) {
					if (e.which == 9) {
						$(this).css({borderColor: "#ccc"});
						$("#errori_compilazione_cliente").html("");
					}
				});

				_this.content.loader.remove();

			}

			var email = "";
			if(jQuery.getCookie("utente").ruolo != "ROLE_ADMIN")
				email = jQuery.getCookie("utente").email;


			jQuery.postJSON("Clienti", "getClienteDaRubrica","private", {"cliente":data}, false, callBackVoceRubrica);

			jQuery(".indietro").off().on("click", function(){
				jQuery(".Clienti").trigger("click");
			 });


		});
	}

	_this.eliminaRubrica = function(clienti){

		function callBackRubrica(dato){
			if(!dato.success){
				alert(dato.errorMessage);
				return;
			}
		}

		jQuery.postJSON("Clienti","removeFromRubrica", "private", {"clienti":clienti}, false, callBackRubrica);
		_this.content.loadSezione("Clienti", $("#Clienti"));
	}


	_this.inserisciRubrica = function(){

		_this.elem.html("");

		jQuery.get(P_FORM_RUBRICA, function(datoForm){
			_this.elem.html(datoForm);

			function callBackUtenti(dato){

				$.Log("UTENTI");
				$.Log(dato);

				var agenti = "";
				for(var i = 0;i < dato.results.length;i++){

					var selected = "";

					if(dato.results[i].email == $.getCookie("utente").email)
						selected = "selected";

					agenti += "<option value='"+dato.results[i].email+"' "+selected+">"+dato.results[i].nome+" "+dato.results[i].cognome+"</option>";
				}

				$("#agenti").append(agenti);
			}

			jQuery.postJSON("RegistrazioneUtente", "getAllUtentiWithMe","private", {}, true, callBackUtenti);

		  _this.popolaNazioni($(".nazione"));
		  _this.popolaRegioni($(".regione"));

		  //_this.popolaNazioni(jQuery("#nazione_cantiere"));
		  //_this.popolaRegioni(jQuery("#regione_cantiere"));


		  if($.getCookie("utente").ruolo == "ROLE_ADMIN"){
			 jQuery(".assegnamento_agente_cliente").css({display:"block"});
		  }

		  jQuery("#regione").off().on("change",function(){
			  var regione = jQuery(this).val();
			  jQuery("#provincia").html("<option value=\"null\">Seleziona la provincia</option>");
			  jQuery("#provincia").removeAttr("disabled");
			  jQuery("#comune").html("<option value=\"null\">Seleziona il comune</option>");
			  jQuery("#comune").addClass("selectDisabled");
			  jQuery("#comune").attr("disabled","disabled");
			  _this.popolaProvince(regione,jQuery("#provincia"));
		  });

		  jQuery("#provincia").off().on("change",function(){
			  var provincia = jQuery(this).val();
			  jQuery("#comune").removeClass("selectDisabled");
			  jQuery("#comune").removeAttr("disabled");
			  jQuery("#comune").html("<option value=\"null\">Seleziona il comune</option>");
			  _this.popolaComuni(provincia,jQuery("#comune"));
		  });


		  jQuery("#regione_cantiere").off().on("change",function(){
			  var regione = jQuery(this).val();
			  jQuery("#provincia_cantiere").html("<option value=\"null\">Seleziona la provincia</option>");
			  jQuery("#provincia_cantiere").removeAttr("disabled");
			  jQuery("#comune_cantiere").html("<option value=\"null\">Seleziona il comune</option>");
			  jQuery("#comune_cantiere").addClass("selectDisabled");
			  jQuery("#comune_cantiere").attr("disabled","disabled");
			  _this.popolaProvince(regione,jQuery("#provincia_cantiere"));
		  });

		  jQuery("#provincia_cantiere").off().on("change",function(){
			  var provincia = jQuery(this).val();
			  jQuery("#comune_cantiere").removeClass("selectDisabled");
			  jQuery("#comune_cantiere").removeAttr("disabled");
			  jQuery("#comune_cantiere").html("<option value=\"null\">Seleziona il comune</option>");
			  _this.popolaComuni(provincia,jQuery("#comune_cantiere"));
		  });

		  jQuery("#aliquota_iva").on("keypress",function(e){
			  return jQuery.onlynumbers(e);
		  });


		  jQuery("#cap").on("keypress",function(e){
			  return jQuery.onlynumbers(e);
		  });

		  jQuery("#cap_cantiere").on("keypress",function(e){
			  return jQuery.onlynumbers(e);
		  });

		  jQuery("#telefono").on("keypress",function(e){
			  return jQuery.onlynumbers(e);
		  });

		  jQuery("#cellulare").on("keypress",function(e){
			  return jQuery.onlynumbers(e);
		  });

		  jQuery("#fax").on("keypress",function(e){
			  return jQuery.onlynumbers(e);
		  });

		  jQuery("#salva_cliente").off().on("click", function(){
			  _this.content.loader.init(function(){_this.salvaClienti();});
		  });


		  jQuery(".indietro").off().on("click", function(){
			 jQuery("#Clienti").trigger("click");
		  });

		  $("input, select").on("click", function(){
			  $(this).css({borderColor: "#ccc"});
			  $("#errori_compilazione_cliente").html("");
		  });

		  $("input, select").on('keydown', function(e) {
			  if (e.which == 9) {
				  $(this).css({borderColor: "#ccc"});
				  $("#errori_compilazione_cliente").html("");
			  }
		  });

		  _this.content.loader.remove();

		  jQuery(".indietro").off().on("click", function(){
				jQuery(".Clienti").trigger("click");
			 });


	  });
	}


	_this.salvaClienti = function(){


		var cliente = {};


			if(jQuery("#id").val())
				cliente.id = jQuery("#id").val();

			cliente.provincia_agente = jQuery("#provincia_agente").val();
			cliente.ragione_sociale = jQuery("#ragione_sociale").val();
			cliente.codice_fiscale = jQuery("#codice_fiscale").val();
			cliente.partita_iva = jQuery("#partita_iva").val();
			cliente.telefono = jQuery("#telefono").val();
			cliente.codice = jQuery("#codice").val();
			cliente.fax = jQuery("#fax").val();
			cliente.abi = jQuery("#abi").val();
			cliente.cab = jQuery("#cab").val();
			cliente.agenzia = jQuery("#agenzia").val();
			cliente.website = jQuery("#website").val();
			cliente.email = jQuery("#email").val();
			cliente.email_pec = jQuery("#email_pec").val();
			cliente.regione = jQuery("#regione option:selected").val();
			cliente.provincia = jQuery("#provincia option:selected").val();
			cliente.comune = jQuery("#comune option:selected").val();
			cliente.citta = jQuery("#citta").val();
			cliente.indirizzo = jQuery("#indirizzo").val();
			cliente.citta = jQuery("#citta").val();
			cliente.civico = jQuery("#civico").val();
			cliente.cap = jQuery("#cap").val();
			cliente.telefono = jQuery("#telefono").val();


			cliente.prefisso_fax = jQuery("#prefisso_fax option:selected").val();
			cliente.fax = jQuery("#fax").val();
			cliente.email = jQuery("#email").val();

			cliente.prefisso_cellulare = jQuery("#prefisso_cellulare option:selected").val();
			cliente.cellulare = jQuery("#cellulare").val();

			cliente.prefisso_telefono = jQuery("#prefisso_telefono option:selected").val();
			cliente.telefono = jQuery("#telefono").val();
			cliente.attivita_cliente = jQuery("#attivita_cliente").val();
			cliente.banca = jQuery("#banca").val();
			cliente.iban = jQuery("#iban").val();
			cliente.capo_area = jQuery("#capo_area").val();
			cliente.email_capo_area = jQuery("#email_capo_area").val();
			cliente.sconto_richiesto = jQuery("#sconto_richiesto").val();
			cliente.aliquota_iva_richiesta = jQuery("#aliquota_iva_richiesta").val();
			cliente.modalita_invio_preventivo = jQuery("#modalita_invio_preventivo").val();
			cliente.modalita_pagamento = jQuery("#modalita_pagamento").val();
			cliente.mod_altro_pagamento = jQuery("#mod_altro_pagamento").val();
			cliente.agente = jQuery("#agenti option:selected").val();

			cliente.nome_r = jQuery("#nome_r").val();
			cliente.cognome_r = jQuery("#cognome_r").val();
			cliente.email_r = jQuery("#email_r").val();
			cliente.prefisso_cellulare_r = jQuery("#prefisso_cellulare_r option:selected").val();
			cliente.cellulare_r = jQuery("#cellulare_r").val();

			console.log("ECCOLO QUA!!!!");
			console.log(cliente);


	 	if(!_this.verificaDatiCliente(cliente)){
			_this.content.loader.remove();
			return;
		}


		function callBackClienti(dato){

			if(!dato.success){
				alert(dato.messageError);
				return;
			}


		}

		jQuery.postJSON("Clienti","salvaCliente", "public", cliente, false, callBackClienti);
		_this.content.loadSezione("Clienti", $("#Clienti"));
	}

	/*
	_this.modificaClienti = function(){

		var request = {};

		var data_creazione = new Date().getTime();
		request = _this.checkDatiInseriti(data_creazione);

		$.Log(request);

	 	if(!request){
			_this.content.loader.remove();
			return;
		}

		function callBackClienti(dato){

			if(!dato.success){
				alert(dato.messageError);
				return;
			}

			_this.content.loader.remove();
		}

		jQuery.postJSON("Clienti","salvaClienti", "public", request, false, callBackClienti);

	}
	*/


	_this.popolaNazioni = function(elemSelect){

		function callBackNazioni(dato){
			//$.Log("Nazioni:");
			//$.Log(dato);
			//jQuery("#regione").html("<option ");
			for(var i = 0;i < dato.length;i++){
				var selected = "";
				//$.Log(dato[i].id +  " == IT");
				if(dato[i].id == "IT")
					selected = "selected";
				var tmp = "<option value='"+dato[i].id+"' "+selected+">"+dato[i].nome+"</option>";
				elemSelect.append(tmp);
			}
		}

		jQuery.postJSON("RegistrazioneUtente", "getNazioni","public", {}, false, callBackNazioni);
	}

	_this.popolaRegioni = function(elemSelect){

		function callBackRegione(dato){

			//$.Log(dato);
			//jQuery("#regione").html("<option ");
			for(var i = 0;i < dato.length;i++){
				var tmp = "<option value='"+dato[i].id+"'>"+dato[i].nome+"</option>";
				elemSelect.append(tmp);
			}
		}

		jQuery.postJSON("RegistrazioneUtente", "getRegioni","public", {}, false, callBackRegione);

	}

	_this.popolaProvince = function(id_regione, elemSelect){

		function callBackProvince(dato){
			//$.Log(dato);
			//jQuery("#provincia").html("");
			for(var i = 0;i < dato.length;i++){
				var tmp = "<option value='"+dato[i].id+"'>"+dato[i].nome+"</option>";
				elemSelect.append(tmp);
			}
		}

		jQuery.postJSON("RegistrazioneUtente", "getProvince","public", {"regione":id_regione}, false, callBackProvince);
	}

	_this.popolaComuni = function(id_provincia,elemSelect){

		function callBackComuni(dato){
			//$.Log(dato);
			//jQuery("#comune").html("");
			for(var i = 0;i < dato.length;i++){
				var tmp = "<option value='"+dato[i].id+"'>"+dato[i].nome+"</option>";
				elemSelect.append(tmp);
			}
		}

		jQuery.postJSON("RegistrazioneUtente", "getComuni","public", {"provincia":id_provincia}, false, callBackComuni);
	}


	_this.verificaDatiCliente = function(cliente){

		var response = {
				result: true,
				message: ""
		}

		if(!cliente.ragione_sociale){
			response.result = false;
			response.message += "<i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i>  Non hai inserito la ragione sociale<br>";
			$("#ragione_sociale").css({borderColor: "#F00"});
		}

		if(!cliente.indirizzo){
			response.result = false;
			response.message += "<i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i>  Non hai inserito l'indirizzo<br>";
			$("#indirizzo").css({borderColor: "#F00"});
		}

		if(!cliente.civico){
			response.result = false;
			response.message += "<i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i>  Non hai inserito il numero civico<br>";
			$("#civico").css({borderColor: "#F00"});
		}

		if(!cliente.cap){
			response.result = false;
			response.message += "<i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i>  Non hai inserito il cap<br>";
			$("#cap").css({borderColor: "#F00"});
		}

		if(!cliente.regione){
			response.result = false;
			response.message += "<i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i>  Non hai seleziona la regione<br>";
			$("#regione").css({borderColor: "#F00"});
		}

		if(!cliente.provincia){
			response.result = false;
			response.message += "<i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i>  Non hai seleziona la provincia<br>";
			$("#provincia").css({borderColor: "#F00"});
		}

		if(!cliente.comune){
			response.result = false;
			response.message += "<i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i>  Non hai seleziona il comune<br>";
			$("#comune").css({borderColor: "#F00"});
		}



		/*
		if(!cliente.codice_fiscale && !cliente.partita_iva){
			response.result = false;
			response.message += "<i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i>  Non hai inserito la partita iva o il codice fiscale<br>";
			$("#partita_iva").css({borderColor: "#F00"});
			$("#codice_fiscale").css({borderColor: "#F00"});
		}


		if(cliente.codice_fiscale){
			var tmp = $.checkCodiceFiscaleCliente(cliente.codice_fiscale, cliente.id);
			if(!tmp.result){
				response.result = false;
				response.message += tmp.message;
				$("#codice_fiscale").css({borderColor: "#F00"});
			}
		}

		if(cliente.partita_iva){
			var tmp = jQuery.checkPartitaIva(cliente.partita_iva);
			if(!tmp.result){
				response.result = false;
				response.message += tmp.message;
				$("#partita_iva").css({borderColor: "#F00"});
			}
		}
		*/


		if(!cliente.email){
			response.result = false;
			response.message += "<i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i>  Non hai inserito l'email del cliente<br>";
			$("#email").css({borderColor: "#F00"});
		}else if(cliente.email){
			var tmp = $.email(cliente.email);
			if(!tmp.result){
				response.result = false;
				response.message += tmp.message;
				$("#email").css({borderColor: "#F00"});
			}
		}

		/*
		if(cliente.email_capo_area){
			var tmp = $.email(cliente.email);
			if(!tmp.result){
				response.result = false;
				response.message += tmp.message+" del capo area";
				$("#email_capo_area").css({borderColor: "#F00"});
			}
		}
		*/

		if(cliente.email_capo_area){
			if(!tmp.result){
				response.result = false;
				response.message += tmp.message+" del capo area";
				$("#email_capo_area").css({borderColor: "#F00"});
			}
		}

		if(!cliente.attivita_cliente){
			response.result = false;
			response.message += "<i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i>  Non hai inserito l'attività del cliente<br>";
			$("#attivita_cliente").css({borderColor: "#F00"});
		}

		if(!cliente.sconto_richiesto){
			response.result = false;
			response.message += "<i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i>  Non hai inserito lo sconto richiesto<br>";
			$("#sconto_richiesto").css({borderColor: "#F00"});
		}

		if(response.result == 0){
			$("#errori_compilazione_cliente").html("<div class='alert alert-danger'>Sono stati commessi i seguenti errori di compilazione<br><br>"+response.message+"</div><br>");
			_this.content.loader.remove();
			return;
		}
		
		var control = false;
		function checkCliente(dato){
			
			$.Log("CLIENTETEETTEETTE CHECK");
			$.Log(dato);
			
			if(!dato.success){
			  alert(dato.errorMessage);
			  return;
		  	}
			
			if(dato.results.length>0){
				var h = "<div class='alert alert-danger'>Alcuni dati inseriti corrispondono già ai dati del cliente <b>"+dato.results[0].ragione_sociale+"</b>";
				if(dato.results[0].nome && dato.results[0].cognome){
				 	h += " assegnato all'agente <b>"+dato.results[0].nome+" "+dato.results[0].cognome+"</b>. Impossibile completare la procedura";
				}
			  h += "</div><br>";
			  $("#errori_compilazione_cliente").html(h);
			  control = true;
			  return;
		  	}
		}
		
		jQuery.postJSON("Clienti","checkCliente", "private", {"cliente":cliente}, false, checkCliente);

		if(control){
			_this.content.loader.remove();
			return;
		}

		return response.result;

	}


	_this.cancellaSelezionati = function(){
		var result = confirm("Sei sicuro di voler eliminare le voci selezionate della rubrica?");
		if(result){
			_this.content.loader.init(function(){

				var clienti = [];

				jQuery(".checkbox_rubrica").each(function(){
					if(jQuery(this).is(":checked")){
						clienti.push($(this).data("data"));
					}
				});

				 function callBackRubrica(dato){

					  if(!dato.success){
						  alert(dato.errorMessage);
						  return;
					  }

				  }

				  jQuery.postJSON("Clienti","removeFromRubrica", "private", {"clienti":clienti}, false, callBackRubrica);
				  _this.content.loadSezione("Clienti", $("#Clienti"));
			});
		}else _this.content.loader.remove();
	}

	_this.initRubrica = function() {

		var param = {
			"account":	jQuery.getCookie("utente").email,
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

		var rubrica = [];
		function callBackClienti(dato){

			$.Log("CLIENTEEEE");
			$.Log(dato);

			if(!dato.success){
				alert("Errore caricamento rubrica!");
				return;
			}

			$("#Rows_rubrica").empty();
			$("#pagul").empty();
			$("#loading_rubrica").html("");
			$("#num_results").html("");

			rubrica = dato.results;
			_this.content.loader.remove();

			if(rubrica.length <= 0 && _this.keyword == ""){
				$("#Body").removeClass("hidden");
				_this.elem.html("<h4 align='center'>La rubrica è vuota</h4>");
				return;
			} else if(rubrica.length <= 0){
					$("#Body").removeClass("hidden");
					$("#Rows_rubrica").html("<h4 align='center'>La ricerca non ha portato alcun risultato</h4>");
					return;
			} else {
				$("#Body").removeClass("hidden");
				//Qui calcolo il numero delle pagine da generare
				var tmp = Math.trunc(rubrica[0].tot_rows / param.toLimit);
				var tmp2 = Math.trunc(rubrica[0].tot_rows % param.toLimit);
				if(tmp2 == 0) {
					var numPag = tmp;
				} else {
					var numPag = tmp + 1;
				}
			}


			// inserisco il numero di prevntivi trovati
			$("#num_results").html("Trovati "+rubrica[0].tot_rows+" clienti in rubrica");

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
							<div class=\"col-md-2\"><div class=\"header\">Ragione sociale</div></div>\
							<div class=\"col-md-1\"><div class=\"header\">Telefono</div></div>\
							<div class=\"col-md-1\"><div class=\"header\">Cellulare</div></div>\
							<div class=\"col-md-2\"><div class=\"header\">Inserito da</div></div>\
							<div class=\"col-md-2\"><div class=\"header\">Agente</div></div>\
							<div class=\"col-md-2\"><div class=\"header\">Azioni</div></div>\
						</div>";

			_this.elem.find("#Rows_rubrica").append(header);

			_this.numElementRubrica = rubrica.length;

				for(var i = 0;i < rubrica.length;i++){

					$.Log("Ecco la rubrica");
					$.Log(rubrica[i]);

					var d = rubrica[i];
					var tmpColor = i%2;


					var tmp = '<div class="row margin-0 odd_'+tmpColor+'">\
						<div class="col-md-1">\
							<div class="cell" style="margin-top: 7px;">\
									<div class="checkbox checkbox-primary form-check-input">\
										<input id="_'+i+'" class="checkbox_rubrica azioni" type="checkbox">\
										<label for="_'+i+'"><span class="data-label" style="white-space:pre;" data-name="Seleziona questo Cliente"></span></label>\
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
									<div class="propertyname"><span class="data-label" data-name="Cliente: "></span>'+d.ragione_sociale+'</div>\
								</div>\
						</div>\
						<div class="col-md-1">\
							<div class="cell">\
								<div class="propertyname"><span class="data-label" data-name="Telefono: "></span>'+(d.prefisso_telefono?d.prefisso_telefono:"")+' '+(d.telefono?d.telefono:"")+'</div>\
							</div>\
						</div>\
						<div class="col-md-1">\
								<div class="cell">\
									<div class="propertyname"><span class="data-label" data-name="Cellulare: "></span>'+(d.prefisso_cellulare?d.prefisso_cellulare:"")+' '+(d.cellulare?d.cellulare:"")+'</div>\
								</div>\
						</div>\
						<div class="col-md-2">\
								<div class="cell">\
									<div class="propertyname"><span class="data-label" data-name="Inserito da: "></span>'+(d.nome_inserito_da && d.cognome_inserito_da?d.nome_inserito_da+' '+d.cognome_inserito_da:"")+'</div>\
								</div>\
						</div>\
						<div class="col-md-2">\
								<div class="cell">\
									<div class="propertyname"><span class="data-label" data-name="Agente: "></span>'+(d.cognome_agente?d.nome_agente+' '+d.cognome_agente:"")+'</div>\
								</div>\
						</div>\
						<div class="col-md-2">\
		                            <div class="cell" style=\'margin-top: 5px;\'>\
		                                	<select title="Scegli l\'azione..." class="selectpicker azioni" data-style="btn-info">\
		    							  	<option value="modifica">Modifica i dettagli del cliente</option>\
		    							  	<option value="dettagli">Mostra i dettagli del cliente</option>\
										<option value="elimina">Elimina il cliente</option>\
		    							</select>\
		                            </div>\
		                	</div>';

						var obj = $.parseHTML(tmp);
						$(obj).data("data", d.id);
						$(obj).find(".azioni").data("data", d.id);
						$("#Rows_rubrica").append(obj);

						$(".grigio").addClass("background-header");
						$(".grigio").removeClass("grigio");
						$('.selectpicker').selectpicker();

						_this.initButtons();
				}

		}

		jQuery.postJSON("Clienti", "getClienti","private", param, true, callBackClienti);

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
