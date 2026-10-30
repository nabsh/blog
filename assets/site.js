// Comportements du site : mode clair ou sombre, menu sur téléphone, rubrique active,
// barre de lecture des billets, portrait tramé en deux encres.
(function () {
  var root = document.documentElement;
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  // Clair (par défaut) ou sombre
  var tb = document.querySelector('.theme-btn');
  function syncThemeBtn() { if (tb) tb.setAttribute('aria-label', root.dataset.theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'); }
  if (tb) tb.addEventListener('click', function () {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    store('nsh-theme', root.dataset.theme); syncThemeBtn(); renderPortrait();
  });
  syncThemeBtn();

  // Le pied de page passe après l'annexe des notes que Quarto ajoute en fin de page
  document.addEventListener('DOMContentLoaded', function () {
    var foot = document.querySelector('.site-footer'), app = document.getElementById('quarto-appendix');
    if (foot && app) app.after(foot);
  });

  // Menu sur téléphone
  var btn = document.querySelector('.menu-btn'), nav = document.querySelector('.nav');
  function setMenu(o) { nav.classList.toggle('open', o); btn.setAttribute('aria-expanded', o); btn.textContent = o ? 'Fermer' : 'Menu'; }
  if (btn && nav) {
    btn.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
    // Échap, un lien suivi ou un clic hors du menu le referment
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); btn.focus(); } });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('click', function (e) { if (nav.classList.contains('open') && !nav.contains(e.target) && !btn.contains(e.target)) setMenu(false); });
  }

  // Rubrique active dans la barre
  var path = location.pathname;
  var section = /\/(blog|posts)\b/.test(path) ? 'blog' : (path.match(/\/(ecrits|cours|about)\.html/) || [])[1];
  if (section) document.querySelectorAll('.nav [data-section="' + section + '"]').forEach(function (a) { a.setAttribute('aria-current', 'page'); });

  // Billet : temps de lecture (même rythme que les listes de Quarto, environ 200 mots par minute)
  var rt = document.querySelector('.post-head .readtime[data-auto]');
  if (rt) document.addEventListener('DOMContentLoaded', function () {
    var words = 0;
    document.querySelectorAll('#quarto-content > p, #quarto-content > section, #quarto-content > ul, #quarto-content > ol, #quarto-content > blockquote, #quarto-appendix .footnotes').forEach(function (el) {
      words += (el.textContent.match(/\S+/g) || []).length;
    });
    rt.textContent = Math.max(1, Math.ceil(words / 200)) + ' min de lecture';
  });

  // Billet : liens de partage, construits sur l'adresse et le titre de la page
  var shareBar = document.querySelector('.post-head .share');
  if (shareBar) {
    var url = location.href.split('#')[0], title = (document.querySelector('.post-head h1') || {}).textContent || document.title;
    var u = encodeURIComponent(url), t = encodeURIComponent(title.trim());
    var targets = {
      bsky: 'https://bsky.app/intent/compose?text=' + t + '%20' + u,
      linkedin: 'https://www.linkedin.com/sharing/share-offsite/?url=' + u,
      mastodon: 'https://mastodonshare.com/?text=' + t + '&url=' + u,
      whatsapp: 'https://wa.me/?text=' + t + '%20' + u,
      facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + u,
      mail: 'mailto:?subject=' + t + '&body=' + u
    };
    shareBar.querySelectorAll('a[data-share]').forEach(function (a) {
      a.href = targets[a.dataset.share]; if (a.dataset.share !== 'mail') { a.target = '_blank'; a.rel = 'noopener'; }
    });
    var copy = shareBar.querySelector('[data-share="copy"]');
    if (copy) copy.addEventListener('click', function () {
      var done = function () { copy.classList.add('done'); copy.title = 'Lien copié'; setTimeout(function () { copy.classList.remove('done'); copy.title = 'Copier le lien'; }, 1600); };
      if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, function () {}); else done();
    });
    // Pour citer : note de blog, date, adresse du site
    var when = (document.querySelector('.post-head .meta .rub + span') || {}).textContent || '';
    var canon = 'https://blog.sheikhhassan.com' + location.pathname.replace(/index\.html$/, '');
    var ref = 'Sheikh Hassan, Nabil (' + when.trim().split(' ').pop() + '). « ' + title.trim() + ' ». Note de blog, ' + when.trim() + ', ' + canon;
    var cite = document.createElement('section'); cite.id = 'pour-citer'; cite.className = 'pour-citer';
    cite.innerHTML = '<h2>Pour citer ce billet</h2><p></p><button type="button" class="cite-copy">Copier</button>';
    cite.querySelector('p').textContent = ref;
    cite.querySelector('.cite-copy').addEventListener('click', function (e) {
      var b = e.currentTarget; if (navigator.clipboard) navigator.clipboard.writeText(ref).then(function () { b.textContent = 'Copié'; setTimeout(function () { b.textContent = 'Copier'; }, 1600); });
    });
    document.addEventListener('DOMContentLoaded', function () {
      var app = document.getElementById('quarto-appendix'), foot = document.querySelector('.site-footer');
      (app || foot).before(cite);
    });
  }

  // Barre de lecture
  var prog = document.querySelector('.progress span');
  if (prog) {
    var onScroll = function () { var h = document.documentElement; var max = h.scrollHeight - h.clientHeight; prog.style.width = (max > 0 ? Math.min(100, h.scrollTop / max * 100) : 0) + '%'; };
    addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }

  // Portrait tramé : points des deux encres, légèrement décalés
  function renderPortrait() {
    var box = document.querySelector('.portrait'); if (!box) return;
    var img = box.querySelector('img'), old = box.querySelector('canvas');
    if (old) old.remove();
    img.style.display = '';
    var draw = function () {
      var w = img.naturalWidth, h = img.naturalHeight, m = Math.min(w, h), sx = (w - m) / 2, sy = (h - m) / 2.6;
      var n = 58, S = 348, cell = S / n, src = document.createElement('canvas'); src.width = src.height = n;
      var sxc = src.getContext('2d'); sxc.drawImage(img, sx, sy, m, m, 0, 0, n, n);
      var d; try { d = sxc.getImageData(0, 0, n, n).data; } catch (e) { return; }
      var cs = getComputedStyle(root), dark = root.dataset.theme === 'dark';
      var inks = [[cs.getPropertyValue('--accent-2').trim(), 2.2, 1.6, .75], [cs.getPropertyValue('--accent').trim(), 0, 0, 1]];
      // Niveaux normalisés (5e et 95e centiles) pour garder un visage lisible
      var lum = [], k; for (k = 0; k < n * n; k++) lum.push((0.3 * d[k * 4] + 0.59 * d[k * 4 + 1] + 0.11 * d[k * 4 + 2]) / 255);
      var sorted = lum.slice().sort(function (p, q) { return p - q; }), lo = sorted[Math.floor(n * n * .05)], hi = sorted[Math.floor(n * n * .95)];
      var c = document.createElement('canvas'), x = c.getContext('2d'); c.width = c.height = S;
      inks.forEach(function (ink) {
        x.fillStyle = ink[0];
        for (var j = 0; j < n; j++) for (var i = 0; i < n; i++) {
          var L = Math.min(1, Math.max(0, (lum[j * n + i] - lo) / (hi - lo || 1))), t = dark ? L : 1 - L;
          var r = cell * 0.6 * Math.pow(t, 0.8) * ink[3]; if (r < 0.5) continue;
          x.beginPath(); x.arc((i + 0.5 + (j % 2) * 0.5) * cell + ink[1], (j + 0.5) * cell + ink[2], r, 0, 2 * Math.PI); x.fill();
        }
      });
      c.setAttribute('aria-hidden', 'true'); box.appendChild(c); img.style.display = 'none';
    };
    if (img.complete && img.naturalWidth) draw(); else img.addEventListener('load', draw, { once: true });
  }
  renderPortrait();

  // Typographie française : espaces insécables fines avant % : ; ! ? » et après «, et dans les milliers (190 000)
  document.addEventListener('DOMContentLoaded', function () {
    var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, { acceptNode: function (n) {
      return n.parentElement.closest('script, style, pre, code, textarea') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT; } });
    for (var n; (n = w.nextNode());) {
      var s = n.nodeValue, t = s.replace(/(\S)[  ]([%:;!?»])/g, '$1 $2').replace(/«[  ]/g, '« ').replace(/(\d)[  ](?=\d{3}\b)/g, '$1 ');
      if (t !== s) n.nodeValue = t;
    }
  });
})();
