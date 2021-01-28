export const hasSymbol = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

export const PolySymbol = (name) => 
  hasSymbol
    ? Symbol( '[vue-next-localstore]: ' + name )
    : ( '[vue-next-localstore]: ' ) + name;

export const localStoreKey = PolySymbol('localStore');
