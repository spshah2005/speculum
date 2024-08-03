import React from 'react';

function OutfitSuggestion({ wardrobeItems }) {
  // Basic outfit suggestion logic (example: color matching)
  const findMatches = (item) => {
    const matchingItems = wardrobeItems.filter((otherItem) => 
      item.id !== otherItem.id &&  // Don't match with itself
      item.colors.some(color1 => otherItem.colors.includes(color1)) // Basic color match
    );
    return matchingItems; 
  };

  return (
    <div>
      {wardrobeItems.map((item) => ( 
        <div key={item.id}> 
          <img src={item.imageUrl} alt={item.garmentType} />
          {/* Display matching items */}
          {findMatches(item).map((match) => (
            <img key={match.id} src={match.imageUrl} alt={match.garmentType} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default OutfitSuggestion;