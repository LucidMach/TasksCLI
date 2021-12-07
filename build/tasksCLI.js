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
switch (CLIinput[0]) {
    case "help":
        console.log(usage);
        break;
    default:
        console.log(usage);
        break;
}
