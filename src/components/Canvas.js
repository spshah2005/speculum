import React from 'react'

export default function Canvas({droppedItems, onDrop, onDragOver}) {
    console.log(droppedItems)
    return (
        <div className="canvas" onDrop={onDrop} onDragOver={onDragOver}
        style={{height:"500px", margin:"5px",border:'2px solid pink'}}>
        {droppedItems.map((item, index) => (
        <div key={index} className="canvas-item">
            {item.title}
        </div>
        ))}
        </div>
    );
}