
function remove_image(src,processor){
   processor.unlink(src,(err)=>{
      if (err) {};
   })
}

module.exports = remove_image;