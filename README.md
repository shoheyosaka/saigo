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
├── cheer.html              # サポーターページ（SNS などから直接開いてもらう用）
├── shop.html               # SHOP ページ（同上）
├── checkout-demo.html      # サポーターの仮の決済ページ（Stripe 接続前の確認用・本番前に削除）
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
        ├── chara-stand.webp      # キャラクター（トップのSHOPカード・お礼画面）※背景透過
        ├── shop-logo.webp        # SHOP 上部のロゴ（キャラ＋ゴリラ＋SAIGO、白フチのステッカー風）
        ├── goods-tshirt.webp     # SHOP：オフィシャルTシャツ
        ├── goods-tshirt-cut.webp # 同じTシャツの背景を透明にしたもの（トップのサポーターカード）
        ├── partner-1〜4-*.webp   # 現在のスポンサーのロゴ（番号順に表示）
        ├── saigo-brush.webp      # 筆文字ロゴ（透過）
        ├── saigo-hero.webp       # ヒーロー用人物切り抜き（透過）
        ├── saigo-profile.webp     # プロフィール写真
        ├── gallery-01〜22.webp   # ギャラリーの写真（表示順は index.html の並び）。各セクションの背景写真にも流用
        ├── sponsor-placement.webp # スポンサー欄「ロゴ掲載例」の写真
        ├── supporter-team-tshirt.webp # SAIGOとTシャツを着たセコンド2人（サポーターページの特典欄・SHOPの「リングサイドでも」。STRIKEロゴは切り落とし済み）
        ├── intro-1〜4.webp       # オープニングで一瞬ずつ映す写真（軽量版）
        └── og-top / og-cheer / og-shop.jpg  # SNS 共有画像（1200×630）
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
| オープニング | — | 試合写真のフラッシュ＋煙＋斬撃＋ロゴの演出。同じタブでは初回のみ再生（ロゴクリックで再生し直し） |
| ヒーロー | `#top` | 筆文字ロゴ・キャッチコピー・CTA |
| 次戦 | `#next-fight` | 次戦の告知画像・次戦情報（カウントダウン） |
| プロフィール | `#profile` | メッセージ・基本データ |
| 戦績 | `#career` | 勝率リング・数値カウントアップ・試合カード一覧（5件＋もっと見る） |
| ギャラリー | `#gallery` | 上：写真22枚の立体スライダー（奥の写真が前に出てくる。PCは矢印・ドラッグ、スマホはスワイプ、自動送りあり）／下：試合動画（YouTube 3本を横スクロール。サムネイルを押すと再生。同時再生はしない） |
| 応援（入口） | `#support` | サポーターページ・SHOP ページへの入口カード2枚 |
| スポンサー | `#sponsor` | 見出し・スポンサーロゴ・ロゴ掲載例（トランクスの写真）・開始までの流れ・お問い合わせボタン |
| お問い合わせ | `#contact` | セクション全体の背景に写真（白黒＋クリーム色を重ねた明るいトーン）・フォーム（送信機能は未実装） |

### 別ページ（cheer.html・shop.html）

- SNS やQRコードからそのまま開いてもらうための単独ページです。オープニング演出・セクションごとのスナップはなく、普通にスクロールします
- **ヘッダー（メニュー）とフッターは3ファイル（index.html・cheer.html・shop.html）にそれぞれ書いてあります。** メニューやSNSリンクを変えるときは3ファイルとも直してください。SNSアイコン（Instagram・X・Threads）は1ファイルにつき3か所（スマホ用ヘッダーの `.header-socials`、メニュー内の `.menu-socials`、フッターの `.footer-socials`）にあります。今いるページのメニューには `aria-current="page"` を付けます
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

### サポーター（旧：激励賞）の金額・特典・決済リンク

※ 名称は「激励賞」から「サポーター」に変更しました（ボタンは「サポーターになる」）。ファイル名・CSS/JS の名前は `cheer` のままです。Stripe の商品名なども「サポーター」にそろえてください。

- **金額**：`cheer.html` の `.cheer-amounts` 内の `<label>` を増減。`value` は円単位の数値。最初に選ばれている金額は `checked` を付けたもの
- **特典**：`cheer.html` の `.cheer-perks` の `<li data-perk-min="10000">` を編集。選んだ金額が `data-perk-min` 以上の特典が点灯します
- **Tシャツ特典の金額**：`main.js` の `CHEER_NAME_PERK_MIN`（この金額以上で「このお名前がTシャツに入ります」と表示）。特典欄の `data-perk-min` もあわせて変更
- **決済**：`main.js` の `CHEER_PAYMENT_LINKS` に金額ごとの Stripe Payment Link の URL を入れると、ボタンでその決済ページへ移動します。空のあいだは「準備中」と表示
- **仮の決済ページ（デモ）**：`main.js` の `CHEER_DEMO_CHECKOUT` が `true` の間は、Stripe のリンクが未設定の金額で「贈る」を押すと `checkout-demo.html` が開きます（金額・お名前・メッセージの確認と「テスト支払いを完了する」ボタンのみ。カード入力なし・実際の決済なし）。完了ボタンで `cheer.html?cheer=thanks&amount=金額` に戻り、お礼表示まで確認できます
- **支払い後のお礼表示**：Stripe の Payment Link 設定「支払い後」→「顧客をウェブサイトにリダイレクトする」に、`https://（本番ドメイン）/cheer.html?cheer=thanks&amount=10000` のように**金額ごと**の URL を設定します。サポーターページに戻ると、フォームの代わりにお礼（キャラ・Xでシェア・Instagram）が表示されます。`amount` が `CHEER_NAME_PERK_MIN` 以上なら「Tシャツへのお名前掲載とTシャツプレゼントは追ってご連絡」も表示。確認用：ローカルで `http://localhost:8000/cheer.html?cheer=thanks&amount=10000` を開く
- **メールアドレス（必須）**：お礼メッセージ・特典の連絡先。未入力・形式違いのときは欄の下にエラーを出して先へ進ませません。Stripe の決済ページへ移動するときは `prefilled_email` を付けて、同じアドレスを最初から入力済みにします（お客様の入力は1回だけ）
- **スプレッドシート保存**：未実装。`main.js` の `initCheerForm` 内の `record`（金額・お名前・匿名・メッセージ・メールアドレス・日時）を、Google Apps Script（`CHEER_SHEET_ENDPOINT`）へ送ってから決済ページへ移動する想定です。スプレッドシートにはこの内容が1行にまとまって残ります

