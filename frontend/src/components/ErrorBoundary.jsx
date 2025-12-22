import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                    <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center border-l-4 border-red-500">
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h1>
                        <p className="text-gray-500 mb-6">The application encountered an unexpected error.</p>
                        <div className="bg-red-50 p-3 rounded-lg text-left text-xs font-mono text-red-700 mb-6 overflow-auto max-h-32">
                            {this.state.error && this.state.error.toString()}
                        </div>
                        <button
                            onClick={() => {
                                this.setState({ hasError: false });
                                window.location.href = '/';
                            }}
                            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition w-full"
                        >
                            Reload Application
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
