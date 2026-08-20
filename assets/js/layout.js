/* 헤더(탭 바) / 푸터 주입 — SPEC 6항
 *
 * 무엇: #site-header 와 #site-footer 를 찾아 내비게이션과 푸터를 채운다.
 * 왜:   HTML 파일이 3개라 메뉴를 바꿀 때 3곳을 고쳐야 한다.
 *       내비게이션은 검색 노출 영향이 적으므로 여기만 JS 주입을 허용한다.
 * 주의: 본문 설명 텍스트는 절대 이 파일에서 주입하지 말 것 (SPEC 1항 / CLAUDE.md).
 *
 * 라이브러리를 쓰지 않고 순수 DOM API 만 사용한다.
 */

(function () {
  // 현재 파일명. GitHub Pages 는 디렉토리 주소(.../)로도 서빙하므로
  // 파일명이 비면 index.html 로 간주한다.
  var path = location.pathname;
  var page = path.substring(path.lastIndexOf('/') + 1);
  if (page === '') page = 'index.html';

  // 탭 4개. HTML 4개와 1:1 대응한다 (SPEC 2항).
  var tabs = [
    { file: 'index.html',        label: 'Home' },
    { file: 'research.html',     label: 'Research' },
    { file: 'publications.html', label: 'Publications' },
    { file: 'projects.html',     label: 'Projects' }
  ];

  var siteTitle = 'Yunseon Byun';

  var headerHost = document.getElementById('site-header');
  if (headerHost) {
    var header = document.createElement('header');
    header.className = 'site-header';

    var inner = document.createElement('div');
    inner.className = 'site-header-inner';

    var titleLink = document.createElement('a');
    titleLink.className = 'site-title';
    titleLink.href = 'index.html';
    titleLink.textContent = siteTitle;
    inner.appendChild(titleLink);

    header.appendChild(inner);

    var nav = document.createElement('nav');
    nav.className = 'site-tabs';
    nav.setAttribute('aria-label', 'Site sections');

    for (var i = 0; i < tabs.length; i++) {
      var a = document.createElement('a');
      a.href = tabs[i].file;
      a.textContent = tabs[i].label;
      // 현재 탭 표시. 스타일은 style.css 의 [aria-current="page"] 규칙이 담당한다.
      if (tabs[i].file === page) a.setAttribute('aria-current', 'page');
      nav.appendChild(a);
    }

    header.appendChild(nav);
    headerHost.appendChild(header);
  }

  /* 좌측 목차 (research.html 전용)
     본문에 이미 있는 h2 제목을 모아 링크로 만든다. 새 텍스트를 주입하는 것이 아니다.
     h2 가 없으면 아무것도 그리지 않으므로, 원고가 오기 전에는 좌측 열이 비어 있다. */
  var tocHost = document.getElementById('page-toc');
  if (tocHost) {
    var main = document.querySelector('main');
    var heads = main ? main.querySelectorAll('h2') : [];

    if (heads.length > 0) {
      var tocHeading = document.createElement('p');
      tocHeading.className = 'side-heading';
      tocHeading.textContent = 'On this page';
      tocHost.appendChild(tocHeading);

      var toc = document.createElement('nav');
      toc.className = 'anchor-nav';
      toc.setAttribute('aria-label', 'Sections on this page');

      for (var h = 0; h < heads.length; h++) {
        // 원고에 id 를 적어두지 않았으면 자동으로 붙인다.
        if (!heads[h].id) heads[h].id = 'section-' + (h + 1);

        var link = document.createElement('a');
        link.href = '#' + heads[h].id;
        link.textContent = heads[h].textContent;
        toc.appendChild(link);
      }

      tocHost.appendChild(toc);
    }
  }

  var footerHost = document.getElementById('site-footer');
  if (footerHost) {
    var footer = document.createElement('footer');
    footer.className = 'site-footer';

    var finner = document.createElement('div');
    finner.className = 'site-footer-inner';

    var copy = document.createElement('span');
    copy.textContent = '© ' + new Date().getFullYear() + ' ' + siteTitle;
    finner.appendChild(copy);

    footer.appendChild(finner);
    footerHost.appendChild(footer);
  }
})();