### ギャラリーの写真を追加・入れ替える

`index.html` の `.depth-stage` に `<li class="depth-card" data-index="番号">…</li>` を追加・削除します（並び順＝表示順。`data-index` は 0 から順番に振り直す。枚数表示とバーの長さは自動）。

- 画像は `assets/images/gallery-番号.webp`。横幅 1400px 程度の WebP にする（例：`cwebp -q 78 -resize 1400 0 元画像.jpg -o gallery-19.webp`）
- `<img>` の `width`・`height` は画像の実寸、`alt` は写真の説明、`.depth-caption` は番号と英字ラベル（ENTRANCE / FIGHT など）
- 自動で次へ進む間隔は `assets/js/main.js` の `DEPTH_AUTOPLAY_MS`（ミリ秒）

### 写真を背景に使う（全ページ共通のトーン）

背景写真は `<div class="photo-bg" aria-hidden="true"><img src="…" alt=""></div>` で入れます。少し色を抜いて暗くし、オレンジを薄く重ねる処理が自動でかかるので、どの写真を使っても全体のトーンがそろいます。

- 親要素に `position: relative; isolation: isolate;` が必要（既存の箇所を参照）
- 写真のどこを見せるか：`style="--photo-pos: 50% 30%"`（横・縦の位置）
- 暗さのかけ方：CSS で `--photo-shade` にグラデーションを指定（文字が乗る側を暗く）
- スクロールに合わせて写真をゆっくり動かすときは `<img>` に `data-parallax` を付ける

### スポンサーの「ロゴの掲出位置」を変える

`index.html` の `.placement`（見出し「ロゴ掲載例」）。写真は `sponsor-placement.webp`。ロゴが写った新しい写真があれば差し替えます。

### スポンサーのロゴを追加・変更する

`index.html` の `.partner-logos` に `<li><img …></li>` を1行追加します（並び順＝表示順）。

- ロゴ画像は `assets/images/partner-番号-名前.webp`。余白を詰めて切り取り、横幅 800px 程度にしてから置く
- 白いカードの中央に表示されます。背景色つきのロゴ（Re:SHAL の赤など）は、`<li>` にクラスを付けてカードの背景色をロゴと同じ色にする（`.partner-logo-red` 参照）
- .ai / .pdf のロゴは、Mac なら `qlmanage -t -s 3000 -o 出力先 ファイル.pdf` で PNG にできます（.ai は PDF 互換で保存されている場合）

### 次戦情報を変更する

`index.html` の `.next-fight` 内を書き換えます。告知画像は `.next-fight-poster` の `<img>`（`assets/images/next-fight-*.webp`）を差し替えます。カウントダウンは `.next-countdown` の属性で制御しています。

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

- [ ] **サポーター（デモの片付け）**：`main.js` の `CHEER_DEMO_CHECKOUT` を `false` にし、`checkout-demo.html` を削除する
- [ ] **サポーター**：Stripe Payment Link の作成と `CHEER_PAYMENT_LINKS` への設定、スプレッドシート保存（Google Apps Script）の実装。特典の内容と金額（現在：「¥1,000〜お礼メッセージ」「¥10,000〜試合毎に使用するTシャツにお名前＋オフィシャルTシャツ1枚プレゼント」）をお客様に確認。Tシャツを送るため、¥10,000以上の Payment Link では「配送先住所を収集する」をオンにする
- [ ] **お問い合わせフォーム**：現在は送信せず「準備中」メッセージを表示するだけです。Formspree・Googleフォーム・Cloudflare Workers などで送信先を実装する
- [ ] **プロフィール写真**：現在の計量写真は 430px 程度と小さく、PC ではやや粗く見えるため、可能なら高解像度版（幅 800px 以上）に差し替える
- [ ] **写真の使用許諾**：RISE 宣材写真・計量写真・大会写真の Web 掲載について、撮影者・主催者の許諾を確認
- [ ] **フッターの電話番号・LINE ID**：公開して問題ないかお客様に確認
- [ ] **OGP 画像のURL**：共有画像（`og-top.jpg`・`og-cheer.jpg`・`og-shop.jpg`）は作成済み。`og:image` は絶対 URL が必要なため、今は確認用の `https://shoheyosaka.github.io/saigo/…` を指定している。本番ドメインが決まったら `index.html`・`cheer.html`・`shop.html` の `og:image` と `twitter:image` を本番の URL に書き換える
- [ ] **写真の利用確認**：RISE の写真（©RISE / Chiyo Yamamoto）を背景・切り抜き・共有画像に使っているので、加工しての利用が問題ないか確認する
- [ ] **プロフィールの年齢・年数**：「29歳」「4年目」は固定値のため、誕生日・年明けに更新する
- [ ] **グッズ**：現在の4商品（Tシャツ・タオル・キャップ・ステッカー）は仮の内容です。実際の商品名・価格・写真・購入ページに差し替える
