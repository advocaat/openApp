$('input:checkbox').on("change", function(){
    console.log("hero");
    updatePlatforms();
    testAndSetSelectOptions(this);
});


function updatePlatforms(){
    myBlocks.forEach(function(block){
        if(block.editing == true){
            block.platforms = [];
            $('.platform').each(function(){
                if($(this).prop('checked')){
                    block.platforms.push(this.name);
                }
            });
            console.log(block.platforms.toString());
        }
    })

}

