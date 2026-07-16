import React from 'react';
import { Coffee } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-6" role="alert">
          <div className="glass-dark p-10 rounded-[2rem] border border-brand-primary/20 text-center max-w-md w-full">
            <Coffee size={48} className="mx-auto text-brand-primary mb-6" />
            <h2 className="text-2xl font-bold text-white mb-3">حدث خطأ غير متوقع</h2>
            <p className="text-brand-light/60 mb-6">يرجى تحميل الصفحة مرة أخرى.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-gold text-brand-dark px-8 py-3 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all"
            >
              إعادة التحميل
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
