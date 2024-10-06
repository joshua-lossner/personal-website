// Remove any imports related to Clock if they exist
// For example: import Clock from './Clock';

// Your main Layout component
export default function Layout({ children }) {
  return (
    <div className="layout">
      <main>{children}</main>
      {/* Add other layout elements here if needed */}
    </div>
  );
}