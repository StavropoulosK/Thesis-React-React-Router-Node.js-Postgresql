import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';


i18n
  .use(initReactI18next) // For React integration
  .init({
    debug:true,
    lng:"en",
    resources:{
        en:{
          translation:{
            greeting:"Hello, welcome!"
          }

        },
        fr:{

        }
    }
  });

export default i18n;