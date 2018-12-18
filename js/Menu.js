var Menu = function(){

	var _this = this;
	_this.elem;
	_this.lastSelezione;
	_this.init = function(elem){
		_this.elem = elem;
		_this.loader = new Loader();

		_this.loader.init(function(){_this.start();});

		window.onerror = function (errorMsg, url, lineNumber) {

			function callBackOnError(dato){
				$.Log(dato);
			}

			$.ERROR(errorMsg+", contattare l'amministratore del sistema per la sua correzione");

			$.postJSON("RegistrazioneUtente", "salvaLogs","public", {"errorMsg": errorMsg, "url": url, "lineNumber":lineNumber}, true, callBackOnError);

			jQuery.unblockUI();
            $("html,body").stop().animate({scrollTop:0});
		}


        $(window).resize(function(){
            _this.resize();
        });



        // VERIFICO SE L'UTENTE HA ACCETTATO L'USO DEI COOKIE
		$.fn.checknet();
	}

    _this.resize = function(){

        if($(window).width() <= 977){
                $(".data-label").each(function(){
                    var label = $(this).attr("data-name");
                    $(this).html(label);
                })
            }else{
                $(".data-label").html("");
            }

    }


	_this.start = function(){

		var utente = jQuery.getCookie("utente");



		//jQuery.get(P_MENU, function(datoHtml){



			_this.elem.append("<script language=\"javascript\" src=\"js/Prodotti/Basculante.js\" type=\"text/javascript\"></script>");
			_this.elem.append("<script language=\"javascript\" src=\"js/Prodotti/PortaMultiuso.js\" type=\"text/javascript\"></script>");
			_this.elem.append("<script language=\"javascript\" src=\"js/Prodotti/PortaTagliafuoco.js\" type=\"text/javascript\"></script>");
			_this.elem.append("<script language=\"javascript\" src=\"js/Prodotti/Sezionale.js\" type=\"text/javascript\"></script>");



			jQuery("#Home").off().on("click",function(e){
				e.stopPropagation();
				_this.loadSezione("Home", jQuery(this));
			});


			jQuery(".FormPonteggioSospeso").off().on("click",function(e){
				e.stopPropagation();
				_this.loadSezione("FormPonteggioSospeso", jQuery(this));
			});

			jQuery(".FormMontacarico").off().on("click",function(e){
				e.stopPropagation();
				_this.loadSezione("FormMontacarico", jQuery(this));
			});

			jQuery(".FormAscensore").off().on("click",function(e){
				e.stopPropagation();
				_this.loadSezione("FormAscensore", jQuery(this));
			});

			jQuery(".FormPonteggioElettrico").off().on("click",function(e){
				e.stopPropagation();
				_this.loadSezione("FormPonteggioElettrico", jQuery(this));
			});

			jQuery(".Carrello").off().on("click",function(e){
				e.stopPropagation();
				_this.loadSezione("Carrello",jQuery(this));
			});

			jQuery(".GestionePreventivi").off().on("click",function(e){
				e.stopPropagation();
				_this.loadSezione("Preventivi",jQuery(this));
			});

			jQuery(".GestioneUtenti").off().on("click",function(e){
				e.stopPropagation();
				_this.loadSezione("GestioneUtenti",jQuery(this));
			});

			jQuery(".Clienti").off().on("click",function(e){
				e.stopPropagation();
				_this.loadSezione("Clienti",jQuery(this));
			});

			jQuery(".Profilo").off().on("click",function(e){
				e.stopPropagation();
				_this.loadSezione("Profilo",jQuery(this));
			});


            _this.aggiornaCarrello();
			_this.loader.remove();





			/*
			if(jQuery.getCookie("utente").ruolo == "ROLE_ADMIN"){
				var interval = setInterval(function(){
					_this.getNotifies();
				}, 10000);
			}
			*/

		//});

	}

	_this.loadSezione = function(sezione,elem){

			$.Log("AAAAA");
			$.Log(_this.lastSelezione);

			if(_this.lastSelezione){
				if(_this.lastSelezione.modifica.boo){
					if(!confirm("E' attiva una procedura di modifica di un articolo. Vuoi abbandonare la modifica?")){
						return;
					}else{
						_this.lastSelezione.modifica.boo = false;
					}
				}
			}


			$("body").click();


			_this.active(elem);

			function goLoad(){

				var check = false;

				//alert(jQuery.validaValore(cookieSelezione)+" "+cookieSelezione.modifica.boo+" "+sezione);
				/*
				var tipologia_temp = "";
				switch(sezione){

						case 'Basculante': 			tipologia_temp="FormPonteggioSospeso";break;
						case 'PortaMultiuso': 		tipologia_temp="FormMontacarico";break;
						case 'PortaTagliafuoco': 	tipologia_temp="FormAscensore";break;
						case 'Sezionale': 			tipologia_temp="FormPonteggioElettrico";break;

					}


				//alert(jQuery.validaValore(cookieSelezione)+" "+cookieSelezione.modifica.boo+" "+sezione + " "+tipologia_temp);


				if(jQuery.validaValore(cookieSelezione)){

					if(("Form"+cookieSelezione.tipologia) != sezione){
							if(cookieSelezione.modifica.boo){
								 var result = confirm("Attenzione è attiva una procedura di modifica di una "+cookieSelezione.tipologia+". Vuoi annullare la procedura e proseguire nella navigazione?");
								 if(!result){
									 _this.loader.remove();
									  check = true;
									  return;
									  }else{
									  check = false;
									  cookieSelezione.modifica.boo = false;
									  cookieSelezione.modifica.id = null;
									  jQuery.registerCookie("selezione", cookieSelezione);
								  }
							}else{

								if(sezione != "Carrello" && sezione != "Profilo" && sezione != "Rubrica" && sezione != "GestionePreventivi" && sezione != "GestioneUtenti"){

									jQuery.registerCookie("selezione",null);
									jQuery.deleteCookie("selezione");

								}
						}

					}
				}
				*/

				/*if(jQuery.validaValore(cookieSelezione) && cookieSelezione.modifica.boo && ("Form"+sezione)!=tipologia_temp){
					  var result = confirm("Attenzione è attiva una procedura di modifica di un prodotto. Vuoi annullare la procedura e proseguire nella navigazione?");
					 _this.loader.remove();
					  if(!result){
						  check = true;
						  }else{
						  check = false;
						  cookieSelezione.modifica.boo = false;
						  cookieSelezione.modifica.id = null;
						  jQuery.registerCookie("selezione", cookieSelezione);
					  }
				  }*/

				var check = false;
				  if(!check){
					  	$.Log("lool");
					  	var mySezione = eval("new "+sezione+"(_this)");
						mySezione.init(jQuery("#Body"));

						$("html,body").scrollTop(0);

				  }

			}


			_this.loader.init(goLoad);

	}

	_this.active = function(elem){

	if(!$("#menu_prodotti")) {
       	$(".navbar-nav li").not(elem.parent()).removeClass("active");
			if(elem.parent().is("li")) {
				elem.parent().addClass("active");
			}
		}
	}



	_this.aggiornaCarrello = function(){

		var prodotti = [];
		function callBackCarrello(dato){

			$.Log("Num prodotti");
			$.Log(dato);

			if(!dato.success){
				alert("Errore inserimento in carrello");
				return;
			}

			prodotti = dato.results;
			if(Number(prodotti) > 0){
				jQuery(".numero_notifica_carrello").html(prodotti);
				jQuery(".numero_notifica_carrello").css({"display":"block"});
			}else{
				jQuery(".numero_notifica_carrello").html(prodotti);
				jQuery(".numero_notifica_carrello").css({"display":"none"});
			}

		}

		jQuery.postJSON("Preventivi", "getNumCarrello","private",{"account":jQuery.getCookie("utente").email}, true, callBackCarrello);

		return prodotti;

	}


	_this.getNotifies = function(){


		function callBackNotifies(dato){

			$.Log("Notifiche");
			$.Log(dato);

			if(!dato.success){
				alert("Errore notifiche " + dato.messageError);
				return;
			}

			var message = "<div style='padding:25px;padding-left:60px;background: url(images/check48.png) no-repeat 10px 10px;'> Sono stati inseriti " + dato.results + " nuovi preventivi.</div>";

			if(dato.results <= 0)
				return;

			if(dato.results == 1)
				message = "<div style='padding:25px;padding-left:60px;background: url(images/check48.png) no-repeat 10px 10px;'> E' stato inserito un nuovo preventivo.";


			/*jQuery.growlUI.defaults = {
				css: {
					padding:        0,
					margin:         0,
					width:          '30%',
					top:            '40%',
					left:           '35%',
					textAlign:      'center',
					color:          '#000',
					border:         '3px solid #aaa',
					backgroundColor:'#fff',
					cursor:         'wait'
				}
			}*/
			/*jQuery.blockUI.defaults = {

				growlCSS: {
					width:    '350px',
					top:      '10px',
					border:   'none',
					right: "10px",
					padding: "10px",
					opacity:   0.6,
					fontSize: "10px",
					fontFamily: "Arial",
					cursor:    null,
					color:    '#fff',
					backgroundColor: '#000',
					'-webkit-border-radius': '10px',
					'-moz-border-radius':    '10px'
				}

			}*/
			jQuery.blockUI({
			 message: message,
			 fadeIn: 700,
			 fadeOut: 700,
			 timeout: 20000,
			 showOverlay: false,
			 centerY: false,
			 css: {
				 width: '370px',
				 top: '10px',
				 left: '',
				 right: '10px',
				 border: 'none',
				 padding: '5px',
				 fontFamily : 'trebuchet ms, verdana, arial',
				/* background: 'url(../images/check48.png) no-repeat 10px 10px ',*/
				 backgroundColor: '#000',
					 '-webkit-border-radius': '10px',
					 '-moz-border-radius': '10px',
				 opacity: .6,
				 color: '#fff'
			 }
		 });
			//jQuery.growlUI('',message);
			/*prodotti = dato.results;
			if(Number(prodotti) > 0){
				jQuery(".numero_notifica_carrello").html(prodotti);
				jQuery(".numero_notifica_carrello").css({"display":"block"});
			}else{
				jQuery(".numero_notifica_carrello").html(prodotti);
				jQuery(".numero_notifica_carrello").css({"display":"none"});
			}*/
		}

		jQuery.postJSON("Preventivi", "getPreventiviNonLetti","private",{}, false, callBackNotifies);
	}




	_this.salvaPreventivo = function(articolo){

		$.Log("L'ARTICOLO CHE STO PER SALVARE");
		$.Log(articolo);

		function callBackPreventivo(dato){
			$.Log("Esito salva preventivo");
			$.Log(dato);

			if(!dato.success){
				alert("Errore inserimento del preventivo");
				return;
			}
		}


		jQuery.postJSON("Preventivi", "salvaPreventivoDaArticolo", "private", {"articolo":articolo}, false, callBackPreventivo);
		_this.loadSezione("Preventivi", $("#GestionePreventivi"));


		/*
		$.Log("PRIMA DELLA VERNICE");
		$.Log(articoli);

		// APPLICO LA VERNICE AGLI ARTICOLI
		_this.calcolaCostiVerniciatura(articoli);

		$.Log("PRIMA LA VERNICE");
		$.Log(articoli);
		*/

		/*
		var data_timestamp = new Date().getTime();
		var data = data_timestamp;

		var totale = 0;
		var totaleScontato = 0;
		var isProgetto = false;


		function callBackCarrello(dato){
				$.Log("Tutti i prodotti nel carrello");
				$.Log(dato);

				if(!dato.success){
					alert("Errore inserimento in carrello");
					return;
				}

				prodotti = dato.results;
		}

		jQuery.postJSON("Preventivi", "getProdottiFromCarrello","private", {"prodotti":prodotti}, false, callBackCarrello);


		_this.calcolaCostiVerniciatura(prodotti);

		for(var i = 0; i < prodotti.length;i++){

			if(!JSON.parse(prodotti[i].descrizione).validita)
				isProgetto = true;

			totale += parseFloat(prodotti[i].totale);
			totaleScontato += parseFloat(prodotti[i].totaleScontato);
		}

		var approvazione = 1;

		if(isProgetto){
			approvazione = 	0;
		}

		if(isNaN(totale))
			totale = 0;

		var codicePreventivo = "";
		var boo = false;


		function callBackPreventivo(dato){
			$.Log("callback preventivo");
			$.Log(dato);

			if(!dato.success){
				alert("Errore inserimento preventivo!");
				return;
			}

			codicePreventivo = dato.results;
			boo = true;
			//_this.content.loader.remove();
		}

		//var param = {"data":data, "totale":totale,"totaleScontato":totaleScontato,"approvazione":approvazione,"account":jQuery.getCookie("utente").email,"letto":0};

		////$.Log("ADD CARRELLO!");
		////$.Log(param);

		jQuery.postJSON("Preventivi", "addPreventivo", "private", {"prodotti":prodotti}, false, callBackPreventivo);
		*/
		/*
		if(!boo)
			return;


		function callBackPCarrello(datoCarrello){
			$.Log("QUI");
			$.Log(datoCarrello);

			if(!datoCarrello.success){
				alert(datoCarrello.messageError);
				return;
			}
		}

		jQuery.postJSON("Preventivi", "addCarrello","private",{"prodotti":prodotti, "preventivo":codicePreventivo,"tipologia":1}, false, callBackPCarrello);

		_this.loadSezione("Preventivi",jQuery("#GestionePreventivi"));
		*/


	}


	_this.costiVerniciaturaByArticolo = function(articolo){

		function callBackPal(dato){

			if(!dato.success){
				alert(dato.errorMessage);
				return;
			}

			for(var i = 0;i < dato.results.length;i++)
				_this.pal[i] = {"codice":dato.results[i].codice,"quantita":0,"prodotti":[]};

			if(articolo.tipologia == "Basculante"){
				if(descrizione.accessori.verniciatura){
					for(var j=0;j < _this.pal.length;j++){

						if(_this.pal[j].codice == descrizione.accessori.verniciatura){
							_this.pal[j].quantita += parseInt(prodotti[i].quantita);
							_this.pal[j].prodotti.push(prodotti[i]);
						}
					}
				}
			}
		}

		jQuery.postJSON("Verniciatura", "getPAL","private",{"fascia":"002"}, false, callBackPal);
	}



	_this.calcolaCostiVerniciatura = function(prodotti){

		_this.pal = [];

		function callBackPal(dato){

			if(!dato.success){
				alert(dato.errorMessage);
				return;
			}

			for(var i = 0;i < dato.results.length;i++)
				_this.pal[i] = {"codice":dato.results[i].codice,"quantita":0,"prodotti":[]};

			for(var i=0;i < prodotti.length;i++)

				if(JSON.parse(prodotti[i].descrizione).tipologia == "Basculante")
				for(var j=0;j < _this.pal.length;j++){

					////$.Log("Sconti?");
					////$.Log(JSON.parse(prodotti[i].descrizione));

					var descrizione = JSON.parse(prodotti[i].descrizione);
					var codiceVerniciatura = "";
					if(descrizione.accessori.verniciatura != null){
					 	codiceVerniciatura = descrizione.accessori.verniciatura.codice;
					}else continue;
					////$.Log(_this.pal[j].codice+" "+codiceVerniciatura);
					if(_this.pal[j].codice == codiceVerniciatura){
						_this.pal[j].quantita += parseInt(prodotti[i].quantita);
						_this.pal[j].prodotti.push(prodotti[i]);
					}
				}
		}

		jQuery.postJSON("Verniciatura", "getPAL","private",{"fascia":"002"}, false, callBackPal);

		//$.Log("I pal selezionati:");
		//$.Log(_this.pal);

		for(var j = 0;j < _this.pal.length;j++){
			for(var i = 0;i < _this.pal[j].prodotti.length;i++){

				function callBackCostiVerniciatura(dato){

					if(!dato.success){
						alert(dato.errorMessage)
						return;
					}



					////$.Log("Risultato ricerca:");
					////$.Log(dato);
					var prezzo = Number(dato.results[0].costo);
					var codice = dato.results[0].codice;
					var descrizione = JSON.parse(_this.pal[j].prodotti[i].descrizione);

					////$.Log("Descrizione prima");
					////$.Log(descrizione);

					var dimPortaH = parseInt(descrizione.porta.H);
					var dimPortaL = parseInt(descrizione.porta.L);
					var mq = (dimPortaH/1000)*(dimPortaL/1000);

					if(mq < 6)
						mq = 6;

					var totaleVerniciatura = prezzo*mq;

					for(var l=0;l<descrizione.accessori.verniciatura.vernici.length;l++){
						////$.Log(descrizione.accessori.verniciatura);
						if(descrizione.accessori.verniciatura.vernici[l].tipo != "sopraluce" && descrizione.accessori.verniciatura.vernici[l].tipo != "coprifilo"){
							descrizione.accessori.verniciatura.vernici[l].codice = codice;
							descrizione.accessori.verniciatura.vernici[l].costo = prezzo;
							descrizione.accessori.verniciatura.vernici[l].totale = totaleVerniciatura;
						}
					}

					$.Log("Qui l'errore!");
					var obj = eval("new "+descrizione.tipologia+"()");

					_this.pal[j].prodotti[i].totale = obj.ricalcolaTotale(descrizione);
					_this.pal[j].prodotti[i].totaleScontato = obj.ricalcolaTotaleScontato(descrizione);
					_this.pal[j].prodotti[i].descrizione = JSON.stringify(descrizione);


				}

				//$.Log("Prodotto: ");
				//$.Log(_this.pal[j].prodotti[i]);

				if(_this.pal[j].prodotti[i] != null){
					var query = {"fascia":"002","Quantita":_this.pal[j].quantita};

					////$.Log("La query");
					////$.Log(query);

					jQuery.postJSON("Verniciatura", "getVerniciaturaByCodice","private",query, false, callBackCostiVerniciatura);
				}
			}
		}

	}


	_this.appendScript = function(filepath) {


			$("script[element='library']").remove();

			if ($('head script[src="' + filepath + '"]').length > 0)
				return;

			var ele = document.createElement('script');
			ele.setAttribute("type", "text/javascript");
			ele.setAttribute("element", "library");
			ele.setAttribute("src", filepath);
			$('head').append(ele);
		}


}
