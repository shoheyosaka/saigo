'use strict'

/* ==========================================================================
   試合データ（新しい順）
   result: '勝利' | '敗北' | '引分' | 'EX'
   ========================================================================== */
const fights = [
  { result: '勝利', opponent: '拳剛', finish: '判定（2-0）', time: '3R 3:00', weight: 'フェザー級（-57.5kg）', event: 'RISE EVOL OSAKA Vol.3', venue: 'テクスピア大阪', date: '2026.08.30' },
  { result: 'EX', opponent: '小野祥平', finish: '—', time: '—', weight: 'スペシャルエキシビションマッチ', event: 'STRIKE NEXUS 08', venue: 'GENスポーツパレス', date: '2026.03.08' },
  { result: '勝利', opponent: '清重真平', finish: 'KO', time: '2R 2:26', weight: 'STRIKE NEXUSフェザー級57.5kgタイトルマッチ', event: 'STRIKE NEXUS 07', venue: 'GENスポーツパレス', date: '2025.12.21' },
  { result: '敗北', opponent: '歩希', finish: 'KO', time: '3R 2:50', weight: 'NEXT GOAT RISEルール / 58kg契約', event: 'キックボクシングフェス. GOAT', venue: '後楽園ホール', date: '2025.10.30' },
  { result: '勝利', opponent: 'トラン・グエン・ロク', finish: '判定（3-0）', time: '3R 3:00', weight: 'HEAT KICK 58kg契約 3分3R', event: 'HEAT56 in VIETNAM', venue: 'The Grand Ho Tram', date: '2025.05.24' },
  { result: '敗北', opponent: '白石舜', finish: '判定（3-0）', time: '3R 3:00', weight: 'フェザー級（-57.5kg）', event: 'IBGメディア presents RISE186', venue: '後楽園ホール', date: '2025.02.23' },
  { result: '勝利', opponent: '松下竜之助', finish: '判定（3-0）', time: '3R 3:00', weight: '初代フェザー級王座決定戦 57.5kg', event: 'NEXUS MANIA 2024', venue: 'GENスポーツパレス', date: '2024.12.22' },
  { result: '勝利', opponent: '田上健太', finish: 'KO', time: '2R 1:10', weight: '-60kg契約', event: 'FIGHT CLUB.2', venue: '—', date: '2024.10.05' },
  { result: '勝利', opponent: '悠里', finish: 'TKO', time: '2R 0:29', weight: 'フェザー級57.5kg', event: 'STRIKE NEXUS 03', venue: 'ニューピアホール', date: '2024.08.25' },
  { result: '勝利', opponent: '大島広也', finish: '判定（3-0）', time: '3R 3:00', weight: 'フェザー級57.5kg', event: 'STRIKE NEXUS 02', venue: 'GENスポーツパレス', date: '2024.05.12' },
  { result: '敗北', opponent: 'SHOTA', finish: 'TKO', time: '1R 1:29', weight: 'PRO-KICKフェザー級（-57.5kg）3R', event: 'KROSS×OVER.24 -2023 CLIMAX-', venue: 'GENスポーツパレス', date: '2023.12.17' },
  { result: '敗北', opponent: '門脇碧泉', finish: '判定（2-0）', time: '3R 3:00', weight: 'King of Rookie2023 新人王決定戦1回戦', event: 'Stand up vol.19「King of Rookie2023」', venue: 'ゴールドジムサウス東京ANNEX', date: '2023.09.24' },
  { result: '勝利', opponent: '山本亘哉', finish: '判定（3-0）', time: '3R 3:00', weight: '-57.5kg契約3R', event: 'Stand up vol.17', venue: 'ゴールドジムサウス東京ANNEX', date: '2023.04.23' },
  { result: '引分', opponent: '叶和', finish: '判定（1-0）', time: '3R 3:00', weight: 'フェザー級（-57.5kg）', event: 'RISE EVOL.11', venue: '新宿FACE', date: '2022.11.03' },
]

/* ==========================================================================
   グッズデータ（表示したい順）
   status: '販売中' | '近日発売' | '売り切れ'
   price : 税込価格（数値）。未定なら null
   image : assets/images/ 内の画像パス。未定なら null（ロゴ入りの仮画像を表示）
   url   : 購入ページ（BASE・STORES など）の URL。無ければ null
   ========================================================================== */
