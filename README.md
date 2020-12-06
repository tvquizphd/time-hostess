
## Install dependencies

```
curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
apt-get install -y nodejs
npm install --global yarn
```

Download and install the project.

```
git clone git@github.com:tvquizphd/time-mistress.git
yarn install
```

## Run dev server

Open development port.

```
firewall-cmd --zone=public --permanent --add-port=3000/tcp
firewall-cmd --reload
```

Run the development server.
```
yarn dev
```

## Run production server

Install dependencies

```
yarn global add pm2
apt-get install nginx -y
apt-get install certbot -y
apt-get install python3-certbot-nginx -y
```

Also enable Nginx through firewall
```
firewall-cmd --permanent --zone=public --add-service=http 
firewall-cmd --permanent --zone=public --add-service=https
firewall-cmd --reload
systemctl start nginx
```

Add the following `server_name` to `/etc/nginx/sites-available/default`:

```
server {
  server_name time-hostess.com www.time-hostess.com;
}
```

Restart nginx

```
nginx -t
systemctl restart nginx
```

Run certbot command if needing a new HTTPS certificate.

```
certbot --nginx -d "time-hostess.com" -d "www.time-hostess.com"
```

**NOTE** please backup `/etc/letsencrypt/` to save HTTPS certificate.

Set up reverse proxy for next.js by Writing the following
to the `location /` key of `/etc/nginx/sites-available/default`:

```
server {
  location / {
    # Reverse proxy for Next server
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-Host $host;
    proxy_set_header X-Forwarded-Port $server_port;
  }
}
```

Restart nginx again

```
nginx -t
systemctl restart nginx
```

After running `yarn build`, Run the production server.
```
pm2 start yarn --name "time-hostess" -- start
```

Stop with `pm2 stop time-hostess` or restart with `pm2 restart time-hostess`.

Logs are here:
```
~/.pm2/logs/time-hostess-out.log
~/.pm2/logs/time-hostess-error.log
```

## Tests

```
yarn test
```

Launches the test runner in the interactive watch mode.


See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.
