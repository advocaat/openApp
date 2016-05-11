var blocks = 0;

var myBlocks = [];

$("#addContent").on("click", function () {
    var newBlock = createContentBlock();
    myBlocks.push(newBlock);

})


function createContentBlock() {
    var myId = "contentBlock" + blocks;
    var elem = $('<div class="blocko ui-widget-header"><textarea id="' + myId + '" class="form-control" rows="5" cols="90"></textarea><footer min-width="300px" class="feet" height="10" ></footer></div>').insertBefore("#endContent");
    var block = {
        id: myId,
        content: "",
        platforms: [],
        editing: false,
        option: "text",
        optionValue: "",
        imageId: ""
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

            // var parent = ui.draggable.parent();
            // var draggedElement = $(ui.draggable);
            // var dropZone = $(this);
            // var leftOffset = Math.abs(parent.offset().left - dropZone.offset().left);
            // var topOffset = dropZone.offset().top - parent.offset().top;
            // draggedElement.clone().appendTo(dropZone);
            // draggedElement.css('left', draggedElement.position().left - leftOffset);
            // draggedElement.css('top', draggedElement.position().top - topOffset);
            // draggedElement.draggable('option', 'containment', 'parent');
            //


        }
    });

    $('<input type="radio" id="blockSelector' + blocks + '" name="editing" class="radios">').appendTo(elem);
    $('#contentBlock'+ blocks).on("keyup", function(event){
        var tempValue = $(this).val();
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
            break;
        case "youtube":
            console.log("in " + name);
            if ($('#blockType optgroup[label="YouTube"]').html() == null)
                $('#blockType').append(optgroups.yt);
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
            break;
        case "youtube":
            $('#blockType').find('#yt').remove();
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
    yt: '<optgroup id="yt" label="YouTube"><option val="4">Image</option><option val="5">Potato</optionval></optgroup>',
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
            }else if($('#blockType option:selected').text() == "Audio"){
                block.option = "audio";
            } else {
                block.option = "text";
                $('.blocko #' + block.id).css({"visibility": "visible"});
                $('.blocko #' + block.id).rows = "5";
            }
        }
    })
})