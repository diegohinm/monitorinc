param(
    [string]$RepoRoot = "C:\Users\diego\OneDrive\Documents\monitorinc",
    [string]$AppUrl = "http://127.0.0.1:3000",
    [string]$ReferenceUrl = "https://tec-tel.com/",
    [string]$ContentUrl = "https://monitorinc.netlify.app/",
    [ValidateRange(15, 30)][int]$MinimumIterations = 15,
    [ValidateRange(15, 30)][int]$MaxIterations = 18,
    [ValidateRange(40, 200)][int]$ClaudeMaxTurns = 120,
    [ValidateRange(0, 300)][int]$CooldownSeconds = 30,
    [switch]$AutoStartDev
)

$ErrorActionPreference = "Stop"
if ($MaxIterations -lt $MinimumIterations) { throw "MaxIterations cannot be lower than MinimumIterations." }

function Require-Command([string]$Name) {
    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) { throw "Missing command in PATH: $Name" }
}
function Require-File([string]$Path) {
    if (-not (Test-Path $Path)) { throw "Missing required file: $Path" }
}
function Test-AppAvailable([string]$Url) {
    try { $r=Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 8; return $r.StatusCode -lt 500 } catch { return $false }
}
function Wait-AppAvailable([string]$Url,[int]$TimeoutSeconds=75) {
    $deadline=(Get-Date).AddSeconds($TimeoutSeconds)
    while((Get-Date)-lt $deadline){ if(Test-AppAvailable $Url){return $true}; Start-Sleep 2 }
    return $false
}
function Get-NpmScripts([string]$PackageJson) {
    if(-not(Test-Path $PackageJson)){return @()}
    $pkg=Get-Content $PackageJson -Raw | ConvertFrom-Json
    return @($pkg.scripts.PSObject.Properties.Name)
}
function Write-ClaudeStream {
    process {
        $line=$_
        try{$event=$line|ConvertFrom-Json}catch{Write-Host $line;return}
        if($event.type -eq "assistant"){
            foreach($block in $event.message.content){
                if($block.type -eq "text" -and $block.text){Write-Host $block.text -ForegroundColor Gray}
                elseif($block.type -eq "tool_use"){$details=$block.input|ConvertTo-Json -Compress -Depth 10;Write-Host "  Claude -> $($block.name): $details" -ForegroundColor DarkCyan}
            }
        } elseif($event.type -eq "result"){
            Write-Host "Claude finished: $($event.num_turns) turns" -ForegroundColor DarkGray
        }
    }
}

Require-Command "claude"
Require-Command "codex"
Require-Command "npm"
if(-not(Test-Path $RepoRoot)){throw "Project not found: $RepoRoot"}
$RepoRoot=(Resolve-Path $RepoRoot).Path

$AiDir=Join-Path $RepoRoot ".ai"
$ReviewDir=Join-Path $AiDir "reviews"
$ScreenshotDir=Join-Path $AiDir "screenshots"
$ReferenceDir=Join-Path $AiDir "reference"
$ClaudeSpec=Join-Path $AiDir "CLAUDE_UI_TASK.md"
$CodexSpec=Join-Path $AiDir "CODEX_UI_REVIEW.md"
$ClaudeStatus=Join-Path $AiDir "claude-status.md"
$LatestReview=Join-Path $ReviewDir "codex-ui-review-latest.md"
$PackageJson=Join-Path $RepoRoot "package.json"
$DevLog=Join-Path $AiDir "dev-server.log"

New-Item -ItemType Directory -Force $AiDir,$ReviewDir,$ScreenshotDir,$ReferenceDir|Out-Null
Require-File $ClaudeSpec
Require-File $CodexSpec
Require-File $PackageJson
if(-not(Test-Path $ClaudeStatus)){"ITERATION: 0`nREADY_FOR_CODEX_REVIEW: no"|Set-Content $ClaudeStatus -Encoding UTF8}

