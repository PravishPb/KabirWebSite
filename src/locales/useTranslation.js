import { useApp } from '../context/AppContext';
import en from './en';
import hi from './hi';

const dictionaries = {
  EN: en,
  HI: hi,
};

export function useTranslation(componentName) {
  const { lang } = useApp();
  const dict = dictionaries[lang] || dictionaries.EN;
  
  if (!componentName) {
    return dict;
  }
  
  return dict[componentName] || dictionaries.EN[componentName] || {};
}
