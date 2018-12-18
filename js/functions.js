/*
* Customer: MomentoEspresso
* Company: Inova Spa
* Author: Lorenzo Vitale
* date: Luglio 2013
*
*/
var bool_log = true;

jQuery(document).ready(function(){

	var expireCookie = {};

	////console.log("QUI!");

	// function send post request to server
	jQuery.postJSON = function(classe, metodo, isPublic, dataJS, as, callback) {

		//dataJS["_bl_manager"] = manager;
		//dataJS["_bl_method"] = method;
		//dataJS["_bl_jsonString"] = jsonData;
		//dataJS["_bl_accessMode"] = isPublic;

		var boo = true;
		if(isPublic == "private"){
			function callBack(dato){
				//console.log(dato);
				if(!dato.success){
					alert("Sessione scaduta!");
					jQuery.deleteCookie("utente");
					jQuery.deleteCookie("selezione");
					location.reload();
					boo = false;
				}
			}

			jQuery.checkSession(callBack);
			if(!boo) return;
		}

		var url = "php/proxy.php";

		//dataJS = "oggetto=Basculanti&metodo=getBasculanti";
		dataJS.classe = classe;
		dataJS.metodo = metodo;

		//console.log(classe+" "+metodo);

		//dataJS["oggetto"] = "Basculanti";
		//dataJS["metodo"] = "getBasculanti";

 		/*var proceed = false;
		var jsonCookie;
		var secToken;




		if(isPublic){
			proceed = true;
		}else if(isPublic == ""){
			proceed = true;
			//jsonCookie = jQuery.checkCookie();
			//secToken = jsonCookie.token;

		}else proceed = false;


		 if(!dataJS) {
			 dataJS = {};
		 }


		 if(proceed) {
			*/ //var url = "jsp/proxyjson.jsp";
		//	 var url = "jsp/echo.jsp";
		//	 dataJS["_bl_manager"] = manager;
		//	 dataJS["_bl_method"] = method;
			 //dataJS["token"] = secToken;

		 //if(jsonData) {
		  //dataJS["_bl_jsonString"] = JSON.stringify(jsonData);
		 //}

		// dataJS["_bl_accessMode"] = isPublic;


		 return jQuery.ajax({
			 url: url,
			 type: 'POST',
			 async: as,
			 data: dataJS,
			 timeout: 30000,
				dataType: 'json',
			 success: function(data){
				callback(data);
		 	},
			error: function(data){
				//alert("Errore di connessione al server");
				console.log("Errore: ");
				console.log(data.responseText);

                jQuery.unblockUI();
			}
		});
	}
});


jQuery.checkSession = function(callBack){

	var dataJS = {};
	dataJS.classe = "RegistrazioneUtente";
	dataJS.metodo = "checkSession";

	account = "";
	if(!jQuery.getCookie("utente")){
		account = "";
		token = "";
	}else{
		account = jQuery.getCookie("utente").email;
		token = jQuery.getCookie("utente").token;
		}


	dataJS.account = account;
	dataJS.token = token;

	return jQuery.ajax({
			 url: "php/proxy.php",
			 type: 'POST',
			 async: false,
			 data: dataJS,
			 timeout: 30000,
			 dataType: 'json',
			 success: function(data){
				callBack(data);
		 	},
			error: function(data){
				//alert("Errore di connessione al server");
				//console.log("Errore: ");
				//console.log(data.responseText);
			}
		});

}

jQuery.validaValore = function(valore){

	if(valore != "" && 	valore != undefined && valore != null && valore != "null")
		return true;
		else
		return false;
}

	Number.prototype.format = function(c, decimal) {


			if(c)
			number = Math.round(this*10)/10;
			else
			number = Number(this);

			/*
			return value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1.");
			*/

			var numberStr = parseFloat(number).toFixed(decimal).toString();
			var numFormatDec = numberStr.slice(-decimal); /*decimal 00*/
			numberStr = numberStr.substring(0, numberStr.length-(decimal+1)); /*cut last 3 strings*/

			var numFormat = new Array;
			while (numberStr.length > 3) {
				numFormat.unshift(numberStr.slice(-3));
				numberStr = numberStr.substring(0, numberStr.length-3);
			}
			numFormat.unshift(numberStr);

			return numFormat.join('.')+','+numFormatDec;

			/*
			var n = this,
			c = isNaN(c = Math.abs(c)) ? 2 : c,
			d = d == undefined ? "," : d,
			t = t == undefined ? "." : t,
			s = n < 0 ? "-" : "",
			i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
			j = (j = i.length) > 3 ? j % 3 : 0;
		   return (s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : ""));
			*/
		};


