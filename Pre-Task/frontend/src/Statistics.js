import React, { useState } from "react";
import BarChart from "./components/BarChart";
import FilteredImages from "./components/FilteredImages";
import stats from "./data/stats.json";

const Statistics = () => {
  const [filteredImageIds, setFilteredImageIds] = useState([]);

  const handleBarClick = (category, label) => {
    let ids = [];
    if (category === "gender") {
      ids = stats.gender[`${label.toLowerCase()}_ids`] || [];
    } else if (category === "age") {
      ids = stats.age[`${label.toLowerCase().replace(" ", "_")}_ids`] || [];
    } else if (category === "orientation") {
      console.log(`label: ${label}`)
      console.log(`Formatted label for orientation: ${label.toLowerCase().replace(" ", "_")}`)
      ids = stats.orientation[`${label.toLowerCase().replace(" ", "_")}_ids`] || [];
    }
    setFilteredImageIds(ids);
  };

  const imageData = filteredImageIds.map((id) => ({
    id,
    src: `http://localhost:5000/images/${id}.jpg`, // Backend route for images
  }));

  return (
    <div>
      <h2>Statistics</h2>
      <BarChart
        data={[
          { label: "Male", value: stats.gender.male },
          { label: "Female", value: stats.gender.female },
        ]}
        title="Gender Distribution"
        onBarClick={(label) => handleBarClick("gender", label)}
      />
      <BarChart
        data={[
          { label: "Young", value: stats.age.young },
          { label: "Middle Age", value: stats.age.middle_age },
          { label: "Old", value: stats.age.old },
        ]}
        title="Age Distribution"
        onBarClick={(label) => handleBarClick("age", label)}
      />
      <BarChart
        data={[
          { label: "Camera Facing", value: stats.orientation.camera_facing },
          { label: "Away Facing", value: stats.orientation.away_facing },
        ]}
        title="Orientation Distribution"
        onBarClick={(label) => handleBarClick("orientation", label)}
      />
      <h3>Filtered Images</h3>
      <FilteredImages images={imageData} />
    </div>
  );
};

export default Statistics;