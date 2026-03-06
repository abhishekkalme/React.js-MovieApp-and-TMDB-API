import React from "react";
import { FiAlertTriangle, FiHome, FiRefreshCw } from "react-icons/fi";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-24 h-24 bg-red-600/20 rounded-full flex items-center justify-center text-red-500 mb-8 border border-red-500/30">
                        <FiAlertTriangle size={48} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Something went wrong</h1>
                    <p className="text-gray-400 max-w-md mb-8 leading-relaxed">
                        We encountered an unexpected error. Don't worry, it's not your fault. Our team has been notified.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <button
                            onClick={() => window.location.reload()}
                            className="flex items-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold transition shadow-lg shadow-red-600/40"
                        >
                            <FiRefreshCw /> Reload Page
                        </button>
                        <a
                            href="/"
                            className="flex items-center gap-2 px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold transition border border-white/10"
                        >
                            <FiHome /> Back to Home
                        </a>
                    </div>
                    {import.meta.env.DEV && (
                        <div className="mt-12 p-6 bg-zinc-900 rounded-2xl border border-white/10 text-left max-w-4xl w-full overflow-hidden shadow-2xl relative group">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-red-400 font-black text-xs uppercase tracking-[0.2em]">Developer Insight</p>
                                <button
                                    onClick={() => {
                                        const text = `Error: ${this.state.error?.toString()}\n\nStack Trace: ${this.state.errorInfo?.componentStack}`;
                                        navigator.clipboard.writeText(text);
                                    }}
                                    className="text-[10px] font-black uppercase tracking-widest bg-white/5 hover:bg-white/10 px-3 py-1 rounded-md border border-white/10 text-gray-400 hover:text-white transition-all"
                                >
                                    Copy Report
                                </button>
                            </div>
                            <div className="space-y-4 font-mono text-sm">
                                <div className="p-3 bg-black/40 rounded-lg border border-red-500/20">
                                    <p className="text-red-400 break-words">{this.state.error?.toString()}</p>
                                </div>
                                {this.state.errorInfo && (
                                    <div className="p-3 bg-black/40 rounded-lg border border-white/5 max-h-60 overflow-y-auto custom-scrollbar">
                                        <p className="text-gray-500 text-xs mb-2 uppercase tracking-widest font-black">Component Stack</p>
                                        <pre className="text-gray-400 text-[11px] leading-relaxed">
                                            {this.state.errorInfo.componentStack}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
