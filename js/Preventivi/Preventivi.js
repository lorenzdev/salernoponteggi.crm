var Preventivi = function(content){

	var _this = this;
	_this.content = content;
	_this.elem;
	_this.CostiExtra;
	_this.preventivo;
	_this.macroFamiglie = {
		"ST":0,
		"RF":0,
		"SRF":0,
		"ST-co":0,
		"RF-co":0,
		"SRF-co":0,
		"ST-mo":0,
		"RF-mo":0,
		"SRF-mo":0,
		"ST-co-mo":0,
		"RF-co-mo":0,
		"SRF-co-mo":0,
		"ST30":0,
		"ST60":0,
		"ST90":0,
		"RF30":0,
		"RF60":0,
		"RF90":0,
		"SRF30":0,
		"SRF60":0,
		"SRF90":0
	}

	_this.keyword = "";
	_this.resultsForPage = 10;
	_this.fromLimit = 0;
	_this.toLimit = 10;
	_this.pageActive = 1;

	_this.init = function(elem){

		_this.initStyle();

		_this.elem = elem;
		_this.elem.html("<script language=\"javascript\" src=\"js/Preventivi/CostiExtra.js\" type=\"text/javascript\"></script>");

		_this.CostiExtra = new CostiExtra();
		var utente = jQuery.getCookie("utente");

		var PATH = P_PREVENTIVI_UTENTE;
		/*if(utente.ruolo == "ROLE_ADMIN"){
			PATH = P_TABELLA_PREVENTIVI_ADMIN;
		}
		*/

		_this.elem.html("");

		jQuery.get(P_PREVENTIVI_UTENTE, function(tabella){
			_this.elem.html(tabella);
			_this.initPreventivi();
			_this.initButtons();
		});
	}


	_this.isChecked = function(){
		var boo = true;
				jQuery(".checkbox_preventivi").each(function(){
					if(jQuery(this).is(":checked")){
						boo = false;
					}
				});

		return boo;
	}

	_this.cancellaPreventivi = function(preventivi){

		function callBackPreventivi(dato){
			if(!dato.success){
				alert("Errori di cancellazione dei preventivi");
				return;
			}
		}

		jQuery.postJSON("Preventivi","removePreventivi","private", {"preventivi":preventivi}, false, callBackPreventivi);
	}


	_this.ripristinaCarrello = function(data){

		function callBackRipristino(dato){
			//$.Log("Il prodotto che ho ripristinato!");
			//$.Log(dato);
			if(!dato.success){
				alert(dato.errorMessage);
				_this.content.loader.remove();
				return;
			}

			_this.content.aggiornaCarrello();
			jQuery(".Carrello").trigger("click");


		}


		jQuery.postJSON("Preventivi","ripristinaCarrello","private", {"data":data,"autore":jQuery.getCookie("utente").email}, false, callBackRipristino);

	}

	_this.viewDettagliPreventivi = function(data){

		_this.elem.html("");
		var totalePreventivo = 0;
		var articoli_in_carrello = [];

			function callBackPreventivo(preventivo){

				$.Log("Preventivo!");
				$.Log(preventivo);
				
				_this.preventivo = preventivo.results;

				if(_this.preventivo.length <= 0){
					alert("Nessun preventivo trovato!");
					return;
				}



				var dettaglio = "";
				if(jQuery.validaValore(_this.preventivo.codice)){
					dettaglio = "Numero preventivo: <b>"+_this.preventivo.codice + "</b><br>";
				}

				dettaglio += "Data inserimento: <b>" + _this.preventivo.full_data+"</b><br>";
				dettaglio += "Creato da: <b>" + _this.preventivo.nome_compilatore+" "+_this.preventivo.cognome_compilatore+"</b><br>";
				dettaglio += "Numero articoli scelti: <b>" + _this.preventivo.carrello.length+"</b>";
				dettaglio += "<br><span id=\"container_articoli_preventivo\"></span><br><br><button type=\"button\" data-loading=\"<i class='fa fa-spinner fa-spin' aria-hidden='true'></i>\" id=\"mostra_articoli\" class=\"action btn btn-primary\"><span id=\"messaggio_mostra_articoli\">Mostra</span> articoli preventivo</button><br><br>";

				dettaglio += "<hr>";



				//INIZIO FOR CARRELLO
				for(var i = 0;i < _this.preventivo.carrello.length;i++){

					//$.Log("Guarda quqa!");
					//$.Log(JSON.parse(_this.preventivo.carrello[i].descrizione));

					var descrizione = _this.preventivo.carrello[i].descrizione;
					_this.elem.append("<script language=\"javascript\" src=\"js/Prodotti/"+descrizione.articolo.tipologia+".js\" type=\"text/javascript\"></script>");

					var obj = eval("new "+descrizione.articolo.tipologia+"()");
						obj.selezione = descrizione;
						articoli_in_carrello.push(obj);
					$("html,body").scrollTop(0);

					//dettaglio += obj.viewRiepilogo();

					_this.CostiExtra.init(descrizione);

					/*
					function callBackGetImage(datoImage){

						//$.Log("IMMAGINI");
						//$.Log(datoImage);
						dettaglio += "<div style='width:100%;float:left;clear: both;'>"
						for(var i = 0;i < datoImage.results.length;i++){
							dettaglio += "<img src=\""+datoImage.results[i]+"\" border=\"0\" style='max-width:400px;max-width:400px;float:left;'/><br>";
						}
						dettaglio += "</div><br>";
					}
					jQuery.postJSON("GestioneImmagini", "getImageCarrello","private", {"carrello":descrizione.id}, false, callBackGetImage);
					*/

				}//FINE FOR CARRELLO



				var totalePreventivoIvato = _this.preventivo.totale;
				var totaleIva = _this.preventivo.totaleIva;
				var totaleScontato = _this.preventivo.totaleScontato;

				console.log("PREVENTIVO!");
				console.log(_this.preventivo);


				if(_this.preventivo.approvazione > 0){

					dettaglio += _this.CostiExtra.calcolaCostiExtra(_this.preventivo);
					dettaglio += "<br><br>Totale: <b>"+ Number(_this.preventivo.totale).format(false, 2)+" EUR</b>";
					dettaglio += "<br>Totale scontato e costi extra: <b><span class='totale_scontato'>"+ Number(totaleScontato).format(false, 2)+"</span> EUR</b><br>";
					dettaglio += "Totale iva: <b><span class='totale_iva'>"+ Number(totaleIva).format(false, 2)+"</span> EUR</b>";
					dettaglio += "<h3>Totale: <span style='white-space:no-wrap;'><b><span class='totale_preventivo'>"+ Number(totalePreventivoIvato).format(false, 2)+"</span> EUR</b></span></h3><hr><br><br>";
					dettaglio += "<div class='azioni_preventivo'>";
					dettaglio += "<center>";
					//dettaglio += "<button id='invia_pdf_preventivo' style='display:none;' data-loading=\"<i class='fa fa-spinner fa-spin' aria-hidden='true'></i>\">invia preventivo</button>&nbsp;&nbsp;";
					dettaglio += "<a download='' style='display:none;' id='dwnldLnk'></a>";
					dettaglio += "<button class='btn btn-primary view_pdf_preventivo' data-loading=\"<i class='fa fa-spinner fa-spin' aria-hidden='true'></i>\">Preview preventivo</button>&nbsp;&nbsp;";
					//dettaglio += "<button class='btn btn-primary view_pdf_modulo_rilievo' data-loading=\"<i class='fa fa-spinner fa-spin' aria-hidden='true'></i>\">Preview modulo rilievo</button>";
					//dettaglio += "<button id='stampa_riepilogo' class='btn btn-primary' data-loading=\"<i class='fa fa-spinner fa-spin' aria-hidden='true'></i>\">Stampa riepilogo</button>";
					dettaglio += "<br><span style='font-size:10px;'>Selezionare il cliente per poter attivare la funzione di preview del preventivo in pdf</span>";
					dettaglio += "</center>";
					dettaglio += "</div>";


					//dettaglio += "<input type='button' id='genera_pdf' value='invia preventivo'><br><br></div>";
				}else{

					alert("EHJ?");
					//$.Log("UTENTE");
					//$.Log(jQuery.getCookie("utente"));

					if(jQuery.getCookie("utente").ruolo != "ROLE_ADMIN")
					dettaglio += "<input type='button' id='stampa_riepilogo' class='btn btn-primary'>stampa riepilogo</button><br><br>";
				}

				//$.Log(_this.macroFamiglie);

				_this.elem.html("<button class='btn btn-primary indietro'>Torna ai preventivi</button>");
				_this.elem.append("<h3>Dettagli preventivo</h3><hr>");
				_this.elem.append(dettaglio+"<br>");


				$("#mostra_articoli").off().on("click", function(){
					var aperto = $(this).attr("aperto");
					if(aperto == "1"){
						$(this).attr("aperto","0");
						$("#container_articoli_preventivo").html("");
						$("#messaggio_mostra_articoli").html("Mostra");
					}else{
						$(this).attr("aperto","1");

						var str = "";
						for(var i=0;i < articoli_in_carrello.length;i++){
							str += articoli_in_carrello[i].viewRiepilogo(articoli_in_carrello[i].selezione)
						}

						$("#container_articoli_preventivo").html(str);
						$("#messaggio_mostra_articoli").html("Nascondi");
					}
				});


				$(".action").data("preventivo", _this.preventivo.data);

				_this.elem.find(".containerBoxRepeat").remove();
				_this.elem.find(".sconto").prop("disabled",true);
				_this.elem.find(".quantitaProdotto").prop("disabled",true);
				_this.elem.find(".sconto").css({background:"#ececec"});
				_this.elem.find(".quantitaProdotto").css({background:"#ececec"});


				//POPOLO LE REGIONI
				$.popolaRegioni($(".regione"));

				jQuery(".indietro").bind("click", function(){
					jQuery(".GestionePreventivi").trigger("click");
				});

				jQuery("#stampa_riepilogo").bind("click",function(){
					window.print();
					//jQuery.jPrintArea('#Container');
				});

				jQuery("#invio_preventivo_per_approvazione").off().on("click",function(){
					_this.content.loader.init(function(){_this.invioPerApprovazione(preventivo)});
				});

				jQuery(".costi_trasporto, .costi_montaggio").keypress(function(e){
					return jQuery.onlydecimals(e);
				});

				jQuery("#iva, #sconto").keypress(function(e){
					return jQuery.onlynumbers(e);
				});


				$("#data_consegna").val(_this.preventivo.data_consegna);
				$("#numero_settimana").val(_this.preventivo.numero_settimana);


				jQuery("#checkCostiTrasporto").off().on("click",function(){

					_this.CostiExtra.getCostiAggiuntivi();
					_this.aggiornaTotalePreventivo();

					if(jQuery(this).is(":checked")){
						jQuery("#boxCostiTrasporto").css({display:"none"});
					}else{
						jQuery("#boxCostiTrasporto").css({display:"block"});
					}
				});

				jQuery("#checkCostiDistribuzione").off().on("click",function(){

					_this.CostiExtra.getCostiAggiuntivi();
					_this.aggiornaTotalePreventivo();

					if(jQuery(this).is(":checked")){
						jQuery("#boxCostiDistribuzione").css({display:"none"});
					}else{
						jQuery("#boxCostiDistribuzione").css({display:"block"});
					}
				});

				jQuery("#checkCostiMontaggio").off().on("click",function(){

					_this.CostiExtra.getCostiAggiuntivi();
					_this.aggiornaTotalePreventivo();

					if(jQuery(this).is(":checked")){
						jQuery("#boxCostiMontaggio").css({display:"none"});
					}else{
						jQuery("#boxCostiMontaggio").css({display:"block"});
					}
				});

				jQuery("#aggiungi_rubrica").off().on("click",function(){
					//_this.content.active($(".Clienti"));
					$(".Clienti").trigger("click");
				});


                $("#select_rubrica").off().on("change",function(){

					var elem = jQuery(this);

                    if(elem.val() == ""){
                        $(".view_pdf_preventivo").removeClass("btn-primary");
                        $(".view_pdf_preventivo").addClass("btn-secondary");
                        $(".view_pdf_preventivo").prop("disabled", true);
						$(".view_pdf_modulo_rilievo").removeClass("btn-primary");
                        $(".view_pdf_modulo_rilievo").addClass("btn-secondary");
                        $(".view_pdf_modulo_rilievo").prop("disabled", true);
                    }else{
                        $(".view_pdf_preventivo").addClass("btn-primary");
                        $(".view_pdf_preventivo").removeClass("btn-secondary");
                        $(".view_pdf_preventivo").prop("disabled", false);
						$(".view_pdf_modulo_rilievo").addClass("btn-primary");
                        $(".view_pdf_modulo_rilievo").removeClass("btn-secondary");
                        $(".view_pdf_modulo_rilievo").prop("disabled", false);
                    }

					
					
					setTimeout(function(){
						var tmp = jQuery("#select_rubrica option:selected").val();

						_this.getClienteDaRubrica(tmp);

						$("#invia_pdf_preventivo").css({display:"none"});

						if(elem.val() != "null"){

							$("#invia_pdf_preventivo").css({display:"inline-block"});

							jQuery("#invia_pdf_preventivo").off().on("click",function(){
								_this.content.loader.init(function(){_this.inviaPreventivo(_this.preventivo);});
							});
						}
					}, 20);
					

				});

				function callBackRubrica(datoRubrica){

					$.Log("DATI CLIENTE");
					$.Log(datoRubrica);
	
					if(!datoRubrica.success){
						alert("Errore rubrica!");
						return;
					}

					for(var i = 0;i < datoRubrica.results.length;i++){
						var selected = "";

						if(_this.preventivo.cliente){
							if(datoRubrica.results[i].id == _this.preventivo.cliente.id_cliente)
								selected = "selected";
						}

						var rubricaEmail = "<option "+selected+" value='"+datoRubrica.results[i].id+"'>"+datoRubrica.results[i].ragione_sociale+"</option>";
						jQuery("#select_rubrica").append(rubricaEmail);
					}


                    $("#select_rubrica").trigger("change");

					_this.content.loader.remove();
				}

				jQuery.postJSON("Clienti", "getClienti", "private", {}, true, callBackRubrica);


				if(_this.preventivo.invio_solo_agente_capo_area){
					$("#invio_solo_agente_capo_area").prop("checked", true);
				}

				$("#indirizzo").val(_this.preventivo.cantiere.indirizzo_cantiere);
				$("#cap").val(_this.preventivo.cantiere.cap_cantiere);
				$("#civico").val(_this.preventivo.cantiere.civico_cantiere);
				$("#citta").val(_this.preventivo.cantiere.citta_cantiere);
				$("#referente").val(_this.preventivo.cantiere.referente_cantiere);
				$("#cellulare_referente").val(_this.preventivo.cantiere.cellulare_referente_cantiere);
				$("#email_referente").val(_this.preventivo.cantiere.email_referente_cantiere);

				$.popolaRegioni($("#regione"), _this.preventivo.cantiere.id_regione_cantiere);
				$.popolaProvince($("#provincia"), _this.preventivo.cantiere.id_regione_cantiere, _this.preventivo.cantiere.id_provincia_cantiere);
				$.popolaComuni($("#comune"), _this.preventivo.cantiere.id_provincia_cantiere, _this.preventivo.cantiere.id_comune_cantiere);



                jQuery("#stampa_riepilogo").off().on("click",function(){
						window.print();
					});

				jQuery(".view_pdf_preventivo").off().on("click",function(){
					_this.content.loader.init(function(){_this.previewPreventivo(preventivo)});
				});

				jQuery(".view_pdf_modulo_rilievo").off().on("click",function(){
					_this.content.loader.init(function(){_this.previewModuloRilievo(preventivo)});
				});

				//jQuery("#select_rubrica").trigger("change");


				if(!_this.preventivo.costo_trasporto){
					$("#checkCostiTrasporto").trigger("click");
				}

				if(!_this.preventivo.costo_distribuzione){
					$("#checkCostiDistribuzione").trigger("click");
				}

				if(!_this.preventivo.costo_montaggio){
					$("#checkCostiMontaggio").trigger("click");
				}

				_this.CostiExtra.getCostiAggiuntivi();
				_this.aggiornaTotalePreventivo();




			}

			jQuery.postJSON("Preventivi","getPreventivo","private", {"data":data}, false, callBackPreventivo);


			_this.initButtons();


			$("#anno_settimana option").each(function(){
				if(_this.preventivo.anno_settimana == $(this).val()){
					$(this).prop("selected", true);
				}
			});

			$("#anno_settimana").trigger("change");

			_this.content.loader.remove();
	}


	_this.salvaClientePreventivo = function(preventivo){

		if($("#select_rubrica").val() == ""){
			alert("Non hai specificato alcuna voce dalla rubrica");
			return;
		}

		var loading = $("#salva_cliente_preventivo").attr("data-loading");
		$("#salva_cliente_preventivo").html(loading+" In corso");

		var json = {
			"preventivo": preventivo,
			"cliente": $("#select_rubrica").val(),
			"invio_solo_agente_capo_area": ($("#invio_solo_agente_capo_area").is(":checked")?1:0)
		};

		function callBack(dato){

			if(!dato.success){
				//alert(dato.message);
				return;
			}

			$("#salva_cliente_preventivo").html("<i class='fa fa-check'></i> Salvato");

		}

		setTimeout(function(){
			jQuery.postJSON("Preventivi","salvaClientePreventivo","private", json, true, callBack);
		}, 20);
	}


	_this.salvaCostiPreventivo = function(preventivo){
		$.Log("AAAAAAAAAAAAAAAAAAAAAAAAAAA");
		$.Log(_this.preventivo);
		/*var email = jQuery("#select_rubrica option:selected").val();
			if(email == undefined || email == "null"){
				alert("Non hai seleziona nessuna voce dall'elenco rubrica");
				return;
			}
		*/

		var loading = $("#salva_opzioni").attr("data-loading");
		$("#salva_opzioni").html(loading+" In corso");

		var servizi = _this.CostiExtra.getCostiAggiuntivi();

		$.Log("SERVIZI");
		$.Log(servizi);

		_this.preventivo.numero_settimana = servizi.numero_settimana;
		_this.preventivo.anno_settimana = servizi.anno_settimana;
		_this.preventivo.vettore = servizi.vettore;
		_this.preventivo.nota = servizi.nota;

		var json = {
			"preventivo": _this.preventivo,
			"totaleCostiTrasporto": servizi.totaleCostiTrasporto,
			"totaleCostiMontaggio": servizi.totaleCostiMontaggio,
			"numero_settimana": servizi.numero_settimana,
			"anno_settimana": servizi.anno_settimana,
			"data_consegna": servizi.data_consegna,
		};

		if(Object.keys(servizi.trasporto).length > 0) json.costi_trasporto = JSON.stringify(servizi.trasporto);
		if(Object.keys(servizi.montaggio).length > 0) json.costi_montaggio = JSON.stringify(servizi.montaggio);

        $.Log("Ecco qua");
        $.Log(json);

		function callBack(dato){

			$.Log(dato);

			if(!dato.success){
				alert(dato.message);
				return;
			}

			$("#salva_opzioni").html("<i class='fa fa-check'></i> Salvato");

		}


		setTimeout(function(){
			jQuery.postJSON("Preventivi","salvaCostiPreventivo","private", json, true, callBack);
		},10);
	}


	_this.salvaCantierePreventivo = function(preventivo){

		var loading = $("#salva_cantiere_preventivo").attr("data-loading");
		$("#salva_cantiere_preventivo").html(loading+" In corso");


		var json = {
			"preventivo": preventivo,
			"indirizzo_cantiere": $("#indirizzo").val(),
			"referente_cantiere": $("#referente").val(),
			"cellulare_referente_cantiere": $("#cellulare_referente").val(),
			"email_referente_cantiere": $("#email_referente").val(),
			"civico_cantiere": $("#civico").val(),
			"cap_cantiere": $("#cap").val(),
			"regione_cantiere": $("#regione").val(),
			"provincia_cantiere": $("#provincia").val(),
			"provincia_sigla_cantiere": $("#provincia option:selected").attr("sigla"),
			"comune_cantiere": $("#comune").text(),
			"id_comune_cantiere": $("#comune").val(),
			"citta_cantiere": $("#citta").val()
		};



		function callBack(dato){

			$.Log(dato);

			if(!dato.success){
				alert(dato.message);
				return;
			}

			$("#salva_cantiere_preventivo").html("<i class='fa fa-check'></i> Salvato");

		}


			setTimeout(function(){
				jQuery.postJSON("Preventivi","salvaCantierePreventivo","private", json, true, callBack);
			},10);
	}

	_this.inviaPreventivo = function(preventivo,referente){
		////$.Log(preventivo);
		/*var email = jQuery("#select_rubrica option:selected").val();
			if(email == undefined || email == "null"){
				alert("Non hai seleziona nessuna voce dall'elenco rubrica");
				return;
			}
		*/

		_this.preventivo["servizi"] = {};
		_this.preventivo.servizi = _this.CostiExtra.getCostiAggiuntivi();


		function callBack(dato){
			//$.Log(dato);

			if(!dato.success){
				alert(dato.message);
				return;
			}

			//var datauri = 'data:application/pdf;base64,' + dato.documento;
			//var attributes = "width=1024,height=768,resizable=yes,scrollbars=yes,toolbar=no,location=no,directories=no,status=no,menubar=no,copyhistory=no";
    		//var win = window.open("", "Preview Preventivo", attributes);
    		//win.document.location.href = datauri;
			_this.content.loader.remove();
			_this.elem.html("<h3>Preventivo inviato correttamente!</h3>");
		}



		jQuery.postJSON("FunctionPreventivi","inviaPreventivo","private", {"preventivo":JSON.stringify(preventivo),"referente":JSON.stringify(referente)}, false, callBack);

	}


	_this.aggiornaTotalePreventivo = function(){


		var sconto = $("#sconto").val();
		var iva = $("#iva").val();

		if(!sconto) sconto = 0; else iva = Number(iva);
		if(!iva) iva = 0; else sconto = Number(sconto);

		_this.preventivo.iva = iva;
		_this.preventivo.sconto = sconto;

		$.Log("DOPO");
		$.Log(_this.preventivo);

		var netto_a_pagare = Number(_this.preventivo.totale);
			netto_a_pagare -= (netto_a_pagare*sconto)/100;
		var netto_a_pagare_scontata = netto_a_pagare;

			netto_a_pagare += Number(_this.CostiExtra.totale_costi_trasporto);
			netto_a_pagare += Number(_this.CostiExtra.totale_costi_montaggio);

		var totale_scontato = Number(netto_a_pagare);
			netto_a_pagare += (netto_a_pagare*iva)/100;

		var totale_iva_esclusa = Number(_this.preventivo.totale);
			totale_iva_esclusa -= (totale_iva_esclusa*sconto)/100;
			totale_iva_esclusa += Number(_this.CostiExtra.totale_costi_trasporto);
			totale_iva_esclusa += Number(_this.CostiExtra.totale_costi_montaggio);


			//totale_scontato -= (totale_scontato*sconto)/100;

		var totale_iva = Number(totale_scontato);
			totale_iva = (totale_iva*iva)/100;


		_this.preventivo.totaleCostiTrasporto = _this.CostiExtra.totale_costi_trasporto;
		_this.preventivo.totaleCostiMontaggio = _this.CostiExtra.totale_costi_montaggio;

		_this.preventivo.totaleScontato = totale_scontato;
		_this.preventivo.totaleSenzaIva = totale_iva_esclusa;
		_this.preventivo.totaleIva = totale_iva;
		_this.preventivo.nettoAPagare = netto_a_pagare;

		$(".totale_scontato").html(totale_scontato.format(false,2));
		$(".totale_iva").html(totale_iva.format(false,2));
		$(".totale_preventivo").html(netto_a_pagare.format(false,2));


	}


	_this.initButtons = function(){

		/*
		jQuery(".view_pdf_preventivo").off().on("click",function(){
			var data = $(this).data("data");
			var preventivo;

			function callBackPreventivo(dato){

				$.Log("PREVENTIVO");
				$.Log(dato);

				preventivo = dato.results;

				_this.content.loader.init(function(){_this.previewPreventivo(preventivo)});
			}

			jQuery.postJSON("Preventivi","getPreventivo","private", {"data":data}, true, callBackPreventivo);

		});
		*/

		_this.content.resize();

		$(".resforpage").off().on("change", function(e){
			e.stopPropagation();
			e.preventDefault();
			_this.resultsForPage = Number($(this).val());
			$('.resforpage .filter-option-inner-inner').text(_this.resultsForPage);

			setTimeout(function(){
				_this.initPreventivi();
			}, 50);
		});

		$(".page-link").off().on("click", function() {
			if(!$(this).hasClass("disabled")) {
				_this.fromLimit = Number($(this).attr("fromLimit"));
				_this.toLimit = Number($(this).attr("toLimit"));
				_this.pageActive = Number($(this).text());

				setTimeout(function(){
					_this.initPreventivi();
				}, 50);
			}
		});

		$("#btn_search").off().on("click", function() {
			_this.keyword = $("#field_search").val();
			$("#loading_preventivi").html("<div class=\"label label-success\"><i class=\"fa fa-spinner fa-spin\"></i> Sto cercando...</div>");

			// disabilito i tasti cancella preventivi e salva preventivo (ad ogni ricerca)
			$("#cancella_selezionati").prop("disabled",true);
			$("#salva_preventivo").prop("disabled",true);

			_this.fromLimit = 0;
			_this.toLimit = Number($(".resforpage option:selected").val());
			_this.pageActive = 1;

			setTimeout(function(){
				_this.initPreventivi();
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

		$(".azioni").off().on("change", function(e){
			e.stopPropagation();
			e.preventDefault();

			var id = jQuery(this).data("data");
			switch($(this).val()){
				case "ripristina":
					var data = jQuery(this).data("data");
					_this.content.loader.init(function(){
						_this.ripristinaCarrello(data);
					});
					break;
				case "mostra":
					var data = jQuery(this).data("data");
   			  		_this.content.loader.init(function(){
						_this.viewDettagliPreventivi(data);
					});
					break;
				case "elimina":
					var result = confirm("Sei sicuro di voler eliminare il preventivo selezionato?");
   			  		var elemThis = jQuery(this);
   			  		var data = jQuery(this).data("data");

   			  		if(result){
   				  		var preventivi = [];
   					  	preventivi.push(data);
   				  		_this.content.loader.init(function(){
	   					  	var classe = elemThis.attr("elem");
	   					  	jQuery("."+classe).remove();
	   					  	_this.cancellaPreventivi(preventivi);
	   					  	_this.content.loadSezione("Preventivi", $("#GestionePreventivi"));
   				  		});
   			  		}
					break;
				default: break;
			}

		});

		$('.tip-twitter').remove();
		$('.title').poshytip({
			className: 'tip-twitter',
			showTimeout: 1,
			alignTo: 'target',
			alignX: 'center',
			offsetY: 5,
			allowTipHover: false,
			fade: false,
			slide: false
		});


		$(".costi_trasporto, .costi_montaggio").off().on("keyup", function(e){

			_this.CostiExtra.getCostiAggiuntivi();
			_this.aggiornaTotalePreventivo();
		});


		$("#iva, #sconto").off().on("keyup", function(e){
			_this.aggiornaTotalePreventivo();
		});


		$("#numero_settimana").off();

		$("#numero_settimana").on("keypress", function(e){
			jQuery.onlynumbers(e);
		});

		$("#numero_settimana").on("keyup", function(e){
			_this.CostiExtra.numero_settimana = $(this).val();
			$.Log(_this.CostiExtra);
			$.Log(_this.CostiExtra);
		});


		$("#anno_settimana").off().on("change", function(e){
			_this.CostiExtra.anno_settimana = $(this).val();
			$.Log(_this.CostiExtra);
			$.Log(_this.CostiExtra);
		});

		/*
		$("#data_consegna").datepicker({
			onSelect: function(){
				_this.CostiExtra.data_consegna = $(this).val();
			}
		});
		*/

		$("#salva_opzioni").off().on("click", function(e){
			_this.salvaCostiPreventivo($(this).data("preventivo"));
		});

		$("#salva_cliente_preventivo").off().on("click", function(e){
			_this.salvaClientePreventivo($(this).data("preventivo"));
		});

		$("#salva_cantiere_preventivo").off().on("click", function(e){
			_this.salvaCantierePreventivo($(this).data("preventivo"));
		});


		$(".cantiere").off().on("keypress change", function(){
			_this.aggiornaCantiere();
		});

		$(".comune").off().on("change", function(){
			_this.aggiornaCantiere();
		});


		$(".regione").off().on("change", function(){
			var regione = $(this).val();
			$.popolaProvince($(".provincia"),regione);
			$(".provincia").prop("disabled", false);
			_this.aggiornaCantiere();

		});

		$(".provincia").off().on("change", function(){
			var provincia = $(this).val();
			$.popolaComuni($(".comune"),provincia);
			$(".comune").prop("disabled", false);
			_this.aggiornaCantiere();
		});


		$("#seleziona_tutti").off().on("click",function(){
			  var stato = jQuery("#seleziona_tutti").attr("stato");
			  if(stato == "1"){
				  jQuery("#seleziona_tutti").attr("stato",0);
				  jQuery("#seleziona_tutti").html("Deseleziona tutti");
				  jQuery("#cancella_selezionati").prop("disabled",false);
				  jQuery(".checkbox_preventivi").each(function(){
					  jQuery(this).prop("checked",true);
				  });
			  }else{
				  jQuery("#seleziona_tutti").attr("stato",1);
				  jQuery("#seleziona_tutti").html("Seleziona tutti");
				  jQuery("#cancella_selezionati").prop("disabled",true);
				  jQuery(".checkbox_preventivi").each(function(){
					  jQuery(this).prop("checked",false);
				  });
			  }
		  });


		$("#cancella_selezionati").off().on("click",function(){
			  _this.cancellaSelezionati();
		  });


		  $(".checkbox_preventivi").off().on("click",function(){
			  $("#cancella_selezionati").prop("disabled",_this.isChecked())
		  });


		$(".dettagli").off().on("click",function(){
			  var data = jQuery(this).data("data");
			  _this.content.loader.init(function(){_this.viewDettagliPreventivi(data);});
		  });

		 $(".elimina").off().on("click",function(){
			  var result = confirm("Sei sicuro di voler eliminare il preventivo selezionato?");
			  var elemThis = jQuery(this);
			  var data = jQuery(this).data("data");

			  if(result){

				  var preventivi = [];
					  preventivi.push(data);

				  _this.content.loader.init(function(){
					  var classe = elemThis.attr("elem");
					  jQuery("."+classe).remove();
					  _this.cancellaPreventivi(preventivi);
					  _this.content.loadSezione("Preventivi", $("#GestionePreventivi"));
				  });

			  }

		  });


		  $(".ripristina").off().on("click",function(){
			var data = jQuery(this).data("data");
			_this.content.loader.init(function(){
				_this.ripristinaCarrello(data);
			});
		});

	}

	_this.aggiornaCantiere = function(){
		_this.preventivo.cantiere.indirizzo_cantiere = $("#indirizzo").val();
		_this.preventivo.cantiere.referente_cantiere = $("#referente").val();
		_this.preventivo.cantiere.cellulare_referente_cantiere = $("#cellulare_referente").val();
		_this.preventivo.cantiere.email_referente_cantiere = $("#email_referente").val();
		_this.preventivo.cantiere.civico_cantiere = $("#civico").val();
		_this.preventivo.cantiere.cap_cantiere = $("#cap").val();
		_this.preventivo.cantiere.regione_cantiere = $("#regione").val();
		_this.preventivo.cantiere.provincia_cantiere = $("#provincia").val();
		_this.preventivo.cantiere.provincia_sigla_cantiere = $("#provincia option:selected").attr("sigla");
		_this.preventivo.cantiere.comune_cantiere = $("#comune option:selected").text();
		_this.preventivo.cantiere.id_comune_cantiere = $("#comune").val();
		_this.preventivo.cantiere.citta_cantiere = $("#citta").val();
	}

	_this.previewPreventivo = function(preventivo){


		_this.preventivo["servizi"] = {};
		_this.preventivo.servizi = _this.CostiExtra.getCostiAggiuntivi();


		$.Log("ECCO IL PREVENTIVO");
		$.Log(preventivo);

		function callBack(dato){

			//$.Log(dato);

			if(!dato.success){
				alert(dato.message);
				return;
			}

			_this.content.loader.remove();

				var datauri = 'data:application/pdf;base64,' + dato.preventivo;

				var dlnk = document.getElementById('dwnldLnk');
				dlnk.href = datauri;
				dlnk.download = preventivo.results.nome_file_preventivo_pdf;
				dlnk.click();


				/*
				var iframe = '<html>';
					iframe += '<head>';
					iframe += 	'<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">';
					iframe += 	'<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>';
					iframe += 	'<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>';
					iframe += '</head>';
					iframe += '<body style="margin:0px;overflow-x:hidden;overflow-y:hidden;background-color:#000;">';
					iframe += 	'<div style="position: absolute;top: 7px;left: 7px;">';
					iframe += 		'<a href="'+datauri+'" download="'+_this.preventivo.nome_file_pdf+'">';
					iframe += 			'<button type="button" class="btn btn-success">Scarica il documento in pdf</button>';
					iframe += 		'</a>';
					iframe += 	'</div>';
					iframe += 	'<object data="'+datauri+'" type="application/pdf" width="100%" height="100%">';
					iframe += 		'<iframe src="'+datauri+'" type="application/pdf" width="100%" height="100%" style="border: none;">This browser does not support PDFs. Please download the PDF to view it: <a href="'+datauri+'">Download PDF</a>';
					iframe += 		'</iframe>';
					iframe += 	'</object>';
					iframe += 	'</body>';
					iframe += 	'</html>';

					var x = window.open("");
					if(!x){

						$("#ERROR_LOG").html("<div class='alert alert-warning'><button type=\"button\" class=\"close close_my_alert\" data-dismiss=\"alert\" aria-hidden=\"true\">×</button><i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i> Attenzione! il tuo browser sta bloccando l'apertura dei popup! Abilitali cliccando l'icona a destra sulla barre degli indirizzi, dai il consenso per questo sito web e riprova</div>");

						$("#ERROR_LOG .close").off().on("click", function(){
							$(this).off();
							$("#ERROR_LOG").html("");
						});

						$("body").scrollTop(0);

					}else{
						x.document.open();
						x.document.write(iframe);
						x.document.close();
					}
				*/

		}


	jQuery.postJSON("FunctionPreventivi","generaPreviewPreventivoPdf","private", {"preventivo":_this.preventivo}, false, callBack);

	}


	_this.previewModuloRilievo = function(preventivo){


		_this.preventivo["servizi"] = {};
		_this.preventivo.servizi = _this.CostiExtra.getCostiAggiuntivi();


		$.Log("ECCO IL PREVENTIVO");
		$.Log(preventivo);

		function callBack(dato){

			//$.Log(dato);

			if(!dato.success){
				alert(dato.message);
				return;
			}

			_this.content.loader.remove();

				var datauri = 'data:application/pdf;base64,' + dato.modulo_rilievo;

				var dlnk = document.getElementById('dwnldLnk');
				dlnk.href = datauri;
				dlnk.download = preventivo.results.nome_file_modulo_rilievo_pdf;
				dlnk.click();


				/*
				var iframe = '<html>';
					iframe += '<head>';
					iframe += 	'<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">';
					iframe += 	'<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>';
					iframe += 	'<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>';
					iframe += '</head>';
					iframe += '<body style="margin:0px;overflow-x:hidden;overflow-y:hidden;background-color:#000;">';
					iframe += 	'<div style="position: absolute;top: 7px;left: 7px;">';
					iframe += 		'<a href="'+datauri+'" download="'+_this.preventivo.nome_file_pdf+'">';
					iframe += 			'<button type="button" class="btn btn-success">Scarica il documento in pdf</button>';
					iframe += 		'</a>';
					iframe += 	'</div>';
					iframe += 	'<object data="'+datauri+'" type="application/pdf" width="100%" height="100%">';
					iframe += 		'<iframe src="'+datauri+'" type="application/pdf" width="100%" height="100%" style="border: none;">This browser does not support PDFs. Please download the PDF to view it: <a href="'+datauri+'">Download PDF</a>';
					iframe += 		'</iframe>';
					iframe += 	'</object>';
					iframe += 	'</body>';
					iframe += 	'</html>';

					var x = window.open("");
					if(!x){

						$("#ERROR_LOG").html("<div class='alert alert-warning'><button type=\"button\" class=\"close close_my_alert\" data-dismiss=\"alert\" aria-hidden=\"true\">×</button><i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i> Attenzione! il tuo browser sta bloccando l'apertura dei popup! Abilitali cliccando l'icona a destra sulla barre degli indirizzi, dai il consenso per questo sito web e riprova</div>");

						$("#ERROR_LOG .close").off().on("click", function(){
							$(this).off();
							$("#ERROR_LOG").html("");
						});

						$("body").scrollTop(0);

					}else{
						x.document.open();
						x.document.write(iframe);
						x.document.close();
					}
				*/

		}


	jQuery.postJSON("FunctionPreventivi","generaPreviewModuloRilievoPdf","private", {"preventivo":_this.preventivo}, false, callBack);

	}

	_this.getClienteDaRubrica = function(cliente){
		var referente;
		function callBackRubrica(datoRubrica){

			$.Log("DATI CLIENTE");
					$.Log(datoRubrica);

			if(!datoRubrica.success){
				alert("Errore rubrica!");
				return;
			}

			if(datoRubrica.results.length > 0)
				_this.preventivo.cliente = datoRubrica.results[0];

		}
		jQuery.postJSON("Clienti", "getClienteDaRubrica", "private", {"cliente":cliente}, true, callBackRubrica);

	}


	_this.invioPerApprovazione = function(preventivo){

		//$.Log("Preventivo");
		//$.Log(preventivo);

		var dataIns = new Date(parseInt(_this.preventivo.data));

		var param = {
			"nome": _this.preventivo.nome,
			"cognome": _this.preventivo.cognome,
			"account":_this.preventivo.email,
			"data_inserimento": dataIns.getDate()+"/"+(dataIns.getMonth()+1)+"/"+dataIns.getFullYear(),
			"codice_preventivo": _this.preventivo.codice
		}

		//$.Log("OOOOO!!!");
		//$.Log(param);

		var result;
		function callBackApprovazione(datoApprovazione){
			if(!datoApprovazione.success){
				alert(datoApprovazione.messageError);
				return;
			}

			result = datoApprovazione.results;
			_this.content.loader.remove();
			_this.elem.html("<h3>Preventivo inviato correttamente in approvazione!</h3>");
		}
		jQuery.postJSON("FunctionPreventivi", "invioPreventivoPerApprovazione", "private", param, false, callBackApprovazione);
		return result;
	}

	_this.cancellaSelezionati = function(){
		var result = confirm("Sei sicuro di voler eliminare tutti i preventivi selezionati?");
		if(result){
			_this.content.loader.init(function(){
				var prodotti = [];
				var elem_da_eliminare = [];
				jQuery(".checkbox_preventivi").each(function(){
					if(jQuery(this).is(":checked")){
							var data = jQuery(this).data("data");
							prodotti.push(data);
					}
				});

				_this.cancellaPreventivi(prodotti);
				_this.content.loadSezione("Preventivi", $("#GestionePreventivi"));

			});
		}
	}

	_this.initPreventivi = function() {

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

		var preventivi = [];
		function callBackPreventivi(dato){

			$.Log("DATO");
			$.Log(dato);

			if(!dato.success){
				alert(dato.messageError);
				return;
			}

			$("#Rows_preventivi").empty();
			$("#pagul").empty();
			$("#loading_preventivi").html("");
			$("#num_results").html("");

			preventivi = dato.results;
			_this.content.loader.remove();


			if(preventivi.length <= 0 && _this.keyword == ""){
				$("#Body").removeClass("hidden");
				_this.elem.html("<h4 align='center'>La lista dei preventivi è vuota</h4>");
				return;
			} else if(preventivi.length <= 0){ // se il risultato della query è vuoto e la chiave di ricerca non è vuota significa ci sono articoli nel carrello ma la ricerca non ha portato risultati
					$("#Body").removeClass("hidden");
					$("#Rows_preventivi").html("<h4 align='center'>La ricerca non ha portato alcun risultato</h4>");
					return;
			} else {
				$("#Body").removeClass("hidden");
				//Qui calcolo il numero delle pagine da generare
				var tmp = Math.trunc(preventivi[0].tot_rows / param.toLimit);
				var tmp2 = Math.trunc(preventivi[0].tot_rows % param.toLimit);
				if(tmp2 == 0) {
					var numPag = tmp;
				} else {
					var numPag = tmp + 1;
				}
			}

			// inserisco il numero di prevntivi trovati
			$("#num_results").html("Trovati "+preventivi[0].tot_rows+" preventivi");

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
	                			<div class=\"col-md-1\">\
	                			<div class=\"header\">N. Prev.</div></div>\
	                  			<div class=\"col-md-2\"><div class=\"header\">Cliente</div></div>\
	                  			<div class=\"col-md-1\"><div class=\"header\">Data ins.</div></div>\
	                  			<div class=\"col-md-1\"><div class=\"header\">Stato</div></div>\
	                  			<div class=\"col-md-2\"><div class=\"header\">Autore</div></div>\
	                  			<div class=\"col-md-2\"><div class=\"header\">Totale Preventivo</div></div>\
	                  			<div class=\"col-md-2\"><div class=\"header\">Azioni</div></div>\
	          			</div>";

			_this.elem.find("#Rows_preventivi").append(header);

			for(var i = 0;i < preventivi.length;i++){


				var d = preventivi[i];

				var tmpColor = i%2;

				var tmp = '<div class="row margin-0 odd_'+tmpColor+'">\
					<div class="col-md-1">\
						<div class="cell" style="margin-top: 7px;">\
								<div class="checkbox checkbox-primary form-check-input">\
									<input id="_'+i+'" class="checkbox_preventivi azioni" type="checkbox">\
									<label for="_'+i+'"><span class="data-label" style="white-space:pre;" data-name="Seleziona questo preventivo"></span></label>\
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
								<div class="propertyname"><span class="data-label" data-name="Cliente: "></span>'+(d.cliente?d.cliente:"")+'</div>\
							</div>\
					</div>\
					<div class="col-md-1">\
						<div class="cell">\
							<div class="propertyname"><span class="data-label" data-name="Data ins.: "></span>'+d.full_data+'</div>\
						</div>\
					</div>\
					<div class="col-md-1">\
							<div class="cell">\
								<div class="propertyname"><span class="data-label" data-name="Stato: "></span>'+(d.stato=="Valido"?"<span class='label label-success'>Valido</span>":"<span class='label label-warning'>Non valido</span>")+'</div>\
							</div>\
					</div>\
					<div class="col-md-2">\
							<div class="cell">\
								<div class="propertyname"><span class="data-label" data-name="Agente: "></span>'+d.nome+' '+d.cognome+'</div>\
							</div>\
					</div>\
					<div class="col-md-2">\
							<div class="cell">\
								<div class="propertyname"><span class="data-label" data-name="Totale: "></span>'+(d.stato=="Valido"?'<span style="color: #002F60;font-weight: bold;">'+Number(d.nettoAPagare).format(false,2)+' EUR</span>':'<span style="color:#F00">a progetto</span>')+'</div>\
							</div>\
					</div>\
					<div class="col-md-2">\
						   <div class="cell" style=\'margin-top: 5px;\'>\
								<select title="Scegli l\'azione..." class="selectpicker azioni" data-style="btn-info">\
									<option value="ripristina">Ripristina gli articoli nel carrello</option>\
									<option value="mostra">Mostra dettagli del preventivo</option>\
									<option value="elimina">Elimina il preventivo</option>\
								</select>\
						   </div>\
					</div>';

					var obj = $.parseHTML(tmp);
					$(obj).data("data", d.data);
					$(obj).find(".azioni").data("data", d.data);
					$("#Rows_preventivi").append(obj);

					$(".grigio").addClass("background-header");
					$(".grigio").removeClass("grigio");
					$('.selectpicker').selectpicker();

					_this.initButtons();
			}
		}

		jQuery.postJSON("Preventivi","getAllPreventivi","private", param, true, callBackPreventivi);

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
