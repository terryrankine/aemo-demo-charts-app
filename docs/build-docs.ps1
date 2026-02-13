# AEMOVis Documentation Build Script
# Generates PDF and DOCX from AEMOVis-Guide.md using pandoc
# Prerequisites: pandoc, wkhtmltopdf, mmdc (mermaid-cli)

$ErrorActionPreference = "Stop"
$docsDir = $PSScriptRoot
Push-Location $docsDir

Write-Host "=== AEMOVis Documentation Build ===" -ForegroundColor Magenta
Write-Host ""

# --- Step 1: Render Mermaid diagrams ---
Write-Host "[1/3] Rendering Mermaid diagrams..." -ForegroundColor Cyan

$diagrams = @(
    @{ Input = "diagrams/architecture.mmd"; Output = "diagrams/architecture.png"; Width = 800 },
    @{ Input = "diagrams/data-pipeline.mmd"; Output = "diagrams/data-pipeline.png"; Width = 800 },
    @{ Input = "diagrams/components.mmd"; Output = "diagrams/components.png"; Width = 800 },
    @{ Input = "diagrams/nem-regions.mmd"; Output = "diagrams/nem-regions.png"; Width = 600 }
)

foreach ($d in $diagrams) {
    if (Test-Path $d.Input) {
        Write-Host "  Rendering $($d.Input)..." -ForegroundColor Gray
        mmdc -i $d.Input -o $d.Output -t neutral -w $d.Width -b transparent
    } else {
        Write-Host "  SKIP: $($d.Input) not found" -ForegroundColor Yellow
    }
}

Write-Host "  Done." -ForegroundColor Green
Write-Host ""

# --- Step 2: Generate PDF ---
Write-Host "[2/3] Generating PDF..." -ForegroundColor Cyan

pandoc AEMOVis-Guide.md `
    -o AEMOVis-Guide.pdf `
    --css aemo-style.css `
    --toc `
    --toc-depth=3 `
    --pdf-engine=wkhtmltopdf `
    --metadata title="AEMOVis - Energy Dashboard Guide" `
    --variable margin-top=25mm `
    --variable margin-bottom=25mm `
    --variable margin-left=20mm `
    --variable margin-right=20mm

if (Test-Path "AEMOVis-Guide.pdf") {
    $pdfSize = (Get-Item "AEMOVis-Guide.pdf").Length / 1MB
    Write-Host "  Created AEMOVis-Guide.pdf ($([math]::Round($pdfSize, 1)) MB)" -ForegroundColor Green
} else {
    Write-Host "  ERROR: PDF generation failed" -ForegroundColor Red
    exit 1
}

Write-Host ""

# --- Step 3: Generate DOCX ---
Write-Host "[3/3] Generating DOCX..." -ForegroundColor Cyan

pandoc AEMOVis-Guide.md `
    -o AEMOVis-Guide.docx `
    --toc `
    --toc-depth=3 `
    --metadata title="AEMOVis - Energy Dashboard Guide"

if (Test-Path "AEMOVis-Guide.docx") {
    $docxSize = (Get-Item "AEMOVis-Guide.docx").Length / 1MB
    Write-Host "  Created AEMOVis-Guide.docx ($([math]::Round($docxSize, 1)) MB)" -ForegroundColor Green
} else {
    Write-Host "  ERROR: DOCX generation failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=== Build Complete ===" -ForegroundColor Magenta
Write-Host "Outputs:" -ForegroundColor White
Write-Host "  - $docsDir\AEMOVis-Guide.pdf" -ForegroundColor White
Write-Host "  - $docsDir\AEMOVis-Guide.docx" -ForegroundColor White

Pop-Location