jQuery.onlynumbers = function(e){
  		return (e.which!=8 && e.which!=0 && (e.which<48 || e.which>57)) ? false : true ;
	}

jQuery.onlydecimals = function(e){
  		return (e.which!=46 && e.which!=8 && e.which!=0 && (e.which<48 || e.which>57)) ? false : true ;
	}

jQuery.registerCookie = function(nome_cookie, cookie){
		jQuery.cookie(nome_cookie, JSON.stringify(cookie), { expires: 60});
	}


jQuery.deleteCookie = function(nomecookie){
		////console.log("Ci sto provando!");
		jQuery.cookie(nomecookie,"",{expires:-1});
		jQuery.cookie(nomecookie, null);
	}

jQuery.getCookie = function(nome_cookie){

		if(jQuery.cookie(nome_cookie) == undefined)
			return undefined;

		return JSON.parse(jQuery.cookie(nome_cookie));
	}

jQuery.checkPartitaIva = function(pIva){

		var result = {"message":"", "result":1};

		if (pIva.length < 10 || pIva.length > 11){
			return {"message":"<i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i>  La partitia iva non è corretta<br>", "result": 0};
		}

		 function callBackIva(dato){


			if(!dato.success){
				alert(JSON.stringify(dato.errorMessage));
				return;
			}

			if(dato.results.length > 0){
				result = {"message":"<i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i>  Partita iva utilizzata da un altro cliente<br>", "result": 0};
			}

		 }


		 var utente = jQuery.getCookie("utente");
		 if(utente != undefined)
		 jQuery.postJSON("RegistrazioneUtente","checkPartitaIva","public", {"partita_iva":pIva,"email":utente.email}, false, callBackIva);

		return result;
	}


	jQuery.checkCodiceFiscale = function(cf){

		var result = {"message":"", "result":1};

		if(cf != "" && cf != null){

			var pattern = /^[a-zA-Z]{6}[0-9]{2}[a-zA-Z][0-9]{2}[a-zA-Z][0-9]{3}[a-zA-Z]$/;
			if (cf.search(pattern) == -1) {
				return {"message":"<i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i>  Inserire un codice fiscale valido<br>", "result": 0};
			}
		}

		 function callBackCF(dato){

			//console.log("Codice fiscale");
			//console.log(dato);

			if(!dato.success){
				alert(JSON.stringify(dato.errorMessage));
				return;
			}

			if(dato.results.length > 0){
				result = {"message":"<i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i>  Codice fiscale utilizzato da un altro cliente<br>", "result": 0};
			}

		 }

		var utente = jQuery.getCookie("utente");
		if(utente != undefined)
			jQuery.postJSON("RegistrazioneUtente","checkCodiceFiscale","public", {"codice_fiscale":cf,"email":utente.email}, false, callBackCF);
		return result;
	}


	jQuery.checkCodiceFiscaleCliente = function(cf, cliente){

		var result = {"message":"", "result":1};

		if(cf != "" && cf != null){

			var pattern = /^[a-zA-Z]{6}[0-9]{2}[a-zA-Z][0-9]{2}[a-zA-Z][0-9]{3}[a-zA-Z]$/;
			if (cf.search(pattern) == -1) {
				return {"message":"<i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i>  Inserire un codice fiscale valido<br>", "result": 0};
			}
		}

		 function callBackCF(dato){

			//console.log("Codice fiscale");
			//console.log(dato);

			if(!dato.success){
				alert(JSON.stringify(dato.errorMessage));
				return;
			}

			if(dato.results.length > 0){
				result = {"message":"<i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i>  Codice fiscale utilizzato da un altro cliente<br>", "result": 0};
			}

		 }

		jQuery.postJSON("Clienti","checkCodiceFiscaleCliente","public", {"codice_fiscale":cf,"cliente":cliente}, false, callBackCF);
		return result;
	}


	jQuery.email = function(email){
		var result = {"message":"", "result":0};

		if(email != ""){
			var email_reg_exp = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-]{2,})+\.)+([a-zA-Z0-9]{2,})+$/;
			if (!email_reg_exp.test(email)) {
				return {"message":"<i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i>  Inserire una e-mail valida<br>", "result": 0};
			}else
				return {"message":"", "result":1};
		}

		return result;
	}

	jQuery.checkEmail = function(email){

		var result = {"message":"", "result":1};

		if(email != ""){
			var email_reg_exp = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-]{2,})+\.)+([a-zA-Z0-9]{2,})+$/;
			if (!email_reg_exp.test(email)) {
				return {"message":"<i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i>  Inserire una e-mail valida<br>", "result": 0};
			}
		}


		function callBackEmail(dato){

			if(!dato.success){
				alert(JSON.stringify(dato.errorMessage));
				return;
			}

			if(dato.results.length > 0){
				result = {"message":"<i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i>  Email utilizzata da un altro utente<br>", "result": 0};
			}
		 }

		 jQuery.postJSON("RegistrazioneUtente","checkEmail","public", {"email":email}, false, callBackEmail);

		return result;
	}


	jQuery.generaPassword = function(plength){
		var keylist = "abcdefghijklmnopqrstuvwxyz1234567890";
		var temp = "";
	 	for (i=0; i<plength; i++){
	 		temp += keylist.charAt(Math.floor(Math.random()*keylist.length));
	 	}


		//console.log("Password: " + temp);
		return temp;
	}


	jQuery.ImageExist = function(url){
   		if(url){
			try{
				var req = new XMLHttpRequest();
				req.open('GET', url, false);
				req.send();
			}catch(ex){
				return false;
			}
        	return req.status==200;
		} else {
			return false;
		}
	}


	$.popolaNazioni = function(){

		function callBackNazioni(dato){
			//console.log("Nazioni:");
			//console.log(dato);
			//jQuery("#regione").html("<option ");
			var tmp = "<option value=\"\">Seleziona la nazione</option>";
			for(var i = 0;i < dato.length;i++){
				var selected = "";
				//console.log(dato[i].id +  " == IT");
				if(dato[i].id == "IT")
					selected = "selected";
				tmp += "<option value='"+dato[i].id+"' "+selected+">"+dato[i].nome+"</option>";

			}

			jQuery(".nazione").html(tmp);

		}

		jQuery.postJSON("RegistrazioneUtente", "getNazioni","public", {}, true, callBackNazioni);

	}

	$.popolaRegioni = function(elem, regione){


		elem.prop("disabled", false);

		function callBackRegione(dato){

			console.log(dato);
			//jQuery("#regione").html("<option ");

			var tmp = "<option value=\"\">Seleziona la regione</option>";

			for(var i = 0;i < dato.length;i++){

				var selected = "";
				if(dato[i].id == regione)
					selected = "selected";

				tmp += "<option "+selected+" value='"+dato[i].id+"'>"+dato[i].nome+"</option>";
			}

			elem.html(tmp);
		}

		jQuery.postJSON("RegistrazioneUtente", "getRegioni","public", {}, true, callBackRegione);

	}

	$.popolaProvince = function(elem,id_regione, id_provincia){

		var id_elem = ".provincia";
		if(elem){
			id_elem = elem;
		}

		elem.prop("disabled", false);

		function callBackProvince(dato){
			//console.log(dato);
			//jQuery("#provincia").html("");
			var tmp = "<option value=\"\">Seleziona la provincia</option>";
			for(var i = 0;i < dato.length;i++){

				var selected = "";
				if(dato[i].id == id_provincia){
					selected = "selected";
				}

				tmp += "<option "+selected+" value='"+dato[i].id+"' sigla='"+dato[i].sigla+"'>"+dato[i].nome+"</option>";
			}
			jQuery(id_elem).html(tmp);
		}

		jQuery.postJSON("RegistrazioneUtente", "getProvince","public", {"regione":id_regione}, true, callBackProvince);
	}

	$.popolaComuni = function(elem, id_provincia, id_comune){

		elem.prop("disabled", false);

		function callBackComuni(dato){
			//console.log(dato);
			//jQuery("#comune").html("");
			var tmp = "<option value=\"\">Seleziona il comune</option>";
			for(var i = 0;i < dato.length;i++){

				var selected = "";
				if(dato[i].id == id_comune){
					selected = "selected";
				}

				tmp += "<option "+selected+" value='"+dato[i].id+"'>"+dato[i].nome+"</option>";
			}
			elem.html(tmp);
		}

		jQuery.postJSON("RegistrazioneUtente", "getComuni","public", {"provincia":id_provincia}, true, callBackComuni);
	}


	$.Log = function(str){
		if(bool_log)
			console.log(str);
	}


	$.ERROR = function(msg){
		$("#ERROR_LOG").html("<div class='alert alert-danger'><button type=\"button\" style='padding: 8px;margin-top: -10px;margin-right: -10px;' class=\"close close_my_alert\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button><i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i> Errore: "+msg+"</div>");

		  $("#ERROR_LOG .close").off().on("click", function(){
			  $(this).off();
			  $("#ERROR_LOG").html("");
		  });
	}
