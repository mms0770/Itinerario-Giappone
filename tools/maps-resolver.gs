// Risolve i link corti di Google Maps (maps.app.goo.gl) e restituisce coordinate e nome del luogo.
// Installazione: script.google.com → Nuovo progetto → incolla questo codice →
// Deploy → New deployment → tipo "Web app" → Execute as: Me → Who has access: Anyone → Deploy.
// Copia l'URL che termina con /exec e mettilo in config.js come "resolver".
function doGet(e) {
  var cb = (e.parameter.cb || 'cb').replace(/[^\w$.]/g, '');
  var out = { ok: false };
  try {
    var u = e.parameter.u || '';
    if (/^https:\/\/(maps\.app\.goo\.gl|goo\.gl)\//.test(u)) {
      var url = u;
      for (var i = 0; i < 6; i++) {
        var r = UrlFetchApp.fetch(url, { followRedirects: false, muteHttpExceptions: true });
        var h = r.getHeaders();
        var loc = h['Location'] || h['location'];
        if (r.getResponseCode() >= 300 && r.getResponseCode() < 400 && loc) { url = loc; } else { break; }
      }
      if (/^https:\/\/(www\.)?google\.[a-z.]+\/maps/.test(url)) {
        var m = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/) || url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
        var n = url.match(/\/maps\/place\/([^\/@?]+)/);
        if (m) {
          out = { ok: true, lat: parseFloat(m[1]), lng: parseFloat(m[2]),
                  name: n ? decodeURIComponent(n[1].replace(/\+/g, ' ')) : '' };
        }
      }
    }
  } catch (err) {
    out = { ok: false, error: String(err) };
  }
  return ContentService.createTextOutput(cb + '(' + JSON.stringify(out) + ')')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}
