/* 헤더(탭 바) / 푸터 주입 — SPEC 6항
 *
 * 무엇: #site-header 와 #site-footer 를 찾아 내비게이션과 푸터를 채운다.
 * 왜:   HTML 파일이 6개(한글 3 + 영문 3)라 메뉴를 바꿀 때 6곳을 고쳐야 한다.
 *       내비게이션은 검색 노출 영향이 적으므로 여기만 JS 주입을 허용한다.
 * 주의: 본문 설명 텍스트는 절대 이 파일에서 주입하지 말 것 (SPEC 1항 / CLAUDE.md).
 *
 * 라이브러리를 쓰지 않고 순수 DOM API 만 사용한다.
 */

(function () {
  // 페이지 언어는 <html lang> 으로 판별한다 (SPEC 5항과 동일한 규칙).
  var isEn = document.documentElement.lang === 'en';

  // 영문 페이지는 en/ 안에 있으므로 루트로 올라가는 접두사가 필요하다.
  var base = isEn ? '../' : '';

  // 현재 파일명. GitHub Pages 는 디렉토리 주소(.../ 또는 .../en/)로도 서빙하므로
  // 파일명이 비면 index.html 로 간주한다.
  var path = location.pathname;
  var page = path.substring(path.lastIndexOf('/') + 1);
  if (page === '') page = 'index.html';

  // 탭 3개. 루트 HTML 3개와 1:1 대응한다 (SPEC 2항).
  var tabs = isEn
    ? [
        { file: 'index.html',        label: 'Home' },
        { file: 'research.html',     label: 'Research' },
        { file: 'publications.html', label: 'Publications' }
      ]
    : [
        { file: 'index.html',        label: '홈' },
        { file: 'research.html',     label: '연구 분야' },
        { file: 'publications.html', label: '연구 실적' }
      ];

  var siteTitle = isEn ? 'Yunseon Byun' : '변윤선 (Yunseon Byun)';

  // 같은 탭의 반대 언어 페이지로 이동한다. 홈에서 English 를 누르면 영문 홈으로 간다.
  var langHref  = isEn ? '../' + page : 'en/' + page;
  var langLabel = isEn ? '한국어' : 'English';

  var headerHost = document.getElementById('site-header');
  if (headerHost) {
    var header = document.createElement('header');
    header.className = 'site-header';

    var inner = document.createElement('div');
    inner.className = 'site-header-inner';

    var titleLink = document.createElement('a');
    titleLink.className = 'site-title';
    titleLink.href = base + 'index.html';
    titleLink.textContent = siteTitle;
    inner.appendChild(titleLink);

    var lang = document.createElement('a');
    lang.className = 'lang-switch';
    lang.href = langHref;
    lang.setAttribute('hreflang', isEn ? 'ko' : 'en');
    lang.textContent = langLabel;
    inner.appendChild(lang);

    header.appendChild(inner);

    var nav = document.createElement('nav');
    nav.className = 'site-tabs';
    nav.setAttribute('aria-label', isEn ? 'Site sections' : '사이트 메뉴');

    for (var i = 0; i < tabs.length; i++) {
      var a = document.createElement('a');
      a.href = base + tabs[i].file;
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
