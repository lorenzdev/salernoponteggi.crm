<?php


class GestioneImmagini{

	private $connect;
	
	public function init(){
		$this->connect = new ConnectionDB();

	}
	
	
	public function salvaImmagine($post){
		
		$this->connect->disconnetti();
		$data = base64_encode(addslashes(fread(fopen($post["immagine"], "rb"), filesize($post["size"]))));
		
		
		//var_dump("INSERT INTO immagini (id,immagine)VALUES('".$post["account"]."','".$post["immagine"]."')");
		
		$result = $this->connect->myQuery("INSERT INTO immagini (account,immagine)VALUES('".$post["account"]."','".$post["immagine"]."')");
		
		if($this->connect->errno()){
			$objJSON["success"] = false;
			$objJSON["messageError"] = "Errore generico";
		}else{
			$objJSON["success"] = true;
			$objJSON["results"] = array();
			$rowNum = mysqli_num_rows($result);
			if($rowNum > 0){
				$rowValori = mysqli_fetch_array($result);
				
				$objJSON["results"]["email"] = $rowValori["email"];
				$objJSON["results"]["tipo"] = $rowValori["tipo"];
				$objJSON["results"]["stato"] = $rowValori["stato"];
				$objJSON["results"]["nome"] = $rowValori["nome"];
				$objJSON["results"]["cognome"] = $rowValori["cognome"];
				$objJSON["results"]["ruolo"] = $rowValori["ruolo"];
					
				if($rowValori["stato"] == 0)
					$objJSON["results"]["stato"] = "non attivo";
					else
					$objJSON["results"]["stato"] = "attivo";
					
				$objJSON["results"]["ruolo"] = $rowValori["ruolo"];
			}
			
		}
		$this->connect->disconnetti();
		return json_encode($objJSON);
	}
	
	public function getImmagine(){
		$this->connect->connetti();
		$result = $this->connect->myQuery("SELECT * FROM immagini WHERE account='l.vitale@live.it'");
		
		if($this->connect->errno()){
			$objJSON["success"] = false;
			$objJSON["messageError"] = "Errore generico";
		}else{
			$objJSON["success"] = true;
			$objJSON["results"] = array();
			$rowNum = mysqli_num_rows($result);
			if($rowNum > 0){
				$rowValori = mysqli_fetch_array($result);
				$objJSON["results"]["immagine"] = $rowValori["immagine"];
				$objJSON["results"]["type"] = $rowValori["type"];
				$objJSON["results"]["size"] = $rowValori["size"];
			}
			
		}
		$this->connect->disconnetti();
		return json_encode($objJSON);
	}
	
	public function deleteImageCarrello($post){
		
		for($i = 0;$i < count($post["prodotti"]);$i++){
		
			$dirname = "../immagini_carrello/".$post["prodotti"][$i]."/";
			
			if(file_exists($dirname) && is_file($dirname)) {
				unlink($dirname);
			}elseif(is_dir($dirname)){
				$handle = opendir($dirname);
				while (false !== ($file = readdir($handle))) { 
					if(is_file($dirname.$file)){
						unlink($dirname.$file);
					}
				}
				$handle = closedir($handle);
				rmdir($dirname);
			}
		
		}
		
		$objJSON = array();
		$objJSON["success"] = false;
		
		return json_encode($objJSON);
	}
	
	
	public function deleteFolderImageCarrello($post){
		
	
		$dirname = "../immagini_carrello/".$post."/";
		
		
		
		//function eliminafiles2($dirname){
		if(file_exists($dirname) && is_file($dirname)) {
			unlink($dirname);
		}elseif(is_dir($dirname)){
			$handle = opendir($dirname);
			while (false !== ($file = readdir($handle))) { 
				if(is_file($dirname.$file)){
					unlink($dirname.$file);
				}
			}
			$handle = closedir($handle);
			rmdir($dirname);
		}
		//}
		
		//eliminafiles2($cartella);
		
		$objJSON = array();
		
		if($this->connect->errno()){
			$objJSON["success"] = false;
			$objJSON["messageError"] = "Errore generico";
		}else{
			$objJSON["success"] = true;
			$objJSON["results"] = array();
		}
		return json_encode($objJSON);
	}
	
	
	public function getImageCarrello($post){
		$cartella = "../immagini_carrello/".$post["carrello"];
		
		$objJSON["success"] = true;
		$objJSON["results"] = array();
		
		
		//var_dump($cartella."/".$post["carrello"]."_1.jpg");
		
		if(is_file($cartella."/".$post["carrello"]."_1.jpg")){
			$objJSON["results"][0] = "immagini_carrello/".$post["carrello"]."/".$post["carrello"]."_1.jpg";
		}
		if(is_file($cartella."/".$post["carrello"]."_2.jpg"))
			$objJSON["results"][1] = "immagini_carrello/".$post["carrello"]."/".$post["carrello"]."_2.jpg";
			
		if(is_file($cartella."/".$post["carrello"]."_3.jpg"))
			$objJSON["results"][2] = "immagini_carrello/".$post["carrello"]."/".$post["carrello"]."_3.jpg";
			
		if(is_file($cartella."/".$post["carrello"]."_4.jpg"))
			$objJSON["results"][3] = "immagini_carrello/".$post["carrello"]."/".$post["carrello"]."_4.jpg";
			
		if(is_file($cartella."/".$post["carrello"]."_5.jpg"))
			$objJSON["results"][4] = "immagini_carrello/".$post["carrello"]."/".$post["carrello"]."_5.jpg";
			
		return json_encode($objJSON);
		
	}
	
	
	public function copiaImmagine($oldImage, $newImage){
		$path = "../immagini_carrello/".$oldImage;
		$newPath = "../immagini_carrello/".$newImage;
		$image = $path.$oldImage;
		
		if(is_dir($path)){
			mkdir($newPath,0777);
		
			if(is_file($path."/".$oldImage."_1.jpg")){
				copy($path."/".$oldImage."_1.jpg", $newPath."/".$newImage."_1.jpg");
			}
		
			if(is_file($path."/".$oldImage."_2.jpg")){
				copy($path."/".$oldImage."_2.jpg", $newPath."/".$newImage."_2.jpg");
			}
			
			if(is_file($path."/".$oldImage."_3.jpg")){
				copy($path."/".$oldImage."_3.jpg", $newPath."/".$newImage."_3.jpg");
			}
			
			if(is_file($path."/".$oldImage."_4.jpg")){
				copy($path."/".$oldImage."_4.jpg", $newPath."/".$newImage."_4.jpg");
			}
			
			if(is_file($path."/".$oldImage."_5.jpg")){
				copy($path."/".$oldImage."_5.jpg", $newPath."/".$newImage."_5.jpg");
			}
		}
	}
	
	
	public function deleteOneImage($post){
		
		$objJSON["success"] = true;
		$objJSON["results"] = "";
		
		$path_file = "../".$post["path"].$post["file"];
		
		//var_dump($post["path"].$post["file"]);
		
		if(file_exists($path_file) && is_file($path_file)) {
			unlink($path_file);
			/*$handle = opendir("../".$post["path"]);
			$boo = true;
			while (false !== ($file = readdir($handle))) { 
				if(is_file("../".$post["path"].$file)){
					$boo = false;
					break;
				}
			}
			
			$handle = closedir($handle);
			if($boo)
				unlink("../".$post["path"]);*/
			
			$objJSON["results"] = $path_file;
		}
		
		return json_encode($objJSON);
	}
}