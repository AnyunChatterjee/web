$(document).ready(function(){
    $(".btn").click(function(){
        var attr=$(this).attr("data-li");

        $(".btn").removeClass("active");
        $(this).addClass("active");

        $(".accordion-item").hide();
        if(attr=="behavior"){
            $("."+attr).show();
        }
        else if(attr=="media"){
            $("."+attr).show();
        } 
        else if(attr=="pubh"){
            $("."+attr).show();
        } 
        else{
            $(".accordion-item").show();
        }
    })
});