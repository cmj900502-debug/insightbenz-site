/* 전국 재고 filters: search + class chips + year chips + colour chips + 즉시출고 only. No data leaves the page. */
(function () {
  var list = document.getElementById('stock-list'); if (!list) return;
  var q = document.getElementById('stock-q'), now = document.getElementById('stock-now');
  var cnt = document.getElementById('stock-count'), ccnt = document.getElementById('stock-ccount'), empty = document.getElementById('stock-empty');
  var state = { cls: '', col: '', my: '' };
  function norm(s) { return (s || '').toLowerCase().replace(/\s+/g, ''); }
  function chipGroup(id, key, attr) {
    var g = document.getElementById(id); if (!g) return;
    g.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b || b.disabled) return;
      g.querySelectorAll('button').forEach(function (x) { x.classList.remove('on'); x.setAttribute('aria-pressed', 'false'); });
      b.classList.add('on'); b.setAttribute('aria-pressed', 'true');
      state[key] = b.getAttribute(attr) || ''; apply();
    });
  }
  function apply() {
    var term = norm(q && q.value), onlyNow = now && now.checked, nm = 0, nc = 0;
    list.querySelectorAll('.scard').forEach(function (card) {
      var okCls = !state.cls || (' ' + card.getAttribute('data-classes') + ' ').indexOf(' ' + state.cls + ' ') >= 0;
      var okMy = !state.my || card.getAttribute('data-my') === state.my;
      var okTerm = !term || norm(card.getAttribute('data-search')).indexOf(term) >= 0;
      var vis = 0;
      card.querySelectorAll('.srow').forEach(function (r) {
        var show = okCls && okMy && okTerm && (!state.col || r.getAttribute('data-color') === state.col) && (!onlyNow || r.getAttribute('data-now') === '1');
        if (show && term && norm(card.querySelector('h3').textContent).indexOf(term) < 0) show = norm(r.textContent).indexOf(term) >= 0;
        r.hidden = !show; if (show) vis++;
      });
      card.hidden = vis === 0; if (vis) { nm++; nc += vis; }
    });
    if (cnt) cnt.textContent = nm; if (ccnt) ccnt.textContent = nc;
    if (empty) empty.classList.toggle('hide', nm > 0);
  }
  chipGroup('stock-cls', 'cls', 'data-cls');
  chipGroup('stock-my', 'my', 'data-my');
  chipGroup('stock-col', 'col', 'data-col');
  var params = new URLSearchParams(location.search);
  var pre = params.get('q');
  if (pre && q) q.value = pre;
  var preMy = (params.get('my') || '').toUpperCase();
  if (preMy) {
    var mb = document.querySelector('#stock-my button[data-my="' + preMy + '"]');
    if (mb && !mb.disabled) {
      document.querySelectorAll('#stock-my button').forEach(function (x) { x.classList.remove('on'); x.setAttribute('aria-pressed', 'false'); });
      mb.classList.add('on'); mb.setAttribute('aria-pressed', 'true');
      state.my = preMy;
    }
  }
  if (pre || preMy) apply();
  if (q) q.addEventListener('input', apply); if (now) now.addEventListener('change', apply);
})();
