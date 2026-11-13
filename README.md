# saigo

プロキックボクサー **SAIGO**（TARGET SHIBUYA / 初代 STRIKE NEXUS フェザー級チャンピオン）の公式サイトです。

HTML / CSS / JavaScript のみで構成した静的サイトです。ビルドツールやパッケージのインストールは不要で、ファイルをそのまま配信すれば動きます。

- 確認用：GitHub Pages
- 本番：お客様確認後、Cloudflare Pages で公開予定

---

## ディレクトリ構成

```
.
├── index.html              # トップページ（オープニング・各セクション）
├── cheer.html              # 激励賞ページ（SNS などから直接開いてもらう用）
├── shop.html               # SHOP ページ（同上）
├── checkout-demo.html      # 激励賞の仮の決済ページ（Stripe 接続前の確認用・本番前に削除）
├── .nojekyll               # GitHub Pages で Jekyll 処理を無効化
├── README.md
└── assets/
    ├── css/
    │   └── style.css       # 全スタイル（リセット・レイアウト・アニメーション・レスポンシブ）
    ├── js/
    │   └── main.js         # 動き・試合データ（後述）
    └── images/
        ├── favicon-32.png        # ファビコン（キャラの顔・白フチ）
        ├── favicon-192.png       # ファビコン大（Android など）
        ├── apple-touch-icon.png  # iPhone のホーム画面用（黒地）
        ├── chara-stand.webp      # キャラクター（SHOP の見出し横）※背景透過
        ├── goods-tshirt.webp     # SHOP：オフィシャルTシャツ
        ├── saigo-brush.webp      # 筆文字ロゴ（透過）
        ├── saigo-hero.webp       # ヒーロー用人物切り抜き（透過）
        ├── saigo-profile.webp     # プロフィール写真
        ├── sponsor-champion.webp  # ギャラリー 01
        ├── sponsor-victory.webp   # ギャラリー 02
        ├── sponsor-ring.webp      # ギャラリー 03
        └── sponsor-entrance.webp  # ギャラリー 04
```

外部読み込みは Google Fonts（Barlow Condensed / Noto Sans JP）と YouTube 埋め込みのみです。

### 表示速度のための工夫

- 写真は WebP（幅 1000px 程度）に変換して軽量化。新しい写真も `cwebp -q 80 -resize 1000 0 元画像.jpg -o 出力.webp` などで変換してから置く
- 紹介動画はサムネイルだけ先に表示し、タップされてから YouTube プレーヤーを読み込む
- ヒーローの煙アニメーションは、画面外にある間は停止
- スマホではヘッダーのぼかし・煙のゆらぎフィルターを省略し、描画負荷を軽減
- 日本語フォントは可変フォント（1セットで全ウェイト）を読み込み
- スマホでは日本語を端末内蔵フォント（iPhone はヒラギノ）で表示し、Webフォントをダウンロードしない（Android など内蔵ヒラギノのない端末は Noto Sans JP）。ヒーローの煙も静止表示
- PC はセクションごとにスナップするスクロール、スマホはブラウザ標準のページスクロール。iOS Safari では入れ子スクロール＋スナップで描画が追いつかなくなるため、スマホではスナップを使わず、各セクションも最初から表示している

## ページ構成

| セクション | ID | 内容 |
| --- | --- | --- |
| オープニング | — | 煙＋斬撃＋ロゴの演出。同じタブでは初回のみ再生（ロゴクリックで再生し直し） |
| ヒーロー | `#top` | 筆文字ロゴ・キャッチコピー・CTA |
| 概要 | `#next-fight` / `#career` | 次戦情報（カウントダウン）・戦績サマリー・紹介動画 |
| プロフィール | `#profile` | メッセージ・基本データ |
| 戦績 | — | 勝率リング・数値カウントアップ・試合カード一覧（5件＋もっと見る） |
| 応援（入口） | `#support` | 激励賞ページ・SHOP ページへの入口カード2枚 |
| スポンサー | `#sponsor` | 見出し・ギャラリー・プラン・開始までの流れ・お問い合わせボタン |
| お問い合わせ | `#contact` | フォーム（送信機能は未実装） |

### 別ページ（cheer.html・shop.html）

- SNS やQRコードからそのまま開いてもらうための単独ページです。オープニング演出・セクションごとのスナップはなく、普通にスクロールします
- **ヘッダー（メニュー）とフッターは3ファイル（index.html・cheer.html・shop.html）にそれぞれ書いてあります。** メニューやSNSリンクを変えるときは3ファイルとも直してください。今いるページのメニューには `aria-current="page"` を付けます
- トップのセクションへは `index.html#contact` のようにリンクします。`#` 付きで開いたトップは、オープニング演出を飛ばしてその欄へ移動します
- CSS（`style.css`）と JS（`main.js`）は全ページ共通です

