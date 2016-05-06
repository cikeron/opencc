/*
ARRAY Multidimensional con la informacion de las diferentes busquedas configuradas. Consta de las siguientes partes:

indice - decimal
consulta - Con la sentencia SparQL que se lanza al servidor OpenData de CC
tipo - Tipo de presentacion de informacion en una tabla solo hay 0 y 1 y se usa 1 en todos. Previsible madificaciones en un futuro.
Debug - boolean para mostrar informacion de depuracion.
nombre icono - nombre del icono a mostrar por tipo, que ha de estar en la carpeta img y tener un tamaño de 128x128. NO SE USA SE UTILIZA EL INDICE de modo que ha de existir una imagen marcador para cada tipo de informacion construyendose "locate_"+indice+".png"!!!!
*/

var arraytipoInfo = [
	[1,"Monumentos","select ?miURI ?Nombre ?EnlaceSIG ?Web ?Turismo ?geo_lat ?geo_long ?sameAs"+
		 " where{"+
		 " ?miURI a om:Monumento."+
		 " OPTIONAL {?miURI rdfs:label ?Nombre.}."+
		 " OPTIONAL {?miURI om:tieneEnlaceSIG ?EnlaceSIG.}."+
		 " OPTIONAL {?miURI schema:url ?Web.}."+
		 " OPTIONAL {?miURI om:tieneEnlaceTurismo ?Turismo.}."+
		 " OPTIONAL {?miURI geo:lat ?geo_lat.}."+
		 " OPTIONAL {?miURI geo:long ?geo_long.}."+
		 " OPTIONAL {?miURI owl:sameAs ?sameAs.}.}",1,false,"locate_infocolor.png"],
	[2,"Farmacias","select ?miURI ?Nombre ?EnlaceSIG ?geo_lat ?geo_long"+
		" where{"+
		" ?miURI a schema:Pharmacy."+
		" ?miURI schema:name ?Nombre."+
		" ?miURI schema:description ?EnlaceSIG."+
		" OPTIONAL {?miURI geo:lat ?geo_lat.}."+
		" OPTIONAL {?miURI geo:long ?geo_long.}.}",1,false,"locate_farmacolor.png"],
	[3,"Restaurantes","select ?miURI ?Nombre ?Direccion ?Telefono ?Email ?Web ?Categoria ?Tenedores ?Capacidad_Personas ?geo_lat ?geo_long"+
		" where{"+
		" ?miURI a om:Restaurante."+
		" OPTIONAL { ?miURI rdfs:label ?Nombre.}"+
		" ?miURI schema:address ?schema_address."+
		" OPTIONAL { ?schema_address schema:streetAddress ?Direccion.}"+
		" OPTIONAL { ?miURI schema:telephone ?Telefono.}"+
		" OPTIONAL { ?miURI schema:email ?Email.}"+
		" OPTIONAL { ?miURI schema:url ?Web.}"+
		" OPTIONAL { ?miURI om:categoriaRestaurante ?Categoria.}"+
		" OPTIONAL { ?miURI om:tenedores ?Tenedores.}"+
		" OPTIONAL { ?miURI om:capacidadPersonas ?Capacidad_Personas.}"+
		" OPTIONAL { ?miURI geo:lat ?geo_lat.}"+
		" OPTIONAL { ?miURI geo:long ?geo_long.}}",1,false,"locate_infocolor.png"],
	[4,"Taxis","Select ?miURI ?Nombre ?Telefono ?EnlaceSIG ?geo_lat ?geo_long"+
		" Where{"+
		" ?miURI a om:ParadaTaxi."+
		" ?miURI om:situadoEnVia ?Nombre."+
		" ?miURI schema:telephone ?Telefono."+
		" ?miURI geo:lat ?geo_lat."+
		" ?miURI geo:long ?geo_long."+
		" ?miURI schema:url ?EnlaceSIG. }",1,false,"locate_farmacolor.png"],
	[5,"Gasolineras","select ?miURI ?Nombre ?situada_en ?enlaceSIG ?geo_long ?geo_lat"+
		" where{"+
		" ?miURI a schema:GasStation."+
		" ?miURI rdfs:label ?Nombre."+
		" ?miURI om:situadoEnVia ?situada_en."+
		" OPTIONAL {?miURI om:tieneEnlaceSIG ?enlaceSIG. }"+
		" ?miURI geo:long ?geo_long."+
		" ?miURI geo:lat ?geo_lat.}",1,false,"locate_farmacolor.png"],
	[6,"Museos","select ?miURI ?Nombre ?Tipo ?Situado_EnVia ?Descripcion ?WebSIG ?Web ?geo_lat ?geo_long"+
		" where{"+
		" ?miURI a schema:Museum."+
		" ?miURI a ?Tipo."+
		" ?miURI om:situadoEnVia ?Situado_EnVia."+
		" OPTIONAL { ?miURI schema:description ?Descripcion. }."+
		" OPTIONAL { ?miURI om:tieneEnlaceSIG ?WebSig. }."+
		" OPTIONAL { ?miURI rdfs:label ?Nombre. }."+
		" OPTIONAL { ?miURI geo:lat ?geo_lat. }."+
		" OPTIONAL { ?miURI geo:long ?geo_long. }."+
		" OPTIONAL { ?miURI schema:url ?Web.}.}",1,false,"locate_museo.png"],
	[7,"C.Religiosos","select ?miURI ?Nombre ?EnlaceSIG ?Web ?Turismo ?geo_lat ?geo_long where{"+
" ?miURI a om:CentroReligioso."+
" OPTIONAL {?miURI rdfs:label ?Nombre.}."+
" OPTIONAL {?miURI om:tieneEnlaceSIG ?EnlaceSIG.}."+
" OPTIONAL {?miURI schema:url ?Web.}."+
" OPTIONAL {?miURI om:tieneEnlaceTurismo ?Turismo.}."+
" OPTIONAL {?miURI geo:lat ?geo_lat.}."+
" OPTIONAL {?miURI geo:long ?geo_long.}.}",1,false,"locate_relig.png"]
];