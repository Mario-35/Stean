 #/
 # Stean Bash.
 #
 # @copyright 2024-present Inrae
 # @author mario.adam@inrae.fr 
 # version 1.1
 #
 #/

clear

# Name of configs datas
CONF=.steanpath
# Name of configs saved datas
SAVEDCONF=.confs
# Name of the file downladed
FILEDIST=./dist.zip
# Name of the backup
FILEDISTOLD=./distOld.zip 
# Name of the run script
FILERUN=./run.sh
# Name of the run script
SQLSCRIPT=./script.sql
# prevent no found
STEANVER="not installed"
ACTIVE=000

# Create run script
create_run_script() {
    if [ -f $FILERUN ]; then
        rm $FILERUN
        echo "Delete => $FILERUN"
    fi
    echo "#!/bin/bash" > $FILERUN
    echo "pm2 stop index" >> $FILERUN
    echo "pm2 flush" >> $FILERUN
    echo "pm2 delete index" >> $FILERUN
    echo "echo \"API starting ...\"" >> $FILERUN
    echo "export NODE_ENV=production" >> $FILERUN
    echo "mv ./api/logs.html ./logs.bak" >> $FILERUN
    echo "pm2 start ./api/index.js" >> $FILERUN
    echo "pm2 logs --lines 500" >> $FILERUN
    sudo chmod -R 777 $FILERUN
    echo "Create script => $FILERUN"
}

# Function to check dist file
check_dist() {
    # Check if file already present and ask to use it if true
    if [ -f $FILEDIST ]; then
        echo "$FILEDIST is already present."
        while true; do
            read -p "Do you wish to use it " yn
            case $yn in
                [Yy]* ) break;;
                [Nn]* ) download_dist; break;;
                * ) echo "Please answer yes or no.";;
            esac
        done
    else
        download_dist
    fi
}

# Function to make bak 
save_dist() {
    if [ -f "$FILEDIST" ]; then
        rm -f $FILEDISTOLD
        echo "Delete => $FILEDISTOLD"
        mv $FILEDIST $FILEDISTOLD
        echo "Move $FILEDIST => $FILEDISTOLD"
    fi
}

# Function to get stean
download_dist() {
    save_dist
    sudo curl -o $FILEDIST -L https://github.com/Mario-35/Stean/raw/main/builds/stean_latest.zip
}

# Function to save configuration
save_configuration() {
    DATEFOLDER="save$(date +"%FT%H%M")"
    SAVEDCONF=$SAVEDCONF/$DATEFOLDER
    echo $SAVEDCONF
    mkdir $SAVEDCONF
    # Save config
    if [ -f ./api/configuration/configuration.json ]; then
        cp ./api/configuration/configuration.json $SAVEDCONF/
    else
        echo "No configuration file found"
    fi
    # Save key
    if [ -f ./api/configuration/.key ]; then    
        cp ./api/configuration/.key $SAVEDCONF/
    else
        echo "No key file found"
    fi
}

# Function to install stean
install_stean() {
    # save actual to bak
    if [ -f ./api ]; then
        # remove bak
        if [ -f ./apiBak ]; then
            rm -r ./apiBak
            echo "Delete => ./apiBak"
        fi
        save_configuration
        mv ./api ./apiBak
        echo "Move ./api => ./apiBak"
    fi
    # create path
    sudo mkdir -p -m 777 ./api
    echo "Create folder => ./api"
    # unzip actual
    unzip -qq -o $FILEDIST -d ./api/  
    echo "unzip $FILEDIST => ./api"
    # Save config
    if [ -f $SAVEDCONF/configuration.json ]; then
        cp $SAVEDCONF/configuration.json $./configuration/
    else
        echo "No configuration file found"        
    fi
    # Save key
    if [ -f $SAVEDCONF/.key ]; then    
        cp $SAVEDCONF/.key $./configuration/    
    else
        echo "No key file found"
    fi
    save_dist
    npm install --omit=dev --prefix ./api/
}

# Function to stop stean
stop_stean() {
    echo "API Stopping ..."
    pm2 stop index
    pm2 kill
}

# Function to run stean
run_stean() {
    echo "API starting ..."
    NODE_ENV=production
    mv ./api/logs.html ./logs.bak
    pm2 start ./api/index.js
}
cd ~
install_stean
run_stean
