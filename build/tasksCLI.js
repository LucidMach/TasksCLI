"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
// agrv[0],arg[1] are paths, so info begins at index 2
var CLIinput = process.argv.slice(2);
var usage = "Usage :-\n$ ./task add 2 hello world    # Add a new item with priority 2 and text \"hello world\" to the list\n$ ./task ls                   # Show incomplete priority list items sorted by priority in ascending order\n$ ./task del INDEX            # Delete the incomplete item with the given index\n$ ./task done INDEX           # Mark the incomplete item with the given index as complete\n$ ./task help                 # Show usage\n$ ./task report               # Statistics";
var fetchList = function (path) {
    return JSON.parse(fs_1.default.readFileSync(path, { encoding: "utf8" }));
};
var pushList = function (path, tasks) {
    fs_1.default.writeFileSync(path, JSON.stringify(tasks));
};
switch (CLIinput[0]) {
    case "help":
        console.log(usage);
        break;
    case "ls": {
        // fetching task list
        var tasks_1 = fetchList("./task.json");
        // displaying list
        tasks_1.forEach(function (task, index) {
            console.log(index + ". " + task.task + " [" + task.priority + "]");
        });
        break;
    }
    case "add": {
        // check if priority is an number
        if (isNaN(parseInt(CLIinput[1])))
            throw "priority should be a number";
        // assigning a priority
        var priority = parseInt(CLIinput[1]);
        if (priority < 0)
            throw "priority can't be lower than 0";
        // assigning a task
        if (!CLIinput[2])
            console.log("Error: Missing tasks string. Nothing added!");
        var tasks_2 = fetchList("./task.json");
        var task = {
            priority: priority,
            task: CLIinput[2],
        };
        // adding task and sorting task list
        tasks_2.push(task);
        tasks_2.sort(function (a, b) { return a.priority - b.priority; });
        pushList("./task.json", tasks_2);
        console.log("Added task: \"" + task.task + "\" with priority " + task.priority);
        break;
    }
    case "del": {
        // fetching task list
        var tasks_3 = fetchList("./task.json");
        // checking scope of index
        if (parseInt(CLIinput[1]) > tasks_3.length - 1) {
            console.log("Error: item with index " + CLIinput[1] + " does not exist. Nothing deleted.");
            break;
        }
        // removing task
        tasks_3.splice(parseInt(CLIinput[1]), 1);
        pushList("./task.json", tasks_3);
        console.log("Deleted Task with index: " + CLIinput[1]);
        break;
    }
    case "done": {
        // fetching task list
        var tasks_4 = fetchList("./task.json");
        var completed_1 = fetchList("./completed.json");
        // checking scope of index
        if (parseInt(CLIinput[1]) > tasks_4.length - 1) {
            console.log("Error: no incomplete item with index " + CLIinput[1] + " exists.");
            break;
        }
        // fetching task
        var task = tasks_4[parseInt(CLIinput[1])];
        // adding task to completed list
        completed_1.push(task);
        completed_1.sort(function (a, b) { return a.priority - b.priority; });
        pushList("./completed.json", completed_1);
        // removing task from task list
        tasks_4.splice(parseInt(CLIinput[1]), 1);
        pushList("./task.json", tasks_4);
        console.log("Marked Task with index " + CLIinput[1] + " as done.");
        break;
    }
    case "report":
        // fetching task list
        var tasks = fetchList("./task.json");
        var completed = fetchList("./completed.json");
        console.log("Pending: " + tasks.length);
        tasks.forEach(function (task, index) {
            console.log(index + ". " + task.task + " [" + task.priority + "]");
        });
        console.log("\nCompleted: " + completed.length);
        completed.forEach(function (task, index) {
            console.log(index + ". " + task.task);
        });
        break;
    default:
        console.log(usage);
        break;
}
