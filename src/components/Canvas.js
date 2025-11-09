import React from 'react'
import update from 'immutability-helper'
import { useCallback, useState } from 'react'
import { useDrop } from 'react-dnd'

//styles
import "../styles/canvas.css"

export default function Canvas({droppedItems, onDragStart, onDrop, onDragOver, canvasRef}) {

    // snap to a 32px grid (optional, keeps drops aligned)
    function doSnapToGrid(x, y) {
        const grid = 32
        const snappedX = Math.round(x / grid) * grid
        const snappedY = Math.round(y / grid) * grid
        return [snappedX, snappedY]
    }

    return (
        <div className="canvas" ref={canvasRef} onDrop={onDrop} onDragOver={onDragOver}>
        {droppedItems.map((item, index) => (
            <div 
            key={item.id ?? index} 
            className="canvas-item" 
            draggable={true}
            onDragStart={(e) => onDragStart(e, item)} 
            style={{
                position: 'absolute',
                left: `${item.x}px`,
                top: `${item.y}px`
            }}>
            <img style={{ width: "100px", height: "auto", objectFit:"contain", pointerEvents: 'none' }} src={item.imgUrl} alt={`Item ${index}`} />
            </div>
        ))}
        </div>
    );
}