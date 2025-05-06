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

왜 npm install -D 안 썼는가?
tailwindcss@4.x는 ESM 기반이라 type: "module"과 충돌하는 문제가 있음.

npx tailwindcss init -p가 실행되지 않거나 "could not determine executable" 오류 발생.

해결 방법: TailwindCSS 3.2.7로 다운그레이드

npm uninstall tailwindcss
npm install -D tailwindcss@3.2.7 postcss autoprefixer
npx tailwindcss init -p

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

Nginx 설정 목적 및 구성 요약
이 설정은 다음과 같은 목적을 가지고 구성되었습니다:

https://kiosktest.shop/ 접속 시 사용자(유저) 화면을 보여주기 위해.

https://kiosktest.shop/admin 접속 시 관리자 화면을 보여주기 위해.

정적 자산(/assets/)과 업로드 이미지(/uploads/) 경로를 정확히 분리해서 처리.

React에서 사용하는 **SPA(Single Page Application)**의 index.html로 라우팅을 처리하기 위해.

모든 HTTP 접속을 HTTPS로 강제 리디렉션 하기 위해.

/etc/nginx/sites-available/kiosktest.shop 설정 내용 

cat /etc/nginx/nginx.conf



server {
    listen 443 ssl;
    server_name kiosktest.shop;

    ssl_certificate /etc/letsencrypt/live/kiosktest.shop/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/kiosktest.shop/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # ✅ 루트(/) → 유저 화면 (React 기반 SPA)
    location / {
        root /home/ubuntu/kiosk-system/static/user;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # ✅ /user → / 리디렉션 처리 (중복 방지용)
    location = /user {
        return 301 /;
    }

    # ✅ 유저 자산 파일 경로 (/user/assets/)
    location /user/assets/ {
        alias /home/ubuntu/kiosk-system/static/user/assets/;
    }

    # ✅ 관리자 페이지 (React SPA)
    location /admin {
        root /home/ubuntu/kiosk-system/static;
        index index.html;
        try_files $uri $uri/ /admin/index.html;
    }

    # ✅ API는 백엔드로 프록시
    location /api/ {
        proxy_pass http://localhost:8081/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # ✅ 업로드 파일 접근 경로 (/uploads/)
    location /uploads/ {
        alias /home/ubuntu/kiosk-system/uploads/;
    }
}

# ✅ HTTP → HTTPS 리디렉션 처리
server {
    listen 80;
    server_name kiosktest.shop;
    return 301 https://$host$request_uri;
}

 주의할 점
🔒 React에서 만든 결과물은 vite build 후 dist/ 내용을 다음 위치로 복사해야 함:

유저 화면 배포 순서 (Vite + React)
1️⃣ 빌드 실행 (로컬에서)
npm run build
결과물은 dist/ 폴더에 생성됩니다.

2️⃣ 서버로 파일 복사 (Git Bash )
scp -i /경로/Key.pem -r dist/* ubuntu@kiosktest.shop:/home/ubuntu/kiosk-system/static/user/
👉 권한 문제 방지를 위해 바로 이어서 다음 명령 실행:

3️⃣ 서버에서 권한 재설정

sudo chown -R www-data:www-data /home/ubuntu/kiosk-system/static/user
❗ 이유 정리
명령어	이유
cp -r dist/* ...	React로 만든 정적 페이지들을 Nginx가 서빙하는 위치로 복사
chown -R www-data	Nginx는 www-data 권한으로 실행되므로, 파일 접근 오류 방지

1. sudo cp -r dist/* /home/ubuntu/kiosk-system/static/user/
cp: 파일을 복사(copy)

-r: 폴더 전체를 복사할 때 사용 (recursively)

dist/: React 프로젝트를 빌드한 결과 폴더

*: dist 폴더 안에 있는 모든 파일과 폴더

/home/ubuntu/kiosk-system/static/user/: 웹 서버(Nginx)가 유저 화면을 불러오는 위치

👉 즉, 빌드한 유저 화면을 서버가 보는 폴더로 복사하는 명령어입니다.

✅ 2. sudo chown -R www-data:www-data /home/ubuntu/kiosk-system/static/user
chown: 소유자(owner)를 바꿔주는 명령

-R: 해당 폴더뿐 아니라 그 안의 모든 파일까지 적용 (recursive)

www-data:www-data: 사용자:그룹 을 모두 www-data로 변경

/home/ubuntu/kiosk-system/static/user: 변경 대상 폴더

👉 즉, 서버(Nginx)가 이 폴더에 접근할 수 있도록 '주인'을 바꿔주는 것입니다.

🧠 왜 필요할까?
React 앱은 정적 파일(index.html, js, css 등)을 Nginx가 대신 보여줍니다.

그런데 퍼미션이 ubuntu인 경우, Nginx가 접근을 못 하게 될 수 있어요.

그래서 www-data로 권한을 바꿔주면 Nginx가 문제없이 읽어서 출력할 수 있습니다.


