/* 방문자 배지 — GoatCounter public counter (site total, https://www.goatcounter.com/help/visitor-counter).
   data-vc = https://insightbenz.goatcounter.com · data-vc-range = today | week | all (set by build/site.py VC_BADGE).
   Read-only: this file never counts anything (counting is GoatCounter's count.js).
   The badge stays hidden unless GoatCounter returns a real number ≥ 1 — no placeholder, no fallback number. */
(function(){
  'use strict';
  var els = document.querySelectorAll('.vc[data-vc]');
  if (!els.length || !window.fetch) return;
  var base = els[0].getAttribute('data-vc'), range = els[0].getAttribute('data-vc-range'), q = '';
  if (range === 'today') {
    // GoatCounter only accepts a date (YYYY-MM-DD, read as UTC 00:00) — see README for what this covers
    var day;
    try { day = new Intl.DateTimeFormat('en-CA', {timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit'}).format(new Date()); }
    catch (e) { day = new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10); }
    if (!/^\d{4}-\d\d-\d\d$/.test(day)) return;
    q = '?start=' + day;
  } else if (range === 'week') q = '?start=week';
  else if (range !== 'all') return;
  var ctl = window.AbortController ? new AbortController() : null;
  if (ctl) setTimeout(function(){ ctl.abort(); }, 6000);
  fetch(base + '/counter/TOTAL.json' + q, {credentials: 'omit', signal: ctl ? ctl.signal : undefined})
    .then(function(r){ return r.ok ? r.json() : null; })
    .then(function(d){
      if (!d || (typeof d.count !== 'string' && typeof d.count !== 'number')) return;
      var s = String(d.count).replace(/[\s,.'\u00a0\u202f\u2009]/g, '');   // GoatCounter formats with a thousands separator
      if (!/^\d{1,9}$/.test(s)) return;
      var n = parseInt(s, 10);
      if (!(n >= 1)) return;
      var t = n.toLocaleString('ko-KR');
      for (var i = 0; i < els.length; i++) {
        var b = els[i].querySelector('.vc-n');
        if (b) { b.textContent = t; els[i].hidden = false; }
      }
    })
    .catch(function(){ /* stay hidden */ });
})();
