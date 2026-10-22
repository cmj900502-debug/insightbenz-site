/* 오늘 방문자 — real unique-visitor count per KST day from /api/visitors (Netlify Function + Blobs).
   • counts one per browser per KST day (localStorage flag "vc:YYYY-MM-DD" + random browser id; the server de-duplicates by id)
   • never counts localhost / 127.0.0.1 / file:, automated browsers (navigator.webdriver) or bot user agents
   • the badge stays hidden unless the server returns a real number — there is no placeholder or fallback number. */
(function(){
  'use strict';
  var el = document.getElementById('vc'), num = document.getElementById('vc-n');
  if (!el || !num || !window.fetch) return;
  var T = window.__VC_TEST__ || {};                       // QA hook (set only by test scripts via an init script)
  var host = location.hostname;
  if (!T.allowHost && (location.protocol === 'file:' || /^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\]|)$/.test(host))) return;
  var BOT = /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|whatsapp|telegram|kakaotalk-scrap|yeti|daum|headless|phantom|puppeteer|playwright|selenium|lighthouse|pagespeed|gtmetrix/i;
  var bot = !T.allowBot && (navigator.webdriver === true || BOT.test(navigator.userAgent || ''));
  var day;
  try { day = new Intl.DateTimeFormat('en-CA', {timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit'}).format(new Date()); }
  catch (e) { day = new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10); }
  var ls = null;
  try { ls = window.localStorage; ls.setItem('vc:t', '1'); ls.removeItem('vc:t'); } catch (e) { ls = null; }
  // without localStorage we cannot tell a repeat visit apart → only read the count, never add one
  var post = !bot && ls && !ls.getItem('vc:' + day);
  var vid = '';
  if (post) {
    vid = ls.getItem('vc:id') || '';
    if (!/^[a-z0-9]{16,40}$/.test(vid)) {
      var a = new Uint8Array(16), s = '';
      (window.crypto || window.msCrypto).getRandomValues(a);
      for (var i = 0; i < a.length; i++) s += ('0' + a[i].toString(16)).slice(-2);
      vid = s.slice(0, 24); ls.setItem('vc:id', vid);
    }
  }
  var ctl = window.AbortController ? new AbortController() : null;
  if (ctl) setTimeout(function(){ ctl.abort(); }, 6000);
  var opt = {cache: 'no-store', credentials: 'omit', signal: ctl ? ctl.signal : undefined};
  if (post) { opt.method = 'POST'; opt.headers = {'content-type': 'application/json'}; opt.body = JSON.stringify({vid: vid}); }
  fetch('/api/visitors', opt).then(function(r){ return r.ok ? r.json() : null; }).then(function(d){
    if (!d || typeof d.count !== 'number' || !isFinite(d.count) || d.count < 1 || d.count % 1) return;
    if (post) {
      try {
        for (var k = ls.length - 1; k >= 0; k--) { var key = ls.key(k); if (/^vc:\d{4}-\d\d-\d\d$/.test(key) && key !== 'vc:' + day) ls.removeItem(key); }
        ls.setItem('vc:' + day, '1');
      } catch (e) {}
    }
    num.textContent = d.count.toLocaleString('ko-KR');
    el.hidden = false;
  }).catch(function(){ /* stay hidden */ });
})();
