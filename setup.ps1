#!/usr/bin/env pwsh
#
# Bootstrap the project from PowerShell.
#
#   .\setup.ps1
#
# The line above is a comment to PowerShell. To a POSIX shell it is a shebang,
# so "./setup.ps1" from Git Bash runs through pwsh instead of bash trying to
# parse PowerShell as sh and emitting a screenful of syntax errors.
#
# It is best effort, not a guarantee: Cygwin resolves pwsh to a WindowsApps
# alias that env cannot execute, and answers "env: 'pwsh': No such file or
# directory" - one line rather than twenty, but still a failure. (Pointing the
# shebang at Windows PowerShell instead is worse: it runs, then dies on an
# execution policy that differs between the two PowerShells.)
#
# From any POSIX shell, on any platform, ./setup.sh is the one to use.
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

$ErrorActionPreference = 'Stop'
Set-Location -Path $PSScriptRoot

# scripts/setup.mjs is written to run on this and anything newer, so that the
# "your Node is too old for the project" conversation happens there, once.
$MinimumMajor = 14

function Get-UsableNode {
    $node = Get-Command node -ErrorAction SilentlyContinue
    if ($null -eq $node) { return $null }

    try {
        $major = [int](& node -p "process.versions.node.split('.')[0]" 2>$null)
    } catch {
        return $null
    }

    if ($major -ge $MinimumMajor) { return $node.Source }
    return $null
}

Write-Host ''
Write-Host 'A Compas - bootstrap'

$node = Get-UsableNode

if ($null -eq $node) {
    Write-Host ''
    Write-Host 'Node.js is not installed, or is too old to continue with.'
    Write-Host 'It is the one thing this project cannot install for you first,'
    Write-Host 'because everything else is driven by a script written in it.'
    Write-Host ''

    if ($null -eq (Get-Command winget -ErrorAction SilentlyContinue)) {
        Write-Host 'winget is not available on this machine. Install Node 24 from:'
        Write-Host '    https://nodejs.org/en/download/'
        Write-Host 'then run this script again.'
        exit 1
    }

    $answer = Read-Host 'Install Node.js 24 LTS with winget now? [y/N]'
    if ($answer -notmatch '^y(es)?$') {
        Write-Host ''
        Write-Host 'Nothing installed. Install Node 24 yourself and run this again.'
        exit 1
    }

    winget install --id OpenJS.NodeJS.LTS -e

    # winget updates the stored PATH, not this process's copy of it, so without
    # this the Node just installed would be invisible until a new terminal was
    # opened. Same trick the README gives for VS Code's stale environment.
    $env:PATH = [Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' +
                [Environment]::GetEnvironmentVariable('Path', 'User')

    $node = Get-UsableNode
    if ($null -eq $node) {
        Write-Host ''
        Write-Host 'Node still is not visible. Open a new terminal - and if you are in'
        Write-Host 'VS Code, restart VS Code rather than just the terminal - then run'
        Write-Host 'this script again.'
        exit 1
    }
}

Write-Host "Using Node at $node"
Write-Host ''

# So that "run this again" names a command that will actually work.
#
# Not simply ".\setup.ps1": this script is usually launched with
# -ExecutionPolicy Bypass precisely because the machine refuses local scripts,
# and telling someone to resume with the bare form would hand them the very
# error they just worked around. The process-scope policy is Bypass while this
# runs, so it says nothing about the next shell - the persisted scopes do.
$persisted = @('MachinePolicy', 'UserPolicy', 'CurrentUser', 'LocalMachine') |
    ForEach-Object { Get-ExecutionPolicy -Scope $_ } |
    Where-Object { $_ -ne 'Undefined' } |
    Select-Object -First 1

if ($null -eq $persisted) { $persisted = 'Restricted' }

$env:PALMAS_ENTRY = if ($persisted -in @('Restricted', 'AllSigned')) {
    'powershell -ExecutionPolicy Bypass -File .\setup.ps1'
} else {
    '.\setup.ps1'
}

# The running shell's own profile path. Windows PowerShell and PowerShell 7 use
# different files, so setup.mjs asking `powershell` for $PROFILE would always
# get the 5.1 answer, even under pwsh.
$env:PALMAS_PS_PROFILE = $PROFILE

# And the policy that governs whether that profile can ever be loaded. The two
# editions keep execution policy in separate registry keys, so PowerShell 7 can
# be RemoteSigned while Windows PowerShell is Restricted on the same machine.
# Writing a profile the shell will then refuse to load is worse than writing
# none: it turns every future startup into a security error.
$env:PALMAS_PS_POLICY = $persisted

& node scripts/setup.mjs @args
exit $LASTEXITCODE
