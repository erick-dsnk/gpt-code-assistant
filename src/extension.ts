/*
   Copyright 2023 Eric Tabacaru

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

import * as vscode from "vscode";
import { Configuration, OpenAIApi } from "openai";
import GPTPromptViewProvider from "./webviews/GPTPromptViewProvider";

export function activate(context: vscode.ExtensionContext) {
  const config = new Configuration({
    apiKey: vscode.workspace
      .getConfiguration("gpt-code-assistant")
      .get("api-key"),
  });

  const openai = new OpenAIApi(config);

  const provider = new GPTPromptViewProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      GPTPromptViewProvider.viewId,
      provider
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "gpt-code-assistant.gptExplainSelection",
      async () => {
        const currSelectionRange = vscode.window.activeTextEditor?.selection;
        const codeSelection =
          vscode.window.activeTextEditor?.document.getText(currSelectionRange);

        let completion = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are an expert programmer and you excel at explaining and refactoring code.",
            },
            {
              role: "user",
              content: `Explain what this code does as best as you can:\n${codeSelection}`,
            },
          ],
        });

        provider.updatePanel({
          action: "explain",
          code: codeSelection,
          response: completion.data.choices[0].message?.content,
        });
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "gpt-code-assistant.gptRefactorSelection",
      async () => {
        const currSelectionRange = vscode.window.activeTextEditor?.selection;
        const codeSelection =
          vscode.window.activeTextEditor?.document.getText(currSelectionRange);

        let completion = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are an expert programmer and you excel at explaining and refactoring code.",
            },
            {
              role: "user",
              content: `Refactor this code to make it more efficient:\n${codeSelection}`,
            },
          ],
        });

        provider.updatePanel({
          action: "refactor",
          code: codeSelection,
          response: completion.data.choices[0].message?.content,
        });
      }
    )
  );
}

export function deactivate() {}