const goods = [
  { name: 'オフィシャルTシャツ', category: 'APPAREL', price: null, status: '近日発売', image: 'assets/images/goods-tshirt.webp', url: null },
  { name: 'オフィシャルタオル', category: 'GOODS', price: null, status: '近日発売', image: null, url: null },
  { name: 'オフィシャルキャップ', category: 'APPAREL', price: null, status: '近日発売', image: null, url: null },
  { name: 'ステッカー', category: 'GOODS', price: null, status: '近日発売', image: null, url: null },
]

/* ==========================================================================
   激励賞（決済・保存は未実装）
   CHEER_PAYMENT_LINKS : 金額ごとの Stripe Payment Link の URL。空のあいだは「準備中」と表示
   CHEER_SHEET_ENDPOINT: スプレッドシートに保存する Google Apps Script の URL（未設定なら空）
   CHEER_NAME_PERK_MIN : この金額以上で「試合毎に使用するTシャツにお名前」「Tシャツ1枚プレゼント」の特典がつく
   ========================================================================== */
const CHEER_PAYMENT_LINKS = {
  1000: '',
  5000: '',
  10000: '',
  30000: '',
  50000: '',
}
const CHEER_SHEET_ENDPOINT = ''
// true の間、Stripe のリンクが未設定の金額は仮の決済ページ（checkout-demo.html）へ移動する。本番公開前に false にする
const CHEER_DEMO_CHECKOUT = true
const CHEER_NAME_PERK_MIN = 10000
// Stripe の「支払い後のリダイレクト先」を cheer.html?cheer=thanks&amount=金額 にすると、お礼表示になる
const cheerParams = new URLSearchParams(window.location.search)
const isCheerThanks = cheerParams.get('cheer') === 'thanks'

const INITIAL_FIGHT_COUNT = 5
const INTRO_SESSION_KEY = 'saigo-intro-seen'
const INTRO_DURATION = 5200

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const easeOutCubic = (progress) => 1 - Math.pow(1 - progress, 3)

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character])

/* Opening intro ---------------------------------------------------------- */
function markIntroSeen() {
  try {
    window.sessionStorage.setItem(INTRO_SESSION_KEY, '1')
  } catch {
    // The animation still works when storage is unavailable.
  }
}

function focusTop() {
  if (window.location.hash) {
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
  }
  window.requestAnimationFrame(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    document.querySelector('main')?.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  })
}

/* 指定した要素へ瞬時に移動する（CSS の scroll-behavior: smooth を上書き）。
   画像・フォントの読み込みで上の高さが変わり位置がずれるため、読み込み完了後にもう一度合わせる */
function jumpTo(element) {
  if (!element) return
  // 表示アニメーション（下から浮き上がる）の途中だと移動先がずれるので、移動先のセクションは即表示にする
  const section = element.closest('.scroll-reveal')
  if (section) {
    section.style.transition = 'none'
    section.classList.add('is-visible')
  }
  const jump = () => element.scrollIntoView({ block: 'start', behavior: 'instant' })
  window.requestAnimationFrame(jump)
  if (document.readyState !== 'complete') window.addEventListener('load', jump, { once: true })
}

