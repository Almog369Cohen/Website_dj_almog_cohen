/**
 * Saves every lead from the REVER site into a Google Sheet, before WhatsApp opens.
 *
 * Setup (5 minutes):
 *   1. Create a Google Sheet. Extensions → Apps Script. Paste this file and save.
 *   2. Deploy → New deployment → type "Web app" → Execute as: Me → Who has access: Anyone → Deploy.
 *   3. Copy the web app URL and set it as NEXT_PUBLIC_LEAD_ENDPOINT on the host (Netlify → Site settings → Environment variables).
 *   4. Rebuild the site. Every form send adds a row: time, name, phone, event type, when, message, source, what they looked at, page.
 */
const COLUMNS = ["at", "name", "phone", "type", "when", "message", "source", "context", "page"];

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sheet.getLastRow() === 0) sheet.appendRow(COLUMNS);
  const data = JSON.parse(e.postData.contents || "{}");
  if (data.website) return ContentService.createTextOutput("ok"); // honeypot: bots only
  sheet.appendRow(COLUMNS.map((c) => String(data[c] || "").slice(0, 1000)));
  return ContentService.createTextOutput("ok");
}
