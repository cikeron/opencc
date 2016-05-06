    /**
     * Funcion sparqlQueryJson basada en el codigo del Author: Mark Wallace
     * This function asynchronously issues a SPARQL query to a
     * SPARQL endpoint, and invokes the callback function with the JSON 
     * Format [1] results.
     * Refs:
     * [1] http://www.w3.org/TR/sparql11-results-json/
     * Todo lo demás son las funciones para manejar el json devuelto por opendata.caceres.es
     * Realizado por Cikeron 2015 con licencia GPL v.2.0
     */

//Variable que contiene la URL donde se encuentra el servidor opendata a consultar.
var endpoint = "http://opendata.caceres.es/sparql";

    function sparqlQueryJson(queryStr, endpoint, callback, isDebug, informacion_de) {
      var querypart = "query=" + escape(queryStr);
    
      // Get our HTTP request object.
      var xmlhttp = null;
      if(window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
     } else if(window.ActiveXObject) {
       // Code for older versions of IE, like IE6 and before.
       xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
     } else {
       alert('Perhaps your browser does not support XMLHttpRequests?');
     }
    
     // Set up a POST with JSON result format.
     xmlhttp.open('POST', endpoint, true); // GET can have caching probs, so POST
     xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
     xmlhttp.setRequestHeader("Accept", "application/sparql-results+json");
    
     // Set up callback to get the response asynchronously.
     xmlhttp.onreadystatechange = function() {
       if(xmlhttp.readyState == 4) {
         if(xmlhttp.status == 200) {
           // Do something with the results
           if(isDebug) alert(xmlhttp.responseText);
           callback(xmlhttp.responseText,informacion_de);
         } else {
           // Some kind of error occurred.
           alert("Sparql query error: " + xmlhttp.status + " "
               + xmlhttp.responseText);
         }
       }
     };
     // Send the query to the endpoint.
     xmlhttp.send(querypart);
    
     // Done; now just wait for the callback to be called.
    };

var resultados=new Array([]);//La idea es crear aqui un array manejable de resultados.

//** Funcion para manejar y extraer los datos Json resultado de una consulta sparQL.
/** Se le pasan como parametros str, que es el JSON y el tipo de recurso que se esta mostrando
  Devuelve solamente los que estan dentro de una distancia dada.**/