`prefers-reduced-motion`（OS の「視差効果を減らす」設定）が有効な場合は、オープニングや各種アニメーションを省略して表示します。

## ローカルで確認する

`index.html` をブラウザで直接開いても表示できますが、YouTube 埋め込みは `file://` では再生エラーになるため、簡易サーバーでの確認をおすすめします。

```sh
python3 -m http.server 8000
# → http://localhost:8000
```

## 更新ガイド

### 試合結果を追加する

`assets/js/main.js` 冒頭の `fights` 配列の**先頭**に1件追加します（新しい順）。

```js
{ result: '勝利', opponent: '対戦相手', finish: 'KO', time: '2R 1:23', weight: 'フェザー級（-57.5kg）', event: '大会名', venue: '会場', date: '2026.11.08' },
```

- `result` は `'勝利'` / `'敗北'` / `'引分'` / `'EX'`（エキシビション）のいずれか
- 先頭の試合が大きいカードで表示され、通し番号は自動で振られます

**集計値は自動計算されません。** 試合を追加したら以下も手動で更新してください。

| 場所 | 項目 |
| --- | --- |
| `index.html` `.stats` | 通算試合数・勝敗・勝率・連勝数 |
| `index.html` `.record-summary` | `13 FIGHTS`・`WINNING STREAK`・各 `data-count`（勝率・勝/敗/分/NC・KO率・直近5試合） |
| `assets/css/style.css` `@keyframes rate-fill` と `prefers-reduced-motion` 内の `--rate` | 勝率リングの塗り（例：`61.5%`） |

### グッズを追加・変更する

`assets/js/main.js` 冒頭の `goods` 配列を編集します（配列の順に表示）。

```js
{ name: 'オフィシャルTシャツ', category: 'APPAREL', price: 3500, status: '販売中', image: 'assets/images/goods-tshirt.webp', url: 'https://example.base.shop/items/123' },
```

- `status` は `'販売中'` / `'近日発売'` / `'売り切れ'` のいずれか（画像左上に ON SALE / COMING SOON / SOLD OUT と表示）
- `price` は税込価格を数値で。未定なら `null`（「価格未定」と表示）
- `image` は正方形の商品写真を `assets/images/` に置いてパスを指定（`cwebp -q 80 -resize 800 0 元画像.jpg -o goods-xxx.webp` など）。未定なら `null` でロゴ入りの仮画像を表示
- `url` に購入ページ（BASE・STORES など）を入れるとカード全体が別タブで開くリンクになります。売り切れの商品はリンクになりません

### 激励賞の金額・特典・決済リンク

- **金額**：`cheer.html` の `.cheer-amounts` 内の `<label>` を増減。`value` は円単位の数値。最初に選ばれている金額は `checked` を付けたもの
- **特典**：`cheer.html` の `.cheer-perks` の `<li data-perk-min="10000">` を編集。選んだ金額が `data-perk-min` 以上の特典が点灯します
- **Tシャツ特典の金額**：`main.js` の `CHEER_NAME_PERK_MIN`（この金額以上で「このお名前がTシャツに入ります」と表示）。特典欄の `data-perk-min` もあわせて変更
- **決済**：`main.js` の `CHEER_PAYMENT_LINKS` に金額ごとの Stripe Payment Link の URL を入れると、ボタンでその決済ページへ移動します。空のあいだは「準備中」と表示
- **仮の決済ページ（デモ）**：`main.js` の `CHEER_DEMO_CHECKOUT` が `true` の間は、Stripe のリンクが未設定の金額で「贈る」を押すと `checkout-demo.html` が開きます（金額・お名前・メッセージの確認と「テスト支払いを完了する」ボタンのみ。カード入力なし・実際の決済なし）。完了ボタンで `cheer.html?cheer=thanks&amount=金額` に戻り、お礼表示まで確認できます
- **支払い後のお礼表示**：Stripe の Payment Link 設定「支払い後」→「顧客をウェブサイトにリダイレクトする」に、`https://（本番ドメイン）/cheer.html?cheer=thanks&amount=10000` のように**金額ごと**の URL を設定します。激励賞ページに戻ると、フォームの代わりにお礼（キャラ・Xでシェア・Instagram）が表示されます。`amount` が `CHEER_NAME_PERK_MIN` 以上なら「Tシャツへのお名前掲載はSNSでお知らせ」も表示。確認用：ローカルで `http://localhost:8000/cheer.html?cheer=thanks&amount=10000` を開く
- **スプレッドシート保存**：未実装。`main.js` の `initCheerForm` 内の `record`（金額・お名前・匿名・メッセージ・日時）を、Google Apps Script（`CHEER_SHEET_ENDPOINT`）へ送ってから決済ページへ移動する想定です

