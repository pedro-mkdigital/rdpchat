const { Client, List, Buttons, MessageMedia } = require('whatsapp-web.js');
const express = require('express');
const { body, validationResult } = require('express-validator');
const socketIO = require('socket.io');
const qrcode = require('qrcode');
const http = require('http');
const fs = require('fs');
const { phoneNumberFormatter } = require('./helpers/formatter');
const fileUpload = require('express-fileupload');
const axios = require('axios');
const mime = require('mime-types');

const port = process.env.PORT || 8000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(fileUpload({
  debug: true
}));

const SESSION_FILE_PATH = './whatsapp-session.json';
let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionCfg = require(SESSION_FILE_PATH);
}

app.get('/', (req, res) => {
  res.sendFile('index.html', {
    root: __dirname
  });
});

const client = new Client({
  restartOnAuthFail: true,
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process', // <- this one doesn't works in Windows
      '--disable-gpu'
    ],
  },
  session: sessionCfg
});

client.on('message', async msg => {
  if (msg.body !== null && msg.body.includes("Quero saber mais sobre a Roda da Prosperidade.")) {
    msg.reply("A RODA DA PROSPERIDADE É UM TRATAMENTO ESPIRITUAL PARA PROSPERIDADE E PROTEÇÃO, ASSIM COMO UM TRATAMENTO MÉDICO VOCÊ FAZ PARA SE CURAR, A RODA DA PROSPERIDADE FUNCIONA DA MESMA FORMA, POR ISSO QUE É ATRAVÉS DE ASSINATURA. DESSA FORMA MÃE ADÉLIA E GITANA COM A ESPIRITUALIDADE TRABALHA TODOS OS MESES PARA VOCÊ. Será realizado o envio da Apometria Sagrada Quântica, TODOS OS DIAS às 21 horas da noite durante 21 minutos, É FEITO REZA PELA VIDA DOS MEMBROS, faço limpeza energética de influências negativas, quebra de maldições, praga, inveja e olho gordo, pedindo por força e coragem para cada membro. Na área de membros do site você receberá O Decreto que é uma oração forte quântica para você fazer se quiser potencializar ainda mais o trabalho diário de Apometria Sagrada acompanhado por áudio de MATERIALIZAÇÃO DE DESEJO, um mantra especial que ajudará você a colapsar o desejo e materializa-lo com mais FACILIDADE! Você recebera a Oração Forte de Riqueza para você fazer todo dia 1° no grande dia do ritual mensal! Você terá acesso online exclusivo a vídeos PRIVADOS ou seja não são públicos, com conteúdo únicos e exclusivo, áudios e orações liberado mês a mês conforme você vai ficando na RDP, mais e mais benefícios você terá! Áudio subliminal para uso noturno com instruções, para ajudar ainda mais no seu tratamento ajudando a quebrar paradigmas e crenças limitantes que também impedem as pessoas de realizarem seu objetivos! Você vai entrar na energia do Dinheiro! Normalmente no primeiro mês as pessoas conseguem arrumar emprego, ou mudar de cargo na empresa, se trabalha com vendas, aumenta as vendas. Com o passar do tempo a Energia da boa sorte e do dinheiro começa a fazer parte da vida, dessa forma consegue coisas maiores. Você vai ganhar um Colar da Sorte feito artesanalmente para os membros da RDP, consagrado e ativo a partir do 3° mês de associado ele será enviado pra você TOTALMENTE GRATIS,frete 50 reais do Colar da Sorte, por conta do membro. Beneficio único exclusivo e extraordinário! \r\n\r\nhttps://prosperar.maeadeliaegitana.com.br/ \r\n\r\nhttpshttp://assine.maeadeliaegitana.com.br/ \r\n\r\n⏱️ As inscrições estão *ABERTAS*");
  } 
  
  else if (msg.body !== null && msg.body.includes("Gostaria de conhecer as redes sociais de Mãe Adélia e Gitana.")) {
    msg.reply("*Que ótimo, vou te enviar Agora Mesmo:*\r\n\r\nhttps://www.youtube.com/c/M%C3%A3eAdeliaegitana/videos .\r\n\r\nhttps://instagram.com/maeadeliaegitana/ \r\n\r\nhttps://instagram.com/rodadaprosperidadequantica/ \r\n\r\nhttps://facebook.com/maeadeliaegitana/ \r\n\r\nhttps://facebook.com/rodadaprosperidademagiaquantica \r\n\r\nhttps://www.facebook.com/rodadaprosperidade.");
  }
  
  else if (msg.body !== null && msg.body.includes("Como faço meu cadastro na Roda da Prosperidade?")) {
    msg.reply("PLANO STAR: R$39,90 mês https://membros.maeadeliaegitana.com.br/checkout-star/ \r\nPLANO REAL: R$59,90 mês https://membros.maeadeliaegitana.com.br/checkout-real/ \r\nPLANO VIP: R$98,90 mês https://membros.maeadeliaegitana.com.br/checkout-vip-fiel/ \r\nPlano para participar um unico mês: R$250,00 https://mpago.la/1zJsGi3");
  }
  
  else if (msg.body !== null && msg.body.includes("Gostaria de falar com um assistente, mas obrigado por tentar me ajudar.")) {

        const contact = await msg.getContact();
        setTimeout(function() {
            msg.reply(`@${contact.number}` + ' seu contato já foi encaminhado para um Assistente');  
            client.sendMessage('5531971054859@c.us','Contato Roda da Prosperidade. https://wa.me/' + `${contact.number}`);
          },1000 + Math.floor(Math.random() * 1000));
  
  }
  
  else if (msg.body !== null && msg.body.includes("Quero pagar minha mensalidade.")) {
    msg.reply("Para pagamentos no boleto clique na opção acima, falar com assistente, para pagamentos no PIX:\r\n\r\n adeliagitana@gmail.com");
  }
  
  else if (msg.body !== null) {
    let sections = [{title:'Escolha a opção desejada',rows:[{title:'1- Quero saber mais sobre a Roda da Prosperidade.', description: 'Seja membro.'},{title:'2- Gostaria de conhecer as redes sociais de Mãe Adélia e Gitana.', description: 'Conheça mais mãe Adélia e Gitana.'},{title:'3- Como faço meu cadastro na Roda da Prosperidade?', description: 'Acesse os links.'},{title:'4- Gostaria de falar com um assistente, mas obrigado por tentar me ajudar.', description: 'Clica aqui que eu transfiro para um assistente.'},{title:'5- Quero pagar minha mensalidade.', description: 'pague aqui mesmo.'}]}];
    let list = new List('😁 Olá, tudo bem? Como vai você? Escolha uma das opções abaixo para iniciarmos a nossa conversa:','CLIQUE AQUI',sections,'RODA DA PROSPERIDADE','© RDP');
    client.sendMessage(msg.from, list);
  }

});

