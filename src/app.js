const verificationToken = process.env.APP_VERIFICATION_TOKEN;
const crypto = require("crypto");
const wiki = require("wikijs").default;

async function init(request) {
  const messages = [];
  const searchTerm = getFlowVariable("searchTerm", request);
  const wikiData = await getDataFromWiki(searchTerm);
  messages.push(wikiData);

  return buildResult(messages);
}

/**
 * Get a flow variable from the request object by variable name (key)
 *
 * @param {string} key
 * @param request
 * @returns {string}
 */
function getFlowVariable(key, request) {
  return request.data[key];
}

async function getDataFromWiki(searchTerm) {
  const wikiPage = await wiki().page(searchTerm);
  const summary = await wikiPage.summary();
  return summary;
}

/**
 * Creates the response object to return to the flow
 *
 * @param {string[]} messages
 * @returns {object}
 */
function buildResult(messages) {
  let result = {
    flow: {
      messages: []
    }
  };

  for (let message of messages) {
    let messageObj = {
      type: "text",
      text: message
    };
    result.flow.messages.push(messageObj);
  }
  return result;
}

/**
 * Verifies the signature against the body content
 *
 * @param {string} signature
 * @param {object} body
 * @returns {boolean}
 */
function verifySignature(signature, body) {
  let hash = crypto
    .createHmac("sha1", verificationToken)
    .update(JSON.stringify(body))
    .digest("hex");

  return signature === hash;
}

module.exports = {
  verifySignature,
  init
};