function initIntro() {
  const root = document.documentElement
  const darkShell = document.querySelector('.dark-shell')
  // 激励賞・SHOP などの別ページにはオープニング演出がない
  if (!darkShell) return
  let timer = 0

  const finishIntro = () => {
    window.clearTimeout(timer)
    markIntroSeen()
    root.classList.remove('intro-active')
    document.body.style.overflow = ''
    darkShell.classList.add('top-ready')
    focusTop()
  }

  const startIntro = () => {
    if (prefersReducedMotion()) {
      finishIntro()
      return
    }
    darkShell.classList.remove('top-ready')
    // display:none を挟むことで CSS アニメーションを最初から再生し直す
    root.classList.remove('intro-active')
    void root.offsetWidth
    root.classList.add('intro-active')
    document.body.style.overflow = 'hidden'
    window.clearTimeout(timer)
    timer = window.setTimeout(finishIntro, INTRO_DURATION)
  }

  document.querySelector('[data-intro-skip]').addEventListener('click', finishIntro)
  document.querySelectorAll('[data-replay-intro]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault()
      closeMenu()
      focusTop()
      startIntro()
    })
  })

  // 別ページから「index.html#contact」などで来たときは、トップへ戻さずその欄へ移動する
  const hashTarget = window.location.hash.length > 1 ? document.getElementById(window.location.hash.slice(1)) : null
  if (hashTarget) {
    root.classList.remove('intro-active')
    darkShell.classList.add('top-ready')
    jumpTo(hashTarget)
    return
  }

  focusTop()
  if (root.classList.contains('intro-active')) {
    startIntro()
  } else {
    darkShell.classList.add('top-ready')
  }
}

/* Hero text: split into characters for the staggered reveal --------------- */
function initStaggerText() {
  document.querySelectorAll('[data-stagger]').forEach((element) => {
    const delay = Number(element.dataset.delay ?? 0)
    const fragment = document.createDocumentFragment()
    const labelParts = []
    let index = 0

    element.childNodes.forEach((node) => {
      if (node.nodeName === 'BR') {
        fragment.append(document.createElement('br'))
        labelParts.push(' ')
        index += 1
        return
      }
      Array.from(node.textContent).forEach((character) => {
        const span = document.createElement('span')
        span.className = 'reveal-character'
        span.setAttribute('aria-hidden', 'true')
        span.style.setProperty('--character-delay', `${delay + index * 0.035}s`)
        span.textContent = character === ' ' ? ' ' : character
        fragment.append(span)
        labelParts.push(character)
        index += 1
      })
    })

    element.classList.add('reveal-text', 'is-split')
    element.setAttribute('aria-label', labelParts.join(''))
    element.replaceChildren(fragment)
  })
}

/* Menu ------------------------------------------------------------------- */
const menuButton = document.querySelector('.menu-button')
const menuPanel = document.querySelector('.menu-panel')

function setMenuOpen(open) {
  menuButton.classList.toggle('is-open', open)
  menuPanel.classList.toggle('is-open', open)
  menuButton.setAttribute('aria-expanded', String(open))
  menuButton.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く')
}

function closeMenu() {
  setMenuOpen(false)
}

function initMenu() {
  menuButton.addEventListener('click', () => setMenuOpen(!menuButton.classList.contains('is-open')))
  menuPanel.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu))
}

/* Next fight countdown --------------------------------------------------- */
function getDaysUntil(fightDate) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(new Date())
  const getPart = (type) => Number(parts.find((part) => part.type === type)?.value)
  const todayInJapan = Date.UTC(getPart('year'), getPart('month') - 1, getPart('day'))
  const [year, month, day] = fightDate.split('-').map(Number)
  const fightDay = Date.UTC(year, month - 1, day)
  return Math.round((fightDay - todayInJapan) / 86_400_000)
}

function initCountdown() {
  const countdown = document.querySelector('.next-countdown')
  if (!countdown) return

  const label = countdown.querySelector('small')
  const value = countdown.querySelector('strong')
  const { fightDate, event } = countdown.dataset
  let daysUntilFight = getDaysUntil(fightDate)
  let isVisible = false
  let animationFrame = 0

  const setDisplayedDays = (days) => {
    const output = countdown.querySelector('[data-countdown-days]')
    if (output) output.textContent = String(days)
  }

  const animateDays = () => {
    window.cancelAnimationFrame(animationFrame)
    if (prefersReducedMotion()) {
      setDisplayedDays(daysUntilFight)
      return
    }
    const startedAt = performance.now()
    const duration = 600
    const update = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1)
      setDisplayedDays(Math.round(daysUntilFight * easeOutCubic(progress)))
      if (progress < 1) animationFrame = window.requestAnimationFrame(update)
    }
    animationFrame = window.requestAnimationFrame(update)
  }

  const render = () => {
    if (daysUntilFight > 0) {
      label.textContent = '試合まであと'
      value.className = ''
      value.innerHTML = '<span data-countdown-days>0</span><em>日</em>'
      if (isVisible || prefersReducedMotion()) animateDays()
      return
    }
    window.cancelAnimationFrame(animationFrame)
    label.textContent = event
    value.className = daysUntilFight === 0 ? 'countdown-today' : 'countdown-finished'
    value.textContent = daysUntilFight === 0 ? '本日開催' : '試合終了'
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      isVisible = entry.isIntersecting
      if (daysUntilFight <= 0) return
      if (isVisible) {
        animateDays()
      } else if (!prefersReducedMotion()) {
        window.cancelAnimationFrame(animationFrame)
        setDisplayedDays(0)
      }
    },
    { threshold: 0.4 },
  )
  observer.observe(countdown)

  render()
  window.setInterval(() => {
    const next = getDaysUntil(fightDate)
    if (next === daysUntilFight) return
    daysUntilFight = next
    render()
  }, 60_000)
}

