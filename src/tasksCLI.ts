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

// ///////////////////////////////////////////////////////////// helper functions //
const fetchList = <T>(path: string): T => {
  return JSON.parse(fs.readFileSync(path, { encoding: "utf8" }));
};
const pushList = <T>(path: string, tasks: T): void => {
  fs.writeFileSync(path, JSON.stringify(tasks));
};

// ///////////////////////////////////////////////////////////////////// TasksCLI //
switch (CLIinput[0]) {
  case "help":
    console.log(usage);
    break;

  case "ls": {
    // fetching task list
    const tasks = fetchList<Task[]>("./task.json");

    // displaying list
    tasks.forEach((task, index) => {
      console.log(`${index}. ${task.task} [${task.priority}]`);
    });
    break;
  }

  case "add": {
    // assigning a priority
    const priority = parseInt(CLIinput[1]);
    if (isNaN(priority)) throw "priority should be a number";
    if (priority < 0) throw "priority can't be lower than 0";

    // assigning a task
    const taskContent = CLIinput[2];
    if (!taskContent)
      console.log("Error: Missing tasks string. Nothing added!");
    const tasks = fetchList<Task[]>("./task.json");
    const task: Task = {
      priority,
      task: taskContent,
    };

    // adding task and sorting task list
    tasks.push(task);
    tasks.sort((a, b) => a.priority - b.priority);
    pushList<Task[]>("./task.json", tasks);

    console.log(`Added task: "${task.task}" with priority ${task.priority}`);
    break;
  }
  case "del": {
    // fetching task list
    const tasks = fetchList<Task[]>("./task.json");

    // checking scope of index
    const index = CLIinput[1];
    if (parseInt(index) > tasks.length - 1) {
      console.log(
        `Error: item with index ${index} does not exist. Nothing deleted.`
      );
      break;
    }

    // removing task
    tasks.splice(parseInt(index), 1);
    pushList<Task[]>("./task.json", tasks);

    console.log(`Deleted Task with index: ${index}`);
    break;
  }

  case "done": {
    // fetching task list
    const tasks = fetchList<Task[]>("./task.json");
    const completed = fetchList<Task[]>("./completed.json");

    // checking scope of index
    const index = parseInt(CLIinput[1]);
    if (index > tasks.length - 1) {
      console.log(`Error: no incomplete item with index ${index} exists.`);
      break;
    }

    // fetching task
    const task = tasks[index];

    // adding task to completed list
    completed.push(task);
    completed.sort((a, b) => a.priority - b.priority);
    pushList<Task[]>("./completed.json", completed);

    // removing task from task list
    tasks.splice(index, 1);
    pushList<Task[]>("./task.json", tasks);

    console.log(`Marked Task with index ${index} as done.`);
    break;
  }

  case "report":
    // fetching task list
    const tasks = fetchList<Task[]>("./task.json");
    const completed = fetchList<Task[]>("./completed.json");

    console.log(`Pending: ${tasks.length}`);
    tasks.forEach((task, index) => {
      console.log(`${index}. ${task.task} [${task.priority}]`);
    });

    console.log(`
Completed: ${completed.length}`);
    completed.forEach((task, index) => {
      console.log(`${index}. ${task.task}`);
    });
    break;

  default:
    console.log(usage);
    break;
}
