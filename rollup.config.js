import esbuild from "rollup-plugin-esbuild"
import replace from "@rollup/plugin-replace"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import { readFileSync } from "node:fs"

const esBuildConfig = {
  target: "es6",
}

const BANNER = readFileSync("./src/snippets/banner.css", { encoding: "utf8" })

export const FILES_LIST = [
  {
    input: "src/js/embedChat.ts",
    output: "dist/js/embedChat.js",
  },
  {
    input: "src/js/openChat.ts",
    output: "dist/js/openChat.js",
  },
]
export const REPLACE_VARS = {
  preventAssignment: false,
  __theme_version__: `v${process.env.npm_package_version}`,
  __theme_name__: "Level Up Embed Tools",
  __theme_website__: "https://levelupghl.com",
}

const getPlugins = (esOpts = {}) => {
  return [
    replace(REPLACE_VARS),
    esbuild({ ...esBuildConfig, ...esOpts }),
    nodeResolve(),
    commonjs(),
  ]
}

function buildFiles() {
  const ret = []
  FILES_LIST.forEach((file) => {
    ret.push({
      input: file.input,
      plugins: getPlugins(),
      // TODO: standardize output for minify and dev build
      output: [
        {
          file: file.output,
          format: "es",
          sourcemap: true,
          banner: BANNER,
        },
      ],
    })
    // Minify
    ret.push({
      input: file.input,
      plugins: getPlugins({ minify: true }),
      output: [
        {
          file: file.output.replace(".js", ".min.js"),
          format: "es",
          sourcemap: true,
          banner: BANNER,
        },
      ],
    })
  })
  return ret
}

export default buildFiles()
