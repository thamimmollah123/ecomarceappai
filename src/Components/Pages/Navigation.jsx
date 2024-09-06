import React from 'react';

function Navigation({ changeModel, currentModelId, totalModels }) {
  const goPrev = () => {
    if (currentModelId > 1) {
      changeModel(currentModelId - 1);
    }
  };

  const goNext = () => {
    if (currentModelId < totalModels) {
      changeModel(currentModelId + 1);
    }
  };

  return (
    <div className="navigation">
      <button onClick={goPrev}>&lt;</button>
      <button onClick={goNext}>&gt;</button>
    </div>
  );
}

export default Navigation;
