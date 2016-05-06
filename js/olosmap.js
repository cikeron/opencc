//VARIABLES GLOBALES PARA SABER LA POSICION GPS
      var mlat=null;
      var mlong=null;

/***********************************************************
******* FUNCIONES PARA EL MANEJO DE LAS PETICIONES DE GEOPOSICIONAMIENTO Y ERRORES****
********************************************/
function req_localS_pos() {
    if(typeof(Storage) !== "undefined") {
        mlat=localStorage.getItem("openccLat");
        mlong=localStorage.getItem("openccLong");
        if (!mlat) {
          mlat=39.471614;
          mlong=-6.377033;           
        }
        //alert("Existe un problema con la geolocalización. Comprueba si esta activado el GPS. Recuperando la última posición conocida: Lat="+mlat+" Long="+mlong);
    } else {
        alert("LocalStorage no soportado!. Algunas funciones puede que no funcionen correctamente.");
    }    
}
function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            //alert("Petición de Geolocalización denegada.");
            console.log("Petición de Geolocalización denegada.");
            req_localS_pos();
            break;
        case error.POSITION_UNAVAILABLE:
            //alert("Información de localización no disponible.");
            console.log("Información de localización no disponible.");
            req_localS_pos();
            break;
        case error.TIMEOUT:
            //alert("Tiempo de espera de localización agotado.");
            console.log("Tiempo de espera de localización agotado.");
            req_localS_pos();
            break;
        case error.UNKNOWN_ERROR:
            //alert("Error desconocido al pedir la geolocalización.");
            console.log("Error desconocido al pedir la geolocalización.");
            req_localS_pos();
            break;
    }
}
function compruebaGPS() {
  if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
          if (position.coords.longitude=="undefined") alert("KKKKKKKKKKK");
          //console.log('Tu Latitud-Longitud es: ' + position.coords.latitude + ' / ' + position.coords.longitude);
          mlong=position.coords.longitude; mlat=position.coords.latitude;
          if(typeof(Storage) !== "undefined") {
              localStorage.setItem("openccLat", mlat);
              localStorage.setItem("openccLong", mlong);
              //console.log("LOCAL "+localStorage.getItem("openccLat"));
          } else {
              alert("LocalStorage no soportado!. Algunas funciones puede que no funcionen correctamente.");
          } 

      },showError);
  } else {
    alert("El Navegador no soporat servicios de geolocalización. Consulta la ayuda para mas información.");
  }  
}
function rastreaPosicion(idlat,idlong) {
navigator.geolocation.watchPosition(function(position) {
  document.getElementById(idlat).innerHTML = "Lat: "+position.coords.latitude+" - Guardada:"+localStorage.getItem("openccLat");
  document.getElementById(idlong).innerHTML = "Long: "+position.coords.longitude+" - Guardada:"+localStorage.getItem("openccLong");
})  
}

//*************** Variables globales de MAPAS (Leaflet y OSM) *******************
//OSM Puro
var map2;
//var ajaxRequest;
//var plotlist;
//var plotlayers=[];
var osmUrl='http://{s}.tile.osm.org/{z}/{x}/{y}.png';
var osmAttrib='Map data © <a href="http://osm.org">OpenStreetMap</a> contributors';
var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 19, attribution: osmAttrib});   
var baseMaps = {
    "Mapa": osm,
  };
var miposicion= false;//new L.LayerGroup();
var DATAs = {};//false;//new L.LayerGroup();
var overlayMaps = {
//  "YO":miposicion,
//  "DATOS": DATAs
};
var ctrllayer;//=L.control.layers(baseMaps, overlayMaps).addTo(map2); 

