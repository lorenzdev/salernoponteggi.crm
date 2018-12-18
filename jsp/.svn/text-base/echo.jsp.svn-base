<%@ page language="java" import="HelloWorld, java.io.*, java.util.*, java.net.*, net.sf.json.*,org.apache.http.client.*, org.apache.http.impl.client.*" contentType="application/json; charset=UTF-8"%>

<%

	String BUSINESS_SERVER_URL = "http://192.168.1.2:8080/cerrato/";
	
	//ATTILIO
	//String BUSINESS_SERVER_URL = "http://10.51.0.68:8080/momento";
	
	//PRODUZIONE
	//String BUSINESS_SERVER_URL = "http://10.40.0.96/momento/";
	
	String MANAGER_KEY = "_bl_manager";
	String METHOD_KEY = "_bl_method";
	String ACCESS_MODE_KEY = "_bl_accessMode";
	String JSON_DATA_KEY = "_bl_jsonString";

	StringBuffer upBuffer = new StringBuffer();
	
	String type = request.getParameter(ACCESS_MODE_KEY);
	/*if(request.getParameter(ACCESS_MODE_KEY)!= null) {
		pub = "public".equals(request.getParameter(ACCESS_MODE_KEY));
		admin = "admin".equals(request.getParameter(ACCESS_MODE_KEY));
	}*/

	//boolean[] boolArray = new boolean[]{true,false,true};
	//JSONArray jsonArray = JSONArray.fromObject(boolArray);
	
	int paramCount = 0;
	Enumeration<String> elems = request.getParameterNames();
	
	while(elems.hasMoreElements()){
		String pName = elems.nextElement();
		if(!MANAGER_KEY.equals(pName) && !METHOD_KEY.equals(pName) && !ACCESS_MODE_KEY.equals(pName) && !JSON_DATA_KEY.equals(pName)) {
			if(paramCount > 0) {
				upBuffer.append("&");
			} else {
				upBuffer.append("?");
			}
			upBuffer.append(pName).append("=").append(URLEncoder.encode(request.getParameter(pName), "UTF-8"));
			paramCount++;
		}
	}
	
	
	StringBuffer bsResponse = new StringBuffer();

	HelloWorld mio = new HelloWorld();
	
    	try {
			HttpClient httpclient = new DefaultHttpClient();
			out.println("Azz mo va!");
      		/*
      		StringBuffer strbUrl = new StringBuffer();
			strbUrl.append(BUSINESS_SERVER_URL);
      		strbUrl.append(request.getParameter(MANAGER_KEY)).append("/");
      		
			if(type != "") strbUrl.append(type + "/");
			
      		strbUrl.append(request.getParameter(METHOD_KEY));
      		strbUrl.append(upBuffer.toString());

			//HttpPost httppost = new HttpPost(strbUrl.toString());
out.println(strbUrl);
		if(request.getParameter(JSON_DATA_KEY) != null) {
			//StringEntity entity = new StringEntity(request.getParameter(JSON_DATA_KEY),"UTF-8");
			//entity.setContentType("application/json");
			//httppost.setEntity(entity);
		}
			
		//HttpResponse momResp = httpclient.execute(httppost);

      		//Get Response	
      		//InputStream is = momResp.getEntity().getContent();
      		//BufferedReader rd = new BufferedReader(new InputStreamReader(is));
      		String line;

      		/*while((line = rd.readLine()) != null) {
        		bsResponse.append(line);
        		bsResponse.append('\r');
      		}*/
      		//rd.close();
      		
	} catch (Exception e) {
      		out.println("<p>Unknown error</p>" + e.getMessage());
    	} finally {
    	}
%>