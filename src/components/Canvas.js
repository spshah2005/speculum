import React from 'react'
import update from 'immutability-helper'
import { useCallback, useState } from 'react'
import { useDrop } from 'react-dnd'


export default function Canvas({droppedItems, onDrop, onDragOver}) {

    function doSnapToGrid(x, y) {
        const snappedX = Math.round(x / 32) * 32
        const snappedY = Math.round(y / 32) * 32
        return [snappedX, snappedY]
    }

    return (
        <div className="canvas" onDrop={onDrop} onDragOver={onDragOver}
            style={{ height: "500px", margin: "5px", border: '2px solid pink', position: 'relative' }}>
        {droppedItems.map((item, index) => (
            <div 
            key={index} 
            className="canvas-item" 
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