/* Scroll reveal ---------------------------------------------------------- */
function initScrollReveal() {
  const sections = document.querySelectorAll('.scroll-reveal')
  // スマホは速いスクロールで空白が見えないよう、最初から表示しておく
  if (prefersReducedMotion() || window.matchMedia('(max-width: 780px)').matches) {
    sections.forEach((section) => section.classList.add('is-visible'))
    return
  }

  // 画面に入る少し手前で一度だけ表示する（戻ってきたときに再び隠さない）
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    },
    { threshold: 0, rootMargin: '0px 0px 15% 0px' },
  )

  sections.forEach((section) => observer.observe(section))
}

/* Record counters -------------------------------------------------------- */
function initRecordCounters() {
  const section = document.querySelector('.record-section')
  if (!section) return

  const counters = Array.from(section.querySelectorAll('[data-count]'))
  const format = (counter, value) => value.toFixed(Number(counter.dataset.decimals ?? 0))
  const reducedMotion = prefersReducedMotion()
  counters.forEach((counter) => {
    counter.textContent = format(counter, reducedMotion ? Number(counter.dataset.count) : 0)
  })

  if (reducedMotion) return

  let animationFrame = 0
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      section.classList.add('is-counted')

      const startedAt = performance.now()
      const duration = 1000
      const update = (now) => {
        const progress = Math.min((now - startedAt) / duration, 1)
        const eased = easeOutCubic(progress)
        counters.forEach((counter) => {
          counter.textContent = format(counter, Number(counter.dataset.count) * eased)
        })
        if (progress < 1) animationFrame = window.requestAnimationFrame(update)
      }
      animationFrame = window.requestAnimationFrame(update)
    },
    { threshold: 0.15 },
  )

  observer.observe(section)
}

/* Fight list ------------------------------------------------------------- */
function renderFightCard(fight, index) {
  return `
    <article class="fight-card${index === 0 ? ' fight-card-latest' : ''}">
      <div class="fight-card-top">
        <span class="result result-${escapeHtml(fight.result.toLowerCase())}">${escapeHtml(fight.result)}</span>
        <time datetime="${escapeHtml(fight.date.replaceAll('.', '-'))}">${escapeHtml(fight.date)}</time>
        <span class="fight-number">${String(fights.length - index).padStart(2, '0')}</span>
      </div>
      <div class="fight-card-main">
        <p>VS</p>
        <h3>${escapeHtml(fight.opponent)}</h3>
        <div class="decision">
          <strong>${escapeHtml(fight.finish)}</strong>
          <span>${escapeHtml(fight.time)}</span>
        </div>
      </div>
      <div class="fight-card-event">
        <strong>${escapeHtml(fight.event)}</strong>
        <p>${escapeHtml(fight.weight)}</p>
        <span>${escapeHtml(fight.venue)}</span>
      </div>
    </article>`
}

function initFightList() {
  const list = document.querySelector('.fight-list')
  const button = document.querySelector('.fight-more-button')
  if (!list || !button) return

  let showAll = false
  const render = () => {
    const visible = showAll ? fights : fights.slice(0, INITIAL_FIGHT_COUNT)
    list.innerHTML = visible.map(renderFightCard).join('')
    button.setAttribute('aria-expanded', String(showAll))
    button.querySelector('span').textContent = showAll ? '表示を閉じる' : 'もっと見る'
    button.querySelector('b').textContent = showAll ? '−' : '+'
  }

  button.hidden = fights.length <= INITIAL_FIGHT_COUNT
  button.addEventListener('click', () => {
    showAll = !showAll
    render()
  })
  render()
}

