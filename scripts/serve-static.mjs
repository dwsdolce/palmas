#!/usr/bin/env node
//
// Serve a built directory over HTTP, for the end-to-end tests and the CI
// smoke test.
//
//   node scripts/serve-static.mjs 4173 --directory dist/pwa
//
// This replaces `python3 -m http.server`, which was the last thing in the
// toolchain needing a Python interpreter - a command Windows does not supply
// under that name. Node already has to be present to run the tests at all.
//
// The web build uses history routing (quasar.config.js picks hash only for
// Capacitor and Electron), so a deep link like /flamenco/solea is a route
// rather than a file and has to be answered with index.html. That fallback
// applies only to paths without a file extension: a missing .js or .png is an
// asset that genuinely is not there, and should 404 loudly rather than quietly
// return HTML and fail later as a syntax error.

import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import path from 'node:path'

// A wrong Content-Type is not a cosmetic problem here: a module script served
// as text/plain is refused outright by the browser, and the page then fails in
// a way that looks like a broken build.
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.eot': 'application/vnd.ms-fontobject',
  '.mp3': 'audio/mpeg',
  '.mp4': 'audio/mp4',
  '.ogg': 'audio/ogg',
  '.flac': 'audio/flac',
  '.wav': 'audio/wav',
  '.wasm': 'application/wasm'
}

let port = 4173
let directory = '.'

const args = process.argv.slice(2)
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--directory') directory = args[++i]
  else if (!args[i].startsWith('-')) port = Number(args[i])
}

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error(`ERROR: not a usable port: ${port}`)
  process.exit(1)
}

const root = path.resolve(directory)
if (!existsSync(root)) {
  // Without this the only symptom is Playwright's webServer timing out after
  // a minute, which says nothing about the missing build.
  console.error(`ERROR: nothing to serve at ${root}`)
  console.error('Build it first: yarn build')
  process.exit(1)
}

const send = (response, status, message) => {
  response.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' })
  response.end(message)
}

const server = createServer((request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return send(response, 405, 'Method not allowed')
  }

  let pathname
  try {
    pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname)
  } catch {
    return send(response, 400, 'Bad request')
  }

  // path.join normalises ".." away, and the prefix check then rejects anything
  // that still climbed out of the served directory. A URL is untrusted input
  // even on a loopback server that only the tests talk to.
  const target = path.join(root, pathname)
  if (target !== root && !target.startsWith(root + path.sep)) {
    return send(response, 403, 'Forbidden')
  }

  let file = target
  let info = null
  try {
    info = statSync(file)
    if (info.isDirectory()) {
      file = path.join(file, 'index.html')
      info = statSync(file)
    }
  } catch {
    info = null
  }

  if (info === null) {
    // Something with an extension was asked for and is not there: a real 404.
    if (path.extname(file) !== '') return send(response, 404, 'Not found')

    // Otherwise treat it as a client-side route and hand back the app.
    file = path.join(root, 'index.html')
    try {
      info = statSync(file)
    } catch {
      return send(response, 404, 'Not found')
    }
  }

  response.writeHead(200, {
    'Content-Type': TYPES[path.extname(file).toLowerCase()] ?? 'application/octet-stream',
    'Content-Length': info.size,
    // The tests rebuild between runs and must never see a stale response.
    'Cache-Control': 'no-store'
  })

  if (request.method === 'HEAD') return response.end()
  createReadStream(file).pipe(response)
})

// Loopback only. Nothing outside this machine has any business reaching a
// test fixture, and the tests address it as 127.0.0.1 anyway.
server.listen(port, '127.0.0.1', () => {
  console.log(`Serving ${root} on http://127.0.0.1:${port}/`)
})
