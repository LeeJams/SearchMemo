## 서치메모 / MemoFind

<img src="./assets/icon.png" width="120" alt="MemoFind icon">

> 검색할 단어와 질문을 빠르게 저장해 두고, 필요한 순간 검색 엔진이나 AI 서비스로 바로 연결하는 Expo/React Native 앱입니다.

사용자가 나중에 검색해야 할 정보를 간편하게 기록하고, 메모를 선택하면 Google, YouTube, Bing, ChatGPT, Gemini, Perplexity 등 선택한 서비스로 즉시 이어집니다. 복사/붙여넣기 과정을 줄여 검색과 탐색 흐름을 빠르게 만드는 것이 목표입니다.

### 주요 기능

- 빠른 메모 작성, 수정, 삭제
- 검색 엔진/AI 서비스 선택 설정
- 라이트/다크/시스템 테마
- 다국어 UI
- 로컬 저장소 기반 메모 보관

### 개발 명령

```bash
npm run start
npm run android
npm run ios
npm run web
npm run test
npm run check
```

### 데이터 안내

메모와 앱 설정은 기기 로컬 저장소에 저장됩니다. 장기 사용자를 위해 메모 데이터는 스키마 버전을 포함해 저장되며, 이전 버전의 날짜 기반 메모도 새 구조로 마이그레이션됩니다.
