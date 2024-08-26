The menu differs depending on the progress of the installation but the header and footer of the menu display certain states:
- Path: the installation path of the API
- The version of stean installed
- The state of stean (RUN or STOP)
- At the bottom of the menu the version of node and postgresSql
- Quit to exit installation script

<span style="white-space: pre;color:black;background:white">│Path : .            Stean : 0.9.0     RUN    │</span><br>
<span style="white-space: pre;color:white;background:black">│                                                         │</span><br>
<span style="white-space: pre;color:white;background:black">│ http://localhost:8029                         │</span><br>
<span style="white-space: pre;color:black;background:white">│Node: v16.20.2  Postgres:16.1             │</span>


- "Indicate path" or "Change path" : indicates the installation path of the api
- "Check postGis" : test the existence and the version of postGis
- "Install all" : Install stean after check if nodeJs, Postgres and pm2 are installed
- "Back to previous" : If a backup is present install it instead of actual installed stean
- "Create / Recreate run script" : create run.sh with all parameters
- "Run / Stop stean" : run or stop API
