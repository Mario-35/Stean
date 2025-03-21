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
    echo "mv $APIDEST/api/logs.html $APIDEST/logs.bak" >> $FILERUN
    echo "pm2 start $APIDEST/api/index.js" >> $FILERUN
    echo "pm2 logs --lines 500" >> $FILERUN
    chmod -R 777 $FILERUN
    echo "Create script => $FILERUN"
}

# Function to show logo
logo() {
    check_stean
    echo ""
    echo -e "\e[32m  ____ __________   _     _   _ \e[0m"
    echo -e "\e[32m / ___|_ __  ____| / \   | \ | |\e[0m"
    echo -e "\e[32m \___ \| | |  _|  / _ \  |  \| |\e[0m"
    echo -e "\e[32m  ___) | | | |___/ ___ \ | |\  |\e[0m"
    echo -e "\e[32m |____/|_| |______/   \_\|_| \_|   \e[34m$STEANVER\e[0m"
    echo ""
}

# Function to check Node and install it if not
check_stean() {
    # load configuration
    if [ -f $CONF ]; then
        read APIDEST < $CONF
        APIDEST=$(echo "$APIDEST" | sed 's:/*$::')
    fi

    # Del configuration file if blank
    if [ -z "${APIDEST}" ]; then
        if [ -f $CONF ]; then
            rm .steanpath
            echo "Delete => .steanpath cause is blank"
        fi
    fi

    # Stean version
    if [ -f $APIDEST/api/package.json ]; then
        STEANVER=$(cat $APIDEST/api/package.json \
        | grep version \
        | head -1 \
        | awk -F: '{ print $2 }' \
        | sed 's/[",]//g')
    fi
}

# Function to check Node and install it if not
check_node() {
    if ! command -v node > /dev/null
    then
        echo "Installing Node..."
        curl -fsSL https://deb.nodesource.com/setup_20.x | -E bash -
        apt install nodejs
        NODEVER=$(node -v) 
    else
        NODEVER=$(node -v) 
    fi    
}

# Function to check PostgreSQL-postgis and install it if not
check_pg() {
    if ! psql --version | grep -q "psql (PostgreSQL)"; then
        echo "Installing postgresql-postgis ..."
        echo "deb https://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list
        wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add - 
        echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" | tee /etc/apt/sources.list.d/pgdg.list 
        apt update
        apt install postgis postgresql-17-postgis-3  -y
            if ! psql --version | grep -q "psql (PostgreSQL)"; then
            exit
        fi
        -i -u postgres psql -c "SELECT PostGIS_version();"    
        -i -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres';"    
        -i -u postgres psql -c "CREATE USER stean WITH PASSWORD 'stean';"    
        update_pg_hba
        PGVER=$(psql --version)
    else
        PGVER=$(psql --version)
    fi  
}

# Function to create PostgreSQL default postcres user
update_pg_hba() {
    SQLPATH=/etc/postgresql/14/main/pg_hba.conf
    cp $SQLPATH $SQLPATH.bak
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
    psql -U postgres -f $SQLSCRIPT
    rm $SQLSCRIP
}

# Function to check pm2 and install it if not
check_pm2() {
    if ! command -v pm2 > /dev/null
    then
        echo "Installing pm2..."
        npm install pm2@latest -g
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
        apt-get install unzip
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
    curl -o $FILEDIST -L https://github.com/Mario-35/Stean/raw/main/builds/stean_latest.zip
}

# Function to save configuration
save_configuration() {
    DATEFOLDER="save$(date +"%FT%H%M")"
    SAVEDCONF=$SAVEDCONF/$DATEFOLDER
    echo $SAVEDCONF
    mkdir $SAVEDCONF
    # Save config
    if [ -f $APIDEST/api/configuration/configuration.json ]; then
        cp $APIDEST/api/configuration/configuration.json $SAVEDCONF/
    else
        echo "No configuration file found"
    fi
    # Save key
    if [ -f $APIDEST/api/configuration/.key ]; then    
        cp $APIDEST/api/configuration/.key $SAVEDCONF/
    else
        echo "No key file found"
    fi
}

