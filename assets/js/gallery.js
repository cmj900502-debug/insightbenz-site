/* 출고 갤러리 lightbox (gallery.html). Links work without JS (open the large image); with JS a <dialog> opens:
   ←/→ keys, swipe, Esc/× to close, focus returns to the thumbnail that opened it. */
(function () {
  var lb = document.getElementById('gl-lb'); if (!lb || typeof lb.showModal !== 'function') return;
  var img = document.getElementById('gl-lb-img'), cap = document.getElementById('gl-lb-cap');
  var prev = document.getElementById('gl-prev'), next = document.getElementById('gl-next');
  var sets = {}, cur = null, i = 0, opener = null;
  document.querySelectorAll('script.gl-data').forEach(function (s) { try { sets[s.dataset.gl] = JSON.parse(s.textContent); } catch (e) {} });
  function show(k) {
    var s = sets[cur]; i = (k + s.length) % s.length; var m = s[i];
    img.src = m.src; img.width = m.w; img.height = m.h; img.alt = m.alt;
    cap.textContent = (i + 1) + ' / ' + s.length;
    var many = s.length > 1; prev.hidden = next.hidden = !many;
    if (many) { var p = s[(i + 1) % s.length]; (new Image()).src = p.src; }
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[data-gl]'); if (!a || !sets[a.dataset.gl]) return;
    e.preventDefault(); opener = a; cur = a.dataset.gl; show(+a.dataset.i || 0); lb.showModal(); document.getElementById('gl-close').focus();
  });
  prev.addEventListener('click', function () { show(i - 1); });
  next.addEventListener('click', function () { show(i + 1); });
  document.getElementById('gl-close').addEventListener('click', function () { lb.close(); });
  lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
  lb.addEventListener('close', function () { img.removeAttribute('src'); if (opener) opener.focus(); });
  lb.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(i - 1); } else if (e.key === 'ArrowRight') { e.preventDefault(); show(i + 1); }
  });
  var x0 = null, y0 = 0;
  lb.addEventListener('touchstart', function (e) { var t = e.touches[0]; x0 = t.clientX; y0 = t.clientY; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (x0 === null) return; var t = e.changedTouches[0], dx = t.clientX - x0, dy = t.clientY - y0; x0 = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3 && sets[cur].length > 1) show(i + (dx < 0 ? 1 : -1));
  }, { passive: true });
})();
