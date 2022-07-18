<%@page import="Test.File"%>
<%@page import="PluSoft.Utils.StringUtil"%><%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8" import="java.util.*,java.io.*"%>
<%
	request.setCharacterEncoding("UTF-8");
	response.setCharacterEncoding("UTF-8");
	
		
	String imgType = request.getParameter("type");
	if(StringUtil.isNullOrEmpty(imgType)) imgType = "png";
	
	String htmlPath = createHTML(request);
	
	System.out.println(htmlPath);	
	
	String imgPath = createIMG(htmlPath, imgType);
	
	//Test.File.delete(htmlPath);
	
	//response.sendRedirect(imgPath);
	
	
	//response.getWriter().write(imgPath);
%>
<img src="<%=imgPath%>"/>
<%!
public String createHTML(HttpServletRequest request){	
	String path = "\\scripts\\plusproject\\services\\snapshot\\";
	String dir =this.getServletConfig().getServletContext().getRealPath("/") + path;
	String filename = "snapshot_" + new Date().getTime() + ".html";
	
	String html = request.getParameter("html");
	
	//utf8
	html = html.replace("charset=gb2312", "charset=utf-8");
	
	Test.File.write(dir + filename, html);
	
	
	return dir + filename;
}
public String createIMG(String url, String imgType){
	String path = "\\scripts\\plusproject\\services\\snapshot\\";
	String dir =this.getServletConfig().getServletContext().getRealPath("/") + path;
	
	System.out.println(dir);	
	
	//Test.File.deleteAllFiles(dir + "images\\");
	
			
	String imgName = "images/snapshot_"+new Date().getTime()+".png";
	String imgDir = dir + imgName;
	//imgDir = "d://tmp//snapshot."+imgType;
	
    savePage(url, imgDir, dir);
    
    return imgName;
}
public void savePage(String url, String imgPath, String dir) {     
    
    StringBuffer buffer = new StringBuffer();  
    buffer.append(dir + "phantomjs.exe ");     
    buffer.append(" --ignore-ssl-errors=yes ").append(  
            "'"+dir + "snapshot.js'  '").append(url + "' ").append(  
            		imgPath);  
      
    System.out.println(buffer.toString());  
      

    try {  
        Process process = Runtime.getRuntime().exec(buffer.toString());  
        
        InputStream eis = process.getErrorStream();  
        byte[] buf = new byte[1024];  
        int len = 0;  
        while ((len = eis.read(buf)) != -1) {  
            System.out.println(new String(buf, 0, len));  
        }  
        eis.close();  

        InputStream is = process.getInputStream();  

        buf = new byte[1024];  
        while ((len = is.read(buf)) != -1) {  
            System.out.println(new String(buf, 0, len));  
        }  
        is.close();  

//      File file = new File(WebPageFullPicture.class.getResource("/").getPath(),fileName);  
//      if(file.exists()){  
//          file.renameTo(new File(saveDir,fileName));  
//      }  
          
    } catch (IOException e) {  
        // TODO Auto-generated catch block  
        e.printStackTrace();  
    }  

}  
%>