client.initialize();

// Socket IO
io.on('connection', function(socket) {
  socket.emit('message', 'Connecting...');

  client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
    qrcode.toDataURL(qr, (err, url) => {
      socket.emit('qr', url);
      socket.emit('message', 'QR Code received, scan please!');
    });
  });

  client.on('ready', () => {
    socket.emit('ready', 'Whatsapp is ready!');
    socket.emit('message', 'Whatsapp is ready!');
  });

  client.on('authenticated', (session) => {
    socket.emit('authenticated', 'Whatsapp is authenticated!');
    socket.emit('message', 'Whatsapp is authenticated!');
    console.log('AUTHENTICATED', session);
    sessionCfg = session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function(err) {
      if (err) {
        console.error(err);
      }
    });
  });

  client.on('auth_failure', function(session) {
    socket.emit('message', 'Auth failure, restarting...');
  });

  client.on('disconnected', (reason) => {
    socket.emit('message', 'Whatsapp is disconnected!');
    fs.unlinkSync(SESSION_FILE_PATH, function(err) {
        if(err) return console.log(err);
        console.log('Session file deleted!');
    });
    client.destroy();
    client.initialize();
  });
});


const checkRegisteredNumber = async function(number) {
  const isRegistered = await client.isRegisteredUser(number);
  return isRegistered;
}

// Send message
app.post('/send-message', [
  body('number').notEmpty(),
  body('message').notEmpty(),
], async (req, res) => {
  const errors = validationResult(req).formatWith(({
    msg
  }) => {
    return msg;
  });

  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: false,
      message: errors.mapped()
    });
  }

  const number = phoneNumberFormatter(req.body.number);
  const message = req.body.message;

  const isRegisteredNumber = await checkRegisteredNumber(number);

  if (!isRegisteredNumber) {
    return res.status(422).json({
      status: false,
      message: 'The number is not registered'
    });
  }

  client.sendMessage(number, message).then(response => {
    res.status(200).json({
      status: true,
      response: response
    });
  }).catch(err => {
    res.status(500).json({
      status: false,
      response: err
    });
  });
});

// Send media
app.post('/send-media', async (req, res) => {
  const number = phoneNumberFormatter(req.body.number);
  const caption = req.body.caption;
  const fileUrl = req.body.file;

  // const media = MessageMedia.fromFilePath('./image-example.png');
  // const file = req.files.file;
  // const media = new MessageMedia(file.mimetype, file.data.toString('base64'), file.name);
  let mimetype;
  const attachment = await axios.get(fileUrl, {
    responseType: 'arraybuffer'
  }).then(response => {
    mimetype = response.headers['content-type'];
    return response.data.toString('base64');
  });

  const media = new MessageMedia(mimetype, attachment, 'Media');

  client.sendMessage(number, media, {
    caption: caption
  }).then(response => {
    res.status(200).json({
      status: true,
      response: response
    });
  }).catch(err => {
    res.status(500).json({
      status: false,
      response: err
    });
  });
});

