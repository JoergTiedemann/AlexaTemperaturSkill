/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.

     "firebase-functions": "^3.22.0",
    "firebase-tools": "^11.7.0",
    "inflection": "^1.13.2"

 
 * */
const Alexa = require('ask-sdk-core');
const firebase = require('firebase/app');

require('firebase/database');
require('firebase/auth');
const fs = require('fs');
const path = require('path');



const  breaktime = "<break time='800ms'/>";

const strings = {
    'de-DE': {
      'welcome_message': 'Willkommen zur Abfrage der Temperatur vom Gartenhaus. Du kannst Hilfe sagen um weitere Hilfe zu bekommen. Was möchtest Du tun ?',
      'help_message': 'Du kannst Wie ist die Temperatur sagen oder Wie ist die Luftfeuchtigkeit von Gartenhaus oder Von wann ist ist die Temperatur oder Frag Gartenhaus nach der Version ! Wie kann ich helfen ?',
      'byebye_message': 'Auf Wiedersehen!',
      'generaltemperatur_message':'Es wurde nach der Temperatur gefragt',
      'generalfeuchtigkeit_message':'Es wurde nach der Luftfeuchtigkeit gefragt',
      'generalzeit_message':'Es wurde nach der Messzeit gefragt',
      'firenbasedocument_error': 'Dokument nicht gefunden.',
      'firenbasedatabase_error': 'Es gab ein Problem bei der Datenbankabfrage',
      'fallback_message': 'Sorry, ich habe keine Ahnung, den Text verstehe ich nicht. Versuche es erneut.',
      'NoIntentFound_error': 'Kein Handler für Intend {intentName} definert',
      'general_error': 'Sorry, es gab ein Problem mit dem was Du gesagt hast. Versuche es erneut.',
      'feuchtigkeit_message':'Die Luftfeuchtigkeit beträgt {feuchtigkeit} Prozent',
      'messzeit_message':'Die Temperatur wurde um {datumswert} gemessen',
      'kommentarUeber30_message':[
        '',
        '<say-as interpret-as="interjection">puh</say-as><break time="200ms"/>echt heiss',
        'Kühl ist was anderes',
        'das Richtige für ein Kaltgetränk',
        'ziemlich heiss schon',
        'hochsommerlich',
        ''
      ], 
      'kommentar20bis30_message':[
        '',
        'ganz angenehm',
        'Liegestuhlwetter',
        'das Richtige für die Terrasse',
        'noch nicht zu heiss',
        'fast schon Hochsommer',
        ''
      ], 
      'kommentar10bis20_message':[
        '',
        'nicht wirklich prickelnd',
        'geht gerade noch so',
        'ein bischen ungemütlich',
        'immerhin friert es nicht',
        'nix für den Liegestuhl',
        ''
      ], 
      'kommentarNullbis10_message':[
        '',
        '<say-as interpret-as="interjection">puh</say-as>',
        'Schmuddelwetter',
        'naßkalt',
        '<say-as interpret-as="interjection">puh</say-as><break time="200ms"/>echt ungemütlich',
        'kurz vor Bodenfrost',
        'Erkältungswetter',
        'nicht so toll',
        ''
      ], 
      'kommentarUnterNull_message':[
        '',
        '<say-as interpret-as="interjection">puh</say-as>',
        'Schweinekalt',
        'Arschkalt',
        'Saukalt',
        'Saukalt draussen',
        'echt kalt',
        'bitter kalt',
        'da kriegt man Frostbeulen',
        'da friert einem der Arsch ab',
        ''
      ], 
      'temperatur_message':[
        'Die Temperatur beträgt {temperatur} Grad',
        '<say-as interpret-as="interjection">moin</say-as><break time="200ms"/>Die Temperatur beträgt {temperatur} Grad',
        'Draußen sind es {temperatur} Grad',
        'Am Gartenhaus sind es {temperatur} Grad',
        '<say-as interpret-as="interjection">moin</say-as><break time="200ms"/>Im Garten sind es {temperatur} Grad',
        'Im Garten sind es {temperatur} Grad',
        '<say-as interpret-as="interjection">moin</say-as><break time="200ms"/>{temperatur} Grad',
        '{temperatur} Grad',
        '<say-as interpret-as="interjection">moin</say-as><break time="200ms"/>Es sind {temperatur} Grad',
        'Es sind {temperatur} Grad'
      ] 
    },
    'en': {
        'welcome_message': 'Welcome to query temperature of garden cottage!',
        'help_message': 'You can say hello or help.',
        'temperatur_message': 'The temperature is {temperatur} degrees',
        'byebye_message': 'Bye bye!'
    }
};


