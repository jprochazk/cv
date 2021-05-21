(async function() {const fs = require("fs");
    const path = require("path");
    const js = require("terser");
    const CleanCss = require("clean-css");
    const css = {
        minify: (v) => new CleanCss().minify(v).styles
    };

    const Style = {
        Reset: "\x1b[0m",
        Bright: "\x1b[1m",
        Dim: "\x1b[2m",
        Underscore: "\x1b[4m",
        Blink: "\x1b[5m",
        Reverse: "\x1b[7m",
        Hidden: "\x1b[8m",

        FgBlack: "\x1b[30m",
        FgRed: "\x1b[31m",
        FgGreen: "\x1b[32m",
        FgYellow: "\x1b[33m",
        FgBlue: "\x1b[34m",
        FgMagenta: "\x1b[35m",
        FgCyan: "\x1b[36m",
        FgWhite: "\x1b[37m",

        BgBlack: "\x1b[40m",
        BgRed: "\x1b[41m",
        BgGreen: "\x1b[42m",
        BgYellow: "\x1b[43m",
        BgBlue: "\x1b[44m",
        BgMagenta: "\x1b[45m",
        BgCyan: "\x1b[46m",
        BgWhite: "\x1b[47m",
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

    /** @param {string} filePath */
    function clearDir(filePath) {
        if (fs.existsSync(filePath)) {
            for (const subFilePath of fs.readdirSync(filePath)) {
                fs.rmSync(path.join(filePath, subFilePath), { recursive: true, force: true });
            }
        }
    }

    console.log(`${Style.FgGreen}Running build${Style.Reset}`);
    clearDir(output);
    for (let [inPath, content] of walk(path.normalize(input))) {
        console.log(`Processing ${Style.FgGreen}${inPath}${Style.Reset}`);
        const ext = path.extname(inPath);
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