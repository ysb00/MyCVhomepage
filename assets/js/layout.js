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

  // 탭 3개. HTML 3개와 1:1 대응한다 (SPEC 2항).
  var tabs = [
    { file: 'index.html',        label: 'Home' },
    { file: 'research.html',     label: 'Research' },
    { file: 'publications.html', label: 'Publications' }
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
