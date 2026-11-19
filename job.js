/* 포트폴리오 / 취업활동 화면 전환 + 취업활동 차트 그리기 (외부 라이브러리 없음) */
(function () {
    'use strict';

    var D = window.JOB_DATA;
    var root = document.getElementById('view-job');
    var views = { portfolio: document.getElementById('view-portfolio'), job: root };
    var tabs = Array.prototype.slice.call(document.querySelectorAll('.view-tab'));
    var rendered = false;
    var SVGNS = 'http://www.w3.org/2000/svg';

    /* ---------- 작은 도우미 ---------- */
    function h(tag, cls, text) {
        var e = document.createElement(tag);
        if (cls) e.className = cls;
        if (text != null) e.textContent = text;
        return e;
    }

    function s(tag, attrs) {
        var e = document.createElementNS(SVGNS, tag);
        Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); });
        return e;
    }

    function pct(a, b) {
        return b > 0 ? Math.round((a / b) * 100) : 0;
    }

    function card(title, caption) {
        var c = h('div', 'jb-card');
        c.appendChild(h('h3', null, title));
        c.appendChild(h('p', 'jb-cap', caption));
        return c;
    }

    function section(title) {
        var sec = document.createElement('section');
        sec.appendChild(h('h2', 'section-title', title));
        return sec;
    }

    /* ---------- 포트폴리오 문서 통계 (index.html 카드에서 읽기) ---------- */
    function portfolioStats() {
        var projects = document.querySelectorAll('#sec-projects .card').length;
        var docs = [];
        Array.prototype.forEach.call(document.querySelectorAll('#sec-analysis .card'), function (c) {
            var p = c.querySelector('.card-period');
            var m = p && p.textContent.match(/(\d{4})\.(\d{2})\.(\d{2})/);
            if (m) docs.push(new Date(+m[1], +m[2] - 1, +m[3]));
        });
        docs.sort(function (a, b) { return a - b; });
        return { projects: projects, docs: docs };
    }

    /* ---------- 화면 전환 ---------- */
    function setView(name, updateHash) {
        if (!views[name]) name = 'portfolio';
        Object.keys(views).forEach(function (k) { views[k].hidden = (k !== name); });
        tabs.forEach(function (t) {
            var on = t.getAttribute('data-view') === name;
            t.setAttribute('aria-selected', on ? 'true' : 'false');
            t.tabIndex = on ? 0 : -1;
        });
        if (name === 'job' && !rendered) {
            rendered = true;
            render();
        }
        if (updateHash) {
            try { history.replaceState(null, '', '#' + name); } catch (e) { location.hash = name; }
        }
    }

    function fromHash() {
        return location.hash === '#job' ? 'job' : 'portfolio';
    }

    tabs.forEach(function (t, i) {
        t.addEventListener('click', function () { setView(t.getAttribute('data-view'), true); });
        t.addEventListener('keydown', function (e) {
            var next = null;
            if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
            if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
            if (next) {
                e.preventDefault();
                next.focus();
                setView(next.getAttribute('data-view'), true);
            }
        });
    });

    window.addEventListener('hashchange', function () { setView(fromHash(), false); });

    /* ---------- 차트 ---------- */
    function kpis(stats) {
        var f = D.funnel;
        var items = [
            { v: f[0].value, u: '건', l: '총 지원', sample: true },
            { v: pct(f[1].value, f[0].value), u: '%', l: '서류 통과율', sample: true },
            { v: pct(f[3].value, f[0].value), u: '%', l: '면접 전환율', sample: true },
            { v: f[4].value, u: '건', l: '최종 합격', sample: true },
            { v: stats.docs.length, u: '건', l: '기획·분석 문서', real: true },
            { v: stats.projects, u: '건', l: '프로젝트', real: true }
        ];
        var wrap = h('div', 'jb-kpis');
        items.forEach(function (it) {
            var k = h('div', 'jb-kpi' + (it.real ? ' is-real' : ''));
            var v = h('div', 'v', String(it.v));
            v.appendChild(h('small', null, it.u));
            k.appendChild(v);
            k.appendChild(h('div', 'l', it.l));
            k.appendChild(h('div', 's', it.real ? '포트폴리오 실제 값' : (D.sample ? '샘플' : '직접 입력')));
            wrap.appendChild(k);
        });
        return wrap;
    }

    function funnel() {
        var c = card('지원 퍼널', '% 는 이전 단계 대비 비율');
        var list = h('div', 'jb-funnel');
        var max = D.funnel[0].value || 1;
        D.funnel.forEach(function (st, i) {
            var row = h('div', 'jb-frow');
            row.appendChild(h('span', 'name', st.label));
            var track = h('div', 'jb-track');
            var fill = h('div', 'jb-fill');
            fill.style.width = pct(st.value, max) + '%';
            track.appendChild(fill);
            row.appendChild(track);
            var num = h('span', 'num');
            num.appendChild(h('b', null, String(st.value)));
            num.appendChild(document.createTextNode(i === 0 ? '' : ' · ' + pct(st.value, D.funnel[i - 1].value) + '%'));
            row.appendChild(num);
            list.appendChild(row);
        });
        c.appendChild(list);
        return c;
    }

    function monthly() {
        var c = card('월별 지원 건수', '한 달 동안 낸 지원서 수');
        var max = Math.max.apply(null, D.monthly.map(function (m) { return m.value; })) || 1;
        var wrap = h('div', 'jb-vbars');
        D.monthly.forEach(function (m) {
            var col = h('div', 'jb-vbar');
            col.appendChild(h('span', 'val', String(m.value)));
            var bar = h('div', 'bar');
            bar.style.height = Math.max(2, (m.value / max) * 130) + 'px';
            col.appendChild(bar);
            col.appendChild(h('span', null, m.label));
            wrap.appendChild(col);
        });
        c.appendChild(wrap);
        return c;
    }

    function donut() {
        var c = card('직무별 지원 비율', '지원서를 낸 직무 기준');
        var total = D.roles.reduce(function (a, r) { return a + r.value; }, 0);
        var wrap = h('div', 'jb-donut');
        var svg = s('svg', { viewBox: '0 0 120 120', role: 'img', 'aria-label': '직무별 지원 비율 도넛 차트' });
        var R = 40;
        var C = 2 * Math.PI * R;
        var cum = 0;
        svg.appendChild(s('circle', { cx: 60, cy: 60, r: R, fill: 'none', stroke: 'var(--border-color)', 'stroke-width': 16 }));
        D.roles.forEach(function (r, i) {
            var len = total ? (r.value / total) * C : 0;
            var seg = s('circle', {
                cx: 60, cy: 60, r: R, fill: 'none',
                stroke: 'var(--c' + ((i % 5) + 1) + ')',
                'stroke-width': 16,
                'stroke-dasharray': Math.max(0, len - 1.5) + ' ' + (C - Math.max(0, len - 1.5)),
                'stroke-dashoffset': -cum,
                transform: 'rotate(-90 60 60)'
            });
            svg.appendChild(seg);
            cum += len;
        });
        var num = s('text', { x: 60, y: 62, 'text-anchor': 'middle', 'class': 'center-num' });
        num.textContent = String(total);
        var lab = s('text', { x: 60, y: 75, 'text-anchor': 'middle', 'class': 'center-lab' });
        lab.textContent = '총 지원';
        svg.appendChild(num);
        svg.appendChild(lab);
        wrap.appendChild(svg);

        var ul = h('ul', 'jb-legend');
        D.roles.forEach(function (r, i) {
            var li = h('li');
            var sw = h('span', 'sw');
            sw.style.backgroundColor = 'var(--c' + ((i % 5) + 1) + ')';
            li.appendChild(sw);
            li.appendChild(h('span', 't', r.label));
            li.appendChild(h('span', 'n', r.value + '건 · ' + pct(r.value, total) + '%'));
            ul.appendChild(li);
        });
        wrap.appendChild(ul);
        c.appendChild(wrap);
        return c;
    }

    function docLine(stats) {
        var c = card('기획·분석 문서 누적', '포트폴리오에 추가한 문서 수 (실제 값)');
        var d = stats.docs;
        if (!d.length) {
            c.appendChild(h('p', 'jb-cap', '문서가 없습니다.'));
            return c;
        }
        var W = 320, H = 140, pl = 14, pr = 14, pt = 14, pb = 14;
        var t0 = d[0].getTime(), t1 = d[d.length - 1].getTime();
        var span = Math.max(1, t1 - t0);
        var N = d.length;
        var base = H - pb;
        var wrap = h('div', 'jb-line');
        var svg = s('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': '기획·분석 문서 누적 ' + N + '건' });
        [0, 0.5, 1].forEach(function (g) {
            var y = base - g * (H - pt - pb);
            svg.appendChild(s('line', { x1: pl, x2: W - pr, y1: y, y2: y, 'class': 'grid' }));
        });
        var pts = d.map(function (dt, i) {
            return [pl + ((dt.getTime() - t0) / span) * (W - pl - pr), base - ((i + 1) / N) * (H - pt - pb)];
        });
        var poly = pts.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ');
        svg.appendChild(s('polygon', {
            points: pts[0][0].toFixed(1) + ',' + base + ' ' + poly + ' ' + pts[pts.length - 1][0].toFixed(1) + ',' + base,
            'class': 'area'
        }));
        svg.appendChild(s('polyline', { points: poly, 'class': 'path' }));
        pts.forEach(function (p, i) {
            var dot = s('circle', { cx: p[0].toFixed(1), cy: p[1].toFixed(1), r: 4, 'class': 'dot' });
            var tt = s('title', {});
            tt.textContent = (i + 1) + '건째 · ' + fmt(d[i]);
            dot.appendChild(tt);
            svg.appendChild(dot);
        });
        wrap.appendChild(svg);
        var axis = h('div', 'jb-axis');
        axis.appendChild(h('span', null, fmt(d[0])));
        axis.appendChild(h('span', null, '누적 ' + N + '건'));
        axis.appendChild(h('span', null, fmt(d[d.length - 1])));
        wrap.appendChild(axis);
        c.appendChild(wrap);
        return c;
    }

    function fmt(dt) {
        return dt.getFullYear() + '.' + ('0' + (dt.getMonth() + 1)).slice(-2) + '.' + ('0' + dt.getDate()).slice(-2);
    }

    function heat() {
        var c = card('준비 시간 히트맵', '최근 12주 · 열은 주, 행은 요일');
        var wrap = h('div', 'jb-heat');
        var days = h('div', 'days');
        ['월', '화', '수', '목', '금', '토', '일'].forEach(function (d) { days.appendChild(h('span', null, d)); });
        wrap.appendChild(days);
        var cells = h('div', 'cells');
        var total = 0;
        D.weeks.forEach(function (w, wi) {
            w.forEach(function (v, di) {
                total += v;
                var lv = v <= 0 ? 0 : v <= 1 ? 1 : v <= 2 ? 2 : v <= 3 ? 3 : 4;
                var cell = h('div', 'cell' + (lv ? ' l' + lv : ''));
                cell.title = (wi + 1) + '주차 ' + ['월', '화', '수', '목', '금', '토', '일'][di] + ' · ' + v + '시간';
                cells.appendChild(cell);
            });
        });
        wrap.appendChild(cells);
        c.appendChild(wrap);
        var key = h('div', 'jb-heatkey');
        key.appendChild(document.createTextNode('총 ' + total + '시간 · 적음'));
        for (var i = 0; i <= 4; i++) key.appendChild(h('i', i ? 'l' + i : ''));
        key.appendChild(document.createTextNode('많음'));
        c.appendChild(key);
        return c;
    }

    function skills() {
        var c = card('준비 항목 달성도', '현재 값 / 목표 값');
        var list = h('div', 'jb-prog');
        D.skills.forEach(function (sk) {
            var row = h('div', 'jb-prow');
            var top = h('div', 'top');
            top.appendChild(h('span', 't', sk.label));
            var n = h('span', 'n');
            n.appendChild(h('b', null, String(sk.current)));
            n.appendChild(document.createTextNode(' / ' + sk.target + sk.unit + ' · ' + pct(sk.current, sk.target) + '%'));
            top.appendChild(n);
            row.appendChild(top);
            var track = h('div', 'jb-track');
            var fill = h('div', 'jb-fill');
            fill.style.width = Math.min(100, pct(sk.current, sk.target)) + '%';
            track.appendChild(fill);
            row.appendChild(track);
            list.appendChild(row);
        });
        c.appendChild(list);
        return c;
    }

    function table() {
        var c = card('지원 현황', '최근 지원 순');
        c.className += ' wide';
        var wrap = h('div', 'jb-table-wrap');
        var t = h('table', 'jb-table');
        var thead = h('thead');
        var tr = h('tr');
        ['회사', '직무', '단계', '날짜'].forEach(function (x) { tr.appendChild(h('th', null, x)); });
        thead.appendChild(tr);
        t.appendChild(thead);
        var tb = h('tbody');
        D.applications.forEach(function (a) {
            var r = h('tr');
            r.appendChild(h('td', null, a.company));
            r.appendChild(h('td', null, a.role));
            var td = h('td');
            var cls = 'jb-chip' + (a.stage === '최종 합격' ? ' is-win' : (/불합격/.test(a.stage) ? ' is-off' : ''));
            td.appendChild(h('span', cls, a.stage));
            r.appendChild(td);
            r.appendChild(h('td', null, a.date));
            tb.appendChild(r);
        });
        t.appendChild(tb);
        wrap.appendChild(t);
        c.appendChild(wrap);
        return c;
    }

    function todo() {
        var c = card('다음 할 일', '이번 주 우선순위');
        var ul = h('ul', 'jb-todo');
        D.todo.forEach(function (x) { ul.appendChild(h('li', null, x)); });
        c.appendChild(ul);
        return c;
    }

    function render() {
        if (!D) {
            root.appendChild(h('p', null, '데이터를 불러오지 못했습니다.'));
            return;
        }
        var stats = portfolioStats();

        var head = h('div', 'jb-head');
        head.appendChild(h('h2', null, '취업활동 현황'));
        head.appendChild(h('p', null, '숫자와 그래프로 보는 취업 준비 · 업데이트 ' + D.updated));
        if (D.sample) {
            head.appendChild(h('p', 'jb-notice', '지원·준비 수치는 샘플입니다. 실제 값은 추후 교체됩니다.'));
        }
        root.appendChild(head);

        var s1 = section('한눈에 보기');
        s1.appendChild(kpis(stats));
        root.appendChild(s1);

        var s2 = section('지원 현황 분석');
        var g2 = h('div', 'jb-grid');
        g2.appendChild(funnel());
        g2.appendChild(monthly());
        g2.appendChild(donut());
        g2.appendChild(table());
        s2.appendChild(g2);
        root.appendChild(s2);

        var s3 = section('준비 과정');
        var g3 = h('div', 'jb-grid');
        g3.appendChild(docLine(stats));
        g3.appendChild(skills());
        g3.appendChild(heat());
        g3.appendChild(todo());
        s3.appendChild(g3);
        root.appendChild(s3);
    }

    setView(fromHash(), false);
})();
