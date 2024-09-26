import React from 'react';

const DynamicAudio = React.forwardRef((props, ref) => {
  return <audio ref={ref} {...props} />;
});

DynamicAudio.displayName = 'DynamicAudio';

export default DynamicAudio;