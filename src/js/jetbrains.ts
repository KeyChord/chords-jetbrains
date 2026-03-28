import fs from "fs";
import { outdent } from "outdent";
import path from "path";
import spawn from "nano-spawn-compat";

// This function makes it possible to programmatically execute IntelliJ commands
export default async function action(this: ImportMeta, commandId: string) {
  const tmp = process.env.TMPDIR ?? "/tmp";
  const id = Math.random();
  const scriptPath = path.join(tmp, `jetbrains_action_${id}.groovy`);
  const resultPath = path.join(tmp, `jetbrains_action_${id}.txt`);

  const script = outdent`
    import com.intellij.openapi.actionSystem.ActionManager

    def actionManager = ActionManager.getInstance()
    def resultFile = new File(${JSON.stringify(resultPath)})

    IDE.application.invokeAndWait {
      try {
        def action = actionManager.getAction(${JSON.stringify(commandId)})
        if (action == null) {
          resultFile.text = "0"
          return
        }

        def result = actionManager.tryToExecute(action, null, null, null, false)
        resultFile.text = result.rejected ? "0" : "1"
      } catch (Throwable ignored) {
        resultFile.text = "0"
      }
    }
  `;

  fs.writeFileSync(scriptPath, script);
  await spawn(this.ideBinPath, ["ideScript", scriptPath]);
  const result = fs.readFileSync(resultPath, "utf8");

  fs.rmSync(scriptPath);
  fs.rmSync(resultPath);

  return result == "1";
};
