import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  message?: string
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: undefined }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error?.message }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', { error, info })
  }

  handleRetry = () => {
    // Try to recover without a full reload first
    this.setState({ hasError: false, message: undefined })
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container} role="alert">
          <div style={styles.card}>
            <h2 style={styles.title}>Bir şeyler ters gitti</h2>
            <p style={styles.message}>{this.state.message || 'Beklenmeyen bir hata oluştu.'}</p>
            <div style={styles.actions}>
              <button style={styles.button} onClick={this.handleRetry}>
                Tekrar dene
              </button>
              <button style={{ ...styles.button, ...styles.secondary }} onClick={this.handleReload}>
                Sayfayı yenile
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'radial-gradient(circle at 20% 20%, rgba(86, 170, 255, 0.08), transparent 35%), linear-gradient(135deg, #0b152e 0%, #0d1f3a 40%, #07101f 100%)',
    padding: '24px',
  },
  card: {
    maxWidth: '480px',
    width: '100%',
    background: 'rgba(13, 15, 26, 0.75)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '24px',
    color: '#e6edff',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.45)',
    backdropFilter: 'blur(12px)',
  },
  title: {
    margin: '0 0 10px 0',
    fontSize: '22px',
  },
  message: {
    margin: '0 0 18px 0',
    lineHeight: 1.6,
    color: '#cdd8ff',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  button: {
    padding: '10px 16px',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 700,
    letterSpacing: '0.3px',
    background: 'linear-gradient(135deg, #2b84ea 0%, #9d4edd 100%)',
    color: '#0d0f1a',
    boxShadow: '0 10px 30px rgba(43, 132, 234, 0.35)',
  },
  secondary: {
    background: 'rgba(255, 255, 255, 0.08)',
    color: '#e6edff',
    boxShadow: 'none',
    border: '1px solid rgba(255, 255, 255, 0.12)',
  },
}

export default ErrorBoundary
