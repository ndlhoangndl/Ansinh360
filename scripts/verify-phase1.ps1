param([switch]$WithPostgres)
$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
$sdkCommand = Get-Command dotnet -ErrorAction SilentlyContinue
$sdkPath = if ($sdkCommand) { $sdkCommand.Source } else { Join-Path $env:USERPROFILE '.dotnet/dotnet.exe' }
if (-not (Test-Path -LiteralPath $sdkPath)) { throw 'Install the .NET 8 SDK or add dotnet to PATH.' }
function Run-Dotnet {
    param([string[]]$SdkArguments)
    & $sdkPath @SdkArguments
    if ($LASTEXITCODE -ne 0) { throw "dotnet command failed with exit code $LASTEXITCODE" }
}
Run-Dotnet @('restore', 'AnSinh360.sln', '--locked-mode', '--configfile', 'NuGet.Config')
Run-Dotnet @('tool', 'restore', '--configfile', 'NuGet.Config')
Run-Dotnet @('build', 'AnSinh360.sln', '-c', 'Release', '--no-restore') | Tee-Object -FilePath docs/reports/build.txt
Run-Dotnet @('run', '--project', 'src/AnSinh360.Cli', '-c', 'Release', '--no-build', '--', 'validate', '--data', 'data', '--report', 'docs/reports/dataset-validation.json')
Run-Dotnet @('run', '--project', 'src/AnSinh360.Cli', '-c', 'Release', '--no-build', '--', 'summary', '--data', 'data', '--report', 'docs/reports/dataset-summary.json')
Run-Dotnet @('run', '--project', 'src/AnSinh360.Cli', '-c', 'Release', '--no-build', '--', 'plan', '--data', 'data', '--report', 'docs/reports/import-plan.json')
Run-Dotnet @('ef', 'migrations', 'has-pending-model-changes', '--project', 'src/AnSinh360.Infrastructure', '--configuration', 'Release', '--no-build')
Run-Dotnet @('ef', 'migrations', 'script', '--project', 'src/AnSinh360.Infrastructure', '--configuration', 'Release', '--no-build', '--output', 'docs/reports/initial-migration.sql')
if ($WithPostgres) {
    if (-not $env:AS360_CONNECTION_STRING -or -not $env:AS360_TEST_CONNECTION_STRING) {
        throw 'Set AS360_CONNECTION_STRING and AS360_TEST_CONNECTION_STRING before PostgreSQL verification.'
    }
    Run-Dotnet @('run', '--project', 'src/AnSinh360.Cli', '-c', 'Release', '--no-build', '--', 'migrate')
    Run-Dotnet @('run', '--project', 'src/AnSinh360.Cli', '-c', 'Release', '--no-build', '--', 'verify-idempotency', '--data', 'data', '--report', 'docs/reports/postgres-idempotency.json')
    Run-Dotnet @('run', '--project', 'src/AnSinh360.Cli', '-c', 'Release', '--no-build', '--', 'summary', '--database', '--report', 'docs/reports/postgres-summary.json')
} else {
    Write-Host 'PostgreSQL integration verification: blocked by local environment unless AS360_TEST_CONNECTION_STRING is set.'
}
Run-Dotnet @('test', 'AnSinh360.sln', '-c', 'Release', '--no-build', '--no-restore', '--logger', 'trx;LogFileName=phase1-tests.trx', '--results-directory', 'docs/reports/tests')
