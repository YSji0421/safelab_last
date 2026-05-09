# Landing 이미지

이 폴더에 다음 두 파일을 저장하면 자동으로 랜딩페이지에 표시됩니다.

| 파일명 | 어디에 보이나 | 설명 |
|---|---|---|
| `safelab-hero.png` | Hero 메인 비주얼 (우상단 큰 박스) | safelab 로고 + 실험실 일러스트 |
| `safelab-dashboard.png` | Lineup 1번 SafeLab Education 카드 | Active Experiments 대시보드 UI |

## 이미지가 없을 때

`onError` 처리로 broken image 대신 그라디언트 + 아이콘 fallback이 표시됩니다.

## 다른 파일명으로 쓰고 싶다면

[src/data/landing.js](../../src/data/landing.js)의 `image:` 필드만 바꾸세요.

```js
HERO.image = '/landing/MY-FILE.png';
LINEUP.items[0].image = '/landing/MY-OTHER.png';
```

## 권장 사양

- 비율: Hero는 가로형(4:3 또는 16:9), Lineup 카드는 가로형(약 5:3)
- 해상도: 1024×768 이상 권장 (retina 대응 시 2배 권장)
- 포맷: png 또는 jpg, 1MB 이하 권장
