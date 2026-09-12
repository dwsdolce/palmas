# Security policy

## Supported versions

Security fixes go into the latest release only. If you are on an older version,
update first and check whether the problem is still there.

| Version | Supported |
|---|---|
| Latest release | yes |
| Anything older | no |

That covers every form Palmas is published in: the web app, the macOS, Windows
and Linux desktop apps, and the iPhone, iPad and Android apps.

## Reporting a vulnerability

**Please do not report security problems in a public issue**, where anyone can
read how to exploit them before they are fixed.

- **Preferred:** use GitHub's private reporting — the
  [Report a vulnerability](https://github.com/dwsdolce/palmas/security/advisories/new)
  button on this repository's Security tab. Only the maintainer can see the
  report, and it can be discussed and fixed privately.
- **Without a GitHub account:** email
  [support@dolcesfogato.com](mailto:support@dolcesfogato.com) with "Security" in
  the subject.

Please include:

- which platform and app version are affected — the version is shown at the top
  right of the app, for example `v1.0.0 (915)`
- what the problem is, and what someone could do with it
- the steps to reproduce it, or a proof of concept

## What happens next

The report will be acknowledged, you will be kept informed while it is looked
into, and once a fix is released the problem will be disclosed in a security
advisory. You will be credited there unless you would rather not be.

Palmas is maintained by one person and has no bug bounty.

## Scope

Palmas has no accounts, no server of its own, and collects no personal data, so
the realistic problems are in the app itself — for example a weakness in its
Content Security Policy, in the desktop app's Electron configuration, or a
vulnerable dependency that Palmas actually exposes.

A vulnerability in a dependency that Palmas does not expose belongs with that
dependency's project. [A Compás](https://gitlab.com/acompas/acompas), which
Palmas is derived from, is a separate project with its own maintainers.
