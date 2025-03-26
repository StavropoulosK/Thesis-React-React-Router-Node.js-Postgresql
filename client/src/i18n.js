import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';


const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const delayedHttpBackend = {
  type: 'backend',
  read: async (language, namespace, callback) => {
    // Simulate a delay (for example, 3 seconds)
    await delay(3000);

    // Use the default HttpBackend to fetch the translation file after the delay
    const url = `/locales/${language}/${namespace}.json`;

    fetch(url)
      .then(response => response.json())
      .then(data => callback(null, data))
      .catch(error => callback(error, null));
  }
};

i18n
  .use(HttpBackend)         //HttpBackend
  .use(initReactI18next) // For React integration
  .init({
    debug:true,
    lng:"el",
    fallbackLng:'el',
    partialBundledLanguages: true,
    ns: [],
    react: {
      // wait: true,useSuspense: false 
    },
  //   resources:{
  //       en:{
  //         translation:{
  //           greeting:"Hello, welcome! {{variableName}}"                    //   <span className="welcomeText">{t("greeting",{variableName:"Alex"})}</span>

  //         }

  //       },
  //       el:{
  //         translation:{
  //           greeting:"Για σας"
  //       }
  //   }
  // },
  backend: {
    loadPath: '/locales/{{lng}}/{{ns}}.json', // Path pattern for loading translations
  },
  react: {
    // useSuspense: false 
      // bindI18n: 'languageChanged loaded',
      // bindStore: '',

      // bindI18n: 'languageChanged loaded',
      // bindStore: 'added removed',
      // nsMode: 'default'
  }
});

export default i18n;


//https://tariqul-islam-rony.medium.com/internationalization-localization-with-react-js-65d6f6badd56