function extractJsonCercanos(str,informacion_de) {
        ini_milayer(informacion_de);
        var html ='<table class="table-striped table-condensed mitable" id="tabladatos">';
        var json= eval('(' + str + ')');
        //Variables usadas para crear enlaces segun se necesiten.
         var enlaceUri;
/*         
        for(var b = 0; b< 1; b++) {
            html += "<thead><tr>";
            var objeto=json.results.bindings[b];
            for (var propiedad in objeto) { 
              if (propiedad=="miURI") enlaceUri=propiedad.value;
              else if (propiedad=="Nombre")
                html+="<th>"+propiedad+"</th>";
            }
            html+="<th>Detalles</th></tr></thead>";
        }
*/
        html+="<tbody>";
        for(var b = 0; b<  json.results.bindings.length; b++) {
            html += "<tr>";
            var objeto=json.results.bindings[b];
            for (var propiedad in objeto) { 
                if (propiedad=="miURI") {enlaceUri=objeto[propiedad].value;}
                else {
                if (propiedad=="Nombre") {
                      html+="<td style='word-break:break-all;'><div class='materialCard success'><header><h2><a href='"+enlaceUri+"'>" + objeto[propiedad].value + "</a></h2></header><div class='cont'>";//</td><td>";
                      resultados[b]=[];
                      resultados[b][0]=objeto[propiedad].value;
                    }
                //console.log(propiedad+ " =T-  "+ objeto[propiedad].type+" --> "+objeto[propiedad].value);
                else if (objeto[propiedad].type == "uri")
                    html += "<b>"+propiedad+":</b> <a href='"+objeto[propiedad].value+"'>" + objeto[propiedad].value + "</a></br>";
                else if (propiedad == "geo_lat") {
                      resultados[b][1]=objeto[propiedad].value;
                      html +=  "<b>"+propiedad+":</b> "+objeto[propiedad].value + "</br>";
//DEBUG                      console.log("R: "+resultados[b][1]+" - O: "+objeto[propiedad].value);
                }
                else if (propiedad == "geo_long") {
                      resultados[b][2]=objeto[propiedad].value;
                      html +=  "<b>"+propiedad+":</b> "+objeto[propiedad].value +
                  "<div class='midivhr'><a href='#' onclick='trazaunaruta(mlat,mlong,"+resultados[b][1]+","+resultados[b][2]+",false);'><i class='fa fa-location-arrow'></i> Como ir?</a></div>";
                }
                else
                    html +=  "<b>"+propiedad+":</b> "+objeto[propiedad].value+"<br>";
                }
            }
            html += "</div></div></td></tr>";
//DEBUG            console.log("----"+objeto["Nombre"].value);
            //Si el objeto esta dentro del rango que queremos (De momento 0.5 Km) Añade un marcador.
            if (estaProximo(mlat,mlong,json.results.bindings[b].geo_lat.value,json.results.bindings[b].geo_long.value,0.5)) {
            var infoobjeto=arraytipoInfo[informacion_de-1][1]+'<br>'+objeto["Nombre"].value+'<div><h4><span><a target="blank" href="'+enlaceUri+'">Opendata</a></span> ';//- <span><a href="#">Indefinido</a></span></h4></div>';
            addMarker(json.results.bindings[b].geo_long.value,json.results.bindings[b].geo_lat.value,infoobjeto,informacion_de); 
            }//IF
        }//FOR
        addmiLayer(arraytipoInfo[informacion_de-1][1]);
        html += "</tbody></table>";
        document.getElementById("results").innerHTML = html;
        //return html; //Mas adelante para hacer toda esta libreria como un objeto.
    }
//** Funcion para manejar y extraer los datos Json resultado de una consulta sparQL.
/** Se le pasan como parametros str, que es el JSON y el tipo de recurso que se esta mostrando**/
function extractJson2(str,informacion_de) {
        ini_milayer(informacion_de);
        var html ='<table class="table-striped table-condensed mitable" id="tabladatos">';
        var json= eval('(' + str + ')');
        //Variables usadas para crear enlaces segun se necesiten.
        var enlaceUri;
/*
        for(var b = 0; b< 1; b++) {
            html += "<thead><tr>";
            //var x;
            var objeto=json.results.bindings[b];
            for (var propiedad in objeto) { 
              if (propiedad=="miURI") enlaceUri=propiedad.value;
              else if (propiedad=="Nombre")
                html+="<th>"+propiedad+"</th>";
            }
            html+="<th>Detalles</th></tr></thead>";
        }
*/
        html+="<tbody>";
        for(var b = 0; b<  json.results.bindings.length; b++) {
//            html += '<tr><td><i class="fa fa-location-arrow"></i></td>';
            //var x;
            html+='<tr>';
            var objeto=json.results.bindings[b];
            for (var propiedad in objeto) { 
                //var valor = json.results.bindings[b][json.head.vars[x]];
                if (propiedad=="miURI") {enlaceUri=objeto[propiedad].value;}
                else {
                if (propiedad=="Nombre") {
//                      html+='<td style="word-break:break-all;"><div class="panel panel-default"><div class="panel-body panel-body-mio"><div class="midivpancab"><b><a href="'+enlaceUri+'">' + objeto[propiedad].value + '</a></b></div><i class="fa fa-location-arrow"></i><hr class="mihr">';//</td><td>';
                      html+="<td style='word-break:break-all;''><div class='materialCard success'><header><h2><a href='"+enlaceUri+"'>" + objeto[propiedad].value + "</a></h2></header><div class='cont'>";
                      resultados[b]=[];
                      resultados[b][0]=objeto[propiedad].value;
                    }
                //console.log(propiedad+ " =T-  "+ objeto[propiedad].type+" --> "+objeto[propiedad].value);
                else if (objeto[propiedad].type == "uri")
                    html += "<b>"+propiedad+":</b> <a href='"+objeto[propiedad].value+"'>" + objeto[propiedad].value + "</a></br>";
                else if (propiedad == "geo_lat") {
                      resultados[b][1]=objeto[propiedad].value;
                      html +=  "<b>"+propiedad+":</b> "+objeto[propiedad].value + "</br>";
//                      console.log("R: "+resultados[b][1]+" - O: "+objeto[propiedad].value);
                }
                else if (propiedad == "geo_long") {
                      resultados[b][2]=objeto[propiedad].value;
                      html +=  "<b>"+propiedad+":</b> "+objeto[propiedad].value + "<div class='midivhr'><a href='#' onclick='trazaunaruta(mlat,mlong,"+resultados[b][1]+","+resultados[b][2]+",false);'><i class='fa fa-location-arrow'></i> Cómo llegar?</a></div>";
                }
                else
                    html +=  "<b>"+propiedad+":</b> "+objeto[propiedad].value + "</br>";
                }
            }
            html += "</div></div></td></tr>";
            //console.log("----"+objeto["Nombre"].value);
            var infoobjeto='<h4>'+arraytipoInfo[informacion_de-1][1]+'</h4>'+objeto["Nombre"].value+'<hr><div><span><a target="blank" href="'+enlaceUri+'">Opendata</a></span> - <span><a href="#" onclick="trazaunaruta(mlat,mlong,'+resultados[b][1]+','+resultados[b][2]+',false);">Llévame...</a></span></div>';
            addMarker(json.results.bindings[b].geo_long.value,json.results.bindings[b].geo_lat.value,infoobjeto,informacion_de); 
        } //FOR
//        console.log(arraytipoInfo[informacion_de-1][1]+" - - - - ");
        addmiLayer(arraytipoInfo[informacion_de-1][1]);
        html += "</tbody></table>";
        document.getElementById("results").innerHTML = html;
        //return html;
    }
