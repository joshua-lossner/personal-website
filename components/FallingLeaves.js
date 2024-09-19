import React, { useEffect, useState } from 'react';

const Leaf = ({ style }) => (
  <div 
    className="absolute w-3 h-3 rounded-full opacity-60"
    style={style}
  />
);

const FallingLeaves = () => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const createLeaf = () => {
      const colors = ['#FFA500', '#FF8C00', '#FF4500', '#8B4513', '#A0522D'];
      const newLeaf = {
        id: Date.now(),
        left: `${Math.random() * 100}%`,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: `${Math.random() * 0.5 + 0.5}rem`,
        animationDuration: `${Math.random() * 10 + 10}s`,
        animationDelay: `${Math.random() * 5}s`,
      };
      setLeaves(prevLeaves => [...prevLeaves, newLeaf]);
    };

    const interval = setInterval(createLeaf, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (leaves.length > 15) {
      setLeaves(prevLeaves => prevLeaves.slice(1));
    }
  }, [leaves]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {leaves.map(leaf => (
        <Leaf 
          key={leaf.id}
          style={{
            left: leaf.left,
            width: leaf.size,
            height: leaf.size,
            backgroundColor: leaf.color,
            animation: `fallAndSway ${leaf.animationDuration} ease-in-out ${leaf.animationDelay} infinite`,
          }}
        />
      ))}
    </div>
  );
};

export default FallingLeaves;