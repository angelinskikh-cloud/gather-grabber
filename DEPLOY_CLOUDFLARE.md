# Деплой на Cloudflare Workers

## 1. Подготовка

```bash
bun install
bun add -d wrangler
```

Залогиньтесь в Cloudflare:

```bash
bunx wrangler login
```

## 2. Билд и деплой

```bash
bun run build
bunx wrangler deploy
```

После первого деплоя сайт будет доступен на:
`https://gather-grabber.<your-account>.workers.dev`

## 3. Переменные окружения

Публичные переменные (`VITE_*`, `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`)
уже прописаны в `wrangler.toml` — менять ничего не нужно.

Секреты (если используете admin-операции или Resend):

```bash
bunx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
bunx wrangler secret put RESEND_API_KEY
```

> ℹ️ RSVP-форма вызывает Supabase Edge Function `send-rsvp` напрямую через
> Supabase, а не через Cloudflare Worker. `RESEND_API_KEY` нужен только в
> настройках Supabase (он там уже задан) — для Cloudflare он не требуется.

## 4. Кастомный домен (чтобы открывалось без VPN в РФ)

1. Cloudflare Dashboard → **Websites → Add a site** → введите свой домен.
2. Смените NS-записи у регистратора на те, что выдаст Cloudflare.
   Дождитесь статуса **Active**.
3. **Workers & Pages → gather-grabber → Settings → Domains & Routes →
   Add → Custom Domain** → укажите `yourdomain.ru` и отдельно
   `www.yourdomain.ru`. Cloudflare сам пропишет DNS и выпустит SSL.

## 5. Авто-деплой из GitHub (опционально)

В Cloudflare Dashboard: **Workers & Pages → Create → Connect to Git** →
выберите репозиторий. Build command: `npm run build`. Deploy command:
`npx wrangler deploy`.

## Проверка

- `https://gather-grabber.<account>.workers.dev` открывается без VPN.
- RSVP-форма отправляется (письмо приходит на почту).
- Все страницы и роуты работают при прямом переходе по URL.