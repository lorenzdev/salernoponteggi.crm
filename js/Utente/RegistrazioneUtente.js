var RegistrazioneUtente = function(content){

	var _this = this;
	
	_this.content = content;	
	_this.elem;
	_this.loader;
	
	_this.init = function (elem){
		
		_this.elem = elem;
		_this.loader = new Loader();
		
		_this.popolaRegioni();
		_this.initButtons();
		
	}
	
	_this.initButtons = function(){
		
		$("#sconto_richiesto, #aliquota_iva_richiesta, #cellulare, #fax, #telefono, #cellulare_agente, #telefono_agente").on("keypress", function(e){
			return jQuery.onlynumbers(e);
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
		
		
		$("#check_agente").off().on("click",function(){
			if($(this).is(":checked")){
				$(".agente").prop("disabled", false);
				$("#content_agente").css({display:"block"});
				
				if($("#check_cliente").is(":checked")){
					$("#check_cliente").trigger("click");	
				}
			}else{
				$(".agente").prop("disabled", true);
				$("#content_agente").css({display:"none"});
			}
		});
		
		
		$("#check_cliente").off().on("click",function(){
            
			if($(this).is(":checked")){
				$(".cliente").prop("disabled", false);
				$("#content_cliente").css({display:"block"});
				
				if($("#check_agente").is(":checked")){
					$("#check_agente").trigger("click");	
				}
				
			}else{
				$(".cliente").prop("disabled", true);
				$("#content_cliente").css({display:"none"});
			}
		});
		
		
		jQuery("#regione").off().on("change",function(){
			var regione = jQuery(this).val();
			jQuery("#provincia").html("<option value=\"null\">Seleziona la provincia</option>");
			jQuery("#provincia").removeAttr("disabled");
			
			jQuery("#comune").html("<option value=\"null\">Seleziona il comune</option>");
			jQuery("#comune").addClass("selectDisabled");
			jQuery("#comune").attr("disabled","disabled");
			_this.popolaProvince(regione);	
		});
			
		jQuery("#provincia").off().on("change",function(){
				var provincia = jQuery(this).val();
				jQuery("#comune").removeClass("selectDisabled");
				jQuery("#comune").removeAttr("disabled");
				jQuery("#comune").html("<option value=\"null\">Seleziona il comune</option>");
				_this.popolaComuni(provincia);
		});
			
			
		jQuery("#regione_agente").off().on("change",function(){
				var regione = jQuery(this).val();
				jQuery("#provincia_agente").html("<option value=\"null\">Seleziona la provincia</option>");
				jQuery("#provincia_agente").removeAttr("disabled");
				_this.popolaProvince(regione, "#provincia_agente");
		});
			
		jQuery("#cap").off().on("keypress",function(e){
			return jQuery.onlynumbers(e);
		});
			
		jQuery("#telefono").off().on("keypress",function(e){
			return jQuery.onlynumbers(e);
		});
			
		$("#salva_utente").off().on("click", function(){
			
			$(".loading").html("<i class=\"fa fa-spinner fa-spin\"></i>");
			$("#salva_utente").addClass("disabled");
			
			setTimeout(function(){
				_this.salvaUtente();
			}, 20);
		});
			
			
	}
	
	_this.popolaNazioni = function(){
		
		function callBackNazioni(dato){
			//$.Log("Nazioni:");
			//$.Log(dato);
			//jQuery("#regione").html("<option ");
			var tmp = "<option value=\"null\">Seleziona la nazione</option>";
			for(var i = 0;i < dato.length;i++){
				var selected = "";
				//$.Log(dato[i].id +  " == IT");
				if(dato[i].id == "IT")
					selected = "selected";
				tmp += "<option value='"+dato[i].id+"' "+selected+">"+dato[i].nome+"</option>";
				
			}
			
			jQuery(".nazione").html(tmp);
			
		}
		
		jQuery.postJSON("RegistrazioneUtente", "getNazioni","public", {}, true, callBackNazioni);
			
	}
	
	_this.popolaRegioni = function(){
		
		
		function callBackRegione(dato){
			
			$.Log(dato);
			//jQuery("#regione").html("<option ");
			
			var tmp = "<option value=\"\">Seleziona la regione</option>";
			for(var i = 0;i < dato.length;i++){	
				tmp += "<option value='"+dato[i].id+"'>"+dato[i].nome+"</option>";
			}
			
			jQuery(".regione").html(tmp);
		}
		
		jQuery.postJSON("RegistrazioneUtente", "getRegioni","public", {}, true, callBackRegione);
			
	}
	
	_this.popolaProvince = function(id_regione, elem){
		
		var id_elem = ".provincia";
		if(elem){
			id_elem = elem;
		}
		
		
		function callBackProvince(dato){
			//$.Log(dato);
			//jQuery("#provincia").html("");
			var tmp = "<option value=\"null\">Seleziona la provincia</option>";
			for(var i = 0;i < dato.length;i++){
				tmp += "<option value='"+dato[i].id+"'>"+dato[i].nome+"</option>";
				
			}
			jQuery(id_elem).html(tmp);
		}
		
		jQuery.postJSON("RegistrazioneUtente", "getProvince","public", {"regione":id_regione}, true, callBackProvince);
	}
	
	_this.popolaComuni = function(id_provincia){
		
		function callBackComuni(dato){
			//$.Log(dato);
			//jQuery("#comune").html("");
			var tmp = "<option value=\"null\">Seleziona il comune</option>";
			for(var i = 0;i < dato.length;i++){
				tmp += "<option value='"+dato[i].id+"'>"+dato[i].nome+"</option>";
			}
			jQuery(".comune").html(tmp);
		}
		
		jQuery.postJSON("RegistrazioneUtente", "getComuni","public", {"provincia":id_provincia}, true, callBackComuni);
	}
	
	
	_this.verificaDatiAccount = function(account){
		
		var response = {
				result: true,
				message: ""
		}
		
		if(!account.username){
			response.result = false;
			response.message += "<i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i>  Non hai inserito l'email<br>";
			$("#username").css({borderColor: "#F00"});		
		}
				
		if(account.username){
			var tmp = $.checkEmail(account.username);
			
			if(!tmp.result){
				response.result = false;
				response.message += tmp.message;
				$("#username").css({borderColor: "#F00"});	
			}
		}
		
		if(account.username != account.conferma_username){
			response.result = false;
			response.message += "<i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i>  L'email e la conferma email non coincidono<br>";
			$("#username2").css({borderColor: "#F00"});		
		}
		
		if(!account.password){
			response.result = false;
			response.message += "<i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i>  Non hai fornito una password<br>";
			$("#password").css({borderColor: "#F00"});	
		}else{
		
			if(account.password.length < 8){
				response.result = false;
				response.message += "<i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i>  La password deve essere almeno di 8 caratteri<br>";
				$("#password").css({borderColor: "#F00"});	
			}
			
			if(account.password != account.conferma_password){
				response.result = false;
				response.message += "<i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i>  La password e la conferma della password non coincidono<br>";
				$("#conferma_password").css({borderColor: "#F00"});	
			}
		}
		
		if(!account.check_condizioni){
			response.result = false;
			response.message += "<i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i>  Non hai accettato le condizioni<br>";
			$("#check_condizioni").css({borderColor: "#F00"});	
		}
		
		if(!$("#check_agente").is(":checked") && !$("#check_cliente").is(":checked")){
			response.result = false;
			response.message += "<i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i>  Non hai indicato se l'iscrizione è come agente o come cliente<br>";
			$("#check_condizioni").css({borderColor: "#F00"});	
		}

		return response;
		
	}	
	
	_this.verificaDatiAgente = function(agente){
		
		var response = {
				result: true,
				message: ""
		}
		
		if(!agente.nome){
			response.result = false;
			response.message += "<i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i>  Non hai inserito il nome <br>";
			$("#nome_agente").css({borderColor: "#F00"});	
		}
		
		if(!agente.cognome){
			response.result = false;
			response.message += "<i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i>  Non hai inserito il cognome<br>";
			$("#cognome_agente").css({borderColor: "#F00"});	
		}
		
		/*
		if(agente.codice_fiscale){
			var tmp = $.checkCodiceFiscale(agente.codice_fiscale);
			if(!tmp.result){
				response.result = false;
				response.message += tmp.message;
				$("#codice_fiscale_agente").css({borderColor: "#F00"});	
			}
		}
		
		if(agente.partita_iva){
			var tmp = jQuery.checkPartitaIva(agente.partita_iva);
			if(!tmp.result){
				response.result = false;
				response.message += tmp.message;
				$("#partita_iva_agente").css({borderColor: "#F00"});	
			}
		}
		*/
		
		
		return response;
		
	}
	
	_this.verificaDatiCliente = function(cliente){
		
		var response = {
				result: true,
				message: ""
		}
		
		if(!cliente.ragione_sociale){
			response.result = false;
			response.message += "<i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i>  Non hai inserito la ragione sociale<br>";	
			$("#ragione_sociale").css({borderColor: "#F00"});
		}
		
		if(!cliente.regione){
			response.result = false;
			response.message += "<i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i>  Non hai seleziona la regione<br>";
			$("#regione").css({borderColor: "#F00"});		
		}
		
		if(!cliente.provincia){
			response.result = false;
			response.message += "<i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i>  Non hai seleziona la provincia<br>";	
			$("#provincia").css({borderColor: "#F00"});	
		}
		
		if(!cliente.comune){
			response.result = false;
			response.message += "<i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i>  Non hai seleziona il comune<br>";
			$("#comune").css({borderColor: "#F00"});		
		}
		
		if(!cliente.indirizzo){
			response.result = false;
			response.message += "<i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i>  Non hai inserito l'indirizzo<br>";
			$("#indirizzo").css({borderColor: "#F00"});		
		}
		
		if(!cliente.civico){
			response.result = false;
			response.message += "<i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i>  Non hai inserito il numero civico<br>";	
			$("#civico").css({borderColor: "#F00"});	
		}
		
		if(!cliente.cap){
			response.result = false;
			response.message += "<i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i>  Non hai inserito il cap<br>";
			$("#cap").css({borderColor: "#F00"});		
		}
		
		/*if(!cliente.codice_fiscale && !cliente.partita_iva){
			response.result = false;
			response.message += "<i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i>  Non hai inserito la partita iva o il codice fiscale<br>";
			$("#partita_iva").css({borderColor: "#F00"});	
			$("#codice_fiscale").css({borderColor: "#F00"});	
		}
		
		if(cliente.codice_fiscale){
			var tmp = $.checkCodiceFiscale( cliente.codice_fiscale);
			if(!tmp.result){
				response.result = false;
				response.message += tmp.message;
				$("#codice_fiscale").css({borderColor: "#F00"});	
			}
		}
		
		if(cliente.partita_iva){
			var tmp = jQuery.checkPartitaIva(cliente.partita_iva);
			if(!tmp.result){
				response.result = false;
				response.message += tmp.message;
				$("#partita_iva").css({borderColor: "#F00"});	
			}
		}
		*/
		
		if(!cliente.email){
			response.result = false;
			response.message += "<i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i>  Non hai inserito l'email del cliente<br>";
			$("#email").css({borderColor: "#F00"});	
		}else if(cliente.email){
			var tmp = $.email(cliente.email);
			if(!tmp.result){
				response.result = false;
				response.message += tmp.message;
				$("#email").css({borderColor: "#F00"});	
			}
		}
		
		/*		
		if(cliente.email_capo_area){
			var tmp = $.email(cliente.email);
			if(!tmp.result){
				response.result = false;
				response.message += tmp.message+" del capo area";
				$("#email_capo_area").css({borderColor: "#F00"});	
			}
		}
		*/
		
		
		if(!cliente.telefono){
			response.result = false;
			response.message += "<i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i>  Non hai inserito il telefono<br>";
			$("#telefono").css({borderColor: "#F00"});		
		}
		
		if(!cliente.attivita_cliente){
			response.result = false;
			response.message += "<i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i>  Non hai inserito l'attività<br>";
			$("#attivita_cliente").css({borderColor: "#F00"});		
		}
		
		
		if(cliente.sconto_richiesto == ""){
			response.result = false;
			response.message += "<i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i>  Non hai inserito lo sconto richiesto<br>";
			$("#sconto_richiesto").css({borderColor: "#F00"});		
		}
		
		/*
		if(response.result == 0){
			$("#errori_compilazione_cliente").html("<div class='alert alert-danger'>"+response.message+"</div>");
			_this.loader.remove();
			return;	
		}
        */
		
		return response;
		
	}
	
	
	_this.salvaUtente = function(){
		
		
		
		var esci = false;
		
		var iscritto = {}
        var mess_esito = "";
		
		$("input").css({borderColor:"1px solid #ccc"});
		$("select").css({borderColor:"1px solid #ccc"});
		$("#errori_compilazione").html("");
		$("#esito").html("");
		
		var esito = 1;
		
		var account = {};
			account.tipo = "Agente";
			account.username = jQuery("#username").val();
			account.conferma_username = jQuery("#conferma_username").val();
			account.password = jQuery("#password").val();
			account.conferma_password = jQuery("#conferma_password").val();
			account.check_condizioni = jQuery("#check_condizioni").is(":checked");		
		
		// verifico i dati dell'account
		var result0 = _this.verificaDatiAccount(account);
            mess_esito += result0.message;
            
		if(!result0.result)
			esito = 0;
			else
			iscritto.account = account;
			
		if(!esito){
            $("#esito").html("<div class='alert alert-danger'>Sono stati commessi i seguenti errori di compilazione<br><br>"+mess_esito+"</div>");
			esci = true;
		}	
			
		
		var agente = {};
			
		agente.nome = jQuery("#nome_agente").val();
		agente.cognome = jQuery("#cognome_agente").val();
		agente.telefono = jQuery("#telefono_agente").val();
		agente.mansioni = jQuery("#mansioni_agente").val(); 
		agente.regione = jQuery("#regione_agente option:selected").val();
		agente.provincia = jQuery("#provincia_agente option:selected").val();
		agente.cellulare = jQuery("#cellulare_agente").val();
		agente.partita_iva = jQuery("#partita_iva_agente").val();
		agente.codice_fiscale = jQuery("#codice_fiscale_agente").val();
		agente.sesso = jQuery("#sesso_agente option:selected").val();
		
		var result0 = _this.verificaDatiAgente(agente);
		mess_esito += result0.message;
		
		if(!result0.result)
			esito = 0;
			else{
			iscritto.agente = agente;
			account.tipo = "Agente";	
		}

		
		if($("#check_cliente").is(":checked")){
			
			var cliente = {};
			
			cliente.ragione_sociale = jQuery("#ragione_sociale").val();
			cliente.codice_fiscale = jQuery("#codice_fiscale").val();
			cliente.partita_iva = jQuery("#partita_iva").val();
			cliente.prefisso_telefono = jQuery("#prefisso_telefono").val();
			cliente.telefono = jQuery("#telefono").val();
			cliente.prefisso_fax = jQuery("#prefisso_fax").val();
			cliente.fax = jQuery("#fax").val();
			cliente.website = jQuery("#website").val();
			cliente.email = jQuery("#email").val();
			cliente.regione = jQuery("#regione option:selected").val();
			cliente.provincia = jQuery("#provincia option:selected").val();
			cliente.comune = jQuery("#comune option:selected").val();
			cliente.citta = jQuery("#citta").val();
			cliente.indirizzo = jQuery("#indirizzo").val();
			cliente.civico = jQuery("#civico").val();
			cliente.cap = jQuery("#cap").val();
			cliente.fax = jQuery("#fax").val();
			cliente.email = jQuery("#email").val();
			cliente.prefisso_cellulare = jQuery("#prefisso_cellulare").val();
			cliente.cellulare = jQuery("#cellulare").val();
			cliente.attivita_cliente = jQuery("#attivita_cliente").val();
			cliente.banca = jQuery("#banca").val();
			cliente.iban = jQuery("#iban").val();
			cliente.capo_area = jQuery("#capo_area").val();
			cliente.email_capo_area = jQuery("#email_capo_area").val();
			cliente.sconto_richiesto = jQuery("#sconto_richiesto").val();
			cliente.aliquota_iva_richiesta = jQuery("#aliquota_iva_richiesta").val();
			cliente.modalita_invio_preventivo = jQuery("#modalita_invio_preventivo").val();
			cliente.modalita_pagamento = jQuery("#modalita_pagamento").val();
			cliente.mod_altro_pagamento = jQuery("#altro_pagamento").val();
			cliente.check_condizioni = jQuery("#check_condizioni").is(":checked");
			
            var result0 = _this.verificaDatiCliente(cliente);
            
            $.Log(result0);
            
            mess_esito += result0.message;
            
			if(!result0.result)
				esito = 0;
				else{
				iscritto.cliente = cliente;
				account.tipo = "Cliente";
			}
		}
		
        
		if(!esito){
			$("#esito").html("<div class='alert alert-danger'>Sono stati commessi i seguenti errori di compilazione<br><br>"+mess_esito+"</div>");	
			esci = true;
		}
		
		$.Log("Guarda qui l'iscritto");
		$.Log(iscritto);
		
		if(esci){
			$(".loading").html("");
			$("#salva_utente").removeClass("disabled");
			return;
		}
		
		function callBackAccount(datoAccount){
				$.Log(datoAccount);
				
				if(!datoAccount.success){
					_this.loader.remove();
					$("#esito").html("<div class='alert alert-danger'>Sono stati commessi i seguenti errori di compilazione<br><br>"+datoAccount.messageError+"</div>");	
					$(".loading").html("");
					$("#salva_utente").removeClass("disabled");	
					return;	
				}
				
				var message = "<div class='alert alert-success' style='text-align:center;text-align: center;font-size: 18px;margin: 30px;'>I tuo dati sono stati inseriti correttamente.<br>";
					message +=  "Riceverai una mail di conferma di avvenuta iscrizione.<br><a href='index.html'>Accedi</a></div>";
				_this.elem.html(message);
				_this.loader.remove();
				
		}

		jQuery.postJSON("RegistrazioneUtente","registerAccount","public", {"iscritto":iscritto}, false, callBackAccount);

	}
}