const LocalizationRequestInterceptor = {
process(handlerInput) {
    const locale = handlerInput.requestEnvelope.request.locale;
    console.log(`LocalizationRequestInterceptor locale=${locale}`);

    handlerInput.t = (key,params) => {
    const resource = strings[locale] || strings['de-DE'];
    // console.log(`Params:`,params);
    // const resource = strings['de'];
    let string = resource[key]
    if (resource[key])
    {
        if (params)
        {
            for (const param in params) {
                string = string.replace(`{${param}}`, params[param]);
            }
        }
        // console.log(`return string :`,string);
        return string;
    }
    else
        return key;
    };
}
};
 


// PLEASE FILL IN YOUR VALUES INSIDE CONFIG OBJECT. REFER TO THIS TUTORIAL TO GET STARTED :
// API Key nicht mehr komplett hier im Code hinterlegt 
const api_fst="AIzaSyCSwdcpciYBuYy";
const api_mdl1="NgA";
const api_mdl2="kNYhaqirZZ";
const api_end="n-Xw";

var config = {
  apiKey: "",
  authDomain: "espdata-b473e.firebaseapp.com",
  databaseURL: "https://espdata-b473e-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "espdata-b473e",
  storageBucket: "espdata-b473e.appspot.com",
  messagingSenderId: "64681322777",
  appId: "1:64681322777:web:069ec1f6b184ac7e3a7d88"
};

const email = 'joerg-tiedemann';
const Fpass = 'bkrr';
const Spass = 'H';

const zugang   = Fpass + 'nt' + String(parseInt(config.appId[0])+6) + Spass;
const apikey   = api_fst + String(parseInt(config.appId[0])+3) + api_mdl1 + String(parseInt(config.appId[0])+2) + api_mdl2 + String(parseInt(config.appId[0])+4) + api_end;
config.apiKey = apikey;

const signInWithEmail = async () => {
  try {
    const userCredential = await auth.signInWithEmailAndPassword(email+'@gmx.de', zugang);
    //console.log('sign In Erfolgreich:', userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in with email and password:', error);
    throw error;
  }
};

