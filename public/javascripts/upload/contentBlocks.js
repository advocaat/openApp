var blocks = 0;
var myBlocks = [];

$("#addContent").on("click", function () {
    var newBlock = createContentBlock();
    myBlocks.push(newBlock);
})


function createContentBlock() {
    var myId = "contentBlock" + blocks;
    var elem = $('<div class="blocko panel-body"><textarea id="' + myId + '" class="form-control" rows="5" style="width: 650px;" ></textarea><footer class="feet" height="10" ></footer></div>').insertBefore("#endContent");
// <div class="panel panel-default ui-widget-header"><div class="panel-heading"></div>
    var block = {
        id: myId,
        content: "",
        platforms: [],
        editing: false,
        option: "text",
        optionValue: "",
        imageId: "",

    }

    $(".blocko").droppable({
        drop: function (event, ui) {
            console.log("dropped it!!!");
            console.log($(this).children("textarea").attr('id'));
            var blockId = $(this).children("textarea").attr('id');
            myBlocks.forEach(function (item) {
                console.log("item " + item.id);
                if (blockId == item.id) {
                    item.imageId = ui.draggable.attr("id");
                    console.log(item.id + " image id " + item.imageId);
                }
            })
            droppable = true;
            if(original){
                var newDiv = $(ui.draggable).clone();

                newDiv.addClass("dropClass");
                newDiv.draggable({

                    stop: function( event, ui ) {
                        if(!droppable)
                            ui.helper.remove();
                        myBlocks.forEach(function (item) {
                            console.log("item " + item.id);
                            if (blockId == item.id) {
                                item.imageId = "";
                                console.log(item.id + " image id " + item.imageId);
                            }
                        })
                    },
                    start: function( event, ui ) {
                        droppable = false;
                    }
                });
                $(this).append(newDiv);
                // newDiv.css('top', '-100px')
            }
            else{
                ui.helper.css('top','');
                ui.helper.css('left','');
                $(this).append(ui.helper);

            }
            
        }
    });
    console.log("add radio");
    $('<input type="radio" id="blockSelector' + blocks + '" name="editing" class="radios"><label for="blockSelector' + blocks + '"radio02"><span></span></label>').appendTo(elem);
    $('#contentBlock'+ blocks).on("keyup", function(event){
        var tempValue = $(this).val();[0]
        var id = event.target.id;
        myBlocks.forEach(function(block){
            if(block.id == id) {
                block.content = tempValue;
                console.log(block.id + ": " + block.content);
            }
        })
    })
    refreshChangedListener();
    blocks++;
    return block;
}


function refreshChangedListener() {
    $(".blocko input:radio").off();
    $(".blocko input:radio").on("change", function () {
        console.log("change");
        $("#blockType").children().remove("optgroup");
        $('input:checkbox').removeAttr('checked');
        if (this.checked) {
            //focus on this radios related textarea
            $(this).prev().prev().focus();
            var index = getIndexFromId(this.id);
            myBlocks.forEach(function (block) {
                block.editing = false;
            })
            myBlocks[index].editing = true;
            $('.soundcloudInputs').css("visibility", "hidden");
            $('.soundcloudInputs').css("max-height", "0px");
            $('.youtubeInputs').css("visibility", "hidden");
            $('.youtubeInputs').css("max-height", "0px");
            myBlocks[index].platforms.forEach(function (platform) {
                $('.platform').each(function () {
                    if (platform == this.name) {
                        $(this).click();
                        testAndSetSelectOptions(this);
                    }

                })

                $("#blockType").val(myBlocks[index].optionValue);

            })
        }
    });
}



function addTypeOptions(name) {
    console.log("type add " + name);
    switch (name) {
        case "facebook":
            console.log("in " + name);
            if ($('#blockType optgroup[label="Facebook"]').html() == null)
                $('#blockType').append(optgroups.fb);
            break;
        case "soundcloud":
            console.log("in " + name);
            if ($('#blockType optgroup[label="Soundcloud"]').html() == null)
                $('#blockType').append(optgroups.sc);
                $('.soundcloudInputs').css("visibility", "visible");
                $('.soundcloudInputs').css("max-height", "500px");
                $('.soundcloudInputs').css("height", "auto");
            break;
        case "youtube":
            console.log("in " + name);
            if ($('#blockType optgroup[label="YouTube"]').html() == null)
                $('#blockType').append(optgroups.yt);
                $('.youtubeInputs').css("visibility", "visible");
                $('.youtubeInputs').css("max-height", "500px");
                $('.syoutubeInputs').css("height", "auto");
                // $('.post-sign-in').show();

            break;
        case "beatport":
            console.log("in " + name);
            if ($('#blockType optgroup[label="Beatport"]').html() == null)
                $('#blockType').append(optgroups.bp);
            break;
    }
}

function removeTypeOptions(name) {
    console.log("removing " + name);
    switch (name) {
        case "facebook":
            $('#blockType').find('#fb').remove();
            break;
        case "soundcloud":
            $('#blockType').find('#sc').remove();
            $('.soundcloudInputs').css("visibility", "hidden");
            $('.soundcloudInputs').css("max-height", "0px");
            break;
        case "youtube":
            $('#blockType').find('#yt').remove();
            $('.youtubeInputs').css("visibility", "hidden");
            $('.youtubeInputs').css("max-height", "0px");
            // $('.post-sign-in').hide();
            // $('.pre-sign-in').hide();
            break;
        case "beatport":
            $('#blockType').find('#bp').remove();
            break;
    }

}

function testAndSetSelectOptions(thing) {
    if ($(thing).is(':checked')) {
        //add type options for platform
        addTypeOptions(thing.name);
    } else {
        removeTypeOptions(thing.name);
    }
}

optgroups = {
    fb: '<optgroup id="fb" label="Facebook"><option val="1">Image</option></optgroup>',
    sc: '<optgroup id="sc" label="Soundcloud"><option val="2">Image</option><option val="3">Audio</option></optgroup>',
    yt: '<optgroup id="yt" label="YouTube"><option val="4">Video</option></optgroup>',
    bp: '<optgroup id="bp" label="Beatport"><option val="6">Image</option><option val="7">Potato</option></optgroup>'
}


function getIndexFromId(id) {
    var index = parseInt(id.replace("blockSelector", ""));
    console.log(index);
    return index;
}

function testTypeSelection() {
    return $("#blockType option:selected").text();
}

function handleTypeSelection() {
    var selection = testTypeSelection();
    if (selection == "Image") {
        //TODO: allow user to select from staged images
        //TODO: hide edit block and display image in its place

    }
}

$('#blockType').change(function () {
    myBlocks.forEach(function (block) {
        if (block.editing) {
            block.optionValue = $('#blockType option:selected').val();
            if ($('#blockType option:selected').text() == "Image") {
                block.option = "image";
                $('.blocko #' + block.id).css({"visibility": "hidden"});
                $('.blocko #' + block.id).rows = "2";
                //$('.blocko  #' + block.id).parent().css({"min-height": "400px", "min-width": "600px"});
            }else if($('#blockType option:selected').text() == "Audio") {
                block.option = "audio";
            }else if($('#blockType option:selected').text() == "Video"){
                block.option = "video";
            } else {
                block.option = "text";
                $('.blocko #' + block.id).css({"visibility": "visible"});
                $('.blocko #' + block.id).rows = "5";
            }
        }
    })
})

$(document).ready(function(){
    
        myBlocks[0].editing = true;

})