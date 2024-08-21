import requests
import json
import os
import base64

class instanceST():
    # class constructor
    def __init__(self, urlServer):
        self.token = None
        self.urlServer = urlServer     
        self.session = None 

    # return session
    def getSession(self):
        print("Get Session")
        if self.session is None: 
           self.session = requests.session()

    # connect and generate token an session
    def connexion(self, username, password):
        print("Connexion", username, "à ",self.urlServer)
        req = requests.post(url=self.urlServer + "login", headers= {'Content-Type': 'application/json'}, data=json.dumps({"username":username,"password": password}))
        if req.status_code == 200:
            print("Connexion OK à ", self.urlServer,"\n") 
            self.token = req.json()['token']
            self.session = requests.session()
            
    # deconnection
    def log_out(self):
        print("Déconnexion de ",self.urlServer)
        req = self.session.get(url=self.urlServer + "logout")
        if req.status_code == 200:
            print("Déconnexion OK de ", self.urlServer,"\n")
            self.token = None
            self.session = None

    # return all json value from api request
    def getInfos(self, objet, options=None):
            self.getSession()
            if options is None: 
                url = "%s%s"% (self.urlServer, objet)
            else:
                url = "%s%s?$%s"% (self.urlServer, objet, options)
            print(url)
            req = self.session.get(url=url)
            return req.json()['value']

    # return Ono json value from api request
    def getOneInfo(self, objet, options=None):
        objet_json = self.getInfos(objet, options)
        if len(objet_json) == 1:
            return objet_json
        else:
            if len(objet_json) > 1:
                print("Plusieurs objets trouvé selon le filtre ->",options)
            else:
                print("Aucun objet trouvé selon le filtre ->",options)
            return -1

    # post with csv file attached
    def postCsvFile(self, fileName, datas):
        self.getSession()
        files = {
            'json': (None, json.dumps(datas), 'application/json'),
            'file': (os.path.basename(fileName), open(fileName, 'rb'), 'application/octet-stream')
        }
        headers = { 'Authorization': "Bearer {}".format(self.token) }
        return self.session.post(self.urlServer + "CreateObservations", headers=headers, files=files)

    # return list of ids
    def idList(self, objet, options=None):
        objet_json = self.getInfos(objet, "select=id")
        ids = []
        for item in objet_json:
            ids.append(item['@iot.id'])
        return ids

    # return list of ids
    def getSql(self, query):
        message_bytes = query.encode('ascii')
        encoded = base64.b64encode(message_bytes)
        self.getSession()
        url = f"{self.urlServer}/Sql?$query={encoded.decode('ascii')}"
        req = self.session.get(url)
        return req.json()[0]
        