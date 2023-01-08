const mysql = require("mysql2/promise");
const deepl = require("deepl-node");
const config = require("./config");

async function main() {
  // 1. Extract the provided source language, target language and target language id
  const SOURCE_LOCALE = process.argv[2];
  const TARGET_LOCALE = process.argv[3];
  const TARGET_LANGUAGE_ID = process.argv[4];
  const API_SOURCE_LANGUAGE = process.argv[5];
  const API_TARGET_LANGUAGE = process.argv[6];

  // Log the provides information
  // console.log(SOURCE_LOCALE);
  // console.log(TARGET_LOCALE);
  // console.log(TARGET_LANGUAGE_ID);
  // console.log(API_SOURCE_LANGUAGE);
  // console.log(API_TARGET_LANGUAGE);

  // 2. Connect to database and fetch the rows for the source language
  const connection = await mysql.createConnection(config.db);
  const [rows, fields] = await connection.execute(
    "SELECT * FROM `ltm_translations` WHERE `locale` = ? ORDER BY `id` ASC;",
    [SOURCE_LOCALE]
  );
  // Log the fetched rows
  // console.log(rows);

  // 3. For each row extract the text that need to be translated and
  // 4. Prepare the request payload for the DeepL API
  const valuesForTranslation = rows.map((row) => {
    return row.value;
  });
  // Log the values for translation
  // console.log(valuesForTranslation);

  // 5. Send the request to DeepL API
  const translator = new deepl.Translator(config.deeply.authKey);
  const translatedValues = await translator.translateText(
    valuesForTranslation,
    API_SOURCE_LANGUAGE,
    API_TARGET_LANGUAGE
  );

  // Log the translated values
  // console.log(translatedValues);
  // translatedValues.forEach((result) => {
  //   console.log(result.text);
  // });

  // To avoid DeepL api call, due to 500.000 translation character limit for a developer API key
  // We can Fake/Mock the api response
  // const translatedValues = rows.map((row) => {
  //   return { text: `${TARGET_LANGUAGE}-${row.value}`, detectedSourceLang: SOURCE_LANGUAGE };
  // });
  // console.log(translatedValues);

  // 6. Construct the rows for the target language, extracting the text from the DeepL API response
  const translatedRows = rows.map((row, index) => {
    const newRow = { ...row };
    delete newRow.id; // id will be auto increment
    newRow.locale = TARGET_LOCALE;
    newRow.value = translatedValues[index].text;
    newRow.created_at = new Date();
    newRow.updated_at = new Date();
    newRow.language_id = TARGET_LANGUAGE_ID;
    return newRow;
  });

  // 7.	Save the target language rows into the database
  translatedRows.forEach(async (newRow) => {
    await connection.query("INSERT INTO `ltm_translations` SET ?", newRow);
  });

  await connection.end();

	console.log(`Translation Done. ${translatedRows.length} rows translated from ${SOURCE_LOCALE} -> ${TARGET_LOCALE}.`)
}

main();
