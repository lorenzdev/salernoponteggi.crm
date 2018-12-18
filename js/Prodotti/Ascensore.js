var Ascensore = function(main){

	var _this = this;
	_this.obj;
	_this.elem;
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
	_this.motorizzazione = null;
	_this.predisposizioneMotorizzazione = null;
	_this.verniciatura = null;
	_this.passaggioPedonale = null;
	_this.siAccessori = false;
	
	
	_this.prezzoTotale;
	
	_this.init = function(selezione){
		
		_this.selezione = selezione;
		alert(1);
		/*
		_this.id = _this.selezione.id;
		_this.riferimento = _this.selezione.riferimento;
		_this.tipologia = _this.selezione.tipologia;
		_this.famiglia = _this.selezione.famiglia;
		_this.dimensioniPorta = _this.selezione.porta;
		_this.foroMuro = _this.selezione.foroMuro;
		_this.debordatura = _this.selezione.debordatura;
		_this.versione = _this.selezione.versione;
		_this.sottoversione = _this.selezione.sottoversione;
		_this.tipoPosa = _this.selezione.ingombro;
		_this.accessori = _this.selezione.accessori;
		_this.prodotto = _this.selezione.prodotto;
		_this.validita = _this.selezione.validita;
		
		
		
		
		if(	_this.selezione.validita &&
			_this.selezione.versione.validita){
			_this.findProdotto();
		}
		
		_this.getSopraluce();
		_this.getSistemaChiusura();
		_this.getSistemaRifinitura();
		_this.getPassaggioPedonale();
		_this.getMotorizzazione();
		_this.getPredisposizioneMotorizzazione();
		_this.getVerniciatura();
		*/
	}
	
	_this.getTipologiaProgetto = function(){
	
		return _this.validita;
	}
	
	_this.findProdotto = function(){
		
		var basculante = {
			"debordatura": _this.debordatura,
			"famiglia":_this.famiglia,
			"versione":_this.selezione.versione.codice,
			"sottoversione": "F/"+_this.selezione.sottoversione.numero
		}
		
		function callBackPrezzo(dato){
			
			$.Log("dato:");
			$.Log(dato);
			
			if(dato.results.length >0){
				
				var mq = _this.dimensioniPorta.H/1000 * _this.dimensioniPorta.L/1000;
				if(mq < 6)
					mq = 6;
				
				_this.selezione.prodotto.codice =  dato.results[0].codice;
				_this.selezione.prodotto.descrizione = dato.results[0].descrizione;
				_this.selezione.prodotto.costo = Number(dato.results[0].costo);
				_this.selezione.prodotto.costo_totale = Number(dato.results[0].costo)*mq;
				
				//$.registerCookie("selezione", _this.selezione);
				
			}else{
				alert("Non è stata trovata nessuna porta basculante! Contattare l'amministratore del sistema comunicando i seguenti valori per la risoluzione del problema\nDebordatura: "+_this.debordatura+"\nFamiglia: "+_this.famiglia+"\nVersione: "+_this.selezione.versione.codice+"\nSottoversione: "+"F/"+_this.selezione.sottoversione.numero);
				jQuery(".Form"+_this.selezione.tipologia).trigger("click");
			}
		}	
		
		jQuery.postJSON("Basculanti","getBasculante","private", basculante, false, callBackPrezzo);	
	}
	

	
	_this.getRiepilogo = function(){
		
		
		var quantita = 1;
		if(_this.selezione.prodotto.quantita)
			quantita = Number(_this.selezione.prodotto.quantita);
		
		var riepilogo = "";
		riepilogo += "<h4 class='title_h4'>RIFERIMENTO: "+_this.selezione.riferimento+"</h4>";
		riepilogo += "Tipologia: <b>"+_this.selezione.tipologia+"</b><br>";
		riepilogo += "Famiglia: <b>"+_this.selezione.famiglia+"</b><br>";
		riepilogo += "Dimensioni porta LxH(mm): <b>"+_this.selezione.porta.L+"x"+_this.selezione.porta.H+"</b><br>";
		riepilogo += "Debordatura: <b>"+_this.selezione.debordatura+"</b><br>";
		riepilogo += "Versione: <b>"+_this.selezione.versione.nome+"</b><br>";
		if(_this.selezione.versione.codice == "A/C"){
			riepilogo += "Modello: <b>"+_this.selezione.versione.modello+"</b><br>";
			riepilogo += "Descrizione: <b>"+_this.selezione.versione.descrizione+"</b><br>";
			riepilogo += "Colorazione: <b>"+_this.selezione.versione.colorazione+"</b><br>";
		}
		if(_this.selezione.versione.posizione){
			riepilogo += "Posizione: <b>"+_this.selezione.versione.posizione+"</b><br>";
		}
		if(_this.selezione.versione.modello_legno){
			riepilogo += "Modello legno: <b>"+_this.selezione.versione.modello_legno+"</b><br>";
		}
		if(_this.selezione.versione.mordenzatura){
			riepilogo += "Mordenzatura: <b>"+_this.selezione.versione.mordenzatura+"</b><br>";
		}
		riepilogo += "Foro muro LxH(mm): <b>"+_this.selezione.foroMuro.L+"x"+_this.selezione.foroMuro.H+"</b><br>";
		if(jQuery.validaValore(_this.selezione.sottoversione.codice)){
			riepilogo += "Sottoversione: <b>"+_this.selezione.sottoversione.nome+"</b><br>";
			if(_this.selezione.sottoversione.fileSuperiori != undefined && _this.selezione.sottoversione.fileInferiori != undefined){
				riepilogo += "Disposizione file:<br>• File superiori: <b>" + _this.selezione.sottoversione.fileSuperiori+"</b><br>";
				riepilogo += "• File inferiori: <b>"+_this.selezione.sottoversione.fileInferiori+"</b><br>";
			}
		}
		riepilogo += "Tipo posa:<br>";
		if(_this.selezione.ingombro.up == 0)
			riepilogo += "• In luce lato superiore<br>";
			else
			riepilogo += "• Oltre luce lato superiore di <b>"+_this.selezione.ingombro.up+" (mm)</b><br>";
		if(_this.selezione.ingombro.sx == 0)
			riepilogo += "• In luce lato sinistro<br>";
			else
			riepilogo += "• Oltre luce lato sinistro di <b>"+_this.selezione.ingombro.sx+" (mm)</b><br>";
		if(_this.selezione.ingombro.dx == 0)
			riepilogo += "• In luce lato destro<br>";
			else
			riepilogo += "• Oltre luce lato destro di <b>"+_this.selezione.ingombro.dx+" (mm)</b><br>";
			
			
		if(_this.selezione.prodotto.sconto > 0)
			riepilogo += "Sconto da applicare: <b>" +_this.selezione.prodotto.sconto+ "%</b><br>" ;
			else
			riepilogo += "<b>Nessuno sconto da applicare</b><br>" ;	
			
		
		
		var mq = (_this.selezione.porta.H/1000 * _this.selezione.porta.L/1000);
			mq = Math.round(mq * 100) / 100;
		if(mq < 6){
			mq = 6;
		}
		
		var ml = _this.selezione.porta.L/1000;
			ml = Math.round(ml * 100) / 100;
		
		riepilogo += "MQ: <b>" + mq.format(false,2) + "</b><br>";
		
		if(!_this.selezione.validita){
			riepilogo += "<br><div class='alert alert-warning'><i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i> Attenzione! In base alle precedenti selezioni verrà generato un preventivo a progetto privo del dettaglio dei costi.</div>";
		}else{

			var costo = Number(_this.selezione.prodotto.costo);
			var totale = costo*quantita*mq;
				sconto = Number(_this.selezione.prodotto.sconto);
			var totale_scontato = totale - (totale*sconto)/100;
			
			_this.selezione.prodotto.totale_non_scontato = totale;
			_this.selezione.prodotto.costo_totale = totale_scontato;
			_this.selezione.prodotto.mq = mq;
			_this.selezione.prodotto.quantita = quantita;	
			
			riepilogo += "Codice: <b>" + _this.selezione.prodotto.codice + "</b><br>";
			riepilogo += "Descrizione: <b>"+_this.selezione.prodotto.descrizione + "</b><br>";
			riepilogo += "Prezzo a MQ: <b>" + costo.format(false,2) + " EUR</b><br>";
			riepilogo += "Quantità: <b>" + quantita + "</b><br><br>";
			riepilogo += "Totale: <b>" + totale.format(false,2) + " EUR</b><br>";
			riepilogo += "<div class='boxSconto'>Sconto: <input type='text' id='prodotto' class='sconto form-control' value='"+sconto+"' totale='"+totale+"' style='display:inline-block;width:50px;' maxlength='3'/>%</div>";
			riepilogo += "Prezzo totale scontato: <b><span id='scontoProdottoTotale'>" + totale_scontato.format(false,2) + "</span> EUR</b><br><br>";
			
		}
		if(mq <= 6)
			riepilogo += "<div class='alert alert-warning'><i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i> Attenzione! Minimo fatturazione 6,00 MQ</div><br>";
		
		if(_this.selezione.accessori){
			riepilogo += "<h4 class='title_h4'>Accessori:</h4>";
			
			if(_this.selezione.accessori.sopraluce){
				
				var ml = Number(_this.selezione.accessori.sopraluce.L)/1000;
					ml = Math.round(ml * 100) / 100;
				
				var costo = Number(_this.selezione.accessori.sopraluce.costo);
				var totale = costo*quantita*ml;
				var sconto = Number(_this.selezione.accessori.sopraluce.sconto);
				var totale_scontato = totale - (totale*sconto)/100;
			
				_this.selezione.accessori.sopraluce.totale_non_scontato = totale;
				_this.selezione.accessori.sopraluce.costo_totale = totale_scontato;
				_this.selezione.accessori.sopraluce.quantita = quantita;	
				_this.selezione.accessori.sopraluce.ml = ml;	
				
				riepilogo += "<fieldset style='margin-bottom:15px'><legend style=\"font-size:14px;margin-bottom:10px;\"><b>SOPRALUCE DI "+_this.selezione.accessori.sopraluce.H+" (mm)</b></legend>";
				riepilogo += "Codice: <b>" + _this.selezione.accessori.sopraluce.codice + "</b><br>"; 
				riepilogo += "Larghezza: <b>" + _this.selezione.accessori.sopraluce.L + "</b> mm<br>"; 
				riepilogo += "Altezza: <b>" + _this.selezione.accessori.sopraluce.H + "</b> mm<br>"; 
				
				if(_this.selezione.validita){
					
					riepilogo += "ML: <b>" + ml.format(false,2) + "</b><br>"; 
					riepilogo += "Prezzo al ML: <b>" + costo.format(false,2) + " EUR</b><br>"; 
					riepilogo += "Quantità: <b>" + quantita + "</b><br><br>";
					riepilogo += "Totale: <b>" + totale.format(false,2) + " EUR</b><br>"; 
					riepilogo += "<div class='boxSconto'>Sconto: <input type='text' id='sopraluce' style='width:50px;display:inline-block;' class='sconto form-control' totale='"+totale+"' value='"+sconto+"' />%<br></div>";
					riepilogo += "Totale scontato: <b><span id='scontoSopraluceTotale'>"+totale_scontato.format(false,2)+"</span> EUR</b>";
					riepilogo += "<br>";				
				}
				
				riepilogo += "</fieldset>";	
		}
			

			if(_this.selezione.accessori.sistemaChiusura){
				
				riepilogo += "<fieldset style='margin-bottom:15px'><legend style=\"font-size:14px;margin-bottom:10px;\"><b>SISTEMI DI CHIUSURA</b></legend>";
				
				var totale = 0;
				var totale_scontato = 0;
				var sconto = 0;
				
					
					
				for(var i = 0;i < _this.selezione.accessori.sistemaChiusura.length;i++){
					var costo = Number(_this.selezione.accessori.sistemaChiusura[i].costo);
					var qua = Number(_this.selezione.accessori.sistemaChiusura[i].quantita);
					
					
					var tot = costo*quantita*qua;
					sconto = Number(_this.selezione.accessori.sistemaChiusura[i].sconto);
					
					var tot_scontato = tot - (tot*sconto)/100;
				
					_this.selezione.accessori.sistemaChiusura[i].totale_non_scontato = tot;
					_this.selezione.accessori.sistemaChiusura[i].costo_totale = tot_scontato;
					_this.selezione.accessori.sistemaChiusura[i].quantita = qua;	
					_this.selezione.accessori.sistemaChiusura[i].quantita_totale = qua*quantita;	
					
					riepilogo += "Codice: <b>" + _this.selezione.accessori.sistemaChiusura[i].codice + "</b><br>"; 
					riepilogo += "Quantità: <b>" + quantita*qua + "</b><br>";
					
					if(_this.selezione.validita){
						riepilogo += "Prezzo: <b>" + costo.format(false,2) + " EUR</b><br>";
						riepilogo += "Totale: <b>"+tot.format(false,2)+" EUR</b><br><br>";
					}else riepilogo += "<br>";
					
					totale += tot;
					totale_scontato += tot_scontato;
				}
				
				if(_this.selezione.validita){
					riepilogo += "Totale: <b><span id='scontoSistemaChiusuraTotale'>"+totale.format(false,2)+"</span> EUR</b><br>";
					riepilogo += "<div class='boxSconto'>Sconto: <input type='text' id='sistemaChiusura' totale='"+totale+"' style='width:50px;display:inline-block;' class='sconto form-control' value='"+sconto+"' maxlength='3'/>%<br></div>";
					riepilogo += "Totale scontato: <b><span id='scontoSistemaChiusuraTotale'>"+totale_scontato.format(false,2)+"</span> EUR</b><br>";
				}
				riepilogo += "</fieldset>";
			}
			
			
			if(_this.selezione.accessori.sistemaRifinitura){
				
				var costo = Number(_this.selezione.accessori.sistemaRifinitura.costo);
				
				riepilogo += "<fieldset style='margin-bottom:15px'><legend style=\"font-size:14px;margin-bottom:10px;\"><b>SISTEMI DI RIFINITURA</b></legend>";
				riepilogo += "Codice: <b>" + _this.selezione.accessori.sistemaRifinitura.codice + "</b><br>"; 
				
				var num_coprifili = 0;
				var costoSistemaRifinitura = 0;
				if(_this.selezione.accessori.sistemaRifinitura.up){
					riepilogo += "Rifinitura superiore: <b>"+_this.selezione.accessori.sistemaRifinitura.up+"</b><br>";
					num_coprifili++;
				}
				if(_this.selezione.accessori.sistemaRifinitura.sx){
					riepilogo += "Rifinitura lato sinistro: <b>"+_this.selezione.accessori.sistemaRifinitura.sx+"</b><br>";
					num_coprifili++;
				}
				
				if(_this.selezione.accessori.sistemaRifinitura.dx){
					riepilogo += "Rifinitura lato destro: <b>"+_this.selezione.accessori.sistemaRifinitura.dx+"</b><br>";
					num_coprifili++;	
				}
				
				riepilogo += "Quantità: <b>" + quantita*num_coprifili + "</b><br>";
				
				if(_this.selezione.validita){
					riepilogo += "Prezzo intero kit: <b>" + Number(costo*3).format(false,2) + " EUR</b><br>"; 
					
					var totale = costo*quantita*num_coprifili;
					var sconto = Number(_this.selezione.accessori.sistemaRifinitura.sconto);
					var totale_scontato = totale - (totale*sconto)/100;
					
					_this.selezione.accessori.sistemaRifinitura.totale_non_scontato = totale;
					_this.selezione.accessori.sistemaRifinitura.costo_totale = totale_scontato;
					_this.selezione.accessori.sistemaRifinitura.quantita = quantita;
					_this.selezione.accessori.sistemaRifinitura.quantita_tot = quantita*num_coprifili;
				
					riepilogo += "<br>Totale: <b>" + totale.format(false,2) + " EUR</b><br>"; 
					riepilogo += "<div class='boxSconto'>Sconto: <input type='text' id='sistemaRifinitura' style='width:50px;display:inline-block;' class='sconto form-control' totale='"+totale+"' value='"+sconto+"' maxlength='3'/>%<br></div>";
					riepilogo += "Totale scontato: <b><span id='scontoSistemaRifinituraTotale'>"+totale_scontato.format(false,2)+"</span> EUR</b><br>";
				}
				
				riepilogo += "</fieldset>";
			}
			
			
			if(_this.selezione.accessori.passaggioPedonale){
				
				var costo = Number(_this.selezione.accessori.passaggioPedonale.costo);
				var totale = costo*quantita;
				var sconto = Number(_this.selezione.accessori.passaggioPedonale.sconto);
				var totale_scontato = totale - (totale*sconto)/100;
			
				_this.selezione.accessori.passaggioPedonale.totale_non_scontato = totale;
				_this.selezione.accessori.passaggioPedonale.costo_totale = totale_scontato;
				_this.selezione.accessori.passaggioPedonale.quantita = quantita;
				
				riepilogo += "<fieldset style='margin-bottom:15px'><legend style=\"font-size:14px;margin-bottom:10px;\"><b>PASSAGGIO PEDONALE</b></legend>";
				riepilogo += "Codice: <b>" + _this.selezione.accessori.passaggioPedonale.codice + "</b><br>"; 
				
				if(_this.selezione.accessori.passaggioPedonale.posizione == "sx")
					riepilogo += "Posizione laterale sinistra<br>";
				if(_this.selezione.accessori.passaggioPedonale.posizione == "CN")
					riepilogo += "Posizione centrale<br>";
				if(_this.selezione.accessori.passaggioPedonale.posizione == "dx")
					riepilogo += "Posizione laterale destra<br>";
				if(_this.selezione.accessori.passaggioPedonale.apertura == "sx")
					riepilogo += "Tiratura a sinistra<br>";
				if(_this.selezione.accessori.passaggioPedonale.apertura == "dx")
					riepilogo += "Tiratura a destra<br>";
					
				riepilogo += "Quantità: <b>" + quantita + "</b><br>"; 
				
				if(_this.selezione.validita){
					riepilogo += "Prezzo: <b>" + costo.format(false,2) + " EUR</b><br><br>";
					riepilogo += "Totale: <b>" + totale.format(false,2) + " EUR</b><br>";
					riepilogo += "<div class='boxSconto'>Sconto: <input type='text' id='passaggioPedonale' style='width:50px;display:inline-block;' class='sconto form-control' totale='"+totale+"' value='"+sconto+"' maxlength='3'/>%<br></div>";	
					riepilogo += "Totale scontato: <b><span id='scontoPassaggioPedonaleTotale'>"+totale_scontato.format(false,2)+"</span> EUR</b><br>";
					riepilogo += "<br>"; 
				}
				riepilogo += "</fieldset>";
			}
			

			if(_this.selezione.accessori.motorizzazione){
				
				var costo = Number(_this.selezione.accessori.motorizzazione.costo);
				var totale = costo*quantita;
				var sconto = Number(_this.selezione.accessori.motorizzazione.sconto);
				var totale_scontato = totale - (totale*sconto)/100;
			
				_this.selezione.accessori.motorizzazione.totale_non_scontato = totale;
				_this.selezione.accessori.motorizzazione.costo_totale = totale_scontato;
				_this.selezione.accessori.motorizzazione.quantita = quantita;
				
				riepilogo += "<fieldset><legend style='font-size:14px;'><b>MOTORIZZAZIONE</b></legend>";
				riepilogo += "Codice: <b>" + _this.selezione.accessori.motorizzazione.codice + "</b><br>"; 
				riepilogo += "Quantità: <b>" + quantita + "</b><br>";
				
				if(_this.selezione.validita){
					riepilogo += "Prezzo: <b>" + costo.format(false,2)+" EUR</b><br>";
					riepilogo += "Totale: <b>" + totale.format(false,2)+" EUR</b><br>";
				}
				
				if(_this.selezione.accessori.motorizzazione.optional.length > 0){
					
					riepilogo += "<br><i>Optional motorizzazione</i><br>";
					var totaleOptionalScontato = 0;
					var totaleOptional = 0;
					
					if(_this.selezione.accessori.motorizzazione.optional.length>0){
						
						for(var i=0;i<_this.selezione.accessori.motorizzazione.optional.length;i++){
							
							var costo1 = Number(_this.selezione.accessori.motorizzazione.optional[i].costo);
							var sconto1 = Number(_this.selezione.accessori.motorizzazione.optional[i].sconto);
							
							var qq = Number(_this.selezione.accessori.motorizzazione.optional[i].quantita);
							var q_optional = qq*quantita;
							var totale1 = costo1*q_optional;
							
							var totale_scontato1 = totale1 - (totale1*sconto)/100;
						
							totaleOptionalScontato += totale_scontato1;
							totaleOptional += totale1;
							
							_this.selezione.accessori.motorizzazione.optional[i].totale_non_scontato = totale1;
							_this.selezione.accessori.motorizzazione.optional[i].costo_totale = totale_scontato1;
							_this.selezione.accessori.motorizzazione.optional[i].quantita = qq;
							_this.selezione.accessori.motorizzazione.optional[i].quantita_tot = q_optional;
							
							
							riepilogo += "Codice optional "+(i+1)+": <b>" + _this.selezione.accessori.motorizzazione.optional[i].codice+"</b><br>";
							riepilogo += "Quantità:  <b>" + q_optional+"</b><br>";
							
							if(_this.selezione.validita){
								riepilogo += "Prezzo: <b>" + costo1.format(false,2)+" EUR</b><br>";
								riepilogo += "Totale: <b>" + totale1.format(false,2)+" EUR</b><br><br>";
							}
						}
						
						totale_scontato += totaleOptionalScontato;
						totale += totaleOptional;
						
						if(_this.selezione.validita)
							riepilogo += "Totale costo optional: <b>" + Number(totaleOptional).format(false,2)+" EUR</b><br><br>";
					}
					
				}
				
				_this.selezione.accessori.motorizzazione.costo_totale_con_optional = totale_scontato;
				
				if(_this.selezione.validita){
					riepilogo += "Totale: <b><span id='scontoMotorizzazioneTotale'>"+totale.format(false,2)+"</span> EUR</b><br>";
					riepilogo += "<div class='boxSconto'>Sconto: <input type='text' id='motorizzazione' style='width:50px;display:inline-block;' class='sconto form-control' totale='"+totale+"' value='"+sconto+"' maxlength='3'/>%<br></div>";
					
					riepilogo += "Totale scontato: <b><span id='scontoMotorizzazioneTotale'>"+totale_scontato.format(false,2)+"</span> EUR</b><br>";
				}
				
				riepilogo += "</fieldset><br>";
			}
			
			if(_this.selezione.accessori.predisposizioneMotorizzazione){

				var costo = Number(_this.selezione.accessori.predisposizioneMotorizzazione.costo);
				var totale = costo*quantita*mq;
				var sconto = Number(_this.selezione.accessori.predisposizioneMotorizzazione.sconto);
				var totale_scontato = totale - (totale*sconto)/100;
			
				_this.selezione.accessori.predisposizioneMotorizzazione.totale_non_scontato = totale;
				_this.selezione.accessori.predisposizioneMotorizzazione.costo_totale = totale_scontato;
				_this.selezione.accessori.predisposizioneMotorizzazione.quantita = quantita;
				
				riepilogo += "<fieldset style='margin-bottom:15px'><legend style=\"font-size:14px;margin-bottom:10px;\"><b>PREDISPOSIZIONE ALLA MOTORIZZAZIONE</b></legend>";
				riepilogo += "Codice: <b>" + _this.selezione.accessori.predisposizioneMotorizzazione.codice + "</b><br>"; 
				riepilogo += "Quantità: <b>" + quantita + "</b><br>";

				if(_this.validita){
					riepilogo += "Prezzo al MQ: <b>" + costo.format(false,2)+" EUR</b><br>";
					riepilogo += "Totale: <b>" + totale.format(false,2)+" EUR</b><br>";
					riepilogo += "<div class='boxSconto'>Sconto: <input type='text' id='predisposizioneMotorizzazione' style='width:50px;display:inline-block;' totale='"+totale+"' class='sconto form-control' value='"+sconto+"' maxlength='3' package='_this.selezione.accessori.predisposizioneMotorizzazione.sconto'/>%<br></div>";
					riepilogo += "Totale scontato: <b><span id='scontoPredisposizioneMotorizzazioneTotale'>"+totale_scontato.format(false,2)+"</span> EUR</b><br>";
				}
				
				riepilogo += "</fieldset>";
			}
			
			if(_this.selezione.accessori.verniciatura){
				
				riepilogo += "<fieldset style='margin-bottom:15px'><legend style=\"font-size:14px;margin-bottom:10px;\"><b>VERNICIATURA</b></legend>";
				riepilogo += "Codice RAL: <b>" + _this.selezione.accessori.verniciatura.codice + "</b><br>"; 
				
				var totaleVerniciatura = 0;
				var totaleVerniciaturaScontata = 0;
				
				if(_this.selezione.accessori.verniciatura.vernici.length > 0){
					
					for(var j = 0;j < _this.selezione.accessori.verniciatura.vernici.length;j++){
						
						var totale = 0;
						
						_this.selezione.accessori.verniciatura.vernici[j].selected = false;
						
						if(_this.selezione.accessori.verniciatura.vernici[j].tipo == "basculante"){
							
							$.Log(quantita+" "+_this.selezione.accessori.verniciatura.vernici[j].Qmin+" "+_this.selezione.accessori.verniciatura.vernici[j].Qmax);
							if(quantita >= _this.selezione.accessori.verniciatura.vernici[j].Qmin && quantita <= _this.selezione.accessori.verniciatura.vernici[j].Qmax){
								
								riepilogo += "<br><i>Vernice porta</i><br>";
								riepilogo += "Codice: <b>" + _this.selezione.accessori.verniciatura.vernici[j].codice+"</b><br>";
								riepilogo += "Verniciatura per <b>" + _this.selezione.accessori.verniciatura.vernici[j].tipo+"</b><br>"
								var costo = Number(_this.selezione.accessori.verniciatura.vernici[j].costo);
								
								riepilogo += "MQ: <b>" + mq.format(false,2)+"</b><br>";
								riepilogo += "Quantità: <b>" + quantita + "</b><br>";
									
								if(_this.selezione.validita){
									riepilogo += "Prezzo al MQ: <b>" + costo.format(false,2)+" EUR</b><br>";
								}
								
								totale = costo*quantita*mq;
								_this.selezione.accessori.verniciatura.vernici[j].mq = mq;
								_this.selezione.accessori.verniciatura.vernici[j].quantita = quantita;
								_this.selezione.accessori.verniciatura.vernici[j].selected = true;
								
								riepilogo += "totale: <b>" + totale.format(false,2) + " EUR</b><br>";
							}
							
						}else if(_this.selezione.accessori.verniciatura.vernici[j].tipo == "sopraluce"){
								riepilogo += "<br><i>Vernice sopraluce</i><br>";
								riepilogo += "Codice: <b>" + _this.selezione.accessori.verniciatura.vernici[j].codice+"</b><br>";
								riepilogo += "ML: <b>" + ml.format(false,2)+"</b><br>";
								riepilogo += "Quantità: <b>" + quantita + "</b><br>";
								
								costo = _this.selezione.accessori.verniciatura.vernici[j].costo;
								
								if(_this.selezione.validita){	
									riepilogo += "Prezzo al ML: <b>" + costo.format(false,2)+" EUR</b><br>";
								}
								
								totale = costo*quantita*ml;
								_this.selezione.accessori.verniciatura.vernici[j].mq = ml;
								_this.selezione.accessori.verniciatura.vernici[j].quantita = quantita;
								_this.selezione.accessori.verniciatura.vernici[j].selected = true;
								riepilogo += "totale: <b>" + totale.format(false,2) + " EUR</b><br>";
						
						}else if(_this.selezione.accessori.verniciatura.vernici[j].tipo == "coprifilo"){
							costo = _this.selezione.accessori.verniciatura.vernici[j].costo;
							_this.selezione.accessori.verniciatura.vernici[j].mq = 1;
							var q = Number(_this.selezione.accessori.sistemaRifinitura.quantita_tot);
							totale = costo*q;
							_this.selezione.accessori.verniciatura.vernici[j].quantita = q;
							_this.selezione.accessori.verniciatura.vernici[j].selected = true;
							riepilogo += "<br><i>Vernice coprifili</i><br>";
							riepilogo += "Codice: <b>" + _this.selezione.accessori.verniciatura.vernici[j].codice+"</b><br>";
							riepilogo += "Quantità: <b>" + q + "</b><br>";
							if(_this.selezione.validita)
								riepilogo += "Prezzo cadauno: <b>" + costo.format(false,2)+" EUR</b><br>";
							riepilogo += "Totale: <b>" + totale.format(false,2) + "</b><br>";
							
						}
						
						var sconto = Number(_this.selezione.accessori.verniciatura.sconto);
						var totale_scontato = totale - (totale*sconto)/100;
						
						totaleVerniciatura+=totale;
						totaleVerniciaturaScontata+=totale_scontato;
						
						_this.selezione.accessori.verniciatura.vernici[j].totale_non_scontato = totale;
						_this.selezione.accessori.verniciatura.vernici[j].costo_totale = totale_scontato;
						
						
					}
					
				}
				
				if(_this.selezione.validita){

					riepilogo += "<br>Totale: <b>" + totaleVerniciatura.format(false,2) +" EUR</b><br>";
					riepilogo += "<div class='boxSconto'>Sconto: <input type='text' id='verniciatura' class='sconto form-control' style='width:50px;display:inline-block;' totale='"+totaleVerniciatura+"' value='"+sconto+"' maxlength='3'/>%<br></div>";
					riepilogo += "Totale scontato: <b><span id='scontoVerniciatura"+j+"Totale'>" + totaleVerniciaturaScontata.format(false,2) +" </span> EUR</b><br>";
				}
				
				riepilogo += "</fieldset>";
			}
			
		}else  riepilogo += "<h3>Nessun accessorio selezionato</h3>";
		

		
		riepilogo += "<br><span id='messageQuantita'><b>Quantità</b>: <input type='text' class='quantitaProdotto form-control' value='"+quantita+"' maxlength='3' id=\"quantitaUnitaria\" style='width:150px;display:inline-block;'></span><br><br>";	
			
		return riepilogo;
	}
	
	_this.activeButtonRepeatQuantita = function(){
	
		jQuery("#repeatQuantita").click(function(){
			
			if(jQuery(this).is(":checked")){
				
				jQuery(".quantitaProdotto").val(_this.selezione.prodotto.quantita);
				jQuery(".quantitaProdotto").prop("disabled",true);
					
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
	
	_this.getFamiglia = function(){
		return _this.famiglia;	
	}
	
	_this.getValidita = function(){
		return _this.validita;	
	}
	
	_this.getSopraluce = function(){
		
		_this.sopraluce = _this.accessori.sopraluce;
		if(_this.sopraluce != null){
			_this.siAccessori = true;
			_this.prezzoTotale += _this.sopraluce.costo_totale;
		}
	}
	
	_this.getSistemaChiusura = function(){
		
		_this.sistemaChiusura = _this.accessori.sistemaChiusura;	
		if(_this.accessori.sistemaChiusura != null){
			_this.siAccessori = true;
			_this.prezzoTotale += _this.sistemaChiusura.costo_totale;
		}
	}
	
	_this.getSistemaRifinitura = function(){
		
		_this.sistemaRifinitura = _this.accessori.sistemaRifinitura;
		if(_this.accessori.sistemaRifinitura != null){
			_this.siAccessori = true;
			_this.prezzoTotale += _this.sistemaRifinitura.totale;
		}
	}
	
	_this.getMotorizzazione = function(){
		
		_this.motorizzazione = _this.accessori.motorizzazione;
		if(_this.accessori.motorizzazione != null){
			_this.siAccessori = true;
			_this.prezzoTotale += _this.motorizzazione.costo_totale;
		}
	}
	
	_this.getPredisposizioneMotorizzazione = function(){
		
		_this.predisposizioneMotorizzazione = _this.accessori.predisposizioneMotorizzazione;
		if(_this.accessori.predisposizioneMotorizzazione != null){
			_this.siAccessori = true;
			_this.prezzoTotale += _this.predisposizioneMotorizzazione.costo_totale;
		}
	}
	
	_this.getPassaggioPedonale = function(){
		
		_this.passaggioPedonale = _this.accessori.passaggioPedonale;
		if(_this.accessori.passaggioPedonale != null){
			_this.siAccessori = true;
			_this.prezzoTotale += _this.passaggioPedonale.costo_totale;
		}
	}
	
	_this.getVerniciatura = function(){
		
		_this.verniciatura = _this.accessori.verniciatura;	
		if(_this.accessori.verniciatura != null){
			_this.siAccessori = true;
			_this.prezzoTotale += _this.verniciatura.costo_totale;
		}
	}
	

	_this.getPrezzoTotale = function(){
		
		var prezzoTotale = 0;
		
		$.Log("SELEZIONE");
		$.Log(_this.selezione);
		
		// TOTALE SCONTATO DELLA PORTA
		prezzoTotale += Number(_this.selezione.prodotto.totale_non_scontato);
		$.Log("Prodotto: " + _this.selezione.prodotto.totale_non_scontato);
		
		// TOTALE SCONTATO DEL SOPRALUCE
		if(_this.selezione.accessori.sopraluce){
			prezzoTotale += Number(_this.selezione.accessori.sopraluce.totale_non_scontato);
		}
		
		// TOTALE SCONTATO DEL SISTEMA DI CHIUSURA
		if(_this.selezione.accessori.sistemaChiusura){
			for(var i = 0;i < _this.selezione.accessori.sistemaChiusura.length;i++){
				prezzoTotale += Number(_this.selezione.accessori.sistemaChiusura[i].totale_non_scontato);
				$.Log("Sistema chiusura: " + _this.selezione.accessori.sistemaChiusura[i].totale_non_scontato);
			}
		}
			
		// TOTALE SCONTATO DEL SISTEMA DI RIFNITURA
		if(_this.selezione.accessori.sistemaRifinitura){
			prezzoTotale += Number(_this.selezione.accessori.sistemaRifinitura.totale_non_scontato);
			$.Log("Sistema rifinitura: " + _this.selezione.accessori.sistemaRifinitura.totale_non_scontato);
		}
			
		// TOTALE SCONTATO DEL SISTEMA DI PASSAGGIO PEDONALE
		if(_this.selezione.accessori.passaggioPedonale){
			prezzoTotale += Number(_this.selezione.accessori.passaggioPedonale.totale_non_scontato);	
			$.Log("Passaggio: " + _this.selezione.accessori.passaggioPedonale.totale_non_scontato);
		}
		
		// TOTALE SCONTATO DEL SISTEMA DI MOTORIZZAZIONE
		if(_this.selezione.accessori.motorizzazione){
			prezzoTotale += Number(_this.selezione.accessori.motorizzazione.totale_non_scontato);
			
			$.Log("Motorizzazione: " + _this.selezione.accessori.motorizzazione.totale_non_scontato);
			
			if(_this.selezione.accessori.motorizzazione.optional.length > 0){
				for(var i = 0;i < _this.selezione.accessori.motorizzazione.optional.length;i++){
					prezzoTotale += Number(_this.selezione.accessori.motorizzazione.optional[i].totale_non_scontato);
					$.Log("Optional "+i+": " + _this.selezione.accessori.motorizzazione.optional[i].totale_non_scontato);
				}
			}
		}
			
		// TOTALE SCONTATO DEL SISTEMA DI PREDISPOSIZIONE MOTORIZZAZIONE
		if(_this.selezione.accessori.predisposizioneMotorizzazione){
			prezzoTotale += Number(_this.selezione.accessori.predisposizioneMotorizzazione.totale_non_scontato);
		}
		
		// TOTALE SCONTATO VENICIATURA
		if(_this.selezione.accessori.verniciatura){
			for(var i = 0;i < _this.selezione.accessori.verniciatura.vernici.length;i++){
				prezzoTotale += Number(_this.selezione.accessori.verniciatura.vernici[i].totale_non_scontato);	
				$.Log("Vernici: " + _this.selezione.accessori.verniciatura.vernici[i].totale_non_scontato);		
			}
		}
	
		_this.selezione.totale = prezzoTotale;
		return prezzoTotale;
	}
	
	_this.getPrezzoScontato = function(){
		
		var prezzoTotale = 0;
		
		$.Log("SELEZIONE");
		$.Log(_this.selezione);
		
		// TOTALE SCONTATO DELLA PORTA
		prezzoTotale += Number(_this.selezione.prodotto.costo_totale);
		
		// TOTALE SCONTATO DEL SOPRALUCE
		if(_this.selezione.accessori.sopraluce)
			prezzoTotale += Number(_this.selezione.accessori.sopraluce.costo_totale);
		
		
		// TOTALE SCONTATO DEL SISTEMA DI CHIUSURA
		if(_this.selezione.accessori.sistemaChiusura){
			for(var i = 0;i < _this.selezione.accessori.sistemaChiusura.length;i++){
				prezzoTotale += Number(_this.selezione.accessori.sistemaChiusura[i].costo_totale);
			}
		}
			
		// TOTALE SCONTATO DEL SISTEMA DI RIFNITURA
		if(_this.selezione.accessori.sistemaRifinitura){
			prezzoTotale += Number(_this.selezione.accessori.sistemaRifinitura.costo_totale);
		}
			
		// TOTALE SCONTATO DEL SISTEMA DI PASSAGGIO PEDONALE
		if(_this.selezione.accessori.passaggioPedonale){
			prezzoTotale += Number(_this.selezione.accessori.passaggioPedonale.costo_totale);	
		}
		
		// TOTALE SCONTATO DEL SISTEMA DI MOTORIZZAZIONE
		if(_this.selezione.accessori.motorizzazione){
			prezzoTotale += Number(_this.selezione.accessori.motorizzazione.costo_totale);
			
			if(_this.selezione.accessori.motorizzazione.optional.length > 0){
				for(var i = 0;i < _this.selezione.accessori.motorizzazione.optional.length;i++){
					prezzoTotale += Number(_this.selezione.accessori.motorizzazione.optional[i].costo_totale);
				}
			}
		}
			
		// TOTALE SCONTATO DEL SISTEMA DI PREDISPOSIZIONE MOTORIZZAZIONE
		if(_this.selezione.accessori.predisposizioneMotorizzazione){
			prezzoTotale += Number(_this.selezione.accessori.predisposizioneMotorizzazione.costo_totale);	
		}
		
		// TOTALE SCONTATO DEL SISTEMA DI PREDISPOSIZIONE MOTORIZZAZIONE
		if(_this.selezione.accessori.verniciatura){
			for(var i = 0;i < _this.selezione.accessori.verniciatura.vernici.length;i++){
				prezzoTotale += Number(_this.selezione.accessori.verniciatura.vernici[i].costo_totale);		
			}
		}
	
		_this.selezione.totaleScontato = prezzoTotale;
		
		return prezzoTotale;
	}
	
	

	/*
	_this.aggiornaRiepilogo = function(){
			
			
		var totQuantita = 0;
		jQuery(".quantitaProdotto").each(function(){
			totQuantita += parseInt(jQuery(this).val());
		});
		
		_this.selezione.modifica.boo = false;
		_this.selezione.modifica.id = null;
		_this.selezione.indietro = false;
		_this.selezione.currentStep = 0;
		_this.selezione.prodotto.quantita = totQuantita;
		
		jQuery.registerCookie("selezione",_this.selezione);
		_this.selezione = jQuery.getCookie("selezione");
		
		if(_this.getValidita()){
		_this.selezione.totale = _this.getPrezzoTotale()*totQuantita;
		_this.selezione.totaleScontato = _this.getPrezzoScontato()*totQuantita;
		}else{
		_this.selezione.totale = 0;
		_this.selezione.totaleScontato = 0;
		}
		
	}
	*/
	
	
	_this.viewRiepilogo = function(selezione){
		
		selezione.validita = eval(selezione.validita);
		
		$.Log(selezione);
		
		var quantita = 1;
		if(selezione.quantita)
			quantita = Number(selezione.quantita);
		
		var riepilogo = "";
		riepilogo += "<br><h4 class='title_h4'>RIFERIMENTO: "+(selezione.riferimento?selezione.riferimento:"")+"</h4>";
		riepilogo += "Tipologia: <b>"+selezione.articolo.tipologia+"</b><br>";
		riepilogo += "Modello: <b>"+selezione.articolo.modello+"</b><br>";
		riepilogo += "Altezza: <b>"+selezione.articolo.altezza+"m</b><br>";
		riepilogo += "Componenti: <b>"+selezione.articolo.componenti+"</b><br>";
		riepilogo += "Prezzo: <b>" + Number(selezione.articolo.prezzo_con_componenti).format(false,2) + " EUR</b><br><br>";
		
		if(selezione.optionals.length > 0){
			riepilogo += "<i>Optionals</i><br>";
			for(var i=0;i<selezione.optionals.length;i++){
							
				var costo = Number(selezione.optionals[i].costo);
				var sconto = Number(selezione.sconto);
				
				var qq = Number(selezione.optionals[i].quantita);
				var q_optional = qq*quantita;
				var totale = costo*q_optional;
				var totale_scontato1 = totale - (totale*sconto)/100;
			
				riepilogo += "Codice: <b>" + selezione.optionals[i].codice+"</b><br>";
				riepilogo += "Descrizione:  <b>" + selezione.optionals[i].descrizione+"</b><br>";
				riepilogo += "Prezzo: <b>" + Number(selezione.optionals[i].prezzo).format(false,2)+" EUR</b><br><br>";
			}
			
		}//else  riepilogo += "<h4>Nessun accessorio selezionato</h4>";
		
		riepilogo += "<fieldset><legend style='font-size:14px;'><b>QUANTITA': #"+quantita+"</b></legend></fieldset>";	
			
		return riepilogo;
	}

}