# Function to install stean
install_stean() {
    # save actual to bak
    if [ -f $APIDEST/api ]; then
        # remove bak
        if [ -f $APIDEST/apiBak ]; then
            rm -r $APIDEST/apiBak
            echo "Delete => $APIDEST/apiBak"
        fi
        save_configuration
        mv $APIDEST/api $APIDEST/apiBak
        echo "Move $APIDEST/api => $APIDEST/apiBak"
    fi
    # create path
    mkdir -p -m 777 $APIDEST/api
    echo "Create folder => $APIDEST/api"
    # unzip actual
    unzip -qq -o $FILEDIST -d $APIDEST/api/  
    echo "unzip $FILEDIST => $APIDEST/api"
    # Save config
    if [ -f $SAVEDCONF/configuration.json ]; then
        cp $SAVEDCONF/configuration.json $$APIDEST/configuration/
    else
        echo "No configuration file found"        
    fi
    # Save key
    if [ -f $SAVEDCONF/.key ]; then    
        cp $SAVEDCONF/.key $$APIDEST/configuration/    
    else
        echo "No key file found"
    fi
    save_dist
    npm install --omit=dev --prefix $APIDEST/api/
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
    mv $APIDEST/api/logs.html $APIDEST/logs.bak
    pm2 start $APIDEST/api/index.js
}

create_configuration_json() {    
    read -p "Enter the postgres host [localhost]: " host;
    host=${host:-localhost}
    read -p "Enter ADMIN postgres username [postgres]: " user;
    user=${user:-postgres}
    read -p "Enter ADMIN postgres password [postgres]: "$'\n' -s password;
    password=${password:-postgres}
    read -n 4 -p "Enter postgres port [5432]: " port;
    port=${port:-5432}
    read -n 4 -p "Enter http port [8029]: " http;
    http=${http:-8029}
    read -n 4 -p "Enter tcp port [9000]: " tcp;
    tcp=${tcp:-9000}
    read -n 4 -p "Enter ws port [1883]: " ws;
    ws=${ws:-1883}
    echo "{" > $FILECFG
    echo "  \"admin\": {" >> $FILECFG
    echo "      \"name\": \"admin\"," >> $FILECFG
    echo "      \"ports\": {" >> $FILECFG
    echo "          \"http\": $http," >> $FILECFG
    echo "          \"tcp\": $tcp," >> $FILECFG
    echo "          \"ws\": $ws" >> $FILECFG
    echo "      }," >> $FILECFG
    echo "      \"pg\": {" >> $FILECFG
    echo "          \"host\": \"$host\"," >> $FILECFG
    echo "          \"port\": $port," >> $FILECFG
    echo "          \"user\": \"$user\"," >> $FILECFG
    echo "          \"password\": \"$password\"," >> $FILECFG
    echo "          \"database\": \"postgres\"," >> $FILECFG
    echo "          \"retry\": 2" >> $FILECFG
    echo "      }," >> $FILECFG
    echo "      \"apiVersion\": \"v1.1\"," >> $FILECFG
    echo "      \"date_format\": \"DD/MM/YYYY hh:mi:ss\"," >> $FILECFG
    echo "      \"nb_page\": 200," >> $FILECFG
    echo "      \"alias\": [" >> $FILECFG
    echo "          \"\"" >> $FILECFG
    echo "      ]," >> $FILECFG
    echo "      \"extensions\": [" >> $FILECFG
    echo "          \"base\"" >> $FILECFG
    echo "      ]," >> $FILECFG
    echo "      \"options\": []    " >> $FILECFG
    echo "  }" >> $FILECFG
    echo "}" >> $FILECFG
}

