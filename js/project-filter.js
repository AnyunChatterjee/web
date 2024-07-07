$(document).ready(function(){
    $(".btn").click(function(){
        var attr=$(this).attr("data-li");

        $(".btn").removeClass("active");
        $(this).addClass("active");

        $(".card").hide();
        if(attr=="behavior"){
            $("."+attr).show();
        }
        else if(attr=="media"){
            $("."+attr).show();
        } 
        else if(attr=="pubh"){
            $("."+attr).show();
        } 
        else if(attr=="old"){
            $("."+attr).show();
        } 
        else if(attr=="now"){
            $("."+attr).show();
        } 
        else if(attr=="primary"){
            $("."+attr).show();
        } 
        else if(attr=="secondary"){
            $("."+attr).show();
        } 
        else if(attr=="staff"){
            $("."+attr).show();
        } 
        else{
            $(".card").show();
        }
    })
});