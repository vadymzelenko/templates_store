// sites/registry.js
// Единый реестр всех сайтов (тенантов). Каждый новый сайт добавляется сюда
// одной строкой — см. README.md, раздел "Как подключить новый сайт".

import danceStudioConfig from "./dance-studio/config.js";
import DanceStudioLanding from "./dance-studio/landing.jsx";
import DanceStudioCrm from "./dance-studio/crm.jsx";

/**
 * @typedef {Object} SiteEntry
 * @property {object} config       - конфиг сайта (sites/<id>/config.js)
 * @property {React.ComponentType} Landing - компонент лендинга
 * @property {React.ComponentType} Crm     - компонент админ-панели
 */

/** @type {Record<string, SiteEntry>} */
const registry = {
  "dance-studio": {
    config: danceStudioConfig,
    Landing: DanceStudioLanding,
    Crm: DanceStudioCrm,
  },

  // Чтобы добавить следующий сайт:
  // 1. Создайте sites/<id>/{config.js,landing.jsx,crm.jsx,apps-script/Code.gs}
  // 2. import newConfig from "./<id>/config.js"; и т.д.
  // 3. Допишите ключ ниже: "<id>": { config: newConfig, Landing: NewLanding, Crm: NewCrm },
};

/** Список всех зарегистрированных id сайтов. */
export function listSiteIds() {
  return Object.keys(registry);
}

/** Полная запись сайта (config + компоненты) или null, если такого сайта нет. */
export function getSite(siteId) {
  return registry[siteId] ?? null;
}

/** Только конфиг сайта (используется в API-роутах, где компоненты не нужны). */
export function getSiteConfig(siteId) {
  return registry[siteId]?.config ?? null;
}

export default registry;
