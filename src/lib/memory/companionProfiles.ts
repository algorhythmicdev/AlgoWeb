export interface CompanionActions {
  open: string;
  hide: string;
  closePanel: string;
  send: string;
  suggestionLabel: string;
  formLabel: string;
  reset: string;
}

export interface CompanionSuggestion {
  title: string;
  prompt: string;
}

export interface CompanionKnowledgeEntry {
  keywords: string[];
  answer: string;
}

export interface CompanionProfile {
  name: string;
  role: string;
  dialogLabel: string;
  greeting: string;
  languageSwitch: string;
  placeholder: string;
  actions: CompanionActions;
  latency: number;
  suggestions: CompanionSuggestion[];
  knowledgeBase: CompanionKnowledgeEntry[];
  fallback: string;
}

export interface CompanionMessage {
  sender: "user" | "companion";
  text: string;
}

export const companionProfiles = {
  en: {
    name: "Lumen",
    role: "Your AlgoRhythmics guide",
    dialogLabel: "AlgoRhythmics AI companion",
    greeting:
      "Hey there! I am Lumen, your AlgoRhythmics companion. Ask about our lab, products, or how we can partner on AI adventures.",
    languageSwitch:
      "We're back in English. Let me know how I can support your next idea.",
    placeholder:
      "Ask us about the lab, a product, or how we partner with teams...",
    actions: {
      open: "Open AI companion",
      hide: "Hide AI companion",
      closePanel: "Close companion",
      send: "Send",
      suggestionLabel: "Suggestions",
      formLabel: "Send a message",
      reset: "Reset conversation",
    },
    latency: 520,
    suggestions: [
      {
        title: "Explore our AI lab",
        prompt: "What makes AlgoRhythmics different from other AI agencies?",
      },
      {
        title: "NodeVoyage platform",
        prompt: "Tell me about the NodeVoyage travel platform.",
      },
      {
        title: "Ideonautix suite",
        prompt: "How can the Ideonautix productivity suite help teams?",
      },
      {
        title: "Improve my AI strategy",
        prompt: "How could we improve our AI initiative with AlgoRhythmics?",
      },
    ],
    knowledgeBase: [
      {
        keywords: [
          "different",
          "unique",
          "lab",
          "agency",
          "algorhythmics",
          "culture",
        ],
        answer:
          "AlgoRhythmics blends rigorous engineering with motion-inspired creativity. We operate as an innovation lab, shipping flagship products while mentoring partners so they inherit the same R&D mindset.",
      },
      {
        keywords: ["nodevoyage", "travel", "platform", "journey", "trip"],
        answer:
          "NodeVoyage is our intelligent travel experience platform. It uses graph-powered itineraries, dynamic storytelling, and adaptive agents to craft journeys that feel both personal and delightfully unexpected.",
      },
      {
        keywords: [
          "ideonautix",
          "productivity",
          "suite",
          "team",
          "collaboration",
        ],
        answer:
          "Ideonautix is a constellation of collaborative AI copilots built for knowledge teams. It orchestrates ideation sessions, decision intelligence, and ambient automation so focus stays on high-value thinking.",
      },
      {
        keywords: [
          "contact",
          "consulting",
          "engage",
          "work with",
          "partnership",
        ],
        answer:
          "You can reach our consulting team through the contact page or by emailing hello@algorhythmics.com. We love scoping proofs of concept and long-term partnerships alike.",
      },
      {
        keywords: ["improve", "improvement", "optimize", "growth", "strategy"],
        answer:
          "A good first step is a discovery sprint: we map your goals, audit existing data flows, and prototype a focused AI assist. From there we co-design experimentation loops so your team keeps improving after launch.",
      },
    ],
    fallback:
      "I'm still learning, but I can connect you with the team or share highlights about our products, lab culture, and services.",
  },
  lv: {
    name: "Lumen",
    role: "Jūsu AlgoRhythmics gids",
    dialogLabel: "AlgoRhythmics AI pavadonis",
    greeting:
      "Sveicināti! Esmu Lumen — jūsu AlgoRhythmics pavadonis. Jautājiet par mūsu laboratoriju, produktiem vai sadarbības iespējām Baltijā un pasaulē.",
    languageSwitch:
      "Pārslēdzos uz latviešu valodu. Pastāstiet, kā varu palīdzēt jūsu nākamajam projektam.",
    placeholder: "Jautājiet mums par laboratoriju, produktu vai sadarbību...",
    actions: {
      open: "Atvērt AI pavadoni",
      hide: "Paslēpt AI pavadoni",
      closePanel: "Aizvērt pavadoni",
      send: "Sūtīt",
      suggestionLabel: "Ieteikumi",
      formLabel: "Nosūtīt ziņu",
      reset: "Sākt sarunu no jauna",
    },
    latency: 560,
    suggestions: [
      {
        title: "Izpētīt AI laboratoriju",
        prompt: "Ar ko AlgoRhythmics atšķiras no citām AI aģentūrām?",
      },
      {
        title: "NodeVoyage platforma",
        prompt: "Pastāsti par NodeVoyage ceļojumu platformu.",
      },
      {
        title: "Ideonautix komplekts",
        prompt: "Kā Ideonautix palīdz komandām Latvijā un Eiropā?",
      },
      {
        title: "Uzlabot manu AI stratēģiju",
        prompt: "Kā AlgoRhythmics var palīdzēt uzlabot mūsu AI iniciatīvu?",
      },
    ],
    knowledgeBase: [
      {
        keywords: [
          "atšķir",
          "unik",
          "laboratorija",
          "aģentūra",
          "algorhythmics",
        ],
        answer:
          "AlgoRhythmics apvieno inženieriju ar kustību iedvesmotu radošumu. Strādājam kā inovāciju laboratorija, palīdzot partneriem ieviest eksperimentēšanas kultūru Baltijas tirgū.",
      },
      {
        keywords: [
          "nodevoyage",
          "ceļojums",
          "platforma",
          "maršruts",
          "turisms",
        ],
        answer:
          "NodeVoyage ir gudrs ceļojumu palīgs, kas analizē kopienu pieredzi un stāsta stāstus par Latvijas un Eiropas galamērķiem, pielāgojot maršrutus jūsu ritmam.",
      },
      {
        keywords: ["ideonautix", "produktivitāte", "komanda", "sadarbība"],
        answer:
          "Ideonautix piedāvā AI līdzbraucējus komandām, kas veic attālinātu darbu. Tas palīdz strukturēt sapulces, lēmumus un zīmolu izstrādi latviešu un starptautiskos projektos.",
      },
      {
        keywords: ["sadarbība", "kontakts", "konsultācija", "projekts"],
        answer:
          "Droši rakstiet hello@algorhythmics.com vai izmantojiet kontaktformu. Var organizēt darbnīcu Rīgā vai tiešsaistē, lai ātri uzsāktu sadarbību.",
      },
      {
        keywords: ["uzlabot", "pilnveidot", "stratēģija", "idejas"],
        answer:
          "Iesakām kopīgu darbnīcu: kartējam jūsu biznesa mērķus, izvērtējam datu kvalitāti un izveidojam izmēģinājuma risinājumu, ko var testēt ar vietējo auditoriju.",
      },
    ],
    fallback:
      "Vēl mācos, bet varu jūs savienot ar komandu vai dalīties ar informāciju par mūsu produktiem un pakalpojumiem.",
  },
  ru: {
    name: "Люмен",
    role: "Ваш проводник AlgoRhythmics",
    dialogLabel: "AI-помощник AlgoRhythmics",
    greeting:
      "Здравствуйте! Я Люмен, ваш виртуальный помощник AlgoRhythmics. Расскажите, что интересно про лабораторию, продукты или международное сотрудничество.",
    languageSwitch: "Перехожу на русский язык. Чем могу помочь дальше?",
    placeholder: "Спросите о лаборатории, продукте или совместной работе...",
    actions: {
      open: "Открыть AI-помощника",
      hide: "Скрыть AI-помощника",
      closePanel: "Закрыть помощника",
      send: "Отправить",
      suggestionLabel: "Подсказки",
      formLabel: "Отправить сообщение",
      reset: "Начать диалог заново",
    },
    latency: 560,
    suggestions: [
      {
        title: "Что делает нас особенными",
        prompt: "Чем AlgoRhythmics отличается от других AI-команд?",
      },
      {
        title: "Платформа NodeVoyage",
        prompt: "Расскажи о возможностях платформы NodeVoyage.",
      },
      {
        title: "Комплект Ideonautix",
        prompt: "Как Ideonautix помогает распределённым командам?",
      },
      {
        title: "Как улучшить AI-проекты",
        prompt:
          "Какие шаги помогут улучшить наш AI-проект вместе с AlgoRhythmics?",
      },
    ],
    knowledgeBase: [
      {
        keywords: [
          "отличается",
          "особенный",
          "лаборатория",
          "команда",
          "algorhythmics",
        ],
        answer:
          "AlgoRhythmics соединяет строгую инженерию и творческое мышление. Мы строим экспериментальные продукты и делимся методологиями, чтобы партнёры могли расти на рынках Балтии и СНГ.",
      },
      {
        keywords: ["nodevoyage", "путешествие", "маршрут", "туризм"],
        answer:
          "NodeVoyage — это интеллектуальная платформа для путешествий. Она анализирует культурные сценарии, рекомендации сообществ и помогает строить маршруты под ваш темп исследования.",
      },
      {
        keywords: ["ideonautix", "продуктивность", "команда", "сотрудничество"],
        answer:
          "Ideonautix предоставляет набор цифровых помощников для продуктовых и исследовательских команд. Они помогают готовить питчи, управлять знаниями и поддерживать кросс-культурные команды.",
      },
      {
        keywords: ["контакт", "сотрудничество", "консалтинг", "связаться"],
        answer:
          "Пишите на hello@algorhythmics.com или оставьте заявку через форму. Мы предлагаем пилотные проекты, воркшопы и долгосрочные партнёрства.",
      },
      {
        keywords: ["улучшить", "оптимизировать", "стратегия", "рост"],
        answer:
          "Для улучшения мы начинаем с аналитической сессии: оцениваем процессы, данные и культурные особенности аудитории, затем создаём дорожную карту быстрых экспериментов.",
      },
    ],
    fallback:
      "Я ещё учусь, но могу соединить вас с командой или поделиться основными материалами о наших продуктах и услугах.",
  },
  uk: {
    name: "Люмен",
    role: "Ваш провідник AlgoRhythmics",
    dialogLabel: "AI-помічник AlgoRhythmics",
    greeting:
      "Вітаю! Я Люмен — супутник AlgoRhythmics. Розкажу про нашу лабораторію, продукти та можливості партнерства з урахуванням українського ринку.",
    languageSwitch: "Переходжу на українську. З чого продовжимо?",
    placeholder: "Запитайте про лабораторію, продукт чи співпрацю...",
    actions: {
      open: "Відкрити AI-супутника",
      hide: "Сховати AI-супутника",
      closePanel: "Закрити супутника",
      send: "Надіслати",
      suggestionLabel: "Підказки",
      formLabel: "Надіслати повідомлення",
      reset: "Почати розмову спочатку",
    },
    latency: 540,
    suggestions: [
      {
        title: "Дізнатися про лабораторію",
        prompt: "Чим AlgoRhythmics відрізняється від інших AI-агенцій?",
      },
      {
        title: "Платформа NodeVoyage",
        prompt: "Розкажи про платформу NodeVoyage для мандрівок.",
      },
      {
        title: "Сервіс Ideonautix",
        prompt: "Як Ideonautix допомагає творчим командам?",
      },
      {
        title: "Покращити AI-ініціативу",
        prompt:
          "Які кроки допоможуть покращити наш AI-проєкт разом з AlgoRhythmics?",
      },
    ],
    knowledgeBase: [
      {
        keywords: [
          "відрізняється",
          "унікальність",
          "лабораторія",
          "агенція",
          "algorhythmics",
        ],
        answer:
          "AlgoRhythmics поєднує інженерну дисципліну та креативність. Ми допомагаємо партнерам будувати сміливі AI-рішення й розвивати культуру інновацій на ринках Східної Європи.",
      },
      {
        keywords: ["nodevoyage", "подорож", "маршрут", "туризм"],
        answer:
          "NodeVoyage — це інтелектуальний супутник мандрівника. Він будує історії маршрутів, враховуючи локальні рекомендації, сезонність та ваш стиль відкриттів.",
      },
      {
        keywords: ["ideonautix", "продуктивність", "команда", "співпраця"],
        answer:
          "Ideonautix — набір AI-коу-пілотів для команд, що працюють зі складними ідеями. Він структурує брейншторми, аналізує рішення та допомагає координувати міжнародні групи.",
      },
      {
        keywords: ["контакт", "співпраця", "консалтинг", "звʼязок"],
        answer:
          "Напишіть на hello@algorhythmics.com або залиште заявку на сайті. Організуємо воркшоп чи discovery-спринт для старту спільної роботи.",
      },
      {
        keywords: ["покращити", "оптимізувати", "стратегія", "розвиток"],
        answer:
          "Для покращення ми проводимо діагностичну сесію: перевіряємо готовність команди, доступні дані та очікування користувачів, після чого формуємо дорожню карту експериментів.",
      },
    ],
    fallback:
      "Я ще вчуся, але можу зʼєднати вас з нашою командою або надіслати матеріали про продукти й послуги.",
  },
  fr: {
    name: "Lumen",
    role: "Votre guide AlgoRhythmics",
    dialogLabel: "Compagnon IA AlgoRhythmics",
    greeting:
      "Bonjour ! Je suis Lumen, compagnon AlgoRhythmics. Parlons de notre laboratoire, de nos produits ou d'un partenariat adapté aux marchés européens.",
    languageSwitch: "Je poursuis en français. Comment puis-je vous aider ?",
    placeholder:
      "Posez une question sur le labo, un produit ou une collaboration...",
    actions: {
      open: "Ouvrir l'assistant IA",
      hide: "Masquer l'assistant IA",
      closePanel: "Fermer l'assistant",
      send: "Envoyer",
      suggestionLabel: "Suggestions",
      formLabel: "Envoyer un message",
      reset: "Réinitialiser la conversation",
    },
    latency: 520,
    suggestions: [
      {
        title: "Découvrir notre laboratoire",
        prompt: "En quoi AlgoRhythmics se distingue des autres agences IA ?",
      },
      {
        title: "Plateforme NodeVoyage",
        prompt: "Peux-tu me présenter la plateforme de voyage NodeVoyage ?",
      },
      {
        title: "Suite Ideonautix",
        prompt: "Comment Ideonautix soutient-elle les équipes créatives ?",
      },
      {
        title: "Améliorer ma stratégie IA",
        prompt: "Comment améliorer notre initiative IA avec AlgoRhythmics ?",
      },
    ],
    knowledgeBase: [
      {
        keywords: [
          "différenc",
          "unique",
          "laboratoire",
          "agence",
          "algorhythmics",
        ],
        answer:
          "AlgoRhythmics marie rigueur d'ingénierie et imagination chorégraphique. Nous partageons cette méthode avec nos partenaires pour créer des expériences IA utiles en Europe et au-delà.",
      },
      {
        keywords: ["nodevoyage", "voyage", "itinéraire", "tourisme"],
        answer:
          "NodeVoyage est notre plateforme de voyage intelligente. Elle combine graphes de destinations, récits culturels et agents adaptatifs pour offrir des parcours sur mesure.",
      },
      {
        keywords: ["ideonautix", "productivité", "équipe", "collaboration"],
        answer:
          "Ideonautix est une constellation de copilotes IA. Elle facilite les ateliers de co-création, la prise de décision et le suivi des performances pour les startups.",
      },
      {
        keywords: ["contact", "partenariat", "consulting", "collaborer"],
        answer:
          "Contactez hello@algorhythmics.com ou utilisez notre formulaire. Nous proposons des ateliers discovery, des pilotes rapides et des programmes d'accompagnement.",
      },
      {
        keywords: ["améliorer", "optimiser", "stratégie", "croissance"],
        answer:
          "Pour progresser, nous organisons un diagnostic express : analyse de vos flux de données, culture d'équipe et attentes clients, puis feuille de route d'expérimentations.",
      },
    ],
    fallback:
      "Je m'améliore encore, mais je peux vous mettre en relation avec notre équipe ou partager des informations clés sur nos services.",
  },
  es: {
    name: "Lumen",
    role: "Tu guía de AlgoRhythmics",
    dialogLabel: "Compañero IA de AlgoRhythmics",
    greeting:
      "¡Hola! Soy Lumen, el compañero de AlgoRhythmics. Pregunta sobre nuestro laboratorio, productos o cómo colaborar para proyectos en España y Latinoamérica.",
    languageSwitch: "Continuamos en español. ¿En qué puedo ayudarte ahora?",
    placeholder:
      "Pregunta por el laboratorio, un producto o la colaboración...",
    actions: {
      open: "Abrir asistente IA",
      hide: "Ocultar asistente IA",
      closePanel: "Cerrar asistente",
      send: "Enviar",
      suggestionLabel: "Sugerencias",
      formLabel: "Enviar mensaje",
      reset: "Reiniciar la conversación",
    },
    latency: 520,
    suggestions: [
      {
        title: "Conocer nuestro laboratorio",
        prompt:
          "¿Qué hace diferente a AlgoRhythmics frente a otras agencias de IA?",
      },
      {
        title: "Plataforma NodeVoyage",
        prompt: "Háblame de la plataforma de viajes NodeVoyage.",
      },
      {
        title: "Suite Ideonautix",
        prompt: "¿Cómo ayuda Ideonautix a los equipos distribuidos?",
      },
      {
        title: "Mejorar mi estrategia IA",
        prompt:
          "¿Cómo podemos mejorar nuestra iniciativa de IA con AlgoRhythmics?",
      },
    ],
    knowledgeBase: [
      {
        keywords: [
          "diferente",
          "únic",
          "laboratorio",
          "agencia",
          "algorhythmics",
        ],
        answer:
          "AlgoRhythmics combina ingeniería rigurosa con una estética inspirada en el movimiento. Compartimos metodologías de laboratorio para que tus equipos aprendan a iterar con confianza.",
      },
      {
        keywords: ["nodevoyage", "viaje", "itinerario", "turismo"],
        answer:
          "NodeVoyage es nuestra plataforma inteligente de viajes. Construye itinerarios narrativos y recomendaciones culturales adaptadas a cada viajero.",
      },
      {
        keywords: ["ideonautix", "productividad", "equipo", "colaboración"],
        answer:
          "Ideonautix ofrece copilotos de IA para startups y estudios creativos. Facilita la planificación, los informes y el lanzamiento de servicios en mercados hispanohablantes.",
      },
      {
        keywords: ["contacto", "colaborar", "consultoría", "alianza"],
        answer:
          "Escríbenos a hello@algorhythmics.com o completa el formulario. Podemos organizar talleres remotos o sesiones presenciales según tu huso horario.",
      },
      {
        keywords: ["mejorar", "optimizar", "estrategia", "crecer"],
        answer:
          "Para mejorar, comenzamos con un sprint diagnóstico: revisamos objetivos, fuentes de datos y cultura de innovación, y construimos un plan de experimentos medibles.",
      },
    ],
    fallback:
      "Aún estoy aprendiendo, pero puedo ponerte en contacto con nuestro equipo o compartir más recursos sobre nuestros servicios.",
  },
} satisfies Record<string, CompanionProfile>;

export type SupportedLocale = keyof typeof companionProfiles;

export const DEFAULT_LOCALE: SupportedLocale = "en";

export const getProfile = (lang: SupportedLocale): CompanionProfile =>
  companionProfiles[lang];

export const isSupportedLocale = (
  lang: string | null | undefined,
): lang is SupportedLocale =>
  typeof lang === "string" && lang in companionProfiles;

export const matchKnowledgeBase = (
  locale: SupportedLocale,
  question: string,
) => {
  const normalized = question.toLowerCase();
  const { knowledgeBase, fallback } = companionProfiles[locale];
  const entry = knowledgeBase.find((item) =>
    item.keywords.some((keyword) => normalized.includes(keyword)),
  );
  return entry ? entry.answer : fallback;
};
