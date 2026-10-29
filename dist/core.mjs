export const TTL = 10 * 60 * 1000;
export const products = [
 ['p01','ワイヤレスヘッドホン','テック',12800,'headphones','チャコール','サンド',4.7,128,'最大40時間再生。集中にも、移動にも。','ヘッドフォン イヤホン Bluetooth ノイズキャンセリング'],
 ['p02','ポータブルスピーカー','テック',6800,'speaker','サンド','チャコール',4.5,86,'手のひらサイズに、広がりのあるサウンド。','Bluetooth 音楽'],
 ['p03','ワイヤレスマウス','テック',2980,'mouse','チャコール','ホワイト',4.6,214,'静かなクリックと、手になじむ曲線。','パソコン PC 静音'],
 ['p04','メカニカルキーボード','テック',8900,'keyboard','ホワイト','チャコール',4.8,72,'机の上をすっきり整える、コンパクトな75%配列。','パソコン PC キーボード'],
 ['p05','アームデスクライト','インテリア',5900,'lamp','サンド','チャコール',4.6,93,'必要な場所に、やわらかい光を。','照明 ランプ 勉強'],
 ['p06','アナログウォールクロック','インテリア',3900,'clock','サンド','チャコール',4.4,51,'静かに時を刻む、ミニマルな壁掛け時計。','時計 壁時計'],
 ['p07','リネンクッション','インテリア',2400,'cushion','オリーブ','サンド',4.5,64,'さらりとしたリネンの手ざわり。45 × 45cm。','枕 ソファ'],
 ['p08','セラミックフラワーベース','インテリア',2800,'vase','サンド','ホワイト',4.7,43,'一輪でも美しく飾れる、マットな陶器の花器。','花瓶 陶器'],
 ['p09','ステンレスボトル 500ml','キッチン',2600,'bottle','オリーブ','サンド',4.8,162,'飲みごろを持ち歩く、真空断熱ボトル。','水筒 タンブラー 保温'],
 ['p10','スタッキングマグ 320ml','キッチン',1600,'mug','サンド','チャコール',4.6,108,'毎日のコーヒーに。重ねてしまえるマグ。','コップ カップ コーヒー'],
 ['p11','ハンドドリップケトル','キッチン',4800,'kettle','チャコール','サンド',4.7,79,'細く、ゆっくり注げる。1日の始まりの道具。','やかん コーヒー ポット'],
 ['p12','ウッドサービングトレイ','キッチン',2200,'tray','ナチュラル','ブラウン',4.5,37,'木目を楽しむ、小さな食卓の定番。','お盆 皿 木製'],
 ['p13','キャンバストートバッグ','ファッション',3200,'bag','サンド','チャコール',4.6,96,'A4もボトルも収まる、毎日の相棒。','鞄 かばん バッグ'],
 ['p14','コットンベーシックTシャツ','ファッション',1900,'shirt','ホワイト','チャコール',4.4,183,'ほどよい厚みの、頼れるコットン100%。','服 半袖 Tシャツ'],
 ['p15','デイリーバックパック','ファッション',6900,'backpack','チャコール','オリーブ',4.7,102,'13インチPCが収まる、軽やかな18L。','リュック バッグ 鞄'],
 ['p16','ソフトルームシューズ','ファッション',1800,'slippers','サンド','チャコール',4.5,58,'足元から、くつろぐ時間に。','スリッパ 靴'],
 ['p17','USB-Cハブ 6-in-1','テック',4200,'hub','チャコール','シルバー',4.3,47,'必要な接続を、ひとつに。HDMI・USB・SD対応。','パソコン PC ハブ アダプター'],
 ['p18','オークサイドテーブル','インテリア',9800,'table','ナチュラル','ブラウン',4.8,31,'ソファの隣にちょうどいい、直径40cm。','机 家具 テーブル']
].map(([id,name,category,price,image,c1,c2,rating,reviews,description,keywords],i)=>({id,name,category,price,image,colors:[c1,c2],rating,reviews,description,keywords,stock:i===16?0:12+i,rank:i}));
export const yen=n=>new Intl.NumberFormat('ja-JP',{style:'currency',currency:'JPY',maximumFractionDigits:0}).format(n);
export function pruneOrders(orders,now=Date.now()){return (Array.isArray(orders)?orders:[]).filter(o=>o&&Number.isFinite(o.createdAt)&&o.createdAt<=now&&now-o.createdAt<TTL&&Array.isArray(o.items)).sort((a,b)=>b.createdAt-a.createdAt).slice(0,5);}
export function totals(items,coupon=''){const subtotal=items.reduce((s,x)=>s+x.price*x.quantity,0);const discount=coupon==='DEMO10'?Math.floor(subtotal*.1):0;const shipping=subtotal===0||subtotal-discount>=5000?0:500;return {subtotal,discount,shipping,total:subtotal-discount+shipping};}
export function filterProducts({query='',category='',max=Infinity,stock=false,sort='recommended'}={}){const terms=query.normalize('NFKC').toLowerCase().trim().split(/\s+/).filter(Boolean);const list=products.filter(p=>(!category||p.category===category)&&p.price<=max&&(!stock||p.stock>0)&&terms.every(t=>(p.name+' '+p.category+' '+p.keywords).normalize('NFKC').toLowerCase().includes(t)));return list.sort((a,b)=>sort==='price-asc'?a.price-b.price:sort==='price-desc'?b.price-a.price:sort==='rating'?b.rating-a.rating:a.rank-b.rank);}
