/* 연구 실적 목록 렌더링 — SPEC 5항
 *
 * 무엇: data/publications.json 과 data/awards.json 을 fetch 로 읽어
 *       publications.html 의 4개 섹션(#journal / #conference / #patent / #awards)을 채운다.
 * 왜:   논문·수상은 자주 늘어나는 데이터라 HTML 이 아니라 JSON 으로 분리했다.
 *       폰에서 JSON 에 객체 하나만 추가하면 사이트가 갱신되도록 하는 것이 목적이다 (SPEC 8항).
 *
 * 규칙
 *  - 라이브러리 없이 순수 DOM API 만 사용한다.
 *  - 로드/문법 오류는 빈 화면이 아니라 화면에 원인을 표시한다 (폰에서 원인 파악이 가능해야 함).
 *  - 항목이 0건인 섹션은 hidden 을 유지해 통째로 숨긴다 (SPEC 4.2).
 */

(function () {
  var statusBox = document.getElementById('data-status');

  function showError(message) {
    if (!statusBox) return;
    statusBox.className = 'data-error';
    // file:// 로 열면 fetch 가 막힌다. 원인을 헷갈리지 않도록 안내를 덧붙인다.
    statusBox.textContent = 'Failed to load data: ' + message +
      (location.protocol === 'file:'
        ? ' (Opened as a local file. Data loads only over http(s) — check the published site.)'
        : '');
  }

  // JSON 을 읽는다. 문법 오류와 404 를 구분해서 알려준다.
  function loadJson(name) {
    var url = 'data/' + name;
    return fetch(url).then(function (res) {
      if (!res.ok) throw new Error(url + ' (HTTP ' + res.status + ')');
      return res.text();
    }).then(function (text) {
      var parsed;
      try {
        parsed = JSON.parse(text);
      } catch (e) {
        // 폰에서 쉼표를 빠뜨렸을 때 어느 파일인지 알아야 한다.
        throw new Error(url + ' — JSON syntax error: ' + e.message);
      }
      if (!Array.isArray(parsed)) {
        throw new Error(url + ' — the top level must be an array [ ]');
      }
      return parsed;
    });
  }

  function field(item, name) {
    // 선택 필드가 비었거나 키가 없어도 렌더링이 멈추지 않도록 한다.
    var v = item[name + '_en'];
    return (v === undefined || v === null) ? '' : String(v);
  }

  function appendLine(parent, cls, text) {
    if (!text) return;
    var el = document.createElement('span');
    el.className = cls;
    el.textContent = text;
    parent.appendChild(el);
  }

  // 제목 한 줄. link 가 있으면 제목 자체를 링크로 만든다.
  function appendTitle(box, title, link) {
    if (link) {
      var a = document.createElement('a');
      a.className = 'pub-title';
      a.href = link;
      a.textContent = title + ' ↗';
      box.appendChild(a);
    } else {
      appendLine(box, 'pub-title', title);
    }
  }

  // 논문 / 학회 발표 / 특허 항목 한 건
  function publicationNode(item) {
    var box = document.createElement('div');
    box.className = 'pub-item' + (item.highlight === true ? ' is-highlight' : '');

    appendTitle(box, field(item, 'title'), item.link ? String(item.link) : '');
    appendLine(box, 'pub-authors', field(item, 'authors'));
    appendLine(box, 'pub-venue', field(item, 'venue'));
    return box;
  }

  // 수상 항목 한 건. 저자·게재지가 없고 수여기관과 수상일이 있다 (SPEC 3.2).
  function awardNode(item) {
    var box = document.createElement('div');
    box.className = 'pub-item';

    appendTitle(box, field(item, 'title'), item.link ? String(item.link) : '');
    appendLine(box, 'pub-authors', field(item, 'org'));
    appendLine(box, 'pub-venue', item.date ? String(item.date) : '');
    return box;
  }

  // 연도별로 묶어 섹션에 그린다 (SPEC 4.2). 항목이 없으면 섹션을 숨긴 채로 둔다.
  function renderSection(id, rows, makeNode) {
    var section = document.getElementById(id);
    if (!section) return 0;
    if (rows.length === 0) return 0;

    /* 한 연도를 .pub-group 하나로 묶는다.
       왼쪽 거터에 연도, 오른쪽에 그 해의 항목들이 들어간다 (style.css 의 .pub-group 그리드). */
    var list = section.querySelector('.pub-list');
    var currentYear = null;
    var items = null;

    for (var i = 0; i < rows.length; i++) {
      if (rows[i].__year !== currentYear) {
        currentYear = rows[i].__year;

        var group = document.createElement('div');
        group.className = 'pub-group';

        var head = document.createElement('h3');
        head.className = 'pub-year';
        head.textContent = currentYear;
        group.appendChild(head);

        items = document.createElement('div');
        items.className = 'pub-items';
        group.appendChild(items);

        list.appendChild(group);
      }
      items.appendChild(makeNode(rows[i]));
    }

    section.hidden = false;
    return rows.length;
  }

  /* 정렬 (SPEC 3.1)
     year 내림차순, 같은 해 안에서는 배열 역순 — 뒤에 있는 항목이 위로 온다.
     폰에서 파일 끝에 객체를 덧붙이면 그 해의 맨 위에 표시되게 하기 위함이다. */
  function sortPublications(rows) {
    return rows.sort(function (a, b) {
      if (b.__year !== a.__year) return b.__year - a.__year;
      return b.__index - a.__index;
    });
  }

  function pick(all, type) {
    var out = [];
    for (var i = 0; i < all.length; i++) {
      if (all[i].type === type) out.push(all[i]);
    }
    return sortPublications(out);
  }

  Promise.all([loadJson('publications.json'), loadJson('awards.json')])
    .then(function (result) {
      var pubs = result[0];
      var awards = result[1];

      // 정렬 기준값을 미리 붙여 둔다. 원본 배열 순서(__index)가 같은 해 안의 순서를 결정한다.
      for (var i = 0; i < pubs.length; i++) {
        pubs[i].__index = i;
        pubs[i].__year = Number(pubs[i].year) || 0;
      }
      // 수상은 date 내림차순 (SPEC 3.2). 연도 묶음은 date 앞 4자리를 쓴다.
      for (var j = 0; j < awards.length; j++) {
        awards[j].__year = Number(String(awards[j].date || '').substring(0, 4)) || 0;
      }
      awards.sort(function (a, b) {
        return String(b.date || '').localeCompare(String(a.date || ''));
      });

      var count = 0;
      count += renderSection('journal',    pick(pubs, 'journal'),    publicationNode);
      count += renderSection('conference', pick(pubs, 'conference'), publicationNode);
      count += renderSection('patent',     pick(pubs, 'patent'),     publicationNode);
      count += renderSection('awards',     awards,                   awardNode);

      // 저자 표기 범례는 논문/발표/특허가 한 건이라도 있을 때만 보인다.
      var note = document.getElementById('author-note');
      if (note && pubs.length > 0) note.hidden = false;

      if (statusBox) {
        if (count === 0) {
          statusBox.textContent = 'No entries yet.';
        } else {
          statusBox.remove();
        }
      }
    })
    .catch(function (err) {
      showError(err.message);
    });
})();