/* Goods list ------------------------------------------------------------- */
const GOODS_STATUS = {
  販売中: { label: 'ON SALE', className: 'is-on-sale' },
  近日発売: { label: 'COMING SOON', className: 'is-coming' },
  売り切れ: { label: 'SOLD OUT', className: 'is-sold-out' },
}

function renderGoodsCard(item) {
  const status = GOODS_STATUS[item.status] ?? GOODS_STATUS['近日発売']
  const price = typeof item.price === 'number' ? `¥${item.price.toLocaleString('ja-JP')}` : '価格未定'
  const image = item.image
    ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" loading="lazy" decoding="async" width="800" height="800">`
    : `<img class="goods-placeholder" src="assets/images/saigo-brush.webp" alt="" loading="lazy" decoding="async" width="1400" height="511"><span class="goods-placeholder-label">IMAGE COMING SOON</span>`
  // 購入ページがあり、売り切れでない商品だけリンクにする
  const isLink = item.url && item.status !== '売り切れ'
  const tag = isLink ? 'a' : 'article'
  const linkAttributes = isLink ? ` href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer"` : ''

  return `
    <${tag} class="goods-card ${status.className}"${linkAttributes}>
      <div class="goods-image">
        ${image}
        <span class="goods-status">${status.label}</span>
      </div>
      <div class="goods-body">
        <small>${escapeHtml(item.category)}</small>
        <h3>${escapeHtml(item.name)}</h3>
        <p class="goods-price">${price}${isLink ? '<span aria-hidden="true">↗</span>' : ''}</p>
      </div>
    </${tag}>`
}

function initGoodsList() {
  const list = document.querySelector('.goods-list')
  if (!list) return
  list.innerHTML = goods.map(renderGoodsCard).join('')
}

/* Gallery：立体スライダー ------------------------------------------------
   pos（いま手前にある写真の番号。小数で途中の状態も表す）を目標値へなめらかに近づけ、
   各カードの「手前からの距離 d」に応じて奥行き・角度・暗さを毎フレーム計算する。
   最後の次は最初に戻る（ループ）。画面に入っている間だけ自動で送る。 */
const DEPTH_AUTOPLAY_MS = 4200

