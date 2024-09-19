import { useEffect } from 'react';

const AutumnColorTransition = () => {
  useEffect(() => {
    const colors = [
      'rgb(255, 230, 179)', // Light yellow
      'rgb(255, 204, 128)', // Orange yellow
      'rgb(255, 170, 128)', // Light orange
      'rgb(255, 145, 77)',  // Dark orange
      'rgb(230, 115, 0)',   // Burnt orange
    ];
    let colorIndex = 0;

    const transitionColor = () => {
      document.body.style.backgroundColor = colors[colorIndex];
      colorIndex = (colorIndex + 1) % colors.length;
    };

    const intervalId = setInterval(transitionColor, 10000); // Change color every 10 seconds

    return () => clearInterval(intervalId);
  }, []);

  return null; // This component doesn't render anything visible
};

export default AutumnColorTransition;