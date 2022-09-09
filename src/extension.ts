// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import {
  commands,
  ExtensionContext,
  QuickPickItem,
  QuickPickItemKind,
  ThemeIcon,
  window,
} from "vscode";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "kernel-python-picker" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = commands.registerCommand(
    "kernel-python-picker.helloWorld",
    () => {
      function updateItems(item?: QuickPickItem) {
        qp.items = items;
        qp.activeItems = item ? [item] : qp.activeItems;
      }
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      const qp = window.createQuickPick();
      qp.title = "Select a Python Environment";
      const items: QuickPickItem[] = [];
      qp.items = items;
      qp.buttons = [{ iconPath: new ThemeIcon("refresh") }];
      qp.onDidChangeActive((selections) => {
        selections.forEach((item) => {
          if (item.label === "Env1") {
            setTimeout(() => {
              item.label = "Env1 3.8.10";
              item.description = "~/conda/envs/env1/bin/python";
              updateItems();
            }, 300);
          }
          if (item.label === "Env2") {
            setTimeout(() => {
              item.label = "Env2 3.10.1";
              item.description = "~/conda/envs/env2/bin/python";
              updateItems();
            }, 300);
          }
        });
      });
      qp.busy = true;
      let refreshPromise: Promise<void> | undefined;
      qp.onDidTriggerButton(() => {
        if (refreshPromise) {
          return;
        }
        qp.busy = true;
        refreshPromise = new Promise((resolve) => {
          setTimeout(() => {
            if (!items.find((item) => item.label.includes("Env3"))) {
              const indexOfEnv2 = items.findIndex((item) =>
                item.label.includes("Env2")
              );
              items.splice(indexOfEnv2 + 1, 0, {
                label: "Env3",
              });
              updateItems();
            }
          }, 1000);
          setTimeout(() => {
            const env3 = items.find(
              (item) => item.label.includes("Env3") && !item.description
            );
            if (env3) {
              env3.description = "~/conda/envs/env3/bin/python";
              updateItems();
            }
          }, 1500);
          setTimeout(() => {
            const env3 = items.find((item) => item.label === "Env3");
            if (env3) {
              env3.label = "Env3 3.11.0";
              updateItems();
            }
          }, 2000);
          setTimeout(() => {
            const index = items.findIndex((item) =>
              item.label.includes("Env2")
            );
            if (index) {
              items.splice(index, 1);
              updateItems();
            }
          }, 3000);
          setTimeout(() => {
            resolve();
            refreshPromise = undefined;
            qp.busy = false;
          }, 4000);
        });
      });
      qp.show();

      setTimeout(() => {
        items.push({
          label: "Global",
          kind: QuickPickItemKind.Separator,
        });
        items.push({
          label: "Python",
          description: "~/bin/python37",
        });
        qp.items = items;
        // qp.activeItems = qp.activeItems;
      }, 1000);
      setTimeout(() => {
        items.push({
          label: "Conda",
          kind: QuickPickItemKind.Separator,
        });
        items.push({
          label: "Env1",
        });
        qp.items = items;
        // qp.activeItems = qp.activeItems;
      }, 1500);
      setTimeout(() => {
        items.push({
          label: "Env2",
        });
        qp.items = items;
        // qp.activeItems = qp.activeItems;
      }, 2000);
      setTimeout(() => {
        let indexOfPython37 = -1;
        items.forEach((item, index) => {
          if (
            item.label === "Python" &&
            item.description === "~/bin/python37"
          ) {
            item.label = "Python 3.7.9 64-bit";
            indexOfPython37 = index;
          }
        });
        items.splice(indexOfPython37 + 1, 0, {
          label: "Python",
          description: "~/bin/python36",
        });
        updateItems();
      }, 3000);
      setTimeout(() => {
        items.forEach((item) => {
          if (
            item.label === "Python" &&
            item.description === "~/bin/python36"
          ) {
            item.label = "Python 3.6.12 64-bit";
          }
          if (item.label === "Env1") {
            item.label = "Env1 3.8.10";
            item.description = "~/conda/envs/env1/bin/python";
          }
          if (item.label === "Env2") {
            item.label = "Env2 3.10.1";
            item.description = "~/conda/envs/env2/bin/python";
          }
        });
        updateItems();
        qp.busy = false;
      }, 10000);
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
