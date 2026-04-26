import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Reveal } from "@/components/Reveal";
import { supabase } from "@/integrations/supabase/client";
import heroHands from "@/assets/hero-hands.jpg";
import venue from "@/assets/venue.jpg";
import couplePhoto from "@/assets/site/couple.jpg";
// Original site assets — only what's actually used on the page
import bgSilkCream from "@/assets/site/img5.jpg";
import registrationImg from "@/assets/registration.jpg";

export const Route = createFileRoute("/")({
  component: Invitation,
  head: () => ({
    meta: [
      { title: "Сергей & Ангелина · 06.06.2026" },
      { name: "description", content: "Свадебное приглашение Сергея и Ангелины — 6 июня 2026, Челябинск" },
    ],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    name: typeof search.name === "string" ? search.name : "",
  }),
});

function useCountdown(target: Date) {
  const [t, setT] = useState(() => target.getTime() - Date.now());
  useEffect(() => {
    const id = setInterval(() => setT(target.getTime() - Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);
  const s = Math.max(0, Math.floor(t / 1000));
  return {
    d: String(Math.floor(s / 86400)).padStart(2, "0"),
    h: String(Math.floor((s % 86400) / 3600)).padStart(2, "0"),
    m: String(Math.floor((s % 3600) / 60)).padStart(2, "0"),
    s: String(s % 60).padStart(2, "0"),
  };
}

function Divider() {
  return (
    <div className="flex items-center justify-center gap-4 my-12">
      <div className="h-px w-16 bg-foreground/30" />
      <div className="text-foreground/40 text-xs tracking-wider-2">✦</div>
      <div className="h-px w-16 bg-foreground/30" />
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs tracking-wider-2 text-muted-foreground uppercase text-center mb-6">
      {children}
    </div>
  );
}

function Invitation() {
  const { name: urlName } = Route.useSearch();
  const guestName = urlName.trim();
  const [opened, setOpened] = useState(false);
  const c = useCountdown(new Date("2026-06-06T15:30:00+05:00"));
  const [form, setForm] = useState({ name: "", attending: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.attending) return;
    setSending(true);
    setSendError(null);
    try {
      const { error } = await supabase.functions.invoke("send-rsvp", {
        body: { name: form.name.trim(), attending: form.attending },
      });
      if (error) throw error;
      setSubmitted(true);
    } catch (err) {
      console.error("RSVP send failed:", err);
      setSendError("Не удалось отправить ответ. Попробуйте ещё раз.");
    } finally {
      setSending(false);
    }
  };

  if (!opened) {
    return (
      <main
        onClick={() => setOpened(true)}
        className="relative min-h-screen w-full cursor-pointer overflow-hidden bg-background"
      >
        <img
          src={bgSilkCream}
          alt=""
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <img
          src={heroHands}
          alt="Жених и невеста"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover opacity-60 mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-background/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/70" />
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-start pt-20 sm:pt-28 px-6 text-center animate-fade-in">
          <p className="text-[11px] sm:text-xs tracking-wider-2 text-foreground/80 mb-3 sm:mb-4">ВЫ ПОЛУЧИЛИ</p>
          <h1 className="serif text-4xl sm:text-5xl md:text-7xl text-foreground mb-4 sm:mb-6">Приглашение</h1>
          <p className="text-xs sm:text-sm text-foreground/70 italic animate-float">— нажмите на экран —</p>
        </div>
      </main>
    );
  }

  return (
    <main
      className="bg-background text-foreground"
      style={{
        backgroundImage: `url(${bgSilkCream})`,
        backgroundSize: "cover",
        backgroundAttachment: "scroll",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-background/70 backdrop-blur-[1px]">
      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 animate-fade-up overflow-hidden">
        <img
          src={couplePhoto}
          alt="Александр и Дарья"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-background/40" />
        <div className="relative z-10 flex flex-col items-center">
        <div className="flex flex-col items-center text-center">
          <h1 className="serif text-5xl sm:text-6xl md:text-8xl leading-none">Сергей</h1>
          <span className="serif italic text-3xl sm:text-4xl md:text-5xl my-3 sm:my-4 text-foreground/80 font-serif">И</span>
          <h1 className="serif text-5xl sm:text-6xl md:text-8xl leading-none">Ангелина</h1>
        </div>
        <div className="mt-10 sm:mt-12 flex items-center gap-3 sm:gap-6">
          <div className="h-px w-8 sm:w-12 bg-foreground/40" />
          <p className="serif text-lg sm:text-2xl tracking-widest whitespace-nowrap">06 · 06 · 2026</p>
          <div className="h-px w-8 sm:w-12 bg-foreground/40" />
        </div>
        </div>
      </section>

      <Divider />

      {/* CALENDAR */}
      <Reveal>
      <section className="px-6 py-16 sm:py-20">
        <p className="text-2xl tracking-wider-2 text-foreground text-center mb-6">
          {guestName ? guestName.toUpperCase() : "​"}
        </p>
        <p className="mx-auto max-w-xl text-center text-base leading-relaxed text-foreground/90 mb-12">
          С удовольствием приглашаем вас отдохнуть на празднике, посвящённом одному грандиозному событию —{" "}
          <em className="serif">нашей свадьбе!</em>
        </p>
        <SectionLabel>Июнь 2026</SectionLabel>
        <div className="mx-auto max-w-md">
          <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-[10px] sm:text-xs tracking-widest text-muted-foreground mb-3">
            {["пн", "вт", "ср", "чт", "пт", "сб", "вс"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center serif text-base sm:text-lg">
            {Array.from({ length: 35 }).map((_, i) => {
              // June 2026 starts on Monday (offset 0)
              const day = i + 1;
              if (day > 30) return <div key={i} />;
              const isWedding = day === 6;
              return (
                <div
                  key={i}
                  className={
                    isWedding
                      ? "aspect-square flex items-center justify-center rounded-full bg-foreground text-background"
                      : "aspect-square flex items-center justify-center text-foreground/70"
                  }
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>
      </section>
      </Reveal>

      <Divider />

      {/* REGISTRATION */}
      <Reveal>
      <section className="px-6 py-16 sm:py-20">
        <SectionLabel>Регистрация</SectionLabel>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm text-muted-foreground mb-2">Церемония пройдёт по адресу:</p>
          <p className="serif text-xl sm:text-2xl md:text-3xl mb-2">г. Шадринск, ул. Крайняя, д. 17</p>
          <p className="serif italic text-lg sm:text-xl">Санаторий «Жемчужина Зауралья»</p>

          <div className="my-10 overflow-hidden rounded-sm">
            <img src={registrationImg} alt="Место регистрации" loading="lazy" className="w-full h-[260px] sm:h-[360px] md:h-[420px] object-cover" />
          </div>

          <a
            href="https://yandex.ru/maps/?mode=search&text=%D0%A8%D0%B0%D0%B4%D1%80%D0%B8%D0%BD%D1%81%D0%BA%2C+%D1%83%D0%BB.+%D0%9A%D1%80%D0%B0%D0%B9%D0%BD%D1%8F%D1%8F%2C+17"
            target="_blank"
            rel="noreferrer"
            className="inline-block border border-foreground px-8 py-3 text-xs tracking-wider-2 hover:bg-foreground hover:text-background transition-colors"
          >
            СМОТРЕТЬ НА КАРТЕ
          </a>
        </div>
      </section>
      </Reveal>

      <Divider />

      {/* BANQUET */}
      <Reveal>
      <section className="px-6 py-16 sm:py-20">
        <SectionLabel>Банкет</SectionLabel>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm text-muted-foreground mb-2">Наш праздник пройдёт по адресу:</p>
          <p className="serif text-xl sm:text-2xl md:text-3xl mb-2">г. Шадринск, ул. Розы Люксембург, д. 11</p>
          <p className="serif italic text-lg sm:text-xl">Банкетный зал «Купец»</p>

          <div className="my-10 overflow-hidden rounded-sm">
            <img src={venue} alt="Зал" loading="lazy" className="w-full h-[260px] sm:h-[360px] md:h-[420px] object-cover" />
          </div>

          <a
            href="https://yandex.ru/maps/?text=%D0%B3.%20%D0%A8%D0%B0%D0%B4%D1%80%D0%B8%D0%BD%D1%81%D0%BA%2C%20%D1%83%D0%BB.%20%D0%A0%D0%BE%D0%B7%D1%8B%20%D0%9B%D1%8E%D0%BA%D1%81%D0%B5%D0%BC%D0%B1%D1%83%D1%80%D0%B3%2C%20%D0%B4.%2011"
            target="_blank"
            rel="noreferrer"
            className="inline-block border border-foreground px-8 py-3 text-xs tracking-wider-2 hover:bg-foreground hover:text-background transition-colors"
          >
            СМОТРЕТЬ НА КАРТЕ
          </a>
        </div>
      </section>
      </Reveal>

      <Divider />

      {/* TIMING */}
      <Reveal>
      <section className="px-6 py-16 sm:py-20">
        <SectionLabel>Тайминг</SectionLabel>
        <div className="mx-auto max-w-2xl space-y-8 sm:space-y-10">
          {[
            { time: "14:30", title: "Сбор гостей", text: "Время общения, приветственный фуршет и бокал игристого" },
            { time: "14:45", title: "Регистрация", text: "Вы станете свидетелями того, как мы скажем друг другу «да»" },
            { time: "17:30", title: "Банкет", text: "Готовьте удобные туфли и хорошее настроение — скучно не будет" },
          ].map((row) => (
            <div key={row.time} className="grid grid-cols-[70px_1fr] sm:grid-cols-[80px_1fr] md:grid-cols-[120px_1fr] gap-4 sm:gap-6 items-baseline border-b border-foreground/10 pb-6 sm:pb-8">
              <div className="serif text-2xl sm:text-3xl md:text-4xl">{row.time}</div>
              <div>
                <div className="text-[11px] sm:text-xs tracking-wider-2 uppercase mb-2">{row.title}</div>
                <p className="text-sm text-muted-foreground leading-relaxed">{row.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      </Reveal>

      <Divider />

      {/* DRESS CODE */}
      <Reveal>
      <section className="px-6 py-16 sm:py-20">
        <SectionLabel>Дресс-код</SectionLabel>
        <p className="mx-auto max-w-xl text-center text-base text-muted-foreground mb-10">
          Мы будем очень рады если вы поддержите наше летнее настроение своим нарядом
        </p>
        <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-4 sm:gap-6 md:gap-8">
          {[
            { hex: "#D7A192", name: "Rose Tan", code: "16-1511 TCX" },
            { hex: "#FDF38A", name: "Pastel Yellow", code: "Pantone 910 C" },
            { hex: "#7BB7C9", name: "Saltwater Slide", code: "12-4611 TCX" },
            { hex: "#5A6B43", name: "Cactus", code: "18-0130 TCX" },
            { hex: "#4F2C1D", name: "Deep Brown", code: "PMS 4625 C" },
          ].map((c) => (
            <div
              key={c.code}
              className="flex flex-col items-center text-center basis-[calc(33.333%-1rem)] sm:basis-[calc(33.333%-1.5rem)] md:basis-[calc(20%-1.6rem)]"
            >
              <div
                className="aspect-square w-full rounded-full ring-1 ring-foreground/10"
                style={{ backgroundColor: c.hex }}
                aria-label={`${c.name} ${c.hex}`}
              />
              <p className="serif italic mt-3 text-sm">{c.name}</p>
              <p className="text-[10px] tracking-wider-2 text-muted-foreground mt-1">{c.code}</p>
            </div>
          ))}
        </div>
      </section>
      </Reveal>

      <Divider />

      {/* VK CHAT */}
      <Reveal>
      <section className="px-6 py-16 sm:py-20">
        <SectionLabel>Наш чат ВКонтакте</SectionLabel>
        <div className="mx-auto max-w-2xl text-center space-y-8">
          <p className="serif text-xl sm:text-2xl md:text-3xl leading-relaxed">
            Поделитесь моментами нашего праздника
          </p>
          <p className="text-base text-muted-foreground leading-relaxed">
            Мы создали уютный чат, где вы можете делится снимками и видео — самые искренние улыбки, тёплые объятия и яркие кадры этого дня. Присоединяйтесь, чтобы вместе сохранить волшебство нашей свадьбы.
          </p>
          <a
            href="https://vk.me/join//YL0CfnjMR5SX9vrTBHWQJvuU/F6PMWeS50="
            target="_blank"
            rel="noreferrer"
            className="inline-block border border-foreground px-8 py-3 text-xs tracking-wider-2 hover:bg-foreground hover:text-background transition-colors"
          >
            ПРИСОЕДИНИТЬСЯ К ЧАТУ
          </a>
        </div>
      </section>
      </Reveal>

      <Divider />

      {/* WISHES */}
      <Reveal>
      <section className="px-6 py-16 sm:py-20">
        <SectionLabel>Пожелания</SectionLabel>
        <div className="mx-auto max-w-2xl space-y-6 sm:space-y-8 text-center">
          <p className="serif text-lg sm:text-xl md:text-2xl leading-relaxed">
            Главное для нас — ваше внимание, а радость доставит любой <em>подарок в конверте</em>.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed">
           Пожалуйста, <span className="text-foreground">не дарите цветы</span>. А если хотите сделать нам комплимент, подарите нам <em className="serif text-foreground">лотерейный билет</em> — пусть удача станет нашим первым семейным выигрышем.
          </p>
          <p className="text-sm text-muted-foreground italic pt-4">
            Если вы подготовили творческий подарок, предупредите о нём нашего помощника Наталью заранее — мы с удовольствием включим его в программу вечера.
          </p>
        </div>
      </section>
      </Reveal>

      <Divider />

      {/* CONTACTS */}
      <Reveal>
      <section className="px-6 py-16 sm:py-20">
        <SectionLabel>Контакты</SectionLabel>
        <p className="text-center text-sm text-muted-foreground mb-10">
          Если у вас остались вопросы — мы с удовольствием на них ответим.
        </p>
        <div className="mx-auto grid max-w-3xl gap-6 sm:gap-8 md:grid-cols-2">
          {[
            { role: "Ангелина — невеста", phone: "+7 912 973 73 09" },
            { role: "Наталья — ведущая", phone: "+7 912 520 35 50" },
          ].map((c) => (
            <div key={c.phone} className="text-center border border-foreground/15 p-6 sm:p-8">
              <p className="text-xs tracking-wider-2 text-muted-foreground uppercase mb-3">{c.role}</p>
              <a href={`tel:${c.phone.replace(/\s/g, "")}`} className="serif text-xl sm:text-2xl hover:italic break-all">
                {c.phone}
              </a>
            </div>
          ))}
        </div>
      </section>
      </Reveal>

      <Divider />

      {/* RSVP */}
      <Reveal>
      <section className="px-6 py-16 sm:py-20 bg-secondary/40">
        <SectionLabel>Анкета гостя</SectionLabel>
        <p className="text-center text-sm text-muted-foreground mb-2">
          Пожалуйста, подтвердите своё присутствие до
        </p>
        <p className="serif text-center text-xl mb-10">1 июня 2026 г.</p>

        {submitted ? (
          <div className="mx-auto max-w-md text-center serif text-2xl py-12">
            Спасибо, что ответили!
          </div>
        ) : (
          <form
            onSubmit={handleRsvpSubmit}
            className="mx-auto max-w-md space-y-6"
          >
            <div>
              <label className="block text-xs tracking-wider-2 text-muted-foreground mb-2">ВАШЕ ИМЯ И ФАМИЛИЯ</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-transparent border-b border-foreground/30 py-2 serif text-lg focus:border-foreground outline-none"
              />
            </div>
            <div>
              <p className="text-xs tracking-wider-2 text-muted-foreground mb-3">ВАШЕ ПРИСУТСТВИЕ</p>
              <div className="space-y-2">
                {["Приду с удовольствием", "Не смогу присутствовать"].map((opt) => (
                  <label key={opt} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="att"
                      value={opt}
                      checked={form.attending === opt}
                      onChange={(e) => setForm({ ...form, attending: e.target.value })}
                      className="accent-foreground"
                    />
                    <span className="serif text-lg">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
            <button
              type="submit"
              disabled={sending}
              className="w-full bg-foreground text-background py-4 text-xs tracking-wider-2 hover:bg-foreground/90 transition-colors disabled:opacity-60"
            >
              {sending ? "ОТПРАВЛЯЕМ..." : "ПОДТВЕРДИТЬ"}
            </button>
            {sendError && (
              <p className="text-xs text-destructive text-center">{sendError}</p>
            )}
            <p className="text-xs text-muted-foreground text-center pt-2">
              Анкету заполните индивидуально на каждого гостя.
            </p>
          </form>
        )}
      </section>
      </Reveal>

      {/* COUNTDOWN */}
      <Reveal>
      <section className="px-6 py-20 sm:py-24 text-center">
        <SectionLabel>Wedding Date</SectionLabel>
        <p className="serif text-xl sm:text-2xl mb-10">До свадьбы осталось:</p>
        <div className="mx-auto grid max-w-2xl grid-cols-4 gap-2 sm:gap-4 md:gap-8">
          {[
            { v: c.d, l: "Дней" },
            { v: c.h, l: "Часов" },
            { v: c.m, l: "Минут" },
            { v: c.s, l: "Секунд" },
          ].map((u) => (
            <div key={u.l}>
              <div className="serif text-3xl sm:text-4xl md:text-6xl">{u.v}</div>
              <div className="text-[10px] sm:text-xs tracking-wider-2 text-muted-foreground mt-2 uppercase">{u.l}</div>
            </div>
          ))}
        </div>
        <div className="mt-20 serif italic text-xl text-muted-foreground">
          Сергей &amp; Ангелина
        </div>
        <div className="text-xs tracking-wider-2 text-muted-foreground mt-2">06 · 06 · 2026</div>
      </section>
      </Reveal>
      </div>
    </main>
  );
}
