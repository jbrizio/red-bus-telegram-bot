const Telegraf = require('telegraf');
const Markup = require('telegraf/markup');
const Stage = require('telegraf/stage');
const Session = require('telegraf/session');
const WizardScene = require('telegraf/scenes/wizard');

const request = require('request').defaults({ jar: true });
const util = require('util');
const bot = new Telegraf(process.env.BOT_TOKEN);
const sceneName = 'obtain_balance';

function greetingMessage(ctx) {
  ctx.reply(
    `🛎 Hola ${ctx.from.first_name}, ¿En qué puedo ayudarte?`,
    Markup.inlineKeyboard([
      Markup.callbackButton('Consultar saldo tarjeta', sceneName),
    ]).extra()
  );
};

function askForCardNumber(ctx) {
  ctx.reply('¿Cuál es el número de la tarjeta?');
  return ctx.wizard.next();
};

function obtainCaptchaImage(ctx) {
  const options = {
    url: process.env.CAPTCHA_URL,
    encoding: null,
    method: 'GET'
  };

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      ctx.reply('Ahora ingrese los carácteres que visualiza aquí debajo 👇');
      ctx.replyWithPhoto({ source: body });
    } else {
      ctx.reply(listOfErrors[500],
        Markup.inlineKeyboard([
          Markup.callbackButton('Intentar nuevamente', sceneName)
        ]).extra()
      );
      return ctx.scene.leave();
    };
  };

  request(options, callback);
  ctx.wizard.state.card = ctx.message.text;
  return ctx.wizard.next();
};

const listOfErrors = {
  1: 'Captcha incorrecto',
  2: 'Tarjeta inexistente',
  3: 'Tarjeta duplicada',
  98: 'Usuario o IP temporalmente suspendido',
  99: 'Sesión de usuario inexistente',
  500: '¡Ups! Al parecer hubo un error'
};

function obtainBalanceCard(ctx) {
  ctx.wizard.state.captcha = ctx.message.text;

  const getBalance = util.promisify(request);
  const options = {
    url: `${process.env.URL}/${ctx.wizard.state.card}/${ctx.wizard.state.captcha}`,
    method: 'GET'
  };

  getBalance(options).then((data) => {
    const response = JSON.parse(data.body);
    // Validate if the response of the service returns an error code
    if (response.error > 0) throw response.error;
    ctx.reply(`El saldo es de $${response.saldos[0].saldo} 💰`,
      Markup.inlineKeyboard([
        Markup.callbackButton('Consultar otra tarjeta', sceneName)
      ]).extra()
    )
  }).catch((code) => {
    ctx.reply(listOfErrors[code],
      Markup.inlineKeyboard([
        Markup.callbackButton('Intentar nuevamente', sceneName)
      ]).extra()
    );
  });
  return ctx.scene.leave();
}

bot.start(greetingMessage);

const Wizard = new WizardScene(
  sceneName,
  askForCardNumber,
  obtainCaptchaImage,
  obtainBalanceCard
);

const stage = new Stage([Wizard], { default: sceneName });

bot.use(Session());
bot.use(stage.middleware());
bot.launch();
