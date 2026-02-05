 #/
 # Stean Install PowerShell.
 #
 # @copyright 2024-present Inrae
 # @author mario.adam@inrae.fr
 # version 0.5
 #
 #/

$APIDEST = "api" # api folder name
$CONFIGFILE = "configuration.json" 
$APIBak = "apiBak" # api saved folder name
$POSTGRES = "C:\Program Files\PostgreSQL" # postgres windows install path
$NODEJS = "C:\Program Files\nodejs" # nodeJS windows install path
$FILEAPP = ".\$APIDEST\stean.js" # app path
$FILEDIST = ".\dist.zip" # name ditrib file path
$FILERUN = ".\run.ps1" # name ditrib file path
$FILEDISTOLD = ".\distBak.zip" # name saved ditrib file

Write-Host "Installing Stean..."

# Function to install Node
function install_node {
    Write-Host "Installing Node..."
    choco install nodejs
}

# Function to save ditrib
function save_dist {
    if (Test-Path $FILEDIST) {
        if (Test-Path $FILEDISTOLD) {
            Remove-Item $FILEDISTOLD -Force
        }
        Move-Item $FILEDIST $FILEDISTOLD
    }
}

# Function to download stean ditrib
function download_stean {
    Write-Host "Downloading stean ..."
    save_dist
    Invoke-WebRequest -Uri "https://github.com/Mario-35/Stean/raw/main/builds/stean_latest.zip" -OutFile $FILEDIST
}

# Function to install stean
function install_stean {
    Write-Host "Start Install."
    # remove bak
    if (Test-Path .\$APIBak) {
        Write-Host "$APIBak exists."
        Remove-Item .\$APIBak -Recurse -Force
    } else {
        Write-Host "$APIBak Not exists."
    }
    # save actual to bak
    if (Test-Path .\$APIDEST) {
        Write-Host "$APIDEST exists."     	
        Rename-Item -Path .\$APIDEST -NewName .\$APIBak
    }
    # unzip actual
    # Expand-Archive -Path $FILEDIST -DestinationPath $APIDEST
    Expand-Archive -Path $FILEDIST -DestinationPath $APIDEST -Force
    # Save config
    if (Test-Path .\$APIBak\configuration\$CONFIGFILE) {
        Write-Host "configuration exists."
        Copy-Item .\$APIBak\configuration\$CONFIGFILE .\$APIDEST\configuration\$CONFIGFILE
    }
    # Save key
    if (Test-Path .\$APIBak\configuration\.key) {
        Write-Host "Key exists."
        Copy-Item .\$APIBak\configuration\.key .\$APIDEST\configuration\.key
    }
    save_dist
    Set-Location $APIDEST
    npm install --omit=dev
    npm install -g nodemon
    Set-Location ..
}

#------------------------------------------------------------------
#|                        START                                   |
#------------------------------------------------------------------

# Check if PostgreSQL is installed
if (Test-Path $POSTGRES) {
    $latest = Get-ChildItem -Path $POSTGRES | Sort-Object LastAccessTime -Descending | Select-Object -First 1
    if (-not ([string]::IsNullOrEmpty($latest))) {
        Write-Host "PostgreSQL is installed. ($latest)"
    } else {
        Write-Host "PostgreSQL is Not installed."
        exit
    }

    # Check if Postgis is installed
    $POSTGIS = "$latest\share\contrib"
    if (Test-Path $POSTGIS) {
        $filter = "postgis*"
        $first = Get-ChildItem -Path $POSTGIS -Filter $filter | Sort-Object LastAccessTime -Descending | Select-Object -First 1
        Write-Host "Postgis installed. ($first)"
        if (-not ([string]::IsNullOrEmpty($first)))
        {
            Write-Host "Postgis installed. ($first)"
        } else {
            Write-Host "Postgis is Not installed."
            exit
        }
    } else {
        Write-Host "Postgis is Not installed."
        exit
    }

} else {
    Write-Host "PostgreSQL is Not installed."
    exit
}

# Check if Node is installed
if (Test-Path $NODEJS) {
    Write-Host "Node is already installed."
} else {
    Write-Host "Node is Not installed."
    install_node
    exit
}

# Check if distrib is present IT use if a distrib is manualy put istead of download from repo
if (Test-Path $FILEDIST) {
    Write-Host "$FILEDIST is already present."
    while ($true) {
        $yn = Read-Host "Do you wish to use it (Y/N)"
        switch -Regex ($yn) {
            "^[Yy]" { break }
            "^[Nn]" { download_stean; break }
            default { Write-Host "Please answer yes or no." }
        }
    }
} else {
    download_stean
}

install_stean

$lines = @(
"`$APIDEST = `"api`" # api folder name",
"`$FILEAPP = `".\`$APIDEST\stean.js`" # app path",
"# Function to stop stean if running",
"function stop_stean {",
"    Write-Host `"node stop`"",
"}",
"function start_stean {",
"    stop_stean",
"    if (Test-Path `$FILEAPP) {",
"        Write-Host `"`$FILEAPP starting ...`"",
"        `$env:NODE_ENV = `"production`"",
"        nodemon -x `"node `$FILEAPP`" --ignore *.json",
"    } else {",
"        Write-Host `"`$FILEAPP does not exist, can`'t launch app.`"",
"    }",
"}",
"start_stean"

)

Set-Content -Path $FILERUN -Value $lines
