import { Component, type ErrorInfo, type ReactNode } from "react";
import "./ErrorBoundary.css";

type Props = { children: ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Unhandled render error:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // Rendered outside the router (which may itself have crashed), so use a
      // plain anchor — the full reload also resets the error state.
      return (
        <div className="eb-fallback">
          <div className="eb-content">
            <div className="eb-eyebrow">Something went wrong</div>
            <h1 className="eb-title">We Hit an Unexpected Snag</h1>
            <p className="eb-sub">
              Sorry about that — please refresh the page, or head back to the
              homepage and try again.
            </p>
            <a href="/" className="btn btn-gold">
              Back to home ↗
            </a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
