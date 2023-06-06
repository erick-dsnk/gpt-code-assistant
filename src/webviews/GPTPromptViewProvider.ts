import * as vscode from "vscode";

class GPTPromptViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewId = "prompt";

  private _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext<unknown>,
    _token: vscode.CancellationToken
  ): void | Thenable<void> {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
  }

  public updatePanel(data: {
    action: string;
    code?: string;
    prompt?: string;
    response?: string;
  }): void {
    if (this._view) {
      console.log("updatePanel called");
      this._view.show?.(true);

      if (data.action === "explain") {
        this._view.webview.postMessage({
          action: data.action,
          code: data.code,
          response: data.response,
        });
        console.log("posted message");
      }
    }
  }

  private _getHtmlForWebview(webview: vscode.Webview): string {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "resources", "main.js")
    );

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
    <title>GPT Code Assistant</title>
    </head>

    <body>
      <code id="code-area"></code>

      <span id="response-area"><span>

      <script src=${scriptUri}></script>
    </body>
    </html>
    `;
  }
}

export default GPTPromptViewProvider;
