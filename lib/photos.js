// Фото Unsplash, которые используют демо. Ключ — смысл, значение — id фото.
// Первая группа взята из лендингов public/projects (проверены в работе), остальные — популярные фото Unsplash.
export const unsplash = (id, w = 1200) => `https://images.unsplash.com/${id}?auto=format&fit=crop&q=75&w=${w}`;

export const P = {
  // люди для отзывов
  face1: 'photo-1506794778202-cad84cf45f1d', face2: 'photo-1494790108377-be9c29b29330', face3: 'photo-1599566150163-29194dcaad36',
  face4: 'photo-1438761681033-6461ffad8d80', face5: 'photo-1560250097-0b93528c311a', face6: 'photo-1580489944761-15a19d654956',
  face7: 'photo-1519085360753-af0119f7cbe7', face8: 'photo-1534528741775-53994a69daeb', face9: 'photo-1507003211169-0a1dd7228f2d',
  face10: 'photo-1517841905240-472988babdf9', face11: 'photo-1573496359142-b8d87734a5a2', face12: 'photo-1544717305-2782549b5136',
  // барбершоп и салон
  barberCut: 'photo-1621605815971-fbc98d665033', barberRoom: 'photo-1599351431202-1e0f0137899a', barberBg: 'photo-1585747860715-2ba37e788b70',
  salon: 'photo-1560066984-138dadb4c035', salonCut: 'photo-1595152772835-219674b2a8a6',
  // кофейня
  cafe: 'photo-1600093463592-8e36ae95ef56', brew: 'photo-1610889556528-9a770e32642f', espresso: 'photo-1510591509098-f4fdc6d0ff04',
  cappuccino: 'photo-1572442388796-11668a67e53d', latte: 'photo-1561882468-9110e03e0f78', croissant: 'photo-1555507036-ab1f4038808a',
  coffeeArt: 'photo-1495474472287-4d71bcdd2085', barista: 'photo-1514432324607-a09d9b4aefdd', cups: 'photo-1554118811-1e0d58224f24', cafeDetail: 'photo-1501339847302-ac426a4a7cbb',
  // интерьеры, недвижимость
  interior: 'photo-1613490908575-103399ab71bc', penthouse: 'photo-1600566753190-17f0baa2a6c3', villa: 'photo-1600607687920-4e2a09cf159d', estate: 'photo-1600585154340-be6161a56a0c', mansion: 'photo-1600596542815-ffad4c1539a9',
  // офис, работа
  office: 'photo-1552664730-d307ca884978', meeting: 'photo-1556740738-b6a63e27c4df', docs: 'photo-1454165804606-c3d57bc86b40', truck: 'photo-1601584115197-04ecc0da31d7',
  // ниже — популярные фото Unsplash для ниш, которых нет в лендингах
  dentist: 'photo-1606811971618-4486d14f3f99', dentalRoom: 'photo-1629909613654-28e377c37b09', smile: 'photo-1588776814546-1ffcf47267a5',
  mechanic: 'photo-1486262715619-67b85e0b08d3', carService: 'photo-1625047509248-ec889cbff17f', car: 'photo-1492144534655-ae79c964c9d7',
  dog: 'photo-1543466835-00a7907e9de1', cat: 'photo-1514888286974-6c03e2ca1dba', dogs: 'photo-1548199973-03cce0bbc87b', vetDog: 'photo-1587300003388-59208cc962cb',
  gym: 'photo-1534438327276-14e5300c3a48', workout: 'photo-1571019613454-1cb2f99b2d8b', pilates: 'photo-1518611012118-696072aa579a', yoga: 'photo-1544367567-0f2fcb009e0b',
  tentNight: 'photo-1504280390367-361c6d9f38f4', tent: 'photo-1487730116645-74489c95b41b', campfire: 'photo-1478131143081-80f7f84ca84d', lake: 'photo-1501785888041-af3ef285b470',
  cleaning: 'photo-1581578731548-c64695cc6952', cleanRoom: 'photo-1484154218962-a197022b5858',
  law: 'photo-1589829545856-d10d557cf95f', signing: 'photo-1450101499163-c8848c66ca85',
  plumbing: 'photo-1585704032915-c3400ca199e7', build: 'photo-1503387762-592deb58ef4e', renovate: 'photo-1581858726788-75bc0f6a952d',
};
