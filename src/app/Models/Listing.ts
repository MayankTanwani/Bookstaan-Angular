export class Listing {
  id : number;
  bookName : string;
  authorName : string;
  seller : number;
  image : string;
  price : number;
  bookCondition : string;
  constructor(){
    this.bookCondition="";
    this.bookName = "";
    this.authorName = "";
    this.price = 0;
  }
}
