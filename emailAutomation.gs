convertMonthToText = {
  1: "Jan",
  2: "Feb",
  3: "Mar",
  4: "Apr",
  5: "May",
  6: "Jun",
  7: "Jul",
  8: "Aug",
  9: "Sep",
  10: "Oct",
  11: "Nov",
  12: "Dec",
};

function roundUp(value, decimalPlaces) {
  const power = 10 ** decimalPlaces;
  return Math.ceil(value * power) / power;
}

function convertToPercent(value) {
  convertedNumber = value * 100;
  return convertedNumber.toFixed(0);
}

/**
 * @OnlyCurrentDoc
 */
function getDataFromSpreadsheet() {
  var rawValues = SpreadsheetApp.getActive()
    .getSheetByName("Email Report - Daily")
    .getRange("demoCompany")
    .getValues();

  // console.log({ rawValues })

  var timestamp = rawValues[0][1];
  var date = new Date(timestamp);
  rawValues[0][1] =
    "" +
    date.getDate() +
    "-" +
    convertMonthToText[date.getMonth() + 1] +
    "-" +
    date.getFullYear();

  const currencyIndices = [2];
  const conditionalIndices = [2, 4];

  // 0 index contains the table column headers
  for (let i = 1; i < rawValues.length; i++) {
    // Check for the even row where currency figures are used
    if (currencyIndices.includes(i)) {
      rawValues[i][1] = "$" + roundUp(parseFloat(rawValues[i][1]), 1);
      
      rawValues[i][3] = "$" + roundUp(parseFloat(rawValues[i][3]), 1);

    } else {
      rawValues[i][1] =
        convertToPercent(roundUp(parseFloat(rawValues[i][1]), 2)) + "%";
      rawValues[i][3] =
        convertToPercent(roundUp(parseFloat(rawValues[i][3]), 2)) + "%";
    }

    rawValues[i][2] =
        convertToPercent(roundUp(parseFloat(rawValues[i][2]), 2)) + "%";
      rawValues[i][4] =
        convertToPercent(roundUp(parseFloat(rawValues[i][4]), 2)) + "%";

  }

  // console.log({ rawValues })
  return rawValues;
}

function convertDataToHTML(data) {
  var htmlTemplate = HtmlService.createTemplateFromFile("template.html");
  htmlTemplate.data = data;
  var htmlBody = htmlTemplate.evaluate().getContent();
  return htmlBody;
}

function sendEmail() {
  var emailData = getDataFromSpreadsheet();
  var htmlBody = convertDataToHTML(emailData);

  MailApp.sendEmail({
    to: "example@email.com",
    subject: `Daily Unit Economics Report - Demo Company - ${emailData[0][1]}`,
    htmlBody: htmlBody,
    cc: "example1@email.com, example2@email.com, example3@email.com",
  });

  console.log("Email has been sent!");
}
