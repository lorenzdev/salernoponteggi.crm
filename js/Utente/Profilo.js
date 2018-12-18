var Profilo = function(content){

	var _this = this;
	_this.content = content;
	_this.elem;
	_this.user = {}
	var request = {
			"user":{},
			"account":{},
			"indirizzo":{}
	};

	_this.init = function(elem){

		_this.initStyle();

		_this.elem = elem;

		$.get("htmls/Profilo.html", function(datoHTML){


			_this.elem.html(datoHTML);

			function callBackUtente(datoUtente){

				$.Log("Dati dell'utente:");
				$.Log(datoUtente);

				$("#nome").val(datoUtente.results.nome);
				$("#cognome").val(datoUtente.results.cognome);
				$("#codice_fiscale").val(datoUtente.results.codice_fiscale);
				$("#partita_iva").val(datoUtente.results.partita_iva);
				$("#mansioni").val(datoUtente.results.mansioni);
				$("#cellulare").val(datoUtente.results.cellulare);
				$("#telefono").val(datoUtente.results.telefono);
				$("#partita_iva").val(datoUtente.results.partita_iva);
				$("#codice_fiscale").val(datoUtente.results.codice_fiscale);

				$("#sesso option").each(function(){
					if(jQuery(this).attr("value") == datoUtente.results.sesso){
						jQuery(this).prop("selected",true)
						return;
					}
				});

				_this.popolaRegioni(jQuery("#regione"));

				$("#regione option").each(function(){
					if(jQuery(this).val() == datoUtente.results.regione){
						jQuery(this).prop("selected",true);
						return;
					}
				});

				_this.popolaProvince(jQuery("#regione option:selected").val(),jQuery("#provincia"));
				jQuery("#provincia").removeAttr("disabled");
				jQuery("#provincia option").each(function(){
					if(jQuery(this).val() == datoUtente.results.provincia){
						jQuery(this).prop("selected",true);
						return;
					}
				});

				_this.initButtons();
				_this.content.loader.remove();

			}

			jQuery.postJSON("RegistrazioneUtente", "getUtenteByAccount","private", {"account":jQuery.getCookie("utente").email}, false, callBackUtente);

		});

	}

	_this.initButtons = function(){

		jQuery("#cap").off().on("keypress",function(e){
			return jQuery.onlynumbers(e);
		});

		jQuery("#telefono").off().on("keypress",function(e){
			return jQuery.onlynumbers(e);
		});

		jQuery("#cellulare").off().on("keypress",function(e){
			return jQuery.onlynumbers(e);
		});

		jQuery("#fax").off().on("keypress",function(e){
			return jQuery.onlynumbers(e);
		});


		jQuery("#regione").off().on("change",function(){
			var regione = jQuery(this).val();
			jQuery("#provincia").html("<option value=\"\">Seleziona la provincia</option>");
			jQuery("#provincia").removeAttr("disabled");
			jQuery("#comune").html("<option value=\"\">Seleziona il comune</option>");
			jQuery("#comune").addClass("selectDisabled");
			jQuery("#comune").attr("disabled","disabled");
			_this.popolaProvince(regione,jQuery("#provincia"));
		});

		jQuery("#provincia").off().on("change",function(){
			var provincia = jQuery(this).val();
			jQuery("#comune").removeClass("selectDisabled");
			jQuery("#comune").removeAttr("disabled");
			jQuery("#comune").html("<option value=\"\">Seleziona il comune</option>");
			_this.popolaComuni(provincia,jQuery("#comune"));
		});

		jQuery("#modifica_utente").off().on("click",function(){
			_this.content.loader.init(function(){ _this.modificaUtente();});
		});

		$("input, select").on("click", function(){
			$(this).css({borderColor: "#ccc"});
			$("#errori_compilazione_agente").html("");
			$("#errori_compilazione_cliente").html("");
		});

		$("input, select").on('keydown', function(e) {
			if (e.which == 9) {
				$(this).css({borderColor: "#ccc"});
				$("#errori_compilazione_agente").html("");
				$("#errori_compilazione_cliente").html("");
			}
		});

	}


	_this.popolaNazioni = function(elemSelect){

		function callBackNazioni(dato){
			//$.Log("Nazioni:");
			//$.Log(dato);
			//jQuery("#regione").html("<option ");
			for(var i = 0;i < dato.length;i++){
				var selected = "";
				//$.Log(dato[i].id +  " == IT");
				if(dato[i].id == "IT")
					selected = "selected";
				var tmp = "<option value='"+dato[i].id+"' "+selected+">"+dato[i].nome+"</option>";
				elemSelect.append(tmp);
			}
		}

		jQuery.postJSON("RegistrazioneUtente", "getNazioni","public", {}, false, callBackNazioni);
	}

	_this.popolaRegioni = function(elemSelect){

		function callBackRegione(dato){

			//$.Log(dato);
			//jQuery("#regione").html("<option ");
			for(var i = 0;i < dato.length;i++){
				var tmp = "<option value='"+dato[i].id+"'>"+dato[i].nome+"</option>";
				elemSelect.append(tmp);
			}
		}

		jQuery.postJSON("RegistrazioneUtente", "getRegioni","public", {}, false, callBackRegione);

	}

	_this.popolaProvince = function(id_regione, elemSelect){

		function callBackProvince(dato){
			//$.Log(dato);
			//jQuery("#provincia").html("");
			for(var i = 0;i < dato.length;i++){
				var tmp = "<option value='"+dato[i].id+"'>"+dato[i].nome+"</option>";
				elemSelect.append(tmp);
			}
		}

		jQuery.postJSON("RegistrazioneUtente", "getProvince","public", {"regione":id_regione}, false, callBackProvince);
	}

	_this.popolaComuni = function(id_provincia,elemSelect){

		function callBackComuni(dato){
			//$.Log(dato);
			//jQuery("#comune").html("");
			for(var i = 0;i < dato.length;i++){
				var tmp = "<option value='"+dato[i].id+"'>"+dato[i].nome+"</option>";
				elemSelect.append(tmp);
			}
		}

		jQuery.postJSON("RegistrazioneUtente", "getComuni","public", {"provincia":id_provincia}, false, callBackComuni);
	}



	_this.modificaUtente = function(){

		 var utente = {};
		 utente.nome = jQuery("#nome").val();
		 utente.cognome = jQuery("#cognome").val();
		 utente.sesso = jQuery("#sesso option:selected").val();
		 utente.codice_fiscale = jQuery("#codice_fiscale").val();
		 utente.partita_iva = jQuery("#partita_iva").val();
		 utente.telefono = jQuery("#telefono").val();
		 utente.cellulare = jQuery("#cellulare").val();
		 utente.password = jQuery("#password").val();
		 utente.conferma_password = jQuery("#conferma_password").val();
		 utente.mansioni = jQuery("#mansioni").val();
		 utente.regione = jQuery("#regione option:selected").val();
		 utente.provincia = jQuery("#provincia option:selected").val();




		var bool = _this.verificaDatiUtente(utente);

		if(!bool){
			_this.content.loader.remove();
			return;
		}


		function callBackAccount(datoAccount){
			$.Log("Utente Registrato?");
			$.Log(datoAccount);

			if(!datoAccount.success){
				alert(datoAccount.errorMessage);
				return;
			}

			$("#ERROR_LOG").html("<br><div class='alert alert-success' data-dismiss=\"alert\" aria-hidden=\"true\"><button type=\"button\" class=\"close close_my_alert\" data-dismiss=\"alert\" aria-hidden=\"true\">x</button><i class=\"fa fa-check-circle\" aria-hidden=\"true\"></i> Profilo modificato correttamente</div>");
		}

		jQuery.postJSON("RegistrazioneUtente","modifyAccount","private", {"utente": utente, "account":$.getCookie("utente").email}, false, callBackAccount);

		_this.content.loader.remove();

	}



	_this.verificaDatiUtente = function(utente){

		var response = {
				result: true,
				message: ""
		}

		if(!utente.nome){
			response.result = false;
			response.message += '<div class="alert alert-danger" role="alert"><button type="button" class="close close_my_alert" data-dismiss="alert" aria-hidden="true">×</button> <i class="fa fa-warning"></i> Non hai inserito il nome</div>';
            $("#nome").css({borderColor: "#F00"});
		}

		if(!utente.cognome){
			response.result = false;
            response.message += '<div class="alert alert-danger" role="alert"><button type="button" class="close close_my_alert" data-dismiss="alert" aria-hidden="true">×</button> <i class="fa fa-warning"></i> Non hai inserito il cognome</div>';
			$("#cognome").css({borderColor: "#F00"});
		}

		if(utente.codice_fiscale){
			var tmp = $.checkCodiceFiscale(utente.codice_fiscale);
			if(!tmp.result){
				response.result = false;
                response.message += '<div class="alert alert-danger" role="alert"><button type="button" class="close close_my_alert" data-dismiss="alert" aria-hidden="true">×</button> <i class="fa fa-warning"></i>'+tmp.message;+' </div>';
				$("#codice_fiscale").css({borderColor: "#F00"});
			}
		}

		if(utente.partita_iva){
			var tmp = jQuery.checkPartitaIva(utente.partita_iva);
			if(!tmp.result){
				response.result = false;
				response.message += '<div class="alert alert-danger" role="alert"><button type="button" class="close close_my_alert" data-dismiss="alert" aria-hidden="true">×</button> <i class="fa fa-warning"></i>'+tmp.message;+' </div>';
				$("#partita_iva").css({borderColor: "#F00"});
			}
		}


		if(utente.password){

			if(utente.password.length < 8){
				response.result = false;
				response.message += '<div class="alert alert-danger" role="alert"><button type="button" class="close close_my_alert" data-dismiss="alert" aria-hidden="true">×</button> <i class="fa fa-warning"></i>La password deve essere almeno di 8 caratteri</div>';
				$("#password").css({borderColor: "#F00"});
			}

			if(utente.password != utente.conferma_password){
				response.result = false;
				response.message += '<div class="alert alert-danger" role="alert"><button type="button" class="close close_my_alert" data-dismiss="alert" aria-hidden="true">×</button> <i class="fa fa-warning"></i>La password e la conferma della password non coincidono</div>';
                $("#conferma_password").css({borderColor: "#F00"});
			}
		}


		if(response.result == 0){
			$("#ERROR_LOG").html("<br>"+response.message);
			return;
		}

		return response.result;

	}

	_this.initStyle = function() {
		//Nascondo la navbar
		$('.navbar-collapse').collapse('hide');
		//Coloro il li del menu
		$("#menu_prodotti").css("background-color", "#016eb6");
	}

}
