import React from "react";
import Hero from "../components/Hero";

function Profession() {
  return (
    <div>
      <Hero
        badge="Portfolio"
        title="My Work"
        description="A collection of applications and designs I've built recently."
        primaryBtnText="View on GitHub"
        secondaryBtnText="Back Home"
        secondaryBtnHref="/"
      />
    </div>
  );
}

export default Profession;
