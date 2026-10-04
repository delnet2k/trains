/*
 * Shared nav bar and light/dark switch for every family page (see theme.css).
 * Load it in <head> WITHOUT defer, so a saved light/dark choice applies before the page draws:
 *   <script src="/theme.js"></script>
 *
 * On trains.delnet.co.uk (the public site) the nav only offers the public pages.
 */
(function () {
  var root = document.documentElement;
  try { var saved = localStorage.getItem('theme'); if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved); } catch (e) {}

  var PUBLIC = /(^|\.)delnet\.co\.uk$/.test(location.hostname) || location.hostname.indexOf('github.io') > -1;
  var LINKS = PUBLIC
    ? [['Commute', '/'], ['Weather', '/weather/']]
    : [['Home', '/'], ['Commute', '/travel/'], ['Weather', '/weather/'], ['Dinner', '/dinner/'], ['Recipes', '/dinner/recipes.html']];
  var WORDMARK = PUBLIC ? 'Commute' : 'Jacksons';

  function dark() {
    var t = root.getAttribute('data-theme');
    return t ? t === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function paint() {
    var b = document.getElementById('theme-btn');
    if (b) { b.textContent = dark() ? '☀' : '☾'; b.setAttribute('aria-label', dark() ? 'Switch to light mode' : 'Switch to dark mode'); }
    var m = document.querySelector('meta[name="theme-color"]');
    if (!m) { m = document.createElement('meta'); m.name = 'theme-color'; document.head.appendChild(m); }
    m.content = getComputedStyle(root).getPropertyValue('--surface').trim() || (dark() ? '#211d1b' : '#fffcfa');
  }

  function build() {
    var here = location.pathname.replace(/index\.html$/, '');
    var nav = document.createElement('div');
    nav.setAttribute('role', 'banner');
    nav.className = 'site-nav';
    nav.innerHTML = '<div class="in">' +
      '<nav class="links" aria-label="Pages">' + LINKS.map(function (l) {
        return '<a href="' + l[1] + '"' + (here === l[1] ? ' aria-current="page"' : '') + '>' + l[0] + '</a>';
      }).join('') + '</nav>' +
      '<button type="button" class="more" aria-expanded="false">Menu</button>' +
      '<a class="wordmark" href="/">' + WORDMARK.toUpperCase() + '</a>' +
      '<div class="right"><button type="button" id="theme-btn"></button><a class="btn" href="#" id="print-btn">Print</a></div></div>';
    document.body.insertBefore(nav, document.body.firstChild);
    nav.querySelector('.more').addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      this.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.getElementById('theme-btn').addEventListener('click', function () {
      var next = dark() ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      paint();
      window.dispatchEvent(new Event('themechange'));
    });
    document.getElementById('print-btn').addEventListener('click', function (e) { e.preventDefault(); window.print(); });
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', paint);
    paint();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();