const findGroupByName = async function(name) {
  const group = await client.getChats().then(chats => {
    return chats.find(chat => 
      chat.isGroup && chat.name.toLowerCase() == name.toLowerCase()
    );
  });
  return group;
}

// Send message to group
// You can use chatID or group name, yea!
app.post('/send-group-message', [
  body('id').custom((value, { req }) => {
    if (!value && !req.body.name) {
      throw new Error('Invalid value, you can use `id` or `name`');
    }
    return true;
  }),
  body('message').notEmpty(),
], async (req, res) => {
  const errors = validationResult(req).formatWith(({
    msg
  }) => {
    return msg;
  });

  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: false,
      message: errors.mapped()
    });
  }

  let chatId = req.body.id;
  const groupName = req.body.name;
  const message = req.body.message;

  // Find the group by name
  if (!chatId) {
    const group = await findGroupByName(groupName);
    if (!group) {
      return res.status(422).json({
        status: false,
        message: 'No group found with name: ' + groupName
      });
    }
    chatId = group.id._serialized;
  }

  client.sendMessage(chatId, message).then(response => {
    res.status(200).json({
      status: true,
      response: response
    });
  }).catch(err => {
    res.status(500).json({
      status: false,
      response: err
    });
  });
});

// Clearing message on spesific chat
app.post('/clear-message', [
  body('number').notEmpty(),
], async (req, res) => {
  const errors = validationResult(req).formatWith(({
    msg
  }) => {
    return msg;
  });

  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: false,
      message: errors.mapped()
    });
  }

  const number = phoneNumberFormatter(req.body.number);

  const isRegisteredNumber = await checkRegisteredNumber(number);

  if (!isRegisteredNumber) {
    return res.status(422).json({
      status: false,
      message: 'The number is not registered'
    });
  }

  const chat = await client.getChatById(number);
  
  chat.clearMessages().then(status => {
    res.status(200).json({
      status: true,
      response: status
    });
  }).catch(err => {
    res.status(500).json({
      status: false,
      response: err
    });
  })
});

// Send button
app.post('/send-button', [
  body('number').notEmpty(),
  body('buttonBody').notEmpty(),
  body('bt1').notEmpty(),
  body('bt2').notEmpty(),
  body('bt3').notEmpty(),
  body('buttonTitle').notEmpty(),
  body('buttonFooter').notEmpty()
  
], async (req, res) => {
  const errors = validationResult(req).formatWith(({
    msg
  }) => {
    return msg;
  });

  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: false,
      message: errors.mapped()
    });
  }

  const number = phoneNumberFormatter(req.body.number);
  const buttonBody = req.body.buttonBody;
  const bt1 = req.body.bt1;
  const bt2 = req.body.bt2;
  const bt3 = req.body.bt3;
  const buttonTitle = req.body.buttonTitle;
  const buttonFooter = req.body.buttonFooter;
  const button = new Buttons(buttonBody,[{body:bt1},{body:bt2},{body:bt3}],buttonTitle,buttonFooter);

  const isRegisteredNumber = await checkRegisteredNumber(number);

  if (!isRegisteredNumber) {
    return res.status(422).json({
      status: false,
      message: 'The number is not registered'
    });
  }

  client.sendMessage(number, button).then(response => {
    res.status(200).json({
      status: true,
      response: response
    });
  }).catch(err => {
    res.status(500).json({
      status: false,
      response: err
    });
  });
});


app.post('/send-list', [
  body('number').notEmpty(),
  body('ListItem1').notEmpty(),
  body('desc1').notEmpty(),
  body('ListItem2').notEmpty(),
  body('desc2').notEmpty(),
  body('List_body').notEmpty(),
  body('btnText').notEmpty(),
  body('Title').notEmpty(),
  body('footer').notEmpty()
  
], async (req, res) => {
  const errors = validationResult(req).formatWith(({
    msg
  }) => {
    return msg;
  });

  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: false,
      message: errors.mapped()
    });
  }

  const number = phoneNumberFormatter(req.body.number);
  const sectionTitle = req.body.sectionTitle;
  const ListItem1 = req.body.ListItem1;
  const desc1 = req.body.desc1;
  const ListItem2 = req.body.ListItem2;
  const desc2 = req.body.desc2;
  const List_body = req.body.List_body;
  const btnText = req.body.btnText;
  const Title = req.body.Title;
  const footer = req.body.footer;

  const sections = [{title:sectionTitle,rows:[{title:ListItem1, description: desc1},{title:ListItem2, description: desc2}]}];
  const list = new List(List_body,btnText,sections,Title,footer);

  const isRegisteredNumber = await checkRegisteredNumber(number);

  if (!isRegisteredNumber) {
    return res.status(422).json({
      status: false,
      message: 'The number is not registered'
    });
  }

  client.sendMessage(number, list).then(response => {
    res.status(200).json({
      status: true,
      response: response
    });
  }).catch(err => {
    res.status(500).json({
      status: false,
      response: err
    });
  });
});

server.listen(port, function() {
  console.log('App running on *: ' + port);
});
