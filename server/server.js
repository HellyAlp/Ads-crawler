import express from "express";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from "path";
import axios from 'axios';
 
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port =  process.env.PORT || 5000; 
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Ignore SSL certificate errors because of msn.com site

app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/build')));
 
app.get('/ads-txt/:domain', async (req, res) => {
    const domain = req.params['domain'];
    try {
      const response = await axios.get(`https://${domain}/ads.txt`);
      const domains = response.data.match(/^(?![\s]*#)[^=,]+/gm).map((line) => line.trim().toLowerCase());
      const counts = domains.reduce((count, dom) => {
                count[dom] = (count[dom] || 0) + 1;
                return count;
              }, {});
      res.send(counts);
      console.log(counts)
    } catch (error) {
      res.status(404).send({ error: 'Ads.txt file not found for the specified domain.' });
    }
  });

// app.get('*', (req, res) => {
//   res.sendFile('index.html', { root: path.join(__dirname, '../client/public') });
// });


  app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
  });
