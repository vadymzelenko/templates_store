// База шаблонов витрины (лёгкая CMS).
// industry — ключ отрасли из lib/industries.js, fits — ниши, под которые проект легко переделать,
// badges — короткие метки на карточке. coverImage для своих проектов: /previews/<slug>.jpg (npm run previews).
export const templates = [
    {
        "id": "barbershop",
        "slug": "barbershop",
        "title": "Ремесло — барбершоп",
        "tagline": "Тёмный «мужской» лендинг: прайс как на стене и запись к конкретному мастеру",
        "category": "Барбершоп",
        "price": "$150",
        "usedCount": 0,
        "rating": 5,
        "coverImage": "/previews/barbershop.jpg",
        "description": "Лендинг барбершопа в тёмной гамме с латунными акцентами и узким плакатным шрифтом.\n\nПрайс-лист с точечными линиями, как в зале на стене: каждая услуга записывается в один клик. Блок «Сегодня в зале» показывает, когда освободится каждый мастер.\n\nОнлайн-запись: услуга, мастер, день и свободное время. Занятые слоты не выбрать, после записи клиент получает подтверждение и кабинет для переноса.",
        "features": [
            "Запись к мастеру на свободное время",
            "Прайс с кнопкой «записаться» у каждой услуги",
            "Карточки мастеров",
            "Блок «Сегодня в зале»"
        ],
        "techStack": [
            "Next.js",
            "React",
            "Booking engine"
        ],
        "liveDemoUrl": "/demo/barbershop",
        "telegramUrl": "",
        "clientExamples": [],
        "industry": "beauty",
        "badges": [
            "Онлайн-запись",
            "Мастера"
        ],
        "fits": [
            "Парикмахерская",
            "Салон красоты",
            "Тату-салон",
            "Ногтевая студия"
        ],
        "isNew": true
    },
    {
        "id": "dental",
        "slug": "dental",
        "title": "Ровно — стоматология",
        "tagline": "Спокойная клиника с прозрачным прайсом и записью к врачу",
        "category": "Стоматология",
        "price": "$160",
        "usedCount": 0,
        "rating": 5,
        "coverImage": "/previews/dental.jpg",
        "description": "Светлый, «медицинский», но не стерильный лендинг клиники.\n\nПрайс с вкладками по разделам (лечение, гигиена, имплантация, ортодонтия) и ценами «от и до». Карточки врачей со специализацией, понятный сценарий первого визита.\n\nЗапись к конкретному врачу или к ближайшему свободному, выходные дни учитываются.",
        "features": [
            "Прайс с вкладками по разделам",
            "Запись к врачу",
            "Сценарий первого визита",
            "Факты о клинике на первом экране"
        ],
        "techStack": [
            "Next.js",
            "React",
            "Booking engine"
        ],
        "liveDemoUrl": "/demo/dental",
        "telegramUrl": "",
        "clientExamples": [],
        "industry": "medicine",
        "badges": [
            "Онлайн-запись",
            "Прайс с фильтром"
        ],
        "fits": [
            "Клиника",
            "Медицинский центр",
            "Косметология",
            "Офтальмология"
        ],
        "isNew": true
    },
    {
        "id": "autoservice",
        "slug": "autoservice",
        "title": "Гараж 14 — автосервис",
        "tagline": "Калькулятор работ под класс машины и запись на пост",
        "category": "Автосервис",
        "price": "$170",
        "usedCount": 0,
        "rating": 5,
        "coverImage": "/previews/autoservice.jpg",
        "description": "Лендинг СТО в стиле гаража: асфальт, жёлтый, номерной знак.\n\nКалькулятор: клиент выбирает класс машины и работы, справа собирается предварительный заказ-наряд с суммой и временем в боксе. Блок загрузки постов показывает, где есть окно.\n\nЗапись на работу с маркой и моделью авто.",
        "features": [
            "Калькулятор заказ-наряда",
            "Загрузка постов в реальном времени",
            "Запись с маркой авто",
            "Список работ"
        ],
        "techStack": [
            "Next.js",
            "React",
            "Booking engine"
        ],
        "liveDemoUrl": "/demo/autoservice",
        "telegramUrl": "",
        "clientExamples": [],
        "industry": "auto",
        "badges": [
            "Калькулятор",
            "Онлайн-запись"
        ],
        "fits": [
            "СТО",
            "Шиномонтаж",
            "Детейлинг",
            "Автомойка",
            "Кузовной ремонт"
        ],
        "isNew": true
    },
    {
        "id": "coffee",
        "slug": "coffee",
        "title": "Угол — кофейня",
        "tagline": "Меню-доска, «открыто сейчас» и предзаказ к нужному времени",
        "category": "Кофейня",
        "price": "$120",
        "usedCount": 0,
        "rating": 5,
        "coverImage": "/previews/coffee.jpg",
        "description": "Тёплый лендинг кофейни с ретро-шрифтом.\n\nМеню-доска с размерами S/M/L. Статус «Открыто до 20:00» считается по часам работы.\n\nПредзаказ: гость собирает заказ, выбирает время в ближайшие 2 часа (шаг 10 минут) и получает номер заказа. В рабочей версии заказ уходит бариста в Telegram.",
        "features": [
            "Предзаказ к времени",
            "«Открыто сейчас» по графику",
            "Меню с размерами",
            "Схема проезда"
        ],
        "techStack": [
            "Next.js",
            "React",
            "Booking engine"
        ],
        "liveDemoUrl": "/demo/coffee",
        "telegramUrl": "",
        "clientExamples": [],
        "industry": "food",
        "badges": [
            "Предзаказ"
        ],
        "fits": [
            "Кафе",
            "Пекарня",
            "Кондитерская",
            "Кофе с собой"
        ],
        "isNew": true
    },
    {
        "id": "renovation",
        "slug": "renovation",
        "title": "Метр — ремонт квартир",
        "tagline": "Калькулятор ремонта по м², этапы по неделям и запись на замер",
        "category": "Ремонт квартир",
        "price": "$170",
        "usedCount": 0,
        "rating": 5,
        "coverImage": "/previews/renovation.jpg",
        "description": "Лендинг ремонтной компании в чертёжной стилистике.\n\nКалькулятор: площадь, тип ремонта, доп. работы → вилка цены и срок в неделях. Этапы работ на таймлайне, сданные объекты с планировками.\n\nЗапись на бесплатный замер с адресом.",
        "features": [
            "Калькулятор стоимости по площади",
            "Этапы по неделям",
            "Объекты с планировками",
            "Запись на замер"
        ],
        "techStack": [
            "Next.js",
            "React",
            "Booking engine"
        ],
        "liveDemoUrl": "/demo/renovation",
        "telegramUrl": "",
        "clientExamples": [],
        "industry": "build",
        "badges": [
            "Калькулятор",
            "Онлайн-запись"
        ],
        "fits": [
            "Отделка",
            "Дизайн интерьера",
            "Строительство домов",
            "Кухни на заказ"
        ],
        "isNew": true
    },
    {
        "id": "vet",
        "slug": "vet",
        "title": "Друг — ветклиника",
        "tagline": "Экстренная линия 24/7, услуги по виду животного и запись с кличкой питомца",
        "category": "Ветклиника",
        "price": "$150",
        "usedCount": 0,
        "rating": 5,
        "coverImage": "/previews/vet.jpg",
        "description": "Дружелюбный лендинг ветклиники с рукописными акцентами.\n\nПолоса экстренного приёма 24/7 с телефоном. Услуги и цены переключаются по виду животного: кошки, собаки, грызуны, птицы.\n\nЗапись к врачу с кличкой и видом питомца.",
        "features": [
            "Экстренная линия 24/7",
            "Услуги по виду животного",
            "Запись с кличкой питомца",
            "Карточки врачей"
        ],
        "techStack": [
            "Next.js",
            "React",
            "Booking engine"
        ],
        "liveDemoUrl": "/demo/vet",
        "telegramUrl": "",
        "clientExamples": [],
        "industry": "pets",
        "badges": [
            "Онлайн-запись",
            "Прайс с фильтром"
        ],
        "fits": [
            "Груминг",
            "Зоогостиница",
            "Дрессировка"
        ],
        "isNew": true
    },
    {
        "id": "photo-studio",
        "slug": "photo-studio",
        "title": "Studio Light — фотостудия",
        "tagline": "Контактный лист в шапке, форматы съёмки и запись на свободный час",
        "category": "Фотостудия",
        "price": "$120",
        "usedCount": 0,
        "rating": 5,
        "coverImage": "/previews/photo-studio.jpg",
        "description": "Первый лендинг на нашем booking engine.\n\nНа первом экране — контактный лист с отмеченным кадром. Прайс форматов съёмки, кнопка «Обрати» подставляет формат в форму.\n\nЗапись на свободный час, подтверждение по почте, кабинет клиента и CRM владельца.",
        "features": [
            "Запись на свободный час",
            "Кабинет клиента без пароля",
            "CRM владельца",
            "Контактный лист в hero"
        ],
        "techStack": [
            "Next.js",
            "React",
            "Booking engine"
        ],
        "liveDemoUrl": "/demo/photo-studio",
        "telegramUrl": "",
        "clientExamples": [],
        "industry": "events",
        "badges": [
            "Онлайн-запись",
            "CRM"
        ],
        "fits": [
            "Фотограф",
            "Видеограф",
            "Детский фотограф"
        ],
        "isNew": true
    },
    {
        "id": "lending-premium-barbershopa",
        "slug": "lending-premium-barbershopa",
        "title": "Лендинг премиум барбершопа",
        "tagline": "Classic style meets modern execution. Crafted by experts, tailored specifically for you in the heart of Kraków.",
        "category": "Салон красоты",
        "price": "$80",
        "usedCount": 0,
        "rating": 5,
        "coverImage": "https://i.imgur.com/8jiC3Nu_d.webp?maxwidth=1520&fidelity=grand",
        "description": "LUMIERE — минималистичный лендинг для премиального салона красоты и парикмахерской с утонченным дизайном.\n\nПрозрачное ценообразование: Удобная сетка услуг, помогающая клиенту сразу сориентироваться по стоимости процедур.\n\nГалерея работ: Портфолио модных стрижек и окрашиваний в эстетике премиальных студий.\n\nОтзывы клиентов: Карточки с мнениями посетителей и высокими оценками сервиса.\n",
        "features": [
            "Галерея работ",
            "Интеграция Booksy"
        ],
        "techStack": [
            "HTML",
            "Tailwild",
            "JS"
        ],
        "liveDemoUrl": "/projects/hair_salon/LUMIERE.html",
        "telegramUrl": "",
        "clientExamples": [],
        "industry": "beauty",
        "badges": [
            "Галерея работ",
            "Booksy"
        ],
        "fits": [
            "Барбершоп",
            "Парикмахерская"
        ]
    },
    {
        "id": "lending-salona-krasoty",
        "slug": "lending-salona-krasoty",
        "title": "Лендинг салона красоты",
        "tagline": "Przestrzeń, w której sztuka fryzjerska spotyka się z relaksem",
        "category": "Салон красоты",
        "price": "$100",
        "usedCount": 0,
        "rating": 5,
        "coverImage": "https://i.imgur.com/FdNPThW_d.webp?maxwidth=1520&fidelity=grand",
        "description": "AURA Hair Salon — современный премиальный лендинг для салона красоты и парикмахерской с утонченным бьюти-дизайном.\n\nКлючевая структура:\nHero-секция: Элегантный первый экран с атмосферным фоном, выразительным бьюти-оффером и быстрой кнопкой онлайн-записи.\n\nУслуги и прайс-лист: Разделение по категориям и детальным описанием процедур.\n\nКоманда мастеров: Карточки стилистов и колористов с примерами работ.\n\nГалерея преображений (Portfolio): Витрина лучших работ салона в стиле.\n\nИнтерактивная запись / CTA: Блок бронирования визита с выбором удобного времени и контактами.\n\nКонтакты и подвал: Адрес салона, часы работы, ссылки на социальные сети и быстрые элементы навигации.",
        "features": [
            "Премиальный визуальный стиль",
            "Фокус на портфолио",
            "Удобная конверсия"
        ],
        "techStack": [
            "HTML",
            "Tailwild",
            "JS"
        ],
        "liveDemoUrl": "/projects/hair_salon/AURA_hairsalon.html",
        "telegramUrl": "",
        "clientExamples": [],
        "industry": "beauty",
        "badges": [
            "Портфолио",
            "Запись"
        ],
        "fits": [
            "Салон красоты",
            "Парикмахерская",
            "Ногтевая студия"
        ]
    },
    {
        "id": "lending-kofeyni",
        "slug": "lending-kofeyni",
        "title": "Лендинг кофейни",
        "tagline": "Miejsce, gdzie kawa smakuje inaczej",
        "category": "Кофейня",
        "price": "$100",
        "usedCount": 0,
        "rating": 5,
        "coverImage": "https://i.imgur.com/5RrRfqY.jpeg",
        "description": "Kawa & Klimat — уютный эстетичный лендинг крафтовой городской кофейни в центре Кракова.\n\nАтмосферный эстетичный дизайн: Использование элегантных шрифтов с засечками (Cormorant Garamond) в сочетании с мягкой палитрой и крупными полноэкранными фотографиями интерьера.\n\nИнтерактивное структурированное меню: Удобное разделение позиций на категории (кофе, чай, десерты, завтраки) с ценами в злотых и кратким описанием ингредиентов.\n\nПрямая интеграция с Booksy: Акцент на быструю онлайн-резервацию столиков через популярный европейский сервис бронирования.\n",
        "features": [
            "Интегрированное онлайн-бронированию через Booksy",
            "Акцент на визуальную эстетику (Mood Gallery)"
        ],
        "techStack": [
            "HTML",
            "Tailwild",
            "JS"
        ],
        "liveDemoUrl": "/projects/cafe/kawa_and_klimat.html",
        "telegramUrl": "",
        "clientExamples": [],
        "industry": "food",
        "badges": [
            "Меню",
            "Booksy"
        ],
        "fits": [
            "Кафе",
            "Ресторан",
            "Пекарня"
        ]
    },
    {
        "id": "lending-kompanii-gruzoperevozok-",
        "slug": "lending-kompanii-gruzoperevozok-",
        "title": "Лендинг компании грузоперевозок",
        "tagline": "Профессиональные транспортно-экспедиционные услуги",
        "category": "Логистика",
        "price": "$150",
        "usedCount": 0,
        "rating": 5,
        "coverImage": "https://i.imgur.com/9Run4Yb.png",
        "description": "EuroLogistics — комплексный корпоративный B2B-лендинг для международной логистической компании с фокусом на перевозки между странами Европы, Азии, Турции и СНГ.\n\nПервый экран: Главный оффер с УТП и встроенный калькулятор экспресс-расчета стоимости.\n\nГеография и экспертиза: Карта направлений плюс готовые отраслевые решения.\n\nHR и социальные доказательства: Отзывы клиентов B2B-сектора и блок открытых вакансий для водителей и логистов.\n\nФорма захвата и контакты: Детальный бриф на расчет груза и офисы в Польше и Германии.",
        "features": [
            "Табы решений с большими превью",
            "Быстрый расчет на первом экране",
            "Интерактивные элементы интерфейса"
        ],
        "techStack": [
            "HTML",
            "Tailwild",
            "JS",
            "Vercel"
        ],
        "liveDemoUrl": "/projects/auto_logistics/EuroLogistics.html",
        "telegramUrl": "",
        "clientExamples": [],
        "industry": "auto",
        "badges": [
            "Калькулятор",
            "B2B"
        ],
        "fits": [
            "Логистика",
            "Грузоперевозки",
            "ВЭД",
            "Склад"
        ]
    },
    {
        "id": "lending-kompanii-gruzoperevozok",
        "slug": "lending-kompanii-gruzoperevozok",
        "title": "Лендинг компании грузоперевозок",
        "tagline": "Профессиональные транспортно-экспедиционные услуги",
        "category": "Логистика",
        "price": "$80",
        "usedCount": 0,
        "rating": 5,
        "coverImage": "https://i.imgur.com/19k5x9d.png",
        "description": "Prime Logistics современный B2B лендинг европейской транспортной компании.\n\nПроект ориентирован на бизнес клиентов которым нужны грузоперевозки по странам Европы.\n\nМинималистичный строгий дизайн аккуратные отступы и понятная визуальная иерархия под сферу грузоперевозок.",
        "features": [
            "Бегущая строка с направлениями работы",
            "Чистый современный интерфейс",
            "Форма связи"
        ],
        "techStack": [
            "HTML",
            "Tailwild",
            "JS",
            "Vercel"
        ],
        "liveDemoUrl": "/projects/auto_logistics/logistic_Prime_Logistics.html",
        "telegramUrl": "",
        "clientExamples": [],
        "industry": "auto",
        "badges": [
            "B2B",
            "Форма заявки"
        ],
        "fits": [
            "Логистика",
            "Грузоперевозки"
        ]
    },
    {
        "id": "stranitsa-fotografa",
        "slug": "stranitsa-fotografa",
        "title": "Страница фотографа",
        "tagline": "Минималистичная дизайнерская визитка в стиле Apple",
        "category": "Фотограф",
        "price": "$90",
        "usedCount": 0,
        "rating": 5,
        "coverImage": "https://i.imgur.com/hXifh5u.png",
        "description": "Идеальная цифровая галерея для ваших лучших кадров. Этот минималистичный шаблон создан для фотографов, которые хотят презентовать свое портфолио дорого, стильно и без визуального шума.\n\nЧистая сетка, полноэкранные слайдеры и плавные анимации. Дизайн работает как хорошее паспарту — он не перетягивает внимание на себя, а заставляет зрителя вглядываться в ваши снимки.",
        "features": [
            "Безупречная мобильная адаптивность",
            "Кинематографичные микроинтеракции",
            "Умная сетка"
        ],
        "techStack": [
            "HTML",
            "Tailwild",
            "JS",
            "Free Server"
        ],
        "liveDemoUrl": "https://nikita-kustov.vercel.app",
        "telegramUrl": "",
        "clientExamples": [],
        "industry": "events",
        "badges": [
            "Портфолио"
        ],
        "fits": [
            "Фотограф",
            "Видеограф"
        ]
    },
    {
        "id": "language-school",
        "slug": "language-school",
        "title": "Вылет — языковая школа",
        "tagline": "Школа как аэропорт: курсы на табло вылетов, заявка — посадочный талон",
        "category": "Языковая школа",
        "price": "$200",
        "usedCount": 0,
        "rating": 5,
        "coverImage": "/previews/language-school.jpg",
        "description": "Языковая школа, оформленная как аэропорт. Курсы — рейсы на табло с перекидными буквами, заявка собирается в посадочный талон и уходит в Telegram-бот.\n\nАдминка для правки контента и заявок без программиста. Анимации на GSAP.",
        "features": [
            "Табло курсов с перекидными буквами",
            "Конструктор заявки-билета",
            "Заявки в Telegram",
            "Админка для контента и заявок"
        ],
        "techStack": [
            "Next.js",
            "GSAP"
        ],
        "liveDemoUrl": "https://github.com/vadymzelenko/language-school",
        "telegramUrl": "",
        "clientExamples": [],
        "industry": "edu",
        "badges": [
            "Telegram",
            "Админка",
            "Анимации"
        ],
        "fits": [
            "Онлайн-школа",
            "Курсы",
            "Репетитор"
        ],
        "isNew": true
    },
    {
        "id": "psycholog",
        "slug": "psycholog",
        "title": "Анна Коваль — психолог",
        "tagline": "Личный сайт психолога: запросы, подходы, образование и запись",
        "category": "Психолог",
        "price": "$100",
        "usedCount": 0,
        "rating": 5,
        "coverImage": "/previews/psycholog.jpg",
        "description": "Мягкий, доверительный сайт практикующего психолога.\n\nБлоки: знакомство, образование и квалификация, запросы, с которыми работает специалист (тревога, выгорание, отношения, самооценка), подходы и запись на консультацию.",
        "features": [
            "Карточки запросов клиентов",
            "Образование и сертификаты",
            "Подходы в работе",
            "Запись на консультацию"
        ],
        "techStack": [
            "HTML",
            "Tailwind",
            "JS"
        ],
        "liveDemoUrl": "/projects/personal_brand/psycholog.html",
        "telegramUrl": "",
        "clientExamples": [],
        "industry": "medicine",
        "badges": [
            "Личный бренд",
            "Запись"
        ],
        "fits": [
            "Психотерапия",
            "Коучинг",
            "Эксперт",
            "Нутрициология"
        ],
        "isNew": true
    },
    {
        "id": "revelox",
        "slug": "revelox",
        "title": "Revelox — digital-агентство",
        "tagline": "Тёмный технологичный сайт агентства с кейсами и командой",
        "category": "Digital-агентство",
        "price": "$120",
        "usedCount": 0,
        "rating": 5,
        "coverImage": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
        "description": "Сайт IT/digital-агентства в тёмной технологичной эстетике.\n\nУслуги, цифры, экосистема интеграций, избранные кейсы, команда и отзывы клиентов.",
        "features": [
            "Кейсы с метриками",
            "Блок команды",
            "Отзывы клиентов",
            "Анимации при прокрутке"
        ],
        "techStack": [
            "HTML",
            "Tailwind",
            "JS"
        ],
        "liveDemoUrl": "/projects/personal_brand/Revelox.html",
        "telegramUrl": "",
        "clientExamples": [],
        "industry": "it",
        "badges": [
            "Кейсы",
            "Анимации"
        ],
        "fits": [
            "Веб-студия",
            "Дизайн",
            "Брендинг",
            "SMM",
            "IT-аутсорс"
        ],
        "isNew": true
    },
    {
        "id": "aurelia",
        "slug": "aurelia",
        "title": "AURELIA — элитная недвижимость",
        "tagline": "Дорогой каталог вилл и пентхаусов с ключевыми рынками",
        "category": "Недвижимость",
        "price": "$130",
        "usedCount": 0,
        "rating": 5,
        "coverImage": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80",
        "description": "Премиальный сайт агентства элитной недвижимости.\n\nИзбранная коллекция объектов, крупные фото, ключевые рынки (Монако, Дубай, Лондон, Женева) и форма запроса просмотра.",
        "features": [
            "Коллекция объектов",
            "Ключевые рынки",
            "Форма запроса просмотра",
            "Премиальная типографика"
        ],
        "techStack": [
            "HTML",
            "Tailwind",
            "JS"
        ],
        "liveDemoUrl": "/projects/personal_brand/elit_AURELIA.html",
        "telegramUrl": "",
        "clientExamples": [],
        "industry": "realty",
        "badges": [
            "Каталог объектов"
        ],
        "fits": [
            "Агентство недвижимости",
            "Застройщик",
            "Аренда квартир",
            "Апартаменты"
        ],
        "isNew": true
    },
    {
        "id": "flowapp",
        "slug": "flowapp",
        "title": "FlowApp — SaaS-продукт",
        "tagline": "Короткий лендинг продукта: возможности и призыв попробовать",
        "category": "SaaS",
        "price": "$60",
        "usedCount": 0,
        "rating": 5,
        "coverImage": "/previews/flowapp.jpg",
        "description": "Компактный лендинг SaaS-сервиса для команд: оффер, три ключевые возможности и финальный призыв к действию. Подходит для быстрого теста гипотезы.",
        "features": [
            "Оффер и CTA",
            "Блок возможностей",
            "Лёгкий и быстрый"
        ],
        "techStack": [
            "HTML",
            "Tailwind"
        ],
        "liveDemoUrl": "/projects/personal_brand/saas.html",
        "telegramUrl": "",
        "clientExamples": [],
        "industry": "it",
        "badges": [
            "Быстрый запуск"
        ],
        "fits": [
            "Мобильные приложения",
            "CRM",
            "Автоматизация"
        ],
        "isNew": true
    },
    {
        "id": "elena-kutina",
        "slug": "elena-kutina",
        "title": "Elena Kutina — фотограф",
        "tagline": "Минималистичное портфолио фотографа на украинском",
        "category": "Фотограф",
        "price": "$80",
        "usedCount": 0,
        "rating": 5,
        "coverImage": "/previews/elena-kutina.jpg",
        "description": "Чистое портфолио фотографа: обо мне, избранные работы и связь. Ничего лишнего, всё внимание на снимках.",
        "features": [
            "Портфолио",
            "Блок «Про мене»",
            "Контакты"
        ],
        "techStack": [
            "HTML",
            "Tailwind",
            "JS"
        ],
        "liveDemoUrl": "/projects/photograph/Elena_Kutina/Elena_Kutina.html",
        "telegramUrl": "",
        "clientExamples": [],
        "industry": "events",
        "badges": [
            "Портфолио"
        ],
        "fits": [
            "Фотограф",
            "Портфолио",
            "Личный бренд"
        ],
        "isNew": true
    },
    {
        "id": "alex-raw",
        "slug": "alex-raw",
        "title": "ALEX.RAW — фотограф и креатор",
        "tagline": "Портфолио с форматами съёмки, FAQ и заявкой",
        "category": "Фотограф",
        "price": "$90",
        "usedCount": 0,
        "rating": 5,
        "coverImage": "/previews/alex-raw.jpg",
        "description": "Портфолио фотографа и контент-креатора: избранные работы, форматы (персональная съёмка, свадьба, контент и Reels), частые вопросы и форма заявки.",
        "features": [
            "Форматы съёмки",
            "FAQ",
            "Форма заявки",
            "Портфолио"
        ],
        "techStack": [
            "HTML",
            "Tailwind",
            "JS"
        ],
        "liveDemoUrl": "/projects/photograph/templates/photograpf_ALEX_RAW.html",
        "telegramUrl": "",
        "clientExamples": [],
        "industry": "events",
        "badges": [
            "Портфолио",
            "Форматы"
        ],
        "fits": [
            "Видеограф",
            "Свадебный фотограф",
            "Контент"
        ],
        "isNew": true
    }
];
