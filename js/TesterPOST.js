function TesterPOST(){
	
	var _this = this;
	
	_this.init = function(){
		//_this.html = elem;
		
		
		
		/*function init() {
			document.getElementById('file_upload_form').onsubmit=function() {
				document.getElementById('file_upload_form').target = 'upload_target'; //'upload_target' is the name of the iframe
				//jQuery("#file_upload_form").remove();
				jQuery("#upload_target").contents().find("body").html("<img src='images/preloader.gif' align='center'><br>'Attendere!");
				//jQuery("#file_upload_form").append("Attendere...");
			}
		}
		
		window.onload=init;
		
		
		var inputFile = "<form id=\"file_upload_form\" method=\"post\" enctype=\"multipart/form-data\" action=\"php/gestioneImmagini/upload.php\">";
			inputFile += "<input name=\"file\" id=\"file\" size=\"27\" type=\"file\" /><br />";
			inputFile += "<input type=\"submit\" name=\"action\" value=\"Upload\" id='action'/></form><br />";
			inputFile += "<iframe id=\"upload_target\" name=\"upload_target\" src=\"\" style=\"width:200;height:60;border:0px solid #fff;text-align:center;\">";
			inputFile += "</iframe><br><br>";
		
		
		
		var inputFile = "<form id=\"file_upload_form\" method=\"post\" target=\"upload_target\" enctype=\"multipart/form-data\" action=\"php/gestioneImmagini/upload.php\">";
			inputFile += "<input name=\"codice_carrello\" id=\"codice_carrello\" value='pippo' type=\"hidden\" /><br />";
			inputFile += "<input name=\"file1\" id=\"file1\" size=\"27\" type=\"file\" /><br />";
			inputFile += "<input name=\"file2\" id=\"file2\" size=\"27\" type=\"file\" /><br />";
			inputFile += "<input name=\"file3\" id=\"file3\" size=\"27\" type=\"file\" /><br />";
			inputFile += "</form><br />";
			inputFile += "<iframe id=\"upload_target\" name=\"upload_target\" src=\"\" style=\"width:200;height:60;border:0px solid #fff;text-align:center;\">";
			inputFile += "</iframe><br><br>";
		
		
		
		jQuery("#Container").append(inputFile);
		jQuery("#Container").append("<input type=\"button\" value=\"AGGIUNGI AL CARRELLO\" id=\"add_carrello\"/><br><br>");
		
		
		
		jQuery("#add_carrello").bind("click",function(){
			
			jQuery("#file_upload_form").submit();
				/*function callBackImmagine(datoImage){
				
					if(!datoImage.success){
						alert("Errore caricamento immagine");
						return;	
					}
					//$.Log(datoImage.results.immagine);
					
					var immagine =jQuery.base64.decode(datoImage.results.immagine);
					//$.Log(immagine);
					jQuery("#Container").append("<img src=\"data:"+datoImage.results.type+";base64, "+datoImage.results.immagine+" \" border=\"0\" />");
				}
					
				////$.Log(foto);	
					
				//jQuery.postJSON("GestioneImmagini","getImmagine", {}, false, callBackImmagine);
				
		
		
		});*/
		// PRELEVO I DATI DELL'ACCOUNT
		/*function callBackFamiglie(datoMessaggi){
			//$.Log(datoMessaggi);
			//_this.account = jQuery.extend(true,{}, datoAccount.results[0]);
			//_this.tmpAccount = jQuery.extend(true,{}, datoAccount.results[0]);
			////$.Log("ACCOUNT!");
			////$.Log(_this.account);
		}
		
		var param = {
			"width":20,
			"height":20	
		}
		
		jQuery.postJSON("Famiglie", "getFamiglia", param, false, callBackFamiglie);*/
		
		/*var param = {
			"partita_iva":11111111111
		}
		
		function callBackPartitaIva(dato){
			//$.Log(dato);
		}	
		
		jQuery.postJSON("RegistrazioneUtente", "checkPartitaIva", param, false, callBackPartitaIva);
		
		
		var param = {
			"email":"l.vitale@live.it"
		}
		
		function callBackEmail(dato){
			//$.Log(dato);
		}	
		
		jQuery.postJSON("RegistrazioneUtente", "checkEmail", param, false, callBackEmail);
		
		
		var param = {
			"codice_fiscale":"vtllnz82a25l628r"
		}
		
		function callBackCodiceFiscale(dato){
			//$.Log(dato);
		}	
		
		jQuery.postJSON("RegistrazioneUtente", "checkCodiceFiscale", param, false, callBackCodiceFiscale);
		
		
		
		function callBackPassword(dato){
			//$.Log(dato);
		}	
		
		var param = {"password":"cerratospa"};
		jQuery.postJSON("RegistrazioneUtente", "generaPasswordCriptata", param, false, callBackPassword);
		*/
		
		/*var param = {
			"account":"info@cerratospa.com",
			"stato":1,
			"ruolo":0,
			"password":"admin"
		}
		
		function callBackModifica(datoModifica){
				
				if(!datoModifica.success){
					alert("Errore di modifica");
					return;	
				}
				
				
				if(_this.user["stato"] != param.stato || _this.user["ruolo"] != param.ruolo){
					
						
					//Email: 	_this.user.email;
					//Message: 	L'amministratore del sistema ha modificato le tue credenziali:
				}
				
				_this.elem.html("<h3>Modifica effettuata con successo</h3>");
				return;
			}
			
		jQuery.postJSON("RegistrazioneUtente", "modificaAccount", param, false, callBackModifica);	
		*/
		
	}
	
}