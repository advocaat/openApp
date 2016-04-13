var blocks = 0;

var myBlocks = [];

$("#addContent").on("click", function () {
    var newBlock = createContentBlock();
    myBlocks.push(newBlock);

})


function createContentBlock(){
    var myId = "contentBlock"+ blocks;
    var elem = $('<div class="blocko"><textarea id="'+myId +'" class="form-control" rows="5" cols="90"></textarea><footer class="feet" height="10" ></footer></div>').insertAfter("#titleDiv");

    var block = {
        id: myId,
        content: "",
        platforms: new Array(),
        editing: false
    }
    $('<input type="radio" id="blockSelector'+ blocks +'" name="editing" class="radios">').appendTo(elem);
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
            myBlocks.forEach(function(block){
                block.editing = false;
            })
            myBlocks[index].editing = true;
            myBlocks[index].platforms.forEach(function(platform) {
                $('.platform').each(function () {
                    if (platform == this.name) {
                        $(this).click();
                        testAndSetSelectOptions(this);
                    }
                })

            })
        }
    });
}
function addTypeOptions(name){
    console.log("type add " + name);
    switch(name){
        case "facebook":
            console.log("in " + name);
            if($('#blockType optgroup[label="Facebook"]').html() == null)
                $('#blockType').append(optgroups.fb);
            break;
        case "soundcloud":
            console.log("in " + name);
            if($('#blockType optgroup[label="Soundcloud"]').html() == null)
                $('#blockType').append(optgroups.sc);
            break;
        case "youtube":
            console.log("in " + name);
            if($('#blockType optgroup[label="YouTube"]').html() == null)
                $('#blockType').append(optgroups.yt);
            break;
        case "beatport":
            console.log("in " + name);
            if($('#blockType optgroup[label="Beatport"]').html() == null)
                $('#blockType').append(optgroups.bp);
            break;
    }
}

function removeTypeOptions(name){
    console.log("removing "+ name);
    switch(name){
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

function testAndSetSelectOptions(thing){
    if($(thing).is(':checked')) {
        //add type options for platform
        addTypeOptions(thing.name);
    }else{
        removeTypeOptions(thing.name);
    }
}

optgroups = {
    fb: '<optgroup id="fb" label="Facebook"><option>Image</option><option>Potato</option></optgroup>',
    sc: '<optgroup id="sc" label="Soundcloud"><option>Image</option><option>Potato</option></optgroup>',
    yt: '<optgroup id="yt" label="YouTube"><option>Image</option><option>Potato</option></optgroup>',
    bp: '<optgroup id="bp" label="Beatport"><option>Image</option><option>Potato</option></optgroup>'
}


function getIndexFromId(id){
    var index = parseInt(id.replace("blockSelector", ""));
    console.log(index);
    return index;
}