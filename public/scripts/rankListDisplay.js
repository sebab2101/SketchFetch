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
      item.innerHTML = "<div>" + "#"+ k[i].getPlace + "</div><div>" + k[i].getName + "</div><div align = 'right'>" + k[i].getScore+ "</div>";
      if(k[i].isDrawer()){
        item.classList.add("drawer");
      }else if(k[i].getGuessed){
        item.classList.add("correctPlayer");
      }
      this.rankedPlayers.appendChild(item);
    }

  }
}
