'use client'; // Error boundaries must be Client Components

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error('GlobalError:', error);

  return (
    <html>
      <body style={styles.body}>
        <div style={styles.container}>
          <h1 style={styles.title}>Oops! Something went wrong.</h1>
          <p style={styles.message}>
            Were sorry for the inconvenience. An unexpected error occurred.
          </p>
          <p style={styles.errorDetails}>
            <strong>Error Details:</strong>{' '}
            {error.message || 'No details available.'}
          </p>
          <button style={styles.button} onClick={reset}>
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}

// Inline CSS for styling the error page
const styles = {
  body: {
    margin: 0,
    padding: 0,
    backgroundColor: '#f8f9fa',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  container: {
    textAlign: 'center' as const,
    padding: '2rem',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '500px',
    width: '90%',
  },
  title: {
    fontSize: '1.8rem',
    color: '#343a40',
    marginBottom: '1rem',
  },
  message: {
    fontSize: '1rem',
    color: '#6c757d',
    marginBottom: '1rem',
  },
  errorDetails: {
    fontSize: '0.9rem',
    color: '#dc3545',
    marginBottom: '1.5rem',
  },
  button: {
    padding: '0.6rem 1.2rem',
    fontSize: '1rem',
    color: '#ffffff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};
