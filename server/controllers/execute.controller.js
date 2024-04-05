import {runCommand} from "../utils/utils.js";

async function execute(req, res) {
  const command = req.body.command;

  runCommand(command, res);
}

export default execute;
