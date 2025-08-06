import React from "react";
import TourCard from "./TourCard";

const TourList = ({ tours }) => (
  <div className="card-container">
    
     
          {tours.map((tour) => (
            <TourCard key={tour._id} tour={tour} />
          ))}
       
   
  </div>
);

export default TourList;
