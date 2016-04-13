var blocks = 0;

var myBlocks = [];

$("#addContent").on("click", function () {
    var newBlock = createContentBlock();
    myBlocks.push(newBlock);

})


function createContentBlock(){
    var myId = "contentBlock"+ blocks;
    var elem = $('<div class="blocko"><textarea id="'+myId +'" class="block" rows="5" cols="90"></textarea><footer class="feet" height="10" width="400"></footer></div>').insertAfter("#title");

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
        //clear all checkboxes before refresh
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
                    }
                })

            })
        }
    });
}


function getIndexFromId(id){
    var index = parseInt(id.replace("blockSelector", ""));
    console.log(index);
    return index;
}