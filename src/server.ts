/**
 * This file includes a simple server just to showcase the
 * calculated exchanged amounts against a currency source
 */
import { createServer, IncomingMessage, ServerResponse } from 'http';
import fs from 'fs';
import { URL } from 'url';
import { getGraphData } from './api/graph';

const PORT = 3000;
const HOST = 'localhost';
const DATA_URL =
  process.env.DATA_URL ||
  'https://api-coding-challenge.neofinancial.com/currency-conversion?seed=88662';

(async () => {
  let indexFile: any;
  let masterScriptFile: any;

  const server = createServer(
    (request: IncomingMessage, response: ServerResponse) => {
      if (request.url?.startsWith('/api')) {
        handleAPICall(request, response);
      } else {
        switch (request.url) {
          case '/static/js/master':
            console.log(request.url);
            response.setHeader('Content-Type', 'text/javascript');
            response.writeHead(200);
            response.end(masterScriptFile);
            break;
          default:
            console.log(request.url);
            response.setHeader('Content-Type', 'text/html');
            response.writeHead(200);
            response.end(indexFile);
        }
      }
    }
  );

  Promise.all([
    fs.promises.readFile(__dirname + '/../web/index.html'),
    fs.promises.readFile(__dirname + '/../web/master-script.js'),
  ])
    .then(([htmlContent, jsContent]) => {
      indexFile = htmlContent;
      masterScriptFile = jsContent;

      server.listen(PORT, HOST, () => {
        console.log(`Server is running on http://${HOST}:${PORT}`);
      });
    })
    .catch((e) => console.error(e));
})();

/**
 * Simple method to take inputs from the url and calculate exchanged amounts
 * @param request
 * @param response
 */
const handleAPICall = async (
  request: IncomingMessage,
  response: ServerResponse
) => {
  const url = new URL(`http://${HOST}:${PORT}/${request.url}` || '');
  const amount: string | null = url.searchParams.get('amount');
  const currency: string | null = url.searchParams.get('currency');

  let graphData: any[];
  if (amount !== null && currency !== null) {
    graphData = await getGraphData(DATA_URL, +amount, currency);
  } else {
    graphData = [];
  }

  response.setHeader('Content-Type', 'application/json');
  response.writeHead(200);
  response.end(JSON.stringify(graphData));
};
