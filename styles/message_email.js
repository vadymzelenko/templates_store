// Стиль листа з magic link. У листах CSS-файли не працюють, тому стилі inline, а верстка таблична.
import config from '@/engine.config';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const FONT = 'Arial, Helvetica, sans-serif';

export function renderEmail({ purpose, link }) {
  const m = config.emails[purpose];
  const c = config.theme.colors;
  return `<!doctype html>
<html lang="${config.brand.locale}"><body style="margin:0;padding:0;background:${c.bg}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${c.bg};padding:32px 16px">
 <tr><td align="center">
  <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;max-width:480px">
   <tr><td style="font-family:${FONT};font-size:18px;font-weight:bold;color:${c.text};padding:0 0 16px">${esc(config.brand.name)}</td></tr>
   <tr><td style="background:${c.card};border:1px solid ${c.line};border-radius:14px;padding:30px;font-family:${FONT};color:${c.text}">
     <h1 style="margin:0 0 10px;font-size:22px;line-height:1.25;font-weight:bold">${esc(m.title)}</h1>
     <p style="margin:0 0 26px;font-size:16px;line-height:1.55;color:${c.muted}">${esc(m.text)}</p>
     <table role="presentation" cellpadding="0" cellspacing="0"><tr>
       <td style="background:${c.accent};border-radius:999px">
         <a href="${link}" style="display:inline-block;padding:14px 28px;font-family:${FONT};font-size:16px;font-weight:bold;color:${c.accentInk};text-decoration:none">${esc(m.button)}</a>
       </td></tr></table>
     <p style="margin:26px 0 0;font-size:13px;line-height:1.5;color:${c.muted}">${esc(config.emails.linkFallback)}<br><span style="word-break:break-all;color:${c.accent}">${link}</span></p>
   </td></tr>
   <tr><td style="font-family:${FONT};font-size:13px;line-height:1.5;color:${c.muted};padding:16px 4px 0">${esc(config.emails.footer)}</td></tr>
  </table>
 </td></tr>
</table></body></html>`;
}
