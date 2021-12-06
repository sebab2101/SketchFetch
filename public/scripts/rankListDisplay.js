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
    this.rankList.sortRankList();
    this.rankedPlayers.innerHTML="";
    let k = this.rankList.allPlayers;
    for (var i=0; i<k.length; i++)
    {
      var item = document.createElement('li');
      item.innerHTML = 
      `<li class="row mx-0">
        <div class="col-md-3 px-0">#`+ k[i].getPlace +`</div>
        <div class="col-md-6 px-0 text-break">`+ k[i].getName + `</div>
        <div class="col-md-3 px-0 text-break" align="right">` + k[i].getScore+`</div>
      </li>`;
      if(k[i].isDrawer()){
        item.classList.add("drawer");
      }else if(k[i].getGuessed){
        item.classList.add("correctPlayer");
      }
      this.rankedPlayers.appendChild(item);
    }
  }
}
