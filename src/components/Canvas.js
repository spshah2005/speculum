import React from 'react'
import update from 'immutability-helper'
import { useCallback, useState } from 'react'
import { useDrop } from 'react-dnd'

//styles
import "../styles/canvas.css"

export default function Canvas({droppedItems, onDragStart, onDrop, onDragOver}) {

    function doSnapToGrid(x, y) {
        const snappedX = Math.round(x / 32) * 32
        const snappedY = Math.round(y / 32) * 32
        return [snappedX, snappedY]
    }

    return (
        <div className="canvas" onDrop={onDrop}  onDragOver={onDragOver}
        >
        {droppedItems.map((item, index) => (
            <div 
            key={index} 
            className="canvas-item" 
            onDragStart={(e) => onDragStart(e, item)} 
            style={{
                position: 'absolute',
                left: `${item.x}px`,
                top: `${item.y}px`
            }}>
            <img style={{ width: "100px", height: "auto", objectFit:"contain" }} src={item.imgUrl} alt={`Item ${index}`} />
            </div>
        ))}
        </div>
    );
}