function OnSearch(input) {
    if(input.value == "") {
        alert("You either clicked the X or you searched for nothing.");
    }
    else {
        alert("You searched for " + input.value);
    }
}

$(document).ready(function(){
    $('.nav li').bind('click', function() {
       $(this).addClass('active').siblings().removeClass('active');
    });
});

function set_iframe_load_params(obj)
{
    obj.style.visibility = 'visible';

    /* obj.style.height = obj.contentWindow.document.body.scrollHeight + 'px'; */

    var height = document.documentElement.clientHeight;
    height -= obj.offsetTop;
    
    height -= 20;
    
    obj.style.height = height + 'px';
}
