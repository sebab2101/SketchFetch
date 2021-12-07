class rankListDisplay{
  rankingBox;
  rankedPlayers;
  rankList;

  constructor(myList){
      this.rankingBox = document.querySelector("#rankBox");
      this.rankedPlayers = this.rankingBox.querySelector("#rankList");
      this.rankList = myList;
  }

  updateRankDisplay(){
    this.rankedPlayers.innerHTML="";
    let k = this.rankList.allPlayers;
    for (var i=0; i<k.length; i++)
    {
      var item = document.createElement('li');
      item.innerHTML = 
      `
        <div class="col-md-3 px-0">#`+ k[i].getPlace +`</div>
        <div class="col-md-6 px-0 text-break">`+ k[i].getName + `</div>
        <div class="col-md-3 px-0 text-break" align="right">` + k[i].getScore+`</div>
      `;
      item.classList.add("row");
      item.classList.add("mx-0");
      if(k[i].isDrawer()){
        item.classList.add("drawer");
        let buff = item.children[1].innerText;
        item.children[1].innerHTML = "&#9999;&#65039;"+buff;
      }else if(k[i].getGuessed){
        item.classList.add("correctPlayer");
      }
      this.rankedPlayers.appendChild(item);
    }
  }
}
