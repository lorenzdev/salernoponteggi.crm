var Riepilogo = function(content){

	var _this = this;
	_this.content = content;
	_this.elem;
	_this.prezzoTotale = 0;
	_this.descrizione = "";
	_this.obj;
	var biscotto;

	_this.init = function(elem){

		//_this.biscotto = jQuery.getCookie("selezione");
		_this.biscotto = _this.content.main.lastSelezione;

		_this.elem = elem;

		_this.elem.html("");
		_this.riepilogoA();
	}

	_this.aggiornaRiepilogo = function(){

		jQuery("#boxRiepilogo").html("");
		jQuery("#boxRiepilogo").append(_this.obj.getRiepilogo());

		_this.obj.activeButtonRepeatQuantita();

		var totale = _this.obj.getPrezzoTotale();
		var totale_scontato = _this.obj.getPrezzoScontato();

		if(totale != null && _this.obj.getTipologiaProgetto()){
			jQuery("#boxRiepilogo").append("<hr><h4>Totale: <b><span id='prezzoTot'>"+totale.format(false,2) + "</span><b/> EUR<br>Totale scontato: <b><span id='prezzoTotaleScontato'>"+totale_scontato.format(false,2) + "</span></b> EUR</h4>");

		}

		_this.initButtons();

	}

	_this.riepilogoA = function(){


		_this.elem.html("<div id='boxRiepilogo'></div><div id='allega_immagini'></div><br><br><center><div id='azioni'></div></center><br><br>");

		_this.content.main.appendScript("js/Prodotti/"+_this.biscotto.tipologia+".js");

		_this.obj = eval("new "+_this.biscotto.tipologia+"()");
		_this.obj.init(_this.biscotto);

		_this.aggiornaRiepilogo();

		jQuery(".quantitaProdotto").trigger("keyup");

		//jQuery("#azioni").append("<button class=\"btn btn-primary\" type=\"button\" id=\"indietro\"><i class=\"fa fa-chevron-left\" aria-hidden=\"true\"></i> Indietro</button>&nbsp;");
		if(!_this.biscotto.modifica.boo){
		jQuery("#azioni").append("<button class=\"btn btn-primary\" type=\"button\" id=\"crea_preventivo\">Crea preventivo</button>&nbsp;");
		jQuery("#azioni").append("<button class=\"btn btn-primary\" type=\"button\" id=\"add_carrello\">Aggiungi al carrello</button>&nbsp;");
		}else
		jQuery("#azioni").append("<button class=\"btn btn-primary\" type=\"button\" id=\"modify_carrello\">Conferma modifica</button>&nbsp;");

		jQuery("#azioni").append("<br><br>");

		_this.initButtons();
		_this.content.main.loader.remove();


	}


	_this.initButtons = function(){


		jQuery("#indietro").off().on("click", function(){
			_this.content.main.loader.init(function(){_this.indietro();});
		});

		jQuery("#add_carrello").off().on("click", function(){
			_this.content.main.loader.init(function(){_this.aggiungiAlCarrello();});
		});


		jQuery("#crea_preventivo").off().on("click", function(){
			_this.content.main.loader.init(function(){_this.creaPreventivo();});
		});


		// MODIFICA PRODOTTO
		jQuery("#modify_carrello").off().on("click", function(){
			_this.content.main.loader.init(function(){_this.modificaProdotto();});
		});


		jQuery(".cancella_immagine").off().on("click",function(){

			var nome_file = jQuery(this).attr("nomefile");
			var path = jQuery(this).attr("path");


			function callBackGetImage(datoImage){

				//$.Log("IMMAGINI");
				//$.Log(datoImage);

				if(!datoImage.success){
					alert(datoImage.messageError);
					return;
				}

			}
			jQuery.postJSON("GestioneImmagini", "deleteOneImage","private", {"path":path,"file":nome_file}, false, callBackGetImage);

			jQuery("#"+jQuery(this).attr("immagine")).remove();
			jQuery(this).remove();
		});

		jQuery("#uploadImages").off().on("click",function(){
			if(jQuery("#file1").val()){
				var type1 = jQuery("#file1").get(0).files[0].type;
				var name1 =jQuery("#file1").get(0).files[0].name;
				var size1 = jQuery("#file1").get(0).files[0].size;

				//alert(type1);

				if(type1 != "image/jpeg" && type1 != "image/jpg" && type1 != "image/png" && type1 != "image/gif" && type1 != "image/pjpeg"){
					alert("La prima immagine ha un formato errato");
					return;
				}

				if(size1 > 2028000){
					alert("La prima immagine troppo pesante");
					return;
				}
			}

			if(jQuery("#file2").val()){
				var type2 = jQuery("#file2").get(0).files[0].type;
				var name2 =jQuery("#file2").get(0).files[0].name;
				var size2 = jQuery("#file2").get(0).files[0].size;

				if(type2 != "image/jpeg" && type2 != "image/jpg" && type2 != "image/png" && type2 != "image/gif" && type2 != "image/pjpeg"){
					alert("La seconda immagine ha un formato errato");
					return;
				}

				if(size2 > 2028000){
					alert("La seconda immagine troppo pesante");
					return;
				}
			}



			if(jQuery("#file3").val()){
				var type3 = jQuery("#file3").get(0).files[0].type;
				var name3 =jQuery("#file3").get(0).files[0].name;
				var size3 = jQuery("#file3").get(0).files[0].size;

				if(type3 != "image/jpeg" && type3 != "image/jpg" && type3 != "image/png" && type3 != "image/gif" && type3 != "image/pjpeg"){
					alert("La terza immagine ha un formato errato");
					return;
				}

				if(size3 > 2028000){
					alert("La terza immagine troppo pesante");
					return;
				}
			}

			if(jQuery("#file4").val()){
				var type4 = jQuery("#file4").get(0).files[0].type;
				var name4 =jQuery("#file4").get(0).files[0].name;
				var size4 = jQuery("#file4").get(0).files[0].size;

				if(type4 != "image/jpeg" && type4 != "image/jpg" && type4 != "image/png" && type4 != "image/gif" && type4 != "image/pjpeg"){
					alert("La quarta immagine ha un formato errato");
					return;
				}

				if(size4 > 2028000){
					alert("La quarta immagine troppo pesante");
					return;
				}
			}

			if(jQuery("#file5").val()){
				var type5 = jQuery("#file5").get(0).files[0].type;
				var name5 =jQuery("#file5").get(0).files[0].name;
				var size5 = jQuery("#file5").get(0).files[0].size;

				if(type5 != "image/jpeg" && type5 != "image/jpg" && type5 != "image/png" && type5 != "image/gif" && type5 != "image/pjpeg"){
					alert("La quinta immagine ha un formato errato");
					return;
				}

				if(size5 > 2028000){
					alert("La quinta immagine troppo pesante");
					return;
				}
			}
			document.getElementById('upload_target').contentWindow.document.body.innerHTML = "<img src=\"images/preloader.gif\" align=\"center\" /> Immagini in fase di caricamento...attendere";
			jQuery("#file_upload_form").submit();
			jQuery("#file_upload_form").remove();
		});


		jQuery(".quantitaProdotto").off();

		jQuery(".quantitaProdotto").on("click",function(e){
			jQuery(this).select();
		});

		jQuery(".quantitaProdotto").on("keypress",function(e){
			return jQuery.onlynumbers(e);
		});

		jQuery(".quantitaProdotto").on("keyup",function(){

			if(!jQuery(this).val() && Number(jQuery(this).val())!=0){
				jQuery(this).val(1);
			}

			var totQuantita = 0;
			jQuery(".quantitaProdotto").each(function(){
				totQuantita += Number(jQuery(this).val());
			});

			if(totQuantita <= 0){
				//alert("Non puoi inserire una quantità pari a 0.");
				jQuery(this).val(1);
				totQuantita = 1;
			}


			_this.obj.selezione.prodotto[jQuery(this).attr("id")] = Number(jQuery(this).val());
			_this.obj.selezione.prodotto.quantita = totQuantita;

			setTimeout(function(){
				_this.aggiornaRiepilogo();
			}, 1000);

		});

		jQuery(".sconto").off();

		jQuery(".sconto").on("click", function(){
			jQuery(this).select();
		});

		// azioni sconto
		jQuery(".sconto").on("keypress",function(e){
			return jQuery.onlynumbers(e);
		});

		jQuery(".sconto").on("keyup",function(e){

			if(eval(jQuery(this).val()) > 100){

				jQuery(this).val(100);
			}

			if(!jQuery.validaValore(jQuery(this).val())){
				jQuery(this).val(0);
			}

			var sconto = eval(jQuery(this).val());
			var articolo = $(this).attr("id");

			switch(articolo){
				case "prodotto": _this.obj.selezione.prodotto.sconto = sconto; break;
				case "sistemaChiusura": _this.obj.selezione.accessori.sistemaChiusura.sconto = sconto;
										_this.obj.selezione.accessori.sistemaChiusura.sconto_modified = true;
										for(var i = 0;i < _this.obj.selezione.accessori.sistemaChiusura.length;i++){
											_this.obj.selezione.accessori.sistemaChiusura[i].sconto = sconto;
											_this.obj.selezione.accessori.sistemaChiusura[i].sconto_modified = true;
										}
									break;
				case "sopraluce": 	_this.obj.selezione.accessori.sopraluce.sconto = sconto;
									_this.obj.selezione.accessori.sopraluce.sconto_modified = true;
									break;
				case "sistemaRifinitura": 	_this.obj.selezione.accessori.sistemaRifinitura.sconto = sconto;
											_this.obj.selezione.accessori.sistemaRifinitura.sconto_modified = true;
											break;
				case "motorizzazione":	 	_this.obj.selezione.accessori.motorizzazione.sconto = sconto;
											_this.obj.selezione.accessori.motorizzazione.sconto_modified = true;
											break;
				case "predisposizioneMotorizzazione": 	_this.obj.selezione.accessori.predisposizioneMotorizzazione.sconto = sconto;
														_this.obj.selezione.accessori.predisposizioneMotorizzazione.sconto_modified = true;
														break;
				case "passaggioPedonale": 	_this.obj.selezione.accessori.passaggioPedonale.sconto = sconto;
											_this.obj.selezione.accessori.passaggioPedonale.sconto_modified = true;
											break;
				case "maniglione": 		_this.obj.selezione.accessori.passaggioPedonale.maniglione.sconto = sconto;
										_this.obj.selezione.accessori.passaggioPedonale.maniglione.sconto_modified = true;
										break;
				case "porta_pedonale": 	_this.obj.selezione.accessori.passaggioPedonale.porta_pedonale.sconto = sconto;
										_this.obj.selezione.accessori.passaggioPedonale.porta_pedonale.sconto_modified = true;
										break;
				case "verniciatura": 	_this.obj.selezione.accessori.verniciatura.sconto = sconto;
										_this.obj.selezione.accessori.verniciatura.sconto_modified = true;
										break;
				case "oblo": 	_this.obj.selezione.accessori.oblo.sconto = sconto;
								_this.obj.selezione.accessori.oblo.sconto_modified = true;
								break;
				case "griglie": 	_this.obj.selezione.accessori.griglie.sconto = sconto;
									_this.obj.selezione.accessori.griglie.sconto_modified = true;
									break;
				case "struttura": 	_this.obj.selezione.accessori.struttura.sconto = sconto;
									_this.obj.selezione.accessori.struttura.sconto_modified = true;
									break;
				case "molle": 	_this.obj.selezione.accessori.molle.sconto = sconto;
								_this.obj.selezione.accessori.molle.sconto_modified = true;
								break;
				default: break;
			}

			setTimeout(function(){
			_this.aggiornaRiepilogo();

			}, 1000);
		});

	}

	_this.creaPreventivo = function(){
		_this.content.main.salvaPreventivo(_this.obj.selezione);
        $(".Preventivi").trigger("click");
	}

	_this.aggiungiAlCarrello = function(){

			var id = _this.obj.selezione.id;
			//_this.elem.find("#boxRiepilogo").remove();

			var param = {
				"id":id,
				"descrizione": JSON.stringify(_this.obj.selezione),
				"quantita": _this.obj.selezione.prodotto.quantita,
				"totale":_this.obj.selezione.totale,
				"totaleScontato":_this.obj.selezione.totaleScontato,
				"riferimento":_this.obj.selezione.riferimento,
				"prezzo_definitivo": _this.obj.selezione.totaleScontato
			}


			$.Log("Guarda qua carrello");
			$.Log(param);

			function callBackCarrello(dato){

				if(!dato.success){
					alert(dato.messageError);
					return;
				}
				//$.Log("Inserimento avvenuto correttamente");
			}

			jQuery.postJSON("Preventivi", "addProdottoToCarrello", "private", param, false, callBackCarrello);

			//jQuery(this).remove();
			//jQuery("#messageQuantita").remove();

			_this.content.main.aggiornaCarrello();

            $(".Carrello").trigger("click");

         /*
			var checked = "";
			if(_this.obj.selezione.repeat)
				checked = "checked";


			var view_carrello = "<input type=\"button\" value=\"VISUALIZZA CARRELLO\" id=\"view_carrello\"/>";

			var value = "";
		  	switch(_this.obj.selezione.tipologia){
				  case 'Basculante': 		value="AGGIUNGI UNA NUOVA BASCULANTE AL TUO PREVENTIVO";break;
				  case 'PortaCantina': 		value="AGGIUNGI UNA NUOVA PORTA CANTINA AL TUO PREVENTIVO";break;
				  case 'PortaMultiuso': 	value="AGGIUNGI UNA NUOVA PORTA MULTIUSO AL TUO PREVENTIVO";break;
				  case 'PortaTagliafuoco': 	value="AGGIUNGI UNA NUOVA PORTA TAGLIAFUOCO AL TUO PREVENTIVO";break;
				  case 'Sezionale': 		value="AGGIUNGI UNA NUOVA SEZIONALE AL TUO PREVENTIVO";break;
			 }

			$("#mask").html("<br><br><center><button class=\"btn btn-primary\" id=\"add_prodotto\">"+value+"</button></center></div><br>");

			jQuery("#add_prodotto").bind("click",function(){

					switch(_this.obj.selezione.tipologia){
						case 'Basculante': 			$(".FormPonteggioSospeso").trigger("click");break;
						case 'PortaMultiuso': 		$(".FormMontacarico").trigger("click");break;
						case 'PortaTagliafuoco': 	$(".FormAscensore").trigger("click");break;
						case 'Sezionale': 			$(".FormPonteggioElettrico").trigger("click");break;

					}

			});


			_this.content.main.loader.remove();
            */

	}

	_this.modificaProdotto = function(){

			var idProdotto = _this.obj.selezione.modifica.id;
			var cookieSelezione = _this.obj.selezione;

			/*
			var prezzo_definitivo = 1;
			if(cookieSelezione.tipologia == "Basculante"){
				$.Log(cookieSelezione.tipologia);
				if(cookieSelezione.accessori.verniciatura){
					$.Log(cookieSelezione.accessori.verniciatura);
					if(cookieSelezione.accessori.verniciatura.fascia == "002"){
						$.Log(cookieSelezione.accessori.verniciatura.fascia);
						prezzo_definitivo = 0;
					}

				}

			}
			*/


			var param = {
				"descrizione": JSON.stringify(cookieSelezione),
				"account":	jQuery.getCookie("utente").email,
				"quantita": cookieSelezione.prodotto.quantita,
				"totale":cookieSelezione.totale,
				"totaleScontato":cookieSelezione.totaleScontato,
				"riferimento":cookieSelezione.riferimento,
				"id_prodotto":idProdotto,
				"prezzo_definitivo": 0
			}


			function callBackCarrello(dato){

				$.Log("errore qui");
				$.Log(param);
				$.Log(dato);

				if(!dato.success){
					alert(dato.messageError);
					return;
				}

				//$.Log("Modifica avvenuta correttamente");

			}

			jQuery.postJSON("Preventivi", "modifyProdottoToCarrello", "private", param, false, callBackCarrello);



			_this.obj.selezione.modifica.boo = false;
			_this.obj.selezione.modifica.id = null;

			_this.content.main.aggiornaCarrello();
			jQuery(".Carrello").trigger("click");


			//_this.content.main.loader.remove();


	}


	_this.indietro = function(){
		_this.content.main.lastSelezione.indietro = true;
		_this.content.prevStep();
	}

}
