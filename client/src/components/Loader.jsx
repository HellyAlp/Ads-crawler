import React from "react";
import loading from './imgs/loading_gif.gif';

function Loader() {
  return (
    <div className="loader">
      <img src={loading} class="loading" alt="my-gif" />
    </div>
  );
}

export default Loader;