var LeafIcon = L.Icon.extend({
    options: {
//        shadowUrl: '../img/locate2.png',
        iconSize:     [48, 48],
//        shadowSize:   [30, 30],
        iconAnchor:   [22, 24],
//        shadowAnchor: [4, 32],
        popupAnchor:  [-3, -36]
    }
});
var rutacontrol=null;
var yoicono = new LeafIcon({iconUrl: 'img/locate2.png'});
//var unlayer=null;
/***
*********** FUNCIONES PARA EL MANEJO DEL MAPA, USANDO OPENSTREETMAP y OPENLAYERS*************
**/        
  function initMap(lat,longi) {
      /*  map2 = new L.Map('map2');
      // create the tile layer with correct attribution
        var osmUrl='http://{s}.tile.osm.org/{z}/{x}/{y}.png';
        var osmAttrib='Map data © <a href="http://osm.org">OpenStreetMap</a> contributors';
        var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 18, attribution: osmAttrib});   

        // start the map in Caceres, EX, Spain
        map2.setView(new L.LatLng(39.471614, -6.377033),14);
        map2.addLayer(osm);
      */
      //map2 = L.map('map2').setView([39.471614, -6.377033], 14);
      map2 = L.map('map2', {
        center: [lat, longi],
        zoom: 14,
        layers: [osm]
      });
    ctrllayer=L.control.layers(baseMaps, overlayMaps).addTo(map2); 
    //map2.addLayer(miposicion);
    //var sidebar = L.control.sidebar('sidebar').addTo(map2);

    }
  function mostrarinfoGPSsimple(mlat,mlong,idhtml) {
        var cuerpohtm="<hr><div id='actlat'>Lat: "+mlat+" - Guardada:"+localStorage.getItem("openccLat")+"</div>"+
        "<div id='actlong'>Long: "+mlong+" - Guardada:"+localStorage.getItem("openccLong")+"</div><hr>";
        var piehtm='<div align="center"><a class="btn btn-success" href="#" onclick="centrarenmapa(mlat,mlong,false,null)" data-dismiss="modal"><i class="fa fa-user fa-2x"></i> Ver en MAPA</a> '+
        '<a class="btn btn-info" href="#" onclick="trazaunaruta(mlat,mlong,0,0,true)" data-dismiss="modal"><i class="fa fa-user fa-2x"></i>Ruta al mas cercano</a></div>';
        document.getElementById(idhtml).innerHTML =cuerpohtm;//+"<hr>"+piehtm;
        //rellenainfomodal('Posicionamiento',cuerpohtm,piehtm);
        return cuerpohtm;
  }
  function mostrarinfoGPS(mlat,mlong,mostrarinfo,idhtml) {
    if (mostrarinfo==true) {
        var cuerpohtm="<p>La función de GPS o geolocalización, depende su buen funcionamiento,"+
        " de si esta activado el GPS en el terminal móvil y si se permite el acceso a esta información. "+
        "Normalmente tarda un poco desde que se carga esta webapp, hasta que se detecta la posición. "+
        "Se ha comprobado que en el navegador Firefox tarda algo mas en posicionar.</p>"+
        "<hr><div id='actlat'>Lat: "+mlat+" -Ant.:"+localStorage.getItem("openccLat")+"</div>"+
        "<div id='actlong'>Long: "+mlong+" -Ant.:"+localStorage.getItem("openccLong")+"</div>";
        var piehtm='<div align="center"><a class="btn btn-success" href="#" onclick="centrarenmapa(mlat,mlong,false,null)" data-dismiss="modal"><i class="fa fa-user fa-2x"></i> Ver en MAPA</a> '+
        '<a class="btn btn-info" href="#" onclick="trazaunaruta(mlat,mlong,0,0,true)" data-dismiss="modal"><i class="fa fa-user fa-2x"></i>Ruta al mas cercano</a></div>';
        document.getElementById(idhtml).innerHTML =cuerpohtm+"<hr>"+piehtm;
        //rellenainfomodal('Posicionamiento',cuerpohtm,piehtm);
        //return cuerpohtm+"<hr>"+piehtm;
    }    
  }
  function centrarenmapa(mlat,mlong,mostrarinfo,idhtml) {
    if (!map2.hasLayer(miposicion)){
    if(miposicion===false) {
      miposicion=L.layerGroup()
        .addLayer(L.marker([mlat, mlong], {icon: yoicono}).bindPopup("YO")).addTo(map2);
//      .addLayer(L.marker([39.471614, -6.377033], {icon: yoicono}).bindPopup("YO")).addTo(map2);
      //L.marker([39.471614, -6.377033]).bindPopup("YO").addTo(miposicion);
    }
    ctrllayer.addOverlay(miposicion,"YO");
    map2.panTo(new L.LatLng(mlat, mlong));
    }//IF hasLAyer
     if (mostrarinfo==true) {
        var cuerpohtm="<p>La función de GPS o geolocalización, depende su buen funcionamiento,"+
        " de si esta activado el GPS en el terminal móvil y si se permite el acceso a esta información. "+
        "Normalmente tarda un poco desde que se carga esta webapp, hasta que se detecta la posición. "+
        "Se ha comprobado que en el navegador Firefox tarda algo mas en posicionar.</p><hr>"+
        "<div id='actlat'>Latitud: "+mlat+" - Guardada:"+localStorage.getItem("openccLat")+"</div>"+
        "<div id='actlong'>Longitud: "+mlong+" - Guardada:"+localStorage.getItem("openccLong")+"</div>";
        var piehtm='                    <button type="button" class="btn btn-default" data-toggle="tab" href="#sectMapa" onclick="centrarenmapa(mlat,mlong)" data-dismiss="modal">Ver en MAPA</button>';
        rellenainfomodal('Posicionamiento',cuerpohtm,piehtm);
    }
  }