selectOption() {
    case "${options[${1}]}" in
        "Indicate path")
            echo "┌───────────────────────────────────────────────────────────────┐"
            echo "│                     STEAN folder Install                      │"
            echo "└───────────────────────────────────────────────────────────────┘"
            read -p "Enter the path to install api (/var/www/stean) [./]: " APIDEST;
            echo $APIDEST > .steanpath;
            ;;
        "Change path")
            echo "┌───────────────────────────────────────────────────────────────┐"
            echo "│                Change STEAN folder Install                    │"
            echo "└───────────────────────────────────────────────────────────────┘"
            read -p "Enter the new path to install api (/var/www/stean) [./]: " APIDEST
            echo $APIDEST > .steanpath
            ;;
        "Install all")
            echo "┌───────────────────────────────────────────────────────────────┐"
            echo "│                         STEAN Install                         │"
            echo "└───────────────────────────────────────────────────────────────┘"
            check_pg;
            check_node;
            check_pm2;
            check_unzip;
            check_dist;
            stop_stean;
            install_stean;
            create_run_script;
            logo;
            echo -e "\e[35m Execute \e[38m .\run.sh \e[0m"
            ;;
        "Update stean")
            echo "┌───────────────────────────────────────────────────────────────┐"
            echo "│                         STEAN Update                          │"
            echo "└───────────────────────────────────────────────────────────────┘"
            check_dist
            stop_stean
            install_stean
            logo;
            echo -e "\e[35m Execute \e[38m .\run.sh \e[0m"
            exit
            ;;
        "Back to previous")
            echo "┌───────────────────────────────────────────────────────────────┐"
            echo "│                         STEAN Go Back                         │"
            echo "└───────────────────────────────────────────────────────────────┘"        
            stop_stean
            rm -r $APIDEST/api
            mv $APIDEST/apiBak $APIDEST/api
            ;;
        "Create run script")
            echo "┌───────────────────────────────────────────────────────────────┐"
            echo "│                       Create Run script                       │"
            echo "└───────────────────────────────────────────────────────────────┘"         
            create_run_script          
            ;;
        "Recreate run script")
            echo "┌───────────────────────────────────────────────────────────────┐"
            echo "│                      Recreate Run script                      │"
            echo "└───────────────────────────────────────────────────────────────┘"         
            create_run_script          
            ;;            
        "Run stean")
            echo "┌───────────────────────────────────────────────────────────────┐"
            echo "│                           STEAN Run                           │"
            echo "└───────────────────────────────────────────────────────────────┘"
            stop_stean            
            run_stean
            ;;
        "Stop stean")
            echo "┌───────────────────────────────────────────────────────────────┐"
            echo "│                           STEAN Stop                          │"
            echo "└───────────────────────────────────────────────────────────────┘"
            stop_stean
            ;;
        "Check postGis")
            echo "┌───────────────────────────────────────────────────────────────┐"
            echo "│                         Check postGis                         │"
            echo "└───────────────────────────────────────────────────────────────┘"
            -i -u postgres psql -c "create extension postgis;"
            -i -u postgres psql -c "SELECT PostGIS_version();"
            ;;
        "Create blank configuration")
            echo "┌───────────────────────────────────────────────────────────────┐"
            echo "│                     create configuration                      │"
            echo "└───────────────────────────────────────────────────────────────┘"
            create_configuration_json
            ;;
        "Save configuration")
            echo "┌───────────────────────────────────────────────────────────────┐"
            echo "│                      Save configuration                       │"
            echo "└───────────────────────────────────────────────────────────────┘"
            save_configuration
            ;;            
        "Decode configuration")
            echo "┌───────────────────────────────────────────────────────────────┐"
            echo "│                     Decode configuration                      │"
            echo "└───────────────────────────────────────────────────────────────┘"
            node ./api/configuration/decode.js >configuration.json
            ;;
        "Quit")
            exit
            ;;
        *) echo "invalid option $options[${1}]";;
    esac

}