function extractJson1(str,informacion_de) {
        //var resultado;//La idea es crear aqui un array manejable de resultados.
        var html = "<div id='no-more-tables'><table class='table-striped table-condensed'>";
        var json= eval('(' + str + ')');
        html+="<thead><tr>";
        for(var b = 0; b< 1; b++) {
            var objeto=json.results.bindings[b];
            for (var propiedad in objeto) { 
                html+="<th>"+propiedad+"</th>";
            }
            html+="";
        }
        html+="</tr></thead><tbody>";
        for(var b = 0; b<  json.results.bindings.length; b++) {
            html += "<tr>";
            var x;
            var objeto=json.results.bindings[b];
            for (var propiedad in objeto) { 
                //var valor = json.results.bindings[b][json.head.vars[x]];
                //console.log(propiedad+ " =v-  "+ objeto[propiedad].type);
                if (objeto[propiedad].type == "uri")
                    html += "<td data-title='"+propiedad+"'><a href='"+objeto[propiedad].value+"'>" + objeto[propiedad].value + "</a></td>";
                else
                    html += "<td data-title='"+propiedad+"'>" + objeto[propiedad].value + "</td>";
            }
            html += "</tr>";
            //console.log("----"+objeto["Nombre"].value);
            addMarker(json.results.bindings[b].geo_long.value,json.results.bindings[b].geo_lat.value,objeto["Nombre"].value,informacion_de); 

        }
        html += "</tbody></table></div>";
        document.getElementById("results").innerHTML = html;
        //return html;
    }    

function exesparQR(consulta,tipo,paradebug,informacion_de) {
      if (tipo==0){
       // Make the query.
       sparqlQueryJson(consulta, endpoint, extractJson1, paradebug, informacion_de);
       return 0;
      }
      if (tipo==1) {
       sparqlQueryJson(consulta, endpoint, extractJson2, paradebug, informacion_de);
       return 0;
      }
      if (tipo==2) {
       sparqlQueryJson(consulta, endpoint, extractJsonCercanos, paradebug, informacion_de);
      }
}
