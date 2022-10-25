export const getError = (error) => {
    return error.response && error.response.data.message
      ? error.response.data.message
      : error.message;
  };

  export const toArabicNumber = (n) => {
    console.log('nnnnnn =>',n)
    const txt=n+''
    const cast=['.','١','٢','٣','٤','٥','٦','٧','٨','٩']
    let result=''
    for(let i=0;i<txt.length; i++){
      
     result +=cast[Number(txt[i]) ]
    }
    return result;
  }