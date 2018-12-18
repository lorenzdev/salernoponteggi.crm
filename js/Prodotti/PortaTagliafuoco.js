var PortaTagliafuoco = function(main){

	var _this = this;
	_this.selezione;
	_this.id;
	_this.tipologia;
	_this.famiglia;
	_this.dimensioniPorta;
	_this.debordatura;
	_this.versione;
	_this.sottoversione;
	_this.tipoPosa;

	_this.sopraluce = null;
	_this.sistemaChiusura = null;
	_this.sistemaRifinitura = null;
	_this.verniciatura = null;
	_this.passaggioPedonale = null;
	_this.siAccessori = false;


	_this.prezzoTotale;


	_this.init = function(selezione){


		_this.selezione = selezione;


		_this.id = _this.selezione.id;
		_this.riferimento = _this.selezione.riferimento;
		_this.accessori = _this.selezione.accessori;
		_this.tipologia = _this.selezione.tipologia;
		_this.porta = _this.selezione.porta;
		_this.oblo = _this.selezione.oblo;
		_this.ante = _this.selezione.ante;
		//_this.sopraluce = _this.selezione.accessori.sopraluce;
		_this.prodotto = _this.selezione.prodotto;
		_this.validita = _this.selezione.validita;



		if(_this.validita){
			_this.findProdotto();
		}

		//_this.getSopraluce();
		_this.getSistemaChiusura();
		_this.getVerniciatura();

	}

	_this.getTipologiaProgetto = function(){

		return _this.validita;
	}

	_this.findProdotto = function(){

		var porta = {
			"tipologia": _this.tipologia,
			"L": _this.porta.L,
			"H":_this.porta.H,
			"ante": _this.ante
		}

		function callBackPrezzo(dato){

			//$.Log("Risultati porta tagliafuoco!");
			//$.Log(dato);

			if(!dato.success){
				alert(dato.messageError);
				return;
			}

			if(dato.results.length > 0){

				var cookieSelezione = _this.selezione;
				_this.prodotto.codice =  dato.results[0].codice;
				_this.prodotto.descrizione = dato.results[0].descrizione;
				_this.prodotto.costo = Number(dato.results[0].costo);

				cookieSelezione.prodotto.costo_totale = Number(_this.prodotto.costo);
				_this.prezzoTotale = _this.prodotto.costo;
			}else{
				alert("Non è stata trovata nessuna porta tagliafuoco! Contattare l'amministratore del sistema comunicando i seguenti valori per la risoluzione del problema\nTipologia: "+_this.tipologia+"\nLarghezza: "+_this.porta.L+"\nAltezza: "+_this.porta.H);
				jQuery("#Form"+jQuery.getCookie("selezione").tipologia).trigger("click");
				return;
			}

			//$.Log("Selezione");
			//$.Log(_this.selezione);
		}


		if(_this.validita)
			jQuery.postJSON("Porte","getPorte","private", porta, false, callBackPrezzo);

	}



	_this.getRiepilogo = function(){


		var inImballo = 1;
		var tmpSX = 1;
		var tmpDX = 0;
		var quantita = 1;

		if(_this.selezione.prodotto.quantita > 0){
			tmpSX = Number(_this.selezione.prodotto.quantitaSX);
			tmpDX = Number(_this.selezione.prodotto.quantitaDX);
			quantita = _this.selezione.prodotto.quantita;
			if(_this.selezione.prodotto.quantitaImballo > 0)
				inImballo = Number(_this.selezione.prodotto.quantitaImballo);
		}



		var riepilogo = "";
		riepilogo += "<h3>RIFERIMENTO: "+_this.selezione.riferimento+"</h3>";
		riepilogo += "Tipologia: <b>"+_this.selezione.tipologia+"</b><br>";
		riepilogo += "Dimensioni porta LxH(mm): <b>"+_this.selezione.porta.L+"x"+_this.selezione.porta.H+"</b><br>";
		riepilogo += "Numero ante: <b>"+_this.selezione.ante+"</b><br>";
		riepilogo += "Quantità: <b>" + quantita + "</b><br>";

		if(!_this.selezione.validita){
			if(_this.selezione.prodotto.sconto > 0)
			riepilogo += "Sconto da applicare: <b>" +_this.selezione.prodotto.sconto+ "%</b><br>" ;
			else
			riepilogo += "<b>Nessuno sconto da applicare</b><br>" ;
		}


		//riepilogo += "Areazione: <b>"+_this.areazione.tipoAreazione+"</b><br>";
		//if(_this.areazione.grigliaSuperiore)
		//	riepilogo += "• Griglia superiore<br>";
		//if(_this.areazione.grigliaInferiore)
		//	riepilogo += "• Griglia inferiore<br>";

		if(!_this.selezione.validita){
			riepilogo += "<br><div class='alert alert-warning'><i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i> Attenzione! Le scelte precedenti non consentono al sistema";
			riepilogo += " emetta un preventivo completo dei costi</div>";
		}else{

			// MODIFICO I VALORI DELLA PORTA
			var costo = Number(_this.selezione.prodotto.costo);
			var totale = costo*quantita;
				sconto = Number(_this.selezione.prodotto.sconto);
			var totale_scontato = totale - (totale*sconto)/100;

			_this.selezione.prodotto.totale_non_scontato = totale;
			_this.selezione.prodotto.costo_totale = totale_scontato;
			_this.selezione.prodotto.quantita = quantita;



			riepilogo += "Totale: <b>" + totale.format(false,2) + " EUR</b><br>";
			riepilogo += "<div class='boxSconto'>Sconto: <input type='text' id='prodotto' class='sconto form-control' value='"+sconto+"' totale='"+totale_scontato+"' style='display:inline-block;width:50px;' maxlength='3'/>%<br></div>";
			riepilogo += "Totale scontato: <b><span id='scontoProdottoTotale'>" + totale_scontato.format(false,2) + "</span> EUR</b><br>";
			riepilogo += "<br>";
		}


		var isAccessori = false;
		var riepilogoAccessori = "";

		if(_this.selezione.accessori.oblo){

			isAccessori = false;

			riepilogoAccessori += "<fieldset style='margin-bottom:15px'><legend style=\"font-size:14px;margin-bottom:10px;\"><b>OBLO'</b></legend>";

			var anta_principale = _this.selezione.accessori.oblo[0];
			var anta_secondaria = _this.selezione.accessori.oblo[1];

			if(anta_principale){
				if(anta_principale.type == "rect1"){
					riepilogoAccessori += "Oblò rettangolare per anta principale: <br>";
					riepilogoAccessori += "Altezza: <b>"+anta_principale.larghezza + "</b> (mm), larghezza: <b>"+anta_principale.altezza+"</b> (mm)<br><br>";
				}
				if(anta_principale.type == "circ1"){
					riepilogoAccessori += "Oblò circolare per anta principale: <br>";
					riepilogoAccessori += "Diametro: <b>"+anta_principale.diametro + "</b> (mm)<br>";
				}
			}

			if(anta_secondaria){
				if(anta_secondaria.type == "rect2"){
					riepilogoAccessori += "Oblò rettangolare per anta secondaria: <br>";
					riepilogoAccessori += "Altezza: <b>"+anta_secondaria.larghezza + "</b> (mm), larghezza: <b>"+anta_secondaria.altezza+"</b> (mm)<br><br>";
				}
				if(anta_secondaria.type == "circ2"){
					riepilogoAccessori += "Oblò circolare per anta secondaria: <br>";
					riepilogoAccessori += "Diametro: <b>"+anta_secondaria.diametro + "</b> (mm)<br>";
				}
			}
			riepilogoAccessori += "</fieldset>";
		}

		if(_this.selezione.accessori.sistemaChiusura){

				isAccessori = true;
				riepilogoAccessori += "<fieldset style='margin-bottom:15px'><legend style=\"font-size:14px;margin-bottom:10px;\"><b>SISTEMA DI CHIUSURA</b></legend>";
				var codiceSistema = "";
					if(jQuery.validaValore(_this.selezione.accessori.sistemaChiusura.tipologia)){
						codiceSistema = _this.selezione.accessori.sistemaChiusura.codice + "1-"+_this.selezione.accessori.sistemaChiusura.tipologia;
					}else
						codiceSistema = _this.selezione.accessori.sistemaChiusura.codice;

				riepilogoAccessori += "Codice: <b>" + codiceSistema + "</b><br>";
				riepilogoAccessori += "Descrizione: <b>" + _this.selezione.accessori.sistemaChiusura.descrizione + "</b><br>";
				riepilogoAccessori += "Tipo consegna: " + (_this.selezione.accessori.sistemaChiusura.tipologia == "APP"?"<b>applicato</b><br>":"<b>in imballo</b><br>");
				riepilogoAccessori += "Quantità: <b>" + quantita + "</b><br>";

				var totale = Number(_this.selezione.accessori.sistemaChiusura.costo*quantita);
					sconto = Number(_this.selezione.accessori.sistemaChiusura.sconto);
				var totale_scontato = totale - (totale*sconto)/100;

				_this.selezione.accessori.sistemaChiusura.totale_non_scontato = totale;
				_this.selezione.accessori.sistemaChiusura.costo_totale = totale_scontato;
				_this.selezione.accessori.sistemaChiusura.quantita = quantita;

				if(_this.selezione.validita){
					riepilogoAccessori += "Prezzo: <b>" + Number(_this.selezione.accessori.sistemaChiusura.costo).format(false,2) + " EUR</b><br>";
					riepilogoAccessori += "Totale: <b>"+totale.format(false,2)+" EUR</b><br>";
					riepilogoAccessori += "<div class='boxSconto'>Sconto: <input type='text' id='sistemaChiusura' totale='"+totale+"' style='width:50px;display:inline-block;' class='sconto form-control' value='"+sconto+"' maxlength='3'/>%<br></div>";
					riepilogoAccessori += "Totale scontato: <b><span id='scontoSistemaChiusuraTotale'>"+totale_scontato.format(false,2)+"</span> EUR</b>";
				}
				riepilogoAccessori += "</fieldset>";
			}


			if(jQuery.validaValore(_this.verniciatura)){
				riepilogoAccessori += "<fieldset style='margin-bottom:15px'><legend style=\"font-size:14px;margin-bottom:10px;\"><b>VERNICIATURA</b></legend>";
				riepilogoAccessori += "Codice RAL: <b>" + _this.verniciatura.codice + "</b></fieldset>"; 

			}


		if(isAccessori){
			riepilogo += "<h4 class='title_h4'>Accessori:</h4>";
			riepilogo += riepilogoAccessori;
		}


		riepilogo += "<br>";


		riepilogo += "<span id='messageQuantita'>";

		if(_this.selezione.accessori.sistemaChiusura){
			if(_this.selezione.accessori.sistemaChiusura.tipologia == "APP"){
				riepilogo += "<b>Quantità con apertura a tirare a sinistra</b>:";
				riepilogo += "<input type='text' class='quantitaProdotto form-control' id=\"quantitaSX\" value='"+tmpSX+"' maxlength='3' style='display:inline-block;width:150px;'></span><br>";
				riepilogo += "<span id='messageQuantita'><br>";
				riepilogo += 	"<b>Quantità con apertura a tirare a destra</b>: ";
				riepilogo += 	"<input type='text' class='quantitaProdotto form-control' value='"+tmpDX+"' maxlength='3' id=\"quantitaDX\" style='display:inline-block;width:150px;'>";
				riepilogo += "</span><br><br>";
			}else{
				riepilogo += "<b>Quantità in imballo</b>: </h4><input type='text' class='quantitaProdotto form-control' id=\"quantitaImballo\" value='"+inImballo+"' maxlength='3' style='display:inline-block;width:150px;'></span><br><br>";

			}
		}else{
			riepilogo += "<b>Quantità in imballo</b>: </h4><input type='text' class='quantitaProdotto form-control' id=\"quantitaImballo\" value='"+inImballo+"' maxlength='3' style='display:inline-block;width:150px;'></span><br><br>";
		}


		return riepilogo;
	}


	_this.activeButtonRepeatQuantita = function(){

		jQuery("#repeatQuantita").click(function(){

			  if(jQuery(this).is(":checked")){
				  if(_this.selezione.accessori.sistemaChiusura.tipologia != "in imballo"){

					  jQuery("#quantitaSX").val(_this.selezione.prodotto.quantitaSX);
					  jQuery("#quantitaSX").prop("disabled",true);
					  jQuery("#quantitaDX").val(_this.selezione.prodotto.quantitaDX);
					  jQuery("#quantitaDX").prop("disabled",true);

				  }else{

					  jQuery("#quantitaImballo").val(_this.selezione.prodotto.quantitaImballo);
					  jQuery("#quantitaImballo").prop("disabled",true);
				  }

			}else{
				jQuery(".quantitaProdotto").prop("disabled",false);
			}

			var e = jQuery.Event("keyup");
			jQuery(".quantitaProdotto").trigger(e);

		});

		if(_this.selezione.modifica.boo){
			jQuery("#repeatQuantita").trigger("click");
		}

		jQuery(".quantitaProdotto").on("keypress", function(e){
			return jQuery.onlynumbers(e);
		});

	}


	_this.getValidita = function(){
		return _this.validita;
	}


	_this.getSistemaChiusura = function(){

		_this.sistemaChiusura = _this.accessori.sistemaChiusura;
		if(jQuery.validaValore(_this.sistemaChiusura)){
			_this.siAccessori = true;
			for(var i = 0;i < _this.sistemaChiusura.length;i++)
				_this.prezzoTotale += _this.sistemaChiusura[i].totale;
		}

	}

	_this.getVerniciatura = function(){

		_this.verniciatura = _this.accessori.verniciatura;
		if(jQuery.validaValore(_this.verniciatura)){
			_this.siAccessori = true;
			//_this.prezzoTotale += _this.verniciatura.totale;
		}

	}


	_this.getPrezzoScontato = function(){
		var prezzoTotale = 0;
			prezzoTotale += Number(_this.selezione.prodotto.costo_totale);

		if(_this.selezione.accessori.sistemaChiusura){
			prezzoTotale += Number(_this.selezione.accessori.sistemaChiusura.costo_totale);
		}


		_this.selezione.totaleScontato = prezzoTotale;
		return prezzoTotale;
	}

	_this.getPrezzoTotale = function(){

		// TOTALE SCONTATO DELLA PORTA
		var prezzoTotale = 0;
		prezzoTotale += Number(_this.selezione.prodotto.totale_non_scontato);


		// TOTALE SCONTATO DEL SISTEMA DI CHIUSURA
		if(_this.selezione.accessori.sistemaChiusura){
			prezzoTotale += Number(_this.selezione.accessori.sistemaChiusura.totale_non_scontato);
		}

		_this.selezione.totale = prezzoTotale;

		return prezzoTotale;
	}



	_this.ricalcolaTotale = function(prodotto){

		var cookieSelezione = prodotto;

		var totaleProdotto = 0;
		totaleProdotto = cookieSelezione.prodotto.costo_totale;
		var quantita = cookieSelezione.prodotto.quantita;


		_this.id = cookieSelezione.id;
		_this.riferimento = cookieSelezione.riferimento;
		_this.tipologia = cookieSelezione.tipologia;

		_this.prodotto = cookieSelezione.prodotto;

		if(jQuery.validaValore(_this.sistemaChiusura)){
			for(var i = 0;i < _this.sistemaChiusura.length;i++){
				var totaleSistemaChiusura = _this.sistemaChiusura[i].totale;
				totaleProdotto += totaleSistemaChiusura;
			}
		}

		/*if(jQuery.validaValore(_this.verniciatura)){
			for(var i = 0;i < _this.verniciatura.vernici.length;i++){
				if(_this.verniciatura.vernici[i].codice != null){
					totaleVerniciatura = _this.verniciatura.vernici[i].totale;
					totaleProdotto += totaleVerniciatura;
				}
			}
		}*/

		return totaleProdotto*quantita;
	}


	_this.ricalcolaTotaleScontato = function(prodotto){

		var cookieSelezione = prodotto;

		var totaleProdottoScontato = 0;

		var prezzoProdotto = cookieSelezione.prodotto.costo_totale;
		var quantita = cookieSelezione.prodotto.quantita;
		var scontoProdotto = cookieSelezione.prodotto.sconto;
		var tmpScontato = prezzoProdotto - (prezzoProdotto * scontoProdotto)/100;
		var totaleProdottoScontato = tmpScontato;

		//$.Log("Totale prodotto: " + tmpScontato);

		_this.id = cookieSelezione.id;
		_this.riferimento = cookieSelezione.riferimento;
		_this.tipologia = cookieSelezione.tipologia;
		//_this.sopraluce = cookieSelezione.accessori.sopraluce;
		_this.prodotto = cookieSelezione.prodotto;

		if(jQuery.validaValore(_this.sistemaChiusura)){
			for(var i = 0;i < _this.sistemaChiusura.length;i++){
				var totaleSistemaChiusura = _this.sistemaChiusura[i].totale;
				var scontoSistemaChiusura = _this.sistemaChiusura[i].sconto;
				var tmpScontato = (totaleSistemaChiusura - (totaleSistemaChiusura * scontoSistemaChiusura)/100);
				totaleProdottoScontato += tmpScontato;
				//$.Log("Totale sistema chiusura: " + tmpScontato);
			}
		}


		/*if(jQuery.validaValore(_this.verniciatura)){
			for(var i = 0;i < _this.verniciatura.vernici.length;i++){
				if(_this.verniciatura.vernici[i].codice != null){
					var sconto = Number(_this.verniciatura.vernici[i].sconto);
					var tot = _this.verniciatura.vernici[i].totale - _this.verniciatura.vernici[i].totale*sconto/100;
					totaleProdottoScontato += tot;
				}
			}
		}*/

		return totaleProdottoScontato*quantita;
	}

	_this.aggiornaRiepilogo = function(){

		var cookieSelezione = jQuery.getCookie("selezione")	;

		var totQuantita = 0;
		jQuery(".quantitaProdotto").each(function(){
			totQuantita += parseInt(jQuery(this).val());
		});

		cookieSelezione.modifica.boo = false;
		cookieSelezione.modifica.id = null;
		cookieSelezione.indietro = false;
		cookieSelezione.currentStep = 0;
		cookieSelezione.prodotto.quantita = totQuantita;


		if(jQuery.validaValore(_this.selezione.accessori.sistemaChiusura)){
			if(_this.selezione.accessori.sistemaChiusura.tipologia != "in imballo"){
				cookieSelezione.prodotto.quantitaSX = Number(jQuery("#quantitaSX").val());
				cookieSelezione.prodotto.quantitaDX = Number(jQuery("#quantitaDX").val());
				cookieSelezione.prodotto.quantitaImballo = 1;
			}else{
				cookieSelezione.prodotto.quantitaSX = 1;
				cookieSelezione.prodotto.quantitaDX = 0;
				cookieSelezione.prodotto.quantitaImballo = Number(jQuery("#quantitaImballo").val());
				}
		}

		if(_this.getValidita()){
			cookieSelezione.totale = _this.getPrezzoTotale()*totQuantita;
			cookieSelezione.totaleScontato = _this.getPrezzoScontato()*totQuantita;
		}else{
			cookieSelezione.totale = 0;
			cookieSelezione.totaleScontato = 0;
		}

		jQuery.registerCookie("selezione",cookieSelezione);
	}


	_this.viewRiepilogo = function(){


		var inImballo = 1;
		var tmpSX = 1;
		var tmpDX = 0;
		var quantita = 1;

		if(_this.selezione.prodotto.quantita > 0){
			tmpSX = Number(_this.selezione.prodotto.quantitaSX);
			tmpDX = Number(_this.selezione.prodotto.quantitaDX);
			quantita = _this.selezione.prodotto.quantita;
			if(_this.selezione.prodotto.quantitaImballo > 0)
				inImballo = Number(_this.selezione.prodotto.quantitaImballo);
		}



		var riepilogo = "";
		riepilogo += "<h4 class='title_h4'>RIFERIMENTO: "+_this.selezione.riferimento+"</h4>";
		riepilogo += "Tipologia: <b>"+_this.selezione.tipologia+"</b><br>";
		riepilogo += "Dimensioni porta LxH(mm): <b>"+_this.selezione.porta.L+"x"+_this.selezione.porta.H+"</b><br>";
		riepilogo += "Numero ante: <b>"+_this.selezione.ante+"</b><br>";

		if(!_this.selezione.validita){
			if(_this.selezione.prodotto.sconto > 0)
			riepilogo += "Sconto da applicare: <b>" +_this.selezione.prodotto.sconto+ "%</b><br>" ;
			else
			riepilogo += "<b>Nessuno sconto da applicare</b><br>" ;
		}



		$.Log("OOHOHOHOHOO");
		$.Log(_this.selezione);


		//riepilogo += "Areazione: <b>"+_this.areazione.tipoAreazione+"</b><br>";
		//if(_this.areazione.grigliaSuperiore)
		//	riepilogo += "• Griglia superiore<br>";
		//if(_this.areazione.grigliaInferiore)
		//	riepilogo += "• Griglia inferiore<br>";

		if(!_this.selezione.validita){
			riepilogo += "<br><div class='alert alert-warning'><i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i> Attenzione! Le scelte precedenti con consentono al sistema";
			riepilogo += " emetta un preventivo completo dei costi</div>";
		}else{

			// MODIFICO I VALORI DELLA PORTA
			var costo = Number(_this.selezione.prodotto.costo);
			var totale = costo*quantita;
				sconto = Number(_this.selezione.prodotto.sconto);
			var totale_scontato = totale - (totale*sconto)/100;

			riepilogo += "Sconto: <b>"+sconto+"%</b><br>";
			riepilogo += "Quantità: <b>" + quantita + "</b><br>";
			riepilogo += "Totale: <b>" + totale.format(false,2) + " EUR</b><br>";
			riepilogo += "Totale scontato: <b>" + totale_scontato.format(false,2) + " EUR</b><br>";
			riepilogo += "<br>";
		}


		var isAccessori = false;
		var riepilogoAccessori = "";

		if(_this.selezione.accessori.oblo){

			isAccessori = true;

			var anta_principale = _this.selezione.accessori.oblo[0];
			var anta_secondaria = _this.selezione.accessori.oblo[1];	
			
			riepilogoAccessori += "<fieldset style='margin-bottom:15px'><legend style=\"font-size:14px;margin-bottom:10px;\"><b>OBLO'</b></legend>";

			if(anta_principale){
				if(anta_principale.type == "rect1"){
					riepilogo += "Oblò rettangolare per anta principale: <br>";
					riepilogo += "Altezza: <b>"+anta_principale.larghezza + "</b> (mm), larghezza: <b>"+anta_principale.altezza+"</b> (mm)<br><br>";
				}
				if(anta_principale.type == "circ1"){
					riepilogo += "Oblò circolare per anta principale: <br>";
					riepilogo += "Diametro: <b>"+anta_principale.diametro + "</b> (mm)<br><br>";
				}
			}

			if(anta_secondaria){
				if(anta_secondaria.type == "rect2"){
					riepilogo += "Oblò rettangolare per anta secondaria: <br>";
					riepilogo += "Altezza: <b>"+anta_secondaria.larghezza + "</b> (mm), larghezza: <b>"+anta_secondaria.altezza+"</b> (mm)<br><br>";
				}
				if(anta_secondaria.type == "circ2"){
					riepilogo += "Oblò circolare per anta secondaria: <br>";
					riepilogo += "Diametro: <b>"+anta_secondaria.diametro + "</b> (mm)<br><br>";
				}
			}
			
			riepilogoAccessori += "</fieldset>";
		}

		if(_this.selezione.accessori.sistemaChiusura){

				isAccessori = true;
				riepilogoAccessori += "<fieldset style='margin-bottom:15px'><legend style=\"font-size:14px;margin-bottom:10px;\"><b>SISTEMA DI CHIUSURA</b></legend>";

				var codiceSistema = "";
					if(jQuery.validaValore(_this.selezione.accessori.sistemaChiusura.tipologia)){
						codiceSistema = _this.selezione.accessori.sistemaChiusura.codice + "1-"+_this.selezione.accessori.sistemaChiusura.tipologia;
					}else
						codiceSistema = _this.selezione.accessori.sistemaChiusura.codice;

				riepilogoAccessori += "Codice: <b>" + codiceSistema + "</b><br>";
				riepilogoAccessori += "Descrizione: <b>" + _this.selezione.accessori.sistemaChiusura.descrizione + "</b><br>";
				riepilogoAccessori += "Tipo consegna: " + (_this.selezione.accessori.sistemaChiusura.tipologia == "APP"?"<b>applicato</b><br>":"<b>in imballo</b><br>");
				riepilogoAccessori += "Quantità: <b>" + quantita + "</b><br>";
				riepilogoAccessori += "Sconto: <b>"+sconto+"%</b><br>";

				var totale = Number(_this.selezione.accessori.sistemaChiusura.costo*quantita);
					sconto = Number(_this.selezione.accessori.sistemaChiusura.sconto);
				var totale_scontato = totale - (totale*sconto)/100;

				_this.selezione.accessori.sistemaChiusura.totale_non_scontato = totale;
				_this.selezione.accessori.sistemaChiusura.costo_totale = totale_scontato;
				_this.selezione.accessori.sistemaChiusura.quantita = quantita;

				if(_this.selezione.validita){
					riepilogoAccessori += "Prezzo: <b>" + Number(_this.selezione.accessori.sistemaChiusura.costo).format(false,2) + " EUR</b><br>";
					riepilogoAccessori += "Totale: <b>"+totale.format(false,2)+" EUR</b><br>";
					riepilogoAccessori += "Totale scontato: <b>"+totale_scontato.format(false,2)+" EUR</b>";
				}
				riepilogoAccessori += "</fieldset>";
			}


			if(jQuery.validaValore(_this.verniciatura)){
				riepilogoAccessori += "<fieldset style='margin-bottom:15px'><legend style=\"font-size:14px;margin-bottom:10px;\"><b>VERNICIATURA</b>";
				riepilogoAccessori += "Codice RAL: <b>" + _this.verniciatura.codice + "</b></fieldset>"; 

			}


		if(isAccessori){
			riepilogo += "<h4 class='title_h4'>Accessori:</h4>";
			riepilogo += riepilogoAccessori;
		}


		riepilogo += "<br>";


		riepilogo += "<span id='messageQuantita'>";

		if(_this.selezione.accessori.sistemaChiusura){
			if(_this.selezione.accessori.sistemaChiusura.tipologia == "APP"){
				riepilogo += "<b>Quantità con apertura a tirare a sinistra: #"+tmpSX+"</b><br>";
				riepilogo += "<b>Quantità con apertura a tirare a destra: #"+tmpDX+"</b><br>";
			}else{
				riepilogo += "<b>Quantità in imballo: #"+inImballo+"</b><br><br>";

			}
		}else{
			riepilogo += "<b>Quantità in imballo: #"+inImballo+"</b><br><br>";
		}


		return riepilogo;
	}

}
