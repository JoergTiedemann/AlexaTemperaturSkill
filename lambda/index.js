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

// PLEASE FILL IN YOUR VALUES INSIDE CONFIG OBJECT. REFER TO THIS TUTORIAL TO GET STARTED : 

var config = {
  apiKey: "AIzaSyCSwdcpciYBuYy4NgA3kNYhaqirZZ5n-Xw",
  authDomain: "espdata-b473e.firebaseapp.com",
  databaseURL: "https://espdata-b473e-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "espdata-b473e",
  storageBucket: "espdata-b473e.appspot.com",
  messagingSenderId: "64681322777",
  appId: "1:64681322777:web:069ec1f6b184ac7e3a7d88"
};

const email = 'joerg-tiedemann@gmx.de';
const password = 'bkrrnt7H';


const signInWithEmail = async () => {
  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
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
        const speakOutput = 'Willkommen, Du kannst Hallo oder Hilfe sagen. Was möchtest Du tun ?';
        console.log(`~~~~ LaunchRequest aufgerufen`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloWorldIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Hallo welt wie gehts dir';
      console.log(`~~~~ Handler Hallo Welt wurde aufgerufen`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const GetTemperatureIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetTemperature';
    },
    async handle(handlerInput) {
        let speakOutput = 'Es wurde nach der Temperatur gefragt';
        console.log(`~~~~ GetTemperatureIntentHandler wurde aufgerufen`);
/*
        try
        {
            await signInWithEmail();
            console.log(`~~~~ firebase goOnline erfolgt`);
            const dbRef = database.ref();
            
            await dbRef.child('/Heizung/Heizungsmonitor/Heizungstatus/aktuelleTemp/').get().then((snapshot) => {
                if (snapshot.exists()) {
                console.log('~~~~~ der Wert ist:',snapshot.val());
                speakOutput = `Die Temperatur beträgt ${snapshot.val()} Grad `;

                } else {
                    console.log("No data available");
                }
            }).catch((error) => {
                console.error(error);
                });

        
        await auth.signOut();
            console.log(`~~~~ firebase goOffline erfolgt`);
        }
        catch(e){
            console.log("~~~~ Catch Excetion logs here: ",e);
            speakOutput = `Es gab ein Problem bei der Datenbankabfrage`
        }
*/

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


const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Du kannst Hallo oder Hilfe sagen! Wie kann ich helfen?';

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
        const speakOutput = 'Auf Wiedersehen!';

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
        const speakOutput = 'Sorry, davon habe ich keinen Ahnung. Versuche es erneut.';

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
        const speakOutput = `You just triggered ${intentName}`;

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
        const speakOutput = 'Sorry, I es gab ein Problem mit dem was Du gesagt hast. Versuche es erneut.';
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
        HelloWorldIntentHandler,
        GetTemperatureIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();