# ARKİM ERP

## Kurulum

### 1. Supabase
1. supabase.com → Projenize girin → SQL Editor
2. `supabase_setup.sql` içeriğini çalıştırın
3. Settings → API → URL ve anon key'i kopyalayın

### 2. index.html - Yapılandırma
`index.html` içinde şu satırları bulun ve doldurun:
```js
var SUPA_URL  = 'https://XXXX.supabase.co';
var SUPA_ANON = 'eyJ...';
var VERCEL_API = 'https://arkim-erp.vercel.app/api/data';
```

### 3. GitHub
1. GitHub'da yeni repo oluşturun: `arkim-erp`
2. Bu klasörü push edin

### 4. Vercel
1. vercel.com → New Project → GitHub reponuzu seçin
2. Environment Variables ekleyin:
   - `SUPABASE_URL` = https://XXXX.supabase.co
   - `SUPABASE_SERVICE_KEY` = service_role key (Settings>API)
3. Deploy edin

### Giriş Bilgileri
- Kullanıcı: `yakupc` / Şifre: `Ltb123456`
- Kullanıcı: `admin` / Şifre: `arkem2025`
