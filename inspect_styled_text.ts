import { StyledText, fg } from "@opentui/core";
const s = new StyledText([fg("red")("foo")]);
console.log("Chunks:", s.chunks);
