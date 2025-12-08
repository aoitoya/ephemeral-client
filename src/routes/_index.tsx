import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_index')({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="home-container">
      <h1>Welcome to Ephemeral</h1>
      <p>Your content goes here...</p>
      <div style={{ marginTop: '2rem' }}>
        <a href="/signup" className="button">Sign Up</a>
        <a href="/login" className="button" style={{ marginLeft: '1rem' }}>Log In</a>
      </div>
    </div>
  );
}