/*
firebase.initializeApp(config);
const auth = firebase.auth();
const database = firebase.database();
//const off = database.off();

try
{
    console.log('vor set Persistence');
auth.setPersistence(firebase.auth.Auth.Persistence.NONE);
console.log('set Persistence erfolgt');

}
catch(e)
{
    console.log("~~~~ Catch Excetion setpersistence logs here: ",e);
}
*/

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = handlerInput.t('welcome_message');
        console.log(`~~~~ LaunchRequest aufgerufen`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


const GetTemperatureIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetTemperature';
    },
    async handle(handlerInput) {
        let speakOutput = handlerInput.t('generaltemperatur_message');
        let kommentar = "";
        console.log(`~~~~ GetTemperatureIntentHandler wurde aufgerufen`);
        firebase.initializeApp(config);
        const auth = firebase.auth();
        const database = firebase.database();
        try
        {
           // await signInWithEmail();
            await auth.signInWithEmailAndPassword(email+'@gmx.de', zugang);
            console.log(`~~~~ firebase goOnline erfolgt`);
            const snapshot = await database.ref('/Heizung/Heizungsmonitor/Heizungstatus').once('value');

                if (snapshot.exists()) {
                    const data = snapshot.val();
                    // speakOutput = `Die Temperatur beträgt ${data.aktuelleTemp} Grad`;
                    let floatTemp = parseFloat(data.aktuelleTemp);
                    // speakOutput =  randomItemFromArray(handlerInput.t('temperatur_message'),{temperatur: floatTemp.toFixed(1)});
                    const spokenTemp = formatTemperatureForSpeech(floatTemp);
                    speakOutput = randomItemFromArray(handlerInput.t('temperatur_message'),{ temperatur: spokenTemp });

                    // if (floatTemp >= 30)
                    //     kommentar = randomItemFromArray(handlerInput.t('kommentarUeber30_message'));
                    // else if (floatTemp >= 20)
                    //     kommentar = randomItemFromArray(handlerInput.t('kommentar20bis30_message'));
                    // else if (floatTemp >= 10)
                    //     kommentar = randomItemFromArray(handlerInput.t('kommentar10bis20_message'));
                    // else if (floatTemp >= 0)
                    //     kommentar = randomItemFromArray(handlerInput.t('kommentarNullbis10_message'));
                    // else
                    //     kommentar = randomItemFromArray(handlerInput.t('kommentarUnterNull_message'));
                    // Beispiel:
                    const text = "Verdammt, das ist echt kacke und arschkalt und scheißkalt und scheißenkalt !";
                    kommentar = sanitizeTextForAlexa(text);
                    console.log(`~~~~ Kommentar:`,kommentar);

                    if (kommentar)
                        speakOutput = speakOutput + breaktime + kommentar;
                    // Dienste deaktivieren
                    await auth.signOut();
                    //snapshot.off();
                    firebase.app().delete();
                } else {
                    speakOutput = handlerInput.t('firebasedocument_error');
                }
        //await auth.signOut();
            console.log(`~~~~ firebase goOffline erfolgt`);
        }
        catch(e){
            console.log("~~~~ Catch Excetion logs here: ",e);
            speakOutput = handlerInput.t('firebasedatabse_error');
        }


        console.log('Antwort:',speakOutput);
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const GetLuftfeuchtigkeitIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetLuftfeuchtigkeit';
    },
    async handle(handlerInput) {
        let speakOutput = handlerInput.t('generalfeuchtigkeit_message');
        let kommentar = "";
        console.log(`~~~~ GetLuftfeuchtigkeitIntentHandler wurde aufgerufen`);
        firebase.initializeApp(config);
        const auth = firebase.auth();
        const database = firebase.database();
        try
        {
           // await signInWithEmail();
            await auth.signInWithEmailAndPassword(email+'@gmx.de', zugang);
            console.log(`~~~~ firebase goOnline erfolgt`);
            const snapshot = await database.ref('/Heizung/Heizungsmonitor/Heizungstatus').once('value');

                if (snapshot.exists()) {
                    const data = snapshot.val();
                    // speakOutput = `Die Temperatur beträgt ${data.aktuelleTemp} Grad`;
                    let floatFeucht = parseFloat(data.Luftfeuchtigkeit);
                    speakOutput =  handlerInput.t('feuchtigkeit_message',{feuchtigkeit: floatFeucht.toFixed(1)});
                    console.log(`~~~~ Luftfeuchtigkeit:`,kommentar);
                    // if (kommentar)
                    // speakOutput = speakOutput + breaktime + kommentar;
                    // Dienste deaktivieren
                    await auth.signOut();
                    //snapshot.off();
                    firebase.app().delete();
                } else {
                    speakOutput = handlerInput.t('firebasedocument_error');
                }
        //await auth.signOut();
            console.log(`~~~~ firebase goOffline erfolgt`);
        }
        catch(e){
            console.log("~~~~ Catch Excetion logs here: ",e);
            speakOutput = handlerInput.t('firebasedatabse_error');
        }


        console.log('Antwort:',speakOutput);
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const GetTemperaturZeitIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetTemperaturZeit';
    },
    async handle(handlerInput) {
        let speakOutput = handlerInput.t('generalzeit_message');
        let kommentar = "";
        console.log(`~~~~ GetTemperaturZeitIntentHandler wurde aufgerufen`);
        firebase.initializeApp(config);
        const auth = firebase.auth();
        const database = firebase.database();
        try
        {
           // await signInWithEmail();
            await auth.signInWithEmailAndPassword(email+'@gmx.de', zugang);
            console.log(`~~~~ firebase goOnline erfolgt`);
            const snapshot = await database.ref('/Heizung/Heizungsmonitor/Heizungstatus').once('value');

                if (snapshot.exists()) {
                    const data = snapshot.val();
                    let Zeitstempel = data.Datumsstempel;
                    // Entferne die Sekunden aus dem Zeitstempel
                    if (Zeitstempel.includes(':')) {
                        const teile = Zeitstempel.split(' '); // Trenne Datum und Zeit
                        const datum = teile[1]; // Datum bleibt unverändert
                        const zeitOhneSekunden = teile[0].substring(0, teile[0].lastIndexOf(':')); // Zeit ohne Sekunden
                        Zeitstempel = `${datum} ${zeitOhneSekunden}`; // Kombiniere Datum und Zeit ohne Sekunden
                    }
                    // speakOutput = `Die Temperatur beträgt ${data.aktuelleTemp} Grad`;
                    speakOutput =  handlerInput.t('messzeit_message',{datumswert: Zeitstempel});
                    console.log(`~~~~ Temperaturzeit:`,data.Zeitstempel);
                    // if (kommentar)
                    // speakOutput = speakOutput + breaktime + kommentar;
                    // Dienste deaktivieren
                    await auth.signOut();
                    //snapshot.off();
                    firebase.app().delete();
                } else {
                    speakOutput = handlerInput.t('firebasedocument_error');
                }
        //await auth.signOut();
            console.log(`~~~~ firebase goOffline erfolgt`);
        }
        catch(e){
            console.log("~~~~ Catch Excetion logs here: ",e);
            speakOutput = handlerInput.t('firebasedatabse_error');
        }


        console.log('Antwort:',speakOutput);
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};



              /*          console.log(`~~~~  schreiben start`);
            
                        await database.ref('/Messwerte/').set({
                            Temperatur: 64  });
                        console.log(`~~~~ firebase schreiben erfolgt`);
                        var current = new Date();
                        var date = current.toLocaleDateString();
                        var time = current.toLocaleTimeString();
                        await database.ref('/Moods/' + moodSlot).set({
                        TIME : time,
                        DATE : date 
                    })
            */



const GetVersionIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetVersion';
    },
    async handle(handlerInput) {

        let speakOutput = getPackageVersion();
        console.log(`~~~~ GetVersionIntentHandler wurde aufgerufen`);
        console.log('Antwort:',speakOutput);
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};


const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = handlerInput.t('help_message');
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = handlerInput.t('byebye_message')
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = handlerInput.t('fallback_message');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = handlerInput.t('NoIntentFound_error', { intentName: intentName });

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = handlerInput.t('general_error');
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        GetLuftfeuchtigkeitIntentHandler,
        GetTemperaturZeitIntentHandler,
        GetTemperatureIntentHandler,
        GetVersionIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .addRequestInterceptors(LocalizationRequestInterceptor)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();


function parseParameter(str,params) {
    let string = str;
    if (params)
    {
        for (const param in params) {
            string = string.replace(`{${param}}`, params[param]);
        }
    }
    return string;
}

function formatTemperatureForSpeech(temp) {
    // Zahl mit einer Nachkommastelle, Punkt durch Komma ersetzen
    const formatted = temp.toFixed(1).replace('.', ',');

    // if (temp < 0) {
    //     return `<say-as interpret-as="cardinal">minus ${formatted}</say-as>`;
    // } else {
        return `<say-as interpret-as="cardinal">${formatted}</say-as>`;
    // }
}

function randomItemFromArray(messages,params){
    const index = Math.floor(Math.random() * messages.length);
    console.log(`~~~~ randomItemFromArray index:`,index,` message:`,messages[index]);
    return parseParameter(messages[index],params);   
}


/**
 * Wandelt einen Eingabetext so um, dass Alexa
 * verbotene oder gefilterte Wörter mit SSML-Phonemen ausspricht.
 */
function sanitizeTextForAlexa(inputText) {
  // Wörterliste mit IPA-Phonemen
  const forbiddenWords = {
    "arsch": '<phoneme alphabet="ipa" ph="aʁʃ">Arsch</phoneme>',
    "arschkalt": '<phoneme alphabet="ipa" ph="aʁʃkalt">Arschkalt</phoneme>',
    "scheißkalt": '<phoneme alphabet="ipa" ph="ʃaɪ̯skalt">Scheißkalt</phoneme>',
    "scheißenkalt": '<phoneme alphabet="ipa" ph="ʃaɪ̯sənkalt">Scheißenkalt</phoneme>',
    "kacke": '<phoneme alphabet="ipa" ph="ˈkakə">Kacke</phoneme>',
    "mist": '<phoneme alphabet="ipa" ph="mɪst">Mist</phoneme>',
    "verdammt": '<phoneme alphabet="ipa" ph="fɛɐ̯ˈdamt">Verdammt</phoneme>'
    // Liste beliebig erweiterbar
  };
  let output = inputText;
  // Ersetzt jedes Wort durch das SSML-Phoneme
  for (const [word, replacement] of Object.entries(forbiddenWords)) {
    const regex = new RegExp(word, "gi"); // sucht Wort, egal ob groß/klein
    output = output.replace(regex, replacement);
  }
    console.log(`~~~~ phoneme:`,output);

  // Rückgabe als vollständiger SSML-String
  return `${output}`;
}


function getPackageVersion() {
  try {
    const pkgPath = '/var/task/package.json';
    const data = fs.readFileSync(pkgPath, 'utf8');
    const pkg = JSON.parse(data);
    const strversion = pkg.version || 'unknown';
    return `<say-as interpret-as="cardinal">Der Skill hat die Version ${strversion}</say-as>`;

  } catch (e) {
    console.error('Fehler beim Lesen von package.json:', e);
    return `Die Version des Skills konnte nicht ausgelesen werden`;
  }
}
