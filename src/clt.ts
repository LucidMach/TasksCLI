import fs from "fs";

// agrv[0],arg[1] are paths, so info begins at index 2
const CLIinput = process.argv.slice(2);

const fetchListJSON = (path) => {
  return JSON.parse(fs.readFileSync(path));
};

const pushListJSON = (path, tasks) => {
  fs.writeFileSync(path, JSON.stringify(tasks));
};

const usage = `Usage :-
$ ./task add 2 hello world    # Add a new item with priority 2 and text "hello world" to the list
$ ./task ls                   # Show incomplete priority list items sorted by priority in ascending order
$ ./task del INDEX            # Delete the incomplete item with the given index
$ ./task done INDEX           # Mark the incomplete item with the given index as complete
$ ./task help                 # Show usage
$ ./task report               # Statistics`;

// help
if (CLIinput[0] === "help") {
  // default msg
  console.log(usage);
  return 0;
}

// list
if (CLIinput[0] === "ls") {
  // fetching task list
  const tasks = fetchListJSON("./task.json");

  // displaying list
  tasks.forEach((task, index) => {
    console.log(`${index + 1}. ${task.task} [${task.priority}]`);
  });
  return 0;
}

// add
if (CLIinput[0] === "add") {
  // check if priority is an number
  if (isNaN(CLIinput[1])) throw "priority should be a number";

  // fetching existing task list + creating new task object
  const priority = parseInt(CLIinput[1]);

  if (priority < 0) throw "priority can't be lower than 0";

  if (!CLIinput[2]) console.log("Error: Missing tasks string. Nothing added!");
  const tasks = fetchListJSON("./task.json");
  const task = {
    priority,
    task: CLIinput[2],
  };

  // adding task and sorting task list
  tasks.push(task);
  tasks.sort((a, b) => a.priority - b.priority);

  pushListJSON("./task.json", tasks);
  console.log(`Added task: "${task.task}" with priority ${task.priority}`);

  // for jest
  let tasktxt = "";
  tasks.forEach((task) => {
    tasktxt += `${task.priority} ${task.task}\n`;
  });
  fs.writeFileSync("./task.txt", tasktxt);
  return 0;
}

// delete
if (CLIinput[0] === "del") {
  // fetching task list
  const tasks = fetchListJSON("./task.json");

  // checking scope of index
  if (CLIinput[1] > tasks.length - 1) {
    console.log(
      `Error: item with index ${CLIinput[1]} does not exist. Nothing deleted.`
    );
    return 0;
  }

  // removing task
  tasks.splice(CLIinput[1], 1);
  pushListJSON("./task.json", tasks);

  // for jest
  let tasktxt = "";
  tasks.forEach((task) => {
    tasktxt += `${task.priority} ${task.task}\n`;
  });

  fs.writeFileSync("./task.txt", tasktxt);
  console.log(`Deleted item with index ${CLIinput[1]}`);
  return 0;
}

// done
if (CLIinput[0] === "done") {
  // fetching task list
  const tasks = fetchListJSON("./task.json");
  const completed = fetchListJSON("./completed.json");

  // checking scope of index
  if (CLIinput[1] > tasks.length - 1) {
    console.log(`Error: no incomplete item with index ${CLIinput[1]} exists.`);
    return 0;
  }

  task = tasks[CLIinput[1]];

  // adding task to completed list
  completed.push(task);
  completed.sort((a, b) => a.priority - b.priority);
  pushListJSON("./completed.json", completed);

  // for jest
  let completedtxt = "";
  completed.forEach((task) => {
    completedtxt += `${task.task}\n`;
  });
  fs.writeFileSync("./completed.txt", completedtxt);

  // removing task from task list
  tasks.splice(CLIinput[1], 1);
  pushListJSON("./task.json", tasks);

  // for jest
  let tasktxt = "";
  tasks.forEach((task) => {
    tasktxt += `${task.priority} ${task.task}\n`;
  });
  fs.writeFileSync("./task.txt", tasktxt);

  console.log("Marked item as done.");
  return 0;
}

// report
if (CLIinput[0] === "report") {
  // fetching task list
  const tasks = fetchListJSON("./task.json");
  const completed = fetchListJSON("./completed.json");

  console.log(`Pending: ${tasks.length}`);
  tasks.forEach((task, index) => {
    console.log(`${index + 1}. ${task.task} [${task.priority}]`);
  });

  console.log(`
Completed: ${completed.length}`);
  completed.forEach((task, index) => {
    console.log(`${index + 1}. ${task.task}`);
  });

  return 0;
} else {
  console.log(usage);
  return 0;
}
