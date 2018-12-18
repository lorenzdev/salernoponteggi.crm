var Sezionale = function(main){

	var _this = this;
	_this.obj;
	_this.elem;
	
	_this.selezione;
	_this.id;
	_this.tipologia;
	_this.modello;
	_this.dimensioniPorta;
	
	
	_this.validita;
	
	_this.prezzoTotale;
	
	_this.init = function(cookie){
		
		_this.selezione = cookie;
		_this.validita = cookie.validita;
		_this.prodotto = cookie.prodotto;
		_this.accessori = cookie.accessori;
		_this.tipologia = cookie.tipologia;
		
		if(jQuery.isEmptyObject(_this.accessori))
		_this.siAccessori = false;
		else
		_this.siAccessori = true;
		
	}
	
	_this.getTipologiaProgetto = function(){
	
		return _this.validita;
	}
	
	_this.getRiepilogo = function(){
		
		var quantita_prodotto = 1;
		if(_this.selezione.prodotto.quantita)
			quantita_prodotto = Number(_this.selezione.prodotto.quantita);
		
		var riepilogo = "";
		riepilogo += "<h4 class='title_h4'>RIFERIMENTO: "+_this.selezione.riferimento+"</h4>";
		riepilogo += "Tipologia: <b>"+_this.selezione.tipologia+"</b><br>";
		riepilogo += "Dimensioni porta LxH(mm): <b>"+_this.selezione.porta.L+"x"+_this.selezione.porta.H+"</b><br>";
		riepilogo += "Foro muro LxH(mm): <b>"+_this.selezione.foroMuro.L+"x"+_this.selezione.foroMuro.H+"</b><br>";
		
		riepilogo += "Tipo posa:<br>";
		if(_this.selezione.ingombro.up.in_luce == 1)
			riepilogo += "• In luce lato superiore<br>";
			else{
			riepilogo += "• Oltre luce lato superiore di <b>"+_this.selezione.ingombro.up.m+" (mm)</b><br>";
			if(_this.selezione.ingombro.up.altezzaSuolo)
				riepilogo += "&nbsp;&nbsp;Altezza da pavimento a solaio di <b>"+_this.selezione.ingombro.up.altezzaSuolo+" (mm)</b><br>";
		}
		if(_this.selezione.ingombro.sx.in_luce == 1)
			riepilogo += "• In luce lato sinistro<br>";
			else
			riepilogo += "• Oltre luce lato sinistro di <b>"+_this.selezione.ingombro.sx.m+" (mm)</b><br>";
		if(_this.selezione.ingombro.dx.in_luce == 1)
			riepilogo += "• In luce lato destro<br>";
			else
			riepilogo += "• Oltre luce lato destro di <b>"+_this.selezione.ingombro.dx.m+" (mm)</b><br>";
		
		
		if(!_this.validita){
			if(_this.prodotto.sconto > 0)
			riepilogo += "Sconto da applicare: <b>" +_this.prodotto.sconto+ "%</b><br>" ;
			else
			riepilogo += "<b>Nessuno sconto da applicare</b><br>" ;	
		}
		
		if(_this.validita){
			riepilogo += "Codice: <b>" + _this.selezione.prodotto.codice + "</b><br>";
			riepilogo += "Colore: <b>RAL"+_this.selezione.prodotto.colorazione + "</b><br>";
			
			//if(_this.quantita)
			//riepilogo += "Quantità: <b>" + _this.quantita + "</b><br>"; 
		
			//riepilogo += "<br>";
			
			//var mq = (_this.selezione.porta.H/1000 * _this.selezione.porta.L/1000);
			
			_this.prezzoTotale = _this.selezione.prodotto.costo;
			
		}
		
		var mq = (_this.selezione.porta.H/1000 * _this.selezione.porta.L/1000);
				mq = Math.round(mq * 100) / 100;
			
			var ml = _this.selezione.porta.L/1000;
				ml = Math.round(ml * 100) / 100;
		
		riepilogo += "MQ: <b>" + mq.format(false,2) + "</b><br>";
		riepilogo += "Quantità: <b>" + quantita_prodotto + "</b><br>";
		
		if(_this.selezione.validita){
			
			var costo = Number(_this.selezione.prodotto.costo);
			var totale = costo*quantita_prodotto;
				sconto = Number(_this.selezione.prodotto.sconto);
			var totale_scontato = totale - (totale*sconto)/100;
		
			_this.selezione.prodotto.totale_non_scontato = totale;
			_this.selezione.prodotto.costo_totale = totale_scontato;
			_this.selezione.prodotto.mq = mq;
			_this.selezione.prodotto.quantita = quantita_prodotto;
		
			riepilogo += "Prezzo: <b>" + costo.format(false,2) + " EUR</b><br>";
			riepilogo += "Totale: <b>" + totale.format(false,2) + " EUR</b><br>";
			
			riepilogo += "<div class='boxSconto'>Sconto: <input type='text' id='prodotto' class='sconto form-control' value='"+sconto+"' totale='"+totale+"' style='width:50px;display:inline-block;' maxlength='3'/>%</div>";
			riepilogo += "Totale scontato: <b><span id='scontoProdottoTotale'>" + totale_scontato.format(false,2) + "</span> EUR</b><br>";
			
		}else if(jQuery.getCookie("utente").ruolo != "ROLE_ADMIN"){
			riepilogo += "<h3><img src='images/warning.png' /> Attenzione!</h3> Le scelte precedenti non permettono al sistema di calcolare un preventivo corretto. <br>";
		}
		
		
		//\alert(1);
		if(_this.siAccessori){
			riepilogo += "<h4 class='title_h4'>Accessori:</h4>";
			
			if(_this.selezione.accessori.struttura){
				
				var totStruttura = 0;
				var totStrutturaNonScontato = 0;
				var riepilogoStruttura = "";
				var siStruttura = false;
				var totale_non_scontato_veletta = 0;
				var totale_scontato_veletta = 0;
				
				var sconto = Number(_this.selezione.accessori.struttura.sconto);

				if(_this.selezione.accessori.struttura.veletta){
					
					siStruttura = true;
			  
				  var ml = Number(_this.selezione.porta.L)/1000;
					  ml = Math.round(ml * 100) / 100;
				  
				  var costo = Number(_this.selezione.accessori.struttura.veletta.costo);
				  var totale = costo*quantita_prodotto*ml;
				  totStrutturaNonScontato += totale;
				  var totale_scontato = totale - (totale*sconto)/100;
				 
				   
				  totStruttura += totale_scontato;
				  
				  riepilogoStruttura += "<i>Veletta</i><br>";
				  riepilogoStruttura += "Codice: <b>" + _this.selezione.accessori.struttura.veletta.codice + "</b><br>"; 
				  riepilogoStruttura += "Descrizione: <b>" + _this.selezione.accessori.struttura.veletta.descrizione + "</b><br>"; 
				  riepilogoStruttura += "ML: <b>" + ml.format(false,2) + "</b><br>";
				  riepilogoStruttura += "Quantità: <b>" + quantita_prodotto + "</b><br>";
				  
				  if(_this.selezione.validita){
					  riepilogoStruttura += "Prezzo a ML: <b>" + costo.format(false,2) + " EUR</b><br>";
					  riepilogoStruttura += "Totale: <b>" + totale.format(false,2) + " EUR</b><br>";
				  }
				  
				  _this.selezione.accessori.struttura.veletta.totale_non_scontato = totale;
				  _this.selezione.accessori.struttura.veletta.costo_totale = totale_scontato;
				  _this.selezione.accessori.struttura.veletta.ml = ml;
				  _this.selezione.accessori.struttura.veletta.quantita = quantita_prodotto;
				  
				  if(_this.selezione.accessori.struttura.veletta.extra){
					  
					  var costo_extra = Number(_this.selezione.accessori.struttura.veletta.extra.costo);
					  var totale_extra = costo_extra*quantita_prodotto*ml;
					  totStrutturaNonScontato += totale_extra;
					  
					  var totale_scontato_extra = totale_extra - (totale_extra*sconto)/100;
					
					  totStruttura += totale_scontato_extra;
					  
					  riepilogoStruttura += "<br><i>Extra lavorazione veletta</i><br>";
					  riepilogoStruttura += "Codice: <b>" + _this.selezione.accessori.struttura.veletta.extra.codice + "</b><br>"; 
					  riepilogoStruttura += "Descrizione: <b>" + _this.selezione.accessori.struttura.veletta.extra.descrizione + "</b><br>"; 
					  
					  if(_this.selezione.accessori.struttura.veletta.extra.tipo_foratura){
						  riepilogoStruttura += "Tipo foratura: <b>" + _this.selezione.accessori.struttura.veletta.extra.tipo_foratura+ "</b><br>"; 
					  }
					  
					  riepilogoStruttura += "ML: <b>" + ml.format(false,2) + "</b><br>";
					  riepilogoStruttura += "Quantità: <b>" + quantita_prodotto + "</b><br>";
					  
					  if(_this.selezione.validita){
					  	riepilogoStruttura += "Prezzo a ML: <b>" + costo_extra.format(false,2) + " EUR</b><br>";
					  	riepilogoStruttura += "Totale: <b>" + totale_extra.format(false,2) + " EUR</b><br>";
					  }
					  
					  _this.selezione.accessori.struttura.veletta.extra.totale_non_scontato = totale_extra;
					  _this.selezione.accessori.struttura.veletta.extra.costo_totale = totale_scontato_extra;
					  _this.selezione.accessori.struttura.veletta.extra.ml = ml;
					  _this.selezione.accessori.struttura.veletta.extra.quantita = quantita_prodotto;
					   
				  }
				  
				  	
					
				}
				
				if(_this.selezione.accessori.struttura.spallettaSX){
					siStruttura = true;
					
					var ml = Number(_this.selezione.foroMuro.H)/1000;
						ml = Math.round(ml * 100) / 100;
					
					var costo = Number(_this.selezione.accessori.struttura.spallettaSX.costo);
					var totale = costo*quantita_prodotto*ml;
					totStrutturaNonScontato += totale;
					var totale_scontato = totale - (totale*sconto)/100;
					
					totStruttura += totale_scontato;
					
					_this.selezione.accessori.struttura.spallettaSX.totale_non_scontato = totale;
					_this.selezione.accessori.struttura.spallettaSX.costo_totale = totale_scontato;
					_this.selezione.accessori.struttura.spallettaSX.ml = ml;
					_this.selezione.accessori.struttura.spallettaSX.quantita = quantita_prodotto;
					
					riepilogoStruttura += "<br><i>Spalletta sinistra</i><br>";
					riepilogoStruttura += "Codice: <b>" + _this.selezione.accessori.struttura.spallettaSX.codice + "</b><br>"; 
					riepilogoStruttura += "ML: <b>" + ml.format(false,2) + "</b><br>";
					riepilogoStruttura += "Quantità: <b>" + quantita_prodotto + "</b><br>";
					if(_this.selezione.validita){
						riepilogoStruttura += "Prezzo a ML: <b>" + costo.format(false,2) + " EUR</b><br>";
						riepilogoStruttura += "Totale: <b>" + totale.format(false,2) + " EUR</b><br>";
					}
					
				}
				
				if(_this.selezione.accessori.struttura.spallettaDX){
					siStruttura = true;
					
					var ml = Number(_this.selezione.foroMuro.H)/1000;
						ml = Math.round(ml * 100) / 100;
					
					var costo = Number(_this.selezione.accessori.struttura.spallettaDX.costo);
					var totale = costo*quantita_prodotto*ml;
					totStrutturaNonScontato += totale;
					
					var totale_scontato = totale - (totale*sconto)/100;
					
					totStruttura += totale_scontato;
					
					_this.selezione.accessori.struttura.spallettaDX.totale_non_scontato = totale;
					_this.selezione.accessori.struttura.spallettaDX.costo_totale = totale_scontato;
					_this.selezione.accessori.struttura.spallettaDX.ml = ml;
					_this.selezione.accessori.struttura.spallettaDX.quantita = quantita_prodotto;
					
					riepilogoStruttura += "<br><i>Spalletta destra</i><br>";
					riepilogoStruttura += "Codice: <b>" + _this.selezione.accessori.struttura.spallettaDX.codice + "</b><br>"; 
					riepilogoStruttura += "ML: <b>" + ml.format(false,2) + "</b><br>";
					riepilogoStruttura += "Quantità: <b>" + quantita_prodotto + "</b><br>";
					if(_this.selezione.validita){
						riepilogoStruttura += "Prezzo a ML: <b>" + costo.format(false,2) + " EUR</b><br>";
						riepilogoStruttura += "Totale: <b>" + totale.format(false,2) + " EUR</b><br>";
					}
				}
				
				
				var totaleScontato = totStruttura;
				
				if(_this.validita){
					riepilogoStruttura += "<br>Totale: <b>"+Number(totStrutturaNonScontato).format(false,2)+" EUR</b><br>";
					riepilogoStruttura += "<div class='boxSconto'>Sconto: <input type='text' id='struttura' totale='"+totStruttura+"' style='width:50px;display:inline-block;' class='sconto form-control' value='"+sconto+"' maxlength='3'/>%<br></div>";
					riepilogoStruttura += "Totale scontato: <b><span id='scontoStrutturaTotale'>"+Number(totaleScontato).format(false,2)+"</span> EUR</b><br>";	
				}
				
				if(siStruttura){
					riepilogo += "<fieldset style='margin-bottom:15px'><legend style=\"font-size:14px;margin-bottom:10px;\"><b>STRUTTURA</b></legend>"+riepilogoStruttura+"</fieldset>";	
				}
				
				
			}
			
			
			if(_this.selezione.accessori.sistemaRifinitura){
				
				var costo = Number(_this.selezione.accessori.sistemaRifinitura.costo);
				
				riepilogo += "<fieldset style='margin-bottom:15px'><legend style=\"font-size:14px;margin-bottom:10px;\"><b>SISTEMI DI RIFINITURA</b></legend>";
				riepilogo += "Codice: <b>" + _this.selezione.accessori.sistemaRifinitura.codice + "</b><br>"; 
				
				var num_coprifili = 0;
				
				if(_this.selezione.validita) riepilogo += "Prezzo intero kit: <b>" + Number(costo*3).format(false,2) + " EUR</b><br>"; 
				
				////$.Log("Sistemi di rifinitura ok");
				
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
					
				var totale = costo*quantita_prodotto*num_coprifili;
				var sconto = Number(_this.selezione.accessori.sistemaRifinitura.sconto);
				var totale_scontato = totale - (totale*sconto)/100;
				
				_this.selezione.accessori.sistemaRifinitura.totale_non_scontato = totale;
				_this.selezione.accessori.sistemaRifinitura.costo_totale = totale_scontato;
				_this.selezione.accessori.sistemaRifinitura.quantita = quantita_prodotto;
				_this.selezione.accessori.sistemaRifinitura.quantita_tot = quantita_prodotto*num_coprifili;
			
				
				riepilogo += "Quantità: <b>" + quantita_prodotto*num_coprifili + "</b><br><br>";
				if(_this.selezione.validita){
					riepilogo += "Totale: <b>" + totale.format(false,2) + " EUR</b><br>"; 
					riepilogo += "<div class='boxSconto'>Sconto: <input type='text' id='sistemaRifinitura' style='width:50px;display:inline-block;' class='sconto form-control' totale='"+totale+"' value='"+sconto+"' maxlength='3'/>%<br></div>";
					riepilogo += "Totale scontato: <b><span id='scontoSistemaRifinituraTotale'>"+totale_scontato.format(false,2)+"</span> EUR</b><br>";
				}
				riepilogo += "</fieldset>";
			
			}
			
			
			if(_this.selezione.accessori.oblo){
				
				var costo = Number(_this.selezione.accessori.oblo.costo);
				var sconto = Number(_this.selezione.accessori.oblo.sconto);
				
				riepilogo += "<fieldset style='margin-bottom:15px'><legend style=\"font-size:14px;margin-bottom:10px;\"><b>OBLO'</b></legend>";
				riepilogo += "Codice: <b>" + _this.selezione.accessori.oblo.codice + "</b><br>"; 
				if(_this.selezione.validita)
					riepilogo += "Prezzo cadauno: <b>" + costo.format(false,2) + " EUR</b><br>"; 
				
				var q = 0;
				var cont = 0;
				jQuery.each(_this.selezione.accessori.oblo.sezioni, function(i, item) {
					cont++;
					q += Number(item);
					if(Number(item) > 0)
						riepilogo += "Quantità di oblò nella sezione n. "+cont+": <b>" + item + " </b><br>";
				});
				
				riepilogo += "<br>";
				
				var totale = costo*q*quantita_prodotto;
				var totale_scontato = totale - totale*sconto/100;
				
				_this.selezione.accessori.oblo.totale_non_scontato = totale;
				_this.selezione.accessori.oblo.costo_totale = totale_scontato;
				_this.selezione.accessori.oblo.quantita = q*quantita_prodotto;
				
				if(_this.selezione.validita){
					riepilogo += "Totale: <b>"+totale.format(false,2)+" EUR</b><br>";
					riepilogo += "<div class='boxSconto'>Sconto: <input type='text' id='oblo' totale='"+totale+"' style='width:50px;display:inline-block;' class='sconto form-control' value='"+sconto+"' maxlength='3'/>%<br></div>";
					riepilogo += "Totale scontato: <b><span id='scontoObloTotale'>"+totale_scontato.format(false,2)+"</span> EUR</b>";
				}
				riepilogo += "</fieldset>";
				
			}
			
			
			if(_this.selezione.accessori.griglie){
				
				var costo = Number(_this.selezione.accessori.griglie.costo);
				var sconto = Number(_this.selezione.accessori.griglie.sconto);
				
				riepilogo += "<fieldset style='margin-bottom:15px'><legend style=\"font-size:14px;margin-bottom:10px;\"><b>GRIGLIE</b></legend>";
				riepilogo += "Codice: <b>" + _this.selezione.accessori.griglie.codice + "</b><br>"; 
				
				if(_this.selezione.validita)
					riepilogo += "Prezzo cadauno: <b>" + costo.format(false,2) + " EUR</b><br>"; 
				
				var q = 0;
				var cont = 0;
				jQuery.each(_this.selezione.accessori.griglie.sezioni, function(i, item) {
					cont++;
					q += Number(item);
					if(Number(item) > 0)
						riepilogo += "Quantità di griglie nella sezione n. "+cont+": <b>" + item + " </b><br>";
				});
			
				riepilogo += "<br>";
			
				var totale = costo*q*quantita_prodotto;
				var totale_scontato = totale - (totale*sconto)/100;
				
				_this.selezione.accessori.griglie.totale_non_scontato = totale;
				_this.selezione.accessori.griglie.costo_totale = totale_scontato;
				_this.selezione.accessori.griglie.quantita = q*quantita_prodotto;
				
				if(_this.selezione.validita){
					riepilogo += "Totale: <b>"+totale.format(false,2)+" EUR</b><br>";
					riepilogo +="<div class='boxSconto'>Sconto: <input type='text' id='griglie' totale='"+totale+"' style='width:50px;display:inline-block;' class='sconto form-control' value='"+sconto+"' maxlength='3'/>%<br></div>";
					riepilogo += "Totale scontato: <b><span id='scontoGriglieTotale'>"+Number(totale_scontato).format(false,2)+"</span> EUR</b><br>";
				}
				
				riepilogo += "</fieldset>";
				
			}
			
			
			if(_this.selezione.accessori.molle){
				
				riepilogo += "<fieldset style='margin-bottom:15px'><legend style=\"font-size:14px;margin-bottom:10px;\"><b>MOLLE</b></legend>";
			
				var sconto = Number(_this.selezione.accessori.molle.sconto);
				var totaleMolleScontato = 0;
				var totaleMolle = 0;
				for(var i = 0;i < _this.selezione.accessori.molle.articoli.length;i++){
					
					var costo = Number(_this.selezione.accessori.molle.articoli[i].costo);
					
					var totale = costo*quantita_prodotto;
					var totale_scontato = totale - (totale*sconto)/100;
					
					riepilogo += "Codice: <b>" + _this.selezione.accessori.molle.articoli[i].codice + "</b><br>"; 
					riepilogo += "Quantità: <b>" + quantita_prodotto + "</b><br>";
					
					if(_this.selezione.validita){
						riepilogo += "Prezzo: <b>" + costo.format(false,2) + " EUR</b><br>";
						riepilogo += "Totale: <b>" + totale.format(false,2) + "</b><br><br>";
					}
				
					_this.selezione.accessori.molle.articoli[i].totale_non_scontato = totale;
					_this.selezione.accessori.molle.articoli[i].costo_totale = totale_scontato;
					_this.selezione.accessori.molle.articoli[i].quantita = quantita_prodotto;
					
					totaleMolleScontato += totale_scontato;
					totaleMolle += totale;
				}
				
				if(_this.selezione.validita){
					riepilogo += "Totale: <b>" + totaleMolle.format(false,2) + " EUR</b><br>";
					riepilogo += "<div class='boxSconto'>Sconto: <input type='text' id='molle' totale='"+totaleMolle+"' style='width:50px;display:inline-block;' class='sconto form-control' value='"+sconto+"' maxlength='3'/>%<br></div>";
					riepilogo += "Totale scontato: <b><span id='scontoMolleTotale'>"+totaleMolleScontato.format(false,2)+"</span> EUR</b>";
				}
			
				riepilogo += "</fieldset>";
				
			}
			  
			  
			if(_this.selezione.accessori.sistemaChiusura){
				
				var costo = Number(_this.selezione.accessori.sistemaChiusura.costo);
				var totale = costo*quantita_prodotto;
				var sconto = Number(_this.selezione.accessori.sistemaChiusura.sconto);
				var totale_scontato = totale - (totale*sconto)/100;
			
				_this.selezione.accessori.sistemaChiusura.totale_non_scontato = totale;
				_this.selezione.accessori.sistemaChiusura.costo_totale = totale_scontato;
				_this.selezione.accessori.sistemaChiusura.quantita = quantita_prodotto;	
				
				riepilogo += "<fieldset style='margin-bottom:15px'><legend style=\"font-size:14px;margin-bottom:10px;\"><b>SISTEMI DI CHIUSURA</b></legend>";
				riepilogo += "Codice: <b>" + _this.selezione.accessori.sistemaChiusura.codice + "</b><br>"; 
				riepilogo += "Quantità: <b>" + quantita_prodotto + "</b><br><br>";
				
				if(_this.selezione.validita){
					riepilogo += "Prezzo: <b>" + costo.format(false,2) + " EUR</b><br>"; 
					riepilogo += "Totale: <b>"+totale.format(false,2)+" EUR</b><br>";
					riepilogo += "<div class='boxSconto'>Sconto: <input type='text' id='sistemaChiusura' totale='"+totale+"' style='width:50px;display:inline-block;' class='sconto form-control' value='"+sconto+"' maxlength='3'/>%<br></div>";
					riepilogo += "Totale scontato: <b><span id='scontoSistemaChiusuraTotale'>"+totale_scontato.format(false,2)+"</span> EUR</b><br>";
					
				}
				
				riepilogo += "</fieldset>";

			}
			
			
			
			if(_this.selezione.accessori.passaggioPedonale){
				
				if(_this.selezione.accessori.passaggioPedonale.porta_pedonale){
				
					var costo = Number(_this.selezione.accessori.passaggioPedonale.porta_pedonale.costo);
					var totale = costo*quantita_prodotto;
					var sconto = Number(_this.selezione.accessori.passaggioPedonale.porta_pedonale.sconto);
					var totale_scontato = totale - (totale*sconto)/100;
				
					_this.selezione.accessori.passaggioPedonale.porta_pedonale.totale_non_scontato = totale;
					_this.selezione.accessori.passaggioPedonale.porta_pedonale.costo_totale = totale_scontato;
					_this.selezione.accessori.passaggioPedonale.porta_pedonale.quantita = quantita_prodotto;
					
					
					riepilogo += "<fieldset style='margin-bottom:15px'><legend style=\"font-size:14px;margin-bottom:10px;\"><b>PASSAGGIO PEDONALE</b></legend>";
					riepilogo += "Codice: <b>" + _this.selezione.accessori.passaggioPedonale.porta_pedonale.codice + "</b><br>"; 
					riepilogo += "Quantità: <b>" + quantita_prodotto + "</b><br>"; 
					
					if(_this.selezione.validita)
						riepilogo += "Prezzo: <b>" + costo.format(false,2) + " EUR</b><br>";
					
					 
					riepilogo += "Posizione passaggio:<b>"+_this.selezione.accessori.passaggioPedonale.porta_pedonale.posizione+"</b> <br>";
					
					if(_this.selezione.accessori.passaggioPedonale.porta_pedonale.apertura == "sx")
						riepilogo += "Posizione apertura: <b>sinistra a spingere</b><br>";
					
					if(_this.selezione.accessori.passaggioPedonale.porta_pedonale.apertura == "dx")
						riepilogo += "Posizione apertura: <b>destra a spingere</b><br>";
					
					if(_this.selezione.validita){
						riepilogo += "Totale: <b>" + totale.format(false,2) + " EUR</b><br>";
						riepilogo += "<div class='boxSconto'>Sconto: <input type='text' id='porta_pedonale' style='width:50px;display:inline-block;' class='sconto form-control' totale='"+totale+"' value='"+sconto+"' maxlength='3'/>%<br></div>";	
						riepilogo += "Totale scontato: <b><span id='scontoPassaggioPedonaleTotale'>"+totale_scontato.format(false,2)+"</span> EUR</b><br>";
					}
					
					riepilogo += "</fieldset>";

				}
				
			
				if(_this.selezione.accessori.passaggioPedonale.maniglione){
				
					var costo = Number(_this.selezione.accessori.passaggioPedonale.maniglione.costo);
					var totale = costo*quantita_prodotto;
					var sconto = Number(_this.selezione.accessori.passaggioPedonale.maniglione.sconto);
					var totale_scontato = totale - (totale*sconto)/100;
				
					_this.selezione.accessori.passaggioPedonale.maniglione.totale_non_scontato = totale;
					_this.selezione.accessori.passaggioPedonale.maniglione.costo_totale = totale_scontato;
					_this.selezione.accessori.passaggioPedonale.maniglione.quantita = quantita_prodotto;
					
					riepilogo += "<fieldset style='margin-bottom:15px'><legend style=\"font-size:14px;margin-bottom:10px;\"><b>MANIGLIONE</b></legend>";
					riepilogo += "Codice: <b>" + _this.selezione.accessori.passaggioPedonale.maniglione.codice + "</b><br>"; 
					riepilogo += "Quantità: <b>" + quantita_prodotto + "</b><br>"; 
					
					if(_this.selezione.validita)
						riepilogo += "Prezzo: <b>" + costo.format(false,2) + " EUR</b><br>";
					
					
					if(_this.selezione.validita){
						riepilogo += "Totale: <b>" + totale.format(false,2) + " EUR</b><br>";
						riepilogo += "<div class='boxSconto'>Sconto: <input type='text' id='maniglione' style='width:50px;display:inline-block;' class='sconto form-control' totale='"+totale+"' value='"+sconto+"' maxlength='3'/>%<br></div>";	
						riepilogo += "Totale scontato: <b><span id='scontoPassaggioPedonaleTotale'>"+totale_scontato.format(false,2)+"</span> EUR</b><br>";
					}
					
					riepilogo += "</fieldset>";

				}
				
				
			}
			  
			  
			 if(_this.selezione.accessori.motorizzazione){
				
				var costo = Number(_this.selezione.accessori.motorizzazione.costo);
				var totale = costo*quantita_prodotto;
				var sconto = Number(_this.selezione.accessori.motorizzazione.sconto);
				var totale_scontato = totale - (totale*sconto)/100;
			
				_this.selezione.accessori.motorizzazione.totale_non_scontato = totale;
				_this.selezione.accessori.motorizzazione.costo_totale = totale_scontato;
				_this.selezione.accessori.motorizzazione.quantita = quantita_prodotto;
				
				riepilogo += "<fieldset style='margin-bottom:15px'><legend style=\"font-size:14px;margin-bottom:10px;\"><b>MOTORIZZAZIONE</b></legend>";
				riepilogo += "Codice: <b>" + _this.selezione.accessori.motorizzazione.codice + "</b><br>"; 
				riepilogo += "Quantità: <b>" + quantita_prodotto + "</b><br>";
				
				if(_this.selezione.validita){
					riepilogo += "Prezzo: <b>" + costo.format(false,2)+" EUR</b><br>";
					riepilogo += "Totale: <b>" + totale.format(false,2)+" EUR</b><br>";
				}
				
				////$.Log("Motorizzazione OK!");
				
				if(_this.selezione.accessori.motorizzazione.optional.length > 0){
					
					riepilogo += "<br><i>Optional motorizzazione</i><br>";
					
					var totaleOptionalScontato = 0;
					var totaleOptional = 0;
					
					if(_this.selezione.accessori.motorizzazione.optional.length>0){
						
						for(var i=0;i<_this.selezione.accessori.motorizzazione.optional.length;i++){
							
							var costo1 = Number(_this.selezione.accessori.motorizzazione.optional[i].costo);
							var sconto1 = Number(_this.selezione.accessori.motorizzazione.sconto);
							var q_optional = Number(_this.selezione.accessori.motorizzazione.optional[i].quantita)*quantita_prodotto;
							var totale1 = costo1*q_optional;
							
							var totale_scontato1 = totale1 - (totale1*sconto1)/100;
						
							totaleOptionalScontato += totale_scontato1;
							totaleOptional += totale1;
							
							_this.selezione.accessori.motorizzazione.optional[i].totale_non_scontato = totale1;
							_this.selezione.accessori.motorizzazione.optional[i].costo_totale = totale_scontato1;
							_this.selezione.accessori.motorizzazione.optional[i].quantita_tot = q_optional;
							
							riepilogo += "Codice"+(i+1)+": <b>" + _this.selezione.accessori.motorizzazione.optional[i].codice+"</b><br>";
							riepilogo += "Quantità:  <b>" + q_optional+"</b><br>";
							
							if(_this.selezione.validita){
								riepilogo += "Prezzo: <b>" + costo1.format(false,2)+" EUR</b><br>";
								riepilogo += "Totale: <b>" + totale1.format(false,2)+" EUR</b><br><br>";
							}else riepilogo += "<br>";
						}
						
						totale_scontato += totaleOptionalScontato;
						totale += totaleOptional;
						
					}
					
				}
				
				_this.selezione.accessori.motorizzazione.costo_totale_con_optional = totale_scontato;
				
				if(_this.selezione.validita){
					riepilogo += "Totale: <b>"+totale.format(false,2)+" EUR</b><br>";
					riepilogo += "<div class='boxSconto'>Sconto: <input type='text' id='motorizzazione' style='width:50px;display:inline-block;' class='sconto form-control' totale='"+totale+"' value='"+sconto+"' maxlength='3'/>%<br></div>";
					riepilogo += "Totale scontato: <b><span id='scontoMotorizzazioneTotale'>"+totale_scontato.format(false,2)+"</span> EUR</b><br>";
				}
				
				riepilogo += "</fieldset>";
			}
			
		}
		
		riepilogo += "<br><span id='messageQuantita'><b>Quantità sezionali richieste con stesse dimensioni, modello e accessori</b>:<br><input type='text' class='quantitaProdotto form-control' value='"+quantita_prodotto+"' maxlength='3' id=\"quantitaUnitaria\" style='width:100px;display:inline-block;'></span><br><br>";	
		
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
		if(_this.sopraluce.height > 0){
			_this.siAccessori = true;
			_this.prezzoTotale += _this.sopraluce.totale;
		}
	}
	
	_this.getSistemaChiusura = function(){
		
		_this.sistemaChiusura = _this.accessori.sistemaChiusura;	
		if(_this.accessori.sistemaChiusura.serratura != null && _this.accessori.sistemaChiusura.serratura != undefined){
			_this.siAccessori = true;
			_this.prezzoTotale += _this.sistemaChiusura.totale;
		}
	}
	
	_this.getSistemaRifinitura = function(){
		
		_this.sistemaRifinitura = _this.accessori.sistemaRifinitura;
		if(_this.accessori.sistemaRifinitura.articolo != null && _this.accessori.sistemaRifinitura.articolo != undefined){
			_this.siAccessori = true;
			_this.prezzoTotale += _this.sistemaRifinitura.totale;
		}
	}
	
	_this.getMotorizzazione = function(){
		
		_this.motorizzazione = _this.accessori.motorizzazione;
		if(_this.accessori.motorizzazione.articolo != null && _this.accessori.motorizzazione.articolo != undefined){
			_this.siAccessori = true;
			_this.prezzoTotale += _this.motorizzazione.totale;
		}
	}
	
	_this.getPredisposizioneMotorizzazione = function(){
		
		_this.predisposizioneMotorizzazione = _this.accessori.predisposizioneMotorizzazione;
		if(_this.accessori.predisposizioneMotorizzazione.articolo != null && _this.accessori.predisposizioneMotorizzazione.articolo != undefined){
			_this.siAccessori = true;
			_this.prezzoTotale += _this.predisposizioneMotorizzazione.articolo.totale;
		}
	}
	
	_this.getPassaggioPedonale = function(){
		
		_this.passaggioPedonale = _this.accessori.passaggioPedonale;
		if(_this.accessori.passaggioPedonale.articolo != null && _this.accessori.passaggioPedonale.articolo != undefined){
			_this.siAccessori = true;
			_this.prezzoTotale += _this.passaggioPedonale.totale;
		}
	}
	
	_this.getVerniciatura = function(){
		
		_this.verniciatura = _this.accessori.verniciatura;	
		if(_this.accessori.verniciatura.articolo != null){
			_this.siAccessori = true;
			_this.prezzoTotale += _this.verniciatura.articolo.totale;
		}
	}
	
	_this.getPrezzoTotale = function(){
		
		var prezzoTotale = 0;
		
		$.Log("SELEZIONE");
		$.Log(_this.selezione);
		
		// TOTALE SCONTATO DELLA PORTA
		prezzoTotale += Number(_this.selezione.prodotto.totale_non_scontato);
		$.Log("Prodotto: " + _this.selezione.prodotto.totale_non_scontato);
		
		// TOTALE STRUTTURA
		if(_this.selezione.accessori.struttura){
			if(_this.selezione.accessori.struttura.veletta){
				prezzoTotale += Number(_this.selezione.accessori.struttura.veletta.totale_non_scontato);
				
				if(_this.selezione.accessori.struttura.veletta.extra)
					prezzoTotale += Number(_this.selezione.accessori.struttura.veletta.extra.totale_non_scontato);
			}
			
			if(_this.selezione.accessori.struttura.spallettaSX)
				prezzoTotale += Number(_this.selezione.accessori.struttura.spallettaSX.totale_non_scontato);
					
			if(jQuery.validaValore(_this.selezione.accessori.struttura.spallettaDX))
				prezzoTotale += Number(_this.selezione.accessori.struttura.spallettaDX.totale_non_scontato); 
		}
			
		// TOTALE GRIGLIE
		if(_this.selezione.accessori.griglie){
			prezzoTotale += Number(_this.selezione.accessori.griglie.totale_non_scontato); 	
		}
		
		// TOTALE OBLO
		if(_this.selezione.accessori.oblo){
			prezzoTotale += Number(_this.selezione.accessori.oblo.totale_non_scontato); 		
		}
			
		// TOTALE MOLLE
		if(_this.selezione.accessori.molle){
			for(var i = 0;i < _this.selezione.accessori.molle.articoli.length;i++)
				prezzoTotale += Number(_this.selezione.accessori.molle.articoli[i].totale_non_scontato);
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
			
		// TOTALE SCONTATO DEL SISTEMA DI PASSAGGIO PEDONALE
		if(_this.selezione.accessori.passaggioPedonale){
			if(_this.selezione.accessori.passaggioPedonale.porta_pedonale){
				prezzoTotale += Number(_this.selezione.accessori.passaggioPedonale.porta_pedonale.totale_non_scontato);	
				$.Log("Passaggio porta pedonale: " + _this.selezione.accessori.passaggioPedonale.porta_pedonale.totale_non_scontato);
			}
			
			if(_this.selezione.accessori.passaggioPedonale.maniglione){
				prezzoTotale += Number(_this.selezione.accessori.passaggioPedonale.maniglione.totale_non_scontato);	
				$.Log("Passaggio maniglione: " + _this.selezione.accessori.passaggioPedonale.maniglione.totale_non_scontato);
			}
		}
			
		// TOTALE SCONTATO DEL SISTEMA DI CHIUSURA
		if(_this.selezione.accessori.sistemaChiusura){
			prezzoTotale += Number(_this.selezione.accessori.sistemaChiusura.totale_non_scontato);
			$.Log("Sistema chiusura: " + _this.selezione.accessori.sistemaChiusura.totale_non_scontato);
		}
			
		// TOTALE SCONTATO DEL SISTEMA DI RIFNITURA
		if(_this.selezione.accessori.sistemaRifinitura){
			prezzoTotale += Number(_this.selezione.accessori.sistemaRifinitura.totale_non_scontato);
			$.Log("Sistema rifinitura: " + _this.selezione.accessori.sistemaRifinitura.totale_non_scontato);
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
		$.Log("Prodotto: " + _this.selezione.prodotto.costo_totale);
		
		// TOTALE STRUTTURA
		if(_this.selezione.accessori.struttura){
			if(_this.selezione.accessori.struttura.veletta){
				prezzoTotale += Number(_this.selezione.accessori.struttura.veletta.costo_totale);
			
				if(_this.selezione.accessori.struttura.veletta.extra){
					prezzoTotale += Number(_this.selezione.accessori.struttura.veletta.extra.costo_totale);
				}
			}
				
			if(_this.selezione.accessori.struttura.spallettaSX)
				prezzoTotale += Number(_this.selezione.accessori.struttura.spallettaSX.costo_totale);
					
			if(jQuery.validaValore(_this.selezione.accessori.struttura.spallettaDX))
				prezzoTotale += Number(_this.selezione.accessori.struttura.spallettaDX.costo_totale); 
		}
			
		// TOTALE GRIGLIE
		if(_this.selezione.accessori.griglie){
			prezzoTotale += Number(_this.selezione.accessori.griglie.costo_totale); 	
		}
		
		// TOTALE OBLO
		if(_this.selezione.accessori.oblo){
			prezzoTotale += Number(_this.selezione.accessori.oblo.costo_totale); 		
		}
			
		// TOTALE MOLLE
		if(_this.selezione.accessori.molle){
			for(var i = 0;i < _this.selezione.accessori.molle.articoli.length;i++)
				prezzoTotale += Number(_this.selezione.accessori.molle.articoli[i].costo_totale);
		}
			  
		// TOTALE SCONTATO DEL SISTEMA DI MOTORIZZAZIONE
		if(_this.selezione.accessori.motorizzazione){
			prezzoTotale += Number(_this.selezione.accessori.motorizzazione.costo_totale);
			
			$.Log("Motorizzazione: " + _this.selezione.accessori.motorizzazione.costo_totale);
			
			if(_this.selezione.accessori.motorizzazione.optional.length > 0){
				for(var i = 0;i < _this.selezione.accessori.motorizzazione.optional.length;i++){
					prezzoTotale += Number(_this.selezione.accessori.motorizzazione.optional[i].costo_totale);
					$.Log("Optional "+i+": " + _this.selezione.accessori.motorizzazione.optional[i].costo_totale);
				}
			}
		}
			
		// TOTALE SCONTATO DEL SISTEMA DI PASSAGGIO PEDONALE
		if(_this.selezione.accessori.passaggioPedonale){
			if(_this.selezione.accessori.passaggioPedonale.porta_pedonale){
				prezzoTotale += Number(_this.selezione.accessori.passaggioPedonale.porta_pedonale.costo_totale);	
				$.Log("Passaggio porta pedonale: " + _this.selezione.accessori.passaggioPedonale.porta_pedonale.costo_totale);
			}
			
			if(_this.selezione.accessori.passaggioPedonale.maniglione){
				prezzoTotale += Number(_this.selezione.accessori.passaggioPedonale.maniglione.costo_totale);	
				$.Log("Passaggio maniglione: " + _this.selezione.accessori.passaggioPedonale.maniglione.costo_totale);
			}
		}
			
		// TOTALE SCONTATO DEL SISTEMA DI CHIUSURA
		if(_this.selezione.accessori.sistemaChiusura){
			prezzoTotale += Number(_this.selezione.accessori.sistemaChiusura.costo_totale);
			$.Log("Sistema chiusura: " + _this.selezione.accessori.sistemaChiusura.costo_totale);
		}
			
		// TOTALE SCONTATO DEL SISTEMA DI RIFNITURA
		if(_this.selezione.accessori.sistemaRifinitura){
			prezzoTotale += Number(_this.selezione.accessori.sistemaRifinitura.costo_totale);
			$.Log("Sistema rifinitura: " + _this.selezione.accessori.sistemaRifinitura.costo_totale);
		}

		_this.selezione.totaleScontato = prezzoTotale;
		return prezzoTotale;
	}
	
	
	
	
	_this.ricalcolaTotale = function(prodotto){
		
		var quantita = prodotto.quantita;
		return _this.getPrezzoTotale(prodotto)*quantita;
		
	}
	
	
	_this.ricalcolaTotaleScontato = function(prodotto){
		
		var quantita = prodotto.quantita;
		return _this.getPrezzoTotaleScontato(prodotto)*quantita;
	
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
		
		jQuery.registerCookie("selezione",cookieSelezione);
		cookieSelezione = jQuery.getCookie("selezione");
		
		if(_this.getValidita()){
		cookieSelezione.totale = _this.getPrezzoTotale()*totQuantita;
		cookieSelezione.totaleScontato = _this.getPrezzoScontato()*totQuantita;
		}else{
		cookieSelezione.totale = 0;
		cookieSelezione.totaleScontato = 0;
		}
		
		jQuery.registerCookie("selezione",cookieSelezione);
	}
	
	
	
	_this.viewRiepilogo = function(selezione){
		
		selezione.validita = eval(selezione.validita);
		
		$.Log(selezione);
		
		var quantita_prodotto = 1;
		if(selezione.prodotto.quantita)
			quantita_prodotto = Number(selezione.prodotto.quantita);
		
		var riepilogo = "";
		riepilogo += "<h3>RIFERIMENTO: "+selezione.riferimento+"</h3>";
		riepilogo += "Tipologia: <b>"+selezione.tipologia+"</b><br>";
		riepilogo += "Dimensioni porta LxH(mm): <b>"+selezione.porta.L+"x"+selezione.porta.H+"</b><br>";
		riepilogo += "Foro muro LxH(mm): <b>"+selezione.foroMuro.L+"x"+selezione.foroMuro.H+"</b><br>";
		
		riepilogo += "Tipo posa:<br>";
		if(selezione.ingombro.up.in_luce == 1)
			riepilogo += "• In luce lato superiore<br>";
			else{
			riepilogo += "• Oltre luce lato superiore di <b>"+selezione.ingombro.up.m+" (mm)</b><br>";
			if(selezione.ingombro.up.altezzaSuolo)
				riepilogo += "&nbsp;&nbsp;Altezza da pavimento a solaio di <b>"+selezione.ingombro.up.altezzaSuolo+" (mm)</b><br>";
		}
		if(selezione.ingombro.sx.in_luce == 1)
			riepilogo += "• In luce lato sinistro<br>";
			else
			riepilogo += "• Oltre luce lato sinistro di <b>"+selezione.ingombro.sx.m+" (mm)</b><br>";
		if(selezione.ingombro.dx.in_luce == 1)
			riepilogo += "• In luce lato destro<br>";
			else
			riepilogo += "• Oltre luce lato destro di <b>"+selezione.ingombro.dx.m+" (mm)</b><br>";
		
		
		if(!_this.validita){
			if(selezione.prodotto.sconto > 0)
			riepilogo += "Sconto da applicare: <b>" +selezione.sconto+ "%</b><br>";
			else
			riepilogo += "<b>Nessuno sconto da applicare</b><br>";	
		}
		
		if(_this.validita){
			riepilogo += "Codice: <b>" + selezione.prodotto.codice + "</b><br>";
			riepilogo += "Colore: <b>RAL"+selezione.prodotto.colorazione + "</b><br>";
			
			//if(_this.quantita)
			//riepilogo += "Quantità: <b>" + _this.quantita + "</b><br>"; 
		
			//riepilogo += "<br>";
			
			//var mq = (selezione.porta.H/1000 * selezione.porta.L/1000);
			
			_this.prezzoTotale = selezione.prodotto.costo;
			
		}
		
		
		
		var mq = (selezione.porta.H/1000 * selezione.porta.L/1000);
				mq = Math.round(mq * 100) / 100;
			
			var ml = selezione.porta.L/1000;
				ml = Math.round(ml * 100) / 100;
		riepilogo += "MQ: <b>" + mq.format(false,2) + "</b><br>";
		riepilogo += "Quantità: <b>" + quantita_prodotto + "</b><br>";
		
		if(selezione.validita){
			
			var costo = Number(selezione.prodotto.costo);
			var totale = costo*quantita_prodotto;
				sconto = Number(selezione.prodotto.sconto);
			var totale_scontato = totale - (totale*sconto)/100;
		
			
			riepilogo += "Prezzo: <b>" + costo.format(false,2) + " EUR</b><br>";
			
			riepilogo += "Totale: <b>" + totale.format(false,2) + " EUR</b><br>";
			
			riepilogo += "<div class='boxSconto'>Sconto: <input type='text' id='prodotto' class='sconto form-control' value='"+sconto+"' totale='"+totale+"' style='width:50px;display:inline-block;' maxlength='3'/>%</div><br>";
			riepilogo += "Totale scontato: <b><span id='scontoProdottoTotale'>" + totale_scontato.format(false,2) + "</span> EUR</b><br>";
			
		}else if(jQuery.getCookie("utente").ruolo != "ROLE_ADMIN"){
			riepilogo += "<h3><img src='images/warning.png' /> Attenzione!</h3> Le scelte precedenti non permettono al sistema di calcolare un preventivo corretto. <br>";
		}
		
		
		if(!jQuery.isEmptyObject(selezione.accessori)){
			riepilogo += "<h4 class='title_h4'>Accessori:</h4>";
			
			if(selezione.accessori.struttura){
				
				var totStruttura = 0;
				var totStrutturaNonScontato = 0;
				var riepilogoStruttura = "";
				var siStruttura = false;
				var totale_non_scontato_veletta = 0;
				var totale_scontato_veletta = 0;
				
				var sconto = Number(selezione.accessori.struttura.sconto);

				if(selezione.accessori.struttura.veletta){
					
					siStruttura = true;
			  
				  var ml = Number(selezione.porta.L)/1000;
					  ml = Math.round(ml * 100) / 100;
				  
				  var costo = Number(selezione.accessori.struttura.veletta.costo);
				  var totale = costo*quantita_prodotto*ml;
				  totStrutturaNonScontato += totale;
				  var totale_scontato = totale - (totale*sconto)/100;
				 
				   
				  totStruttura += totale_scontato;
				  
				  riepilogoStruttura += "Veletta<br>";
				  riepilogoStruttura += "Codice: <b>" + selezione.accessori.struttura.veletta.codice + "</b><br>"; 
				  riepilogoStruttura += "Descrizione: <b>" + selezione.accessori.struttura.veletta.descrizione + "</b><br>"; 
				  riepilogoStruttura += "ML: <b>" + ml.format(false,2) + "</b><br>";
				  riepilogoStruttura += "Quantità: <b>" + quantita_prodotto + "</b><br>";
				  
				  if(selezione.validita){
					  riepilogoStruttura += "Prezzo a ML: <b>" + costo.format(false,2) + " EUR</b><br>";
					  riepilogoStruttura += "Totale: <b>" + totale.format(false,2) + " EUR</b><br>";
				  }
				  
				  if(selezione.accessori.struttura.veletta.extra){
					  
					  var costo_extra = Number(selezione.accessori.struttura.veletta.extra.costo);
					  var totale_extra = costo_extra*quantita_prodotto*ml;
					  totStrutturaNonScontato += totale_extra;
					  
					  var totale_scontato_extra = totale_extra - (totale_extra*sconto)/100;
					
					  totStruttura += totale_scontato_extra;
					  
					  riepilogoStruttura += "<br><i>Extra lavorazione veletta</i><br>";
					  riepilogoStruttura += "Codice: <b>" + selezione.accessori.struttura.veletta.extra.codice + "</b><br>"; 
					  riepilogoStruttura += "Descrizione: <b>" + selezione.accessori.struttura.veletta.extra.descrizione + "</b><br>"; 
					  
					  if(selezione.accessori.struttura.veletta.extra.tipo_foratura){
						  riepilogoStruttura += "Tipo foratura: <b>" + selezione.accessori.struttura.veletta.extra.tipo_foratura+ "</b><br>"; 
					  }
					  
					  riepilogoStruttura += "ML: <b>" + ml.format(false,2) + "</b><br>";
					  riepilogoStruttura += "Quantità: <b>" + quantita_prodotto + "</b><br>";
					  
					  if(selezione.validita){
					  	riepilogoStruttura += "Prezzo a ML: <b>" + costo_extra.format(false,2) + " EUR</b><br>";
					  	riepilogoStruttura += "Totale: <b>" + totale_extra.format(false,2) + " EUR</b><br>";
					  }
					  
					   
				  }
				  
				  	
					
				}
				
				if(selezione.accessori.struttura.spallettaSX){
					siStruttura = true;
					
					var ml = Number(selezione.foroMuro.H)/1000;
						ml = Math.round(ml * 100) / 100;
					
					var costo = Number(selezione.accessori.struttura.spallettaSX.costo);
					var totale = costo*quantita_prodotto*ml;
					totStrutturaNonScontato += totale;
					var totale_scontato = totale - (totale*sconto)/100;
					
					totStruttura += totale_scontato;
					
					riepilogoStruttura += "<br><i>Spalletta sinistra</i><br>";
					riepilogoStruttura += "Codice: <b>" + selezione.accessori.struttura.spallettaSX.codice + "</b><br>"; 
					riepilogoStruttura += "ML: <b>" + ml.format(false,2) + "</b><br>";
					riepilogoStruttura += "Quantità: <b>" + quantita_prodotto + "</b><br>";
					if(selezione.validita){
						riepilogoStruttura += "Prezzo a ML: <b>" + costo.format(false,2) + " EUR</b><br>";
						riepilogoStruttura += "Totale: <b>" + totale.format(false,2) + " EUR</b><br>";
					}
					
				}
				
				if(selezione.accessori.struttura.spallettaDX){
					siStruttura = true;
					
					var ml = Number(selezione.foroMuro.H)/1000;
						ml = Math.round(ml * 100) / 100;
					
					var costo = Number(selezione.accessori.struttura.spallettaDX.costo);
					var totale = costo*quantita_prodotto*ml;
					totStrutturaNonScontato += totale;
					
					var totale_scontato = totale - (totale*sconto)/100;
					
					totStruttura += totale_scontato;

					riepilogoStruttura += "<br><i>Spalletta destra</i><br>";
					riepilogoStruttura += "Codice: <b>" + selezione.accessori.struttura.spallettaDX.codice + "</b><br>"; 
					riepilogoStruttura += "ML: <b>" + ml.format(false,2) + "</b><br>";
					riepilogoStruttura += "Quantità: <b>" + quantita_prodotto + "</b><br>";
					if(selezione.validita){
						riepilogoStruttura += "Prezzo a ML: <b>" + costo.format(false,2) + " EUR</b><br>";
						riepilogoStruttura += "Totale: <b>" + totale.format(false,2) + " EUR</b><br>";
					}
				}
				
				
				var totaleScontato = totStruttura;
				
				if(_this.validita && siStruttura){
					riepilogoStruttura += "<br>Totale: <b>"+Number(totStrutturaNonScontato).format(false,2)+" EUR</b><br>";
					riepilogoStruttura += "<div class='boxSconto'>Sconto: <input type='text' id='struttura' totale='"+totStruttura+"' style='width:50px;display:inline-block;' class='sconto form-control' value='"+sconto+"' maxlength='3'/>%<br></div>";
					riepilogoStruttura += "Totale scontato: <b><span id='scontoStrutturaTotale'>"+Number(totaleScontato).format(false,2)+"</span> EUR</b><br>";
					
					
					riepilogo += "<fieldset style='margin-bottom:15px'><legend style=\"font-size:14px;margin-bottom:10px;\"><b>STRUTTURA</b></legend>"+riepilogoStruttura+"</fieldset>";	
				}
				
				
			}
			
			
			if(selezione.accessori.sistemaRifinitura){
				
				var costo = Number(selezione.accessori.sistemaRifinitura.costo);
				
				riepilogo += "<fieldset style='margin-bottom:15px'><legend style=\"font-size:14px;margin-bottom:10px;\"><b>SISTEMI DI RIFINITURA</b></legend>";
				riepilogo += "Codice: <b>" + selezione.accessori.sistemaRifinitura.codice + "</b><br>"; 
				
				var num_coprifili = 0;
				
				if(selezione.validita) riepilogo += "Prezzo intero kit: <b>" + Number(costo*3).format(false,2) + " EUR</b><br>"; 
				
				////$.Log("Sistemi di rifinitura ok");
				
				var costoSistemaRifinitura = 0;
				if(selezione.accessori.sistemaRifinitura.up){
					riepilogo += "Rifinitura superiore: <b>"+selezione.accessori.sistemaRifinitura.up+"</b><br>";
					num_coprifili++;
				}
				if(selezione.accessori.sistemaRifinitura.sx){
					riepilogo += "Rifinitura lato sinistro: <b>"+selezione.accessori.sistemaRifinitura.sx+"</b><br>";
					num_coprifili++;
				}
				
				if(selezione.accessori.sistemaRifinitura.dx){
					riepilogo += "Rifinitura lato destro: <b>"+selezione.accessori.sistemaRifinitura.dx+"</b><br>";
					  num_coprifili++;	
				}
					
				var totale = costo*quantita_prodotto*num_coprifili;
				var sconto = Number(selezione.accessori.sistemaRifinitura.sconto);
				var totale_scontato = totale - (totale*sconto)/100;
				
				riepilogo += "Quantità: <b>" + quantita_prodotto*num_coprifili + "</b><br>";
				if(selezione.validita){
					riepilogo += "Totale: <b>" + totale.format(false,2) + " EUR</b><br>"; 
					riepilogo += "<div class='boxSconto'>Sconto: <input type='text' id='sistemaRifinitura' style='width:50px;display:inline-block;' class='sconto form-control' totale='"+totale+"' value='"+sconto+"' maxlength='3'/>%<br></div>";
					riepilogo += "Totale scontato: <b><span id='scontoSistemaRifinituraTotale'>"+totale_scontato.format(false,2)+"</span> EUR</b><br>";
				}
				riepilogo += "</fieldset>";
			
			}
			
			
			if(selezione.accessori.oblo){
				
				var costo = Number(selezione.accessori.oblo.costo);
				var sconto = Number(selezione.accessori.oblo.sconto);
				
				riepilogo += "<fieldset style='margin-bottom:15px'><legend style=\"font-size:14px;margin-bottom:10px;\"><b>OBLO'</b></legend>";
				riepilogo += "Codice: <b>" + selezione.accessori.oblo.codice + "</b><br>"; 
				if(selezione.validita)
					riepilogo += "Prezzo cadauno: <b>" + costo.format(false,2) + " EUR</b><br>"; 
				
				var q = 0;
				var cont = 0;
				jQuery.each(selezione.accessori.oblo.sezioni, function(i, item) {
					cont++;
					q += Number(item);
					if(Number(item) > 0)
						riepilogo += "Quantità di oblò nella sezione n. "+cont+": <b>" + item + " </b><br>";
				});
				
				var totale = costo*q*quantita_prodotto;
				var totale_scontato = totale - totale*sconto/100;
				
				
				if(selezione.validita){
					riepilogo += "Totale: <b>"+totale.format(false,2)+" EUR</b><br>";
					riepilogo += "<div class='boxSconto'>Sconto: <input type='text' id='oblo' totale='"+totale+"' style='width:50px;display:inline-block;' class='sconto form-control' value='"+sconto+"' maxlength='3'/>%<br></div>";
					riepilogo += "Totale scontato: <b><span id='scontoObloTotale'>"+totale_scontato.format(false,2)+"</span> EUR</b>";
				}
				riepilogo += "</fieldset>";
				
			}
			
			
			if(selezione.accessori.griglie){
				
				var costo = Number(selezione.accessori.griglie.costo);
				var sconto = Number(selezione.accessori.griglie.sconto);
				
				riepilogo += "<fieldset style='margin-bottom:15px'><legend style=\"font-size:14px;margin-bottom:10px;\"><b>GRIGLIE</b></legend>";
				riepilogo += "Codice: <b>" + selezione.accessori.griglie.codice + "</b><br>"; 
				
				if(selezione.validita)
					riepilogo += "Prezzo cadauno: <b>" + costo.format(false,2) + " EUR</b><br>"; 
				
				var q = 0;
				var cont = 0;
				jQuery.each(selezione.accessori.griglie.sezioni, function(i, item) {
					cont++;
					q += Number(item);
					if(Number(item) > 0)
						riepilogo += "Quantità di griglie nella sezione n. "+cont+": <b>" + item + " </b><br>";
				});
			
				var totale = costo*q*quantita_prodotto;
				var totale_scontato = totale - (totale*sconto)/100;

				
				if(selezione.validita){
					riepilogo += "Totale: <b>"+totale.format(false,2)+" EUR</b><br>";
					riepilogo +="<div class='boxSconto'>Sconto: <input type='text' id='griglie' totale='"+totale+"' style='width:50px;display:inline-block;' class='sconto form-control' value='"+sconto+"' maxlength='3'/>%<br></div>";
					riepilogo += "Totale scontato: <b><span id='scontoGriglieTotale'>"+Number(totale_scontato).format(false,2)+"</span> EUR</b><br>";
				}
				
				riepilogo += "</fieldset>";
				
			}
			
			
			if(selezione.accessori.molle){
				
				riepilogo += "<fieldset style='margin-bottom:15px'><legend style=\"font-size:14px;margin-bottom:10px;\"><b>MOLLE</b></legend>";
			
				var sconto = Number(selezione.accessori.molle.sconto);
				var totaleMolleScontato = 0;
				var totaleMolle = 0;
				for(var i = 0;i < selezione.accessori.molle.articoli.length;i++){
					
					var costo = Number(selezione.accessori.molle.articoli[i].costo);
					
					var totale = costo*quantita_prodotto;
					var totale_scontato = totale - (totale*sconto)/100;
					
					riepilogo += "Codice: <b>" + selezione.accessori.molle.articoli[i].codice + "</b><br>"; 
					riepilogo += "Quantità: <b>" + quantita_prodotto + "</b><br>";
					
					if(selezione.validita){
						riepilogo += "Prezzo: <b>" + costo.format(false,2) + " EUR</b><br>";
						riepilogo += "Totale: <b>" + totale.format(false,2) + "</b><br><br>";
					}
					
					totaleMolleScontato += totale_scontato;
					totaleMolle += totale;
				}
				
				if(selezione.validita){
					riepilogo += "Totale: <b>" + totaleMolle.format(false,2) + " EUR</b><br>";
					riepilogo += "<div class='boxSconto'>Sconto: <input type='text' id='molle' totale='"+totaleMolle+"' style='width:50px;display:inline-block;' class='sconto form-control' value='"+sconto+"' maxlength='3'/>%<br></div>";
					riepilogo += "Totale scontato: <b><span id='scontoMolleTotale'>"+totaleMolleScontato.format(false,2)+"</span> EUR</b>";
				}
			
				riepilogo += "</fieldset>";
				
			}
			  
			  
			if(selezione.accessori.sistemaChiusura){
				
				var costo = Number(selezione.accessori.sistemaChiusura.costo);
				var totale = costo*quantita_prodotto;
				var sconto = Number(selezione.accessori.sistemaChiusura.sconto);
				var totale_scontato = totale - (totale*sconto)/100;
				
				riepilogo += "<fieldset style='margin-bottom:15px'><legend style=\"font-size:14px;margin-bottom:10px;\"><b>>SISTEMI DI CHIUSURA</b></legend>";
				riepilogo += "Codice: <b>" + selezione.accessori.sistemaChiusura.codice + "</b><br>"; 
				riepilogo += "Quantità: <b>" + quantita_prodotto + "</b><br>";
				
				if(selezione.validita){
					riepilogo += "Prezzo: <b>" + costo.format(false,2) + " EUR</b><br>"; 
					riepilogo += "Totale: <b>"+totale.format(false,2)+" EUR</b><br>";
					riepilogo += "<div class='boxSconto'>Sconto: <input type='text' id='sistemaChiusura' totale='"+totale+"' style='width:50px;display:inline-block;' class='sconto form-control' value='"+sconto+"' maxlength='3'/>%<br></div>";
					riepilogo += "Totale scontato: <b><span id='scontoSistemaChiusuraTotale'>"+totale_scontato.format(false,2)+"</span> EUR</b><br>";
					
				}
				
				riepilogo += "</fieldset>";

			}
			
			
			
			if(selezione.accessori.passaggioPedonale){
				
				if(selezione.accessori.passaggioPedonale.porta_pedonale){
				
					var costo = Number(selezione.accessori.passaggioPedonale.porta_pedonale.costo);
					var totale = costo*quantita_prodotto;
					var sconto = Number(selezione.accessori.passaggioPedonale.porta_pedonale.sconto);
					var totale_scontato = totale - (totale*sconto)/100;
				
					
					riepilogo += "<fieldset style='margin-bottom:15px'><legend style=\"font-size:14px;margin-bottom:10px;\"><b>PASSAGGIO PEDONALE</b></legend>";
					riepilogo += "Codice: <b>" + selezione.accessori.passaggioPedonale.porta_pedonale.codice + "</b><br>"; 
					riepilogo += "Quantità: <b>" + quantita_prodotto + "</b><br>"; 
					
					if(selezione.validita)
						riepilogo += "Prezzo: <b>" + costo.format(false,2) + " EUR</b><br>";
					
					 
					riepilogo += "Posizione passaggio:<b>"+selezione.accessori.passaggioPedonale.porta_pedonale.posizione+"</b> <br>";
					
					if(selezione.accessori.passaggioPedonale.porta_pedonale.apertura == "sx")
						riepilogo += "Posizione apertura: <b>sinistra a spingere</b><br>";
					
					if(selezione.accessori.passaggioPedonale.porta_pedonale.apertura == "dx")
						riepilogo += "Posizione apertura: <b>destra a spingere</b><br>";
					
					if(selezione.validita){
						riepilogo += "Totale: <b>" + totale.format(false,2) + " EUR</b><br>";
						riepilogo += "<div class='boxSconto'>Sconto: <input type='text' id='porta_pedonale' style='width:50px;display:inline-block;' class='sconto form-control' totale='"+totale+"' value='"+sconto+"' maxlength='3'/>%<br></div>";	
						riepilogo += "Totale scontato: <b><span id='scontoPassaggioPedonaleTotale'>"+totale_scontato.format(false,2)+"</span> EUR</b><br>";
					}
					
					riepilogo += "</fieldset>";

				}
				
			
				if(selezione.accessori.passaggioPedonale.maniglione){
				
					var costo = Number(selezione.accessori.passaggioPedonale.maniglione.costo);
					var totale = costo*quantita_prodotto;
					var sconto = Number(selezione.accessori.passaggioPedonale.maniglione.sconto);
					var totale_scontato = totale - (totale*sconto)/100;

					
					riepilogo += "<fieldset style='margin-bottom:15px'><legend style=\"font-size:14px;margin-bottom:10px;\"><b>MANIGLIONE</b></legend>";
					riepilogo += "Codice: <b>" + selezione.accessori.passaggioPedonale.maniglione.codice + "</b><br>"; 
					riepilogo += "Quantità: <b>" + quantita_prodotto + "</b><br>"; 
					
					if(selezione.validita)
						riepilogo += "Prezzo: <b>" + costo.format(false,2) + " EUR</b><br>";
					
					
					if(selezione.validita){
						riepilogo += "Totale: <b>" + totale.format(false,2) + " EUR</b><br>";
						riepilogo += "<div class='boxSconto'>Sconto: <input type='text' id='maniglione' style='width:50px;display:inline-block;' class='sconto form-control' totale='"+totale+"' value='"+sconto+"' maxlength='3'/>%<br></div>";	
						riepilogo += "Totale scontato: <b><span id='scontoPassaggioPedonaleTotale'>"+totale_scontato.format(false,2)+"</span> EUR</b><br>";
					}
					
					riepilogo += "</fieldset>";

				}
				
				
			}
			  
			  
			 if(selezione.accessori.motorizzazione){
				
				var costo = Number(selezione.accessori.motorizzazione.costo);
				var totale = costo*quantita_prodotto;
				var sconto = Number(selezione.accessori.motorizzazione.sconto);
				var totale_scontato = totale - (totale*sconto)/100;

				
				riepilogo += "<fieldset style='margin-bottom:15px'><legend style=\"font-size:14px;margin-bottom:10px;\"><b>MOTORIZZAZIONE</b></legend>";
				riepilogo += "Codice: <b>" + selezione.accessori.motorizzazione.codice + "</b><br>"; 
				riepilogo += "Quantità: <b>" + quantita_prodotto + "</b><br>";
				
				if(selezione.validita){
					riepilogo += "Prezzo: <b>" + costo.format(false,2)+" EUR</b><br>";
					riepilogo += "Totale: <b>" + totale.format(false,2)+" EUR</b><br>";
				}
				
				////$.Log("Motorizzazione OK!");
				
				if(selezione.accessori.motorizzazione.optional.length > 0){
					
					riepilogo += "<br><i>Optional motorizzazione</i><br>";
					
					var totaleOptionalScontato = 0;
					var totaleOptional = 0;
					
					if(selezione.accessori.motorizzazione.optional.length>0){
						
						for(var i=0;i<selezione.accessori.motorizzazione.optional.length;i++){
							
							var costo1 = Number(selezione.accessori.motorizzazione.optional[i].costo);
							var sconto1 = Number(selezione.accessori.motorizzazione.sconto);
							var q_optional = Number(selezione.accessori.motorizzazione.optional[i].quantita)*quantita_prodotto;
							var totale1 = costo1*q_optional;
							
							var totale_scontato1 = totale1 - (totale1*sconto1)/100;
						
							totaleOptionalScontato += totale_scontato1;
							totaleOptional += totale1;

							
							riepilogo += "Codice"+(i+1)+": <b>" + selezione.accessori.motorizzazione.optional[i].codice+"</b><br>";
							riepilogo += "Quantità:  <b>" + q_optional+"</b><br>";
							
							if(selezione.validita){
								riepilogo += "Prezzo: <b>" + costo1.format(false,2)+" EUR</b><br>";
								riepilogo += "Totale: <b>" + totale1.format(false,2)+" EUR</b><br><br>";
							}else riepilogo += "<br>";
						}
						
						totale_scontato += totaleOptionalScontato;
						totale += totaleOptional;
						
					}
					
				}
				
				selezione.accessori.motorizzazione.costo_totale_con_optional = totale_scontato;
				
				if(selezione.validita){
					riepilogo += "Totale scontato: <b>"+totale.format(false,2)+" EUR</b><br>";
					riepilogo += "<div class='boxSconto'>Sconto: <input type='text' id='motorizzazione' style='width:50px;display:inline-block;' class='sconto form-control' totale='"+totale+"' value='"+sconto+"' maxlength='3'/>%<br></div>";
					riepilogo += "Totale scontato: <b><span id='scontoMotorizzazioneTotale'>"+totale_scontato.format(false,2)+"</span> EUR</b><br>";
				}
				
				riepilogo += "</fieldset>";
			}
			
		}
		
		riepilogo += "<fieldset style='margin-bottom:15px'><legend style=\"font-size:14px;margin-bottom:10px;\"><b>QUANTITA': #"+quantita_prodotto+"</b></legend></fieldset>";	
		
		return riepilogo;
	}
}