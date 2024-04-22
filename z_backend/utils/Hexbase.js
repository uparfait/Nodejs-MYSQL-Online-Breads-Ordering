class Hexbase {
   constructor (length) {
      this.m    = Math;
      this.t    = "a0b1c2d3e4f56978";
      this.l    = length || 16;
      this.t    = this.t.split("");
      this.s    = [];
   }

   c (n) {
      this.c1 = this.m.floor(this.m.random() * 16);
      this.c2 = this.m.floor(this.m.random() * 16);
      [this.t[this.c1],
      this.t[this.c2]] = [this.t[this.c2],
                     this.t[this.c1]];
      if(n !== 1) return this.c (n - 1);
   }
   g () {
      this.c(16);
      this.s.push(this.t[this.m.floor(this.m.random() * 16)]);
      if(this.s.length != this.l) return this.g();
   }
   get_id () {
      this.g();
      this._b16   = this.s;
      this.s      = [];
      return this._b16.join("");
   }
   get_filename () {
      this.g();
      this._b16   = this.s;
      this.s      = [];
      return this._b16.join("");
   }
}
module.exports = Hexbase;