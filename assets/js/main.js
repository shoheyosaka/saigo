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

function initIntro() {
  const root = document.documentElement
  const darkShell = document.querySelector('.dark-shell')
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
  if (prefersReducedMotion()) {
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

/* Sponsor gallery carousel (mobile only; layout switches in CSS) --------- */
function initGalleryCarousel() {
  const gallery = document.querySelector('.sponsor-gallery')
  const dots = document.querySelector('.gallery-dots')
  if (!gallery || !dots) return

  const slides = Array.from(gallery.querySelectorAll('figure'))
  const buttons = slides.map((slide, index) => {
    const button = document.createElement('button')
    button.type = 'button'
    button.setAttribute('aria-label', `${index + 1}枚目の写真を表示`)
    button.addEventListener('click', () => {
      gallery.scrollTo({ left: slide.offsetLeft - slides[0].offsetLeft, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
    })
    dots.append(button)
    return button
  })

  const updateActive = () => {
    const maxScroll = gallery.scrollWidth - gallery.clientWidth
    // 最後の1枚は左端まで寄り切らないため、末尾に達したら最後を選択扱いにする
    const active = gallery.scrollLeft >= maxScroll - 2
      ? slides.length - 1
      : slides.reduce((closest, slide, index) => {
        const distance = Math.abs(slide.offsetLeft - slides[0].offsetLeft - gallery.scrollLeft)
        const closestDistance = Math.abs(slides[closest].offsetLeft - slides[0].offsetLeft - gallery.scrollLeft)
        return distance < closestDistance ? index : closest
      }, 0)
    buttons.forEach((button, index) => button.setAttribute('aria-current', String(index === active)))
  }

  let frame = 0
  gallery.addEventListener('scroll', () => {
    window.cancelAnimationFrame(frame)
    frame = window.requestAnimationFrame(updateActive)
  }, { passive: true })
  updateActive()
}

/* Hero smoke: stop animating while the hero is off screen ---------------- */
function initHeroVisibility() {
  const hero = document.querySelector('.hero')
  const smokeSvg = hero?.querySelector('.smoke-filter')
  if (!hero) return

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
initCountdown()
initScrollReveal()
initRecordCounters()
initGalleryCarousel()
initHeroVisibility()
initVideoFacade()
initContactForm()
initIntro()
