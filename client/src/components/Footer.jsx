import React from "react";

const date = new Date();
function Footer() {
  return (
    <footer>
      <p>Copyright © Helly Alpern {date.getFullYear()} </p>
    </footer>
  );
}

export default Footer;