function initDepthGallery() {
  const section = document.querySelector('.depth-section')
  if (!section) return
  const stage = section.querySelector('.depth-stage')
  const cards = Array.from(stage.querySelectorAll('.depth-card'))
  const count = cards.length
  const currentLabel = section.querySelector('[data-depth-current]')
  const bigNumber = section.querySelector('[data-depth-number]')
  const bg = section.querySelector('[data-depth-bg]')
  const bar = section.querySelector('[data-depth-bar]')
  const pad = (n) => String(n).padStart(2, '0')
  const wrap = (n) => ((n % count) + count) % count
  // 写真の枚数に合わせて「/ 18」とバーの長さを自動で設定
  section.querySelector('[data-depth-total]').textContent = pad(count)
  bar.style.width = `${100 / count}%`
  const reduced = prefersReducedMotion()

  let pos = 0
  let target = 0
  let frontIndex = -1
  let frame = 0
  let inView = false
  let autoplayTimer = 0

  // d：0 が手前、1,2,3… が奥。マイナスは「抜けていく途中」のカード
  const place = (card, d) => {
    const width = card.offsetWidth
    if (d < -1 || d > 6) {
      card.style.visibility = 'hidden'
      return
    }
    card.style.visibility = 'visible'
    let x, y, z, rotateY, rotateZ, opacity, shade
    if (d >= 0) {
      // 奥へ：右上にずれながら遠ざかり、少し斜めを向いて暗くなる
      const k = Math.min(d, 1)
      x = d * width * (window.innerWidth > 780 ? 0.34 : 0.3)
      y = -d * 14
      z = -d * 260
      rotateY = -k * 16
      rotateZ = 0
      opacity = d > 5 ? 6 - d : 1
      shade = Math.min(d * 0.2, 0.8)
    } else {
      // 手前から抜ける：左へ大きく飛びながらこちら側に迫り、傾いて消える
      const t = -d
      x = -t * width * 1.05
      y = t * 30
      z = t * 260
      rotateY = t * 38
      rotateZ = -t * 6
      opacity = 1 - t * 1.2
      shade = 0
    }
    card.style.transform = `translate3d(${x}px,${y}px,${z}px) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`
    card.style.opacity = Math.max(0, opacity)
    card.style.zIndex = String(100 - Math.round(d * 10))
    card.style.setProperty('--shade', shade.toFixed(3))
  }

  const setFront = (index) => {
    if (index === frontIndex) return
    frontIndex = index
    cards.forEach((card, i) => card.classList.toggle('is-front', i === index))
    currentLabel.textContent = pad(index + 1)
    bigNumber.textContent = pad(index + 1)
    bar.style.setProperty('--bar', index)
    const img = cards[index].querySelector('img')
    bg.src = img.currentSrc || img.src
    if (!reduced) {
      ;[bigNumber, bg].forEach((el) => {
        el.classList.remove('is-changing')
        void el.offsetWidth // アニメーションをやり直すため
        el.classList.add('is-changing')
      })
    }
  }

  const render = () => {
    cards.forEach((card, i) => {
      let d = wrap(i - pos)
      if (d > count - 1.5) d -= count // 直前に抜けたカードはマイナス側に
      place(card, d)
    })
    setFront(wrap(Math.round(pos)))
  }

  const tick = () => {
    pos += (target - pos) * (reduced ? 1 : 0.085)
    if (Math.abs(target - pos) < 0.0005) pos = target
    render()
    frame = pos === target ? 0 : requestAnimationFrame(tick)
  }
  const animate = () => { if (!frame) frame = requestAnimationFrame(tick) }

  const goTo = (value) => {
    target = value
    animate()
    restartAutoplay()
  }

  // 自動送り（画面内にあって、操作中でないときだけ）
  const stopAutoplay = () => { clearTimeout(autoplayTimer); autoplayTimer = 0 }
  const restartAutoplay = () => {
    stopAutoplay()
    if (reduced || !inView) return
    autoplayTimer = setTimeout(() => goTo(Math.round(target) + 1), DEPTH_AUTOPLAY_MS)
  }
  new IntersectionObserver((entries) => {
    inView = entries[0].isIntersecting
    restartAutoplay()
  }, { threshold: 0.4 }).observe(section)

  section.querySelector('[data-depth-prev]').addEventListener('click', () => goTo(Math.round(target) - 1))
  section.querySelector('[data-depth-next]').addEventListener('click', () => goTo(Math.round(target) + 1))
  stage.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') { event.preventDefault(); goTo(Math.round(target) + 1) }
    if (event.key === 'ArrowLeft') { event.preventDefault(); goTo(Math.round(target) - 1) }
  })

  // ドラッグ／スワイプ：左に引くと次へ。指を離した勢いで1枚以上進むことも
  let startX = 0
  let startPos = 0
  let lastX = 0
  let lastTime = 0
  let velocity = 0
  let dragging = false
  let moved = false
  stage.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    dragging = true
    moved = false
    startX = lastX = event.clientX
    lastTime = performance.now()
    startPos = pos
    velocity = 0
    stopAutoplay()
    stage.classList.add('is-dragging')
    stage.setPointerCapture(event.pointerId)
  })
  stage.addEventListener('pointermove', (event) => {
    if (!dragging) return
    const width = cards[0].offsetWidth
    const now = performance.now()
    if (Math.abs(event.clientX - startX) > 6) moved = true
    velocity = (event.clientX - lastX) / Math.max(now - lastTime, 1)
    lastX = event.clientX
    lastTime = now
    target = startPos - (event.clientX - startX) / (width * 0.75)
    pos = target
    render()
  })
  const endDrag = () => {
    if (!dragging) return
    dragging = false
    stage.classList.remove('is-dragging')
    const fling = Math.max(-3, Math.min(3, -velocity * 1.6))
    goTo(Math.round(target + fling))
  }
  stage.addEventListener('pointerup', endDrag)
  stage.addEventListener('pointercancel', endDrag)

  // 奥のカードをクリックすると、そのカードまで進む
  stage.addEventListener('click', (event) => {
    if (moved) return
    const card = event.target.closest('.depth-card')
    if (!card) return
    let d = wrap(Number(card.dataset.index) - Math.round(target))
    if (d > count / 2) d -= count
    if (d !== 0) goTo(Math.round(target) + d)
  })

  // トラックパッドの横スクロールでも送れるように（縦スクロールは邪魔しない）
  let wheelLock = 0
  stage.addEventListener('wheel', (event) => {
    if (Math.abs(event.deltaX) <= Math.abs(event.deltaY) || Math.abs(event.deltaX) < 8) return
    event.preventDefault()
    const now = performance.now()
    if (now < wheelLock) return
    wheelLock = now + 450
    goTo(Math.round(target) + (event.deltaX > 0 ? 1 : -1))
  }, { passive: false })

  window.addEventListener('resize', render)
  render()
}