function trazaunaruta(mmlat,mmlong,destlat,destlong,cerca) {
if (cerca==true) {
        var poscercano=[];
        poscercano=calculacercanos(mlat,mlong);
        destlat=poscercano[0];
        destlong=poscercano[1];
}
//console.log("calculando ruta...");
console.log(mlat+" - "+mlong+" - "+destlat+" - "+destlong);  
  rutacontrol=L.Routing.control({
    waypoints: [
        L.latLng(mmlat, mmlong),
        L.latLng(destlat,destlong)
    ],
    routeWhileDragging: true
}).addTo(map2); 
rutacontrol.hide();
}
  //Centra en el mapa y lo marca algun tipo requerido.
  function centrarinfoenmapa(mlat,mlong,mostrarinfo,idhtml) {
    if (mostrarinfo==true) {
        var cuerpohtm="<p>La función de GPS o geolocalización, depende su buen funcionamiento,"+
        " de si esta activado el GPS en el terminal móvil y si se permite el acceso a esta información. "+
        "Normalmente tarda un poco desde que se carga esta webapp, hasta que se detecta la posición. "+
        "Se ha comprobado que en el navegador Firefox tarda algo mas en posicionar.</p><hr>"+
        "<div id='actlat'>Latitud Actual: "+mlat+" </div>"+
        "<div id='actlong'>Longitud Actual: "+mlong+" </div>";
        var piehtm='                    <button type="button" class="btn btn-default" data-toggle="tab" href="#sectMapa" onclick="centrarenmapa(mlat,mlong)" data-dismiss="modal">Ver en MAPA</button>';
        rellenainfomodal('Posicionamiento',cuerpohtm,piehtm);
    }
  }

var lyid=0; //Para controlar los LayerGroup e identificarlos.

function ini_milayer(informacion_de) {
    DATAs[lyid]=new L.LayerGroup();
    DATAs[lyid].nombre=informacion_de;
}
  // Funcion para aÃ±adir un marcador y su creador de popup asociado
  function addMarker(lng, lat, info,informacion_de) {

    if(DATAs[lyid]===undefined){
      L.marker([lat, lng]).addTo(DATAs[lyid]);
    }else{
      L.marker([lat, lng]).bindPopup(info).addTo(DATAs[lyid]);
    }//ELSE
  }
  function addmiLayer(titulo) {
    map2.addLayer(DATAs[lyid]);
    ctrllayer.addOverlay(DATAs[lyid],titulo);
    lyid++;
/*  Si tubiera que recorrer el array de capas creadas.
    for (i in DATAs){
      DATAs[i].name=titulo;
      //Aqui otro por para recorrer todos los elementos de la capa con "var todoslayers=DATAs.getLayers();"
      console.log(DATAs[i].name);
    }
*/
  }
//Funcion por si se necesitase destruir o borrar una capa o layer del array DATAs
  function remove_milayer(id,informacion_de){
    ctrllayer.removeLayer(DATAs[id]);
    map2.removeLayer(DATAs[id]);
  }
  
function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
//  console.log("nnnnn: "+parseFloat(d));
  return d;
}
function deg2rad(deg) {
  return deg * (Math.PI/180)
}
function calculacercanos(milat,milong) {
      var htmopciones="";
      var numdato=0;
      var anterior=1000;
      var actual=0;
      for (i=0;i<resultados.length;i++){ 
//        console.log(parseFloat(milat)+" - "+parseFloat(milong)+" - "+parseFloat(resultados[i][1])+" - "+parseFloat(resultados[i][2]));
          actual=getDistanceFromLatLonInKm(milat,milong,resultados[i][1],resultados[i][2]);
          //console.log("Actual: "+actual);
          if (actual<anterior){
            anterior=actual;
            htmopciones=resultados[i][0];
            numdato=i;
          }

      }   
//console.log("Mas cercano: "+htmopciones);
var poscercanos=[];
poscercanos[0]=resultados[numdato][1];
poscercanos[1]=resultados[numdato][2];
return poscercanos;
//return htmopciones;
}
/**
  Funcion que calcula si un objeto esta proximo determinado por la distancia dada.
  Devuelve true o false dependiendo de si esta dentro de la distancia dada.
**/
function estaProximo(milat,milong,objlat,objlong,distancia) {
  var actual=0;
  actual=getDistanceFromLatLonInKm(milat,milong,objlat,objlong);
  if (actual<=distancia) {
    return true;
  } else return false;
}

/** 
  Funcion pensada para mostrar solamente los proximos. NO SE USA
**/
function mostrarProximos(milat,milong) {
calculaProximos(milat,milong,0.5)
}
function calculaProximos(milat,milong,distancia) {
      var htmopciones="";
      var numdato=0;
      var anterior=1000;
      var actual=0;
      for (i=0;i<resultados.length;i++){ 
          actual=getDistanceFromLatLonInKm(milat,milong,resultados[i][1],resultados[i][2]);
//          console.log("Actual: "+actual);
          if (actual<distancia){
            htmopciones=resultados[i][0];
            numdato=i;
            //console.log(htmopciones+" - Dist:"+actual);
          }

      }   
alert("Mas cercano: "+htmopciones);
centrarinfoenmapa(resultados[numdato][1],resultados[numdato][2],false,"");
//return htmopciones;
}
