## 🛠️ Kiosk User 화면 배포 및 TailwindCSS 설정 가이드

### 📦 1. User 프로젝트 빌드

```bash
npm run build
```

* 결과물은 `dist/` 폴더에 생성됨

---

### ☁️ 2. 서버에 정적 파일 업로드

```bash
scp -i /경로/to/YourKey.pem -r dist/* ubuntu@서버주소:/home/ubuntu/kiosk-system/static/user/
```

#### ❗ 오류 발생 시 예시:

```
scp: dest open ... Permission denied
scp: failed to upload ...
```

#### 🔍 원인:

* `/static/user/` 폴더의 소유자가 `ubuntu`가 아니라 `www-data`일 수 있음

---

### 🔐 3. 권한 변경 ("니땅 내땅" 문제 해결)

```bash
# 업로드 전 초기화 및 복사
sudo rm -rf /home/ubuntu/kiosk-system/static/user/*
sudo cp -r /home/ubuntu/upload/user/* /home/ubuntu/kiosk-system/static/user/

# 웹서버 계정으로 권한 이전
sudo chown -R www-data:www-data /home/ubuntu/kiosk-system/static/user
```

> 📌 `www-data`는 Nginx가 사용하는 기본 계정입니다.

---

### 🎨 4. Tailwind CSS 설치 문제 해결

#### ⚠️ 실패했던 방법 (사용 금지)

```bash
npx tailwindcss init -p  # ❌ 오류 발생: 실행 파일 못 찾음
```

#### ✅ 안정적인 설치 방법 (v3.2.7 사용)

```bash
npm uninstall tailwindcss
npm install -D tailwindcss@3.2.7 postcss autoprefixer
npx tailwindcss init -p
```

#### 📂 설정 파일 확인

* `tailwind.config.js` 생성됨
* `postcss.config.js` 생성됨
* `index.css`에 아래 코드 포함

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### 📥 React 진입 파일에서 CSS import

```js
// index.jsx 또는 main.jsx
import './index.css';
```

---

### 🚀 5. Nginx 다시 불러오기 (정적 자산 반영)

```bash
sudo systemctl reload nginx
```

---

### 🧩 기타 팁

* devDependencies(`dev`)는 프로덕션 환경에선 불안정할 수 있음 → `dependencies` 위주로 관리 필요
* ESM 기반 Tailwind v4는 기존 Vite/Node 환경과 충돌 가능성 높음 → v3.x 권장
* 업로드 후 반드시 권한 재조정 필수

❌ npm run dev 사용 금지 이유
❗ 이유 1. Vite dev 서버는 localhost에서만 작동
npm run dev는 개발용 서버(http://localhost:5173)를 띄워서 개발자 브라우저에서만 접근 가능합니다.

실제 키오스크처럼 외부 접속(https://kiosktest.shop)이 필요한 상황에서는 작동하지 않습니다.

❗ 이유 2. 정적 배포 경로(/static/user/)와 완전히 다름
dev 서버는 Vite 내부적으로 리소스를 가상 경로로 처리하지만,
배포는 dist/index.html, dist/assets/를 정적으로 업로드해야 합니다.

그래서 npm run build 결과물만 사용해야 이미지·JS·CSS가 엔진엑스(nginx)로 연결됩니다.

❗ 이유 3. 이전에 dev를 사용해 배포가 꼬여서 '인증번호 화면'만 나왔음
실제 npm run dev로 실행된 화면을 그대로 배포했더니,
오래된 index.html + 캐시된 리소스로 인해 인증번호 화면이 반복 출력되었습니다.

/user/index.html이 vite dev 기준으로 렌더링되면서 오류 발생했습니다.

✅ 반드시 npm run build → scp로 업로드해야만 동작

npm run build
scp -i pem키 -r dist/* ubuntu@서버:/home/ubuntu/kiosk-system/static/user/

