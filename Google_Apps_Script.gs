/**
 * Young Kuteb Innovators (YKI) volunteer registration endpoint.
 * Create a Google Spreadsheet, open Extensions > Apps Script, and paste this file.
 */
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Registrations')
      || SpreadsheetApp.getActiveSpreadsheet().insertSheet('Registrations');

    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp', 'Full name', 'Email', 'Phone / WhatsApp', 'Location',
        'Age range', 'Contribution areas', 'Skills / experience', 'Availability',
        'Goals for YKI', 'Portfolio link', 'Consent'
      ]);
      sheet.setFrozenRows(1);
    }

    const p = (e && e.parameter) ? e.parameter : {};
    const contributions = (e && e.parameters && e.parameters.contributions)
      ? e.parameters.contributions.join(', ')
      : (p.contributions || '');

    if (!p.fullName || !p.email || !p.skills || p.consent !== 'Yes') {
      throw new Error('Please complete the required fields and consent.');
    }

    sheet.appendRow([
      new Date(),
      p.fullName,
      p.email,
      p.phone || '',
      p.location || '',
      p.ageRange || '',
      contributions,
      p.skills,
      p.availability || '',
      p.goals || '',
      p.portfolio || '',
      p.consent
    ]);

    return HtmlService.createHtmlOutput(
      '<!doctype html><html><body><script>parent.postMessage("YKI_FORM_SUCCESS","*");</script>Registration received.</body></html>'
    ).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  } catch (err) {
    return HtmlService.createHtmlOutput(
      '<!doctype html><html><body><script>parent.postMessage("YKI_FORM_ERROR","*");</script>Unable to save registration.</body></html>'
    ).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
}
