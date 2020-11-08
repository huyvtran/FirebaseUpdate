// translate.js

import React from 'react';
import TranslateText from './TranslateText';


export function translateText(keyValue, params = {}) {
  return <TranslateText value={keyValue} params={params} />;
}



