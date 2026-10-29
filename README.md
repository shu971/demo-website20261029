# NOMA — ブラウザ操作用 通販デモ

公開URL：https://demo-website20261029.pages.dev/

ログインなしで「商品検索 → 比較 → カート → 注文確認 → デモ購入完了 → 購入履歴」まで試せる架空ストア。実際の商品販売・購入・決済・発送はありません。

## Cloudflare Pagesで公開

Cloudflareダッシュボードから **Workers & Pages → Create application → Pages → Import an existing Git repository** を選び、`shu971/demo-website20261029` を接続します。

| 設定 | 値 |
| --- | --- |
| Production branch | `main` |
| Framework preset | `None` |
| Build command | 空欄 |
| Build output directory | `dist` |
| Root directory | 既定（リポジトリルート） |
| 環境変数・Functions・DB | 不要 |

Freeプランのままで利用できる静的サイトです。独自ドメインの購入は不要、発行される `pages.dev` URLで公開します。Functions、Workersの実行、KV、D1、R2、外部API、外部フォント、分析サービスを使いません。全配信ファイルは約150KB以下（実サイズはファイルを参照）です。静的アセットへのリクエストは無料・無制限。Freeのビルド上限は月500回。料金・上限は2026-10-29に以下の公式文書で確認。

- https://developers.cloudflare.com/pages/functions/pricing/
- https://developers.cloudflare.com/pages/platform/limits/
- https://developers.cloudflare.com/pages/configuration/git-integration/

## ローカル確認

`dist` をHTTP静的サーバーで配信します。例：`python3 -m http.server 8080 --directory dist`。ファイルのダブルクリック（file://）ではES Modulesを読み込めません。

検証：`node --test tests/core.test.mjs`

## 仕様

- 4カテゴリ・18商品。商品、価格、レビュー、在庫はすべて架空。
- 検索（全角英数字正規化、複数キーワードAND）、カテゴリ・上限価格・在庫フィルタ、価格・評価での並び替え。
- カラー2種、数量1〜9。商品画像は自作SVGの代表色で、色選択による画像切り替えはありません。
- カート編集、クーポン `DEMO10` で10%割引、1円未満切り捨て。
- 表示は税込。割引後小計が5,000円以上ならデモ送料無料、それ未満は500円。
- 架空の固定配送先と「デモ決済（請求なし）」で注文。個人情報入力欄なし。
- 完了ダイアログに商品・カラー・数量・割引・送料・合計を表示。
- マイページに、同じブラウザで行った購入の最新5件を表示。各注文から10分で失効。
- カートと履歴はlocalStorageのみ。サーバー保存なし。ページ表示中は毎秒期限を確認、閉じている間に期限を迎えた履歴は次回起動時に削除。
- ストレージ利用不可時はページのメモリに保持し、履歴画面に再読み込みで消える旨を表示。
- フッターのリセットでデモデータを消去。
- 上部に常時デモ表示。通常のリンク、ラベル付きフォーム、ボタンで操作可能。
- Cloudflare `_headers` により `connect-src 'none'`、`form-action 'none'`、埋め込み禁止、Payment API禁止を指定。
- URLはハッシュルーティング。直接商品詳細を渡す場合は `/#/product/p09` の形式。

## Museへの依頼例

```text
以下のURLは、実際の購入・決済・発送を行わない通販デモです。
ログインや個人情報の入力は不要です。

このサイトで5,000円以下のキッチン用品を探し、候補を比較してください。
ステンレスボトル 500mlをサンド色で1点カートに入れ、
デモ注文を確定してください。
最後にマイページの購入履歴で、商品名・カラー・数量・合計金額を確認して報告してください。

https://demo-website20261029.pages.dev/
```

## リサーチとデザイン

Amazon（検索中心のヘッダー、詳細→カート→確認→履歴）、楽天市場（カテゴリ・価格で絞り込む導線）、UNIQLO（カテゴリと商品グリッド）、IKEA（暮らしの文脈とカテゴリ探索）を参照。各ブランドのロゴ、商標、配色、商品写真は転用せず、架空ブランドNOMAとして白・チャコール・オリーブの独自デザインで制作。絵文字・左ボーダーによるアクセントカードは不使用。商品画像・キービジュアルは自作SVG。

- https://www.aboutamazon.jp/news/guide/how-to-shop-in-amazon
- https://event.rakuten.co.jp/beginner/search/
- https://www.uniqlo.com/jp/ja/
- https://www.ikea.com/jp/ja/

## 検証

- Nodeテスト：送料の閾値、割引、空カート、履歴TTL境界、最新5件、複合フィルタ、全画像の存在、外部通信コード不在、CSP設定。
- 実ブラウザ：検索「水筒」→ボトル詳細→サンド→カート→DEMO10→注文確認→完了ダイアログ（合計2,840円）→購入履歴。
- PC表示を目視確認。スマートフォン向けレイアウトはCSSブレークポイントを実装。
