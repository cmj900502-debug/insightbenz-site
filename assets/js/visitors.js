/* 오늘 방문 badge — every page view today (Asia/Seoul day), refreshes and repeat visits included.
   Source: Abacus free hit counter (https://abacus.jasoncameron.dev, no signup/token; CORS *).
   data-vc = API base · data-vc-ns = namespace · key = "hits-YYYYMMDD" in KST → new key (= reset) at 00:00 KST.
   • normal browsers: GET /hit/<ns>/<key> once per page load → returns the new value, shown at once (1 on the first view)
   • automated browsers (navigator.webdriver), bot user agents, localhost / 127.* / file: → GET /get/<ns>/<key> (read only, never counts)
   • any failure / timeout (6 s) / odd value / key not created yet (404 on read) → badge stays hidden, no error thrown. */
(function(){
  'use strict';
  var els = document.querySelectorAll('.vc[data-vc]');
  if (!els.length || !window.fetch) return;
  var api = els[0].getAttribute('data-vc'), ns = els[0].getAttribute('data-vc-ns');
  if (els[0].getAttribute('data-vc-range') !== 'today' || !api || !/^[A-Za-z0-9_.-]{3,64}$/.test(ns || '')) return;
  var day;
  try {
    var p = {};
    new Intl.DateTimeFormat('en-US', {timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit'})
      .formatToParts(new Date()).forEach(function(x){ p[x.type] = x.value; });
    day = p.year + p.month + p.day;
  } catch (e) { day = new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10).replace(/-/g, ''); }
  if (!/^\d{8}$/.test(day)) return;
  var BOT = /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|kakaotalk-scrap|yeti|daum|headless|phantom|puppeteer|playwright|selenium|lighthouse|pagespeed|gtmetrix/i;
  var T = window.__VC_TEST__ || {};   // QA hook only (qa/interact.py sets it via an init script; the counter service is stubbed there)
  var local = !T.allowLocal && (location.protocol === 'file:' || /^(localhost|127\.\d+\.\d+\.\d+|0\.0\.0\.0|\[::1\]|)$/.test(location.hostname));
  var readOnly = local || (!T.allowBot && (navigator.webdriver === true || BOT.test(navigator.userAgent || '')));
  var url = api + (readOnly ? '/get/' : '/hit/') + ns + '/hits-' + day;
  var ctl = window.AbortController ? new AbortController() : null;
  if (ctl) setTimeout(function(){ ctl.abort(); }, 6000);
  fetch(url, {cache: 'no-store', credentials: 'omit', signal: ctl ? ctl.signal : undefined})
    .then(function(r){ return r.ok ? r.json() : null; })
    .then(function(d){
      var n = d && d.value;
      if (typeof n !== 'number' || !isFinite(n) || n < 0 || n % 1 || n > 1e9) return;
      var t = n.toLocaleString('ko-KR');
      for (var i = 0; i < els.length; i++) {
        var b = els[i].querySelector('.vc-n');
        if (b) { b.textContent = t; els[i].hidden = false; }
      }
    })
    .catch(function(){ /* stay hidden */ });
})();
