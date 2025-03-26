 #/
 # Stean Bash.
 #
 # @copyright 2024-present Inrae
 # @author mario.adam@inrae.fr 
 # version 1.1
 #
 #/

clear

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

# Create run script
create_run_script() {
    if [ -f $FILERUN ]; then
        rm $FILERUN
        echo "Delete => $FILERUN"
    fi
    echo "#!/bin/bash" > $FILERUN
    echo "pm2 stop stean" >> $FILERUN
    echo "pm2 flush" >> $FILERUN
    echo "pm2 delete stean" >> $FILERUN
    echo "echo \"API starting ...\"" >> $FILERUN
    echo "export NODE_ENV=production" >> $FILERUN
    echo "pm2 start ./stean/stean.js" >> $FILERUN
    echo "pm2 logs --lines 500" >> $FILERUN
    sudo chmod -R 777 $FILERUN
    echo "Create script => $FILERUN"
}

# Function to check Node and install it if not
check_version() {
    # Stean version
    if [ -f ./stean/package.json ]; then
        STEANVER=$(cat ./stean/package.json \
        | grep version \
        | head -1 \
        | awk -F: '{ print $2 }' \
        | sed 's/[",]//g')
    fi
}

# Function to show logo
logo() {
    check_version
    echo ""
    echo -e "\e[32m  ____ __________   _     _   _ \e[0m"
    echo -e "\e[32m / ___|_ __  ____| / \   | \ | |\e[0m"
    echo -e "\e[32m \___ \| | |  _|  / _ \  |  \| |\e[0m"
    echo -e "\e[32m  ___) | | | |___/ ___ \ | |\  |\e[0m"
    echo -e "\e[32m |____/|_| |______/   \_\|_| \_|   \e[34m$STEANVER\e[0m"
    echo ""
}

# Function to check Node and install it if not
check_node() {
    if ! command -v node > /dev/null
    then
        echo "Installing Node..."
        sudo  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
        sudo apt install nodejs
        NODEVER=$(node -v) 
    else
        NODEVER=$(node -v) 
    fi    
}

# Function to check PostgreSQL-postgis and install it if not
check_gnupg() {
    if which gpg >/dev/null; then 
        echo "gnupg2 Installed"
    else
        echo "gnupg2 Not installed" #If not installed
        echo "gnupg2 Installing..."
        sudo apt install gnupg2 #installation
    fi
}

# Function to check PostgreSQL-postgis and install it if not
check_pg() {
    if ! psql --version | grep -q "psql (PostgreSQL)"; then
        echo "Installing postgresql-postgis ..."
        sudo install -d /usr/share/postgresql-common/pgdg
        sudo curl -o /usr/share/postgresql-common/pgdg/apt.postgresql.org.asc --fail https://www.postgresql.org/media/keys/ACCC4CF8.asc
        sudo sh -c 'echo "deb [signed-by=/usr/share/postgresql-common/pgdg/apt.postgresql.org.asc] https://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
        sudo apt update
        sudo apt install postgis postgresql-17-postgis-3 -y
            if ! psql --version | grep -q "psql (PostgreSQL)"; then
            exit
        fi
        sudo -i -u postgres psql -c "SELECT PostGIS_version();"    
        sudo -i -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres';"    
        sudo -i -u postgres psql -c "CREATE USER stean WITH PASSWORD 'stean';"    
        update_pg_hba
        PGVER=$(psql --version)
    else
        PGVER=$(psql --version)
    fi  
}

# Function to create PostgreSQL default postcres user
update_pg_hba() {
    SQLPATH=/etc/postgresql/14/main/pg_hba.conf
    sudo cp $SQLPATH $SQLPATH.bak
    if [ -f $SQLSCRIPT ]; then
        echo "rm $SQLSCRIPT"
        rm $SQLSCRIPT
        echo "Delete => $SQLSCRIPT"
    fi
    echo "create table hba ( lines text );" > $SQLSCRIPT
    echo "hba from ($SQLPATH);" >> $SQLSCRIPT
    echo "insert into hba (lines) values ('host    all             all             0.0.0.0/0            md5');" >> $SQLSCRIPT
    echo "insert into hba (lines) values ('listen_addresses = ''*''');" >> $SQLSCRIPT
    echo "copy hba to '$SQLPATH';" >> $SQLSCRIPT
    echo "select pg_infos_conf();" >> $SQLSCRIPT
    sudo psql -U postgres -f $SQLSCRIPT
    rm $SQLSCRIP
}

# Function to check pm2 and install it if not
check_pm2() {
    if ! command -v pm2 > /dev/null
    then
        echo "Installing pm2..."
        sudo npm install pm2@latest -g
        PM2VER=$(pm2 -v) 
    else
        PM2VER=$(pm2 -v) 
    fi    
}

# Function to check unzip and install it if not
check_unzip() {
    if ! command -v unzip > /dev/null
    then
        echo "Installing unzip..."
        sudo apt-get install unzip
    else
        echo "unzip is already installed."
    fi
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
    if [ -f ./stean ]; then
        # remove bak
        if [ -f ./steanBak ]; then
            rm -r ./steanBak
            echo "Delete => ./steanBak"
        fi
        save_configuration
        mv ./stean ./steanBak
        echo "Move ./stean => ./steanBak"
    fi
    # create path
    # unzip actual
    echo "Create folder => ."
    sudo mkdir -p -m 777 ./stean
    echo "Create folder => ./stean"
    unzip -qq -o $FILEDIST -d ./stean
    echo "unzip $FILEDIST => ./stean"
    # Save config
    if [ -f $SAVEDCONF/configuration.json ]; then
        cp $SAVEDCONF/configuration.json $./stean/server/configuration/
    else
        echo "No configuration file found"        
    fi
    # Save key
    if [ -f $SAVEDCONF/.key ]; then    
        cp $SAVEDCONF/.key $./stean/server/configuration/    
    else
        echo "No key file found"
    fi
    save_dist
    npm install --omit=dev --prefix ./stean/
}

# Function to stop stean
stop_stean() {
    echo "API Stopping ..."
    pm2 stop start
    pm2 kill
}

# Function to run stean
run_stean() {
    echo "API starting ..."
    NODE_ENV=production
    pm2 start ./stean/start.js
}

check_gnupg;
check_pg;
check_node;
check_pm2;
check_unzip;
check_dist
stop_stean
install_stean
create_run_script;
logo;