infos() {
    check_stean   
    check_node
    check_pg
    check_pm2
    FILECFG=$APIDEST/api/configuration/configuration.json
    if [ -f $FILECFG ]; then
        PORT=$(grep -Po '"http":.*?[^\\],' $FILECFG | grep -o -E "[0-9]+")
        URL="http://localhost:$PORT"
        ACTIVE=$(curl -s -o /dev/null -w "%{http_code}" $URL/v1.1/)
    else 
        URL="http://localhost:8029"       
    fi 
    # Dtermine options menu
    if [ -f $APIDEST/api/index.js ]; then
            options=("Change path" "Update stean");
            if [ -f $APIDEST/apiBak/index.js ]; then 
                options+=("Back to previous");
            fi
            if [ -f $FILERUN ]; then
                    options+=('Recreate run script')
                else
                    options+=('Create run script')
            fi
            
            if [[ "$ACTIVE" == "000" ]]; then
                    options+=('Run stean')
                else
                    options+=('Stop stean')
            fi            
        else
            if [ -f .steanpath ]; then
                    options=("Change path" "Install all")
                else 
                    options=("Indicate path")
            fi
            options+=('Check postGis')
    fi

    if [[ "$STEANVER" != "not installed" ]]; then
        if [ -f $FILECFG ]; then
                options+=('Save configuration')
            else 
                options+=("Create blank configuration")
        fi    
    fi    
    options+=('Quit')
    NBOPTIONS=${#options[@]};
    LM="$(($NBOPTIONS - 1))";
}

infos;
# ┌───────────────────────────────────────────────────────────────┐
# │                           START MENU                          │
# └───────────────────────────────────────────────────────────────┘
    E='echo -e';
    e='echo -en';
    trap "R;exit" 2
    ESC=$( $e "\e");
    TPUT() { 
        $e "\e[${1};${2}H";
    }
    CLEAR() { 
        $e "\ec";
    }
    CIVIS() {
        $e "\e[?25l";
    }
    DRAW() {
        $e "\e%@\e(0";
    }
    WRITE() {
        $e "\e(B";
    }
    MARK() {
        $e "\e[7m";
    }
    UNMARK() {
        $e "\e[27m";
    }
    R() { 
        CLEAR ;
        stty sane;
        $e "\ec\e[37;44m\e[J";
    };
    HEAD() { 
        DRAW;
        for each in $(seq 1 "$((NBOPTIONS + 5))");do
           $E "   x                                          x"
        done
        WRITE;
        MARK;
        TPUT 1 5
        $E "Path :              Stean :               ";
        TPUT  0 12; $e $APIDEST; 
        TPUT  0 33; $e $STEANVER;
        if [[ "$STEANVER" != "not installed" ]]; then
            if [[ "$ACTIVE" == "000" ]]; 
                then
                    TPUT  0 42; $e "STOP"; 
                else
                    TPUT  0 42; $e "RUN"; 
            fi
        fi
        UNMARK;
    }        
    FOOT() {
        if [[ "$STEANVER" != "not installed" ]]; then
            TPUT  "$((NBOPTIONS + 4))" 8; $e $URL;
        fi
        MARK;
        TPUT "$((NBOPTIONS + 5))" 5
        printf "Node:           Postgres:                 "; 
        TPUT  "$((NBOPTIONS + 5))" 11; $e $NODEVER ;
        TPUT  "$((NBOPTIONS + 5))" 30; $e "${PGVER:18:5}";
        UNMARK;
    }          
    ARROW() {
        read -s -n3 key 2>/dev/null >&2
        if [[ $key = $ESC[A ]];then echo up;fi
        if [[ $key = $ESC[B ]];then echo dn;fi;
    }
    # Menu functions
    M0() { TPUT  3 8; $e "${options[0]}"; }
    M1() { TPUT  4 8; $e "${options[1]}"; }
    M2() { TPUT  5 8; $e "${options[2]}"; }
    M3() { TPUT  6 8; $e "${options[3]}"; }
    M4() { TPUT  7 8; $e "${options[4]}"; }
    M5() { TPUT  8 8; $e "${options[5]}"; }
    M6() { TPUT  9 8; $e "${options[6]}"; }
    M7() { TPUT 10 8; $e "${options[7]}"; }
    M8() { TPUT 11 8; $e "${options[8]}"; }
    M9() { TPUT 12 8; $e "${options[9]}"; }

    MENU() { 
        for each in $(seq 0 $LM);
        do 
            M${each};
        done;
    }

    POS() { 
        if [[ $cur == esc ]];then exit;fi
        if [[ $cur == up ]];then ((i--));fi
        if [[ $cur == dn ]];then ((i++));fi
        if [[ $i -lt 0   ]];then i=$LM;fi
        if [[ $i -gt $LM ]];then i=0;fi;
    }

    REFRESH() {
        after=$((i+1)); 
        before=$((i-1));
        if [[ $before -lt 0 ]];
        then 
            before=$LM;
        fi
        if [[ $after -gt $LM ]];
        then 
            after=0;
        fi
        if [[ $j -lt $i ]];
        then 
            UNMARK;
            M$before;
        else 
            UNMARK;
            M$after;
        fi
        if [[ $after -eq 0 ]] || [ $before -eq $LM ];
        then
           UNMARK; 
           M$before; 
           M$after;
        fi;
        j=$i;
        UNMARK;
        M$before;
        M$after;
    }

    INIT() { 
        infos;
        R;
        HEAD;
        FOOT;
        MENU;
    }

    SC() { 
        REFRESH;
        MARK;
        $S;
        $b;
        cur=`ARROW`;
    }

    ES() { 
        MARK;
        $e "space = main menu ";
        $b;
        read -r -s -d ' '
        INIT;
    };

    i=0; 
    CLEAR;
    CIVIS;
    NULL=/dev/null
    INIT;
    while [[ "$O" != " " ]]; do 
        case $i in
            0) S=M0;SC;if [[ $cur == "" ]];then R;selectOption 0;INIT;fi;;
            1) S=M1;SC;if [[ $cur == "" ]];then R;selectOption 1;ES;fi;;
            2) S=M2;SC;if [[ $cur == "" ]];then R;selectOption 2;ES;fi;;
            3) S=M3;SC;if [[ $cur == "" ]];then R;selectOption 3;ES;fi;;
            4) S=M4;SC;if [[ $cur == "" ]];then R;selectOption 4;ES;fi;;
            5) S=M5;SC;if [[ $cur == "" ]];then R;selectOption 5;ES;fi;;
            6) S=M6;SC;if [[ $cur == "" ]];then R;selectOption 6;ES;fi;;
            7) S=M7;SC;if [[ $cur == "" ]];then R;selectOption 7;ES;fi;;
            8) S=M8;SC;if [[ $cur == "" ]];then R;selectOption 8;ES;fi;;
            9) S=M9;SC;if [[ $cur == "" ]];then R;selectOption 9;fi;;
        esac;
        POS;
    done
