# MyCVhomepage

변윤선(Yunseon Byun)의 개인 연구 홈페이지.
연구 분야와 연구 실적을 누적해 정리하기 위한 정적 사이트다.

- 공개 주소: <https://ysb00.github.io/MyCVhomepage/>
- 사양서: [SPEC.md](SPEC.md) · 작업 규칙: [CLAUDE.md](CLAUDE.md)

빌드 도구와 프레임워크를 쓰지 않는다. **휴대폰에서 GitHub 웹 편집기로 직접 갱신**하기
위해서다. 아래 1~4번은 AI 없이 손으로 할 수 있어야 한다.

---

## 1. 논문 / 학회 발표 / 특허 추가

`data/publications.json` 을 열어 **배열의 맨 끝**에 객체를 하나 붙인다.
(끝에 붙이면 그 해의 맨 위에 표시된다. 순서를 손으로 맞출 필요가 없다.)

```json
{
  "id": "2026-jcp-01",
  "year": 2026,
  "type": "journal",
  "authors_en": "Y. Byun*, G. Hong†",
  "title_en": "Paper Title",
  "venue_en": "Journal Name 12(3), 45-67",
  "link": "https://doi.org/...",
  "highlight": false
}
```

| 필드 | 규칙 |
|---|---|
| `id` | 아무 값이나 되지만 **겹치지 않게**. `연도-약칭-번호` 를 권장 |
| `year` | 숫자. 따옴표 없이 `2026` |
| `type` | `journal` / `conference` / `patent` / `working` **넷 중 하나만**. 다른 값은 화면에 안 나온다 |
| `link` | 없으면 `""` (키 자체를 지우지 말 것) |
| `highlight` | `true` 면 목록에서 강조 표시. 보통은 `false` |

- **제1저자 `*` / 교신저자 `†`** 표시는 `authors_en` 문자열 안에 직접 적는다.
  한 건이라도 있으면 페이지 하단에 범례가 자동으로 나온다.
- **아직 출판되지 않은 원고**(투고 준비 중, 심사 중)는 `"type": "working"` 으로 넣는다.
  연도가 없으므로 `"year": ""` 로 두고, 상태는 `venue_en` 에 적는다
  (예: `"venue_en": "Aerospace Science and Technology (in preparation)"`).
  화면에서는 `Journal Articles (working)` 섹션에 연도 묶음 없이 나온다.
  출판되면 `type` 을 `journal` 로 바꾸고 `year` 와 `venue_en` 을 채우면 그 섹션으로 옮겨간다.
- **특허**는 같은 파일에 `"type": "patent"` 로 넣는다.
  국내 특허는 **제목과 발명자를 공보의 국문 표기 그대로** 적는다
  (필드명은 `title_en` / `authors_en` 이지만 공식 표기가 국문이라 그렇게 둔다).
  국문을 쓰는 곳은 국내 특허뿐이다. 저널·학회 발표·수상은 영문으로 적는다.
  `authors_en` 에 발명자, `venue_en` 에 `Reg. 10-1234567` 또는 `App. 10-2026-0001234`,
  `year` 에 등록(또는 출원) 연도를 쓴다.

### 주의

- 앞 객체 끝에 **쉼표 `,`** 를 붙였는지 확인할 것. 가장 흔한 실수다.
- 마지막 객체 뒤에는 쉼표를 붙이지 **않는다**.
- 문법이 틀리면 페이지에 빈 화면 대신 **어느 파일에서 무엇이 틀렸는지** 표시된다.
  그 문구를 보고 고치면 된다.

## 2. 수상 추가

`data/awards.json` 에 객체를 하나 추가한다. 논문과 필드가 다르다.

```json
{
  "id": "2026-best-paper",
  "date": "2026-05-01",
  "title_en": "Best Paper Award",
  "org_en": "Korean Society of OO",
  "link": ""
}
```

- `date` 는 `YYYY-MM-DD` 고정. 일자를 모르면 그 달의 `01` 일로 적는다.
- 화면에는 `date` 내림차순으로 정렬된다.

## 3. CV 갱신

`assets/cv/cv.pdf` 를 **같은 이름으로** 덮어쓴다. HTML 은 고치지 않는다.

파일명에 날짜를 넣지 않는 이유: 이름이 바뀌면 매번 HTML 링크를 고쳐야 하고,
이미 외부에 공유된 링크가 깨진다. 최종 수정일은 `index.html` 본문의
`CV 내려받기 (PDF, updated 2026-08)` 괄호 안 텍스트만 고친다.

## 4. 소개 글 · 약력 · 연구 분야 수정

이 텍스트들은 검색 노출 대상이라 JSON 이 아니라 **HTML 에 직접** 들어 있다.

| 고칠 내용 | 파일 |
|---|---|
| 이름·소속·한 줄 소개·프로필 링크·약력 | `index.html` |
| 연구 분야 설명 | `research.html` |

각 파일에 `TODO(원고)` 주석이 남아 있다. 원고가 준비되면 그 자리를 채우고
`class="todo"` 를 지우면 노란 "원고 준비 중" 표시가 사라진다.
사이트 본문은 영어로 쓴다.

---

## 구조

```
index.html / research.html / publications.html   3개 탭
data/publications.json                           논문 · 학회 발표 · 특허
data/awards.json                                 수상
assets/css/style.css                             스타일 (다크모드 포함)
assets/js/layout.js                              헤더(탭 바) · 푸터 주입
assets/js/render.js                              JSON 로드 및 목록 렌더링
assets/cv/cv.pdf                                 CV (파일명 고정)
assets/img/profile.jpg                           프로필 사진
assets/img/research/                             연구 분야 그림
.nojekyll                                        GitHub Pages 의 Jekyll 처리 비활성화
```

필드에 붙은 `_en` 접미사는 사이트가 영어 전용이 된 뒤에도 그대로 둔다.
나중에 한글을 다시 넣고 싶어지면 기존 항목을 고치지 않고 `_ko` 를 덧붙이면 되기 때문이다.

## 로컬에서 확인하기

`fetch()` 로 JSON 을 읽기 때문에 파일을 더블클릭해서 여는 방식(`file://`)으로는
목록이 뜨지 않는다. 간단한 서버를 띄워서 열면 된다.

```
python3 -m http.server 8000
```

→ 브라우저에서 <http://localhost:8000/>

## 배포

GitHub Pages 로 서빙한다. 저장소 **Settings → Pages** 에서
Source 를 `Deploy from a branch`, 브랜치를 `main` / 폴더를 `/ (root)` 로 두면 된다.
빌드가 없으므로 GitHub Actions 설정은 두지 않는다.
`main` 에 커밋하면 1~2분 뒤 사이트에 반영된다.
