import data from "./data";

export const getError = (error) => {
    return error.response && error.response.data.message
      ? error.response.data.message
      : error.message;
  };

  export const toArabicNumber = (n) => {
    const txt=n+''
    const cast=['٠','١','٢','٣','٤','٥','٦','٧','٨','٩']
    let result=''
    
    for(let i=0;i<txt.length; i++){
          if(txt[i]===' '){
        result +=' '
        continue
      }
      if(txt[i]==='-'){
        result +='-'
        continue
      }
      if(txt[i]==='.'){
        result +='.'
        continue
      }
      if(txt[i]===':'){
        result +=':'
        continue
      }
      
     result +=cast[Number(txt[i]) ]
    }
    return result;
  }
  export const castNumber = (n,l,s='') => {
    const languages= data.languages.filter(x=>x.available);
    
    return s==='$'?
    languages[l].number === "English"?n +'$':toArabicNumber(n) +' دولار ':
    s==='IQD'?
    languages[l].number === "English"?n +' IQD ':toArabicNumber(n) +' دینار ':
    languages[l].number === "English"?n :toArabicNumber(n)
  }