$started=$null
if(-not(Test-AppAvailable $AppUrl)){
    if(-not $AutoStartDev){throw "App unavailable at $AppUrl. Run npm run dev or use -AutoStartDev."}
    $scripts=Get-NpmScripts $PackageJson
    if($scripts -notcontains "dev"){throw "No npm dev script found."}
    $cmd="npm run dev > `"$DevLog`" 2>&1"
    $started=Start-Process -FilePath "cmd.exe" -ArgumentList "/c",$cmd -WorkingDirectory $RepoRoot -PassThru -WindowStyle Hidden
    if(-not(Wait-AppAvailable $AppUrl)){throw "Dev server did not become available. See $DevLog"}
}

$refDesktop=Join-Path $ReferenceDir "tec-tel-desktop.png"
$refMobile=Join-Path $ReferenceDir "tec-tel-mobile.png"
if(-not((Test-Path $refDesktop)-and(Test-Path $refMobile))){
    $bootstrap=Join-Path $ReviewDir "reference-bootstrap.md"
    $task=@"
NO APP SOURCE MODIFICATIONS.
Use Playwright MCP to open $ReferenceUrl.
Capture canonical home screenshots:
- desktop 1440x1000 @1x -> $refDesktop
- mobile 390x844 @1x -> $refMobile
Default page state; full page if available.
Then open $ContentUrl and verify it loads as MONITORINC factual source.
Do not copy reference assets.
"@
    & codex -C $RepoRoot -a on-request -c 'approvals_reviewer="auto_review"' exec --ephemeral -o $bootstrap $task
    if($LASTEXITCODE -ne 0){throw "Codex reference bootstrap failed."}
    Require-File $refDesktop; Require-File $refMobile
}

$lastVerdict="NONE"
try{
for($iteration=1;$iteration -le $MaxIterations;$iteration++){
    Write-Host "`n===== ITERATION $iteration / $MaxIterations (minimum $MinimumIterations) =====" -ForegroundColor Cyan
    $previousReview=if(Test-Path $LatestReview){$LatestReview}else{"No previous review."}
    $verifyOnly=($lastVerdict -eq "PASS" -and $iteration -le $MinimumIterations)

    $claudeContext=@"
REPO: $RepoRoot
ITERATION: $iteration
MINIMUM: $MinimumIterations
MAXIMUM: $MaxIterations
LOCAL APP: $AppUrl
REFERENCE URL: $ReferenceUrl
CONTENT URL: $ContentUrl
CLAUDE SPEC: $ClaudeSpec
STATUS: $ClaudeStatus
LATEST CODEX REVIEW: $previousReview
REFERENCE DESKTOP: $refDesktop
REFERENCE MOBILE: $refMobile
VERIFY-ONLY MODE: $verifyOnly

Read the complete Claude spec. Inspect current code before editing. Iteration 1 performs the major redesign if not already done. Later iterations fix only Codex OPEN FINDINGS. If VERIFY-ONLY MODE is True, do not invent design changes; validate and edit only a real regression. Claude is the only code-writing agent. Do not edit .ai/reviews or reference screenshots. Do not copy Tec-Tel code/assets/facts. Use MONITORINC content only. Modify files for real, no commit/push, update .ai/claude-status.md.
"@
    Push-Location $RepoRoot
    try{
        $claudeContext | & claude -p --verbose --output-format stream-json --permission-mode acceptEdits --max-turns $ClaudeMaxTurns "Execute the MONITORINC implementation iteration described via stdin." | Write-ClaudeStream
        $claudeExit=$LASTEXITCODE
    } finally {Pop-Location}
    if($claudeExit -ne 0){throw "Claude failed with exit code $claudeExit"}

    $buildLog=Join-Path $ReviewDir "build-$iteration.log"
    $scripts=Get-NpmScripts $PackageJson
    $buildPassed=$true
    if($scripts -contains "build"){
        Push-Location $RepoRoot
        try{
            $old=$ErrorActionPreference;$ErrorActionPreference="Continue"
            try{& npm run build 2>&1|ForEach-Object{"$_"}|Tee-Object -FilePath $buildLog;$buildExit=$LASTEXITCODE}
            finally{$ErrorActionPreference=$old}
        } finally{Pop-Location}
        if($buildExit -ne 0){$buildPassed=$false}
    } else {"No build script"|Set-Content $buildLog;$buildPassed=$false}

    $reviewPath=Join-Path $ReviewDir "iteration-$iteration.md"
    $codexTask=@"
REPO: $RepoRoot
ITERATION: $iteration
MINIMUM ROUNDS: $MinimumIterations
CODEX SPEC: $CodexSpec
CLAUDE STATUS: $ClaudeStatus
REFERENCE URL: $ReferenceUrl
REFERENCE DESKTOP: $refDesktop
REFERENCE MOBILE: $refMobile
CONTENT SOURCE: $ContentUrl
LOCAL APP: $AppUrl
BUILD LOG: $buildLog
BUILD PASSED: $buildPassed

Use Playwright MCP. Do not modify app source. Compare local rendered app against canonical Tec-Tel screenshots and reference design language. Use live MONITORINC only for facts. Capture:
.ai/screenshots/monitorinc-iteration-$iteration-desktop.png at 1440x1000 @1x
.ai/screenshots/monitorinc-iteration-$iteration-mobile.png at 390x844 @1x
Review header, hero, consultation form, suppliers/sectors, §01, §02, §03, FAQ, final CTA, footer; test mobile nav, CTA, anchors, FAQ and form; inspect console/network and git diff. Max 10 findings. Do not demand pixel-perfect cloning or copied assets. End with exact VERDICT/NEXT_ACTION lines from spec. If PASS before minimum, still return PASS; controller will continue verification rounds without artificial changes.
"@
    & codex -C $RepoRoot -a on-request -c 'approvals_reviewer="auto_review"' exec --ephemeral -o $reviewPath $codexTask
    if($LASTEXITCODE -ne 0){throw "Codex failed with exit code $LASTEXITCODE"}
    Require-File $reviewPath
    Copy-Item $reviewPath $LatestReview -Force
    $review=Get-Content $reviewPath -Raw
    if($review -match "(?m)^VERDICT:\s*PASS\s*$"){
        $lastVerdict="PASS";Write-Host "Codex PASS" -ForegroundColor Green
        if($iteration -ge $MinimumIterations){Write-Host "PASS after minimum rounds." -ForegroundColor Green;exit 0}
        Write-Host "Early PASS; continuing until round $MinimumIterations without artificial changes." -ForegroundColor DarkGreen
    } else {$lastVerdict="FAIL";Write-Host "Codex FAIL; next round goes back to Claude." -ForegroundColor Yellow}
    if($CooldownSeconds -gt 0 -and $iteration -lt $MaxIterations){Start-Sleep -Seconds $CooldownSeconds}
}
Write-Warning "Reached MaxIterations=$MaxIterations. Last verdict: $lastVerdict. Review $LatestReview"
exit 2
} finally {
    if($started -and -not $started.HasExited){try{Stop-Process -Id $started.Id -Force -ErrorAction SilentlyContinue}catch{}}
}
