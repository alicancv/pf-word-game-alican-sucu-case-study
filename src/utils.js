
export const shuffleString = (s) => {
    let arr = s.split('');           
    let n = arr.length;              
    
    for(let i=0 ; i<n-1 ; ++i) {
      let j = Math.floor(Math.random() * n);       
      let temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    
    s = arr.join('');                
    return s;                        
}