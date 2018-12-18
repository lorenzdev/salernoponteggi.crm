var PortaMultiuso = function(main){

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


	_this.prezzoTotale = 0;


	_this.init = function(selezione){

		_this.selezione = selezione;

		_this.id = _this.selezione.id;
		_this.riferimento = _this.selezione.riferimento;
		_this.accessori = _this.selezione.accessori;
		_this.tipologia = _this.selezione.tipologia;
		_this.areazione = _this.selezione.areazione;
		_this.apertura = _this.selezione.apertura;
		_this.porta = _this.selezione.porta;
		_this.sopraluce = _this.selezione.accessori.sopraluce;
		_this.prodotto = _this.selezione.prodotto;
		_this.validita = _this.selezione.validita;

		if(_this.validita){
			_this.findProdotto();
		}

		_this.getSopraluce();
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
			"ante": 1
		}

		function callBackPrezzo(dato){

			//$.Log("Risultati porta multiuso!");
			//$.Log(dato);

			if(!dato.success){
				alert(dato.messageError);
				return;
			}



			if(dato.results.length > 0){
				////$.Log(dato.results.codice);


				var cookieSelezione = _this.selezione;
				//_this.prodotto.sconto = cookie.prodotto.sconto;

				_this.prodotto.codice =  dato.results[0].codice;
				_this.prodotto.descrizione = dato.results[0].descrizione;
				_this.prodotto.costo = Number(dato.results[0].costo);

			}else{
				alert("Non è stata trovata nessuna porta multiuso! Contattare l'amministratore del sistema comunicando i seguenti valori per la risoluzione del problema\nTipologia: "+_this.tipologia+ "\nLarghezza: "+_this.porta.L+"\nAltezza: "+_this.porta.H);
				jQuery("#Form"+jQuery.getCookie("selezione").tipologia).trigger("click");
				return;
			}


			//$.Log("Selezione");
			//$.Log(_this.selezione);


		}

		//$.Log("QueryPorta");
		//$.Log(porta);

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
			inImballo = Number(_this.selezione.prodotto.quantitaImballo);
		}

		var riepilogo = "";
		riepilogo += "<h3>RIFERIMENTO: "+_this.selezione.riferimento+"</h3>";
		riepilogo += "Tipologia: <b>"+_this.selezione.tipologia+"</b><br>";
		riepilogo += "Dimensioni porta LxH(mm): <b>"+_this.selezione.porta.L+"x"+_this.selezione.porta.H+"</b><br>";
		riepilogo += "Areazione: <b>"+_this.selezione.areazione.tipoAreazione+"</b><br>";
		if(_this.selezione.areazione.grigliaSuperiore)
			riepilogo += "• Griglia superiore<br>";
		if(_this.selezione.areazione.grigliaInferiore)
			riepilogo += "• Griglia inferiore<br>";

		if(!_this.selezione.validita){
			if(_this.selezione.prodotto.sconto > 0)
			riepilogo += "Sconto da applicare: <b>" +_this.selezione.prodotto.sconto+ "%</b><br>" ;
			else
			riepilogo += "<b>Nessuno sconto da applicare</b><br>" ;
		}

		if(_this.selezione.validita){


		}else{
			riepilogo += "<br><div class='alert alert-warning'><i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i> Attenzione! Le scelte effettuate non consentono al sistema di";
			riepilogo += " emettere un preventivo completo dei costi</div>";

		}

		if(_this.selezione.validita){

			var costo = Number(_this.selezione.prodotto.costo);
			var totale = costo*quantita;
				sconto = Number(_this.selezione.prodotto.sconto);
			var totale_scontato = totale - (totale*sconto)/100;


			_this.selezione.prodotto.totale_non_scontato = totale;
			_this.selezione.prodotto.costo_totale = totale_scontato;
			_this.selezione.prodotto.quantita = quantita;

			riepilogo += "Codice: <b>" + _this.selezione.prodotto.codice + "</b><br>";
			riepilogo += "Descrizione: <b>"+_this.selezione.prodotto.descrizione + "</b><br>";

			if(_this.selezione.aerazione){
				riepilogo += "Tipo aerazione: "+_this.selezione.aerazione.tipoAreazione+"<br>";
				if(_this.selezione.aerazione.grigliaSuperiore)
					riepilogo += "Griglia superiore";
				if(_this.selezione.aerazione.grigliInferiore)
					riepilogo += "Griglia inferiore";
			}


			riepilogo += "Prezzo: <b>" + costo.format(false,2) + " EUR</b><br>";
			riepilogo += "Quantità: <b>" + quantita + "</b><br>";
			riepilogo += "Totale: <b>" + Number(totale).format(false,2) + " EUR</b><br>";
			riepilogo += "<div class='boxSconto'>Sconto: <input type='text' id='prodotto' class='sconto form-control' value='"+sconto+"' totale='"+totale+"' style='width:50px;display:inline-block;' maxlength='3'/>%<br></div><br>";
			riepilogo += "Prezzo totale scontato: <b><span id='scontoProdottoTotale'>" + totale_scontato.format(false,2) + "</span> EUR</b><br>";

		}

		if(_this.siAccessori){
			riepilogo += "<h4 class='title_h4'>Accessori:</h4>";

			//$.Log("QUI!");

			if(_this.selezione.accessori.sopraluce){

				riepilogo += "<fieldset style='margin-bottom:15px'><legend style=\"font-size:14px;margin-bottom:10px;\"><b>SOPRALUCE DI "+_this.selezione.accessori.sopraluce.height+" (mm) di altezza</b></lengend>";
				riepilogo += "Descrizione: <b>" + _this.selezione.accessori.sopraluce.codice + "</b></fieldset>"; 
				//riepilogo += "Prezzo al ML: <b>" + Number(_this.selezione.accessori.sopraluce.costo).format(false,2) + " EUR</b><br>"; 	
				//riepilogo += "Totale: <b>" + Number(_this.selezione.accessori.sopraluce.totale).format(false,2) + "</b> EUR<br>"; 

			/*if(_this.selezione.accessori.validita){
				var tot = _this.selezione.accessori.sopraluce.totale;
				var totaleScontato = tot - tot*_this.selezione.accessori.sopraluce.sconto/100;
				riepilogo += "Totale scontato: <b><span id='scontoSopraluceTotale'>"+Number(totaleScontato).format(false,2)+"</span> EUR</b>";
				riepilogo += "<div class='boxSconto'>Sconto: <input type='text' id='scontoSopraluce' style='width:40px;' class='sconto' totale='"+tot+"' value='"+_this.selezione.accessori.sopraluce.sconto+"' />%<br></div>";
				}

				riepilogo += "<br>";
				_this.selezione.accessori.prezzoTotale += _this.selezione.accessori.sopraluce.totale;
			}	*/
			}




			if(_this.selezione.accessori.sistemaChiusura){

				riepilogo += "<fieldset style='margin-bottom:15px'><legend style=\"font-size:14px;margin-bottom:10px;\"><b>SISTEMA DI CHIUSURA</b></legend>";

				var codiceSistema = "";
					if(_this.selezione.accessori.sistemaChiusura.tipologia){
						codiceSistema = _this.selezione.accessori.sistemaChiusura.codice + "1-"+_this.selezione.accessori.sistemaChiusura.tipologia;
					}else
						codiceSistema = _this.selezione.accessori.sistemaChiusura.codice;


				riepilogo += "Codice: <b>" + codiceSistema + "</b><br>";
				riepilogo += "Descrizione: <b>" + _this.selezione.accessori.sistemaChiusura.descrizione + "</b><br>";
				riepilogo += "Tipo consegna: " + (_this.selezione.accessori.sistemaChiusura.tipologia == "APP"?"<b>applicato</b><br>":"<b>in imballo</b><br>");


				//$.Log("QUI!");

				if(_this.selezione.validita){

					var costo = Number(_this.selezione.accessori.sistemaChiusura.costo);
					var totale = costo*quantita;
						sconto = Number(_this.selezione.accessori.sistemaChiusura.sconto);
					var totale_scontato = totale - (totale*sconto)/100;

					_this.selezione.accessori.sistemaChiusura.totale_non_scontato = totale;
					_this.selezione.accessori.sistemaChiusura.costo_totale = totale_scontato;
					_this.selezione.accessori.sistemaChiusura.quantita = quantita;

					riepilogo += "Prezzo: <b>" + costo.format(false,2) + " EUR</b><br>";
					riepilogo += "Quantità: <b>" + quantita + "</b><br>";
					riepilogo += "Totale: <b>"+totale.format(false,2)+" EUR</b><br>";
					riepilogo += "Totale scontato: <b><span id='scontoSistemaChiusuraTotale'>"+Number(totale_scontato).format(false,2)+"</span> EUR</b>";
					riepilogo += "<div class='boxSconto'>Sconto: <input type='text' id='sistemaChiusura' totale='"+totale+"' style='width:50px;display:inline-block' class='sconto form-control' value='"+sconto+"' maxlength='3'/>%<br></div>";
					}
					riepilogo += "</fieldset>";

				}
			}

			if(_this.selezione.accessori.oblo){
				riepilogo += "<fieldset style='margin-bottom:15px'><legend style=\"font-size:14px;margin-bottom:10px;\"><b>OBL&Oacute;</b></legend>";
				

				if(_this.selezione.accessori.oblo[0].type == "rect"){
					riepilogo += "Forma rettangolare<br>";
					riepilogo += "Larghezza: <b>" + _this.selezione.accessori.oblo[0].larghezza+"</b> mm<br>";
					riepilogo += "Altezza: <b>" + _this.selezione.accessori.oblo[0].altezza+"</b> mm<br>";
				}

				if(_this.selezione.accessori.oblo[0].type == "circ"){
					riepilogo += "Forma circolare<br>";
					riepilogo += "Diametro: <b>" + _this.selezione.accessori.oblo[0].diametro+" mm</b><br>";
				}
				riepilogo += "</fieldset>";
			}


			if(_this.selezione.accessori.verniciatura){
				riepilogo += "<fieldset style='margin-bottom:15px'><legend style=\"font-size:14px;margin-bottom:10px;\"><b>VERNICIATURA</b</legend>";
				riepilogo += "Codice RAL: <b>" + _this.selezione.accessori.verniciatura.codice + "</b></fieldset>"; 
				

				/*var totaleVerniciatura = 0;
				for(var i = 0;i < _this.selezione.accessori.verniciatura.vernici.length;i++){

					if(_this.selezione.accessori.verniciatura.vernici[i].codice != null){
						var sconto = 0;
						sconto = _this.selezione.accessori.verniciatura.vernici[i].sconto;

						riepilogo += "<br>Codice: <b>" + _this.selezione.accessori.verniciatura.vernici[i].codice+"</b><br>";
						riepilogo += "Verniciatura per <b>" + _this.selezione.accessori.verniciatura.vernici[i].tipo+"</b><br>";
						var totV = _this.selezione.accessori.verniciatura.vernici[i].totale;
						var totaleScontatoV = totV - totV*sconto/100;

						if(_this.selezione.accessori.validita){
							riepilogo += "Prezzo: <b>" + Number(_this.selezione.accessori.verniciatura.vernici[i].costo).format(false,2)+" EUR</b><br>";
							riepilogo += "Totale: <b>" + Number(_this.selezione.accessori.verniciatura.vernici[i].totale).format(false,2)+" EUR</b><br>";
							riepilogo += "Totale scontato: <b><span id='scontoVerniciatura"+i+"Totale'>" + Number(totaleScontatoV).format(false,2) +" </span> EUR</b><br>";


						riepilogo += "<div class='boxSconto'>Sconto: <input type='text' id='scontoVerniciatura"+i+"' class='sconto' style='width:40px;' totale='"+totV+"' value='"+sconto+"' maxlength='3'/>%<br></div><br>";
						totaleVerniciatura += totV;

						}
					}

				}

				_this.prezzoTotale += totaleVerniciatura;*/
			}


		riepilogo += "<br>";
		riepilogo += "<span id='messageQuantita'>";

		if(_this.selezione.accessori.sistemaChiusura){

			tmpSX = Number(_this.selezione.prodotto.quantitaSX);
			tmpDX = Number(_this.selezione.prodotto.quantitaDX);
			inImballo = Number(_this.selezione.prodotto.quantitaImballo);


			if(_this.selezione.accessori.sistemaChiusura.tipologia == "APP"){
				riepilogo += "<b>Quantità con apertura a tirare a sinistra</b>: </h4><input type='text' style='display:inline-block;width:100px;' class='quantitaProdotto form-control' id=\"quantitaSX\" value='"+tmpSX+"' maxlength='3'></span><br><span id='messageQuantita'><br><b>Quantità con apertura a tirare a destra</b>: <input type='text' class='quantitaProdotto form-control' value='"+tmpDX+"' maxlength='3' id=\"quantitaDX\" style='display:inline-block;width:100px;'></span><br><br>";
			}else{
				riepilogo += "<b>Quantità in imballo</b>: </h4><input type='text' class='quantitaProdotto form-control' id=\"quantitaImballo\" value='"+inImballo+"' maxlength='3' style='display:inline-block;width:100px;'></span><br><br>";

			}
		}else{
			riepilogo += "<b>Quantità in imballo</b>: </h4><input type='text' class='quantitaProdotto form-control' id=\"quantitaImballo\" value='"+inImballo+"' maxlength='3' style='display:inline-block;width:100px;'></span><br><br>";
		}


		return riepilogo;
	}


	_this.activeButtonRepeatQuantita = function(){

		jQuery("#repeatQuantita").click(function(){

			if(jQuery(this).is(":checked")){

				tmpSX = parseInt(_this.selezione.prodotto.quantitaSX);
				tmpDX = parseInt(_this.selezione.prodotto.quantitaDX);
				tmpImballo = parseInt(_this.selezione.prodotto.quantitaImballo);

				jQuery("#quantitaSX").val(_this.selezione.prodotto.quantitaSX);
				jQuery("#quantitaSX").prop("disabled",true);
				jQuery("#quantitaDX").val(_this.selezione.prodotto.quantitaDX);
				jQuery("#quantitaDX").prop("disabled",true);

				jQuery("#quantitaImballo").val(_this.selezione.prodotto.quantitaImballo);
				jQuery("#quantitaImballo").prop("disabled",true);

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


	_this.getSopraluce = function(){

		_this.sopraluce = _this.accessori.sopraluce;
		if(jQuery.validaValore(_this.sopraluce)){
			_this.siAccessori = true;
			//_this.prezzoTotale += _this.sopraluce.totale;
		}
	}

	_this.getSistemaChiusura = function(){

		_this.sistemaChiusura = _this.accessori.sistemaChiusura;
		if(jQuery.validaValore(_this.sistemaChiusura)){
			_this.siAccessori = true;
			_this.prezzoTotale += _this.sistemaChiusura.costo_totale;
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

		// TOTALE SCONTATO DELLA PORTA
		var prezzoTotale = 0;
		prezzoTotale += Number(_this.selezione.prodotto.costo_totale);


		// TOTALE SCONTATO DEL SISTEMA DI CHIUSURA
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
		$.Log("1. " + _this.selezione.prodotto.totale_non_scontato);

		// TOTALE SCONTATO DEL SISTEMA DI CHIUSURA
		if(_this.selezione.accessori.sistemaChiusura){
			prezzoTotale += Number(_this.selezione.accessori.sistemaChiusura.totale_non_scontato);
			$.Log("2. " + _this.selezione.accessori.sistemaChiusura.totale_non_scontato);
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

		_this.sopraluce = cookieSelezione.accessori.sopraluce;
		_this.prodotto = cookieSelezione.prodotto;


		/*if(jQuery.validaValore(_this.sopraluce)){
			var totaleSopraluce = _this.sopraluce.articolo.totale;
			//totaleProdotto += totaleSopraluce;
		}*/


		if(jQuery.validaValore(_this.sistemaChiusura)){
			var totaleSistemaChiusura = _this.sistemaChiusura.costo_totale;
			totaleProdotto += totaleSistemaChiusura;
		}

		/*if(jQuery.validaValore(_this.verniciatura)){
			for(var i = 0;i < _this.verniciatura.vernici.length;i++){
				if(_this.verniciatura.vernici[i].codice != null){
					totaleVerniciatura = _this.verniciatura.vernici[i].totale;
					totaleProdotto += totaleVerniciatura;
				}
			}
		}*/

		//var totaleSopraluce = _this.sopraluce.totale;
		//totaleProdotto += totaleSopraluce;

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
		_this.sopraluce = cookieSelezione.accessori.sopraluce;
		_this.prodotto = cookieSelezione.prodotto;
		_this.getSopraluce();

		/*var totaleSopraluce = _this.sopraluce.totale;
		var scontoSopraluce = _this.sopraluce.sconto;
		var tmpScontato = (totaleSopraluce - (totaleSopraluce * scontoSopraluce)/100);
		totaleProdottoScontato += tmpScontato;


		if(jQuery.validaValore(_this.sopraluce)){
			var totaleSopraluce = _this.sopraluce.articolo.totale;
			var scontoSopraluce = _this.sopraluce.sconto;
			var tmpScontato = (totaleSopraluce - (totaleSopraluce * scontoSopraluce)/100);
			totaleProdottoScontato += tmpScontato;
			//$.Log("Totale sopraluce: " + tmpScontato);
		}
		*/

		if(jQuery.validaValore(_this.sistemaChiusura)){
			var totaleSistemaChiusura = _this.sistemaChiusura.costo_totale;
			var scontoSistemaChiusura = _this.sistemaChiusura.sconto;
			var tmpScontato = (totaleSistemaChiusura - (totaleSistemaChiusura * scontoSistemaChiusura)/100);
			totaleProdottoScontato += tmpScontato;
			//$.Log("Totale sistema chiusura: " + tmpScontato);
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

		var cookieSelezione = jQuery.getCookie("selezione");

		var totQuantita = 0;
		jQuery(".quantitaProdotto").each(function(){
			totQuantita += parseInt(jQuery(this).val());
		});

		cookieSelezione.modifica.boo = false;
		cookieSelezione.modifica.id = null;
		cookieSelezione.indietro = false;
		cookieSelezione.currentStep = 0;
		cookieSelezione.prodotto.quantita = totQuantita;


		if(cookieSelezione.accessori.sistemaChiusura){


			var costo = Number(cookieSelezione.accessori.sistemaChiusura.costo);
			var sconto = Number(cookieSelezione.accessori.sistemaChiusura.sconto);
			var tot = costo*totQuantita;
				tot = tot - (tot*sconto)/100;

			if(cookieSelezione.accessori.sistemaChiusura.tipologia != "in imballo"){
				cookieSelezione.prodotto.quantitaSX = jQuery("#quantitaSX").val();
				cookieSelezione.prodotto.quantitaDX = jQuery("#quantitaDX").val();
				cookieSelezione.prodotto.quantitaImballo = 1;
			}else{
				cookieSelezione.prodotto.quantitaSX = 1;
				cookieSelezione.prodotto.quantitaDX = 0;
				cookieSelezione.prodotto.quantitaImballo = jQuery("#quantitaImballo").val();
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
			inImballo = Number(_this.selezione.prodotto.quantitaImballo);
		}

		var riepilogo = "";
		riepilogo += "<h4 class='title_h4'>RIFERIMENTO: "+_this.selezione.riferimento+"</h4>";
		riepilogo += "Tipologia: <b>"+_this.selezione.tipologia+"</b><br>";
		riepilogo += "Dimensioni porta LxH(mm): <b>"+_this.selezione.porta.L+"x"+_this.selezione.porta.H+"</b><br>";
		riepilogo += "Areazione: <b>"+_this.selezione.areazione.tipoAreazione+"</b><br>";
		if(_this.selezione.areazione.grigliaSuperiore)
			riepilogo += "• Griglia superiore<br>";
		if(_this.selezione.areazione.grigliaInferiore)
			riepilogo += "• Griglia inferiore<br>";

		if(!_this.selezione.validita){
			if(_this.selezione.prodotto.sconto > 0)
			riepilogo += "Sconto da applicare: <b>" +_this.selezione.prodotto.sconto+ "%</b><br>" ;
			else
			riepilogo += "<b>Nessuno sconto da applicare</b><br>" ;
		}

		if(_this.selezione.validita){


		}else{
			if(jQuery.getCookie("utente").ruolo != "ROLE_ADMIN"){
				riepilogo += "<br><div class='alert alert-warning'><i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i> Attenzione! Le scelte effettuate non consentono al sistema di";
				riepilogo += " emettere un preventivo completo dei costi</div>";
			}
		}


		riepilogo += "Codice: <b>" + _this.selezione.prodotto.codice + "</b><br>";
		riepilogo += "Descrizione: <b>"+_this.selezione.prodotto.descrizione + "</b><br>";
		riepilogo += "Quantità: <b>" + quantita + "</b><br>";
		riepilogo += "Sconto: <b>"+sconto+"%</b><br>";
		
		if(_this.selezione.validita){

			var costo = Number(_this.selezione.prodotto.costo);
			var totale = costo*quantita;
				sconto = Number(_this.selezione.prodotto.sconto);
			var totale_scontato = totale - (totale*sconto)/100;


			

			if(_this.selezione.aerazione){
				riepilogo += "Tipo aerazione: "+_this.selezione.aerazione.tipoAreazione+"<br>";
				if(_this.selezione.aerazione.grigliaSuperiore)
					riepilogo += "Griglia superiore";
				if(_this.selezione.aerazione.grigliInferiore)
					riepilogo += "Griglia inferiore";
			}


			riepilogo += "Prezzo: <b>" + costo.format(false,2) + " EUR</b><br>";
			riepilogo += "Totale: <b>" + Number(totale).format(false,2) + " EUR</b><br>";
			
			riepilogo += "Prezzo totale scontato: <b>" + totale_scontato.format(false,2) + "EUR</b><br>";

		}



		var siAccessori = false;
		var riepilogoAccessori = "";


		if(_this.selezione.accessori.sopraluce){
			siAccessori = true;

			riepilogoAccessori += "<fieldset style='margin-bottom:15px'><legend style=\"font-size:14px;margin-bottom:10px;\"><b><b>SOPRALUCE DI "+_this.selezione.accessori.sopraluce.height+" (mm)</b> di altezza<b></fieldset>";
			riepilogoAccessori += "Descrizione: <b>" + _this.selezione.accessori.sopraluce.codice + "</b><br><br>"; 

		}


		if(_this.selezione.accessori.sistemaChiusura){
			siAccessori = true;
			riepilogoAccessori += "<fieldset style='margin-bottom:15px'><legend style=\"font-size:14px;margin-bottom:10px;\"><b>SISTEMA DI CHIUSURA</b></legend>";
			var codiceSistema = "";
			if(_this.selezione.accessori.sistemaChiusura.tipologia){
				codiceSistema = _this.selezione.accessori.sistemaChiusura.codice + "1-"+_this.selezione.accessori.sistemaChiusura.tipologia;
			}else
				codiceSistema = _this.selezione.accessori.sistemaChiusura.codice;


			riepilogoAccessori += "Codice: <b>" + codiceSistema + "</b><br>";
			riepilogoAccessori += "Descrizione: <b>" + _this.selezione.accessori.sistemaChiusura.descrizione + "</b><br>";
			riepilogoAccessori += "Tipo consegna: " + (_this.selezione.accessori.sistemaChiusura.tipologia == "APP"?"<b>applicato</b><br>":"<b>in imballo</b><br>");

				if(_this.selezione.validita){
					var costo = Number(_this.selezione.accessori.sistemaChiusura.costo);
					var totale = costo*quantita;
						sconto = Number(_this.selezione.accessori.sistemaChiusura.sconto);
					var totale_scontato = totale - (totale*sconto)/100;


					riepilogoAccessori += "Prezzo: <b>" + costo.format(false,2) + " EUR</b><br>";
					riepilogoAccessori += "Quantità: <b>" + quantita + "</b><br>";
					riepilogoAccessori += "Totale: <b>"+totale.format(false,2)+" EUR</b><br>";
					riepilogoAccessori += "Totale scontato: <b><span id='scontoSistemaChiusuraTotale'>"+Number(totale_scontato).format(false,2)+"</span> EUR</b><br>";
					riepilogoAccessori += "Sconto: <b>"+sconto+"%</b><br>";
				}
			riepilogoAccessori += "</fieldset>";

		}



		if(_this.selezione.accessori.oblo){
			siAccessori = true;
			riepilogoAccessori += "<fieldset style='margin-bottom:15px'><legend style=\"font-size:14px;margin-bottom:10px;\"><b>OBL&Oacute;</b></legend>";
				

			if(_this.selezione.accessori.oblo[0].type == "rect"){
				riepilogoAccessori += "Forma rettangolare<br>";
				riepilogoAccessori += "Larghezza: <b>" + _this.selezione.accessori.oblo[0].larghezza+"</b> mm<br>";
				riepilogoAccessori += "Altezza: <b>" + _this.selezione.accessori.oblo[0].altezza+"</b> mm<br>";
			}

			if(_this.selezione.accessori.oblo[0].type == "circ"){
				riepilogoAccessori += "Forma circolare<br>";
				riepilogoAccessori += "Diametro: <b>" + _this.selezione.accessori.oblo[0].diametro+" mm</b><br>";
			}
			riepilogoAccessori += "</fieldset>";
		}


		if(_this.selezione.accessori.verniciatura){
			siAccessori = true;
			riepilogoAccessori += "<fieldset style='margin-bottom:15px'><legend style=\"font-size:14px;margin-bottom:10px;\"><b>VERNICIATURA</b></legend>";
			riepilogoAccessori += "Codice RAL: <b>" + _this.selezione.accessori.verniciatura.codice + "</b></fieldset>"; 

		}


		if(siAccessori){
			riepilogo += "<h4 class='title_h4'>Accessori:</h4>";
			riepilogo += riepilogoAccessori;
		}


		riepilogo += "<br>";
		riepilogo += "<span id='messageQuantita'>";

		if(_this.selezione.accessori.sistemaChiusura){
			
			if(_this.selezione.accessori.sistemaChiusura.tipologia == "APP"){
					riepilogo += "<b>Quantità con apertura a tirare a sinistra: #"+tmpSX+"</b><br><b>Quantità con apertura a tirare a destra: #"+tmpDX+"</b><br><br>";
				}else{
					riepilogo += "<b>Quantità in imballo: #"+inImballo+"</b><br><br>";
	
				}
		}else{
			riepilogo += "<b>Quantità in imballo: #"+inImballo+"</b><br><br>";
		}


		return riepilogo;
	}





}
