Bingo Informatics Style
=====

Info professors say a lot of funny things in lecture. Play while you try to pay attention during class! Node.js and Socket.io so you can have you own server for people to use during class.

Installation 
=====

```sh
git clone https://github.com/fmnguyen/info-bingo.git bingo
cd bingo 
npm install
```

##### Run the server using: 
```sh
npm start
```

Routes 
=====
The Express server automatically serves files located in /public/

##### There are two main routes:
```sh
/public/
/public/admin.html
```
Routes at the root (/public) are automatically re-directed to /public/index.html

##### Admin Password:
The password is hashed in /server.js, but in plain-text is root. Make sure to change this when you move to production! 

TODO
=====
Add a session store to save user sessions 
Save cookie data so users can easily join after disconnect

License 
=====
[MIT](https://github.com/expressjs/session/blob/master/LICENSE)