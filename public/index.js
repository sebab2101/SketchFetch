import {player,rankList,timer} from './module.js';

let p1=new player("Sebastian",123);
let p2=new player("Dev",124);
let p3=new player("Asmod",125);

let r=new rankList;

r.addPlayer(p1);
r.addPlayer(p2);
r.addPlayer(p3);

p1.changeScore(50);
p2.changeScore(100);
console.log(r.displayRankList());
r.sortRankList();
console.log(r.displayRankList());
