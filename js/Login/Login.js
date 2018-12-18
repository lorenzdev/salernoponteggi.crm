var Login = function(main){

	var _this = this;
	_this.main = main;
	_this.header;
	_this.menu;
	_this.container;

	_this.init = function(){

		_this.header = jQuery("#Header");
		_this.menu = jQuery("#Menu");
		_this.container = jQuery("#Container");

		var utente = $.getCookie("utente");

		if(jQuery.validaValore(utente)){

			$.Log("Utente");
			$.Log(utente);

			$.get("htmls/menu_header.html", function(html){

				var obj = $.parseHTML(html);

				$(obj).find(".menu, .thumbnail").each(function(){
					if(!$(this).hasClass(utente.ruolo)){
						$(this).remove();
					}else{
						$(this).css({display:"block"});
					}
				});

				_this.container.html(obj);

				var benvenuto = "";
				if(utente.sesso == "F")
					benvenuto += "Benvenuta";
					else
					benvenuto += "Benvenuto";

				// ENTRO
				$("#Benvenuto").html(benvenuto);
				$("#nome_utente").html("<b>"+utente.nome + " " + utente.cognome+"</b>");

				jQuery("#esci").bind("click",function(){
					_this.logout();
				});


				var menu = new Menu();
				menu.init(_this.menu);


			});


			return true;
		}else{

			$.get("htmls/login.html", function(html){

				_this.container.html(html);


				$.DivasCookies({
					bannerText				: "Qeusto sito usa i cookie per migliorare la tua esperienza sull'applicazione web.",		// text for the Divas Cookies banner
					cookiePolicyLink		: "http://www.salernoponteggi.com/it/privacy.html",		// link to the extended cookie policy
					cookiePolicyLinkText	: "Per più informazioni",				// text for the link to the extended cookie policy
					thirdPartyPolicyWidget	: "",						// if set to "iubenda" tries to use the Iubenda widget
					acceptButtonText		: "Ho capito!",						// text for the close button
					acceptButtonSrc			: "",						// source for the close button image
					openEffect				: "slideDown",				// opening effect for Divas Cookies banner ["fade", "slideUp", "slideDown", "slideLeft", "slideRight"]
					openEffectDuration		: 600,						// duration of the opening effect (msec)
					openEffectEasing		: "swing",					// easing for the opening effect
					closeEffect				: "slideUp",				// closing effect for Divas Cookies banner ["fade", "slideUp", "slideDown", "slideLeft", "slideRight"]
					closeEffectDuration		: 600,						// duration of the closing effect (msec)
					closeEffectEasing		: "swing",					// easing for the closing effect
					debugMode				: false,					// if true, the options are checked and warnings are shown
					saveUserPreferences		: true,						// if true, sets a cookie after the Divas Cookies is closed the first time and never shows it again
					cookieDuration			: 30,						// number of days after which the Divas Cookie technical cookie will expire (default 365 days)
					blockScripts			: false,					// set this to true if you blocked scripts by wrapping them with if($.DivasCookies.optedIn()){**script to be blocked**} (default false)
					pageReload				: false,					// if true reloads the actual page after opt-in to show the previuosly blocked scripts (default false)
					acceptOnScroll			: false,					// if true sets the Divas Cookie technical cookie on page scroll for cookies agreement (default false)
					acceptOnClick			: false,					// if true sets the Divas Cookie technical cookie on click on any <a> in the page except that on Divas Cookies banner for cookies agreement (default false)
					excludePolicyPage		: true						// if true excludes the cookie policy page from acceptOnScroll and acceptOnClick (default false)
			});


				$("#password").val("");

				jQuery("#enter").off().on("click",function(){
					_this.login();
				});

				$("#Container").focus();
				$("#Container").off().on("keypress",function(event){
				  if(event.keyCode == 13){
					_this.login();
				  }
				});


				jQuery("#recupera_password").off().on("click",function(){
					_this.recuperaPassword();
				});

			});


			return false;
		}
	}

	_this.recuperaPassword = function(){

		/*var html = "<h3>Inserisci la mail utilizzata durante la fase di iscrizione per rigenerare una nuova password</h3>";
			html += "<div style='text-align:center;'>";
			html += "<input id='email_recupera_password' value='' style='width:200px;'/>";
			html += " <button id='invia_email'>Invia</button><br><br>";
			html += "<a href='index.html' style='text-decoration:underline;'>Torna alla login</a>";
			html += "</div>";
*/
        var html = '<div style="width: 400px; margin: 0 auto;background-color: #FFF;padding: 0px 30px 30px 30px;">\
                        <div class="pagination-centered">\
                            <img src="img/logo.png" alt="" width="180" height="50" style="margin-top: 20px;"/>\
                        </div><br>\
                    <h3>Recupero password</h3>\
                    <div class="line4"></div>\
                    <div id="ERROR_LOG"></div> \
                    <form style="line-height:14px;">\
                       <center><label>Email utilizzata durante la fase di iscrizione </label><br>\
                       <input id="email_recupera_password" class="form-control" value="" style="width:270px;display:inline-block;"/>\
                     <button type="button" class="btn btn-primary active btn-lg" id="invia_email" style="    margin-top: -3px;display:inline-block;    padding: 4px 8px 4px 9px;"><span class="loading"></span> Invia</button></center>\
                        <div class="form-group customtopbutton">\
                        <div class="pagination-centered">\
                        <a href="index.html">Torna alla login</a>\
                      </div>\
                    </div>\
                  </form>\
				  <div class="line4"></div>\
			  		<p class="testo_blu" style="font-size:11px;text-align:center;padding:5px;"><b>Salerno Ponteggi srl</b> - Pontecagnano Faiano (SA)  - Tel. +39 089 382657 - <a href="mailto:info@cerratospa.com">info@salernoponteggi.com</a> - P.Iva/C.F. 05711920651  &nbsp; <span style="white-space:nowrap;">Powered by: <a  style="position: relative;top: -2px;" href="http://www.lorenzovitale.it" target="_blank"><img src="images/logo_digitalsolutions.png" /></a></span>\
           		 	</p>\
                </div>\
    ';

    /*    var html = '<div class="container">\
            <!-- modulo registrazione agente-->\
            <div class="row custommargin">\
                <div class="col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-10 col-xs-offset-1">\
                    <h3 class="title_h4">Inserisci la mail utilizzata durante la fase di iscrizione per rigenerare una nuova password</h3>\
                    <div style="text-align:center;">\
			         <input id="email_recupera_password" class="form-control" value="" style="width:200px;"/>\
			         <button id="invia_email" type="button" class="btn btn-primary">Invia</button><br><br>\
			         <a href="index.html" style="text-decoration:underline;">Torna alla login</a>\
			     </div>\
            </div>\
            </div>';
       */

		_this.container.html(html);

		jQuery("#invia_email").off().on("click",function(){

			var email = jQuery("#email_recupera_password").val();
			if(!email){
				alert("Non hai inserito nessuna email");
				return;
			}


			function callBackRecuperaPassword(dato){

				$.Log("Qui password");
				$.Log(dato);

				if(!dato.success){
					alert("Errore!");
					return;
				}

				if(!dato.results){


					var message = '<div style="width: 400px; margin: 0 auto;background-color: #FFF;padding: 0px 30px 30px 30px;">\
                        <div class="pagination-centered">\
                            <img src="img/logo.png" alt="" width="180" height="50" style="margin-top: 20px;"/>\
                        </div><br>\
                    <h3>Recupero password</h3>\
                    <div class="line4"></div>\
                    <div class="alert alert-warning" style="text-align:center;"><b>Email non valida o non presente nei nostri archivi</div><br><br>\
					<center><button id="riprova_recupera_mail" class="btn btn-primary active btn-lg">Riprova</button></center>\
				  <div class="line4"></div>\
			  		<p class="testo_blu" style="font-size:11px;text-align:center;padding:5px;"><b>Salerno Ponteggi srl</b> - Pontecagnano Faiano (SA)  - Tel. +39 089 382657 - <a href="mailto:info@cerratospa.com">info@salernoponteggi.com</a> - P.Iva/C.F. 05711920651  &nbsp; <span style="white-space:nowrap;">Powered by: <a  style="position: relative;top: -2px;" href="http://www.lorenzovitale.it" target="_blank"><img src="images/logo_digitalsolutions.png" /></a></span>\
           		 	</p>\
                </div>\
    ';

					_this.container.html(message);

					jQuery("#riprova_recupera_mail").bind("click",function(){
						_this.recuperaPassword();
					});
				}else{
					var message = '<div style="width: 400px; margin: 0 auto;background-color: #FFF;padding: 0px 30px 30px 30px;">\
                        <div class="pagination-centered">\
                            <img src="img/logo.png" alt="" width="180" height="50" style="margin-top: 20px;"/>\
                        </div><br>\
                    <h3>Recupero password</h3>\
                    <div class="line4"></div>\
                    <div class="alert alert-success" style="text-align:center;font-size:16px;">La password è stata rigenerata.<br> Una mail è stata inviata all\'indirizzo di posta inserito</div><br><br>\
					<center><button type="button" class="btn btn-primary active btn-lg"><a href=\'index.html\' style=\'text-decoration:none;color:#FFF;\'>Accedi</a></button></center>\
				  <div class="line4"></div>\
			  		<p class="testo_blu" style="font-size:11px;text-align:center;padding:5px;"><b>Salerno Ponteggi srl</b> - Pontecagnano Faiano (SA)  - Tel. +39 089 382657 - <a href="mailto:info@cerratospa.com">info@salernoponteggi.com</a> - P.Iva/C.F. 05711920651  &nbsp;<span style="white-space:nowrap;">Powered by: <a  style="position: relative;top: -2px;" href="http://www.lorenzovitale.it" target="_blank"><img src="images/logo_digitalsolutions.png" /></a></span>\
           		 	</p>\
                </div>\
    ';


					_this.container.html(message);
				}
			}

			jQuery.postJSON("RegistrazioneUtente","recuperaPassword","public",{"email":email}, false, callBackRecuperaPassword);

		});

	}

	_this.login = function(){


		$(".loading").html("<i class=\"fa fa-spinner fa-spin\"></i>");
		$("#enter").addClass("disabled");


		var username = jQuery("#username").val();
		var password = jQuery("#password").val();
		var check = jQuery("#resta_connesso");

		var token = jQuery.generaPassword(32);

		var user = {
			"username": username,
			"password": password,
			"token":token
		}

		function callBackUtente(utente){
			$.Log("risultato query");
			$.Log(utente.results);

			if(utente.results.length <= 0){

				var error = "<div class=\"alert alert-danger\" role=\"alert\" style=\"    margin: 15px 0px 15px 0px;\">";
  					error += "<button type=\"button\" class=\"close close_my_alert\" data-dismiss=\"alert\" aria-hidden=\"true\">x</button> <i class=\"fa fa-warning\"></i> Username o password errati. Riprova";
					error += "</div>";

				$("#ERROR_LOG").html(error);

				$(".loading").html("");
				$("#enter").removeClass("disabled");

			}else{


				var user = {
					"nome": utente.results.nome,
					"cognome": utente.results.cognome,
					"ruolo": utente.results.ruolo,
					"email": utente.results.email,
					"tipo": utente.results.tipo,
					"stato": utente.results.stato,
					"sesso": utente.results.sesso,
					"token":token
				}


				if(utente.results.stato == 0){

					var avviso = '<div class="container">\
									<div class="row pagination-centered">\
									  <img src="img/logo.png" alt="" width="180" height="50" style="margin-top: 20px;/">\
								  </div>\
									 <div class="row custommargin">\
										<div class="alert alert-warning" style="text-align:center;"><b>Accesso negato</b><br>Il tuo account è in attesa di approvazione, riprova più tardi.<br><br>\
										<a href="index.html"><button type="button" class="btn btn-primary">riprova la login</button></a>\
									 </div>\
								 </div>\
								 </div>';

					$("Body").html(avviso);
					return;

				}

				var expires = 0;
				if(check.is(":checked")){
					expires = 60;
				}

				jQuery.registerCookie("utente",user, {expires: expires });
				location.reload();

			}


		}

		jQuery.postJSON("RegistrazioneUtente","login","public",user, true, callBackUtente);

	}

	_this.logout = function(){

		$(".loading").html("<i class=\"fa fa-spinner fa-spin\"></i>");
		$("#esci").addClass("disabled");

		function callBackUtente(dato){
			if(!dato.success){
				alert("Errore nella cancellazione della sessione!");
				return;
			}
			jQuery.deleteCookie("utente");
			jQuery.deleteCookie("selezione");

			location.reload();
		}

		jQuery.postJSON("RegistrazioneUtente","logout","public",jQuery.getCookie("utente"), true, callBackUtente);

	}
}