### 次戦情報を変更する

`index.html` の `.next-fight` 内を書き換えます。カウントダウンは `.next-countdown` の属性で制御しています。

```html
<div class="next-countdown" ... data-fight-date="2026-11-08" data-event="RISE 203">
```

- `data-fight-date`：試合日（日本時間、`YYYY-MM-DD`）。前日までは「あと○日」、当日は「本日開催」、翌日以降は「試合終了」と自動で切り替わります
- `data-event`：当日・終了後に表示する大会名
- `<time datetime="...">` の日時表示もあわせて変更してください

### 紹介動画を差し替える

`index.html` の `.video-frame iframe` の `src` にある動画 ID（`embed/` の後ろ）を差し替えてください。
YouTube の URL が `https://www.youtube.com/watch?v=XXXX` なら、`XXXX` の部分が動画 ID です。

### 画像を差し替える

`assets/images/` の同名ファイルを置き換えれば反映されます。比率が大きく変わる場合は `index.html` の `width` / `height` 属性も合わせて更新してください。

- `saigo-hero.webp` は背景を透過した人物の切り抜き画像を想定しています（縦長）
- 写真の上に Instagram の UI（「1/4」表示やアイコン）が写り込まないよう、スクリーンショット由来の画像はトリミングしてください

## 公開手順

### GitHub Pages（お客様確認用）

1. このリポジトリを GitHub に push
2. GitHub の **Settings → Pages** を開く
3. **Source** を「Deploy from a branch」、**Branch** を `main` / `/ (root)` にして保存
4. 数分後に `https://shoheyosaka.github.io/saigo/` で公開されます

パスはすべて相対パスで書いているため、`/saigo/` のようなサブディレクトリ配信でもそのまま動作します。

### Cloudflare Pages（本番）

1. Cloudflare ダッシュボード → **Workers & Pages → Create → Pages → Connect to Git**
2. このリポジトリを選択
3. ビルド設定
   - Framework preset：`None`
   - Build command：（空欄）
   - Build output directory：`/`
4. **Save and Deploy**
5. **Custom domains** から本番ドメインを設定

以降は `main` に push するたびに自動デプロイされます。本番公開後に GitHub Pages を止める場合は、Settings → Pages で無効化してください。

## 本番公開前チェックリスト

- [ ] **激励賞（デモの片付け）**：`main.js` の `CHEER_DEMO_CHECKOUT` を `false` にし、`checkout-demo.html` を削除する
- [ ] **激励賞**：Stripe Payment Link の作成と `CHEER_PAYMENT_LINKS` への設定、スプレッドシート保存（Google Apps Script）の実装。特典の内容と金額（現在は仮で「¥1,000〜お礼メッセージ」「¥10,000〜Tシャツにお名前」）をお客様に確認
- [ ] **お問い合わせフォーム**：現在は送信せず「準備中」メッセージを表示するだけです。Formspree・Googleフォーム・Cloudflare Workers などで送信先を実装する
- [ ] **プロフィール写真**：現在の計量写真は 430px 程度と小さく、PC ではやや粗く見えるため、可能なら高解像度版（幅 800px 以上）に差し替える
- [ ] **写真の使用許諾**：RISE 宣材写真・計量写真・大会写真の Web 掲載について、撮影者・主催者の許諾を確認
- [ ] **フッターの電話番号・LINE ID**：公開して問題ないかお客様に確認
- [ ] **OGP 画像**：`og:image` は絶対 URL が必要なため、本番ドメイン確定後に `index.html`・`cheer.html`・`shop.html` の `<head>` に追加する（激励賞・SHOP は SNS で共有されるので、それぞれ専用の画像があると効果的）（例：`<meta property="og:image" content="https://example.com/assets/images/ogp.jpg">`、1200×630px 推奨）
- [ ] **プロフィールの年齢・年数**：「29歳」「4年目」は固定値のため、誕生日・年明けに更新する
- [ ] **スポンサーロゴ**：スポンサーが決まったら、スポンサー欄にロゴを掲載する枠を追加する（募集中の空き枠は 2026-11 に削除済み）
- [ ] **グッズ**：現在の4商品（Tシャツ・タオル・キャップ・ステッカー）は仮の内容です。実際の商品名・価格・写真・購入ページに差し替える
