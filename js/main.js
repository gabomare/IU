 //Variables Globales
_nodosArbol=""; //variable tipo string con los nodos agregados por el usuario
idsNodos=[];  //Variable usada para extraer los nodos enviados desde el api REST
nodesArray = []; //Variable de nodos para el árbol gráfico
edgesArray = []; //Variable de relaciones para el árbol gráfico
arbolJSON = {}; //Objeto con los nodos a ser envíados al api REST
arbolCreado=false;
urlApi="http://localhost:58189/";

//--------------------------------------------

function agregarNodo(){
   try{
      if(arbolCreado){
         arbolCreado=false;
         idsNodos=[];
         _nodosArbol="";
         crearArbolGrafico();
      }
      var valorNodo=document.getElementById("nodo").value;
      $("#mensajes_usuario").css("color","black");
      $("#mensajes_usuario").html("");

      if(valorNodo==""){
         $("#mensajes_usuario").css("color","red");
         $("#mensajes_usuario").html("Por favor, especifique un valor para el nodo");
         return 0;
      }
      nodes.add({id: valorNodo, label: valorNodo});
      _nodosArbol+=_nodosArbol==""?valorNodo: ","+valorNodo;

      document.getElementById("nodo").value="";
      document.getElementById("nodo").focus();
   }catch(er){
      alert(er);
   }
}
function crearArbol(){
   try{
      arbolCreado=false;
      $("#mensajes_usuario").css("color","black");
      $("#mensajes_usuario").html("");
      if(_nodosArbol==""){
         $("#mensajes_usuario").css("color","red");
         $("#mensajes_usuario").html("No se puede crear el árbol binario porque no se han encontrado nodos creados.");
         return 0;
      }
      arbolJSON={'nodos':_nodosArbol};
      request({ method: 'POST', dataType: 'json', url: urlApi + "arbol", data: arbolJSON },
         function (data) {
            var arbol=data.data;
            obtenerNodos(arbol,0);
            arbolCreado=true;
         },
         function (status, ok, otro) {
         }
      );
   }catch(er){
      alert(er);
   }
}
function obtenerNodos(nodo,nivel){//Recorrido en pre-orden
   try {
      if(nodo!==null){
         if(!idsNodos[nodo.valorNodo]){
            idsNodos[nodo.valorNodo]=true;
            if(nodo.nodoIzquierdo!==null){
               edges.add({from: nodo.valorNodo, to: nodo.nodoIzquierdo.valorNodo});
            }
            if(nodo.nodoDerecho!==null){
               edges.add({from: nodo.valorNodo, to: nodo.nodoDerecho.valorNodo});
            }
         }
         obtenerNodos(nodo.nodoIzquierdo,0);
         obtenerNodos(nodo.nodoDerecho,0);
      }
   } catch (er) {
      alert(er);
   }
}
function crearArbolGrafico(){
   try{
      
      nodes = new vis.DataSet(nodesArray); //Inicialización de la variable que se usará en la construcción gráfica del árbol
      edges = new vis.DataSet(edgesArray); //Variable para las relaciones de los nodos del árbol
      // crear el árbol gráfico
      var container = document.getElementById('arbol_banario');
      var data = {nodes: nodes,edges: edges};
      var options = {
                     layout: {
                         hierarchical: {
                             direction: "UD",
                             sortMethod: "directed"
                         }
                     },
                     interaction: {dragNodes :false},
                     physics: {
                         enabled: false,
                         stabilization: false
                     },
                   };
      var network = new vis.Network(container, data, options);
      
   }catch(er){
      alert(er);
   }
}
function ancestroComun(nodosArbol, valorNodo1, valorNodo2){
   try{
    var resp=0;
    arbolJSON={'nodos':nodosArbol,'valorNodo1': valorNodo1, 'valorNodo2':valorNodo2};
    request({ method: 'GET',async:false, dataType: 'json', url: urlApi + "ancestro", data: arbolJSON },
       function (data) {
          resp=data.data.valorNodo;
       },
       function (status, ok, otro) {
       }
    );
    return resp;
   }catch(er){
      alert(er);
      return 0;
   }
}
//Eventos
function eventoCrearNodo(){
  $("#boton_agregar_nodo").off("click").click(function(){
      agregarNodo();
  });
}
function eventoKeyPressNodo(){
   $("#nodo").keypress(function(event){
      try {
         if(event.which == 13) {
             agregarNodo();
         }
      } catch (er) {
         alert(er);
      }
  });
}
function eventoCrearArbol(){
   $("#boton_crear_arbol").off("click").click(function(){
      crearArbol();
   });
}
function eventoAncestroComun(){
   $("#boton_ancestro_nodos").off("click").click(function(){
      try {
         $("#mensajes_usuario").css("color","black");
         $("#mensajes_usuario").html("");
         _paraAncestroNodoUno=$("#nodo_uno").val();
         _paraAncestroNodoDos=$("#nodo_dos").val();
         if(!nodes._data[_paraAncestroNodoUno]){
            $("#mensajes_usuario").css("color","red");
            $("#mensajes_usuario").html("El nodo "+_paraAncestroNodoUno+" no existe en el actual árbol.");
            return 0;
         }
         if(!nodes._data[_paraAncestroNodoUno]){
            $("#mensajes_usuario").css("color","red");
            $("#mensajes_usuario").html("El nodo "+_paraAncestroNodoDos+" no existe en el actual árbol.");
            return 0;
         }
         var ancestro=ancestroComun(_nodosArbol,_paraAncestroNodoUno,_paraAncestroNodoDos);
         if(ancestro==0){
            $("#mensajes_usuario").css("color","red");
            $("#mensajes_usuario").html("Se produjo un error al intentar consultar el ancestro común"); 
         }else{
            $("#mensajes_usuario").html("El ancestro común entre los nodos "+_paraAncestroNodoUno+" y " +_paraAncestroNodoDos +" es el nodo "+ancestro);  
         }
      } catch (er) {
         alert(er);
      }
   });
   $("#chk_ancestro_comun").off("change").change(function(){
      try {
         $(".grupo-ancestro").css("display",$(this).prop("checked")?"block":"none");   
      } catch (er) {
         alert(er);
      }
   });
}
function eventoInputNodo(){
   $("#nodo").on("input",function(){
      var numeros="0123456789";
      var v=$(this).val();
      var a=v.substr(v.length-1,1);
      if(numeros.indexOf(a)<0){
         $(this).val(v.substr(0,v.length-1));
      }
   });
   $("#nodo_uno").on("input",function(){
      var numeros="0123456789";
      var v=$(this).val();
      var a=v.substr(v.length-1,1);
      if(numeros.indexOf(a)<0){
         $(this).val(v.substr(0,v.length-1));
      }
   });
   $("#nodo_dos").on("input",function(){
      var numeros="0123456789";
      var v=$(this).val();
      var a=v.substr(v.length-1,1);
      if(numeros.indexOf(a)<0){
         $(this).val(v.substr(0,v.length-1));
      }
   });
}
//------------------
(function(){
   //Suscripción de eventos
   $(document).ready(function(){
        crearArbolGrafico();
        eventoCrearNodo();
        eventoKeyPressNodo();
        eventoCrearArbol();
        eventoAncestroComun();
        eventoInputNodo();
    });
})();