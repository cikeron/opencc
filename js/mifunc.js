
window.onbeforeunload = function(){
  return 'Seguro que quieres SALIR?';
};
//***************DETECTAR NAVEGADOR*******************
// Internet Explorer
var ie  = document.all != null;  //ie4 and above
var ie5 = document.getElementById && document.all;
var ie6 = document.getElementById && document.all&&(navigator.appVersion.indexOf("MSIE 6.")>=0);

// Netscape
var ns4 = document.layers != null;
var ns6 = document.getElementById && !document.all;
var ns  = ns4 || ns6;

// Firefox
var ff  = !document.layers && !document.all;

// Opera
var op  = navigator.userAgent.indexOf("opera")>0;
var op7 = op && operaVersion() <= 7;
var op8 = op && operaVersion() >= 8;

// Detects the Opera version
function operaVersion() {
	agent = navigator.userAgent;
	idx = agent.indexOf("opera");	
	if (idx>-1) {
		return parseInt(agent.subString(idx+6,idx+7));
	}
}

//********** DETECTAR SISTEMA OPERATIVO
function detectSO(){
	//var resultado;
	var system = navigator.appVersion;
	if (navigator.appVersion.indexOf("Mac") != -1 ) OS = "Mac";
	else if (navigator.appVersion.indexOf("PowerPC") != -1 ) OS = "Mac";
	else if (navigator.appVersion.indexOf("Win") != -1 ) OS = "Win";
	else if (navigator.appVersion.indexOf("SunOS") != -1 ) OS = "Solaris";
	else  OS = "Linux";

	//Determine Browser Version
	bName = navigator.appName;
	bVer  = parseInt(navigator.appVersion);

	if (OS == "Mac" && bName=="Netscape") { 
	  // your code here
	}
	else if (OS =="Mac" && bName=="Microsoft Internet Explorer") { 
	  // your code here
	}
	else if (OS =="Win" || OS == "Linux" && bName == "Netscape") {
	  resultado= 'Windows-Linux Desktop Device';
	}
	else if (OS =="Solaris" && bName=="Netscape") {
	  // your code here
	}
	else if (OS =="Win" || OS == "Linux" && bName=="Microsoft Internet Explorer") {
	  resultado = 'Windows-Linux Desktop Device';
	}
	return resultado;
}

//******* DETECTAR SI ES MOVIL Y CUAL ***************
function ismobile(){
	//var resultado;
	var isMobile = {
	  Android: function() {
	    return navigator.userAgent.match(/Android/i);
	  },
	  BlackBerry: function() {
	    return navigator.userAgent.match(/BlackBerry/i);
	  },
	  iOS: function() {
	    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	  },
	  Opera: function() {
	    return navigator.userAgent.match(/Opera Mini/i);
	  },
	  Windows: function() {
	    return navigator.userAgent.match(/IEMobile/i);
	  },
	  any: function() {
	    return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
	  }
	};

	// Examples
	if( isMobile.any() ) resultado='Mobile';
	if( isMobile.iOS() ) resultado='iOS Device';	
	if( isMobile.Android() ) resultado='Android Device';	
	return resultado;
}
//******
//***Popup Window
function popw(txt,tit) {
	window.open(txt,tit);
}

//Detectar cuando se cierra el navegador
function checkCerrar() {
  // triggers on clicking the close button, Alt+F4 , File->Close  
  if(window.event.clientX < 0 && window.event.clientY < 0) {
    window.open("somefile.html", "closewindow",'left=12000,top=1200,width=120,height=50');
  }
}

//********** PARAMETROS URL **************
function getUrlParam(name) {
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
    return (results && results[1]) || undefined;
}

//******************CAMBIAR CSS***************
var defaultCSS = document.getElementById('bootstrap-css');
function changeCSS(css){
            if(css) $('head > link').filter(':first').replaceWith('<link rel="stylesheet" href="'+ css +'" type="text/css" />'); 
            else $('head > link').filter(':first').replaceWith(defaultCSS); 
}
/**
Funcion para mostrar ocultar un elemento Ejm: un div con el id bloq
!! Poner en el css: ¡¡¡
.mioculto {
  display: none;
/*  visibility: hidden;*/
/*}
**/
function showhide(bloq) {
  var obj = document.getElementById(bloq);
  obj.style.display = (obj.style.display=='none') ? 'block' : 'none';
}        

function solomostrar(bloq){
document.getElementById(bloq).style.display = 'block';}
function soloocultar(bloq){
document.getElementById(bloq).style.display = 'none';}

/* TERMINAL EMULATOR*/
if (mlat==null){ var greeting="Sistema GPS no habilitado o no accesible.<br> Cargando datos almacenados..."
} else {
var greeting = "GPS detectado.<br> Latitud:"+mlat+" - Longitud:"+mlong; 
}
    cursor = "<span>&nbsp</span>",
    cmd = $('#cmd');

function type(el,text,pos,no){
    ctext = text.substring(0,pos)+(pos%2?cursor:cursor);
    $(el).html(ctext);
    if(pos==text.length){
        $(el).html(text+cursor);
    }else{
        window.setTimeout('type("'+el+'","'+text+'",'+(pos+1)+','+1+');',40);
    }
}

