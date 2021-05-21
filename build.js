(async function() {const fs = require("fs");
const path = require("path");
const js = require("terser");
const css = {
    minify: function(input) {
        return input.replace(/([^0-9a-zA-Z\.#])\s+/g, "$1")
            .replace(/\s([^0-9a-zA-Z\.#]+)/g, "$1")
            .replace(/;}/g, "}")
            .replace(/\/\*.*?\*\//g, "");
    }
}

const terserOptions = {
    caseSensitive: true,
    collapseWhitespace: true,
    conservativeCollapse: true,
    keepClosingSlash: true,
    minifyCSS: true,
    minifyJS: true,
    removeComments: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
};

const output = "./dist";
const input = "./src";

/** @returns {Generator<[string, Buffer]>} */
function* walk(filePath, directory = null) {
    filePath = directory ? path.join(directory, filePath) : filePath;
    if (fs.statSync(filePath).isDirectory()) {
        for (const subFilePath of fs.readdirSync(filePath)) {
            yield* walk(subFilePath, filePath);
        }
    } else {
        yield [filePath, fs.readFileSync(filePath)];
    }
}

fs.rmSync(output, { recursive: true, force: true });
for (let [inPath, content] of walk(path.normalize(input))) {
    const ext = path.extname(inPath);
    console.log(ext);
    switch (ext) {
        case ".js": content = (await js.minify(content.toString("utf-8"))).code; break;
        case ".css": content = css.minify(content.toString("utf-8")); break;
        case ".html": content = content.toString("utf-8"); break;
        case ".md": content = content.toString("utf-8"); break;
    }
    const outPath = inPath.replace(path.normalize(input), path.normalize(output));
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, content);
}
})();