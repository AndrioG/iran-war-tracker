// netlify/functions/tracker.js
// Serverless proxy — runs on Netlify's servers, not the browser.
// Fetches JSON from Apps Script and returns it to the frontend.
// No CORS issue because this is a server-to-server call.

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwDTMcDf7RySIUdJaHShahma39WvET0wSJRbcildAz7hQatv9MOasmdt3-MeNWIEOsOeA/exec?action=data";

exports.handler = async function(event, context) {
  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method:  "GET",
      headers: { "Accept": "application/json" },
      redirect: "follow"
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "Apps Script returned HTTP " + response.status })
      };
    }

    const data = await response.text();

    return {
      statusCode: 200,
      headers: {
        "Content-Type":                "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: data
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type":                "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ error: "Proxy fetch failed: " + err.message })
    };
  }
};
