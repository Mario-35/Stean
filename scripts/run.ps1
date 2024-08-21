$APIDEST = "api" # api folder name
$FILEAPP = ".\$APIDEST\index.js" # app path

# Function to stop stean if running
function stop_stean {
    Write-Host "node stop"
}

function start_stean {
    stop_stean
    if (Test-Path $FILEAPP) {
        Write-Host "$FILEAPP starting ..."
        $env:NODE_ENV = "production"
        nodemon -x "node $FILEAPP || copy /b $FILEAPP +,," --ignore configuration.json
    } else {
        Write-Host "$FILEAPP does not exist, can't launch app."
    }
}

start_stean
