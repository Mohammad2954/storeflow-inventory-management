export const paiginationFunc=(data,pattern,page)=>{
    let firstIndex= pattern*(page-1) 
    
    let lastIndex=firstIndex+pattern

    
     
    let finalData=data.slice(firstIndex,lastIndex)
    
    
    let countPage=Math.floor(data.length/pattern)<data.length?Math.floor(data.length/pattern)+1:data.length/pattern;
    countPage=Array.from({length:countPage},(_,index)=>index+1)

    
    
   return {finalData,countPage,firstIndex,
lastIndex}
    
    

}