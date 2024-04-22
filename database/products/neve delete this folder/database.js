

function storage() {
   let storage = __dirname.split("\\");
   let un = storage.pop();
   return storage.join("\\");
}
module.exports = storage;