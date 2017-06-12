1、npm install
2、npm dist 或 npm prod

配置
server {
    listen		5308;
  	server_name	localhost;
    location / {
		alias /usr/local/Cellar/nginx/1.10.2_1/html/serviceh5/html/;
		index  index.html;
	}
	location /static/ {
		alias /usr/local/Cellar/nginx/1.10.2_1/html/serviceh5/static/;
	}
	location /forward {
		proxy_pass http://121.43.101.148:8901/forward-service;
		add_header Access-Control-Allow-Origin *;
		add_header Content-Type 'application/json;charset=UTF-8';
	}
}
