# [STEAN](./documentation.md)

## Users :

L'utilisation des utilisateurs :

Qu'est-ce qu'un jeton **token** « bearer » ?

Un jeton « bearer » est un type de jeton inclus dans l'en-tête « Authorization » d'une requête HTTP afin d'indiquer à l'API que le client (détenteur du jeton) est autorisé à accéder aux ressources protégées. Le terme « bearer » signifie simplement « toute personne en possession de ce jeton peut accéder à la ressource ».

Les jetons Bearer sont souvent utilisés dans OAuth 2.0, JWT et d'autres systèmes d'authentification basés sur des jetons. Le jeton lui-même peut être un JWT, une clé API ou toute autre forme de jeton d'accès généré par votre serveur.

Cette clé est mise en place lors de la création du service

## Demander un token

POST http://rootApi/Login  username et password

### Dans le corps (Body)

```JS
const data = { "username": "example", "password": "surlepostit" };

fetch('http://rootApi/Login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),
}).then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
```


```PYTHON
import requests
payload = { "username": "example", "password": "surlepostit" }
r = requests.post('http://rootApi/Login', data=json.dumps(payload))
print (r.text)
```
### Dans les params

```JS
const data = { username: 'example', password: 'surlepostit' };

fetch('http://rootApi/Login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),
})
.then(response => response.json())
.then(data => {
  console.log('Success:', data);
})
.catch((error) => {
  console.error('Error:', error);
});

```

```PYTHON
import requests
payload = { "username": "example", "password": "surlepostit" }
r = requests.post('http://rootApi/Login', params=payload)
print (r.text)
```

Autorisation OK avec un status égal à 200
```JSON
{
    "message": "Login succeeded",
    "user": "stean",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoxLCJ1c2VybmFtZSI6InN0ZWFuIiwicGFzc3dvcmQiOiJzdGVhbiIsIlBEQ1VBUyI6W3RydWUsdHJ1ZSx0cnVlLHRydWUsZmFsc2UsZmFsc2VdfSwiZXhwIjoxNzc0MTc1OTQwLCJpYXQiOjE3NzQxNzIzNDB9.ux5dvx3DlFMxe_VRmNI3VcOE-d1Bm0K7p_37WCj6-xE"
}
```

Erreur d'autorisation avec un status égal à 401
```JSON
{
    "code": 401,
    "message": "Unauthorized"
}
```
## Utiliser le token

```JS
const response = await fetch(apiURL, {
    method: 'POST',
    headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${token}`, // notez Bearer avant le token
    },
    body: JSON.stringify(yourDatas)
});
```

```PYTHON
import requests
endpoint = apiURL
data = yourDatas
headers = {"Authorization": "Bearer " + token}  # notez Bearer avant le token

response = requests.post(endpoint, data=data, headers=headers)
print(response.json())
```

 