/* Hero smoke: stop animating while the hero is off screen ---------------- */
function initHeroVisibility() {
  const hero = document.querySelector('.hero')
  const smokeSvg = hero?.querySelector('.smoke-filter')
  if (!hero) return
  // スマホでは煙を静止表示にしているので、SVG の揺らぎアニメーションも常に止めておく
  if (window.matchMedia('(max-width: 780px)').matches) {
    smokeSvg?.pauseAnimations?.()
    return
  }

  const observer = new IntersectionObserver(([entry]) => {
    hero.classList.toggle('is-offscreen', !entry.isIntersecting)
    // SVG の揺らぎアニメーション（<animate>）は CSS では止まらないため個別に止める
    if (entry.isIntersecting) smokeSvg?.unpauseAnimations?.()
    else smokeSvg?.pauseAnimations?.()
  })
  observer.observe(hero)
}

/* Video: load the YouTube player only after a tap ----------------------- */
function initVideoFacade() {
  document.querySelectorAll('.video-facade').forEach((facade) => {
    facade.addEventListener('click', () => {
      const iframe = document.createElement('iframe')
      iframe.src = `https://www.youtube-nocookie.com/embed/${facade.dataset.videoId}?autoplay=1&playsinline=1`
      iframe.title = facade.dataset.videoTitle
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
      iframe.allowFullscreen = true
      facade.replaceWith(iframe)
    }, { once: true })
  })
}

