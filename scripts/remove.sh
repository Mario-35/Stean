 #/
 # Stean Remove  Bash.
 #
 # @copyright 2024-present Inrae
 # @author mario.adam@inrae.fr 
 # version 1.0
 #
 #/

clear

pm2 stop start
pm2 kill
sudo npm remove pm2
sudo apt purge nodejs
sudo apt purge gnupg2 #installation
sudo apt purge postgresql-17-postgis-3 -y
sudo apt purge unzip
rm -r ./stean/
