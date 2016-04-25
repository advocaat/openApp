var model = {};
var length;
setInterval(function(){
    var xhr = new XMLHttpRequest();
    xhr.open("GET","/modelUpdates", true);
    xhr.send();
    xhr.onreadystatechange = function(){
        if (xhr.readyState == 4 && xhr.status == 200) {
            model = JSON.parse(xhr.responseText);
            //console.log("model: "+JSON.stringify(model));
            if(model.length != length)
            {
                $('#uploads').empty();
                model.items.forEach(function (item) {
                    $('#uploads').append('<img id="'+ item +'" src="/up/file/' + item + '" class="draggable ui-widget-content"  height="80" width="80">');
                    $(".draggable").draggable({
                        containment: 'document',
                        helper: 'clone',
                        revert: 'invalid',
                        cursor: 'move',
                        stop: function( event, ui ) {
                            original = false;
                        },
                        start: function( event, ui ) {
                            original = true;
                        }
                    });
                    //console.log("item " + item);
                })
                length = model.length;
            };
            //$("#uploads").load(location.href + " #uploads");
        }
    };
}, 1000);