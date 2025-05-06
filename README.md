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

---

이 가이드는 `kiosk-frontend-user` 프로젝트를 기준으로 작성되었습니다.

