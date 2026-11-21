// ===== 問題データ =====
const C=(q,a)=>({t:"k",q,a});
const m=s=>s.replace(/\*(.+?)\*/g,"【$1】");
const O=(q,o,k)=>{o=o.split(",").map(m);return{t:"c",q:m(q),o,a:o[k-1]}};
const ODD="マーク部分の発音が他と異なる語は？";
const SAME=" と同じ発音（マーク部分）の語は？";
const rows=(s,f)=>s.split("|").map(r=>f(...r.split(":")));
const SND=["s","ts","ʃ","tʃ","x","ç","k","z"].map(s=>"［"+s+"］");
const LV=rows("L*u*ft:短|g*u*t:長|*A*rzt:長|T*a*nte:短|P*o*st:短|*O*bst:長|d*u*nkel:短|Bl*u*t:長|T*i*ger:長|m*i*t:短|m*e*rken:短|*E*rde:長|T*ö*chter:短|B*u*ch:長:※プリントの解答「短」は誤り。正しくは長音|d*u*rch:短|K*u*chen:長|N*a*cht:短|h*o*ch:長|Z*u*cker:短|K*o*pf:短|Pf*e*rd:長|d*o*ch:短|Str*a*ße:長|*e*ssen:短|gr*o*ß:長|spr*e*chen:短|Spr*a*che:長|F*u*ß:長|Kl*o*ster:長|Fl*u*ß:短:※旧綴り（現在は Fluss と書く）",(w,a,n)=>({t:"c",nt:1,e:n,q:"マーク部分の母音は長音？ 短音？\n"+m(w),o:["長音","短音"],a:a+"音"}));
const LP=rows("Monat:Mōnat,Monāt:0|Natur:Nātur,Natūr:1|aber:āber,abēr:0|Japan:Jāpan,Japān:0|nehmen:nēhmen,nehmēn:0|Examen:Ēxamen,Exāmen,Examēn:1|Bibel:Bībel,Bibēl:0|Italien:Ītalien,Itālien,Italiēn:1",(w,o,k)=>{o=o.split(",");return{t:"c",nt:1,q:"長母音になる母音は？（長音符号つきの形を選ぶ）\n"+w,o,a:o[+k]}});
const AC=rows("gestern:ge,stern:0|bekommen:be,kom,men:1|Monat:Mo,nat:0|Musik:Mu,sik:1|Anfang:An,fang:0|Antwort:Ant,wort:0|Atom:A,tom:1|Arbeit:Ar,beit:0",(w,o,k)=>{o=o.split(",");return{t:"c",nt:1,q:"アクセントのある音節は？\n"+w,o,a:o[+k]}});
const SC=rows("hei*ß*:s|la*ch*en:x|Ber*g*:k|Deu*tsch*:tʃ|*s*tark:ʃ|Scha*tz*:ts|*sch*on:ʃ|We*s*ten:s|Te*ch*nik:ç|ho*ch*:x|*Tsch*eche:tʃ|Köni*g*:ç|Rei*s*e:z|*Z*immer:ts|*S*ohn:z|*Ch*aos:k",(w,x)=>({t:"c",nt:1,q:"マーク部分の発音は？\n"+m(w),o:SND,a:"［"+x+"］"}));
const YN=[["k","Onkel,Junge,Ecke,Chrom,Tag,Chance","Onkel,Ecke,Chrom,Tag"],["ç","ich,China,König,acht,euch,Chor","ich,China,König,euch"],["x","Echo,rauchen,Bach,kochen,wachsen,Tuch","rauchen,Bach,kochen,Tuch"],["ʃ","Stimme,Spaß,Knospe,Charme,Kasten,Schule","Stimme,Spaß,Charme,Schule"]].flatMap(([x,w,y])=>w.split(",").map(v=>({t:"c",nt:1,q:"「"+v+"」には［"+x+"］の発音が含まれる？",o:["含む","含まない"],a:y.split(",").includes(v)?"含む":"含まない"})));
const DATA=[
{id:"odd",name:"発音：違う発音の語（2019年度＋練習）",items:[
O(ODD,"dur*ch*,Spra*ch*e,wi*ch*tig,mö*ch*te",2),
O(ODD,"*Z*immer,je*tz*t,Her*z*,*T*ier",4),
O(ODD,"Mitt*w*och,beq*u*em,No*v*ember,*v*iel",4),
O(ODD,"*St*ern,ge*st*ern,be*st*ehen,*Sp*aß",2),
O(ODD,"L*ie*be,B*i*bel,B*ie*ne,Famil*ie*",4),
O(ODD,"Run*d*funk,*d*raußen,Frie*d*e,*D*ruck",1),
O(ODD,"*ei*ns,Fräul*ei*n,M*ai*,L*ie*d",4),
O(ODD,"*s*agen,un*s*er,Pau*s*e,Sam*s*tag",4),
O(ODD,"h*eu*te,Mus*eu*m,Fr*eu*de,L*eu*te",2),
O(ODD,"se*chs*,Ta*x*i,nä*chs*t,wa*chs*en",3),
O(ODD,"nai*v*,Kla*v*ier,*V*olk,*F*ilm",2),
O(ODD,"ho*ch*,Ku*ch*en,au*ch*,Re*ch*t",4),
O(ODD,"alle*s*,gro*ß*,Dien*s*tag,*S*onntag",4),
O(ODD,"drei*ß*ig,Pla*tz*,abend*s*,nicht*s*",1)]},
{id:"same",name:"発音：同じ・指定の発音",items:[
O("hal*b*"+SAME,"A*b*end,Her*b*st,ver*b*inden,*B*uch",2),
O("Lan*d*"+SAME,"Run*d*funk,*d*raußen,Frie*d*e,*D*ruck",1),
O("Ja*g*d"+SAME,"Fra*g*e,*g*eboren,stren*g*,Flu*g*zeug",4),
O("h を発音する語は？（1つ目）","gehen,Uhr,erziehen,Wohnung,behaupten,Autofahrer",5),
O("h を発音する語は？（2つ目）","Uhr,gehören,erziehen,Wohnung,Autofahrer,gehen",2),
O("［ʒ］を含む語は？","Junge,Orange,Geige,Wagen",2),
O("［ç］を含む語は？","Tag,jung,wenig,Zug",3),
O("［g］を含む語は？","Honig,Zunge,Weg,Auge",4)]},
{id:"lv",name:"発音：長音か短音か",items:LV},
{id:"lp",name:"発音：長母音の位置",items:LP},
{id:"ac",name:"発音：アクセント",items:AC},
{id:"sc",name:"発音：下線部の発音の分類",items:SC},
{id:"yn",name:"発音：［k］［ç］［x］［ʃ］を含むか",items:YN},
{id:"pas",name:"受動態への書き換え",items:[
C("次の文を受動文に。\nSeine Sekretärin schrieb diesen Brief.","Dieser Brief wurde von seiner Sekretärin geschrieben."),
C("次の文を受動文に。\nMein Mann hat mir den Ring geschenkt.","Der Ring ist mir von meinem Mann geschenkt worden."),
C("次の文を受動文に。\nIn Österreich spricht man Deutsch.","In Österreich wird Deutsch gesprochen."),
C("次の文を受動文に。\nFrau Schmidt hält den Vortrag.","Der Vortrag wird von Frau Schmidt gehalten.")]},
{id:"ja",name:"和訳（独→日）",items:[
C("Dieses Auto ist für uns zu groß. Wir möchten ein kleineres Auto haben.","この車は私たちにとって大きすぎます。もっと小さな車が欲しいです。"),
C("Wer sind die hier auf dem Foto? ― Das hier ist mein Onkel, und die beiden da vorne sind meine Schwestern.","写真に写っているこの人たちは誰ですか。――こちらが私のおじで、前にいる2人は私の姉妹です。"),
C("Ist jemand inzwischen gekommen? ― Nein, niemand.","その間に誰か来ましたか。――いいえ、誰も来ていません。"),
C("Wann und wo sind Sie geboren? ― Ich bin 1985 in Bonn geboren.","あなたはいつ、どこで生まれましたか。――私は1985年にボンで生まれました。"),
C("Das Kind kam weinend nach Haus und sagte zu seiner Mutter: „Mein Fahrrad wurde gestohlen!“","その子どもは泣きながら家に帰り、母親に「私の自転車が盗まれた！」と言いました。"),
C("Heute wird der Geburtstag meines Großvaters gefeiert. Er wird 80 Jahre alt.","今日、私の祖父の誕生日がお祝いされます。彼は80歳になります。"),
C("1990 wurden die zwei deutschen Staaten, die BRD und die DDR, vereint.","1990年に、ドイツの2つの国家であるBRDとDDRが統一されました。"),
C("Ich danke Ihnen für Ihren Gruß aus Italien. Ich habe mich über die schöne Karte sehr gefreut.","イタリアからのお便りありがとうございます。私はそのきれいなカードをとても嬉しく思いました。"),
C("Beeilen Sie sich! Der Zug fährt in 3 Minuten ab.","急いでください！列車は3分後に出発します。"),
C("Damals gab es hier eine Schule. Ich erinnere mich noch ganz gut an meine Schulfreunde.","当時、ここには学校がありました。私は学校時代の友人たちのことを今でもよく覚えています。"),
C("Meine Mutter hat am 3. August Geburtstag.","私の母の誕生日は8月3日です。"),
C("Das sind die Namen der Studenten, die die Prüfung bestanden haben.","これらは試験に合格した学生たちの名前です。"),
C("Der Dichter, dessen Gedichte ich sehr hoch schätze, ist heute gestorben.","私がその詩を非常に高く評価している詩人が、今日亡くなりました。"),
C("Es sind wahrscheinlich die Beatles, die auf die Rockmusik den größten Einfluss ausgeübt haben.","ロック音楽に最も大きな影響を与えたのは、おそらくビートルズです。"),
C("Früher glaubte man, dass die Erde flach ist.","昔、人々は地球が平らだと信じていました。"),
C("Wenn ich nicht erkältet wäre, würde ich gerne mitkommen.","もし私が風邪をひいていなければ、喜んで一緒に行くのに。"),
C("Fritz hat mir geschrieben, er komme am 3. April nach München zurück.","フリッツは、4月3日にミュンヘンに戻ってくると私に手紙を書いてきました。"),
C("Er lebt so, als ob er ein König wäre.","彼はまるで王様であるかのように生活しています。"),
C("Er spricht fließend Deutsch, als ob er Deutscher wäre.","彼はまるでドイツ人であるかのように流暢にドイツ語を話します。"),
C("Es wäre sehr schön gewesen, wenn du gestern mitgekommen wärest.","昨日君が一緒に来てくれていたら、とてもすてきだったのに。"),
C("Ohne dich wäre die Party ganz langweilig gewesen.","君がいなかったら、パーティーはまったく退屈だっただろう。"),
C("Seien wir vernünftig, sonst verlieren wir das Spiel.","落ち着いていこう、さもないとゲームに負けるぞ。"),
C("Hätte ich Geld, könnte ich mir das Auto kaufen.","お金があれば、その車を買えるんだが。")]},
{id:"de",name:"独訳（日→独）",items:[
C("ペーターには弟がいます。弟はいま法学を専攻しています。","Peter hat einen jüngeren Bruder. Der studiert jetzt Jura."),
C("ハンスは私の兄です。","Hans ist mein älterer Bruder."),
C("ペーターはクラスで一番優秀な生徒です。","Peter ist der beste Schüler der Klasse."),
C("ペーターとハインツは同い年です。","Peter ist so alt wie Heinz."),
C("カールはマックスほど背が高くありません。","Karl ist nicht so groß wie Max."),
C("マックスはカールより背が高い。","Max ist größer als Karl."),
C("マリーアは私より勤勉だ。","Maria ist fleißiger als ich."),
C("このクラスではマックスが一番背が高い。","In der Klasse ist Max am größten.（= der Größte）"),
C("私たちみんなのなかで彼女が一番勤勉だ。","Sie ist von uns allen am fleißigsten.（= die Fleißigste）"),
C("この町は春が一番美しい。","Diese Stadt ist im Frühling am schönsten."),
C("マリーアは彼女の兄よりも熱心に勉強します。","Maria arbeitet fleißiger als ihr Bruder."),
C("赤ワインと白ワインとどちらのほうが好きですか。――白ワインのほうが好きです。でも、一番好きなのはビールです。","Was trinken Sie lieber, Rotwein oder Weißwein? ― Ich trinke lieber Weißwein, aber am liebsten Bier."),
C("この近くに郵便局がありますか？","Gibt es hier in der Nähe eine Post?"),
C("元気かい？――ありがとう、元気だよ。君はどう？","Wie geht es dir? ― Danke, gut. Und dir?"),
C("彼にとって大事なのはお金だけだ。","Es geht ihm nur um das Geld."),
C("外国へ旅行するときには、パスポートが必要です。","Man braucht einen Pass, wenn man ins Ausland reist."),
C("まだ仕事をしなければならないので、一緒に行けません。","Da ich noch arbeiten muss, kann ich nicht mitgehen."),
C("彼はなぜ授業に出てこないのですか。――風邪をひいているからです。","Warum kommt er nicht in den Unterricht? ― Weil er erkältet ist."),
C("遅れて来てごめんなさい。","Es tut mir leid, dass ich zu spät komme."),
C("彼はすぐ帰ってくると思います。","Ich glaube, dass er gleich zurückkommt.")]}
];

DATA.filter(d=>d.id=="pas"||d.id=="de"||d.id=="ja").forEach(d=>d.items.forEach(x=>x.g=1));
