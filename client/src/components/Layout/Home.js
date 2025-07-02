import React, { useEffect } from "react";
import Header1 from "./Header1";
import { Link, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import "./Home.css";
import homepageImg from "../../../src/Images/homepage-img.png";

const Home = () => {
  const navigate = useNavigate();
  //prevent for login user
  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/user");
    }
  }, [navigate]);
  return (
    <>
      <Header1 />
      <div className="mt-0">
        <div className="home">
          <section className="hero-section">
            <div className="hero">
              <h2>Welcome to BudgetBee</h2>
              <p>
Take control of your finances with the Expense Management System App where every expense and income tells a story. 
Easily track, edit, and manage your money, while visual charts and smart stats give you a clear view of your financial habits. 
Cut the clutter, spot the trends, and start saving with confidence. Managing money has never felt this effortless.

              </p>
              <div className="buttons">
                <Link to="/login" className="join">
                  Join Now
                </Link>

                <Link to="/about-us" className="learn">
                  Learn More
                </Link>
              </div>
            </div>
            
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
