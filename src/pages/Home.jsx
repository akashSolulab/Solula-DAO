import React from "react";
import { Navbar } from "../components/Navbar.jsx";
import Card from "../components/Card";
import { Sidebar } from "../components/Sidebar";
import Heading from "../components/Heading.jsx";
import Nft from "../components/Nft.jsx";

const Home = () => {
  return (
    <div>
      <Navbar />
      <div className="flex flex-col md:flex-row justify-center">
        <div className="flex flex-col">
          <Sidebar />
          <Nft />
        </div>
        <div className="flex flex-col">
          <Heading />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
        </div>
      </div>
    </div>
  );
};

export default Home;
