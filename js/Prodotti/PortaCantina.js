var PortaCantina = function(main){

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
	}

	_this.getTipologiaProgetto = function(){

		return _this.validita;
	}

	_this.findProdotto = function(){

		var porta_cantina = {
			"tipologia": _this.tipologia,
			"areazione":_this.areazione,
			"apertura":_this.apertura,
			"L": _this.porta.L,
			"H":_this.porta.H
		}

		function callBackPrezzo(dato){

			//$.Log("QUIQIIQIQIQIIQIQI");
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
				_this.prodotto.costo_totale = Number(dato.results[0].costo);

			}else{
				alert("Non è stata trovata nessuna porta cantina! Contattare l'amministratore del sistema comunicando i seguenti valori per la risoluzione del problema\nTipologia: "+_this.tipologia+"\nLarghezza: "+_this.porta.L+"\nAltezza: "+_this.porta.H);
				jQuery("#Form"+_this.selezione.tipologia).trigger("click");
				return;
			}


			//$.Log("Selezione");
			//$.Log(_this.selezione);

		}


		if(_this.validita)
			jQuery.postJSON("PortaCantina","getPortaCantina","private", porta_cantina, false, callBackPrezzo);


	}



	_this.getRiepilogo = function(){


		var tmpSX = 1;
		var tmpDX = 0;
		var quantita = 1;

		if(_this.selezione.prodotto.quantita > 0){
			tmpSX = Number(_this.selezione.prodotto.quantitaSX);
			tmpDX = Number(_this.selezione.prodotto.quantitaDX);
			quantita = _this.selezione.prodotto.quantita;
		}

		var riepilogo = "";

		if(!_this.selezione.validita){
			riepilogo += "<br><div class='alert alert-warning'><i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i> Attenzione! Le scelte precedenti con consentono al sistema";
			riepilogo += " emetta un preventivo completo dei costi</div>";
		}

		riepilogo += "<h3>RIFERIMENTO: "+_this.riferimento+"</h3>";
		riepilogo += "Tipologia: <b>"+_this.tipologia+"</b><br>";
		riepilogo += "Dimensioni porta LxH(mm): <b>"+_this.porta.L+"x"+_this.porta.H+"</b><br>";
		riepilogo += "Apertura: <b>"+_this.apertura+"</b><br>";
		riepilogo += "Areazione: <b>"+_this.areazione+"</b><br>";
		if(_this.areazione.grigliaSuperiore)
			riepilogo += "• Griglia superiore<br>";
		if(_this.areazione.grigliaInferiore)
			riepilogo += "• Griglia inferiore<br>";

		if(_this.prodotto.sconto > 0)
			riepilogo += "Sconto da applicare: <b>" +_this.prodotto.sconto+ "%</b><br>" ;
			else
			riepilogo += "<b>Nessuno sconto da applicare</b><br>" ;



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
			riepilogo += "Prezzo: <b>" + costo.format(false,2) + " EUR</b><br>";
			riepilogo += "Quantità: <b>" + quantita + "</b><br>";
			riepilogo += "Totale: <b>" + Number(totale).format(false,2) + " EUR</b><br>";
			riepilogo += "<div class='boxSconto'>Sconto: <input type='text' id='prodotto' class='sconto form-control' value='"+sconto+"' totale='"+totale+"' style='width:50px;display:inline-block;' maxlength='3'/>%</div>";
			riepilogo += "Totale scontato: <b><span id='scontoProdottoTotale'>" + totale_scontato.format(false,2) + "</span> EUR</b><br>";

		}

		if(_this.selezione.accessori){

			if(_this.selezione.accessori.sopraluce){

				riepilogo += "<h4 class='title_h4'>Accessori:</h4>";
				riepilogo += "<fieldset style='margin-bottom:15px'><legend style=\"font-size:14px;margin-bottom:10px;\"><b>SOPRALUCE DI <b>"+_this.selezione.accessori.sopraluce.H+" (mm)</b> di altezza</b></legend>";
				//riepilogo += "Descrizione: <b>" + _this.sopraluce.descrizione + "</b><br>";  
				riepilogo += "Codice: <b>" + _this.selezione.accessori.sopraluce.codice + "</b><br>";  

				if(_this.selezione.validita){

					var costo = Number(_this.selezione.accessori.sopraluce.costo);
					var totale = costo*quantita;
					var sconto = Number(_this.selezione.accessori.sopraluce.sconto);
					var totale_scontato = totale - (totale*sconto)/100;

					_this.selezione.accessori.sopraluce.totale_non_scontato = totale;
					_this.selezione.accessori.sopraluce.costo_totale = totale_scontato;
					_this.selezione.accessori.sopraluce.quantita = quantita;

					riepilogo += "Prezzo al ML: <b>" + costo.format(false,2) + " EUR</b><br>";
					riepilogo += "Totale: <b>" +totale.format(false,2) + "</b> EUR<br>";
					riepilogo += "<div class='boxSconto'>Sconto: <input type='text' id='sopraluce' style='width:50px;display:inline-block;' class='sconto form-control' totale='"+totale+"' value='"+sconto+"' />%<br></div>";
					riepilogo += "Totale scontato: <b><span id='scontoSopraluceTotale'>"+totale_scontato.format(false,2)+"</span> EUR</b>";

				}
			riepilogo += "</fieldset>";

			}

		}

		riepilogo += "<span id='messageQuantita'><b>Quantità con apertura a sinistra</b>: </h4><input type='text' style='width:50px;display:inline-block' class='quantitaProdotto form-control' id=\"quantitaSX\" value='"+tmpSX+"' maxlength='3'></span><br><span id='messageQuantita'><br><b>Quantità con apertura a destra</b>: <input type='text' style='width:50px;display:inline-block' class='quantitaProdotto form-control' value='"+tmpDX+"' maxlength='3' id=\"quantitaDX\"></span><br><br>";


		return riepilogo;
	}

	_this.activeButtonRepeatQuantita = function(){

		jQuery("#repeatQuantita").click(function(){

			if(jQuery(this).is(":checked")){

				tmpSX = parseInt(_this.selezione.prodotto.quantitaSX);
				tmpDX = parseInt(_this.selezione.prodotto.quantitaDX);

				jQuery("#quantitaSX").val(_this.selezione.prodotto.quantitaSX);
				jQuery("#quantitaSX").prop("disabled",true);
				jQuery("#quantitaDX").val(_this.selezione.prodotto.quantitaDX);
				jQuery("#quantitaDX").prop("disabled",true);

			}else{
				jQuery(".quantitaProdotto").prop("disabled",false);
			}

			var e = jQuery.Event("keyup");
			jQuery(".quantitaProdotto").trigger(e);

		});


		jQuery(".quantitaProdotto").on("keypress", function(e){
			return jQuery.onlynumbers(e);
		});

		if(_this.selezione.modifica.boo){
			jQuery("#repeatQuantita").trigger("click");
		}

	}


	_this.getValidita = function(){
		return _this.validita;
	}


	_this.getSopraluce = function(){

		if(jQuery.validaValore(_this.sopraluce))
		if(_this.sopraluce.height > 0){
			_this.prezzoTotale += _this.sopraluce.costo_totale;
		}
	}


	_this.getPrezzoScontato = function(){


		// TOTALE SCONTATO DELLA PORTA
		var prezzoTotale = 0;
		prezzoTotale += _this.selezione.prodotto.costo_totale;


		if(_this.selezione.accessori){
			// TOTALE SOPRALUCE SCONTATO
			if(_this.selezione.accessori.sopraluce){
				prezzoTotale += _this.selezione.accessori.sopraluce.costo_totale;
			}
		}

		_this.selezione.totaleScontato = prezzoTotale;

		return prezzoTotale;
	}



	_this.getPrezzoTotale = function(){


		// TOTALE DELLA PORTA
		var prezzoTotale = 0;
		prezzoTotale += _this.selezione.prodotto.totale_non_scontato;

		if(_this.selezione.accessori){
			// TOTALE SOPRALUCE SCONTATO
			if(_this.selezione.accessori.sopraluce){
				prezzoTotale += _this.selezione.accessori.sopraluce.totale_non_scontato;
			}
		}

		_this.selezione.totale = prezzoTotale;

		return prezzoTotale;
	}


	_this.ricalcolaTotale = function(prodotto){
		var cookieSelezione = prodotto;

		var totaleProdotto = 0;
		totaleProdotto = cookieSelezione.prodotto.totale;
		var quantita = cookieSelezione.prodotto.quantita;

		_this.id = cookieSelezione.id;
		_this.riferimento = cookieSelezione.riferimento;
		_this.tipologia = cookieSelezione.tipologia;

		if(jQuery.validaValore(_this.sopraluce)){
			_this.sopraluce = cookieSelezione.accessori.sopraluce;
			_this.prodotto = cookieSelezione.prodotto;
			_this.getSopraluce();

			var totaleSopraluce = _this.sopraluce.costo_totale;
			totaleProdotto += totaleSopraluce;
		}

		return totaleProdotto*quantita;
	}




	_this.ricalcolaTotaleScontato = function(prodotto){
		var cookieSelezione = prodotto;

		var totaleProdottoScontato = 0;

		var prezzoProdotto = cookieSelezione.prodotto.totale;
		var quantita = cookieSelezione.prodotto.quantita;
		var scontoProdotto = cookieSelezione.prodotto.sconto;
		var tmpScontato = prezzoProdotto - (prezzoProdotto * scontoProdotto)/100;
		var totaleProdottoScontato = tmpScontato;

		//$.Log("Totale prodotto: " + tmpScontato);

		_this.id = cookieSelezione.id;
		_this.riferimento = cookieSelezione.riferimento;
		_this.tipologia = cookieSelezione.tipologia;
		_this.sopraluce = cookieSelezione.accessori.sopraluce;


		if(jQuery.validaValore(_this.sopraluce)){
			_this.prodotto = cookieSelezione.prodotto;
			_this.getSopraluce();

			var totaleSopraluce = _this.sopraluce.costo_totale;
			var scontoSopraluce = _this.sopraluce.sconto;
			var tmpScontato = (totaleSopraluce - (totaleSopraluce * scontoSopraluce)/100);
			totaleProdottoScontato += tmpScontato;
		}

		return totaleProdottoScontato*quantita;
	}



	_this.viewRiepilogo = function(){


		$.Log("SSSSS");
		$.Log(_this.selezione);

		var tmpSX = 1;
		var tmpDX = 0;
		var quantita = 1;

		if(_this.selezione.prodotto.quantita > 0){
			tmpSX = Number(_this.selezione.prodotto.quantitaSX);
			tmpDX = Number(_this.selezione.prodotto.quantitaDX);
			quantita = _this.selezione.prodotto.quantita;
		}

		var riepilogo = "";

		if(!_this.selezione.validita){
			riepilogo += "<br><div class='alert alert-warning'><i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i> Attenzione! Le scelte precedenti con consentono al sistema";
			riepilogo += " emetta un preventivo completo dei costi</div>";
		}

		riepilogo += "<h4 class='title_h4'>RIFERIMENTO: "+_this.selezione.riferimento+"</h4>";
		riepilogo += "Tipologia: <b>"+_this.selezione.tipologia+"</b><br>";
		riepilogo += "Dimensioni porta LxH(mm): <b>"+_this.selezione.porta.L+"x"+_this.selezione.porta.H+"</b><br>";
		riepilogo += "Apertura: <b>"+_this.selezione.apertura+"</b><br>";
		riepilogo += "Aerazione: <b>"+_this.selezione.areazione+"</b><br>";
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


		riepilogo += "Codice: <b>" + _this.selezione.prodotto.codice + "</b><br>";
		riepilogo += "Descrizione: <b>"+_this.selezione.prodotto.descrizione + "</b><br>";
		riepilogo += "Sconto: <b>"+sconto+"%</b><br>";

		if(_this.selezione.validita){

			var totale = Number(_this.selezione.prodotto.costo)*quantita;
				sconto = Number(_this.selezione.prodotto.sconto);
			var totale_scontato = totale - (totale*sconto)/100;


			_this.selezione.prodotto.costo_totale = totale_scontato;
			_this.selezione.prodotto.quantita = quantita;

			
			riepilogo += "Prezzo: <b>" + Number(_this.selezione.prodotto.costo).format(false,2) + " EUR</b><br>";
			riepilogo += "Quantità: <b>" + quantita + "</b><br>";
			riepilogo += "Totale: <b>" + Number(totale).format(false,2) + " EUR</b><br>";
			
			riepilogo += "Totale scontato: <b>" + totale_scontato.format(false,2) + " EUR</b><br>";

		}

		if(_this.selezione.accessori){

			if(_this.selezione.accessori.sopraluce){

				riepilogo += "<h4 class='title_h4'>Accessori:</h4>";
				riepilogo += "<fieldset style='margin-bottom:15px'><legend style=\"font-size:14px;margin-bottom:10px;\"><b>SOPRALUCE DI "+_this.selezione.accessori.sopraluce.H+" (mm)</b> di altezza</legend>";
				
				//riepilogo += "Descrizione: <b>" + _this.sopraluce.descrizione + "</b><br>";
				riepilogo += "Codice: <b>" + _this.selezione.accessori.sopraluce.codice + "</b><br>";
				riepilogo += "Quantità: <b>" + quantita + "</b><br>";
				riepilogo += "Sconto: <b>"+totale+"%</b><br></div>";
				
				if(_this.selezione.validita){

					var costo = Number(_this.selezione.accessori.sopraluce.costo);
					var totale = costo*quantita;
					var sconto = Number(_this.selezione.accessori.sopraluce.sconto);
					var totale_scontato = totale - (totale*sconto)/100;

					_this.selezione.accessori.sopraluce.costo_totale = totale_scontato;
					_this.selezione.accessori.sopraluce.quantita = quantita;

					riepilogo += "Prezzo al ML: <b>" + costo.format(false,2) + " EUR</b><br>";
					
					riepilogo += "Totale: <b>" +totale.format(false,2) + " EUR</b><br>";
					riepilogo += "Totale scontato: <b>"+totale_scontato.format(false,2)+" EUR</b>";

				}


			riepilogo += "</fieldset>";				

			//$.Log("E qua si!");
			riepilogo += "</fieldset>";				

			}
		}


		riepilogo += "<b>Quantità con apertura a sinistra: #"+tmpSX+"</b><br><b>Quantità con apertura a destra: #"+tmpDX+"</b><br><br>";


		return riepilogo;
	}

/*

	_this.aggiornaRiepilogo = function(){

		var cookieSelezione = jQuery.getCookie("selezione");

		var totQuantita = 0;
		jQuery(".quantitaProdotto").each(function(){
			totQuantita += Number(jQuery(this).val());
		});

		cookieSelezione.modifica.boo = false;
		cookieSelezione.modifica.id = null;
		cookieSelezione.indietro = false;
		cookieSelezione.currentStep = 0;
		cookieSelezione.prodotto.quantita = totQuantita;
		cookieSelezione.quantita = totQuantita;
		cookieSelezione.prodotto.quantitaSX = jQuery("#quantitaSX").val();
		cookieSelezione.prodotto.quantitaDX = jQuery("#quantitaDX").val();


		if(_this.getValidita()){
		cookieSelezione.totale = _this.getPrezzoTotale()*totQuantita;
		cookieSelezione.totaleScontato = _this.getPrezzoScontato()*totQuantita;
		}else{
		cookieSelezione.totale = 0;
		cookieSelezione.totaleScontato = 0;
		}

		jQuery.registerCookie("selezione",cookieSelezione);
	}
	*/

}
