import fs from "fs";

interface Task {
  task: string;
  priority: number;
}
// agrv[0],arg[1] are paths, so info begins at index 2
const CLIinput: string[] = process.argv.slice(2);

const usage = `Usage :-
$ ./task add 2 hello world    # Add a new item with priority 2 and text "hello world" to the list
$ ./task ls                   # Show incomplete priority list items sorted by priority in ascending order
$ ./task del INDEX            # Delete the incomplete item with the given index
$ ./task done INDEX           # Mark the incomplete item with the given index as complete
$ ./task help                 # Show usage
$ ./task report               # Statistics`;

const fetchList = (path: string): Task[] => {
  return JSON.parse(fs.readFileSync(path, { encoding: "utf8" }));
};

switch (CLIinput[0]) {
  case "help":
    console.log(usage);
    break;

  default:
    console.log(usage);
    break;
}
