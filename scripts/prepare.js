const pkg = require("../package");
const fs = require("fs");

delete pkg.devDependencies;
delete pkg.scripts;

fs.writeFileSync(process.env.DIR + "/package.json", JSON.stringify(pkg));