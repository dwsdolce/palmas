#!/bin/sh
#
# Bootstrap the project from a POSIX shell - macOS, Linux, and Cygwin,
# Git Bash or MSYS on Windows.
#
#   ./setup.sh
#
# This exists for one reason: scripts/setup.mjs is written in Node, so it cannot
# be what discovers that Node is missing. That is the whole job here - make sure
# some usable Node exists, then hand over. Every decision worth making, and
# every other prerequisite, lives in scripts/setup.mjs so it is written once
# rather than once per platform.
#
# Deliberately not asked here: whether to use a version manager. A machine with
# no Node at all has nothing to lose by a direct install, and a machine that
# *does* have Node can reach setup.mjs, which asks properly.

set -e
cd "$(dirname "$0")"

# scripts/setup.mjs is written to run on this and anything newer, so that the
# "your Node is too old for the project" conversation happens there, once.
MINIMUM_MAJOR=14

usable_node() {
    command -v node >/dev/null 2>&1 || return 1
    major=$(node -p "process.versions.node.split('.')[0]" 2>/dev/null) || return 1
    [ "$major" -ge "$MINIMUM_MAJOR" ] 2>/dev/null || return 1
    return 0
}

echo
echo 'A Compas - bootstrap'

if ! usable_node; then
    echo
    echo 'Node.js is not installed, or is too old to continue with.'
    echo 'It is the one thing this project cannot install for you first,'
    echo 'because everything else is driven by a script written in it.'
    echo

    installer=''

    # Cygwin, Git Bash and MSYS are POSIX shells on top of Windows, where the
    # package manager is winget - a Windows binary, but perfectly reachable from
    # here.
    case "$(uname -s)" in
        CYGWIN* | MINGW* | MSYS*)
            windows=1
            if command -v winget >/dev/null 2>&1; then
                installer='winget install --id OpenJS.NodeJS.LTS -e'
            fi
            ;;
        *)
            windows=0
            ;;
    esac

    if [ -z "$installer" ]; then
        if command -v brew >/dev/null 2>&1; then
            installer='brew install node@24'
        elif command -v apt >/dev/null 2>&1; then
            installer='sudo apt update && sudo apt install -y nodejs'
        elif command -v dnf >/dev/null 2>&1; then
            installer='sudo dnf install -y nodejs'
        elif command -v pacman >/dev/null 2>&1; then
            installer='sudo pacman -S --noconfirm nodejs'
        fi
    fi

    if [ -z "$installer" ]; then
        echo 'No package manager was recognised. Install Node 24 from:'
        echo '    https://nodejs.org/en/download/'
        echo 'then run this script again.'
        exit 1
    fi

    printf 'Install Node.js with "%s"? [y/N] ' "$installer"
    read -r answer
    case "$answer" in
        y | Y | yes | YES) ;;
        *)
            echo
            echo 'Nothing installed. Install Node 24 yourself and run this again.'
            exit 1
            ;;
    esac

    sh -c "$installer"

    # A distribution's "nodejs" package is often well behind, and Homebrew keeps
    # versioned formulae unlinked. Either way setup.mjs is the thing that knows
    # what this project needs, so it only has to be new enough to run.
    if ! usable_node; then
        echo
        echo 'Node still is not on PATH.'
        if [ "$windows" = '1' ]; then
            # A POSIX shell on Windows builds its PATH once, at startup, from
            # the Windows one - so an install that just happened is invisible
            # until a new shell. PowerShell can reload it in place, which is why
            # setup.ps1 manages without a restart.
            echo 'Open a new terminal and run this again - or run the PowerShell'
            echo 'bootstrap, which can pick up the new PATH without restarting:'
            echo
            echo '    ./setup.ps1'
        else
            echo 'Open a new terminal and run this again.'
        fi
        exit 1
    fi
fi

echo "Using Node at $(command -v node)"
echo

# So that "run this again" names the command you actually typed.
PALMAS_ENTRY='./setup.sh'
export PALMAS_ENTRY

exec node scripts/setup.mjs "$@"
