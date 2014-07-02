require.config({
    baseUrl: './js',
    paths: {
        jquery: 'lib/jquery-1.7.2.min',
        bootstrap: 'lib/bootstrap-dropdown',
      
    },
    shim:{
        "bootstrap": {
            deps: ["jquery"],
            exports: "bootstrap"
        }
    }
});

require([
    'jquery',
    'bootstrap'
    ], function ($) {
        "use strict";

        $(function(){

            //设置以哪边的选项为主，可能值为min ,max 
            var _dominatedPart = "";

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
            
            function setOption(color ,type){
                if(type == "min" && _dominatedPart == "min") { //Min确定后设置Max的值
                    var maxBtn = $("#btn_select_max");
                    clearOption(maxBtn);
                    if(color == "red"){
                       addOption(maxBtn,"green");
                       addOption(maxBtn,"blue");
                       addOption(maxBtn,"yellow");
                    }

                    if(color == "green"){          
                        addOption(maxBtn,"red");
                        addOption(maxBtn,"brown");
                        addOption(maxBtn,"yellow");
                    }

                    if(color == "blue"){                        
                        addOption(maxBtn,"red");
                        addOption(maxBtn,"white");
                        addOption(maxBtn,"yellow");
                    }

                    if(color == "white"){                       
                        addOption(maxBtn,"blue");
                        addOption(maxBtn,"red");
                    }

                    if(color == "yellow"){  
                        addOption(maxBtn,"blue");
                        addOption(maxBtn,"red");
                    }

                    if(color == "aqua"){
                      addOption(maxBtn,"purple");
                    }

                    changeCurSelect(maxBtn,"max");
                }
                if(type == "max" && _dominatedPart == "max"){
                    var minBtn = $("#btn_select_min");
                    clearOption(minBtn);

                    if(color == "red"){
                        addOption(minBtn,"green");
                        addOption(minBtn,"yellow");
                        addOption(minBtn,"white");
                        addOption(minBtn,"blue");
                    }

                    if(color == "green"){
                        addOption(minBtn,"red");
                    }

                    if(color == "yellow"){
                        addOption(minBtn,"red");
                        addOption(minBtn,"green");
                        addOption(minBtn,"blue");
                    }

                    if(color == "blue"){
                        addOption(minBtn,"red");
                        addOption(minBtn,"white");
                        addOption(minBtn,"yellow");
                    }

                    if(color == "white"){
                        addOption(minBtn,"blue");
                    }

                    if(color == "brown"){
                        addOption(minBtn,"green");
                    }

                    if(color == "purple"){
                        addOption(minBtn,"aqua");
                    }
                    changeCurSelect(minBtn,"min");
                }
            }

            function clearOption(obj){
                $(obj).find(".options").empty();
            }

            function addOption(obj,color){
                //console.log(color);
                $(obj).find(".options").append('<p class="' + color + '">' + color + '</p>');
            }

            //设置显示为默认值
            function changeCurSelect(obj,type){
                var defaultColor = $(obj).find(".options p").eq(0).text();
                //console.log(defaultColor);
                //$("#color-" + type).attr("class",defaultColor);
                $(obj).find(".cur-select").text(defaultColor);
                $(obj).find(".cur-select").css("background-color",defaultColor);
            }

            /** user defined select btn **/
            $(".btn-select").live("click",function(){
                $(this).find(".options").toggle();
                //console.log("click");
                if(_dominatedPart == ""){
                   _dominatedPart = $(this).attr("id").split("_")[2];
                }
            });

            $('body,div').click(function(){
                $(".options").hide();
            });

            //选中某个元素
            $(".options p").live("click",function(event){
                $(this).parent().hide();
                
                //下拉框类型
                var type = $(this).parents(".btn-select").attr("id").split("_")[2];
                
                //选中项提示
                var curSelect = $(this).parents(".btn-select").find(".cur-select");
                
                //选中颜色
                var color = $(this).text();
                curSelect.text(color);
                curSelect.css("background-color",color);
                $("#color-" + type).attr("class",color);
                
                //设置另一边的选项
                setOption(color,type);

                //设置隐藏表单项color的值
                var selectedColor = $.trim($("#btn_select_min").find(".cur-select").text()) + $.trim($("#btn_select_max").find(".cur-select").text());
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

                //阻止事件冒泡
                event.stopPropagation();
                return false;
            });
            
            //reset the color
            $("#resetBtn").click(function(){

                _dominatedPart = "" ;

                var max_colors = ["red","green","blue","white","yellow","aqua"];
                var min_colors = ["red","green","blue","white","yellow","brown","purple"];

                var minBtn = $("#btn_select_min");
                var maxBtn = $("#btn_select_max");

                minBtn.find(".cur-select").text("red").css("background-color","red");
                maxBtn.find(".cur-select").text("green").css("background-color","green");

                clearOption(minBtn);
                $.each(min_colors,function(i,e){
                    addOption(minBtn,e);
                });

                clearOption(maxBtn);
                $.each(max_colors,function(i,e){
                    addOption(maxBtn,e);
                });

            });

        });

    });
