(function () {
  let converter = new showdown.Converter();

  window.addEventListener("message", (event) => {    
    const message = event.data;

    switch (message.action) {
      case "explain": {
        updateExplain(message.code, message.response);
        break;
      }

      case "refactor": {
        updateRefactor(message.code, message.response);
        break;
      }
    }
  });

  function updateExplain(code, response) {
    document.querySelector("#panel-title").innerHTML = "GPT: Explain Code";
    document.querySelector("#code-section").querySelector("h3").innerHTML = "Your Code";
    document.querySelector("#code-area").innerHTML = code;
    document.querySelector("#response-section").querySelector("h3").innerHTML = "Explanation";
    document.querySelector("#response-area").innerHTML = converter.makeHtml(response);
  }

  function updateRefactor(code, response) {
    document.querySelector("#panel-title").innerHTML = "GPT: Refactor Code";
    document.querySelector("#code-section").querySelector("h3").innerHTML = "Your Code";
    document.querySelector("#code-area").innerHTML = code;
    document.querySelector("#response-section").querySelector("h3").innerHTML = "Refactored Code";
    document.querySelector("#response-area").innerHTML = converter.makeHtml(response);
  }

}());