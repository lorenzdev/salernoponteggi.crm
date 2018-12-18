var CostiExtra = function(mainPreventivi){

	var _this = this;
	_this.content = mainPreventivi;
	_this.obj;
	_this.elem;

	_this.totale_costi_trasporto = 0;
	_this.totale_costi_montaggio = 0;

	_this.numero_settimana = "";
	_this.data_consegna = "";

	_this.macroFamiglie = {
		"Ascensore":0
	}


	_this.init = function(obj){

		_this.obj = obj;

		$.Log("OBJ");
		$.Log(obj);

		_this.macroFamiglie[obj.articolo.tipologia]+= Number(obj.quantita);
		$.Log(_this.macroFamiglie);

	}

	_this.calcolaCostiExtra = function(preventivo){



		  var dettaglio = "";

		  dettaglio += "<h4 class='title_h4'>Dettagli extra</h4>";

		  dettaglio += "<div style='padding:10px;'>";
		  dettaglio += "<b>IVA: </b>";
		  dettaglio += "<input type='text' id='iva' class='form-control' value='"+preventivo.iva+"' maxlength='2' style='width:50px;'>";
		  dettaglio += "</div>";

		  dettaglio += "<div style='padding:10px;'>";
		  dettaglio += "<b>ULTERIORE SCONTO: </b>";
		  dettaglio += "<input type='text' id='sconto' class='form-control' value='"+preventivo.sconto+"' maxlength='2' style='width:50px;'>";
		  dettaglio += "</div>";

		  var bool_trasporto = false;
		  var bool_distribuzione = true;
		  var bool_posa = false;

		  dettaglio += "<div style='padding:10px;'>";
		  dettaglio += "<fieldset><legend style=\"font-size:14px;\"><b>COSTI DI TRASPORTO</b></legend></fieldset>";
          dettaglio += '<div class="checkbox checkbox-primary" style="margin:20px 0px 20px 0px;">\
									<input id="checkCostiTrasporto" type="checkbox">\
									<label for="checkCostiTrasporto">\
										A carico del cliente\
									</label>\
								</div>';

		  dettaglio += "<div id='boxCostiTrasporto' style='padding:10px;'>";

		  $.Log("GUARDA QUA");
		  $.Log(preventivo);


		  var array_check_trasporto = [];
		  if(preventivo.costo_trasporto){
			  for(var i = 0;i < preventivo.costo_trasporto.length;i++){
				array_check_trasporto.push(preventivo.costo_trasporto[i].nome);
			  }
		  }

		 
		  var array_check_montaggio = [];
		  if(preventivo.costo_montaggio){
			  for(var i = 0;i < preventivo.costo_montaggio.length;i++){
				array_check_montaggio.push(preventivo.costo_montaggio[i].nome);
			  }
		  }
		

		  if(_this.macroFamiglie["Ascensore"]> 0){

			  var value = 0;
			  var index = $.inArray("Ascensore",array_check_trasporto);
			  if(index >= 0)
					value = preventivo.costo_trasporto[index].prezzo;

			  dettaglio += "<b>ASCENSORI</b><br>";
			  dettaglio += "Costo aggiuntivo:  EUR ";
			  dettaglio += "<input type='text' style='width:180px;display:inline-block;' famiglia='Ascensore' class='costi_trasporto form-control' quantita='"+ _this.macroFamiglie["Ascensore"]+"' value='"+value+"'/> x ";
			  dettaglio += _this.macroFamiglie["Ascensore"]+"<br><br>";
		  }

		 
		  dettaglio += "</div>";
		  dettaglio += "</div>";

		  dettaglio += "<div style='padding:10px;'>";
		  dettaglio += "<fieldset><legend style=\"font-size:14px;\"><b>COSTI DI MONTAGGIO</b></legend></fieldset>";
          dettaglio += '<div class="checkbox checkbox-primary" style="margin:20px 0px 20px 0px;">\
									<input id="checkCostiDistribuzione" type="checkbox" value="si">\
									<label for="checkCostiDistribuzione">\
										A carico del cliente\
									</label>\
								</div>';

		  dettaglio += "<div id='boxCostiDistribuzione' style='padding:10px;'>";

		  if(_this.macroFamiglie["Ascensore"]> 0){

			  var value = 0;
			  var index = $.inArray("Ascensore",array_check_montaggio);
			  if(index >= 0)
					value = preventivo.costo_montaggio[index].prezzo;

			  dettaglio += "<b>ASCENSORI</b><br>";
			  dettaglio += "Costo aggiuntivo:  EUR ";
			  dettaglio += "<input type='text' style='width:180px;display:inline-block;' famiglia='Ascensore' class='costi_montaggio form-control' quantita='"+ _this.macroFamiglie["Ascensore"]+"' value='"+value+"'/> x ";
			  dettaglio += _this.macroFamiglie["Ascensore"]+"<br><br>";
		  }

		  
		  dettaglio += "</div>";
		  dettaglio += "</div>";

		  
		  dettaglio += "<div style='padding:10px;display:block;'>";
		  dettaglio += "<b>CONSEGNA</b><br>";
		  dettaglio += "<div style='display:inline-block;width:90px;margin-top: 3px;'>Settimana n.</div>";
		  dettaglio += "<input type='text' id='numero_settimana' maxlength='2' style='width:50px;display:inline-block;' class=' form-control'/>&nbsp;&nbsp;&nbsp;";

		  var year1 = new Date().getFullYear();
		  	  year2 = year1+1;
			  year3 = year2+1;


		  dettaglio += "<select id='anno_settimana' class='form-control' style='display:inline-block;width:100px;'>";

		  var checked1 = "";
		  var checked2 = "";
		  var checked3 = "";
		  if(year1 == Number(preventivo.anno_settimana)){checked1 = " selected";}
		  if(year2 == Number(preventivo.anno_settimana)){checked2 = " selected";}
		  if(year3 == Number(preventivo.anno_settimana)){checked3 = " selected";}

		  if(!checked1 && !checked2 && !checked3 && preventivo.anno_settimana){
		  	dettaglio += "<option value='"+preventivo.anno_settimana+"' selected>"+preventivo.anno_settimana+"</option>";
		  }

		  dettaglio += "<option value='"+year1+"' "+checked1+">"+year1+"</option>";
		  dettaglio += "<option value='"+year2+"' "+checked2+">"+year2+"</option>";
		  dettaglio += "<option value='"+year3+"' "+checked3+">"+year3+"</option>";
		  dettaglio += "</select>";
		  dettaglio += "</div><br>";


		  dettaglio += "<div style='padding:10px;display:block;'>";
		  dettaglio += "<b>VETTORE</b><br>";
		  dettaglio += "<input type='text' id='vettore' style='width:150px;display:inline-block;' class='form-control' value='"+preventivo.vettore+"'/>";
			dettaglio += "</div><br>";

		   dettaglio += "<div style='padding:10px;display:block;'>";
		  dettaglio += "<b>DESCRIZIONE</b><br>";
		  dettaglio += "<textarea id='nota' style='width:320px;height:160px;display:inline-block;resize:vertical;' class='form-control'>"+preventivo.nota+"</textarea>";
			dettaglio += "</div><br><br>";
		 /*
		  dettaglio += "<div style='float:left;width:27px;text-align:right;padding-right:10px;margin-top: 3px;'>dal</div><div style='float:left;'>";
		  dettaglio += "<input type='text' id='data_consegna' style='width: 100px;' readonly/></div>";
		  dettaglio += "</div><br><br>";
		  */

		  dettaglio += "<center><button type='button' data-loading=\"<i class='fa fa-spinner fa-spin' aria-hidden='true'></i>\" id=\"salva_opzioni\" class=\"action btn btn-primary\">Salva dettagli extra</button></center><br>";


		  dettaglio += "<div class='line2'></div>";


		  dettaglio += "<h4 class='title_h4'>Inserisci dati del cantiere</h4>";

		  <!-- referente -->
		  dettaglio += "<div style='clear:both;'>";
		  dettaglio += "<div style='float:left;width:90px;text-align:right;padding-right:10px;margin-top: 3px;'>Referente:</div><div style='float:left;'>";
		  dettaglio += "<input type='text' id='referente' class='cantiere form-control'/></div>";
		  dettaglio += "</div><br><br>";

		   <!-- referente -->
		  dettaglio += "<div style='clear:both;'>";
		  dettaglio += "<div style='float:left;width:90px;text-align:right;padding-right:10px;margin-top: 3px;'>Cell.:</div><div style='float:left;'>";
		  dettaglio += "<input type='text' id='cellulare_referente'  class='cantiere form-control'/></div>";
		  dettaglio += "</div><br><br>";

		   <!-- referente -->
		  dettaglio += "<div style='clear:both;'>";
		  dettaglio += "<div style='float:left;width:90px;text-align:right;padding-right:10px;margin-top: 3px;'>E-mail:</div><div style='float:left;'>";
		  dettaglio += "<input type='text' id='email_referente'  class='cantiere form-control'/></div>";
		  dettaglio += "</div><br><br>";

		  <!-- indirizzo -->
		  dettaglio += "<div style='clear:both;'>";
		  dettaglio += "<div style='float:left;width:90px;text-align:right;padding-right:10px;margin-top: 3px;'>Indirizzo:</div><div style='float:left;'>";
		  dettaglio += "<input type='text' id='indirizzo'  class='cantiere form-control'/></div>";
		  dettaglio += "</div><br><br>";

		  <!-- civico -->
		  dettaglio += "<div style='clear:both;'>";
		  dettaglio += "<div style='float:left;width:90px;text-align:right;padding-right:10px;margin-top: 3px;'>Civico:</div><div style='float:left;'>";
		  dettaglio += "<input type='text' id='civico' class='cantiere form-control' style='width: 55px;'/></div>";
		  dettaglio += "</div><br><br>";


		  <!-- cap -->
		  dettaglio += "<div style='clear:both;'>";
		  dettaglio += "<div style='float:left;width:90px;text-align:right;padding-right:10px;margin-top: 3px;'>Cap:</div><div style='float:left;'>";
		  dettaglio += "<input type='text' id='cap' class='cantiere form-control' style='width: 55px;' maxlength='5'/></div>";
		  dettaglio += "</div><br><br>";

		  <!-- Regione -->
		  dettaglio += "<div style='clear:both;'>";
		  dettaglio += "<div style='float:left;width:90px;text-align:right;padding-right:10px;margin-top: 3px;'>Regione: </div><div style='float:left;'>";
		  dettaglio += "<select id='regione' class='regione cantiere form-control'>";
		  dettaglio += "<option value=''>Seleziona la regione</option>";
		  dettaglio += "</select></div>";
		  dettaglio += "</div><br><br>";

		  <!-- Provincia -->
		  dettaglio += "<div style='clear:both;'>";
		  dettaglio += "<div style='float:left;width:90px;text-align:right;padding-right:10px;margin-top: 3px;'>Provincia: </div><div style='float:left;'>";
		  dettaglio += "<select id='provincia' class='provincia cantiere form-control' disabled>";
		  dettaglio += "<option value=''>Seleziona la provincia</option>";
		  dettaglio += "</select></div>";
		  dettaglio += "</div><br><br>";

		  <!-- Comune-->
		  dettaglio += "<div style='clear:both;'>";
		  dettaglio += "<div style='float:left;width:90px;text-align:right;padding-right:10px;margin-top: 3px;'>Comune: </div><div style='float:left;'>";
		  dettaglio += "<select id='comune' disabled class='comune cantiere form-control'>";
		  dettaglio += "<option value=''>Seleziona il comune</option>";
		  dettaglio += "</select></div>";
		  dettaglio += "</div><br><br>";

		  <!-- Comune-->
		  dettaglio += "<div style='clear:both;'>";
		  dettaglio += "<div style='float:left;width:90px;text-align:right;padding-right:10px;margin-top: 3px;'>Fraz.: </div>";
		  dettaglio += "<div style='float:left;'>";
		  dettaglio += "<div style='float:left;'>";
		  dettaglio += "<input type='text' id='citta' class='cantiere form-control'/>";
		  dettaglio += "</div>";
		  dettaglio += "</div><br>";
		  dettaglio += "</div><br><br>";

		  dettaglio += "<center><button data-loading=\"<i class='fa fa-spinner fa-spin' aria-hidden='true'></i>\" id='salva_cantiere_preventivo' class='action btn btn-primary'>Salva cantiere</button></center><br>";
		  dettaglio += "<div class='line2'></div>";
		  dettaglio += "</div>";

		  dettaglio += "<h4 class='title_h4'>Seleziona un cliente</h4>";

		  dettaglio += "<div id='contentEmail'>";

		  <!-- cliente -->
		  dettaglio += "<div style='clear:both;'>";
		  dettaglio += "<div style='float:left;width:60px;text-align:right;margin-top: 3px;'>Cliente:</div>";
		  dettaglio += "<div style='float:left;'>";
		  dettaglio += "<select id='select_rubrica' class='form-control' style='width:260px;'>";
		  dettaglio += 	"<option value=''>Seleziona un cliente</option>";
		  dettaglio += "</select><br>";
		  dettaglio += "</div>";
		  dettaglio += "</div><br>";

		 /*
		  dettaglio += "<div style='clear:both;'>";
		  dettaglio += "<div style='float:left;width:90px;text-align:right;padding-right:10px;margin-top: 3px;'></div>";
		  dettaglio += "<div style='float:left;'>";
		  dettaglio += "<input type='checkbox' id='invio_solo_agente_capo_area'> Invia solo all'agente o al capo area";
		  dettaglio += "</div>";
		  */

		  dettaglio += "</div><br><br>";

		  dettaglio += "<center><button data-loading=\"<i class='fa fa-spinner fa-spin' aria-hidden='true'></i>\"  class='action btn btn-primary' id='salva_cliente_preventivo'>Salva cliente</button>&nbsp;&nbsp;<button id='aggiungi_rubrica' class='btn btn-primary'>Aggiungi un cliente</button></center><br>";
		  dettaglio += "<div class='line2'></div>";

		  dettaglio += "</div>";

		  /*
		  dettaglio += "<fieldset style='border:1px solid #ccc !important;'>";
		  dettaglio += "<legend>Allega 5 immagini al preventivo</legend><br><br>";

		  dettaglio += "<div id='contentEmail'>";

		  <!-- cliente -->
		  dettaglio += "<div style='clear:both;'>";
		  dettaglio += "<div style='float:left;width:100%;'>";
		  dettaglio += "<form id=\"file_upload_form\" method=\"post\" target=\"upload_target\" enctype=\"multipart/form-data\" action=\"php/gestioneImmagini/upload.php\">";


		  var idImmagini = "";

		  dettaglio += "<input name=\"codice_carrello\" id=\"codice_carrello\" value='"+idImmagini+"' type=\"hidden\" /><br />";

		  dettaglio += "<img src='immagini_carrello/"+idImmagini+"/"+idImmagini+"_1.jpg' width=\"100\" id=\"immagine1\"/><input type=\"button\" id=\"cancella_immagine\" path=\"immagini_carrello/"+idImmagini+"/\" nomefile=\""+idImmagini+"_1.jpg\" immagine=\"immagine1\" class=\"cancella_immagine\" value=\"rimuovi\"/>";
		  dettaglio += "<input name=\"file1\" id=\"file1\" size=\"27\" type=\"file\" value=\"scegli una immagine\"/><br><br>";

		  dettaglio += "<img src='immagini_carrello/"+idImmagini+"/"+idImmagini+"_2.jpg' width=\"100\" id=\"immagine2\"/><input type=\"button\" id=\"cancella_immagine\" path=\"immagini_carrello/"+idImmagini+"/\" nomefile=\""+idImmagini+"_2.jpg\" immagine=\"immagine2\" class=\"cancella_immagine\" value=\"rimuovi\"/>";

		  dettaglio += "<input name=\"file2\" id=\"file2\" size=\"27\" type=\"file\" value=\"scegli una immagine\"/><br><br>";

		  dettaglio += "<img src='immagini_carrello/"+idImmagini+"/"+idImmagini+"_3.jpg' width=\"100\" id=\"immagine3\"/><input type=\"button\" id=\"cancella_immagine\" path=\"immagini_carrello/"+idImmagini+"/\" nomefile=\""+idImmagini+"_3.jpg\" immagine=\"immagine3\" class=\"cancella_immagine\" value=\"rimuovi\"/>";


		  dettaglio += "<input name=\"file3\" id=\"file3\" size=\"27\" type=\"file\" value=\"scegli una immagine\"/><br><br>";

		  dettaglio += "<img src='immagini_carrello/"+idImmagini+"/"+idImmagini+"_4.jpg' width=\"100\" id=\"immagine4\"/><input type=\"button\" id=\"cancella_immagine\" path=\"immagini_carrello/"+idImmagini+"/\" nomefile=\""+idImmagini+"_4.jpg\" immagine=\"immagine4\" class=\"cancella_immagine\" value=\"rimuovi\"/>";


		  dettaglio += "<input name=\"file4\" id=\"file4\" size=\"27\" type=\"file\" value=\"scegli una immagine\"/><br><br>";

		  dettaglio += "<img src='immagini_carrello/"+idImmagini+"/"+idImmagini+"_5.jpg' width=\"100\" id=\"immagine5\"/><input type=\"button\" id=\"cancella_immagine\" path=\"immagini_carrello/"+idImmagini+"/\" nomefile=\""+idImmagini+"_5.jpg\" immagine=\"immagine5\" class=\"cancella_immagine\" value=\"rimuovi\"/>";

		  dettaglio += "<input name=\"file5\" id=\"file5\" size=\"27\" type=\"file\" value=\"scegli una immagine\"/><br><br>";

		  dettaglio += "</form><br>";
		  dettaglio += "<center><button id='uploadImages'>Salva immagini</center><br>";
		  dettaglio += "</fieldset><br>";
		  */

		  return dettaglio;
	}

	_this.getCostiAggiuntivi = function(){

		var trasporto = [];
		var montaggio = [];

		_this.totale_costi_trasporto = 0;
		_this.totale_costi_montaggio = 0;

		var costiTrasporto = 0;
		if(!jQuery("#checkCostiTrasporto").is(":checked")){
			jQuery(".costi_trasporto").each(function(){

				if(parseFloat(jQuery(this).val()) > 0){

					var prezzo = parseFloat(jQuery(this).val());
					var quantita = parseInt(jQuery(this).attr("quantita"));

					var obj = {
						"codice": "TRASP",
						"prezzo": prezzo,
						"nome": jQuery(this).attr("famiglia"),
						"quantita": quantita
					}
					trasporto.push(obj);

					_this.totale_costi_trasporto += (prezzo*quantita);

				}
			});
		}
		
		var costiMontaggio = 0;
		if(!jQuery("#checkCostiMontaggio").is(":checked")){
			jQuery(".costi_montaggio").each(function(){

				if(parseFloat(jQuery(this).val()) > 0){

					var prezzo = parseFloat(jQuery(this).val());
					var quantita = parseInt(jQuery(this).attr("quantita"));

					var obj = {
						"codice": "MONTA",
						"prezzo": prezzo,
						"nome": jQuery(this).attr("famiglia"),
						"quantita": quantita
					}
					montaggio.push(obj);

					_this.totale_costi_montaggio += (prezzo*quantita);
				}
			});
		}



		var servizi = {};

		servizi.trasporto = trasporto;
		servizi.montaggio = montaggio;
		servizi.totaleCostiTrasporto = _this.totale_costi_trasporto;
		servizi.totaleCostiMontaggio = _this.totale_costi_montaggio;
		servizi.numero_settimana = $("#numero_settimana").val();
		servizi.anno_settimana = _this.anno_settimana;
		servizi.data_consegna = _this.data_consegna;
		servizi.nota = $("#nota").val();
		servizi.vettore = $("#vettore").val();


		return servizi;

	}

}
