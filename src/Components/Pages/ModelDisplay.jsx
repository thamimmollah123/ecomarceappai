import React, { useEffect, useState } from 'react';

function ModelDisplay({ model }) {
  const [activeModel, setActiveModel] = useState(model);

  useEffect(() => {
    setActiveModel(model);
  }, [model]);

  return (
    <div className={`model-display ${activeModel.id === model.id ? 'active' : ''}`}>
      <img src={activeModel.image} alt={activeModel.name} />
    </div>
  );
}

export default ModelDisplay;
