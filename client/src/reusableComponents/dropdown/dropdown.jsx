import { useState } from "react";
import "./dropdown.css"; // Import the CSS file

export default function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="dropdown">
      {/* Button to toggle dropdown */}
      <button onClick={() => setIsOpen(!isOpen)} className="dropdown-button">
        Open Dropdown
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <ul className="dropdown-menu">
          <li>Option 1</li>
          <li>Option 2</li>
          <li>Option 3</li>
        </ul>
      )}
    </div>
  );
}
