import React, {useState} from "react"
import openTrash from '../images/open-trash.png'
import closedTrash from '../images/closed-trash.png'

export default function TrashBin(){
    const [isOpen, setIsOpen] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsOpen(true);
    }

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsOpen(false);
    }

    const toggleIcon = () => {
        setIsOpen(!isOpen);
    };

    const handleOnDrop = (e) => {
        e.preventDefault();
        setIsOpen(false);
    }

    return (
        <div onClick={toggleIcon} onDrop={handleOnDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}>
        {isOpen ? (
            <img className="trash-icon" style={{width:"95%", height:"95%", objectFit:"contain"}}
            src={openTrash} alt="Open Trash" />
        ) : (
            <img className="trash-icon" style={{width:"95%", height:"95%", objectFit:"contain"}}
            src={closedTrash} alt="Closed Trash" />
        )}
        </div>
    );
}