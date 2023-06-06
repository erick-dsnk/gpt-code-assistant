(function () {
  // let vscode = acquireVsCodeApi();

  window.addEventListener("message", (event) => {    
    const message = event.data;

    console.log(message);

    switch (message.action) {
      case "explain": {
        updateExplain(message.code, message.response);
      }
    }
  });

  function updateExplain(code, response) {
    const codeArea = document.querySelector("#code-area");
    const responseArea = document.querySelector("#response-area");

    codeArea.textContent = code;
    responseArea.textContent = response;
  }
}());