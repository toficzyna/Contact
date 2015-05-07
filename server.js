var express=require('express');
var nodemailer = require("nodemailer");
var cors = require('cors');
var bodyParser  = require('body-parser');
var credentials = require('./constants').credentials;
var app=express();

//konfiguracja SMTP
var smtpTransport = nodemailer.createTransport({
    //aby umozliwic wysylanie maili z konta: https://www.google.com/settings/security/lesssecureapps
    service: "Gmail",
    //dane do logowania przekazane z osobnego modulu
    auth: credentials
});

//wywolanie funkcji body-parsera aby moc skorzystac z metody POST i dostac dostep do wyslanych parametrow
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//CORS
//zezwolnie na polaczenie miedzy domenami, niezbedne przy pracy na localhoscie, kiedy odpalam intelliJa na jednym porcie, a serwer noda na innym
app.use(cors());


/*------------------Routing ------------------------*/

app.get('/',function(req,res){
    res.sendfile('index.html');
});
app.post('/send',function(req,res){
    console.log(req.body);
    //przypisanie do zmiennej params parametrow wyslanych w metodzie post
    var params = req.body.params;
    var mailOptions={
        to : params.to,
        subject : params.subject,
        text : params.mail
    };
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
            //w przypadku bledu zwracam status 500 'The server encountered an unexpected condition which prevented it from fulfilling the request.'
            res.status(500).send("error");
        }else{
            console.log("Success!");
            res.end("sent");
        }
    });
});

/*--------------------Routing Over----------------------------*/

//odpalenie serwera na porcie 3000
app.listen(3000,function(){
    console.log("Express Started on Port 3000");
});