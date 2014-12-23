require.config({
    baseUrl: './js',
    paths: {
        jquery: 'lib/jquery-1.7.2.min',
        bootstrap: 'lib/bootstrap-dropdown',
        jquery_zclip: 'lib/jquery.zclip.min',
        jquery_imgareaselect: 'lib/jquery.imgareaselect'
    },
    shim:{
        "bootstrap": {
            deps: ["jquery"],
            exports: "bootstrap"
        },
        "jquery_zclip": {
            deps: ["jquery"]
        },
        "jquery_imgareaselect": {
            deps: ["jquery"]
        }
    }
});

require([
    'jquery',
    'bootstrap',
    'jquery_zclip'
    ], function ($) {
        "use strict";

        $(function(){

            //var file_id = $("#data_form").find("input[name='file_id']").val();
            //console.log(file_id);
        
            //Set footer position
            setFootPos();
  
            //Check footer position
            function setFootPos(){
                if($("#container").height() < $(window).height() - $("#head").height() - $("#footer").height()-80){
                   $("#container").height($(window).height() - $("#head").height() - $("#footer").height()-80);
                }
            }

            //set the color selection event
            //setSelect("btn_select_min");
            //setSelect("btn_select_max");

            $(".btn-select select").live("change",function(){
                var type = $(this).parent().attr("id").split("_")[2];
                var curSelect = $(this).parent().find(".cur-select");
                var oSelect = $(this).get(0);
                var color = oSelect.options[oSelect.selectedIndex].text;
                curSelect.text(color);
                $("#color-" + type).attr("class",color);
                setOption(color,type);

                var selectedColor = $("#color-min").attr("class") + $("#color-max").attr("class");
                if(selectedColor == "redyellow"){
                   selectedColor = "heat";
                }
                if(selectedColor == "greenbrown"){
                  selectedColor = "terrain";
                }
                if(selectedColor == "aquapurple"){
                  selectedColor = "cm";
                }   
                $('input[name="color"]').val(selectedColor);
                console.log(selectedColor);
            });
            
            function setOption(color ,type){
                if(type == "min") {
                    var maxBtn = $("#btn_select_max");
                    
                    if(color == "red"){
                       clearOption(maxBtn);
                       addOption(maxBtn,"green");
                       addOption(maxBtn,"blue");
                       addOption(maxBtn,"yellow");
                    }

                    if(color == "green"){
                        clearOption(maxBtn);
                        addOption(maxBtn,"red");
                        addOption(maxBtn,"brown");
                        addOption(maxBtn,"yellow");
                    }

                    if(color == "blue"){
                        clearOption(maxBtn);
                        addOption(maxBtn,"red");
                        addOption(maxBtn,"white");
                        addOption(maxBtn,"yellow");
                    }

                    if(color == "white"){
                        clearOption(maxBtn);
                        addOption(maxBtn,"blue");
                        addOption(maxBtn,"red");
                    }

                    if(color == "yellow"){
                        clearOption(maxBtn);
                        addOption(maxBtn,"blue");
                        addOption(maxBtn,"red");
                    }

                    if(color == "aqua"){
                      clearOption(maxBtn);
                      addOption(maxBtn,"purple");
                    }

                    changeCurSelect(maxBtn,"max");

                }else {

                }
            }

            function clearOption(obj){
                $(obj).find("select").empty();
            }

            function addOption(obj,color){
                //console.log(color);
                $(obj).find("select").eq(0).append('<option class="' + color + '">' + color + '</option>');
            }

            function changeCurSelect(obj,type){
                var defaultColor = $(obj).find("select option").eq(0).text();
                //console.log(defaultColor);
                $("#color-" + type).attr("class",defaultColor);
                $(obj).find(".cur-select").text(defaultColor);
            }


        });

    });
