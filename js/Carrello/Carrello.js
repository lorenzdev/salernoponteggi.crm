var Carrello = function(content){

	var _this = this;

	_this.keyword = "";
	_this.resultsForPage = 10;
	_this.fromLimit = 0;
	_this.toLimit = 10;
	_this.pageActive = 1;

	_this.content = content;
	_this.elem;

	_this.init = function(elem){

		_this.initStyle();

		_this.elem = elem;
		_this.show();
	}

	_this.show = function(){

		_this.elem.html("");

		jQuery.get(P_CARRELLO, function(tabella){
			_this.elem.html(tabella);
			_this.initCarrello();

			_this.initButtons();
		});

	}

	_this.initButtons = function(){

        _this.content.resize();

	   	$(".action").off().on("change", function(e){
			e.stopPropagation();
			e.preventDefault();

			var id = jQuery(this).data("id");
			switch($(this).val()){
				case "modifica":_this.modificaArticolo(id);break;
				case "elimina":_this.eliminaArticolo(id);break;
				default: break;
			}

		});

		$(".resforpage").off().on("change", function(e){
			e.stopPropagation();
			e.preventDefault();
			_this.resultsForPage = Number($(this).val());
			$('.resforpage .filter-option-inner-inner').text(_this.resultsForPage);
			$("#loading_carrello").html("<div class=\"label label-success\"><i class=\"fa fa-spinner fa-spin\"></i> Sto cercando...</div>");
			setTimeout(function(){
				_this.initCarrello();
			}, 50);
		});

		//Scrittura diversa per associare il click ad un elemento generato dinamicamente dopo la selezione
		$(".page-link").off().on("click", function() {
			if(!$(this).hasClass("disabled")) {
				_this.fromLimit = Number($(this).attr("fromLimit"));
				_this.toLimit = Number($(this).attr("toLimit"));
				_this.pageActive = Number($(this).text());
				$("#loading_carrello").html("<div class=\"label label-success\"><i class=\"fa fa-spinner fa-spin\"></i> Sto cercando...</div>");
				setTimeout(function(){
				_this.initCarrello();
			}, 50);
			}
		});


		//Scrittura diversa per associare il click ad un elemento generato dinamicamente dopo la selezione
		$("#btn_search").off().on("click", function() {
			_this.keyword = $("#field_search").val();
			$("#loading_carrello").html("<div class=\"label label-success\"><i class=\"fa fa-spinner fa-spin\"></i> Sto cercando...</div>");

			// disabilito i tasti cancella preventivi e salva preventivo (ad ogni ricerca)
			$("#cancella_selezionati").prop("disabled",true);
			$("#salva_preventivo").prop("disabled",true);

			_this.fromLimit = 0;
			_this.toLimit = Number($(".resforpage option:selected").val());
			_this.pageActive = 1;

			$(".page-link").attr("fromLimit",0);
			$(".page-link").attr("toLimit",_this.resultsForPage);

			setTimeout(function(){
				_this.initCarrello();
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


			jQuery("#seleziona_prodotti").off().on("click",function(){

				var stato = jQuery("#seleziona_prodotti").attr("stato");
				if(stato == "1"){
					jQuery("#seleziona_prodotti").attr("stato",0);
					jQuery("#seleziona_prodotti").html("Deseleziona tutti");
					jQuery("#cancella_selezionati").prop("disabled",false);
					jQuery("#salva_preventivo").prop("disabled",false);
					jQuery(".checkbox_prodotti").each(function(){
						jQuery(this).prop("checked",true);
					});
				}else{
					jQuery("#seleziona_prodotti").attr("stato",1);
					jQuery("#seleziona_prodotti").html("Seleziona tutti");
					jQuery("#cancella_selezionati").prop("disabled",true);
					jQuery("#salva_preventivo").prop("disabled",true);
					jQuery(".checkbox_prodotti").each(function(){
						jQuery(this).prop("checked",false);
					});
				}
			});


			jQuery("#salva_preventivo").off().on("click",function(){
				_this.content.loader.init(function(){_this.salvaPreventivo();});
			});

			jQuery("#cancella_selezionati").off().on("click",function(){

				var prodotti_da_cancellare = [];

				jQuery(".checkbox_prodotti").each(function(){
					if(jQuery(this).is(":checked")){
						var id = jQuery(this).data("id");
						prodotti_da_cancellare.push(id);
						/*if(_this.content.main.lastSelezione)
							if(_this.content.main.lastSelezione.modifica && _this.content.main.lastSelezione.modifica.id == id){
								_this.content.main.lastSelezione.modifica.boo = false;
						}*/
					}
				});

				_this.content.loader.init(function(){_this.cancellaSelezionati(prodotti_da_cancellare);});

			});


			jQuery(".checkbox_prodotti").off().on("click",function(){
				jQuery("#cancella_selezionati").prop("disabled",_this.isChecked());
				jQuery("#salva_preventivo").prop("disabled",_this.isChecked());
			});


		jQuery(".warning_variazione_prezzo").balloon({
				contents: "Il totale e il totale scontato finali del preventivo potrebbero<br>subire delle variazioni per via della verniciatura <br> e delle quantità scelte.",
				css:{
					fontFamily: "Arial",
					fontSize: "12px",
					opacity: 1,
					lineHeight: "16px"
				}
			});

			var cookieCarrello = jQuery.getCookie("carrello");

	}


	_this.eliminaArticolo = function(id){

			var prodotti = [];
				prodotti.push(id);
			_this.content.loader.init(function(){_this.cancellaSelezionati(prodotti);});
	}

	_this.modificaArticolo = function(id){

			_this.content.loader.init(function(){

					function callBackProdottoCarrello(dato){

						$.Log("Carrello");
						$.Log(dato);

						cookie = dato.results.descrizione;

						if(!dato.success){
							alert("Errore!");
							return;
						}

						cookie.modifica.boo = true;
						cookie.modifica.id = eval(id);

						switch(cookie.tipologia){
							case 'PonteggioSospeso': 			_this.content.loadSezione("FormPonteggioSospeso", $(".FormPonteggioSospeso"));break;
							case 'Montacarico': 				$(".FormMontacarico").trigger("click");break;
							case 'Ascensore': 					$(".FormAscensore").trigger("click");break;
							case 'PonteggioElettrico': 			$(".FormPonteggioElettrico").trigger("click");break;
							default: 							$.ERROR("Articolo non riconosciuto");_this.content.loader.remove();break;
						}

						_this.content.lastSelezione = cookie;

					}

					jQuery.postJSON("Preventivi", "getProdottoFromCarrello","private", {"id":id}, false, callBackProdottoCarrello);

				});
		}

	_this.isChecked = function(){
		var boo = true;
		jQuery(".checkbox_prodotti").each(function(){
			if(jQuery(this).is(":checked")){
				boo = false;
			}
		});

		return boo;
	}

	_this.getNumeroProdotto = function(){
		var cookieCarrello = jQuery.getCookie("carrello");
		if(cookieCarrello == undefined) return 0;
		return cookieCarrello.prodotti.length;
	}

	_this.rimuoviArticoli = function(prodotti){
		/*var cookieCarrello = jQuery.getCookie("carrello");
		cookieCarrello.prodotti = new Array();
		jQuery.registerCookie("carrello",cookieCarrello);
		_this.content.aggiornaCarrello();*/


		var param = {
				"account": 	jQuery.getCookie("utente").email,
				"prodotti": prodotti

		}

		function callBackDeleteCarrello(datoCarrello){
				////$.Log("QUI");
				////$.Log(datoCarrello);
				if(!datoCarrello.success){
					alert("Errore eliminazione carrello");
					return;
				}

				_this.content.loader.remove();
		}


		jQuery.postJSON("Preventivi", "rimuoviArticoli","private",param, false, callBackDeleteCarrello);

		//_this.elem.html("<h3>Carrello</h3>");
		//_this.elem.html("<h4 align='center'>Operazione conclusa con successo<br>Il carrello è ora vuoto</h4>");
	}

	_this.svuotaCarrello = function(){
		/*var cookieCarrello = jQuery.getCookie("carrello");
		cookieCarrello.prodotti = new Array();
		jQuery.registerCookie("carrello",cookieCarrello);
		_this.content.aggiornaCarrello();*/


		var param = {
				"account": 	jQuery.getCookie("utente").email,

		}

		function callBackDeleteCarrello(datoCarrello){
				////$.Log("QUI");
				////$.Log(datoCarrello);
				if(!datoCarrello.success){
					alert("Errore eliminazione carrello");
					return;
				}

				_this.content.loader.remove();
		}


		jQuery.postJSON("Preventivi", "svuotaCarrello","private",param, false, callBackDeleteCarrello);

		jQuery("#GestionePreventivi").trigger("click");
		//_this.elem.html("<h3>Carrello</h3>");
		//_this.elem.html("<h4 align='center'>Operazione conclusa con successo<br>Il carrello è ora vuoto</h4>");
	}

	_this.salvaPreventivo = function(){


		//var bool = confirm("Vuoi rimuovere gli articoli dal carrello al completamento del salvataggio del preventivo?");

		var articoli_selezionati = [];

		$(".checkbox_prodotti").each(function(){
			if($(this).is(":checked"))
				articoli_selezionati.push($(this).data("id"));
		});


		function callBackPreventivo(dato){
			
			$.Log("SALVA PREVENTIVI?");
			$.Log(dato);
			
			if(!dato.success){
				alert("Errere inserimento preventivi");	
			}
		}

		jQuery.postJSON("Preventivi", "salvaPreventivoArticoliSelezionati", "private", {"articoli":articoli_selezionati,"rimuovi":true}, false, callBackPreventivo);


		_this.content.loadSezione("Preventivi", $(".GestionePreventivi"));
		_this.content.aggiornaCarrello();

	}

	_this.initCarrello = function() {

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

		console.log("Guarda qua");
		console.log(param);

		var prodotti = [];
		function callBackCarrello(dato){


			$.Log("Elenco prodotti:");
			$.Log(dato);

			if(!dato.success){
				alert("Errore inserimento in carrello");
				return;
			}

			$("#Rows_carrello").empty();
			$("#pagul").empty();
			$("#loading_carrello").html("");
			$("#num_results").html("");

			prodotti = dato.results;
			_this.content.loader.remove();

			// se il risultato della query è vuoto e la chiave di ricerca è vuota significa che non ci sono articoli nel carrello
			if(prodotti.length <= 0 && _this.keyword == ""){
				$("#Body").removeClass("hidden");
				_this.elem.html("<h4 align='center'>Il carrello è vuoto</h4>");
				return;
			} else if(prodotti.length <= 0){ // se il risultato della query è vuoto e la chiave di ricerca non è vuota significa ci sono articoli nel carrello ma la ricerca non ha portato risultati
					$("#Body").removeClass("hidden");
					$("#Rows_carrello").html("<h4 align='center'>La ricerca non ha portato alcun risultato</h4>");
					return;
			} else {
				$("#Body").removeClass("hidden");
				//Qui calcolo il numero delle pagine da generare
				var tmp = Math.trunc(prodotti[0].tot_rows / param.toLimit);
				var tmp2 = Math.trunc(prodotti[0].tot_rows % param.toLimit);
				if(tmp2 == 0) {
					var numPag = tmp;
				} else {
					var numPag = tmp + 1;
				}
			}


			// inserisco il numero di prevntivi trovati
			$("#num_results").html("Trovati "+prodotti[0].tot_rows+" prodotti");

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
              				<!--<div class=\"col-md-2\"><div class=\"header\">Riferimento</div></div>-->\
            				<div class=\"col-md-2\"><div class=\"header\">Articolo</div></div>\
           					 <div class=\"col-md-2\"><div class=\"header\">Codice</div></div>\
            				<div class=\"col-md-1\"><div class=\"header\">Quantità</div></div>\
            				<div class=\"col-md-2\"><div class=\"header\">Totale</div></div>\
            				<div class=\"col-md-2\"><div class=\"header\">Azioni</div></div>\
        					</div>";

			_this.elem.find("#Rows_carrello").append(header);

			$.Log("looool");

			for(var i = 0;i < prodotti.length;i++){

				var d = prodotti[i];

				$.Log(d);

				var tmpColor = cont%2;
				cont++;

				var jsonDescrizione = prodotti[i].descrizione.articolo;
				var codice = jsonDescrizione.modello;

				var nome_tipologia = "";
				switch(jsonDescrizione.tipologia){

					case 'Ascensore': 				nome_tipologia = "Ascensore";break;
					case 'PonteggioElettrico': 		nome_tipologia = "Ponteggio elettrico";break;
					case 'PonteggioSospeso': 		nome_tipologia = "Ponteggio sospeso";break;
					case 'Montacarico': 			nome_tipologia = "Monttacarico";break;
					default: break;
				}

				var tmp = '<div class="row margin-0 odd_'+tmpColor+'">\
							<div class="col-md-1">\
								<div class="cell" style="margin-top: 7px;">\
									<div class="checkbox checkbox-primary form-check-input">\
										<input id="_'+i+'" class="checkbox_prodotti" type="checkbox">\
										<label for="_'+i+'"><span class="data-label" style="white-space:pre;" data-name="Seleziona questo articolo"></span></label>\
									</div>\
								</div>\
							</div>\
							<!--<div class="col-md-2">\
								<div class="cell">\
									<div class="propertyname">\
										<span class="data-label" data-name="Riferimento: "></span>'+d.riferimento+'\
									</div>\
								</div>\
							</div>-->\
							<div class="col-md-2">\
								<div class="cell">\
									<div class="propertyname">\
										<span class="data-label" data-name="Articolo: "></span>'+nome_tipologia+'\
									</div>\
								</div>\
							</div>\
							<div class="col-md-2">\
								<div class="cell">\
									<div class="propertyname">\
										<span class="data-label" data-name="Codice: "></span>'+codice+'\
									</div>\
								</div>\
							</div>\
							<div class="col-md-1">\
								<div class="cell">\
									<div class="propertyname">\
										<span class="data-label" data-name="Quantità: "></span>'+d.quantita+'\
									</div>\
								</div>\
							</div>\
							<div class="col-md-2">\
								<div class="cell">\
									<div class="propertyname">\
										<span class="data-label" data-name="Totale: "></span>'+Number(d.totaleScontato).format(false,2)+' EUR</span>\
									</div>\
								</div>\
							</div>\
							<div class="col-md-2">\
								<div class="cell" style=\'margin-top: 5px;\'>\
									<!--	<div class="propertyname action">\
										<a style="cursor:pointer;">\
											<span class="modifica azioni_ azioni fa-stack title" title="Modifica l\'articolo">\
												<i class="fa fa-square fa-s fa-stack-2x"></i>\
												<i class="fa fa-pencil fa-i fa-stack-1x fa-inverse"></i>\
											</span>\
										</a>\
										<a style="cursor:pointer;">\
											<span class="elimina azioni_ azioni fa-stack title" title="Modifica l\'articolo">\
												<i class="fa fa-square fa-s fa-stack-2x"></i>\
												<i class="fa fa-trash fa-i fa-stack-1x fa-inverse"></i>\
											</span>\
										</a>\
									</div>-->\
									<select title="Scegli l\'azione..." class="selectpicker action" data-style="btn-info">\
										<option value="modifica">Modifica l\'articolo</option>\
										<option value="elimina">Elimina l\'articolo</option>\
									</select>\
								</div>\
							</div>';

				var obj = $.parseHTML(tmp);
				$(obj).data("id", d.id);
				$(obj).find(".action").data("id", d.id);
				$(obj).find(".checkbox_prodotti").data("id", d.id);

				_this.elem.find("#Rows_carrello").append(obj);

				$(".grigio").addClass("background-header");
				$(".grigio").removeClass("grigio");
				$('.selectpicker').selectpicker();

				_this.initButtons();

			}

		}

			jQuery.postJSON("Preventivi", "getAllFromCarrello", "private", param, true, callBackCarrello);
	}

	_this.cancellaSelezionati = function(prodotti_da_cancellare){


			function callBackRemoveCarrello(dato){
					////$.Log("QUi elimino il prodotto dal carrello!!");
					////$.Log(dato);
					if(!dato.success){
						alert("Errore!");
						return;
					}


				}

				jQuery.postJSON("Preventivi", "deleteProdottoFromCarrello","private", {"prodotti":prodotti_da_cancellare}, false, callBackRemoveCarrello);


				/*
				function callBackRemove(dato){
					////$.Log(dato);
				}

				jQuery.postJSON("GestioneImmagini", "deleteImageCarrello","private", {"prodotti":prodotti_da_cancellare}, false, callBackRemove);
				*/

				_this.show();
				_this.content.aggiornaCarrello();
				_this.content.loader.remove();

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
