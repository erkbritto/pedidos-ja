import { Component, type ErrorInfo, type ReactNode } from "react";
import { RotateCcw } from "lucide-react";
import { APP_BASE_PATH } from "@/lib/env";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Barreira de erro de última instância da aplicação.
 * Evita que uma exceção não tratada em qualquer tela deixe o usuário
 * diante de uma página em branco.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("Erro não tratado na interface:", error, info.componentStack);
  }

  private handleReset = (): void => {
    this.setState({ error: null });
    window.location.assign(APP_BASE_PATH);
  };

  override render(): ReactNode {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
          <div className="max-w-md text-center">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Esta página não carregou
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Ocorreu um erro inesperado na interface. Você pode tentar novamente ou voltar ao
              início.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <RotateCcw aria-hidden="true" className="size-4" />
                Voltar ao início
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