/* Cheer (激励賞) ----------------------------------------------------------- */
function initCheerForm() {
  const form = document.querySelector('.cheer-form')
  if (!form) return

  const submitLabel = form.querySelector('.cheer-submit-label')
  const nameInput = form.elements.name
  const anonymous = form.elements.anonymous
  const message = form.elements.message
  const count = form.querySelector('.cheer-count')
  const nameHint = form.querySelector('.cheer-name-hint')
  const perks = document.querySelectorAll('[data-perk-min]')
  const notice = form.querySelector('.cheer-notice')
  const emailInput = form.elements.email
  const emailError = form.querySelector('.cheer-field-error')
  // 一度「贈る」を押すか欄から離れるまでは、入力途中でエラーを出さない
  let emailTouched = false

  const getAmount = () => Number(form.elements.amount.value)

  // メールアドレス（必須）のチェック。エラーは欄の下に表示する
  const validateEmail = () => {
    emailInput.value = emailInput.value.trim()
    let error = ''
    if (!emailInput.value) error = 'メールアドレスを入力してください。'
    else if (!emailInput.checkValidity()) error = 'メールアドレスの形式が正しくありません（例：name@example.com）。'
    emailError.textContent = error
    emailError.hidden = !error
    emailInput.classList.toggle('is-invalid', Boolean(error))
    emailInput.setAttribute('aria-invalid', String(Boolean(error)))
    return !error
  }
  emailInput.addEventListener('blur', () => {
    if (!emailInput.value.trim()) return
    emailTouched = true
    validateEmail()
  })

  const update = () => {
    const amount = getAmount()
    submitLabel.textContent = `¥${amount.toLocaleString('ja-JP')} の激励賞を贈る`
    perks.forEach((perk) => perk.classList.toggle('is-active', amount >= Number(perk.dataset.perkMin)))
    nameInput.disabled = anonymous.checked
    nameHint.hidden = amount < CHEER_NAME_PERK_MIN || anonymous.checked
    count.textContent = `${message.value.length} / ${message.maxLength}`
    notice.hidden = true
    // エラー表示中は、直したらすぐ消えるようにする
    if (emailTouched) validateEmail()
  }

  form.addEventListener('input', update)
  form.addEventListener('change', update)
  form.addEventListener('submit', (event) => {
    event.preventDefault()
    emailTouched = true
    if (!validateEmail()) {
      emailInput.focus()
      return
    }
    const amount = getAmount()
    // 保存する内容（スプレッドシートの1行：金額・お名前・匿名・メッセージ・メールアドレス・日時）
    const record = {
      amount,
      name: anonymous.checked ? '' : nameInput.value.trim(),
      anonymous: anonymous.checked,
      message: message.value.trim(),
      email: emailInput.value,
      createdAt: new Date().toISOString(),
    }
    const paymentLink = CHEER_PAYMENT_LINKS[amount]
    if (!paymentLink && CHEER_DEMO_CHECKOUT) {
      // 仮の決済ページへ。入力内容は確認表示用に URL で渡す（実際の決済・保存はしない）
      const params = new URLSearchParams({ amount: String(amount), email: record.email, name: record.name, message: record.message })
      if (record.anonymous) params.set('anonymous', '1')
      window.location.href = `checkout-demo.html?${params}`
      return
    }
    if (!paymentLink) {
      notice.hidden = false
      return
    }
    // TODO: CHEER_SHEET_ENDPOINT に record を送ってから、Stripe の決済ページへ移動する
    // Stripe の決済ページのメール欄には、ここで入力したアドレスを最初から入れておく（二度入力させない）
    const checkoutUrl = new URL(paymentLink)
    checkoutUrl.searchParams.set('prefilled_email', record.email)
    window.location.href = checkoutUrl.toString()
  })
  update()
}

function initCheerThanks() {
  const thanks = document.querySelector('.cheer-thanks')
  const form = document.querySelector('.cheer-form')
  if (!isCheerThanks || !thanks || !form) return

  const amount = Number(cheerParams.get('amount'))
  thanks.querySelector('.cheer-thanks-perk').hidden = !(amount >= CHEER_NAME_PERK_MIN)
  // 左側の「特典」も、贈っていただいた金額の状態で点灯させる
  const amountInput = form.querySelector(`input[name="amount"][value="${amount}"]`)
  if (amountInput) {
    amountInput.checked = true
    form.dispatchEvent(new Event('change'))
  }

  const pageUrl = `${window.location.origin}${window.location.pathname}`
  const shareText = 'プロキックボクサー SAIGO 選手に激励賞を贈りました！一緒に応援しよう 🔥'
  thanks.querySelector('.cheer-share').href =
    `https://x.com/intent/post?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(pageUrl)}`

  form.hidden = true
  thanks.hidden = false

  // 再読み込みでお礼が出続けないよう、URL から ?cheer=thanks を外す
  window.history.replaceState(null, '', window.location.pathname)

  // スマホは縦積みでお礼カードが説明の下にあるため、カードの位置まで移動する
  jumpTo(window.matchMedia('(max-width: 780px)').matches ? thanks : document.querySelector('#cheer'))
  thanks.focus({ preventScroll: true })
}

/* Contact form ----------------------------------------------------------- */
function initContactForm() {
  const form = document.querySelector('.contact-form')
  if (!form) return
  form.addEventListener('submit', (event) => {
    event.preventDefault()
    form.querySelector('.form-notice').hidden = false
  })
}

initStaggerText()
initMenu()
initFightList()
initGoodsList()
initCountdown()
initScrollReveal()
initRecordCounters()
initDepthGallery()
initHeroVisibility()
initVideoFacade()
initContactForm()
initCheerForm()
initIntro()
initCheerThanks()
