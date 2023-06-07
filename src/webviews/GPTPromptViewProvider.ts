import * as vscode from "vscode";

class GPTPromptViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewId = "prompt";

  private _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext<unknown>,
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
      this._view.show?.(true);

      switch (data.action) {
        case "explain": {
          console.log(data.action);
          
          this._view.webview.postMessage({
            action: data.action,
            code: data.code,
            response: data.response,
          });

          break;
        }

        case "refactor": {
          console.log(data.action);

          this._view.webview.postMessage({
            action: data.action,
            code: data.code,
            response: data.response,
          });

          break;
        }
      }
    }
  }

  private _getHtmlForWebview(webview: vscode.Webview): string {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "resources", "main.js")
    );
    const stylesheetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "resources", "main.css")
    );

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <title>GPT Code Assistant</title>

      <link rel="stylesheet" href="${stylesheetUri}">

      <script src="https://cdn.jsdelivr.net/npm/showdown@2.1.0/dist/showdown.min.js"></script>
    </head>

    <body>
      <h2 id="panel-title"></h2>

      <div id="code-section">
        <h3></h3>
        <code id="code-area"></code>
      </div>

      <div id="response-section">
        <h3></h3>
        <span id="response-area" markdown=1><span>
      </div>

    <script src=${scriptUri}></script>
    </body>
    </html>
    `;
  }
}

export default GPTPromptViewProvider;
