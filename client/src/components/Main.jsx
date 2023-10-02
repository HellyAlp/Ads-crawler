import React, { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Loader from "./Loader";
import axios from "axios";


function Main() {
  const [domain, setDomain] = useState('');
  const [adsTxt, setAdsTxt] = useState('');
  const [error, setError] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); 
  const [sortedAds, setSortedAds] = useState(null);
  const [displayedDomain, setDisplayedDomain] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [loading, setLoading] = useState(false); 
  const PORT  = process.env.PORT || 5000; 
  const serverBaseUrl = process.env.REACT_APP_SERVER_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStartTime(performance.now()); 
    setLoading(true);
    setDisplayedDomain(domain);
    try {
      const response = await axios.get(`${serverBaseUrl}:${PORT}/ads-txt/${domain}`);
      setAdsTxt(response.data);
      setError('');
      setEndTime(performance.now()); 
      setLoading(false);
    } catch (error) {
      setAdsTxt('');
      setError('Ads.txt file not found for the specified domain.');
      setDisplayedDomain(''); 
      setEndTime(performance.now()); 
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const jsonData = JSON.stringify(Object.entries(sortedAds), null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'table-data.json';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const executionTime = endTime && startTime ? (endTime - startTime).toFixed(2) + " ms" : "";

  const sortTable = (data) => {
    return Object.fromEntries(Object.entries(data).sort((a, b) => {
      if (sortOrder === 'asc') {
        return  a[1] - b[1];
      } else {
        return b[1] -  a[1];
      }
    })
    );
  };

  useEffect(() => {
    if (adsTxt) {
      setSortedAds(sortTable(adsTxt));
    }
  }, [adsTxt, sortOrder]);

  

  return (
    <div>
      <Header />
      <div className="container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Domain Name"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        />
        <button type="submit">View Ads.txt</button>
      </form>
      {error && <p>{error}</p>}
      {loading ? ( <Loader />) : (
      <div>
      {adsTxt && <div>
      <table  class="table tHeader">
             <tbody >
               <tr>
                 <th>Domain: <span class='details'>{displayedDomain} </span> </th>
                 <th>Execution Time: <span class='details'>{executionTime}</span></th>
                 <th><button class="download-button" onClick={handleDownload}>Download JSON</button></th>
               </tr>
             </tbody>
             </table>
        <table  class="table  table-striped table-bordered table-hover">
             <thead >
               <tr>
                 <th>Domain</th>
                 <th>
                  Count
                  <button className="sort-button" onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </button>
                </th>
               </tr>
             </thead>
             <tbody>
               {Object.entries((sortedAds || adsTxt)).map(([dom, count]) => (
                 <tr key={dom}>
                   <td>{dom}</td>
                   <td>{count}</td>
                 </tr>
               ))}
             </tbody>
           </table> </div>}

        </div> )}
      </div>
      <Footer/>
  </div>
  );
}


export default Main;
